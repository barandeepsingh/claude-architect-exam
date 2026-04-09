"use client";

import { useEffect, useState } from "react";
import { Clock, AlertCircle } from "lucide-react";

interface TimerProps {
  totalSeconds: number;
  onExpire: () => void;
  running: boolean;
}

export default function Timer({ totalSeconds, onExpire, running }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    if (!running) return;

    if (secondsLeft <= 0) {
      onExpire();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, running, onExpire]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isLowTime = secondsLeft < 300; // 5 minutes
  const isCritical = secondsLeft < 60; // 1 minute

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold transition-smooth ${
        isCritical
          ? "bg-[#EF4444] text-white animate-pulse"
          : isLowTime
          ? "bg-[#F59E0B] text-white"
          : "bg-[#2d3561] text-[#E2E8F0]"
      }`}
    >
      {isCritical ? (
        <AlertCircle size={20} />
      ) : (
        <Clock size={20} />
      )}
      <span>
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
