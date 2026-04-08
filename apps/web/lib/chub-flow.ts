export const STORAGE_KEYS = {
  email: "chubUserEmail",
  assessment: "assessmentAnswers",
  assessmentComplete: "assessmentComplete",
  apply: "applyAnswers",
} as const;

export type AssessmentAnswers = {
  businessAge: string;
  registeredBusiness: string;
  annualRevenue: string;
  employees: string;
  targetCertification: string;
};

export type ApplyAnswers = {
  legalBusinessName: string;
  ownerName: string;
  companyEmail: string;
  phone: string;
  address1: string;
  city: string;
  stateRegistered: string;
  zipCode: string;
  industry: string;
  naicsStatus: string;
  naicsCodes: string;
  businessEntity: string;
  einStatus: string;
  ein: string;
  businessLicense: string;
  businessBankAccount: string;
  capabilityStatement: string;
  pastPerformance: string;
  businessWebsite: string;
  insuranceTypes: string[];
  taxesCurrent: string;
  financialsReady: string;
  ueiSamStatus: string;
  referencesAvailable: string;
  ownerBioResume: string;
  ownershipDocs: string;
  ownershipControl: string;
  citizenshipDocs: string;
  officeProof: string;
  certificationsAppliedBefore: string;
  minorityOwned: string;
  womanOwned: string;
  veteranOwned: string;
  governmentExperience: string;
  targetMarkets: string[];
  readyToUpload: string;
  capabilityCoreServices: string;
  capabilityDifferentiators: string;
  capabilityPastPerformanceExample: string;
  capabilityCertifications: string;
  capabilityContactInfo: string;
};

export type MissingItem = {
  key: string;
  label: string;
};

export type FixNowAction = {
  id: string;
  title: string;
  description: string;
  href: string;
  external?: boolean;
};

export type CertificationMatch = {
  id: string;
  name: string;
  plainEnglish: string;
  level: string;
  confidence: number;
  priority: number;
  reason: string;
  applyUrl: string;
  missingDocs: string[];
};

export type UnlockCandidate = {
  id: string;
  name: string;
  plainEnglish: string;
  level: string;
  applyUrl: string;
  stepsAway: number;
  missingItems: string[];
  reason: string;
};

export type ActionPlanItem = {
  title: string;
  description: string;
};

export const assessmentQuestions = [
  {
    key: "businessAge",
    title: "How long has your business been operating?",
    explain:
      "This tells us how new or established your business is. Some certifications are easier when a business has been active for a while and has a track record.",
    options: [
      { value: "less-than-1-year", label: "Less than 1 year" },
      { value: "1-2-years", label: "1 to 2 years" },
      { value: "3-5-years", label: "3 to 5 years" },
      { value: "5-plus-years", label: "5+ years" },
    ],
  },
  {
    key: "registeredBusiness",
    title: "Is your business formally registered?",
    explain:
      "This checks whether your business is officially set up with the state. Most certification paths require this first.",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "in-progress", label: "In progress" },
    ],
  },
  {
    key: "annualRevenue",
    title: "What is your approximate annual revenue?",
    explain:
      "This gives a simple picture of your business size. It does not automatically approve or deny you, but it helps guide the right path.",
    options: [
      { value: "0-50k", label: "$0 to $50,000" },
      { value: "50k-250k", label: "$50,001 to $250,000" },
      { value: "250k-1m", label: "$250,001 to $1,000,000" },
      { value: "1m-plus", label: "$1,000,000+" },
    ],
  },
  {
    key: "employees",
    title: "How many employees do you currently have?",
    explain:
      "This helps us understand your current business size and capacity. A one-person company can still qualify, but the support needs may be different.",
    options: [
      { value: "1", label: "Just me" },
      { value: "2-5", label: "2 to 5" },
      { value: "6-20", label: "6 to 20" },
      { value: "21-plus", label: "21+" },
    ],
  },
  {
    key: "targetCertification",
    title: "Which certification are you most interested in pursuing first?",
    explain:
      "This helps us point you toward the certification path you want to understand first, such as 8(a), DBE, MBE, or a small business program.",
    options: [
      { value: "sba-8a", label: "SBA 8(a)" },
      { value: "dbe", label: "DBE" },
      { value: "mbe", label: "MBE" },
      { value: "sbe", label: "SBE" },
      { value: "wosb", label: "WOSB" },
      { value: "not-sure", label: "Not sure yet" },
    ],
  },
] as const;

