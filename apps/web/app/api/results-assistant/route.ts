import { NextRequest, NextResponse } from "next/server";

type CertificationMatch = {
  id: string;
  name: string;
  level?: string;
  reason?: string;
  applyUrl?: string;
  priority?: number;
  confidence?: number;
  missingDocs?: string[];
};

type UnlockCandidate = {
  id: string;
  name: string;
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

function normalize(text: string) {
  return text.toLowerCase().trim();
}

function buildCertificationSummary(matches: CertificationMatch[]) {
  if (!matches.length) {
    return "No matched certifications were found yet.";
  }

  return matches
    .map((item) => {
      const parts = [`${item.name}`];

      if (item.level) {
        parts.push(`Level: ${item.level}`);
      }

      if (typeof item.confidence === "number") {
        parts.push(`Confidence: ${item.confidence}%`);
      }

      if (item.reason) {
        parts.push(`Reason: ${item.reason}`);
      }

      if (item.missingDocs && item.missingDocs.length > 0) {
        parts.push(`Missing Documents: ${item.missingDocs.join(", ")}`);
      }

      return `- ${parts.join(" | ")}`;
    })
    .join("\n");
}

function buildUnlockSummary(unlockCandidates: UnlockCandidate[]) {
  if (!unlockCandidates.length) {
    return "No unlock opportunities were detected right now.";
  }

  return unlockCandidates
    .map((item) => {
      const parts = [
        `${item.name}`,
        `${item.stepsAway} step${item.stepsAway > 1 ? "s" : ""} away`,
      ];

      if (item.level) {
        parts.push(`Level: ${item.level}`);
      }

      if (item.missingItems?.length) {
        parts.push(`Missing: ${item.missingItems.join(", ")}`);
      }

      return `- ${parts.join(" | ")}`;
    })
    .join("\n");
}

function buildActionPlanSummary(actionPlan: ActionPlanItem[]) {
  if (!actionPlan.length) {
    return "No action plan steps were provided yet.";
  }

  return actionPlan
    .map(
      (step, index) => `Step ${index + 1}: ${step.title} - ${step.description}`
    )
    .join("\n");
}

function getUniqueMissingDocs(matches: CertificationMatch[]) {
  const docs = matches.flatMap((item) => item.missingDocs || []);
  return Array.from(new Set(docs));
}

function getRecommendedFirst(matches: CertificationMatch[]) {
  if (!matches.length) return null;

  const sorted = [...matches].sort((a, b) => {
    const aPriority = typeof a.priority === "number" ? a.priority : 999;
    const bPriority = typeof b.priority === "number" ? b.priority : 999;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    const aConfidence = typeof a.confidence === "number" ? a.confidence : 0;
    const bConfidence = typeof b.confidence === "number" ? b.confidence : 0;

    return bConfidence - aConfidence;
  });

  return sorted[0];
}

function findMatchByKeyword(matches: CertificationMatch[], keyword: string) {
  const lower = keyword.toLowerCase();
  return matches.find((item) => item.name.toLowerCase().includes(lower));
}

function findUnlockByKeyword(
  unlockCandidates: UnlockCandidate[],
  keyword: string
) {
  const lower = keyword.toLowerCase();
  return unlockCandidates.find((item) =>
    item.name.toLowerCase().includes(lower)
  );
}

function getHighestImpactDoc(matches: CertificationMatch[]) {
  const counts = new Map<string, number>();

  for (const match of matches) {
    for (const doc of match.missingDocs || []) {
      counts.set(doc, (counts.get(doc) || 0) + 1);
    }
  }

  let bestDoc = "";
  let bestCount = 0;

  for (const [doc, count] of Array.from(counts.entries())) {
    if (count > bestCount) {
      bestDoc = doc;
      bestCount = count;
    }
  }

  return bestDoc || null;
}

function getFastestUnlock(unlockCandidates: UnlockCandidate[]) {
  if (!unlockCandidates.length) return null;

  return [...unlockCandidates].sort((a, b) => {
    if (a.stepsAway !== b.stepsAway) {
      return a.stepsAway - b.stepsAway;
    }
    return a.name.localeCompare(b.name);
  })[0];
}

function explainStrategicOrder(matches: CertificationMatch[]) {
  const hasLocal =
    matches.some((m) => m.id === "mbe") || matches.some((m) => m.id === "sbe");
  const hasDBE = matches.some((m) => m.id === "dbe");
  const has8a = matches.some((m) => m.id === "8a");

  if (hasLocal && hasDBE && has8a) {
    return "A strong order is: start with local certifications like MBE or SBE, then move into DBE, and then pursue SBA 8(a). That sequence helps you organize documents, build momentum, and move from easier programs into more advanced ones.";
  }

  if (hasLocal && hasDBE) {
    return "A strong order is: start with local certifications like MBE or SBE first, then move into DBE once your documents and ownership records are fully organized.";
  }

  if (hasLocal) {
    return "Your best strategy is to begin with your local certification match first. That usually gives you the smoothest path to build documentation and confidence.";
  }

  if (has8a) {
    return "Since you already appear eligible for SBA 8(a), make sure your supporting records are very organized before applying because it is more advanced than many local programs.";
  }

  return "Start with the easiest and highest-confidence certification first, then move into more advanced programs after your documents are fully organized.";
}

function getTargetUnlockFromQuestion(
  question: string,
  unlockCandidates: UnlockCandidate[]
) {
  const q = normalize(question);

  if (q.includes("wbe")) return findUnlockByKeyword(unlockCandidates, "wbe");
  if (q.includes("women")) return findUnlockByKeyword(unlockCandidates, "women");
  if (q.includes("vbe")) return findUnlockByKeyword(unlockCandidates, "vbe");
  if (q.includes("veteran")) return findUnlockByKeyword(unlockCandidates, "veteran");
  if (q.includes("8(a)") || q.includes("8a"))
    return findUnlockByKeyword(unlockCandidates, "8(a)");
  if (q.includes("dbe")) return findUnlockByKeyword(unlockCandidates, "dbe");
  if (q.includes("mbe")) return findUnlockByKeyword(unlockCandidates, "mbe");
  if (q.includes("sbe")) return findUnlockByKeyword(unlockCandidates, "sbe");

  return null;
}

function getSimpleAnswer(
  question: string,
  matchedCertifications: CertificationMatch[],
  unlockCandidates: UnlockCandidate[],
  actionPlan: ActionPlanItem[]
) {
  const q = normalize(question);
  const recommendedFirst = getRecommendedFirst(matchedCertifications);
  const missingDocs = getUniqueMissingDocs(matchedCertifications);
  const bestDoc = getHighestImpactDoc(matchedCertifications);
  const fastestUnlock = getFastestUnlock(unlockCandidates);

  const dbeMatch = findMatchByKeyword(matchedCertifications, "dbe");
  const eightAMatch =
    findMatchByKeyword(matchedCertifications, "8(a)") ||
    findMatchByKeyword(matchedCertifications, "8a");

  const targetedUnlock = getTargetUnlockFromQuestion(question, unlockCandidates);

  if (
    q.includes("what am i missing to unlock") ||
    q.includes("missing to unlock") ||
    q.includes("what do i need to unlock")
  ) {
    if (targetedUnlock) {
      return `To unlock "${targetedUnlock.name}", you are currently ${targetedUnlock.stepsAway} step${
        targetedUnlock.stepsAway > 1 ? "s" : ""
      } away. Focus on these items first:\n- ${targetedUnlock.missingItems.join(
        "\n- "
      )}`;
    }

    if (!unlockCandidates.length) {
      return "Right now, the system does not show any nearby unlock opportunities.";
    }

    return `Here are the certifications you are currently closest to unlocking:\n${buildUnlockSummary(
      unlockCandidates
    )}`;
  }

  if (
    q.includes("which unlock should i target next") ||
    q.includes("which unlock should i do next") ||
    q.includes("best unlock to target") ||
    q.includes("target next unlock")
  ) {
    if (!fastestUnlock) {
      return "You do not currently have an unlock candidate to target next.";
    }

    return `The best unlock to target next is "${fastestUnlock.name}" because it is only ${fastestUnlock.stepsAway} step${
      fastestUnlock.stepsAway > 1 ? "s" : ""
    } away. Focus on: ${fastestUnlock.missingItems.join(", ")}.`;
  }

  if (
    q.includes("fastest unlock path") ||
    q.includes("what is the fastest unlock path") ||
    q.includes("quickest unlock")
  ) {
    if (!fastestUnlock) {
      return "There is no unlock path showing right now because your current results do not include nearby unlock candidates.";
    }

    return `Your fastest unlock path is "${fastestUnlock.name}". It is ${fastestUnlock.stepsAway} step${
      fastestUnlock.stepsAway > 1 ? "s" : ""
    } away, and the main item${
      fastestUnlock.missingItems.length > 1 ? "s are" : " is"
    }: ${fastestUnlock.missingItems.join(", ")}.`;
  }

  if (
    q.includes("show unlocks") ||
    q.includes("unlock opportunities") ||
    q.includes("what can i unlock next")
  ) {
    if (!unlockCandidates.length) {
      return "No nearby unlock opportunities were found right now.";
    }

    return `Here are your current unlock opportunities:\n${buildUnlockSummary(
      unlockCandidates
    )}`;
  }

  if (
    q.includes("why is mbe the best starting point") ||
    q.includes("why is this the best starting point") ||
    q.includes("why is this recommended first") ||
    q.includes("why is mbe recommended first")
  ) {
    if (!recommendedFirst) {
      return "There is not enough live results data yet to identify a best starting certification.";
    }

    return `"${recommendedFirst.name}" is recommended first because it currently has the strongest strategic position in your results. In practical terms, it is the easiest entry point, helps you organize your documents, and builds momentum before more advanced certifications like DBE or SBA 8(a).`;
  }

  if (
    q.includes("what raises readiness fastest") ||
    q.includes("how do i raise readiness fastest") ||
    q.includes("what improves readiness fastest")
  ) {
    if (bestDoc) {
      return `The fastest way to raise readiness right now is to upload or organize "${bestDoc}" first, because it appears across multiple certification requirements. After that, focus on any other missing items and keep your business profile fields complete.`;
    }

    return "Your readiness already looks strong on documents. The fastest way to improve it further is to tighten your business profile details and focus on the highest-confidence certification first.";
  }

  if (
    q.includes("what improves dbe confidence") ||
    q.includes("how do i improve dbe confidence") ||
    q.includes("how do i strengthen dbe")
  ) {
    if (!dbeMatch) {
      return "DBE is not currently one of your matched certifications, so there is no DBE-specific confidence path to improve yet.";
    }

    if (dbeMatch.missingDocs && dbeMatch.missingDocs.length > 0) {
      return `To improve DBE confidence, focus first on these missing or weaker support items: ${dbeMatch.missingDocs.join(
        ", "
      )}. DBE also becomes stronger when ownership, control, tax returns, and owner resume records are organized clearly.`;
    }

    return "Your DBE match already looks fairly strong. To improve it even more, keep ownership, control, tax returns, and owner resume documentation well organized and ready for review.";
  }

  if (
    q.includes("why isn't 8(a) first") ||
    q.includes("why is 8(a) not first") ||
    q.includes("why not 8(a) first")
  ) {
    if (!eightAMatch) {
      return "SBA 8(a) is not currently one of your matched certifications, so it is not being ranked first.";
    }

    if (recommendedFirst && recommendedFirst.id !== eightAMatch.id) {
      return `SBA 8(a) is a strong match, but it is not first because "${recommendedFirst.name}" is the easier and more strategic entry point. In most cases, starting with a local or simpler certification helps you build a cleaner document package and stronger application flow before moving into SBA 8(a).`;
    }

    return "SBA 8(a) is already your strongest starting point in the current results.";
  }

  if (
    q.includes("what order should i apply") ||
    q.includes("what order should i do these in") ||
    q.includes("local state federal") ||
    q.includes("what is the best order")
  ) {
    return explainStrategicOrder(matchedCertifications);
  }

  if (
    q.includes("why did i match") ||
    q.includes("why did i qualify") ||
    q.includes("why these certifications")
  ) {
    if (!matchedCertifications.length) {
      return "You do not currently show any matched certifications yet. Complete more profile details, readiness steps, or uploads so the results engine can build stronger matches.";
    }

    return `You matched these certifications because your current profile, business details, and uploaded document signals align with the eligibility rules in the results engine.\n\nMatched certifications:\n${buildCertificationSummary(
      matchedCertifications
    )}`;
  }

  if (
    q.includes("what am i missing") ||
    q.includes("missing docs") ||
    q.includes("missing documents") ||
    q.includes("what documents am i missing")
  ) {
    if (!matchedCertifications.length) {
      return "You do not currently have matched certifications yet, so there are no certification-specific missing documents to show.";
    }

    if (!missingDocs.length) {
      return "Based on your current matched certifications, no common missing documents were detected right now. Your document profile looks strong for the matches currently shown.";
    }

    return `Based on your current matched certifications, here are the main missing or recommended documents:\n- ${missingDocs.join(
      "\n- "
    )}`;
  }

  if (
    q.includes("what documents should i prepare") ||
    q.includes("what documents do i need") ||
    q === "documents"
  ) {
    if (missingDocs.length > 0) {
      return `Based on your current results, these are the first documents you should focus on:\n- ${missingDocs.join(
        "\n- "
      )}`;
    }

    return `Your current results do not show major missing documents. Still, the most common items to keep ready are:\n- Business License\n- EIN Letter\n- Articles / Operating Agreement\n- Ownership Documents\n- Tax Returns\n- Owner Resume`;
  }

  if (
    q.includes("which certification should i apply for first") ||
    q.includes("what should i apply for first") ||
    q.includes("which one first") ||
    q.includes("recommended first")
  ) {
    if (!recommendedFirst) {
      return "You do not currently have a certification match to prioritize yet. Complete more profile information and uploads first.";
    }

    return `Based on your current live results, the best certification to start with is "${recommendedFirst.name}". It is currently the top recommended match in your results flow. Starting there usually helps you build documents, momentum, and a stronger base before more advanced applications.`;
  }

  if (
    q.includes("what should i do next") ||
    q.includes("next step") ||
    q.includes("next steps")
  ) {
    return `Here are your current next steps:\n\n${buildActionPlanSummary(
      actionPlan
    )}`;
  }

  if (
    q.includes("apply") ||
    q.includes("application link") ||
    q.includes("apply links") ||
    q.includes("where do i apply")
  ) {
    if (!matchedCertifications.length) {
      return "There are no matched certifications yet, so there are no application links to show.";
    }

    const links = matchedCertifications
      .filter((item) => item.applyUrl)
      .map((item) => `- ${item.name}: ${item.applyUrl}`)
      .join("\n");

    return links
      ? `Here are your current certification application links:\n${links}`
      : "Your matched certifications do not yet include application links.";
  }

  if (q.includes("what does dbe mean")) {
    return "DBE means Disadvantaged Business Enterprise. It is commonly used for transportation and public contracting programs for disadvantaged business owners.";
  }

  if (q.includes("what does sbe mean")) {
    return "SBE means Small Business Enterprise. It usually refers to a business that meets local or state small business size standards.";
  }

  if (q.includes("what does mbe mean")) {
    return "MBE means Minority Business Enterprise. It generally refers to a business that is majority-owned, controlled, and operated by a qualifying minority owner.";
  }

  if (q.includes("what does wbe mean")) {
    return "WBE means Women Business Enterprise. It generally refers to a business that is majority-owned, controlled, and operated by a woman.";
  }

  if (q.includes("what does vbe mean")) {
    return "VBE means Veteran Business Enterprise. It generally refers to a business that is majority-owned, controlled, and operated by a veteran.";
  }

  if (q.includes("what is 8a") || q.includes("what does 8a mean")) {
    return "SBA 8(a) is a federal business development program for small businesses owned and controlled by socially and economically disadvantaged individuals.";
  }

  if (
    q.includes("summarize my strategy") ||
    q.includes("what is my strategy") ||
    q.includes("give me my strategy")
  ) {
    const firstName = recommendedFirst ? recommendedFirst.name : "your top match";

    return `Your current strategy is: start with ${firstName}, organize any missing documents first, then follow the action plan in sequence. After local or simpler certifications are in motion, move into stronger advanced programs like DBE and SBA 8(a) if they are matched in your results.`;
  }

  return `Here is your current results summary:\n\nMatched certifications:\n${buildCertificationSummary(
    matchedCertifications
  )}\n\nUnlock opportunities:\n${buildUnlockSummary(
    unlockCandidates
  )}\n\nAction plan:\n${buildActionPlanSummary(
    actionPlan
  )}\n\nYou can ask me things like:\n- What am I missing to unlock WBE?\n- Which unlock should I target next?\n- What is the fastest unlock path?\n- Why is MBE the best starting point?\n- What improves DBE confidence?`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const question = body.question as string;
    const matchedCertifications =
      (body.matchedCertifications as CertificationMatch[]) || [];
    const unlockCandidates =
      (body.unlockCandidates as UnlockCandidate[]) || [];
    const actionPlan = (body.actionPlan as ActionPlanItem[]) || [];

    const answer = getSimpleAnswer(
      question || "",
      matchedCertifications,
      unlockCandidates,
      actionPlan
    );

    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json(
      {
        answer: "I couldn’t process that request right now. Please try again.",
      },
      { status: 200 }
    );
  }
}
