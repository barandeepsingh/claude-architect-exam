"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { selectExamQuestions } from "@/lib/adaptive";
import { saveExam, saveAnswersBatch } from "@/lib/storage";
import { computeExamScore } from "@/lib/adaptive";
import { Question, DOMAINS, EXAM_CONFIG, SCENARIOS } from "@/lib/types";
import { allQuestions } from "@/data/index";
import QuestionCard from "@/components/QuestionCard";
import Timer from "@/components/Timer";
import { Flag, ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react";

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function ExamPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"pre" | "during" | "results">("pre");
  const [mounted, setMounted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timerExpired, setTimerExpired] = useState(false);
  const [selectedScenarios, setSelectedScenarios] = useState<any[]>([]);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    // Select random scenarios
    const shuffled = [...SCENARIOS].sort(() => Math.random() - 0.5);
    setSelectedScenarios(shuffled.slice(0, EXAM_CONFIG.scenarioCount));

    // Select exam questions
    const qs = selectExamQuestions(allQuestions);
    setQuestions(qs);
  }, []);

  if (!mounted) return null;

  if (phase === "pre") {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="card-base p-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Claude Certified Architect Exam</h1>
          <p className="text-[#A1A5B4]">You're about to take the mock exam. Good luck!</p>
        </div>

        <div className="card-base p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Exam Format</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-3xl font-bold text-[#D97706]">{EXAM_CONFIG.totalQuestions}</div>
              <div>
                <p className="font-bold text-white">Multiple Choice Questions</p>
                <p className="text-[#A1A5B4]">4 options per question</p>
              </div>
            </div>
            <div className="border-t border-[#2d3561] pt-4 flex gap-4">
              <div className="text-3xl font-bold text-[#06B6D4]">{EXAM_CONFIG.timeLimitMinutes}</div>
              <div>
                <p className="font-bold text-white">Minutes</p>
                <p className="text-[#A1A5B4]">Timed exam</p>
              </div>
            </div>
            <div className="border-t border-[#2d3561] pt-4 flex gap-4">
              <div className="text-3xl font-bold text-[#10B981]">{EXAM_CONFIG.passingScore}</div>
              <div>
                <p className="font-bold text-white">Passing Score</p>
                <p className="text-[#A1A5B4]">Out of 1000</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card-base p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Selected Scenarios</h2>
          <div className="space-y-3">
            {selectedScenarios.map((s, idx) => (
              <div key={idx} className="p-4 bg-[#1a1a2e] rounded border border-[#2d3561]">
                <p className="font-bold text-white">{s.name}</p>
                <p className="text-sm text-[#A1A5B4]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setPhase("during")}
          className="w-full btn-primary py-4 text-lg font-bold"
        >
          Start Exam
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answered = Object.keys(selectedAnswers).length;
  const correctCount = Object.entries(selectedAnswers).filter(([idx, ans]) => {
    const q = questions[parseInt(idx)];
    return q && ans === q.correctIndex;
  }).length;

  if (phase === "results") {
    const score = computeExamScore(correctCount, questions.length);
    const passed = score >= EXAM_CONFIG.passingScore;
    const accuracy = Math.round((correctCount / questions.length) * 100);

    // Domain breakdown
    const domainStats = DOMAINS.map(d => {
      const domainQs = questions.filter(q => q.domain === d.id);
      const correct = domainQs.filter((_, idx) => selectedAnswers[idx] === questions[idx].correctIndex).length;
      return {
        domain: d.shortName,
        correct,
        total: domainQs.length,
        accuracy: domainQs.length > 0 ? Math.round((correct / domainQs.length) * 100) : 0,
      };
    }).filter(x => x.total > 0);

    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="card-base p-8 text-center mb-8">
          <div className="mb-6">
            {passed ? (
              <CheckCircle className="mx-auto text-[#10B981]" size={64} />
            ) : (
              <XCircle className="mx-auto text-[#EF4444]" size={64} />
            )}
          </div>

          <h1 className="text-4xl font-bold text-white mb-2">
            {passed ? "Exam Passed!" : "Exam Did Not Pass"}
          </h1>
          <p className="text-[#A1A5B4] mb-8">
            {passed
              ? "Congratulations! You've passed the certification exam."
              : "Review your weak areas and practice more to improve your score."}
          </p>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div>
              <p className="text-5xl font-bold text-[#D97706]">{score}</p>
              <p className="text-[#A1A5B4] mt-2">Final Score</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-white">{accuracy}%</p>
              <p className="text-[#A1A5B4] mt-2">Accuracy</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-[#06B6D4]">{correctCount}/{questions.length}</p>
              <p className="text-[#A1A5B4] mt-2">Correct</p>
            </div>
          </div>

          <div className="bg-[#1a1a2e] rounded p-6 mb-8">
            <h3 className="text-lg font-bold text-white mb-4">Domain Breakdown</h3>
            <div className="space-y-3">
              {domainStats.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-[#E2E8F0]">{item.domain}</span>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-[#2d3561] rounded-full h-2">
                      <div
                        className="bg-[#10B981] h-2 rounded-full"
                        style={{ width: `${item.accuracy}%` }}
                      />
                    </div>
                    <span className="text-white font-bold w-16 text-right">{item.accuracy}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => router.push("/")}
              className="btn-secondary flex-1 py-3 font-semibold"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 p-8">
      {/* Main Content */}
      <div className="flex-1">
        {/* Timer Header */}
        <div className="card-base p-4 mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Question {currentIndex + 1} of {questions.length}</h2>
          <Timer
            totalSeconds={EXAM_CONFIG.timeLimitMinutes * 60}
            onExpire={() => {
              setTimerExpired(true);
              setPhase("results");
              // Save exam
              const answers = questions.map((q, idx) => ({
                questionId: q.id,
                domain: q.domain,
                subdomain: q.subdomain,
                difficulty: q.difficulty,
                correct: selectedAnswers[idx] === q.correctIndex,
                selectedIndex: selectedAnswers[idx] ?? -1,
                correctIndex: q.correctIndex,
                timeSpentMs: Math.random() * 30000 + 10000,
                timestamp: Date.now(),
              }));
              saveAnswersBatch(answers);
              const exam = {
                id: generateUUID(),
                mode: "exam" as const,
                startedAt: Date.now(),
                completedAt: Date.now(),
                totalQuestions: questions.length,
                correctAnswers: correctCount,
                score: computeExamScore(correctCount, questions.length),
                answers,
                domainScores: {} as any,
              };
              saveExam(exam);
            }}
            running={phase === "during"}
          />
        </div>

        {/* Question Card */}
        <div className="card-base p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-bold bg-[#8B5CF6] text-white px-3 py-1 rounded-full">
              {DOMAINS.find(d => d.id === currentQuestion.domain)?.shortName}
            </span>
            <span className="text-xs font-bold bg-[#2d3561] text-[#E2E8F0] px-3 py-1 rounded-full capitalize">
              {currentQuestion.difficulty}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-8">{currentQuestion.question}</h2>

          <QuestionCard
            question={currentQuestion}
            selectedIndex={selectedAnswers[currentIndex] ?? null}
            submitted={false}
            onSelect={(idx) => {
              const newAnswers = { ...selectedAnswers };
              newAnswers[currentIndex] = idx;
              setSelectedAnswers(newAnswers);
            }}
            showExplanation={false}
          />

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className={`px-6 py-3 rounded-lg font-semibold transition-smooth flex items-center gap-2 ${
                currentIndex === 0
                  ? "bg-[#2d3561] text-[#A1A5B4] cursor-not-allowed"
                  : "btn-secondary"
              }`}
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            <button
              onClick={() => {
                setFlagged(prev => {
                  const newSet = new Set(prev);
                  if (newSet.has(currentIndex)) {
                    newSet.delete(currentIndex);
                  } else {
                    newSet.add(currentIndex);
                  }
                  return newSet;
                });
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-smooth flex items-center gap-2 ${
                flagged.has(currentIndex)
                  ? "bg-[#D97706] text-white"
                  : "btn-secondary"
              }`}
            >
              <Flag size={20} />
              {flagged.has(currentIndex) ? "Flagged" : "Flag"}
            </button>
            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="flex-1 btn-primary py-3 font-semibold flex items-center justify-center gap-2"
              >
                Next
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={() => {
                  setPhase("results");
                  // Save exam
                  const answers = questions.map((q, idx) => ({
                    questionId: q.id,
                    domain: q.domain,
                    subdomain: q.subdomain,
                    difficulty: q.difficulty,
                    correct: selectedAnswers[idx] === q.correctIndex,
                    selectedIndex: selectedAnswers[idx] ?? -1,
                    correctIndex: q.correctIndex,
                    timeSpentMs: Math.random() * 30000 + 10000,
                    timestamp: Date.now(),
                  }));
                  saveAnswersBatch(answers);
                  const exam = {
                    id: generateUUID(),
                    mode: "exam" as const,
                    startedAt: Date.now(),
                    completedAt: Date.now(),
                    totalQuestions: questions.length,
                    correctAnswers: correctCount,
                    score: computeExamScore(correctCount, questions.length),
                    answers,
                    domainScores: {} as any,
                  };
                  saveExam(exam);
                }}
                className="flex-1 btn-accent py-3 font-semibold"
              >
                Submit Exam
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Question Navigator Sidebar */}
      <div className="w-64 card-base p-6 h-fit sticky top-8">
        <h3 className="font-bold text-white mb-4">Question Navigator</h3>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-10 h-10 rounded-lg font-semibold transition-smooth flex items-center justify-center text-xs ${
                idx === currentIndex
                  ? "bg-[#D97706] text-white ring-2 ring-[#F59E0B]"
                  : selectedAnswers[idx] !== undefined
                  ? flagged.has(idx)
                    ? "bg-[#F59E0B] text-white"
                    : "bg-[#8B5CF6] text-white"
                  : "bg-[#2d3561] text-[#A1A5B4]"
              }`}
              title={`Question ${idx + 1}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-[#2d3561] space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#8B5CF6]" />
            <span className="text-xs text-[#A1A5B4]">Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#F59E0B]" />
            <span className="text-xs text-[#A1A5B4]">Flagged</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#2d3561]" />
            <span className="text-xs text-[#A1A5B4]">Unanswered</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[#2d3561]">
          <p className="text-xs text-[#A1A5B4] mb-2">Progress</p>
          <p className="text-sm font-bold text-white">{answered}/{questions.length} answered</p>
        </div>
      </div>
    </div>
  );
}
