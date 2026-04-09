"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { selectAdaptiveQuestions } from "@/lib/adaptive";
import { saveAnswer, saveAnswersBatch } from "@/lib/storage";
import { Question, DOMAINS } from "@/lib/types";
import { allQuestions } from "@/data/index";
import QuestionCard from "@/components/QuestionCard";
import ExplanationPanel from "@/components/ExplanationPanel";
import { ChevronRight, RotateCw } from "lucide-react";

export default function PracticePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [sessionAnswers, setSessionAnswers] = useState<any[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [showSummary, setShowSummary] = useState(false);
  const [sessionStartTime] = useState(Date.now());

  useEffect(() => {
    setMounted(true);
    const qs = selectAdaptiveQuestions(allQuestions, 20, "practice");
    setQuestions(qs);
  }, []);

  if (!mounted) return null;

  const filteredQuestions =
    selectedDomain === "all"
      ? questions
      : questions.filter(q => q.domain === selectedDomain);

  const currentQuestion = filteredQuestions[currentIndex];

  const handleSelectAnswer = (idx: number) => {
    if (!submitted) {
      setSelectedAnswer(idx);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctIndex;
    setSessionAnswers([
      ...sessionAnswers,
      {
        questionId: currentQuestion.id,
        correct: isCorrect,
        selectedIndex: selectedAnswer,
        correctIndex: currentQuestion.correctIndex,
      },
    ]);

    setSubmitted(true);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 >= filteredQuestions.length) {
      setShowSummary(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setSubmitted(false);
      setShowExplanation(false);
    }
  };

  const handlePracticeAgain = () => {
    // Save all answers
    const answersToSave = sessionAnswers.map((ans) => {
      const q = questions.find(q => q.id === ans.questionId)!;
      return {
        questionId: ans.questionId,
        domain: q.domain,
        subdomain: q.subdomain,
        difficulty: q.difficulty,
        correct: ans.correct,
        selectedIndex: ans.selectedIndex,
        correctIndex: ans.correctIndex,
        timeSpentMs: Math.random() * 30000 + 10000, // Mock time
        timestamp: Date.now(),
      };
    });

    saveAnswersBatch(answersToSave);
    router.push("/");
  };

  // Calculate summary stats
  const totalQuestions = filteredQuestions.length;
  const answered = sessionAnswers.length;
  const correct = sessionAnswers.filter(a => a.correct).length;
  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;

  if (showSummary) {
    // Domain breakdown
    const domainBreakdown = DOMAINS.map(d => {
      const domainAnswers = sessionAnswers.filter(a => {
        const q = questions.find(q => q.id === a.questionId);
        return q?.domain === d.id;
      });
      const domainCorrect = domainAnswers.filter(a => a.correct).length;
      return {
        domain: d.shortName,
        correct: domainCorrect,
        total: domainAnswers.length,
        accuracy: domainAnswers.length > 0 ? Math.round((domainCorrect / domainAnswers.length) * 100) : 0,
      };
    }).filter(x => x.total > 0);

    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="card-base p-8 text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Practice Session Complete!</h1>
          <p className="text-[#A1A5B4] mb-8">Great effort. Review your performance below.</p>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div>
              <p className="text-5xl font-bold text-[#D97706]">{correct}</p>
              <p className="text-[#A1A5B4] mt-2">Correct Answers</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-white">{accuracy}%</p>
              <p className="text-[#A1A5B4] mt-2">Accuracy</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-[#06B6D4]">{answered}/{totalQuestions}</p>
              <p className="text-[#A1A5B4] mt-2">Questions Answered</p>
            </div>
          </div>

          <div className="bg-[#1a1a2e] rounded p-6 mb-8">
            <h3 className="text-lg font-bold text-white mb-4">Domain Breakdown</h3>
            <div className="space-y-3">
              {domainBreakdown.map((item, idx) => (
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
              onClick={handlePracticeAgain}
              className="btn-primary flex-1 py-3 font-semibold flex items-center justify-center gap-2"
            >
              <RotateCw size={20} />
              Practice Again
            </button>
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
    <div className="p-8 max-w-4xl mx-auto">
      {/* Domain Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => {
            setSelectedDomain("all");
            setCurrentIndex(0);
            setSelectedAnswer(null);
            setSubmitted(false);
            setShowExplanation(false);
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth ${
            selectedDomain === "all"
              ? "bg-[#D97706] text-white"
              : "bg-[#2d3561] text-[#E2E8F0] hover:bg-[#3a4578]"
          }`}
        >
          All Domains
        </button>
        {DOMAINS.map(d => (
          <button
            key={d.id}
            onClick={() => {
              setSelectedDomain(d.id);
              setCurrentIndex(0);
              setSelectedAnswer(null);
              setSubmitted(false);
              setShowExplanation(false);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth ${
              selectedDomain === d.id
                ? "bg-[#8B5CF6] text-white"
                : "bg-[#2d3561] text-[#E2E8F0] hover:bg-[#3a4578]"
            }`}
          >
            {d.shortName}
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <p className="text-sm font-medium text-[#A1A5B4]">
            Question {currentIndex + 1} of {filteredQuestions.length}
          </p>
          <p className="text-sm font-medium text-[#A1A5B4]">
            {answered}/{totalQuestions} answered
          </p>
        </div>
        <div className="w-full bg-[#2d3561] rounded-full h-2">
          <div
            className="bg-[#D97706] h-2 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
          />
        </div>
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
          selectedIndex={selectedAnswer}
          submitted={submitted}
          onSelect={handleSelectAnswer}
          showExplanation={false}
        />

        {showExplanation && (
          <div className="mt-8">
            <ExplanationPanel question={currentQuestion} selectedIndex={selectedAnswer!} />
          </div>
        )}

        <div className="flex gap-4 mt-8">
          {!submitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className={`flex-1 py-3 rounded-lg font-semibold transition-smooth ${
                selectedAnswer === null
                  ? "bg-[#2d3561] text-[#A1A5B4] cursor-not-allowed"
                  : "btn-primary"
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="flex-1 btn-accent py-3 font-semibold flex items-center justify-center gap-2"
            >
              Next Question
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
