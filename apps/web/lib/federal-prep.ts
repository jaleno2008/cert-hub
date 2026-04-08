export const FEDERAL_STORAGE_KEYS = {
  wizard: "federalWizardState",
} as const;

export type FederalTrack = "8a";

export type FederalSetupStatus = "not_started" | "in_progress" | "complete";
export type YesNoUnknown = "yes" | "no" | "not_sure";
export type ReadinessLevel = "strong" | "needs_attention" | "missing";

export type FederalProfile = {
  legalBusinessName: string;
  dbaName: string;
  entityType: string;
  ownerName: string;
  ownerTitle: string;
  companyEmail: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  industry: string;
  naicsCode: string;
  website: string;
  yearsInBusiness: string;
  annualRevenue: string;
  employeeCount: string;
  einStatus: "has-ein" | "applying" | "no-ein";
  ein: string;
  ueiStatus: "has-uei" | "applying" | "no-uei";
  uei: string;
  samStatus: "active" | "in_progress" | "not_started" | "not_sure";
  cageCode: string;
};

export type Federal8aEligibility = {
  targetTrack: FederalTrack;
  sociallyDisadvantaged: YesNoUnknown;
  economicallyDisadvantaged: YesNoUnknown;
  ownerCitizenStatus: YesNoUnknown;
  ownerControlsBusiness: YesNoUnknown;
  ownerManagesDayToDay: YesNoUnknown;
  disadvantagedOwnerPercent: string;
  businessInGoodStanding: YesNoUnknown;
  taxesCurrent: YesNoUnknown;
  priorFederalWork: YesNoUnknown;
  capabilityStatementReady: YesNoUnknown;
  financialStatementsReady: YesNoUnknown;
  taxReturnsReady: YesNoUnknown;
  businessHistoryStrong: YesNoUnknown;
  notes: string;
};

export type Federal8aSectionKey =
  | "business"
  | "ownership"
  | "control"
  | "disadvantage"
  | "financials"
  | "documents";

export type Federal8aSectionAnswer = {
  status: FederalSetupStatus;
  startedAt: string | null;
  updatedAt: string | null;
  answers: Record<string, string>;
  notes: string;
};

export type Federal8aSections = Record<
  Federal8aSectionKey,
  Federal8aSectionAnswer
>;

export type FederalDocumentCategory =
  | "federal_setup"
  | "identity"
  | "ownership"
  | "control"
  | "financial"
  | "tax"
  | "operations"
  | "narrative";

export type FederalDocumentStatus =
  | "missing"
  | "planned"
  | "uploaded"
  | "verified";

export type FederalDocumentItem = {
  id: string;
  label: string;
  category: FederalDocumentCategory;
  requiredFor: Array<FederalTrack | Federal8aSectionKey>;
  description: string;
  status: FederalDocumentStatus;
  fileName: string;
  url: string;
};

export type FederalReadinessIssue = {
  id: string;
  label: string;
  description: string;
  severity: ReadinessLevel;
  actionLabel: string;
  href: string;
};

export type FederalReviewSummary = {
  readinessScore: number;
  readinessLevel: ReadinessLevel;
  recommendedTrack: FederalTrack;
  setupComplete: boolean;
  missingSetupItems: string[];
  missingDocuments: string[];
  strongSections: Federal8aSectionKey[];
  weakSections: Federal8aSectionKey[];
  issues: FederalReadinessIssue[];
  nextSteps: string[];
};

export type FederalPrepPacket = {
  title: string;
  overview: string;
  sections: Array<{
    title: string;
    summary: string;
  }>;
  nextSteps: string[];
  documentOrder: string[];
};

export type FederalWizardState = {
  profile: FederalProfile;
  eligibility: Federal8aEligibility;
  sections: Federal8aSections;
  documents: FederalDocumentItem[];
  review: FederalReviewSummary | null;
};

