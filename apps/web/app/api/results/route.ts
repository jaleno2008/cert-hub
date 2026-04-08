import { NextRequest, NextResponse } from "next/server";

type CertificationLevel = "federal" | "state" | "county" | "city";
type CertificationStatus = "ready" | "almost" | "not_ready";

type AssessmentPayload = {
  location?: string;
  state?: string;
  county?: string;
  city?: string;
  disadvantaged?: boolean;
  personalNetWorthUnderThreshold?: boolean;
  businessYears?: number;

  hasBusinessRegistration?: boolean;
  hasEIN?: boolean;
  hasBusinessLicense?: boolean;
  hasBankingInfo?: boolean;
  hasFinancialStatements?: boolean;
  hasCapabilityStatement?: boolean;
  hasTaxReturns?: boolean;
  hasLocalPresence?: boolean;
};

type CertificationMatch = {
  id: string;
  name: string;
  level: CertificationLevel;
  agency: string;
  description: string;
  requirements: string[];
  recommended: boolean;
  applyUrl: string;
  whyMatched: string;
  status: CertificationStatus;
  missingItems: string[];
};

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeBoolean(value: unknown): boolean {
  return value === true;
}

function normalizeNumber(value: unknown): number {
  return typeof value === "number" && !Number.isNaN(value) ? value : 0;
}

function getStatusFromMissingCount(missingCount: number): CertificationStatus {
  if (missingCount === 0) return "ready";
  if (missingCount <= 2) return "almost";
  return "not_ready";
}

function scorePayload(input: Required<AssessmentPayload>) {
  const weights = {
    hasBusinessRegistration: 12,
    hasEIN: 10,
    hasBusinessLicense: 8,
    hasBankingInfo: 8,
    hasFinancialStatements: 14,
    hasCapabilityStatement: 12,
    hasTaxReturns: 10,
    hasLocalPresence: 6,
    disadvantaged: 10,
    personalNetWorthUnderThreshold: 10,
  };

  const baseScore =
    (input.hasBusinessRegistration ? weights.hasBusinessRegistration : 0) +
    (input.hasEIN ? weights.hasEIN : 0) +
    (input.hasBusinessLicense ? weights.hasBusinessLicense : 0) +
    (input.hasBankingInfo ? weights.hasBankingInfo : 0) +
    (input.hasFinancialStatements ? weights.hasFinancialStatements : 0) +
    (input.hasCapabilityStatement ? weights.hasCapabilityStatement : 0) +
    (input.hasTaxReturns ? weights.hasTaxReturns : 0) +
    (input.hasLocalPresence ? weights.hasLocalPresence : 0) +
    (input.disadvantaged ? weights.disadvantaged : 0) +
    (input.personalNetWorthUnderThreshold
      ? weights.personalNetWorthUnderThreshold
      : 0);

  const yearsBonus =
    input.businessYears >= 5 ? 10 : input.businessYears >= 2 ? 6 : input.businessYears >= 1 ? 3 : 0;

  return Math.max(0, Math.min(100, baseScore + yearsBonus));
}

function buildNextStep(
  input: Required<AssessmentPayload>,
  matches: CertificationMatch[]
): string {
  if (!input.hasBusinessRegistration) {
    return "Complete business registration first to unlock state, local, and federal contracting pathways.";
  }

  if (!input.hasEIN) {
    return "Get your EIN next so your business is positioned for vendor registration and certification readiness.";
  }

  if (!input.hasBankingInfo) {
    return "Add business banking information next so you can move forward with federal and certification readiness steps.";
  }

  if (!input.hasCapabilityStatement) {
    return "Create your capability statement next. It is one of the fastest ways to strengthen readiness and credibility.";
  }

  if (!input.hasFinancialStatements) {
    return "Prepare financial statements next. They are a major readiness blocker for advanced certifications.";
  }

  const readyMatch = matches.find((m) => m.status === "ready");
  if (readyMatch) {
    return `You are in strong shape. Review ${readyMatch.name} and begin preparing to apply.`;
  }

  const almostMatch = matches.find((m) => m.status === "almost");
  if (almostMatch) {
    return `Focus on the missing items for ${almostMatch.name} first to move it into ready-to-apply status.`;
  }

  return "Strengthen your documentation foundation first, then return to results to see stronger certification matches.";
}

