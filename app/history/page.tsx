"use client";

import { useEffect, useState } from "react";
import { getAllExams, deleteExam, clearAllData } from "@/lib/storage";
import { DOMAINS } from "@/lib/types";
import { Trash2, ChevronDown } from "lucide-react";

export default function HistoryPage() {
  const [mounted, setMounted] = useState(false);
  const [exams, setExams] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setMounted(true);
    const allExams = getAllExams();
    const sorted = allExams
      .sort((a, b) => b.completedAt - a.completedAt)
      .map(e => ({
        ...e,
        date: new Date(e.completedAt).toLocaleDateString(),
        time: new Date(e.completedAt).toLocaleTimeString(),
        accuracy: Math.round((e.correctAnswers / e.totalQuestions) * 100),
        passed: e.score >= 720,
      }));
    setExams(sorted);
  }, []);

  if (!mounted) return null;

  const handleDeleteExam = (id: string) => {
    deleteExam(id);
    setExams(exams.filter(e => e.id !== id));
  };

  const handleClearAll = () => {
    if (showClearConfirm) {
      clearAllData();
      setExams([]);
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white">Session History</h1>
          <p className="text-[#A1A5B4] mt-2">Track all your practice and exam sessions</p>
        </div>
        {exams.length > 0 && (
          <button
            onClick={handleClearAll}
            className={`px-6 py-2 rounded-lg font-medium transition-smooth ${
              showClearConfirm
                ? "bg-[#EF4444] text-white"
                : "btn-secondary"
            }`}
          >
            {showClearConfirm ? "Confirm Clear All?" : "Clear All Data"}
          </button>
        )}
      </div>

      {exams.length > 0 ? (
        <div className="space-y-2">
          {exams.map((exam) => (
            <div key={exam.id} className="card-base">
              <button
                onClick={() => setExpandedId(expandedId === exam.id ? null : exam.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-[#1a1a2e] transition-smooth"
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm font-bold bg-[#8B5CF6] text-white px-3 py-1 rounded-full capitalize">
                      {exam.mode} Mode
                    </span>
                    <span className="text-[#A1A5B4] text-sm">
                      {exam.date} at {exam.time}
                    </span>
                    {exam.passed && (
                      <span className="text-xs font-bold bg-[#10B981] text-white px-3 py-1 rounded-full">
                        PASSED
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[#A1A5B4] text-xs">Score</p>
                      <p className={`text-2xl font-bold ${exam.passed ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                        {exam.score}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#A1A5B4] text-xs">Accuracy</p>
                      <p className="text-2xl font-bold text-white">{exam.accuracy}%</p>
                    </div>
                    <div>
                      <p className="text-[#A1A5B4] text-xs">Questions</p>
                      <p className="text-2xl font-bold text-white">{exam.correctAnswers}/{exam.totalQuestions}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteExam(exam.id);
                    }}
                    className="p-2 text-[#A1A5B4] hover:text-[#EF4444] hover:bg-[#1a1a2e] rounded transition-smooth"
                  >
                    <Trash2 size={20} />
                  </button>
                  <ChevronDown
                    size={20}
                    className={`text-[#A1A5B4] transition-transform ${
                      expandedId === exam.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {expandedId === exam.id && (
                <div className="px-6 pb-6 border-t border-[#2d3561]">
                  <h4 className="text-lg font-bold text-white mt-6 mb-4">Domain Breakdown</h4>
                  <div className="space-y-3">
                    {exam.answers && exam.answers.length > 0 ? (
                      DOMAINS.map(domain => {
                        const domainAnswers = exam.answers.filter((a: any) => a.domain === domain.id);
                        if (domainAnswers.length === 0) return null;

                        const correct = domainAnswers.filter((a: any) => a.correct).length;
                        const accuracy = Math.round((correct / domainAnswers.length) * 100);

                        return (
                          <div key={domain.id} className="flex items-center justify-between p-3 bg-[#1a1a2e] rounded">
                            <span className="text-[#E2E8F0]">{domain.shortName}</span>
                            <div className="flex items-center gap-4">
                              <div className="w-32 bg-[#2d3561] rounded-full h-2">
                                <div
                                  className="bg-[#10B981] h-2 rounded-full"
                                  style={{ width: `${accuracy}%` }}
                                />
                              </div>
                              <span className="text-white font-bold w-16 text-right">{accuracy}%</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-[#A1A5B4] text-sm">No domain breakdown available</p>
                    )}
                  </div>

                  {exam.answers && exam.answers.length > 0 && (
                    <>
                      <h4 className="text-lg font-bold text-white mt-6 mb-4">Recent Answers</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {exam.answers.slice(0, 10).map((ans: any, idx: number) => (
                          <div
                            key={idx}
                            className={`flex items-center justify-between p-3 rounded text-sm ${
                              ans.correct ? "bg-[#10B981]/20 border border-[#10B981]/30" : "bg-[#EF4444]/20 border border-[#EF4444]/30"
                            }`}
                          >
                            <span className="text-[#E2E8F0]">Question {idx + 1}</span>
                            <span className={ans.correct ? "text-[#10B981] font-bold" : "text-[#EF4444] font-bold"}>
                              {ans.correct ? "✓ Correct" : "✗ Wrong"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card-base p-12 text-center">
          <p className="text-[#A1A5B4] text-lg">No sessions yet. Start practicing to build your history!</p>
        </div>
      )}

      {showClearConfirm && (
        <div className="mt-8 card-base p-6 bg-[#EF4444]/10 border-[#EF4444]/30">
          <p className="text-white font-bold mb-4">
            Are you sure you want to clear all data? This action cannot be undone.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setShowClearConfirm(false)}
              className="btn-secondary px-6 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleClearAll}
              className="px-6 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg font-medium transition-smooth"
            >
              Clear All Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
