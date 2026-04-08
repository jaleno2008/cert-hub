import { NextRequest, NextResponse } from "next/server";

type UploadedDoc = {
  name: string;
  type?: string;
};

type UserProfile = {
  minorityOwned: boolean;
  womanOwned: boolean;
  veteranOwned: boolean;
  revenue: number;
  yearsInBusiness: number;
  location: string;
  hasBusinessLicense: boolean;
  hasEinLetter: boolean;
  hasArticles: boolean;
  hasOwnershipDocs: boolean;
  hasTaxReturns: boolean;
  hasResume: boolean;
};

type CertificationMatch = {
  id: string;
  name: string;
  level: string;
  reason: string;
  applyUrl: string;
  priority: number;
  confidence: number;
  missingDocs: string[];
};

type UnlockCandidate = {
  id: string;
  name: string;
  level: string;
  applyUrl: string;
  stepsAway: number;
  missingItems: string[];
  reason: string;
};

type ActionPlanItem = {
  title: string;
  description: string;
};

type ReadinessBreakdown = {
  overall: number;
  documents: number;
  profile: number;
  eligibility: number;
};

type BestStartingPoint = {
  id: string;
  name: string;
  level: string;
  reason: string;
  confidence: number;
  applyUrl: string;
};

type CertificationRule = {
  id: string;
  name: string;
  level: string;
  applyUrl: string;
  priority: number;
  matches: (profile: UserProfile) => boolean;
  reason: (profile: UserProfile) => string;
  requiredDocs: string[];
  unlockChecks: (profile: UserProfile) => string[];
};

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function toArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function toStringSafe(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toNumberSafe(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.-]/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function toBooleanSafe(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["true", "yes", "y", "1", "checked"].includes(normalized);
  }
  return false;
}

function getNestedValue(obj: unknown, paths: string[]): unknown {
  const root = toRecord(obj);

  for (const path of paths) {
    const keys = path.split(".");
    let current: unknown = root;
    let failed = false;

    for (const key of keys) {
      const currentRecord = toRecord(current);
      if (!(key in currentRecord)) {
        failed = true;
        break;
      }
      current = currentRecord[key];
    }

    if (!failed && current !== undefined && current !== null && current !== "") {
      return current;
    }
  }

  return undefined;
}

function findBoolean(obj: unknown, paths: string[]): boolean {
  return toBooleanSafe(getNestedValue(obj, paths));
}

function findString(obj: unknown, paths: string[]): string {
  return toStringSafe(getNestedValue(obj, paths));
}

function findNumber(obj: unknown, paths: string[]): number {
  return toNumberSafe(getNestedValue(obj, paths));
}