export type FederalSectionDefinition = {
  key: Federal8aSectionKey;
  step: number;
  title: string;
  shortTitle: string;
  officialLabel?: string;
  applicantNote?: string;
  description: string;
  whyItMatters: string;
  nextStepLabel: string;
  questions: Array<{
    id: string;
    label: string;
    helpText: string;
    explainWhy: string;
    exampleAnswer?: string;
    type: "text" | "textarea" | "select" | "radio" | "number";
    placeholder?: string;
    options?: Array<{ label: string; value: string }>;
    required?: boolean;
    documentHints?: string[];
  }>;
};

export const getEmptyFederalProfile = (): FederalProfile => ({
  legalBusinessName: "",
  dbaName: "",
  entityType: "",
  ownerName: "",
  ownerTitle: "",
  companyEmail: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  industry: "",
  naicsCode: "",
  website: "",
  yearsInBusiness: "",
  annualRevenue: "",
  employeeCount: "",
  einStatus: "no-ein",
  ein: "",
  ueiStatus: "no-uei",
  uei: "",
  samStatus: "not_started",
  cageCode: "",
});

export const getEmptyFederal8aEligibility = (): Federal8aEligibility => ({
  targetTrack: "8a",
  sociallyDisadvantaged: "not_sure",
  economicallyDisadvantaged: "not_sure",
  ownerCitizenStatus: "not_sure",
  ownerControlsBusiness: "not_sure",
  ownerManagesDayToDay: "not_sure",
  disadvantagedOwnerPercent: "",
  businessInGoodStanding: "not_sure",
  taxesCurrent: "not_sure",
  priorFederalWork: "not_sure",
  capabilityStatementReady: "not_sure",
  financialStatementsReady: "not_sure",
  taxReturnsReady: "not_sure",
  businessHistoryStrong: "not_sure",
  notes: "",
});

export const getEmptyFederal8aSections = (): Federal8aSections => ({
  business: {
    status: "not_started",
    startedAt: null,
    updatedAt: null,
    answers: {},
    notes: "",
  },
  ownership: {
    status: "not_started",
    startedAt: null,
    updatedAt: null,
    answers: {},
    notes: "",
  },
  control: {
    status: "not_started",
    startedAt: null,
    updatedAt: null,
    answers: {},
    notes: "",
  },
  disadvantage: {
    status: "not_started",
    startedAt: null,
    updatedAt: null,
    answers: {},
    notes: "",
  },
  financials: {
    status: "not_started",
    startedAt: null,
    updatedAt: null,
    answers: {},
    notes: "",
  },
  documents: {
    status: "not_started",
    startedAt: null,
    updatedAt: null,
    answers: {},
    notes: "",
  },
});

export const getEmptyFederalWizardState = (): FederalWizardState => ({
  profile: getEmptyFederalProfile(),
  eligibility: getEmptyFederal8aEligibility(),
  sections: getEmptyFederal8aSections(),
  documents: [],
  review: null,
});

export const normalizeFederalWizardState = (
  input: Partial<FederalWizardState> | null | undefined,
): FederalWizardState => {
  const base = getEmptyFederalWizardState();

  return {
    profile: { ...base.profile, ...(input?.profile ?? {}) },
    eligibility: { ...base.eligibility, ...(input?.eligibility ?? {}) },
    sections: {
      business: {
        ...base.sections.business,
        ...(input?.sections?.business ?? {}),
        answers: {
          ...base.sections.business.answers,
          ...(input?.sections?.business?.answers ?? {}),
        },
      },
      ownership: {
        ...base.sections.ownership,
        ...(input?.sections?.ownership ?? {}),
        answers: {
          ...base.sections.ownership.answers,
          ...(input?.sections?.ownership?.answers ?? {}),
        },
      },
      control: {
        ...base.sections.control,
        ...(input?.sections?.control ?? {}),
        answers: {
          ...base.sections.control.answers,
          ...(input?.sections?.control?.answers ?? {}),
        },
      },
      disadvantage: {
        ...base.sections.disadvantage,
        ...(input?.sections?.disadvantage ?? {}),
        answers: {
          ...base.sections.disadvantage.answers,
          ...(input?.sections?.disadvantage?.answers ?? {}),
        },
      },
      financials: {
        ...base.sections.financials,
        ...(input?.sections?.financials ?? {}),
        answers: {
          ...base.sections.financials.answers,
          ...(input?.sections?.financials?.answers ?? {}),
        },
      },
      documents: {
        ...base.sections.documents,
        ...(input?.sections?.documents ?? {}),
        answers: {
          ...base.sections.documents.answers,
          ...(input?.sections?.documents?.answers ?? {}),
        },
      },
    },
    documents: Array.isArray(input?.documents) ? input!.documents : [],
    review: input?.review ?? null,
  };
};

