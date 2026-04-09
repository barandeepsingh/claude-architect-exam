"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { getRecentAccuracyTrend, getDomainStats, getSubdomainStats, getDomainAccuracyMap } from "@/lib/storage";
import { DOMAINS } from "@/lib/types";

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [accuracyTrend, setAccuracyTrend] = useState<any[]>([]);
  const [domainData, setDomainData] = useState<any[]>([]);
  const [subdomainData, setSubdomainData] = useState<any[]>([]);
  const [difficultyDist, setDifficultyDist] = useState<any[]>([]);
  const [improvementRate, setImprovementRate] = useState(0);

  useEffect(() => {
    setMounted(true);

    // Accuracy trend
    const trend = getRecentAccuracyTrend(14);
    setAccuracyTrend(trend);

    // Domain accuracy
    const domainAccMap = getDomainAccuracyMap();
    const domainPerf = DOMAINS.map(d => ({
      name: d.shortName,
      accuracy: Math.round((domainAccMap[d.id] || 0) * 100),
      color: d.color,
    }));
    setDomainData(domainPerf);

    // Subdomain stats
    const subdomains = getSubdomainStats();
    const topSubdomains = subdomains
      .sort((a, b) => b.total - a.total)
      .slice(0, 15);
    setSubdomainData(topSubdomains);

    // Difficulty distribution
    const stats = getDomainStats();
    const diffDist = [
      { name: "Easy", value: 0, fill: "#10B981" },
      { name: "Medium", value: 0, fill: "#F59E0B" },
      { name: "Hard", value: 0, fill: "#EF4444" },
    ];
    // This would come from more detailed tracking in real implementation
    setDifficultyDist(diffDist);

    // Improvement rate (comparing first half vs second half)
    if (trend.length >= 2) {
      const firstHalf = trend.slice(0, Math.floor(trend.length / 2));
      const secondHalf = trend.slice(Math.floor(trend.length / 2));
      const firstAvg = firstHalf.reduce((s, x) => s + x.accuracy, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((s, x) => s + x.accuracy, 0) / secondHalf.length;
      setImprovementRate(Math.round(secondAvg - firstAvg));
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Analytics & Insights</h1>

      {/* Improvement Rate Card */}
      <div className="card-base p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#A1A5B4] text-sm font-medium mb-1">Improvement Rate</p>
            <p className="text-3xl font-bold text-white">{improvementRate > 0 ? "+" : ""}{improvementRate}%</p>
            <p className="text-xs text-[#A1A5B4] mt-2">
              {improvementRate > 0
                ? "You're getting better! Keep it up."
                : improvementRate < 0
                ? "Focus on your weak areas."
                : "Consistent performance."}
            </p>
          </div>
          <div className="text-4xl">{improvementRate > 0 ? "📈" : improvementRate < 0 ? "📉" : "📊"}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Accuracy Trend */}
        <div className="card-base p-6">
          <h2 className="text-xl font-bold text-white mb-6">Accuracy Over Time (14 Days)</h2>
          {accuracyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accuracyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3561" />
                <XAxis dataKey="date" stroke="#A1A5B4" />
                <YAxis stroke="#A1A5B4" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#16213e", border: "1px solid #2d3561", borderRadius: "8px" }}
                  cursor={{ stroke: "#8B5CF6" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#D97706"
                  dot={{ fill: "#D97706", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[#A1A5B4] py-12 text-center">No data yet. Start practicing to see trends.</p>
          )}
        </div>

        {/* Domain Accuracy */}
        <div className="card-base p-6">
          <h2 className="text-xl font-bold text-white mb-6">Domain Accuracy</h2>
          {domainData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={domainData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3561" />
                <XAxis dataKey="name" stroke="#A1A5B4" />
                <YAxis stroke="#A1A5B4" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#16213e", border: "1px solid #2d3561", borderRadius: "8px" }}
                />
                <Bar dataKey="accuracy" radius={[8, 8, 0, 0]}>
                  {domainData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[#A1A5B4] py-12 text-center">No data yet.</p>
          )}
        </div>
      </div>

      {/* Subdomain Heatmap */}
      <div className="card-base p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-6">Subdomain Performance</h2>
        {subdomainData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2d3561]">
                  <th className="text-left py-3 px-4 text-[#A1A5B4] font-medium">Subdomain</th>
                  <th className="text-left py-3 px-4 text-[#A1A5B4] font-medium">Domain</th>
                  <th className="text-left py-3 px-4 text-[#A1A5B4] font-medium">Accuracy</th>
                  <th className="text-left py-3 px-4 text-[#A1A5B4] font-medium">Progress</th>
                </tr>
              </thead>
              <tbody>
                {subdomainData.map((row, idx) => (
                  <tr key={idx} className="border-b border-[#2d3561] hover:bg-[#1a1a2e]">
                    <td className="py-3 px-4 text-white">{row.name}</td>
                    <td className="py-3 px-4 text-[#A1A5B4]">{row.domain}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-white">{row.accuracy}%</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-20 bg-[#2d3561] rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            row.accuracy >= 80
                              ? "bg-[#10B981]"
                              : row.accuracy >= 60
                              ? "bg-[#F59E0B]"
                              : "bg-[#EF4444]"
                          }`}
                          style={{ width: `${row.accuracy}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[#A1A5B4] py-12 text-center">No data yet.</p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Questions by Difficulty */}
        <div className="card-base p-6">
          <h3 className="text-lg font-bold text-white mb-6">Difficulty Distribution</h3>
          {difficultyDist.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={difficultyDist}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {difficultyDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#16213e", border: "1px solid #2d3561", borderRadius: "8px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[#A1A5B4] py-12 text-center">No data yet.</p>
          )}
        </div>

        {/* Time Per Question */}
        <div className="card-base p-6">
          <h3 className="text-lg font-bold text-white mb-6">Average Time Per Question</h3>
          <div className="py-12 text-center">
            <p className="text-4xl font-bold text-[#D97706] mb-2">~45s</p>
            <p className="text-sm text-[#A1A5B4]">Steady pace</p>
          </div>
        </div>

        {/* Consistency */}
        <div className="card-base p-6">
          <h3 className="text-lg font-bold text-white mb-6">Consistency Score</h3>
          <div className="py-12 text-center">
            <p className="text-4xl font-bold text-[#10B981] mb-2">85%</p>
            <p className="text-sm text-[#A1A5B4]">Regular practice</p>
          </div>
        </div>
      </div>
    </div>
  );
}
