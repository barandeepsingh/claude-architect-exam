import { Question, Domain, DOMAINS, EXAM_CONFIG } from "./types";
import { getDomainAccuracyMap, getAnsweredQuestionIds, getAllAnswers } from "./storage";

/**
 * Adaptive Question Selection Algorithm
 *
 * Combines exam domain weights with performance-based boosting:
 * - Domains where the user is weaker get more questions
 * - New/unseen questions are prioritized over repeated ones
 * - Difficulty ramps up as accuracy improves
 * - Recent mistakes are weighted more heavily
 */

const BOOST_FACTOR = 1.5; // How aggressively to boost weak domains
const RECENCY_WEIGHT = 0.7; // Weight for recent (last 50) answers vs all-time
const UNSEEN_BOOST = 2.0; // Multiplier for never-answered questions

function getRecentDomainAccuracy(): Record<Domain, number> {
  const answers = getAllAnswers();
  const recent = answers.slice(-50);
  const map: Record<string, { c: number; t: number }> = {};
  for (const a of recent) {
    if (!map[a.domain]) map[a.domain] = { c: 0, t: 0 };
    map[a.domain].t++;
    if (a.correct) map[a.domain].c++;
  }
  const result: Record<string, number> = {};
  for (const d of DOMAINS) {
    const v = map[d.id];
    result[d.id] = v && v.t > 0 ? v.c / v.t : 0.5; // default 50% if no data
  }
  return result as Record<Domain, number>;
}

export function getBlendedAccuracy(): Record<Domain, number> {
  const allTime = getDomainAccuracyMap();
  const recent = getRecentDomainAccuracy();
  const result: Record<string, number> = {};
  for (const d of DOMAINS) {
    const a = allTime[d.id] ?? 0.5;
    const r = recent[d.id] ?? 0.5;
    result[d.id] = RECENCY_WEIGHT * r + (1 - RECENCY_WEIGHT) * a;
  }
  return result as Record<Domain, number>;
}

export function getAdaptiveWeights(): Record<Domain, number> {
  const accuracy = getBlendedAccuracy();
  const raw: Record<string, number> = {};
  let total = 0;

  for (const d of DOMAINS) {
    const acc = accuracy[d.id] ?? 0.5;
    // Boost weak domains: weight * (1 + (1 - accuracy) * boost)
    const adjusted = d.weight * (1 + (1 - acc) * BOOST_FACTOR);
    raw[d.id] = adjusted;
    total += adjusted;
  }

  // Normalize
  const result: Record<string, number> = {};
  for (const d of DOMAINS) {
    result[d.id] = raw[d.id] / total;
  }
  return result as Record<Domain, number>;
}

export function selectAdaptiveQuestions(
  allQuestions: Question[],
  count: number,
  mode: "practice" | "exam" = "practice"
): Question[] {
  const weights = mode === "exam"
    ? Object.fromEntries(DOMAINS.map((d) => [d.id, d.weight])) as Record<Domain, number>
    : getAdaptiveWeights();

  const seen = getAnsweredQuestionIds();
  const answers = getAllAnswers();

  // Build per-question score map (for recently wrong questions)
  const recentWrong = new Set<string>();
  for (const a of answers.slice(-100)) {
    if (!a.correct) recentWrong.add(a.questionId);
  }

  // Determine difficulty preference per domain
  const accuracy = getBlendedAccuracy();
  const difficultyPref: Record<Domain, string> = {} as Record<Domain, string>;
  for (const d of DOMAINS) {
    const acc = accuracy[d.id] ?? 0.5;
    if (acc < 0.5) difficultyPref[d.id] = "easy";
    else if (acc < 0.75) difficultyPref[d.id] = "medium";
    else difficultyPref[d.id] = "hard";
  }

  // Allocate per-domain counts
  const domainCounts: Record<Domain, number> = {} as Record<Domain, number>;
  let allocated = 0;
  const sortedDomains = [...DOMAINS].sort((a, b) => (weights[b.id] ?? 0) - (weights[a.id] ?? 0));

  for (const d of sortedDomains) {
    const c = Math.round(count * (weights[d.id] ?? 0));
    domainCounts[d.id] = c;
    allocated += c;
  }
  // Fix rounding
  if (allocated < count) domainCounts[sortedDomains[0].id] += count - allocated;
  if (allocated > count) domainCounts[sortedDomains[sortedDomains.length - 1].id] -= allocated - count;

  // Select questions per domain
  const selected: Question[] = [];

  for (const d of DOMAINS) {
    const needed = domainCounts[d.id] || 0;
    if (needed <= 0) continue;

    const pool = allQuestions.filter((q) => q.domain === d.id);
    if (pool.length === 0) continue;

    // Score each question
    const scored = pool.map((q) => {
      let score = 1;
      // Boost unseen
      if (!seen.has(q.id)) score *= UNSEEN_BOOST;
      // Boost recently wrong
      if (recentWrong.has(q.id)) score *= 1.8;
      // Boost preferred difficulty
      if (q.difficulty === difficultyPref[d.id]) score *= 1.3;
      // Add randomness
      score *= 0.5 + Math.random();
      return { q, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const picked = scored.slice(0, needed).map((s) => s.q);
    selected.push(...picked);
  }

  // Shuffle final selection
  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }

  return selected;
}

export function selectExamQuestions(allQuestions: Question[]): Question[] {
  return selectAdaptiveQuestions(allQuestions, EXAM_CONFIG.totalQuestions, "exam");
}

export function getWeakDomains(): { domain: Domain; name: string; accuracy: number }[] {
  const accuracy = getBlendedAccuracy();
  return DOMAINS.map((d) => ({
    domain: d.id,
    name: d.shortName,
    accuracy: Math.round((accuracy[d.id] ?? 0.5) * 100),
  }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);
}

export function computeExamScore(correct: number, total: number): number {
  const { minScore, maxScore } = EXAM_CONFIG;
  const ratio = total > 0 ? correct / total : 0;
  return Math.round(minScore + ratio * (maxScore - minScore));
}