export const FEDERAL_SETUP_REQUIRED_FIELDS: Array<keyof FederalProfile> = [
  "legalBusinessName",
  "ownerName",
  "companyEmail",
  "phone",
  "address1",
  "city",
  "state",
  "zip",
  "entityType",
  "industry",
];

export const getFederalSetupItems = (profile: FederalProfile) => [
  {
    id: "business_identity",
    label: "Business identity",
    complete: FEDERAL_SETUP_REQUIRED_FIELDS.every((field) =>
      String(profile[field] ?? "").trim().length > 0,
    ),
    href: "/federal/setup",
  },
  {
    id: "ein",
    label: "EIN",
    complete:
      profile.einStatus === "has-ein" && profile.ein.replace(/\D/g, "").length === 9,
    href: "https://www.irs.gov/businesses/small-businesses-self-employed/employer-id-numbers",
  },
  {
    id: "uei",
    label: "UEI",
    complete: profile.ueiStatus === "has-uei" && profile.uei.trim().length > 0,
    href: "/federal/setup",
  },
  {
    id: "sam",
    label: "SAM.gov registration",
    complete: profile.samStatus === "active",
    href: "https://sam.gov",
  },
];

export const getMissingFederalSetupItems = (profile: FederalProfile) =>
  getFederalSetupItems(profile).filter((item) => !item.complete);

export const isFederalSetupComplete = (profile: FederalProfile) =>
  getMissingFederalSetupItems(profile).length === 0;

export const getSectionCompletionScore = (
  section: Federal8aSectionAnswer,
  definition: FederalSectionDefinition,
) => {
  const requiredQuestions = definition.questions.filter((question) => question.required);
  if (requiredQuestions.length === 0) return 100;

  const answeredCount = requiredQuestions.filter((question) =>
    String(section.answers[question.id] ?? "").trim().length > 0,
  ).length;

  return Math.round((answeredCount / requiredQuestions.length) * 100);
};

export const getSectionStatus = (score: number): ReadinessLevel => {
  if (score >= 85) return "strong";
  if (score >= 50) return "needs_attention";
  return "missing";
};

export const getSectionScores = (
  sections: Federal8aSections,
  definitions: Record<Federal8aSectionKey, FederalSectionDefinition>,
) =>
  (Object.keys(sections) as Federal8aSectionKey[]).map((key) => {
    const score = getSectionCompletionScore(sections[key], definitions[key]);
    return {
      key,
      score,
      level: getSectionStatus(score),
    };
  });

export const getMissingDocumentLabels = (documents: FederalDocumentItem[]) =>
  documents
    .filter((item) => item.status === "missing" || item.status === "planned")
    .map((item) => item.label);

const pushDocument = (
  items: FederalDocumentItem[],
  item: FederalDocumentItem,
) => {
  if (items.some((existing) => existing.id === item.id)) return;
  items.push(item);
};

const getDocumentPriority = (document: FederalDocumentItem) => {
  const categoryPriority: Record<FederalDocumentCategory, number> = {
    federal_setup: 1,
    ownership: 2,
    control: 3,
    financial: 4,
    tax: 5,
    identity: 6,
    operations: 7,
    narrative: 8,
  };

  const statusPriority: Record<FederalDocumentStatus, number> = {
    missing: 1,
    planned: 2,
    uploaded: 3,
    verified: 4,
  };

  return categoryPriority[document.category] * 10 + statusPriority[document.status];
};

