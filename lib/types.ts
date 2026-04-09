export type Domain =
  | "agent-architecture"
  | "tool-design-mcp"
  | "claude-code"
  | "prompt-engineering"
  | "context-management";

export type Difficulty = "easy" | "medium" | "hard";

export type Subdomain = string;

export interface Question {
  id: string;
  domain: Domain;
  subdomain: Subdomain;
  difficulty: Difficulty;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0-3
  explanation: string;
  keyTakeaway: string;
}

export interface AnswerRecord {
  questionId: string;
  domain: Domain;
  subdomain: Subdomain;
  difficulty: Difficulty;
  correct: boolean;
  selectedIndex: number;
  correctIndex: number;
  timeSpentMs: number;
  timestamp: number;
}

export interface ExamSession {
  id: string;
  mode: "practice" | "exam";
  startedAt: number;
  completedAt: number;
  totalQuestions: number;
  correctAnswers: number;
  score: number; // 0-1000 scaled
  answers: AnswerRecord[];
  domainScores: Record<Domain, { correct: number; total: number; pct: number }>;
}

export interface DomainConfig {
  id: Domain;
  name: string;
  shortName: string;
  weight: number; // exam weight as decimal
  color: string;
  icon: string;
}

export const DOMAINS: DomainConfig[] = [
  { id: "agent-architecture", name: "Agent Architecture & Orchestration", shortName: "Agent Arch", weight: 0.27, color: "#3B82F6", icon: "🏗️" },
  { id: "tool-design-mcp", name: "Tool Design & MCP Integration", shortName: "Tool/MCP", weight: 0.18, color: "#8B5CF6", icon: "🔧" },
  { id: "claude-code", name: "Claude Code Configuration & Workflows", shortName: "Claude Code", weight: 0.20, color: "#06B6D4", icon: "⚙️" },
  { id: "prompt-engineering", name: "Prompt Engineering & Structured Output", shortName: "Prompt Eng", weight: 0.20, color: "#F59E0B", icon: "✍️" },
  { id: "context-management", name: "Context Management & Reliability", shortName: "Context Mgmt", weight: 0.15, color: "#10B981", icon: "🧠" },
];

export const EXAM_CONFIG = {
  totalQuestions: 60,
  passingScore: 720,
  maxScore: 1000,
  minScore: 100,
  timeLimitMinutes: 90,
  scenarioCount: 4,
  totalScenarios: 6,
};

export const SCENARIOS = [
  { id: 1, name: "Customer Support Agent", desc: "MCP tools for returns/billing with 80%+ first-contact resolution" },
  { id: 2, name: "Code Generation with Claude Code", desc: "Planning mode, CLAUDE.md, slash commands for acceleration" },
  { id: 3, name: "Multi-Agent Research System", desc: "Coordinator delegates to search, analysis, synthesis subagents" },
  { id: 4, name: "Developer Productivity Tools", desc: "Exploratory codebase navigation and boilerplate generation" },
  { id: 5, name: "Claude Code for CI/CD", desc: "Automated code reviews and test generation in pipelines" },
  { id: 6, name: "Structured Data Extraction", desc: "JSON schemas with validation and edge-case handling" },
];