export const industryOptions = [
  "Construction",
  "Transportation / Logistics",
  "Janitorial / Facilities",
  "Professional Services / Consulting",
  "Technology / IT",
  "Staffing",
  "Manufacturing",
  "Healthcare",
  "Food Services",
  "Security",
  "Marketing / Media",
  "Other",
] as const;

export const naicsIndustryPresets = [
  {
    industry: "Construction",
    code: "236220",
    label: "Construction",
    description: "Commercial and institutional building construction",
  },
  {
    industry: "Transportation / Logistics",
    code: "484110",
    label: "Transportation / Logistics",
    description: "General freight trucking, local",
  },
  {
    industry: "Janitorial / Facilities",
    code: "561720",
    label: "Janitorial / Facilities",
    description: "Janitorial services",
  },
  {
    industry: "Professional Services / Consulting",
    code: "541611",
    label: "Professional Services / Consulting",
    description: "Administrative management and general consulting",
  },
  {
    industry: "Technology / IT",
    code: "541512",
    label: "Technology / IT",
    description: "Computer systems design services",
  },
  {
    industry: "Staffing",
    code: "561320",
    label: "Staffing",
    description: "Temporary help services",
  },
  {
    industry: "Manufacturing",
    code: "332312",
    label: "Manufacturing",
    description: "Fabricated structural metal manufacturing",
  },
  {
    industry: "Healthcare",
    code: "621610",
    label: "Healthcare",
    description: "Home health care services",
  },
  {
    industry: "Food Services",
    code: "722320",
    label: "Food Services",
    description: "Caterers",
  },
  {
    industry: "Security",
    code: "561612",
    label: "Security",
    description: "Security guards and patrol services",
  },
  {
    industry: "Marketing / Media",
    code: "541810",
    label: "Marketing / Media",
    description: "Advertising agencies",
  },
] as const;

export const businessEntityOptions = [
  "LLC",
  "Corporation",
  "Sole Proprietorship",
  "Partnership",
  "Nonprofit",
  "Other",
] as const;

export const insuranceOptions = [
  "General Liability",
  "Workers Compensation",
  "Commercial Auto",
  "Professional Liability",
  "Umbrella Coverage",
  "Bonding / Surety Bond",
  "Not Sure Yet",
] as const;

export const marketOptions = ["Federal", "State", "County", "City / Local"] as const;

