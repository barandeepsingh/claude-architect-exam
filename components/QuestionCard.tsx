"use client";

import { Question } from "@/lib/types";
import { CheckCircle, XCircle } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  selectedIndex: number | null;
  submitted: boolean;
  onSelect: (index: number) => void;
  showExplanation: boolean;
}

export default function QuestionCard({
  question,
  selectedIndex,
  submitted,
  onSelect,
  showExplanation,
}: QuestionCardProps) {
  const letters = ["A", "B", "C", "D"];

  return (
    <div className="space-y-4">
      {question.options.map((option, idx) => {
        const isSelected = selectedIndex === idx;
        const isCorrect = idx === question.correctIndex;
        const isWrong = isSelected && !isCorrect && submitted;

        let buttonClass = "bg-[#2d3561] border border-[#4a5a8a] text-[#E2E8F0] hover:bg-[#3a4578]";

        if (submitted) {
          if (isCorrect) {
            buttonClass = "bg-[#10B981]/20 border border-[#10B981] text-[#E2E8F0]";
          } else if (isWrong) {
            buttonClass = "bg-[#EF4444]/20 border border-[#EF4444] text-[#E2E8F0]";
          }
        } else if (isSelected) {
          buttonClass = "bg-[#3B82F6] border border-[#60A5FA] text-white";
        }

        return (
          <button
            key={idx}
            onClick={() => !submitted && onSelect(idx)}
            disabled={submitted}
            className={`w-full p-4 rounded-lg text-left transition-smooth flex items-start gap-4 cursor-pointer ${buttonClass}`}
          >
            <span className="font-bold text-lg min-w-fit">{letters[idx]}.</span>
            <span className="flex-1">{option}</span>
            {submitted && isCorrect && <CheckCircle className="text-[#10B981] flex-shrink-0" size={20} />}
            {submitted && isWrong && <XCircle className="text-[#EF4444] flex-shrink-0" size={20} />}
          </button>
        );
      })}
    </div>
  );
}