export const buildFederalDocumentPlan = (
  state: FederalWizardState,
): FederalDocumentItem[] => {
  const items: FederalDocumentItem[] = [];

  pushDocument(items, {
    id: "ein_letter",
    label: "EIN letter or EIN confirmation",
    category: "federal_setup",
    requiredFor: ["8a", "documents"],
    description: "Use the IRS EIN confirmation if the EIN is already in place.",
    status:
      state.profile.einStatus === "has-ein" && state.profile.ein
        ? "uploaded"
        : state.profile.einStatus === "applying"
          ? "planned"
          : "missing",
    fileName: "",
    url: "",
  });

  pushDocument(items, {
    id: "uei_confirmation",
    label: "UEI confirmation",
    category: "federal_setup",
    requiredFor: ["8a", "documents"],
    description: "This shows the business has its Unique Entity ID ready for the federal path.",
    status:
      state.profile.ueiStatus === "has-uei"
        ? "uploaded"
        : state.profile.ueiStatus === "applying"
          ? "planned"
          : "missing",
    fileName: "",
    url: "",
  });

  pushDocument(items, {
    id: "sam_confirmation",
    label: "SAM.gov registration proof",
    category: "federal_setup",
    requiredFor: ["8a", "documents"],
    description: "This confirms SAM.gov is active or moving.",
    status:
      state.profile.samStatus === "active"
        ? "verified"
        : state.profile.samStatus === "in_progress"
          ? "planned"
          : "missing",
    fileName: "",
    url: "",
  });

  pushDocument(items, {
    id: "ownership_documents",
    label: "Ownership documents",
    category: "ownership",
    requiredFor: ["8a", "ownership", "documents"],
    description: "Operating agreement, bylaws, stock ledger, or member records.",
    status:
      state.sections.ownership.answers.ownership_documents_ready === "yes"
        ? "uploaded"
        : state.sections.ownership.answers.ownership_documents_ready === "not_sure"
          ? "planned"
          : "missing",
    fileName: "",
    url: "",
  });

  pushDocument(items, {
    id: "control_support",
    label: "Control support records",
    category: "control",
    requiredFor: ["8a", "control", "documents"],
    description: "Examples include bank signature authority, resolutions, or an org chart.",
    status: state.sections.control.answers.signing_authority ? "planned" : "missing",
    fileName: "",
    url: "",
  });

  pushDocument(items, {
    id: "identity_documents",
    label: "Identity or citizenship documents",
    category: "identity",
    requiredFor: ["8a", "disadvantage", "documents"],
    description: "Identity support for the qualifying owner.",
    status:
      state.sections.disadvantage.answers.citizenship_ready === "yes"
        ? "uploaded"
        : state.sections.disadvantage.answers.citizenship_ready === "not_sure"
          ? "planned"
          : "missing",
    fileName: "",
    url: "",
  });

  pushDocument(items, {
    id: "business_tax_returns",
    label: "Business tax returns",
    category: "tax",
    requiredFor: ["8a", "financials", "documents"],
    description: "Recent business tax returns that support financial readiness.",
    status:
      state.sections.financials.answers.business_tax_returns === "yes"
        ? "uploaded"
        : state.sections.financials.answers.business_tax_returns === "not_sure"
          ? "planned"
          : "missing",
    fileName: "",
    url: "",
  });

  pushDocument(items, {
    id: "financial_statements",
    label: "Business financial statements",
    category: "financial",
    requiredFor: ["8a", "financials", "documents"],
    description: "Profit and loss statements, balance sheets, or other current records.",
    status:
      state.sections.financials.answers.financial_statements === "yes"
        ? "uploaded"
        : state.sections.financials.answers.financial_statements === "not_sure"
          ? "planned"
          : "missing",
    fileName: "",
    url: "",
  });

  pushDocument(items, {
    id: "capability_statement",
    label: "Capability statement",
    category: "operations",
    requiredFor: ["8a", "business", "documents"],
    description: "A one-page company summary for the federal contracting path.",
    status: state.eligibility.capabilityStatementReady === "yes" ? "uploaded" : "planned",
    fileName: "",
    url: "",
  });

  pushDocument(items, {
    id: "social_narrative",
    label: "Eligibility narrative notes",
    category: "narrative",
    requiredFor: ["8a", "disadvantage", "documents"],
    description: "Prep notes that help shape the later personal eligibility narrative.",
    status: state.sections.disadvantage.answers.social_disadvantage_basis ? "planned" : "missing",
    fileName: "",
    url: "",
  });

  return [...items].sort((left, right) => getDocumentPriority(left) - getDocumentPriority(right));
};