export const applyExplainMap: Record<keyof ApplyAnswers, string> = {
  legalBusinessName:
    "Use the business name exactly as it appears on your official registration.",
  ownerName:
    "Enter the main owner or person in charge of the business.",
  companyEmail:
    "Use the main email address you want tied to this business.",
  phone: "Use the main business phone number.",
  address1:
    "Enter the business street or mailing address you use for official records.",
  city: "Enter the city where the business is based.",
  stateRegistered:
    "Enter the state where your business is officially registered.",
  zipCode: "Enter the zip code for your business address.",
  industry:
    "Pick the main type of work your business does, like construction, trucking, janitorial, consulting, staffing, or IT.",
  naicsStatus:
    "NAICS is a business classification code used in contracting and certification. This question checks whether you already know your code or need help finding one.",
  naicsCodes:
    "NAICS codes describe the type of work your business does. If you do not know yours, use the dropdown examples to get close and refine it later if needed.",
  businessEntity:
    "This is the legal setup of your business, such as LLC, Corporation, Sole Proprietorship, or Partnership.",
  einStatus:
    "Tell us whether you already have an EIN, still need one, or are applying for one now.",
  ein: "If you already have an EIN, enter the 9-digit number here.",
  businessLicense:
    "This checks whether your business has the registration or license it needs to operate.",
  businessBankAccount:
    "A business bank account helps show that your business is set up separately from personal finances.",
  capabilityStatement:
    "A capability statement is a simple one-page business summary that says what you do, why you are a good choice, and how to contact you.",
  pastPerformance:
    "This means proof that you have done similar work before. It can be private work, subcontract work, nonprofit work, or government work.",
  businessWebsite:
    "A website helps show that your business is active and professional.",
  insuranceTypes:
    "Choose the insurance types your business has right now.",
  taxesCurrent:
    "This checks whether your taxes are up to date.",
  financialsReady:
    "This asks whether your bookkeeping and financial records are organized.",
  ueiSamStatus:
    "This asks whether you have started or finished setting up your federal vendor account in SAM.gov and your UEI number.",
  referencesAvailable:
    "References are people or organizations that can confirm you did good work.",
  ownerBioResume:
    "A short owner bio or resume helps explain who runs the business.",
  ownershipDocs:
    "These are the papers that show who owns the business.",
  ownershipControl:
    "For many certifications, it is not enough to be listed as the owner on paper. The qualifying owner also needs to run the business day to day.",
  citizenshipDocs:
    "Some programs ask for ID or citizenship papers for the qualifying owner.",
  officeProof:
    "This can be a lease, utility bill, or another paper that shows where the business operates.",
  certificationsAppliedBefore:
    "Tell us if you have applied for certification before.",
  minorityOwned: "Indicate whether the company is minority-owned.",
  womanOwned: "Indicate whether the company is woman-owned.",
  veteranOwned: "Indicate whether the company is veteran-owned.",
  governmentExperience:
    "This checks whether the company has done any government work before.",
  targetMarkets: "Choose the markets you want to target first.",
  readyToUpload:
    "This tells us whether you are ready to move into the document-upload step.",
  capabilityCoreServices:
    "List the main services or products your business provides.",
  capabilityDifferentiators:
    "Explain what makes your business stand out from others.",
  capabilityPastPerformanceExample:
    "Give one real example of work you have already done that shows what your business can handle.",
  capabilityCertifications:
    "List any certifications, registrations, or setup steps you already have in place.",
  capabilityContactInfo:
    "List the contact information you want shown on the capability statement.",
};

export function getEmptyAssessmentAnswers(): AssessmentAnswers {
  return {
    businessAge: "",
    registeredBusiness: "",
    annualRevenue: "",
    employees: "",
    targetCertification: "",
  };
}

export function getEmptyApplyAnswers(): ApplyAnswers {
  return {
    legalBusinessName: "",
    ownerName: "",
    companyEmail: "",
    phone: "",
    address1: "",
    city: "",
    stateRegistered: "",
    zipCode: "",
    industry: "",
    naicsStatus: "",
    naicsCodes: "",
    businessEntity: "",
    einStatus: "",
    ein: "",
    businessLicense: "",
    businessBankAccount: "",
    capabilityStatement: "",
    pastPerformance: "",
    businessWebsite: "",
    insuranceTypes: [],
    taxesCurrent: "",
    financialsReady: "",
    ueiSamStatus: "",
    referencesAvailable: "",
    ownerBioResume: "",
    ownershipDocs: "",
    ownershipControl: "",
    citizenshipDocs: "",
    officeProof: "",
    certificationsAppliedBefore: "",
    minorityOwned: "",
    womanOwned: "",
    veteranOwned: "",
    governmentExperience: "",
    targetMarkets: [],
    readyToUpload: "",
    capabilityCoreServices: "",
    capabilityDifferentiators: "",
    capabilityPastPerformanceExample: "",
    capabilityCertifications: "",
    capabilityContactInfo: "",
  };
}

export function sanitizeEin(value: string) {
  return value.replace(/\D/g, "").slice(0, 9);
}

