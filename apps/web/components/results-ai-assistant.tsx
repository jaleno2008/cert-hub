"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type CertificationMatch = {
  id: string;
  name?: string;
  level?: string;
  reason?: string;
  applyUrl?: string;
  priority?: number;
  confidence?: number;
  missingDocs?: string[];
};

type UnlockCandidate = {
  id: string;
  name?: string;
  level?: string;
  applyUrl?: string;
  stepsAway: number;
  missingItems: string[];
  reason?: string;
};

type ActionPlanItem = {
  title: string;
  description: string;
};

type ResultsAiAssistantProps = {
  matchedCertifications: CertificationMatch[];
  unlockCandidates: UnlockCandidate[];
  actionPlan: ActionPlanItem[];
};

const starterQuestions = [
  "What should I do first?",
  "What document should I work on first?",
  "What documents should I prepare first?",
  "Do I need business registration first?",
  "Do I need an EIN first?",
  "What raises readiness fastest?",
  "Which certification should I apply for first?",
  "Why was this certification recommended?",
  "What do I need for my best-fit certification?",
  "Am I ready yet?",
  "What is a capability statement?",
  "What if I have never done government work?",
];

function normalize(text: string) {
  return text.toLowerCase().trim();
}

function hasAnyPhrase(text: string, phrases: string[]) {
  return phrases.some((phrase) => text.includes(phrase));
}

function getTopRecommended(matches: CertificationMatch[]) {
  return [...matches].sort((a, b) => {
    const aPriority = a.priority ?? 999;
    const bPriority = b.priority ?? 999;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return (b.confidence ?? 0) - (a.confidence ?? 0);
  })[0] ?? null;
}

function getFastestUnlock(unlocks: UnlockCandidate[]) {
  return [...unlocks].sort((a, b) => {
    if (a.stepsAway !== b.stepsAway) return a.stepsAway - b.stepsAway;
    return (a.name || "").localeCompare(b.name || "");
  })[0] ?? null;
}

function findByKeyword<T extends { name?: string; id: string }>(
  items: T[],
  keyword: string
) {
  const lower = keyword.toLowerCase();
  return items.find(
    (item) => item.id.toLowerCase().includes(lower) || item.name?.toLowerCase().includes(lower)
  ) ?? null;
}

function getMissingList(item: CertificationMatch | UnlockCandidate | null | undefined) {
  if (!item) return [];
  return "stepsAway" in item ? item.missingItems || [] : item.missingDocs || [];
}

function formatConversation(parts: string[]) {
  return parts.filter(Boolean).join("\n\n");
}

function prioritizeDocuments(docs: string[]) {
  const priorityOrder = [
    "Business registration or license",
    "Business registration / license",
    "Business license",
    "Formal business registration",
    "EIN letter or EIN confirmation",
    "EIN confirmation",
    "Business bank account proof",
    "Business banking proof",
    "Proof of business address",
    "One-page business summary",
    "Capability statement",
    "Examples of past work",
    "Client references",
    "Owner bio or resume",
    "Papers showing who owns the business",
    "Papers supporting minority ownership",
    "Papers supporting women ownership",
    "Proof of who runs the business day to day",
    "Financial statements",
    "Current tax records",
    "Federal vendor account (SAM.gov / UEI)",
  ];

  const uniqueDocs = Array.from(new Set(docs));
  return uniqueDocs.sort((a, b) => {
    const aIndex = priorityOrder.findIndex((item) => item === a);
    const bIndex = priorityOrder.findIndex((item) => item === b);
    const normalizedA = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
    const normalizedB = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;
    if (normalizedA !== normalizedB) return normalizedA - normalizedB;
    return a.localeCompare(b);
  });
}

type CertificationTopic = "mbe" | "wbe" | "wosb" | "dbe" | "sbe" | "8a" | null;

function detectTopic(question: string): CertificationTopic {
  const q = normalize(question);

  if (hasAnyPhrase(q, ["women business enterprise", "woman business enterprise", " wbe", "wbe "]) || q === "wbe") {
    return "wbe";
  }
  if (hasAnyPhrase(q, ["women-owned small business", " wosb", "wosb "]) || q === "wosb") {
    return "wosb";
  }
  if (hasAnyPhrase(q, ["minority business enterprise", " mbe", "mbe "]) || q === "mbe") {
    return "mbe";
  }
  if (hasAnyPhrase(q, ["small business enterprise", " sbe", "sbe "]) || q === "sbe") {
    return "sbe";
  }
  if (hasAnyPhrase(q, ["disadvantaged business enterprise", " dbe", "dbe "]) || q === "dbe") {
    return "dbe";
  }
  if (q.includes("8(a)") || q.includes("8a") || q.includes("sba 8a") || q.includes("sba8a")) {
    return "8a";
  }

  return null;
}