function buildMatches(input: Required<AssessmentPayload>): CertificationMatch[] {
  const matches: CertificationMatch[] = [];

  // SAM Registration
  {
    const missingItems: string[] = [];
    if (!input.hasBusinessRegistration) missingItems.push("Business registration is required");
    if (!input.hasEIN) missingItems.push("EIN is required");
    if (!input.hasBankingInfo) missingItems.push("Banking information is required");

    matches.push({
      id: "sam-registration",
      name: "SAM Registration",
      level: "federal",
      agency: "U.S. Federal Government",
      description: "Required to do business with the federal government.",
      requirements: ["Business Registration", "EIN", "Banking Information"],
      recommended: true,
      applyUrl: "https://sam.gov",
      whyMatched: "Every contractor must start here.",
      status: getStatusFromMissingCount(missingItems.length),
      missingItems,
    });
  }

  // SBA 8(a)
  if (input.disadvantaged || input.personalNetWorthUnderThreshold) {
    const missingItems: string[] = [];
    if (!input.disadvantaged) missingItems.push("Must qualify as socially disadvantaged");
    if (!input.personalNetWorthUnderThreshold) {
      missingItems.push("Must meet SBA net worth limits");
    }
    if (input.businessYears < 2) {
      missingItems.push("2 years in business is preferred");
    }
    if (!input.hasFinancialStatements) {
      missingItems.push("Financial statements are required");
    }

    matches.push({
      id: "sba-8a",
      name: "SBA 8(a) Business Development Program",
      level: "federal",
      agency: "U.S. Small Business Administration",
      description:
        "Federal certification for disadvantaged businesses seeking federal opportunities.",
      requirements: [
        "Disadvantaged Ownership",
        "Economic Eligibility",
        "2 Years in Business",
        "Financial Statements",
      ],
      recommended: true,
      applyUrl:
        "https://www.sba.gov/federal-contracting/contracting-assistance-programs/8a-business-development-program#apply-to-get-certified-as-an-8a-small-business",
      whyMatched: "High-value federal program.",
      status: getStatusFromMissingCount(missingItems.length),
      missingItems,
    });
  }

  // FDOT DBE
  if (normalizeString(input.state).toLowerCase().includes("florida")) {
    const missingItems: string[] = [];
    if (!input.disadvantaged) {
      missingItems.push("Must qualify as socially disadvantaged");
    }
    if (!input.personalNetWorthUnderThreshold) {
      missingItems.push("Must meet DBE net worth limits");
    }
    if (!input.hasCapabilityStatement) {
      missingItems.push("Capability statement is required");
    }

    matches.push({
      id: "fdot-dbe",
      name: "Disadvantaged Business Enterprise (DBE)",
      level: "state",
      agency: "Florida Department of Transportation (FDOT)",
      description:
        "Transportation-related certification for infrastructure and transit opportunities.",
      requirements: [
        "Disadvantaged Ownership",
        "Net Worth Eligibility",
        "Capability Statement",
      ],
      recommended: true,
      applyUrl: "https://www.fdot.gov/BusinessGrowth/small-business-program.shtm",
      whyMatched: "Strong pathway for transportation and infrastructure contracts.",
      status: getStatusFromMissingCount(missingItems.length),
      missingItems,
    });
  }

  // Florida OSD
  if (normalizeString(input.state).toLowerCase().includes("florida")) {
    const missingItems: string[] = [];
    if (!input.hasBusinessRegistration) {
      missingItems.push("Florida business registration is required");
    }
    if (!input.hasBusinessLicense) {
      missingItems.push("Business license is required");
    }

    matches.push({
      id: "florida-osd",
      name: "Florida Office of Supplier Diversity Certification",
      level: "state",
      agency: "State of Florida",
      description: "State-level certification for small businesses in Florida.",
      requirements: ["Florida Business Registration", "Business License"],
      recommended: true,
      applyUrl:
        "https://www.dms.myflorida.com/business_operations/state_purchasing/office_of_supplier_development_osd/get_certified",
      whyMatched: "Strong state-level opportunity path.",
      status: getStatusFromMissingCount(missingItems.length),
      missingItems,
    });
  }

  // Miami-Dade SBE
  if (normalizeString(input.county).toLowerCase().includes("miami")) {
    const missingItems: string[] = [];
    if (!input.hasLocalPresence) {
      missingItems.push("Local eligibility is required");
    }

    matches.push({
      id: "miami-dade-sbe",
      name: "Miami-Dade SBE",
      level: "county",
      agency: "Miami-Dade County",
      description: "County certification for small businesses.",
      requirements: ["Local Eligibility"],
      recommended: true,
      applyUrl:
        "https://www.miamidade.gov/global/business/small-business/sbe-program.page",
      whyMatched: "Local opportunity.",
      status: getStatusFromMissingCount(missingItems.length),
      missingItems,
    });
  }

  // City of Miami Vendor Registration
  if (normalizeString(input.city).toLowerCase().includes("miami")) {
    const missingItems: string[] = [];
    if (!input.hasBusinessLicense) {
      missingItems.push("Business license is required");
    }

    matches.push({
      id: "city-of-miami-vendor",
      name: "City of Miami Vendor Registration",
      level: "city",
      agency: "City of Miami",
      description: "Register to do business with the City of Miami.",
      requirements: ["Business License"],
      recommended: true,
      applyUrl:
        "https://www.miami.gov/Business-Licenses/Doing-Business-with-the-City/Register-as-a-City-Supplier-Vendor",
      whyMatched: "Good local entry point for city opportunities.",
      status: getStatusFromMissingCount(missingItems.length),
      missingItems,
    });
  }

  return matches;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AssessmentPayload;

    const input: Required<AssessmentPayload> = {
      location: normalizeString(body.location),
      state: normalizeString(body.state),
      county: normalizeString(body.county),
      city: normalizeString(body.city),
      disadvantaged: normalizeBoolean(body.disadvantaged),
      personalNetWorthUnderThreshold: normalizeBoolean(
        body.personalNetWorthUnderThreshold
      ),
      businessYears: normalizeNumber(body.businessYears),

      hasBusinessRegistration: normalizeBoolean(body.hasBusinessRegistration),
      hasEIN: normalizeBoolean(body.hasEIN),
      hasBusinessLicense: normalizeBoolean(body.hasBusinessLicense),
      hasBankingInfo: normalizeBoolean(body.hasBankingInfo),
      hasFinancialStatements: normalizeBoolean(body.hasFinancialStatements),
      hasCapabilityStatement: normalizeBoolean(body.hasCapabilityStatement),
      hasTaxReturns: normalizeBoolean(body.hasTaxReturns),
      hasLocalPresence: normalizeBoolean(body.hasLocalPresence),
    };

    const matches = buildMatches(input);
    const score = scorePayload(input);
    const nextStep = buildNextStep(input, matches);

    return NextResponse.json({
      success: true,
      score,
      nextStep,
      matches,
    });
  } catch (error) {
    console.error("Results API error:", error);

    return NextResponse.json(
      {
        success: false,
        score: 0,
        nextStep: "Unable to load results right now.",
        matches: [],
      },
      { status: 500 }
    );
  }
}