import { Question, Domain } from "@/lib/types";
import { domain1Questions } from "./domain1";
import { domain2Questions } from "./domain2";
import { domain3Questions } from "./domain3";
import { domain4Questions } from "./domain4";
import { domain5Questions } from "./domain5";

export const allQuestions: Question[] = [
  ...domain1Questions,
  ...domain2Questions,
  ...domain3Questions,
  ...domain4Questions,
  ...domain5Questions,
];

export function getQuestionsByDomain(domain: Domain): Question[] {
  return allQuestions.filter((q) => q.domain === domain);
}

export function getQuestionById(id: string): Question | undefined {
  return allQuestions.find((q) => q.id === id);
}

export function getRandomQuestions(count: number): Question[] {
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getQuestionsByDifficulty(difficulty: "easy" | "medium" | "hard"): Question[] {
  return allQuestions.filter((q) => q.difficulty === difficulty);
}

export const questionStats = {
  total: allQuestions.length,
  byDomain: {
    "agent-architecture": allQuestions.filter(q => q.domain === "agent-architecture").length,
    "tool-design-mcp": allQuestions.filter(q => q.domain === "tool-design-mcp").length,
    "claude-code": allQuestions.filter(q => q.domain === "claude-code").length,
    "prompt-engineering": allQuestions.filter(q => q.domain === "prompt-engineering").length,
    "context-management": allQuestions.filter(q => q.domain === "context-management").length,
  },
};
