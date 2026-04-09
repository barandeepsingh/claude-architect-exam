"use client";

import { AnswerRecord, Domain, ExamSession } from "./types";

const KEYS = {
  answers: "cca_answers",
  exams: "cca_exams",
  settings: "cca_settings",
};

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full — prune oldest
    const answers = getAllAnswers();
    if (answers.length > 500) {
      const pruned = answers.slice(-500);
      localStorage.setItem(KEYS.answers, JSON.stringify(pruned));
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
}

// ── Answer Records ──────────────────────────────────────────
export function getAllAnswers(): AnswerRecord[] {
  return safeGet<AnswerRecord[]>(KEYS.answers, []);
}

export function saveAnswer(record: AnswerRecord) {
  const all = getAllAnswers();
  all.push(record);
  safeSet(KEYS.answers, all);
}

export function saveAnswersBatch(records: AnswerRecord[]) {
  const all = getAllAnswers();
  all.push(...records);
  safeSet(KEYS.answers, all);
}

// ── Exam Sessions ───────────────────────────────────────────
export function getAllExams(): ExamSession[] {
  return safeGet<ExamSession[]>(KEYS.exams, []);
}

export function saveExam(session: ExamSession) {
  const all = getAllExams();
  all.push(session);
  safeSet(KEYS.exams, all);
}

export function deleteExam(id: string) {
  const all = getAllExams().filter((e) => e.id !== id);
  safeSet(KEYS.exams, all);
}

// ── Analytics Helpers ───────────────────────────────────────
export function getDomainStats(domain?: Domain) {
  const answers = getAllAnswers();
  const filtered = domain ? answers.filter((a) => a.domain === domain) : answers;
  const total = filtered.length;
  const correct = filtered.filter((a) => a.correct).length;
  return {
    total,
    correct,
    accuracy: total > 0 ? correct / total : 0,
    avgTimeMs: total > 0 ? filtered.reduce((s, a) => s + a.timeSpentMs, 0) / total : 0,
  };
}

export function getDomainAccuracyMap(): Record<Domain, number> {
  const answers = getAllAnswers();
  const map: Record<string, { c: number; t: number }> = {};
  for (const a of answers) {
    if (!map[a.domain]) map[a.domain] = { c: 0, t: 0 };
    map[a.domain].t++;
    if (a.correct) map[a.domain].c++;
  }
  const result: Record<string, number> = {};
  for (const [d, v] of Object.entries(map)) {
    result[d] = v.t > 0 ? v.c / v.t : 0;
  }
  return result as Record<Domain, number>;
}

export function getRecentAccuracyTrend(days: number = 14) {
  const answers = getAllAnswers();
  const now = Date.now();
  const cutoff = now - days * 86400000;
  const recent = answers.filter((a) => a.timestamp >= cutoff);
  const byDay: Record<string, { c: number; t: number }> = {};
  for (const a of recent) {
    const day = new Date(a.timestamp).toISOString().slice(0, 10);
    if (!byDay[day]) byDay[day] = { c: 0, t: 0 };
    byDay[day].t++;
    if (a.correct) byDay[day].c++;
  }
  return Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({
      date,
      accuracy: Math.round((v.c / v.t) * 100),
      total: v.t,
      correct: v.c,
    }));
}

export function getSubdomainStats() {
  const answers = getAllAnswers();
  const map: Record<string, { domain: Domain; correct: number; total: number }> = {};
  for (const a of answers) {
    const key = a.subdomain;
    if (!map[key]) map[key] = { domain: a.domain, correct: 0, total: 0 };
    map[key].total++;
    if (a.correct) map[key].correct++;
  }
  return Object.entries(map).map(([name, v]) => ({
    name,
    domain: v.domain,
    accuracy: v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0,
    total: v.total,
    correct: v.correct,
  }));
}

export function getAnsweredQuestionIds(): Set<string> {
  return new Set(getAllAnswers().map((a) => a.questionId));
}

export function clearAllData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.answers);
  localStorage.removeItem(KEYS.exams);
}