export const getFederalReadinessScore = (
  state: FederalWizardState,
  definitions: Record<Federal8aSectionKey, FederalSectionDefinition>,
) => {
  const setupItems = getFederalSetupItems(state.profile);
  const setupScore =
    (setupItems.filter((item) => item.complete).length / setupItems.length) * 30;

  const eligibilitySignals = [
    state.eligibility.sociallyDisadvantaged,
    state.eligibility.economicallyDisadvantaged,
    state.eligibility.ownerCitizenStatus,
    state.eligibility.ownerControlsBusiness,
    state.eligibility.ownerManagesDayToDay,
    state.eligibility.businessInGoodStanding,
    state.eligibility.taxesCurrent,
    state.eligibility.capabilityStatementReady,
    state.eligibility.financialStatementsReady,
    state.eligibility.taxReturnsReady,
    state.eligibility.businessHistoryStrong,
  ];

  const yesCount = eligibilitySignals.filter((value) => value === "yes").length;
  const notSureCount = eligibilitySignals.filter((value) => value === "not_sure").length;
  const eligibilityScore =
    ((yesCount + notSureCount * 0.45) / eligibilitySignals.length) * 35;

  const sectionScores = getSectionScores(state.sections, definitions);
  const averageSectionScore =
    sectionScores.reduce((sum, entry) => sum + entry.score, 0) /
    Math.max(sectionScores.length, 1);
  const sectionWeighted = (averageSectionScore / 100) * 25;

  const docsReady = state.documents.length
    ? state.documents.filter(
        (item) => item.status === "uploaded" || item.status === "verified",
      ).length / state.documents.length
    : 0;
  const docsWeighted = docsReady * 10;

  return Math.round(setupScore + eligibilityScore + sectionWeighted + docsWeighted);
};

export const getFederalReadinessLevel = (score: number): ReadinessLevel => {
  if (score >= 80) return "strong";
  if (score >= 55) return "needs_attention";
  return "missing";
};

export const buildFederalIssues = (
  state: FederalWizardState,
  definitions: Record<Federal8aSectionKey, FederalSectionDefinition>,
): FederalReadinessIssue[] => {
  const issues: FederalReadinessIssue[] = [];

  getMissingFederalSetupItems(state.profile).forEach((item) => {
    issues.push({
      id: item.id,
      label: item.label,
      description: `${item.label} still needs attention before your federal prep path is fully ready.`,
      severity: "missing",
      actionLabel: "Fix this",
      href: item.href,
    });
  });

  if (state.eligibility.ownerControlsBusiness === "no") {
    issues.push({
      id: "owner_control",
      label: "Owner control",
      description: "The qualifying owner may not clearly control the business day to day.",
      severity: "needs_attention",
      actionLabel: "Review control",
      href: "/federal/8a/sections/control",
    });
  }

  if (state.eligibility.taxesCurrent === "no") {
    issues.push({
      id: "taxes",
      label: "Tax status",
      description: "Taxes need attention before you move deeper into the 8(a) path.",
      severity: "needs_attention",
      actionLabel: "Review financials",
      href: "/federal/8a/sections/financials",
    });
  }

  getSectionScores(state.sections, definitions)
    .filter((item) => item.level !== "strong")
    .forEach((item) => {
      issues.push({
        id: `section_${item.key}`,
        label: definitions[item.key].title,
        description: `${definitions[item.key].title} still needs stronger answers or more complete information.`,
        severity: item.level,
        actionLabel: "Continue section",
        href: `/federal/8a/sections/${item.key}`,
      });
    });

  state.documents
    .filter((item) => item.status === "missing")
    .forEach((item) => {
      issues.push({
        id: `document_${item.id}`,
        label: item.label,
        description: `${item.label} is still missing from your federal prep checklist.`,
        severity: "missing",
        actionLabel: "Go to documents",
        href: "/federal/8a/sections/documents",
      });
    });

  return issues;
};