function buildPromptSuggestions(
  matches: CertificationMatch[],
  unlocks: UnlockCandidate[]
) {
  const prompts = [...starterQuestions];
  const top = getTopRecommended(matches);

  if (top?.name) {
    prompts[5] = `Which certification should I apply for first?`;
    prompts[6] = `Why was ${top.name} recommended?`;
    prompts[7] = `What do I need for ${top.name}?`;
  }

  return Array.from(new Set(prompts)).slice(0, 10);
}

function buildAnswer(
  question: string,
  matchedCertifications: CertificationMatch[],
  unlockCandidates: UnlockCandidate[],
  actionPlan: ActionPlanItem[],
  rememberedTopic: CertificationTopic
) {
  const q = normalize(question);
  const explicitTopic = detectTopic(question);
  const activeTopic = explicitTopic ?? rememberedTopic;
  const asksWhatIs = hasAnyPhrase(q, [
    "what is",
    "what's",
    "tell me about",
    "explain",
    "define",
  ]);
  const topRecommended = getTopRecommended(matchedCertifications);
  const fastestUnlock = getFastestUnlock(unlockCandidates);
  const mbe = findByKeyword(matchedCertifications, "mbe");
  const sbe =
    findByKeyword(matchedCertifications, "sbe") || findByKeyword(unlockCandidates, "sbe");
  const dbe = findByKeyword(matchedCertifications, "dbe");
  const eightA =
    findByKeyword(matchedCertifications, "8a") || findByKeyword(unlockCandidates, "8a");
  const wosbUnlock =
    findByKeyword(unlockCandidates, "wosb") ||
    findByKeyword(unlockCandidates, "wbe");
  const wosbMatch =
    findByKeyword(matchedCertifications, "wosb") ||
    findByKeyword(matchedCertifications, "wbe");
  const topRequirements = getMissingList(topRecommended);
  const broadRequirementQuestion = hasAnyPhrase(q, [
    "what are the requirements",
    "what are requirements",
    "what do i need",
    "what do i need to qualify",
    "what do i need to apply",
    "how do i qualify",
    "how do i apply",
  ]);
  const asksAboutSpecificProgram = explicitTopic !== null || rememberedTopic !== null;

  if (q.includes("why was this certification recommended")) {
    if (!topRecommended) {
      return "There is not a single clear recommendation yet. Finish the readiness items first so the app can point you to the best starting path.";
    }
    return formatConversation([
      `${topRecommended.name} is being recommended because it looks like the strongest fit from your current answers.`,
      topRecommended.reason ?? "",
      "If you want, I can next explain the documents you should gather first for that path.",
    ]);
  }

  if (q.includes("which certification") || q.includes("apply for first")) {
    if (!topRecommended) {
      return "You do not have a clear certification leader yet. Tighten the core business documents first, then revisit the results page.";
    }
    return formatConversation([
      `${topRecommended.name} is the strongest first move right now.`,
      `Confidence is ${topRecommended.confidence ?? "N/A"}%. ${topRecommended.reason ?? ""}`,
      "If you want, I can tell you the first documents to prepare for that program.",
    ]);
  }

  if (q.includes("why should i start with") || q.includes("why is mbe")) {
    if (!topRecommended) {
      return "There is not a clear lead certification yet, so the better move is to finish the readiness gaps shown in the action plan.";
    }
    return formatConversation([
      `Start with ${topRecommended.name} because it currently has the best blend of fit, confidence, and momentum.`,
      topRecommended.reason ?? "",
      "If you want, I can break down the exact requirements for that program next.",
    ]);
  }

  if (q.includes("what should i do first")) {
    return actionPlan[0]
      ? formatConversation([
          `Start here first: ${actionPlan[0].title}.`,
          actionPlan[0].description,
          "If you want, I can tell you which document to gather first.",
        ])
      : "Start by reviewing your readiness gaps and gathering your core business documents.";
  }

  if (q.includes("what raises readiness fastest")) {
    const firstSteps = actionPlan.slice(0, 2).map((item) => `${item.title}: ${item.description}`);
    return formatConversation([
      "The fastest readiness gains are:",
      `- ${firstSteps.join("\n- ")}`,
      "If you want, I can narrow that down to the single best next step.",
    ]);
  }

  if (q.includes("am i ready yet")) {
    if (!topRecommended) {
      return "You are still building your foundation. Finish the core missing items first, then check your results again.";
    }
    return formatConversation([
      `You are moving in the right direction. Your strongest current path is ${topRecommended.name}.`,
      "Your next best move is to close the remaining gaps shown in your results.",
      "If you want, I can tell you whether to focus on documents, registration, or certification strategy first.",
    ]);
  }

  if (
    q.includes("what document should i work on first") ||
    q.includes("what documents should i prepare") ||
    q.includes("documents")
  ) {
    const docs = prioritizeDocuments(
      matchedCertifications.flatMap((item) => item.missingDocs || [])
    );
    if (!docs.length) {
      return "Your matched certifications do not show major missing documents right now. Move into the documents page and package the records you already have.";
    }

    if (q.includes("what document should i work on first")) {
      return formatConversation([
        `Start with this first: ${docs[0]}.`,
        "That item will make the rest of your upload process easier and clearer.",
        docs.length > 1 ? `After that, move to: ${docs.slice(1, 4).join(", ")}.` : "",
      ]);
    }

    return formatConversation([
      "Focus on these documents in this order:",
      `- ${docs.join("\n- ")}`,
      "Start with the first item, then move down the list in order.",
    ]);
  }

  if (q.includes("what should i upload first")) {
    const docs = Array.from(
      new Set(matchedCertifications.flatMap((item) => item.missingDocs || []))
    ).slice(0, 4);
    if (!docs.length) {
      return "Start by uploading your core business basics first, then add any certification-specific documents after that.";
    }
    return formatConversation([
      "Upload these first:",
      `- ${docs.join("\n- ")}`,
      "If you want, I can also tell you the safest upload order.",
    ]);
  }

  if (broadRequirementQuestion && !asksAboutSpecificProgram) {
    if (!topRecommended) {
      return formatConversation([
        "The first requirements are the basics: get the business registered, get your EIN, organize your core documents, and then choose the certification path you want to pursue first.",
        "Right now your question is broad, so I am answering at the foundation level.",
        "If you want, ask me specifically about MBE, WBE/WOSB, DBE, SBE, or 8(a).",
      ]);
    }
    if (!topRequirements.length) {
      return formatConversation([
        `If you mean your best starting path, ${topRecommended.name} is the strongest fit right now.`,
        "Your basic setup looks good, so the next move is to organize your application package and supporting documents.",
        "If you want, I can explain the requirements for that program specifically.",
      ]);
    }
    return formatConversation([
      `If you mean the best starting path for your profile, start with ${topRecommended.name}.`,
      `Focus on these requirements first:\n- ${topRequirements.slice(0, 4).join("\n- ")}`,
      "If you want, I can go deeper on MBE, WBE/WOSB, DBE, SBE, or 8(a).",
    ]);
  }

  if (broadRequirementQuestion && activeTopic === "sbe") {
    const missingItems = getMissingList(sbe);
    if (!missingItems.length) {
      return formatConversation([
        "For SBE, the main focus is having your business formally registered, keeping your license or registration current, and choosing the market you want to pursue first.",
        "That is the foundation most SBE paths look for.",
        "If you want, I can next tell you which SBE documents to gather first.",
      ]);
    }
    return formatConversation([
      "For SBE, focus on these requirements first:",
      `- ${missingItems.join("\n- ")}`,
      "If you want, I can next tell you which one to fix first.",
    ]);
  }

  if (broadRequirementQuestion && activeTopic === "mbe") {
    const missingItems = getMissingList(mbe);
    if (!missingItems.length) {
      return formatConversation([
        "For MBE, the main focus is proving minority ownership and having your basic business setup documents ready.",
        "That is the core of most MBE applications.",
        "If you want, I can next tell you which MBE documents to gather first.",
      ]);
    }
    return formatConversation([
      "For MBE, focus on these requirements first:",
      `- ${missingItems.join("\n- ")}`,
      "If you want, I can next tell you which one matters most.",
    ]);
  }

  if (broadRequirementQuestion && (activeTopic === "wbe" || activeTopic === "wosb")) {
    const target = wosbMatch ?? wosbUnlock;
    const missingItems = getMissingList(target);
    if (!missingItems.length) {
      return formatConversation([
        `For ${activeTopic === "wbe" ? "WBE" : "WOSB"}, the main focus is proving women ownership, showing who runs the business day to day, and having your core business records in place.`,
        "That is the foundation the women-owned path usually depends on.",
        "If you want, I can next tell you which documents to gather first.",
      ]);
    }
    return formatConversation([
      `For ${activeTopic === "wbe" ? "WBE" : "WOSB"}, focus on these requirements first:`,
      `- ${missingItems.join("\n- ")}`,
      "If you want, I can turn that into a step-by-step checklist.",
    ]);
  }

  if (broadRequirementQuestion && activeTopic === "dbe") {
    const missingItems = getMissingList(dbe);
    if (!missingItems.length) {
      return formatConversation([
        "For DBE, the main focus is qualifying ownership, showing who runs the business day to day, and having proof of relevant work and business records.",
        "That is what usually drives DBE readiness.",
        "If you want, I can next tell you which DBE document to gather first.",
      ]);
    }
    return formatConversation([
      "For DBE, focus on these requirements first:",
      `- ${missingItems.join("\n- ")}`,
      "If you want, I can translate those into a simpler checklist.",
    ]);
  }

  if (broadRequirementQuestion && activeTopic === "8a") {
    const missingItems = getMissingList(eightA);
    if (!missingItems.length) {
      return formatConversation([
        "For 8(a), the main focus is qualifying ownership, business history, and strong financial records.",
        "That is what usually determines whether 8(a) is a realistic next move.",
        "If you want, I can next tell you whether 8(a) should be your first move or a later-stage goal.",
      ]);
    }
    return formatConversation([
      "For 8(a), focus on these requirements first:",
      `- ${missingItems.join("\n- ")}`,
      "If you want, I can next tell you which of those to work on first.",
    ]);
  }

  if (q.includes("do i need an ein first")) {
    return "In most cases, yes. An EIN is one of the first setup items because it supports registration, vendor setup, banking, and certification applications.";
  }

  if (q.includes("do i need business registration first")) {
    return "Yes. Business registration is one of the main foundation steps. Most certification paths are much easier once the business is officially registered and active.";
  }

  if (q.includes("do i need sam.gov first")) {
    return "Not for every certification, but SAM.gov becomes important when you are getting ready for federal opportunities. It is usually not the very first step, but it matters once your basic business setup is in place.";
  }

  if (q.includes("what is a naics code")) {
    return "A NAICS code is a business classification code that describes the type of work your company does. It helps agencies and certification programs understand your industry.";
  }

  if (
    (hasAnyPhrase(q, [" sbe", "sbe ", "small business enterprise"]) || q === "sbe") &&
    asksWhatIs
  ) {
    return "SBE stands for Small Business Enterprise. It is usually a local or county-level certification path for smaller businesses that are formally registered and ready to pursue contract opportunities.";
  }

  if (
    (hasAnyPhrase(q, [" mbe", "mbe ", "minority business enterprise"]) || q === "mbe") &&
    asksWhatIs
  ) {
    return "MBE stands for Minority Business Enterprise. It is a certification path used to recognize businesses that are minority-owned and properly documented.";
  }

  if (
    (hasAnyPhrase(q, [" wosb", "wosb ", "women-owned small business"]) || q === "wosb") &&
    asksWhatIs
  ) {
    return "WOSB stands for Women-Owned Small Business. It is a certification path for businesses owned and controlled by women, often used for federal contracting opportunities.";
  }

  if (
    (hasAnyPhrase(q, [" wbe", "wbe ", "women business enterprise", "woman business enterprise"]) || q === "wbe") &&
    asksWhatIs
  ) {
    return "WBE stands for Women Business Enterprise. It is commonly used in supplier diversity and state or local certification programs for women-owned businesses.";
  }

  if (
    (hasAnyPhrase(q, [" dbe", "dbe ", "disadvantaged business enterprise"]) || q === "dbe") &&
    asksWhatIs
  ) {
    return "DBE stands for Disadvantaged Business Enterprise. It is commonly used in transportation and infrastructure contracting for qualifying disadvantaged businesses.";
  }

  if (
    (q.includes("8a") || q.includes("8(a)")) &&
    asksWhatIs
  ) {
    return "8(a) is the SBA Business Development Program. It is a federal growth program for socially and economically disadvantaged small businesses.";
  }

  if (q.includes("what is a capability statement")) {
    return "A capability statement is a short one-page business summary. It explains what you do, what makes you different, your past work, and how to contact you.";
  }

  if (q.includes("what counts as past performance")) {
    return "Past performance is proof that you have done similar work before. It can include private jobs, subcontract work, nonprofit projects, or government work.";
  }

  if (q.includes("never done government work")) {
    return "That is okay. Many businesses start with private or subcontract work as their proof of experience before moving into government opportunities.";
  }

  if (q.includes("do not have all my documents yet") || q.includes("don't have all my documents yet")) {
    return "That is normal. Start with the core business documents first, then add the supporting items one step at a time. The app is meant to help you build the package, not require everything on day one.";
  }

  if (q.includes("what do i need for mbe")) {
    if (mbe?.missingDocs?.length) {
    return formatConversation([
      "For MBE, focus on these items next:",
      `- ${mbe.missingDocs.join("\n- ")}`,
      "If you want, I can also explain what MBE means in plain English.",
    ]);
  }
    return "For MBE, the main focus is proving minority ownership and having your basic business setup documents ready.";
  }

  if (
    (q.includes("sbe") || q.includes("small business enterprise")) &&
    (q.includes("requirement") || q.includes("requirements") || q.includes("need") || q.includes("eligibility"))
  ) {
    const missingItems = getMissingList(sbe);
    if (!missingItems.length) {
      return "For SBE, the main focus is having your business formally registered, keeping your license or registration current, and choosing the market you want to pursue first.";
    }
    return formatConversation([
      "For SBE, focus on these items next:",
      `- ${missingItems.join("\n- ")}`,
      "If you want, I can also explain whether SBE or MBE makes more sense as your first move.",
    ]);
  }

  if (
    (q.includes("mbe") || q.includes("minority business enterprise")) &&
    (q.includes("requirement") || q.includes("requirements") || q.includes("need") || q.includes("eligibility"))
  ) {
    const missingItems = getMissingList(mbe);
    if (!missingItems.length) {
      return "For MBE, the main focus is proving minority ownership and having your basic business setup documents ready.";
    }
    return formatConversation([
      "For MBE, focus on these items next:",
      `- ${missingItems.join("\n- ")}`,
      "If you want, I can also tell you which of these to fix first.",
    ]);
  }

  if (q.includes("dbe")) {
    if (!dbe) {
      return "DBE is not one of your strongest current matches yet, so first strengthen proof of who runs the business, your one-page business summary, and examples of past work.";
    }
    if (!dbe.missingDocs?.length) {
      return "DBE already looks strong in your profile. The next move is to prepare your package and use the program link in the match card.";
    }
    return formatConversation([
      "To improve DBE confidence, close these gaps:",
      `- ${dbe.missingDocs.join("\n- ")}`,
      "If you want, I can translate those into a simpler checklist.",
    ]);
  }

  if (
    q.includes("fastest unlock") ||
    q.includes("unlock next") ||
    q.includes("missing to unlock")
  ) {
    if (!fastestUnlock) {
      return "No near-term unlock path is currently showing. Keep working the action plan and your document vault.";
    }
    return formatConversation([
      `${fastestUnlock.name} is the closest unlock right now. You are ${fastestUnlock.stepsAway} step(s) away.`,
      `Focus on:\n- ${fastestUnlock.missingItems.join("\n- ")}`,
      "If you want, I can tell you which one of those gaps matters most.",
    ]);
  }

  if (q.includes("wosb") || q.includes("women-owned")) {
    const target = wosbMatch ?? wosbUnlock;
    if (!target) {
      return "WOSB is not showing as a current unlock candidate from your answers. If you want, I can still explain the usual WOSB basics and what would need to change.";
    }
    const missingItems = getMissingList(target);
    if (!missingItems.length) {
      return "For WOSB, the main focus is proving women ownership, showing who runs the business day to day, and having your core business records in place.";
    }
    return formatConversation([
      `${target.name} needs attention in these areas:`,
      `- ${missingItems.join("\n- ")}`,
      "If you want, I can turn that into a simple step-by-step plan.",
    ]);
  }

  if (
    q.includes("what do i need for 8(a)") ||
    q.includes("what do i need for 8a") ||
    ((q.includes("8(a)") || q.includes("8a")) &&
      (q.includes("requirement") || q.includes("requirements") || q.includes("need") || q.includes("eligibility")))
  ) {
    const missingItems = getMissingList(eightA);
    if (!missingItems.length) {
      return "For 8(a), the main focus is qualifying ownership, business history, and strong financial records.";
    }
    return formatConversation([
      "For 8(a), focus on these items next:",
      `- ${missingItems.join("\n- ")}`,
      "If you want, I can also explain whether 8(a) should be your first move or a later-stage goal.",
    ]);
  }

  return formatConversation([
    "I can help with that, but your question is still a little broad.",
    `From your current results, the best first move is ${topRecommended?.name ?? "to finish your readiness gaps"}, and the closest unlock is ${fastestUnlock?.name ?? "not identified yet"}.`,
    "Try asking one of these next: what documents do I need first, what are the requirements for SBE, what is WBE, or what should I do next?",
  ]);
}

