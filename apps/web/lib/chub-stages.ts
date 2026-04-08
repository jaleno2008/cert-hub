export type ChubStageKey = "clarify" | "highlight" | "unblock" | "bid-ready";

export type ChubStageDefinition = {
  key: ChubStageKey;
  letter: "C" | "H" | "U" | "B";
  name: string;
  question: string;
  summary: string;
};

export const CHUB_STAGES: readonly ChubStageDefinition[] = [
  {
    key: "clarify",
    letter: "C",
    name: "Clarify",
    question: "Who are you, what do you sell, and where do certifications actually help you?",
    summary:
      "Use this stage to figure out the business basics, the right certification direction, and the answers that should guide the rest of the flow.",
  },
  {
    key: "highlight",
    letter: "H",
    name: "Highlight",
    question: "How do you present your strengths so buyers and agencies take you seriously?",
    summary:
      "Use this stage to package your business clearly, especially your capability statement, differentiators, and proof points.",
  },
  {
    key: "unblock",
    letter: "U",
    name: "Unblock",
    question: "What is in your way, and how do we clear it?",
    summary:
      "Use this stage to spot missing documents, process gaps, and misunderstandings before they waste time or create embarrassment later.",
  },
  {
    key: "bid-ready",
    letter: "B",
    name: "Bid-Ready",
    question: "Are you actually ready to apply, talk to buyers, and submit with confidence?",
    summary:
      "Use this stage to turn readiness into action, with an organized next-step plan and cleaner buyer-facing follow-through.",
  },
] as const;

export function getChubStage(key: ChubStageKey): ChubStageDefinition {
  return CHUB_STAGES.find((stage) => stage.key === key) ?? CHUB_STAGES[0];
}