export const buildFederalNextSteps = (state: FederalWizardState): string[] => {
  const steps: string[] = [];

  if (state.profile.einStatus !== "has-ein") {
    steps.push("Finish your EIN setup first.");
  }

  if (state.profile.ueiStatus !== "has-uei") {
    steps.push("Get your UEI so your federal setup is complete.");
  }

  if (state.profile.samStatus !== "active") {
    steps.push("Activate or finish your SAM.gov registration.");
  }

  if (state.eligibility.capabilityStatementReady !== "yes") {
    steps.push("Tighten your capability statement before moving deeper into federal applications.");
  }

  const missingDocs = getMissingDocumentLabels(state.documents).slice(0, 3);
  if (missingDocs.length > 0) {
    steps.push(`Gather these documents next: ${missingDocs.join(", ")}.`);
  }

  if (steps.length === 0) {
    steps.push("Move to final review and begin your 8(a) prep packet.");
  }

  return steps;
};

export const buildFederalReviewSummary = (
  state: FederalWizardState,
  definitions: Record<Federal8aSectionKey, FederalSectionDefinition>,
): FederalReviewSummary => {
  const readinessScore = getFederalReadinessScore(state, definitions);
  const sectionScores = getSectionScores(state.sections, definitions);

  return {
    readinessScore,
    readinessLevel: getFederalReadinessLevel(readinessScore),
    recommendedTrack: state.eligibility.targetTrack,
    setupComplete: isFederalSetupComplete(state.profile),
    missingSetupItems: getMissingFederalSetupItems(state.profile).map((item) => item.label),
    missingDocuments: getMissingDocumentLabels(state.documents),
    strongSections: sectionScores
      .filter((item) => item.level === "strong")
      .map((item) => item.key),
    weakSections: sectionScores
      .filter((item) => item.level !== "strong")
      .map((item) => item.key),
    issues: buildFederalIssues(state, definitions),
    nextSteps: buildFederalNextSteps(state),
  };
};

export const buildFederalPrepPacket = (
  state: FederalWizardState,
  definitions: Record<Federal8aSectionKey, FederalSectionDefinition>,
  summary: FederalReviewSummary,
): FederalPrepPacket => {
  const documentPlan = buildFederalDocumentPlan(state);

  return {
    title: `${state.profile.legalBusinessName || "Business"} - SBA 8(a) Prep Packet`,
    overview:
      "This prep packet organizes the business profile, current readiness picture, and the strongest next actions before the applicant begins the full federal application path.",
    sections: (Object.keys(definitions) as Federal8aSectionKey[]).map((key) => {
      const definition = definitions[key];
      const answers = state.sections[key].answers;
      const summaryLine =
        Object.values(answers).filter(Boolean).slice(0, 2).join(" | ") ||
        "This section still needs stronger detail.";

      return {
        title: definition.title,
        summary: summaryLine,
      };
    }),
    nextSteps: summary.nextSteps,
    documentOrder: documentPlan.map((item) => item.label),
  };
};

export const saveFederalWizardState = (state: FederalWizardState) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FEDERAL_STORAGE_KEYS.wizard, JSON.stringify(state));
};

export const loadFederalWizardState = (): FederalWizardState | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(FEDERAL_STORAGE_KEYS.wizard);
  if (!raw) return null;

  try {
    return normalizeFederalWizardState(JSON.parse(raw));
  } catch {
    return null;
  }
};