async function safeFetchJson(url: string) {
  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

function extractUploadedDocs(documentsPayload: unknown): UploadedDoc[] {
  const docCandidates = [
    getNestedValue(documentsPayload, ["documents"]),
    getNestedValue(documentsPayload, ["files"]),
    getNestedValue(documentsPayload, ["uploads"]),
    documentsPayload,
  ];

  for (const candidate of docCandidates) {
    const arr = toArray(candidate);
    if (arr.length > 0) {
      return arr.map((item) => {
        const record = toRecord(item);
        return {
          name:
            toStringSafe(record.name) ||
            toStringSafe(record.filename) ||
            toStringSafe(record.originalName) ||
            toStringSafe(record.title),
          type:
            toStringSafe(record.type) ||
            toStringSafe(record.mimeType) ||
            toStringSafe(record.category),
        };
      });
    }
  }

  return [];
}

function hasDocument(docs: UploadedDoc[], keywords: string[]) {
  const normalizedKeywords = keywords.map((k) => k.toLowerCase());

  return docs.some((doc) => {
    const haystack = `${doc.name} ${doc.type ?? ""}`.toLowerCase();
    return normalizedKeywords.some((keyword) => haystack.includes(keyword));
  });
}

function deriveProfileFromData(
  rawResults: unknown,
  uploadedDocs: UploadedDoc[]
): UserProfile {
  const answers =
    getNestedValue(rawResults, ["answers"]) ??
    getNestedValue(rawResults, ["assessment.answers"]) ??
    getNestedValue(rawResults, ["profile"]) ??
    getNestedValue(rawResults, ["business"]) ??
    getNestedValue(rawResults, ["data"]) ??
    rawResults;

  const minorityOwned = findBoolean(answers, [
    "minorityOwned",
    "isMinorityOwned",
    "ownership.minorityOwned",
    "business.minorityOwned",
    "profile.minorityOwned",
  ]);

  const womanOwned = findBoolean(answers, [
    "womanOwned",
    "womenOwned",
    "isWomanOwned",
    "ownership.womanOwned",
    "business.womanOwned",
    "profile.womanOwned",
  ]);

  const veteranOwned = findBoolean(answers, [
    "veteranOwned",
    "isVeteranOwned",
    "ownership.veteranOwned",
    "business.veteranOwned",
    "profile.veteranOwned",
  ]);

  const revenue = findNumber(answers, [
    "revenue",
    "annualRevenue",
    "businessRevenue",
    "financials.revenue",
    "profile.revenue",
    "business.revenue",
  ]);

  const yearsInBusiness = findNumber(answers, [
    "yearsInBusiness",
    "timeInBusiness",
    "businessAge",
    "profile.yearsInBusiness",
    "business.yearsInBusiness",
  ]);

  const location =
    findString(answers, [
      "location",
      "state",
      "businessState",
      "profile.location",
      "profile.state",
      "business.location",
      "business.state",
    ]) || "Florida";

  const hasBusinessLicense = hasDocument(uploadedDocs, [
    "business license",
    "license",
  ]);

  const hasEinLetter = hasDocument(uploadedDocs, [
    "ein",
    "ss4",
    "irs letter",
  ]);

  const hasArticles = hasDocument(uploadedDocs, [
    "articles",
    "incorporation",
    "organization",
    "operating agreement",
    "bylaws",
  ]);

  const hasOwnershipDocs = hasDocument(uploadedDocs, [
    "ownership",
    "member",
    "shareholder",
    "stock certificate",
    "operating agreement",
  ]);

  const hasTaxReturns = hasDocument(uploadedDocs, [
    "tax return",
    "1040",
    "1120",
    "1065",
  ]);

  const hasResume = hasDocument(uploadedDocs, [
    "resume",
    "cv",
  ]);

  return {
    minorityOwned,
    womanOwned,
    veteranOwned,
    revenue,
    yearsInBusiness,
    location,
    hasBusinessLicense,
    hasEinLetter,
    hasArticles,
    hasOwnershipDocs,
    hasTaxReturns,
    hasResume,
  };
}

function getMissingDocs(profile: UserProfile, requiredDocs: string[]) {
  return requiredDocs.filter((doc) => {
    switch (doc) {
      case "Business License":
        return !profile.hasBusinessLicense;
      case "EIN Letter":
        return !profile.hasEinLetter;
      case "Articles / Operating Agreement":
        return !profile.hasArticles;
      case "Ownership Documents":
        return !profile.hasOwnershipDocs;
      case "Tax Returns":
        return !profile.hasTaxReturns;
      case "Owner Resume":
        return !profile.hasResume;
      default:
        return false;
    }
  });
}

const certificationRules: CertificationRule[] = [
  {
    id: "mbe",
    name: "Minority Business Enterprise (MBE)",
    level: "City / County",
    applyUrl:
      "https://www.miami.gov/Business-Licenses/Doing-Business-with-the-City/Register-as-a-City-Supplier-Vendor",
    priority: 1,
    matches: (profile) => profile.minorityOwned,
    reason: () =>
      "This is your easiest and strongest starting point because your profile indicates minority ownership and it can help you build momentum for more advanced certifications.",
    requiredDocs: [
      "Business License",
      "EIN Letter",
      "Articles / Operating Agreement",
      "Ownership Documents",
    ],
    unlockChecks: (profile) => {
      const missing: string[] = [];
      if (!profile.minorityOwned) missing.push("Minority ownership verification");
      return missing;
    },
  },
  {
    id: "sbe",
    name: "Small Business Enterprise (SBE)",
    level: "Local / State",
    applyUrl:
      "https://www.dms.myflorida.com/business_operations/state_purchasing/office_of_supplier_development_osd/get_certified",
    priority: 2,
    matches: (profile) => profile.revenue > 0 && profile.revenue <= 1000000,
    reason: () =>
      "Your business appears to fall within common small business size standards based on revenue.",
    requiredDocs: [
      "Business License",
      "EIN Letter",
      "Articles / Operating Agreement",
      "Tax Returns",
    ],
    unlockChecks: (profile) => {
      const missing: string[] = [];
      if (!(profile.revenue > 0 && profile.revenue <= 1000000)) {
        missing.push("Small business revenue qualification");
      }
      return missing;
    },
  },
  {
    id: "dbe",
    name: "Disadvantaged Business Enterprise (DBE)",
    level: "State / Federal",
    applyUrl:
      "https://www.dms.myflorida.com/business_operations/state_purchasing/office_of_supplier_development_osd/get_certified",
    priority: 3,
    matches: (profile) => profile.minorityOwned && profile.revenue <= 1000000,
    reason: () =>
      "Your business appears to meet disadvantaged ownership and small business size signals for DBE.",
    requiredDocs: [
      "Business License",
      "EIN Letter",
      "Articles / Operating Agreement",
      "Ownership Documents",
      "Tax Returns",
      "Owner Resume",
    ],
    unlockChecks: (profile) => {
      const missing: string[] = [];
      if (!profile.minorityOwned) missing.push("Disadvantaged ownership qualification");
      if (!(profile.revenue > 0 && profile.revenue <= 1000000)) {
        missing.push("Small business size qualification");
      }
      if (!profile.hasOwnershipDocs) missing.push("Ownership proof clarification");
      if (!profile.hasTaxReturns) missing.push("Tax returns");
      if (!profile.hasResume) missing.push("Owner resume");
      return missing;
    },
  },
  {
    id: "8a",
    name: "SBA 8(a) Business Development Program",
    level: "Federal",
    applyUrl: "https://certifications.sba.gov/",
    priority: 4,
    matches: (profile) =>
      profile.minorityOwned && profile.yearsInBusiness >= 2,
    reason: () =>
      "Your business appears to meet basic ownership and time-in-business signals for SBA 8(a), making it a strong advanced opportunity after local certifications.",
    requiredDocs: [
      "Business License",
      "EIN Letter",
      "Articles / Operating Agreement",
      "Ownership Documents",
      "Tax Returns",
      "Owner Resume",
    ],
    unlockChecks: (profile) => {
      const missing: string[] = [];
      if (!profile.minorityOwned) missing.push("Socially disadvantaged ownership qualification");
      if (profile.yearsInBusiness < 2) missing.push("Two years in business");
      if (!profile.hasOwnershipDocs) missing.push("Ownership documentation");
      if (!profile.hasTaxReturns) missing.push("Tax returns");
      if (!profile.hasResume) missing.push("Owner resume");
      return missing;
    },
  },
  {
    id: "wbe",
    name: "Women Business Enterprise (WBE)",
    level: "City / State",
    applyUrl:
      "https://www.dms.myflorida.com/business_operations/state_purchasing/office_of_supplier_development_osd/get_certified",
    priority: 5,
    matches: (profile) => profile.womanOwned,
    reason: () =>
      "Your business appears to be woman-owned, which may qualify you for WBE certification.",
    requiredDocs: [
      "Business License",
      "EIN Letter",
      "Articles / Operating Agreement",
      "Ownership Documents",
    ],
    unlockChecks: (profile) => {
      const missing: string[] = [];
      if (!profile.womanOwned) missing.push("Woman ownership qualification");
      return missing;
    },
  },
  {
    id: "vbe",
    name: "Veteran Business Enterprise (VBE)",
    level: "State / Local",
    applyUrl:
      "https://www.dms.myflorida.com/business_operations/state_purchasing/office_of_supplier_development_osd/get_certified",
    priority: 6,
    matches: (profile) => profile.veteranOwned,
    reason: () =>
      "Your business appears to be veteran-owned, which may qualify you for veteran-focused certification programs.",
    requiredDocs: [
      "Business License",
      "EIN Letter",
      "Articles / Operating Agreement",
      "Ownership Documents",
      "Owner Resume",
    ],
    unlockChecks: (profile) => {
      const missing: string[] = [];
      if (!profile.veteranOwned) missing.push("Veteran ownership qualification");
      return missing;
    },
  },
];

function calculateConfidence(
  profile: UserProfile,
  requiredDocs: string[],
  priority: number
) {
  let score = 65;

  if (profile.minorityOwned) score += 8;
  if (profile.womanOwned) score += 6;
  if (profile.veteranOwned) score += 6;
  if (profile.revenue > 0) score += 6;
  if (profile.yearsInBusiness >= 2) score += 8;

  const missingDocs = getMissingDocs(profile, requiredDocs);
  score -= missingDocs.length * 5;
  score -= Math.max(0, priority - 1) * 2;

  if (score > 98) score = 98;
  if (score < 55) score = 55;

  return score;
}

function buildMatches(profile: UserProfile): CertificationMatch[] {
  return certificationRules
    .filter((rule) => rule.matches(profile))
    .map((rule) => {
      const missingDocs = getMissingDocs(profile, rule.requiredDocs);

      return {
        id: rule.id,
        name: rule.name,
        level: rule.level,
        reason: rule.reason(profile),
        applyUrl: rule.applyUrl,
        priority: rule.priority,
        confidence: calculateConfidence(
          profile,
          rule.requiredDocs,
          rule.priority
        ),
        missingDocs,
      };
    })
    .sort((a, b) => a.priority - b.priority);
}

function buildUnlockCandidates(
  profile: UserProfile,
  matchedCertifications: CertificationMatch[]
): UnlockCandidate[] {
  const matchedIds = new Set(matchedCertifications.map((item) => item.id));

  return certificationRules
    .filter((rule) => !matchedIds.has(rule.id))
    .map((rule) => {
      const missingItems = rule.unlockChecks(profile);
      return {
        id: rule.id,
        name: rule.name,
        level: rule.level,
        applyUrl: rule.applyUrl,
        stepsAway: missingItems.length,
        missingItems,
        reason:
          missingItems.length <= 2
            ? "You are close to unlocking this certification with a few targeted improvements."
            : "This certification needs a few more profile or document improvements before it becomes a strong match.",
      };
    })
    .filter((item) => item.stepsAway > 0 && item.stepsAway <= 3)
    .sort((a, b) => a.stepsAway - b.stepsAway)
    .slice(0, 3);
}

function buildActionPlan(matches: CertificationMatch[]): ActionPlanItem[] {
  const missingDocsSet = new Set<string>();

  matches.forEach((match) => {
    match.missingDocs.forEach((doc) => missingDocsSet.add(doc));
  });

  const missingDocs = Array.from(missingDocsSet);
  const actionPlan: ActionPlanItem[] = [];

  if (missingDocs.length > 0) {
    actionPlan.push({
      title: "Gather Missing Documents",
      description: `Upload or organize these items first: ${missingDocs.join(", ")}.`,
    });
  } else {
    actionPlan.push({
      title: "Documents Look Strong",
      description:
        "Your uploaded records cover the most common document requirements for the certifications currently matched.",
    });
  }

  if (matches.some((m) => m.id === "sbe") || matches.some((m) => m.id === "mbe")) {
    actionPlan.push({
      title: "Start with Local Certifications",
      description:
        "Apply to SBE or MBE first so you can build momentum and complete the easier local certification workflow before moving into more advanced programs.",
    });
  }

  if (matches.some((m) => m.id === "dbe")) {
    actionPlan.push({
      title: "Prepare for DBE Review",
      description:
        "Double-check ownership, control, tax returns, and resume documents before starting the DBE application.",
    });
  }

  if (matches.some((m) => m.id === "8a")) {
    actionPlan.push({
      title: "Prepare for SBA 8(a)",
      description:
        "Since you appear eligible for SBA 8(a), gather business history, tax returns, and ownership/control documentation before you apply.",
    });
  }

  if (matches.length === 0) {
    actionPlan.push({
      title: "Complete More Profile Information",
      description:
        "We could not confidently match certifications yet. Complete more assessment and readiness fields and upload supporting documents.",
    });
  }

  actionPlan.push({
    title: "Use the AI Results Assistant",
    description:
      "Ask follow-up questions about why you matched, what documents are missing, and which certification to pursue first.",
    });

  return actionPlan;
}

function buildReadiness(
  profile: UserProfile,
  matches: CertificationMatch[]
): ReadinessBreakdown {
  const documentFlags = [
    profile.hasBusinessLicense,
    profile.hasEinLetter,
    profile.hasArticles,
    profile.hasOwnershipDocs,
    profile.hasTaxReturns,
    profile.hasResume,
  ];

  const documents = Math.round(
    (documentFlags.filter(Boolean).length / documentFlags.length) * 100
  );

  const profileFlags = [
    profile.revenue > 0,
    profile.yearsInBusiness > 0,
    !!profile.location,
    profile.minorityOwned || profile.womanOwned || profile.veteranOwned,
  ];

  const profileScore = Math.round(
    (profileFlags.filter(Boolean).length / profileFlags.length) * 100
  );

  const avgConfidence =
    matches.length > 0
      ? Math.round(
          matches.reduce((sum, item) => sum + item.confidence, 0) / matches.length
        )
      : 0;

  const eligibility = avgConfidence;
  const overall = Math.round((documents + profileScore + eligibility) / 3);

  return {
    overall,
    documents,
    profile: profileScore,
    eligibility,
  };
}

function buildBestStartingPoint(
  matches: CertificationMatch[]
): BestStartingPoint | null {
  if (!matches.length) return null;

  const best = [...matches].sort((a, b) => a.priority - b.priority)[0];

  return {
    id: best.id,
    name: best.name,
    level: best.level,
    reason: best.reason,
    confidence: best.confidence,
    applyUrl: best.applyUrl,
  };
}

function buildSourceSummary(
  rawResults: unknown,
  documentsPayload: unknown,
  profile: UserProfile
) {
  return {
    pulledResults: Boolean(rawResults),
    pulledDocuments: Boolean(documentsPayload),
    profileSnapshot: profile,
  };
}

export async function GET(req: NextRequest) {
  try {
    const origin = req.nextUrl.origin;

    const [rawResults, documentsPayload] = await Promise.all([
      safeFetchJson(`${origin}/api/results`),
      safeFetchJson(`${origin}/api/documents`),
    ]);

    const uploadedDocs = extractUploadedDocs(documentsPayload);
    const profile = deriveProfileFromData(rawResults, uploadedDocs);
    const matchedCertifications = buildMatches(profile);
    const unlockCandidates = buildUnlockCandidates(profile, matchedCertifications);
    const actionPlan = buildActionPlan(matchedCertifications);
    const readiness = buildReadiness(profile, matchedCertifications);
    const bestStartingPoint = buildBestStartingPoint(matchedCertifications);

    return NextResponse.json({
      matchedCertifications,
      unlockCandidates,
      actionPlan,
      readiness,
      bestStartingPoint,
      sourceSummary: buildSourceSummary(rawResults, documentsPayload, profile),
      uploadedDocuments: uploadedDocs,
    });
  } catch {
    return NextResponse.json(
      {
        error: "Failed to generate latest results from live data.",
      },
      { status: 500 }
    );
  }
}