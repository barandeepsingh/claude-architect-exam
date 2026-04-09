"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getAllAnswers, getAllExams, getDomainStats, getRecentAccuracyTrend } from "@/lib/storage";
import { getWeakDomains, getAdaptiveWeights, getBlendedAccuracy } from "@/lib/adaptive";
import { DOMAINS } from "@/lib/types";
import { AlertCircle, TrendingUp, Zap, Target, Clock } from "lucide-react";
import ProgressRing from "@/components/ProgressRing";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalAnswered: 0,
    accuracy: 0,
    streak: 0,
    examReadiness: 0,
  });
  const [domainData, setDomainData] = useState<any[]>([]);
  const [weakAreas, setWeakAreas] = useState<any[]>([]);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);

    // Calculate stats
    const answers = getAllAnswers();
    const exams = getAllExams();

    const totalAnswered = answers.length;
    const correct = answers.filter(a => a.correct).length;
    const accuracy = totalAnswered > 0 ? Math.round((correct / totalAnswered) * 100) : 0;

    // Calculate streak (consecutive correct from recent)
    let streak = 0;
    for (let i = answers.length - 1; i >= 0; i--) {
      if (answers[i].correct) streak++;
      else break;
    }

    // Exam readiness score (weighted by domain performance)
    const accuracy_map = getBlendedAccuracy();
    let examReadiness = 0;
    for (const d of DOMAINS) {
      examReadiness += (accuracy_map[d.id] || 0) * d.weight;
    }
    examReadiness = Math.round(examReadiness * 100);

    setStats({ totalAnswered, accuracy, streak, examReadiness });

    // Domain performance
    const domainPerf = DOMAINS.map(d => {
      const stats = getDomainStats(d.id);
      return {
        name: d.shortName,
        accuracy: Math.round(stats.accuracy * 100),
        color: d.color,
      };
    });
    setDomainData(domainPerf);

    // Weak areas
    const weak = getWeakDomains();
    setWeakAreas(weak);

    // Recent sessions (last 5)
    const recent = exams
      .sort((a, b) => b.completedAt - a.completedAt)
      .slice(0, 5)
      .map(e => ({
        id: e.id,
        mode: e.mode,
        date: new Date(e.completedAt).toLocaleDateString(),
        score: e.score,
        accuracy: Math.round((e.correctAnswers / e.totalQuestions) * 100),
        questions: e.totalQuestions,
        passed: e.score >= 720,
      }));
    setRecentSessions(recent);
  }, []);

  if (!mounted) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome back!</h1>
        <p className="text-[#A1A5B4]">Keep pushing forward. Every question answered is progress toward certification.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="card-base p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#A1A5B4] text-sm font-medium mb-1">Total Answered</p>
              <p className="text-3xl font-bold text-white">{stats.totalAnswered}</p>
            </div>
            <TrendingUp className="text-[#D97706]" size={32} />
          </div>
        </div>

        <div className="card-base p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#A1A5B4] text-sm font-medium mb-1">Overall Accuracy</p>
              <p className="text-3xl font-bold text-white">{stats.accuracy}%</p>
            </div>
            <Target className="text-[#06B6D4]" size={32} />
          </div>
        </div>

        <div className="card-base p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#A1A5B4] text-sm font-medium mb-1">Current Streak</p>
              <p className="text-3xl font-bold text-white">{stats.streak}</p>
            </div>
            <Zap className="text-[#10B981]" size={32} />
          </div>
        </div>

        <div className="card-base p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#A1A5B4] text-sm font-medium mb-1">Exam Readiness</p>
              <p className="text-3xl font-bold text-white">{stats.examReadiness}%</p>
            </div>
            <div className="flex-shrink-0">
              <ProgressRing progress={stats.examReadiness} size={64} color="#8B5CF6" label="" />
            </div>
          </div>
        </div>
      </div>

      {/* Domain Performance & Weak Areas */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        {/* Domain Performance */}
        <div className="col-span-2 card-base p-6">
          <h2 className="text-xl font-bold text-white mb-6">Domain Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={domainData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3561" />
              <XAxis dataKey="name" stroke="#A1A5B4" />
              <YAxis stroke="#A1A5B4" />
              <Tooltip contentStyle={{ backgroundColor: "#16213e", border: "1px solid #2d3561", borderRadius: "8px" }} />
              <Bar dataKey="accuracy" radius={[8, 8, 0, 0]}>
                {domainData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weak Areas */}
        <div className="card-base p-6">
          <h2 className="text-xl font-bold text-white mb-4">Weak Areas</h2>
          {weakAreas.length > 0 ? (
            <div className="space-y-3">
              {weakAreas.map((area, idx) => (
                <div key={idx} className="p-3 bg-[#1a1a2e] rounded border border-[#2d3561]">
                  <p className="text-sm font-medium text-[#E2E8F0]">{area.name}</p>
                  <p className="text-xs text-[#D97706] font-bold">{area.accuracy}% accuracy</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#A1A5B4] text-sm">Keep practicing to identify areas for improvement!</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link href="/practice">
          <button className="w-full btn-primary py-3 text-lg font-semibold">
            Start Practice
          </button>
        </Link>
        <Link href="/exam">
          <button className="w-full btn-accent py-3 text-lg font-semibold">
            Take Mock Exam
          </button>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="card-base p-6">
        <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
        {recentSessions.length > 0 ? (
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-[#1a1a2e] rounded border border-[#2d3561]">
                <div className="flex-1">
                  <p className="font-medium text-white capitalize">{session.mode} Mode</p>
                  <p className="text-xs text-[#A1A5B4]">{session.date} · {session.questions} questions</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#D97706]">{session.score}/1000</p>
                  <p className="text-xs text-[#A1A5B4]">{session.accuracy}% accuracy</p>
                  {session.passed && <span className="text-xs text-[#10B981] font-bold">PASSED</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#A1A5B4] text-center py-8">No sessions yet. Start practicing to build your record!</p>
        )}
      </div>
    </div>
  );
}