export function formatEin(value: string) {
  const digits = sanitizeEin(value);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}-${digits.slice(2)}`;
}

export function validateEin(value: string) {
  return sanitizeEin(value).length === 9;
}

export function normalizeAssessmentAnswers(
  input: Partial<AssessmentAnswers> | null | undefined
): AssessmentAnswers {
  return {
    ...getEmptyAssessmentAnswers(),
    ...input,
  };
}

export function normalizeApplyAnswers(
  input: Partial<ApplyAnswers> | null | undefined
): ApplyAnswers {
  const base = getEmptyApplyAnswers();
  const merged = {
    ...base,
    ...input,
  };

  return {
    ...merged,
    insuranceTypes: Array.isArray(input?.insuranceTypes)
      ? input!.insuranceTypes.filter((item): item is string => typeof item === "string")
      : [],
    targetMarkets: Array.isArray(input?.targetMarkets)
      ? input!.targetMarkets.filter((item): item is string => typeof item === "string")
      : [],
    ein: sanitizeEin(typeof input?.ein === "string" ? input.ein : ""),
  };
}

export function getMissingApplyItems(form: ApplyAnswers): MissingItem[] {
  const missing: MissingItem[] = [];

  const requiredFields: Array<{ key: keyof ApplyAnswers; label: string }> = [
    { key: "legalBusinessName", label: "Legal Business Name" },
    { key: "ownerName", label: "Owner Name" },
    { key: "companyEmail", label: "Company Email" },
    { key: "phone", label: "Phone" },
    { key: "address1", label: "Business Address" },
    { key: "city", label: "City" },
    { key: "stateRegistered", label: "State" },
    { key: "zipCode", label: "Zip Code" },
    { key: "industry", label: "Industry" },
    { key: "naicsStatus", label: "NAICS Code Step" },
    { key: "naicsCodes", label: "NAICS Code" },
    { key: "businessEntity", label: "Business Type" },
    { key: "einStatus", label: "EIN Status" },
    { key: "businessLicense", label: "Business Registration or License" },
    { key: "businessBankAccount", label: "Business Bank Account" },
    { key: "capabilityStatement", label: "One-Page Business Summary" },
    { key: "pastPerformance", label: "Proof You Have Done This Work Before" },
    { key: "businessWebsite", label: "Business Website" },
    { key: "taxesCurrent", label: "Taxes Current" },
    { key: "financialsReady", label: "Financial Records" },
    { key: "ueiSamStatus", label: "Federal Vendor Account (SAM.gov / UEI)" },
    { key: "referencesAvailable", label: "References" },
    { key: "ownerBioResume", label: "Owner Bio or Resume" },
    { key: "ownershipDocs", label: "Papers Showing Who Owns the Business" },
    { key: "ownershipControl", label: "Who Runs the Business Day to Day" },
    { key: "citizenshipDocs", label: "ID or Citizenship Papers" },
    { key: "officeProof", label: "Proof of Business Address" },
    { key: "certificationsAppliedBefore", label: "Past Certification Applications" },
    { key: "minorityOwned", label: "Minority Owned" },
    { key: "womanOwned", label: "Woman Owned" },
    { key: "veteranOwned", label: "Veteran Owned" },
    { key: "governmentExperience", label: "Government Experience" },
    { key: "readyToUpload", label: "Ready To Upload" },
  ];

  for (const item of requiredFields) {
    const value = form[item.key];
    if (typeof value === "string" && !value.trim()) {
      missing.push({ key: String(item.key), label: item.label });
    }
  }

  if (form.einStatus === "has-ein" && !validateEin(form.ein)) {
    missing.push({ key: "ein", label: "Valid 9-digit EIN" });
  }

  if (form.insuranceTypes.length === 0) {
    missing.push({ key: "insuranceTypes", label: "Insurance Selection" });
  }

  if (form.targetMarkets.length === 0) {
    missing.push({ key: "targetMarkets", label: "Target Markets" });
  }

  if (form.capabilityStatement === "yes" || form.capabilityStatement === "need-help") {
    const capabilityFields: Array<{ key: keyof ApplyAnswers; label: string }> = [
      { key: "capabilityCoreServices", label: "Business Summary: Core Services" },
      {
        key: "capabilityDifferentiators",
        label: "Business Summary: What Makes You Different",
      },
      {
        key: "capabilityPastPerformanceExample",
        label: "Business Summary: Example of Past Work",
      },
      {
        key: "capabilityCertifications",
        label: "Business Summary: Certifications and Readiness",
      },
      { key: "capabilityContactInfo", label: "Business Summary: Contact Info" },
    ];

    for (const item of capabilityFields) {
      const value = form[item.key];
      if (typeof value !== "string" || !value.trim()) {
        missing.push({ key: String(item.key), label: item.label });
      }
    }
  }

  return missing;
}

export function getReadinessScore(
  assessment: AssessmentAnswers,
  apply: ApplyAnswers
) {
  let score = 18;

  if (assessment.registeredBusiness === "yes") score += 8;
  if (apply.einStatus === "has-ein" && validateEin(apply.ein)) score += 8;
  if (apply.businessLicense === "yes") score += 8;
  if (apply.businessBankAccount === "yes") score += 6;
  if (apply.capabilityStatement === "yes") score += 8;
  if (apply.pastPerformance !== "no" && apply.pastPerformance) score += 8;
  if (apply.businessWebsite === "yes") score += 5;
  if (apply.financialsReady === "yes") score += 8;
  if (apply.taxesCurrent === "yes") score += 6;
  if (apply.ueiSamStatus === "sam-active") score += 6;
  if (apply.referencesAvailable === "yes" || apply.referencesAvailable === "a-few") score += 4;
  if (apply.ownerBioResume === "yes" || apply.ownerBioResume === "partial") score += 3;
  if (apply.ownershipDocs === "yes" || apply.ownershipDocs === "partial") score += 3;
  if (apply.officeProof === "yes" || apply.officeProof === "partial") score += 3;
  if (apply.targetMarkets.length > 0) score += 2;
  if (apply.readyToUpload === "yes") score += 4;
  if (assessment.businessAge === "5-plus-years") score += 6;
  if (assessment.businessAge === "3-5-years") score += 4;
  if (assessment.businessAge === "1-2-years") score += 2;

  return Math.max(0, Math.min(100, score));
}

export function getReadinessTier(score: number) {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Building";
  return "Foundation";
}

export function getAssessmentSummaryItems(assessment: AssessmentAnswers) {
  return [
    { label: "Business Age", value: getAssessmentLabel("businessAge", assessment.businessAge) },
    {
      label: "Registered Business",
      value: getAssessmentLabel("registeredBusiness", assessment.registeredBusiness),
    },
    { label: "Annual Revenue", value: getAssessmentLabel("annualRevenue", assessment.annualRevenue) },
    { label: "Employees", value: getAssessmentLabel("employees", assessment.employees) },
    {
      label: "Target Certification",
      value: getAssessmentLabel("targetCertification", assessment.targetCertification),
    },
  ];
}

export function getAssessmentLabel(
  key: keyof AssessmentAnswers,
  value: string
) {
  const question = assessmentQuestions.find((item) => item.key === key);
  const option = question?.options.find((item) => item.value === value);
  return option?.label || "—";
}

export function getApplySnapshotItems(apply: ApplyAnswers) {
  return [
    { label: "Business Name", value: apply.legalBusinessName || "—" },
    { label: "Owner Name", value: apply.ownerName || "—" },
    { label: "Company Email", value: apply.companyEmail || "—" },
    { label: "Phone", value: apply.phone || "—" },
    {
      label: "Business Address",
      value: [apply.address1, apply.city, apply.stateRegistered, apply.zipCode]
        .filter(Boolean)
        .join(", ") || "—",
    },
    { label: "Industry", value: apply.industry || "—" },
    { label: "NAICS", value: apply.naicsCodes || "—" },
    { label: "Business Entity", value: apply.businessEntity || "—" },
    {
      label: "EIN Status",
      value:
        apply.einStatus === "has-ein"
          ? `I have an EIN${validateEin(apply.ein) ? ` (${formatEin(apply.ein)})` : ""}`
          : apply.einStatus === "no-ein"
            ? "I do not have an EIN yet"
            : apply.einStatus === "in-progress"
              ? "I am applying for one"
              : "—",
    },
  ];
}

export function getDocumentsChecklist(apply: ApplyAnswers) {
  return [
    {
      title: "Business Basics",
      items: [
        "Business registration or license",
        "EIN letter or EIN confirmation",
        "Business bank account proof",
        "Proof of business address",
      ],
    },
    {
      title: "Owner and Business Setup",
      items: [
        "Papers showing who owns the business",
        "Owner bio or resume",
        "ID or citizenship papers, if needed",
        "Papers showing who runs the business day to day",
      ],
    },
    {
      title: "Work and Readiness Proof",
      items: [
        "One-page business summary",
        "Examples of past work",
        "Insurance certificates",
        "Financial statements and tax records",
      ],
    },
    {
      title: "Based On Your Answers",
      items: [
        apply.businessWebsite === "no" ? "Website plan or draft page" : "Website link and screenshots",
        apply.ueiSamStatus !== "sam-active" ? "Federal vendor account (SAM.gov / UEI) status notes" : "SAM.gov / UEI confirmation",
        apply.certificationsAppliedBefore !== "no"
          ? "Past certification application results"
          : "No past certification applications listed",
        apply.targetMarkets.length > 0
          ? `${apply.targetMarkets.join(", ")} market support documents`
          : "Notes on which market you want to target first",
      ],
    },
  ];
}

function docsFromReadiness(apply: ApplyAnswers) {
  const docs: string[] = [];

  if (apply.einStatus !== "has-ein") docs.push("EIN letter or EIN confirmation");
  if (apply.businessLicense !== "yes") docs.push("Business registration or license");
  if (apply.businessBankAccount !== "yes") docs.push("Business bank account proof");
  if (apply.capabilityStatement !== "yes") docs.push("One-page business summary");
  if (apply.financialsReady !== "yes") docs.push("Financial statements");
  if (apply.taxesCurrent !== "yes") docs.push("Current tax records");
  if (apply.ueiSamStatus !== "sam-active") docs.push("Federal vendor account (SAM.gov / UEI)");
  if (apply.referencesAvailable === "no") docs.push("Client references");
  if (apply.ownerBioResume === "no") docs.push("Owner bio or resume");
  if (apply.ownershipDocs === "no") docs.push("Papers showing who owns the business");
  if (apply.officeProof === "no") docs.push("Proof of business address");

  return docs;
}

export function buildFixNowActions(apply: ApplyAnswers): FixNowAction[] {
  const actions: FixNowAction[] = [];

  if (apply.einStatus !== "has-ein") {
    actions.push({
      id: "ein",
      title: "Fix This Now: EIN",
      description:
        "Get your EIN step completed so you can keep moving through certification and vendor setup.",
      href: "https://www.irs.gov/businesses/small-businesses-self-employed/employer-id-numbers",
      external: true,
    });
  }

  if (apply.businessLicense !== "yes") {
    actions.push({
      id: "business-registration",
      title: "Fix This Now: Business Registration / License",
      description:
        "Your business registration or license still needs attention before you are fully ready.",
      href: "https://dos.fl.gov/sunbiz/",
      external: true,
    });
  }

  const missingDocs = docsFromReadiness(apply);
  if (missingDocs.length > 0 || apply.readyToUpload !== "yes") {
    actions.push({
      id: "documents",
      title: "Fix This Now: Documents",
      description:
        "Open the document vault and start gathering the main records you still need.",
      href: "/documents",
    });
  }

  return actions;
}

function getCertificationPlainEnglish(id: string): string {
  switch (id) {
    case "mbe":
      return "For businesses owned by minorities.";
    case "wosb":
      return "For businesses owned and controlled by women.";
    case "dbe":
      return "For disadvantaged businesses pursuing transportation and public infrastructure work.";
    case "8a":
      return "For socially and economically disadvantaged small businesses seeking federal growth.";
    case "sbe":
      return "For smaller businesses starting with local and county contracting opportunities.";
    default:
      return "A certification path matched to your business profile.";
  }
}

export function buildCertificationInsights(
  assessment: AssessmentAnswers,
  apply: ApplyAnswers
): {
  matchedCertifications: CertificationMatch[];
  unlockCandidates: UnlockCandidate[];
  actionPlan: ActionPlanItem[];
} {
  const readinessDocs = docsFromReadiness(apply);
  const matches: CertificationMatch[] = [];
  const unlocks: UnlockCandidate[] = [];

  const addMatch = (
    id: string,
    name: string,
    level: string,
    confidence: number,
    priority: number,
    reason: string,
    applyUrl: string,
    missingDocs: string[]
  ) => {
    matches.push({
      id,
      name,
      plainEnglish: getCertificationPlainEnglish(id),
      level,
      confidence,
      priority,
      reason,
      applyUrl,
      missingDocs,
    });
  };

  const addUnlock = (
    id: string,
    name: string,
    level: string,
    applyUrl: string,
    missingItems: string[],
    reason: string
  ) => {
    unlocks.push({
      id,
      name,
      plainEnglish: getCertificationPlainEnglish(id),
      level,
      applyUrl,
      stepsAway: missingItems.length,
      missingItems,
      reason,
    });
  };

  const dbeMissing = [];
  if (apply.minorityOwned !== "yes" && apply.womanOwned !== "yes") {
    dbeMissing.push("Show papers for qualifying ownership");
  }
  if (apply.ownershipControl !== "yes") dbeMissing.push("Show who runs the business day to day");
  if (apply.capabilityStatement === "no") dbeMissing.push("One-page business summary");
  if (apply.pastPerformance === "no") dbeMissing.push("Examples of past work");

  const mbeMissing = [];
  if (apply.minorityOwned !== "yes") mbeMissing.push("Papers supporting minority ownership");
  if (apply.ownershipDocs === "no") mbeMissing.push("Papers showing who owns the business");
  if (apply.businessLicense !== "yes") mbeMissing.push("Business registration or license");

  const wosbMissing = [];
  if (apply.womanOwned !== "yes") wosbMissing.push("Papers supporting women ownership");
  if (apply.ownershipControl !== "yes") wosbMissing.push("Proof of who runs the business day to day");
  if (apply.einStatus !== "has-ein") wosbMissing.push("EIN confirmation");

  const eightAMissing = [];
  if (apply.minorityOwned !== "yes") eightAMissing.push("Background explanation for qualifying ownership");
  if (assessment.businessAge === "less-than-1-year") eightAMissing.push("More business history");
  if (apply.financialsReady !== "yes") eightAMissing.push("Financial statements");
  if (apply.taxesCurrent !== "yes") eightAMissing.push("Current tax records");

  const sbeMissing = [];
  if (assessment.registeredBusiness !== "yes") sbeMissing.push("Formal business registration");
  if (apply.businessLicense !== "yes") sbeMissing.push("Business license");
  if (apply.targetMarkets.length === 0) sbeMissing.push("Target market selection");

  if (assessment.targetCertification === "mbe" || apply.minorityOwned === "yes") {
    addMatch(
      "mbe",
      "Minority Business Enterprise (MBE)",
      "local / state",
      Math.max(64, 92 - mbeMissing.length * 10),
      1,
      "Your answers show a strong local or state starting point for a minority-owned business path.",
      "https://www.miamidade.gov/global/strategic-procurement/small-business-enterprise-certification.page?componentID=1553655066001&submit=true",
      mbeMissing
    );
  } else {
    addUnlock(
      "mbe",
      "Minority Business Enterprise (MBE)",
      "local / state",
      "https://www.miamidade.gov/global/strategic-procurement/small-business-enterprise-certification.page?componentID=1553655066001&submit=true",
      mbeMissing.length ? mbeMissing : ["Clarify ownership eligibility"],
      "MBE becomes a stronger fit once ownership eligibility and basic business papers are clearer."
    );
  }

  if (assessment.targetCertification === "wosb" || apply.womanOwned === "yes") {
    addMatch(
      "wosb",
      "Women-Owned Small Business (WOSB)",
      "federal",
      Math.max(60, 90 - wosbMissing.length * 9),
      2,
      "Your profile points toward a women-owned certification path with federal opportunities.",
      "https://wosb.certify.sba.gov/prepare/",
      wosbMissing
    );
  } else {
    addUnlock(
      "wosb",
      "Women-Owned Small Business (WOSB)",
      "federal",
      "https://wosb.certify.sba.gov/prepare/",
      wosbMissing.length ? wosbMissing : ["Clarify women-owned eligibility"],
      "WOSB can open up faster once ownership eligibility is clearly documented."
    );
  }

  if (assessment.targetCertification === "dbe" || dbeMissing.length <= 2) {
    addMatch(
      "dbe",
      "Disadvantaged Business Enterprise (DBE)",
      "state / transportation",
      Math.max(55, 88 - dbeMissing.length * 10),
      3,
      "Your ownership and readiness profile is close to a DBE path.",
      "/local/miami-dade/dbe",
      dbeMissing
    );
  } else {
    addUnlock(
      "dbe",
      "Disadvantaged Business Enterprise (DBE)",
      "state / transportation",
      "/local/miami-dade/dbe",
      dbeMissing,
      "DBE becomes more realistic after you strengthen ownership and proof-of-work items."
    );
  }

  if (assessment.targetCertification === "sba-8a" || eightAMissing.length <= 2) {
    addMatch(
      "8a",
      "SBA 8(a) Business Development",
      "federal",
      Math.max(50, 86 - eightAMissing.length * 10),
      4,
      "Your answers suggest a possible 8(a) path once your financial records and ownership papers are complete.",
      "https://www.sba.gov/federal-contracting/contracting-assistance-programs/8a-business-development-program",
      eightAMissing
    );
  } else {
    addUnlock(
      "8a",
      "SBA 8(a) Business Development",
      "federal",
      "https://www.sba.gov/federal-contracting/contracting-assistance-programs/8a-business-development-program",
      eightAMissing,
      "8(a) is usually a later step after your foundation is stronger."
    );
  }

  addMatch(
    "sbe",
    "Small Business Enterprise (SBE)",
    "local / county",
    Math.max(58, 84 - sbeMissing.length * 10),
    5,
    "SBE is usually one of the easiest starting certifications when the business is registered and organized.",
    "https://www.miamidade.gov/global/business/small-business-enterprise.page",
    sbeMissing
  );

  const actionPlan: ActionPlanItem[] = [
    {
      title: "Stabilize core business identity",
      description:
        apply.einStatus === "has-ein" && apply.businessLicense === "yes"
          ? "Your EIN and registration basics are in place. Keep those papers ready for upload."
          : "Finish your EIN and registration basics first so the rest of the process is easier.",
    },
    {
      title: "Organize the credibility pack",
      description:
        readinessDocs.length > 0
          ? `Start with these items next: ${readinessDocs.slice(0, 4).join(", ")}.`
          : "Your document set looks solid. Move into uploads and certification-specific packaging.",
    },
    {
      title: "Choose the first target and package it",
      description:
        assessment.targetCertification === "not-sure"
          ? "Use the top match below as your first application path, then gather documents around it."
          : `Aim your next document pass around ${getAssessmentLabel(
              "targetCertification",
              assessment.targetCertification
            )}.`,
    },
  ];

  return {
    matchedCertifications: matches.sort((a, b) => a.priority - b.priority),
    unlockCandidates: unlocks.sort((a, b) => a.stepsAway - b.stepsAway),
    actionPlan,
  };
}
