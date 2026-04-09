"use client";

import { Question } from "@/lib/types";
import { DOMAINS } from "@/lib/types";
import { CheckCircle, XCircle } from "lucide-react";

interface ExplanationPanelProps {
  question: Question;
  selectedIndex: number;
}

export default function ExplanationPanel({
  question,
  selectedIndex,
}: ExplanationPanelProps) {
  const isCorrect = selectedIndex === question.correctIndex;
  const domainConfig = DOMAINS.find(d => d.id === question.domain);
  const letters = ["A", "B", "C", "D"];

  return (
    <div
      className={`p-6 rounded-lg border ${
        isCorrect
          ? "bg-[#10B981]/10 border-[#10B981]/30"
          : "bg-[#EF4444]/10 border-[#EF4444]/30"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {isCorrect ? (
          <>
            <CheckCircle className="text-[#10B981]" size={24} />
            <h3 className="text-lg font-bold text-[#10B981]">Correct Answer!</h3>
          </>
        ) : (
          <>
            <XCircle className="text-[#EF4444]" size={24} />
            <h3 className="text-lg font-bold text-[#EF4444]">Incorrect</h3>
          </>
        )}
      </div>

      {/* Correct Answer */}
      <div className="mb-6 p-4 bg-[#1a1a2e] rounded border border-[#2d3561]">
        <p className="text-xs text-[#A1A5B4] mb-2 font-bold">CORRECT ANSWER</p>
        <p className="text-white">
          <span className="font-bold">{letters[question.correctIndex]}.</span>{" "}
          {question.options[question.correctIndex]}
        </p>
      </div>

      {/* Explanation */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-white mb-2">Why?</h4>
        <p className="text-[#E2E8F0] text-sm leading-relaxed">{question.explanation}</p>
      </div>

      {/* Key Takeaway */}
      <div className="p-4 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 rounded">
        <p className="text-xs text-[#A1A5B4] mb-1 font-bold">KEY TAKEAWAY</p>
        <p className="text-[#E2E8F0] text-sm">{question.keyTakeaway}</p>
      </div>

      {/* Domain & Subdomain Tags */}
      <div className="flex gap-2 mt-6">
        <span className="text-xs font-bold bg-[#8B5CF6] text-white px-3 py-1 rounded-full">
          {domainConfig?.shortName}
        </span>
        <span className="text-xs font-bold bg-[#06B6D4] text-white px-3 py-1 rounded-full">
          {question.subdomain}
        </span>
      </div>
    </div>
  );
}
