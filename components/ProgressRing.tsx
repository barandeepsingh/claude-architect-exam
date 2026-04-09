"use client";

interface ProgressRingProps {
  progress: number; // 0-100
  size: number;
  color: string;
  label: string;
}

export default function ProgressRing({
  progress,
  size,
  color,
  label,
}: ProgressRingProps) {
  const circumference = 2 * Math.PI * (size / 2 - 4);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 4}
          fill="none"
          stroke="#2d3561"
          strokeWidth="4"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 4}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      {label && <p className="text-xs text-[#A1A5B4] mt-2">{label}</p>}
    </div>
  );
}