export default function ResultsAiAssistant({
  matchedCertifications,
  unlockCandidates,
  actionPlan,
}: ResultsAiAssistantProps) {
  const introMessage =
    "Hi, I’m your CHub Results Advisor. Ask me what to do first, what documents to gather, or which certification looks best, and I’ll answer from the results on this page.";
  const promptSuggestions = useMemo(
    () => buildPromptSuggestions(matchedCertifications, unlockCandidates),
    [matchedCertifications, unlockCandidates]
  );

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: introMessage,
    },
  ]);
  const [speechReady, setSpeechReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [rememberedTopic, setRememberedTopic] = useState<CertificationTopic>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSpeechReady(true);
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const latestAnswer =
    [...messages].reverse().find((message) => message.role === "assistant" && message.content !== introMessage)
      ?.content ?? "";

  useEffect(() => {
    if (!speechReady || !autoSpeak || !latestAnswer) return;

    const utterance = new SpeechSynthesisUtterance(latestAnswer);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, [autoSpeak, latestAnswer, speechReady]);

  function sendMessage(customText?: string) {
    const text = (customText ?? "").trim();
    if (!text) return;
    const nextTopic = detectTopic(text);

    const answer = buildAnswer(
      text,
      matchedCertifications,
      unlockCandidates,
      actionPlan,
      nextTopic ?? rememberedTopic
    );

    if (nextTopic) {
      setRememberedTopic(nextTopic);
    }
    setMessages([
      {
        role: "assistant",
        content: introMessage,
      },
      { role: "user", content: text },
      { role: "assistant", content: answer },
    ]);
  }

  function toggleSpeech() {
    if (!speechReady || !latestAnswer) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(latestAnswer);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }

  return (
    <section className="overflow-hidden rounded-[36px] border border-cyan-300/30 bg-gradient-to-br from-[#06131a] via-[#0a1d26] to-[#102b31] shadow-[0_24px_80px_rgba(6,19,26,0.35)]">
      <div className="border-b border-cyan-300/15 bg-gradient-to-r from-cyan-400/12 via-transparent to-emerald-300/10 px-6 py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200/80">
              Guided Advisor
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">CHub Results Advisor</h2>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-200/85">
              Pick one of the guided questions below. This advisor answers
              directly from the results on this page in a clear step-by-step way.
            </p>
          </div>
          {speechReady && (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setAutoSpeak((prev) => !prev)}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  autoSpeak
                    ? "border-cyan-300/60 bg-cyan-300 text-[#06202a] hover:bg-cyan-200"
                    : "border-cyan-300/25 bg-white/5 text-cyan-100 hover:bg-white/10"
                }`}
              >
                {autoSpeak ? "Auto Voice On" : "Auto Voice Off"}
              </button>
              <button
                type="button"
                onClick={toggleSpeech}
                disabled={!latestAnswer}
                className="rounded-2xl border border-cyan-300/25 bg-white/5 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-slate-500"
              >
                {isSpeaking ? "Stop Voice" : "Read Latest Answer"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="mb-5 rounded-[28px] border border-cyan-300/20 bg-white/5 p-4 backdrop-blur-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-200">
            Suggested Questions
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {promptSuggestions.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="rounded-full border border-cyan-300/25 bg-[#0d2831] px-4 py-2 text-base font-medium text-cyan-50 transition hover:border-cyan-200/45 hover:bg-[#123642]"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[420px] space-y-3 overflow-y-auto rounded-[28px] border border-white/8 bg-black/15 p-5">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`max-w-[85%] rounded-[24px] px-5 py-4 text-base leading-8 ${
                message.role === "assistant"
                  ? "bg-white/95 text-slate-900 shadow-[0_12px_30px_rgba(2,12,18,0.18)]"
                  : "ml-auto bg-gradient-to-r from-cyan-400 to-emerald-300 text-[#06222a]"
              }`}
            >
              {message.content}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
