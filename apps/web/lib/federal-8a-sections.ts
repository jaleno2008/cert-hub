import type { Federal8aSectionKey, FederalSectionDefinition } from "./federal-prep";

const YES_NO_NOT_SURE = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
  { label: "Not sure yet", value: "not_sure" },
];

export const FEDERAL_8A_SECTION_ORDER: Federal8aSectionKey[] = [
  "business",
  "ownership",
  "control",
  "disadvantage",
  "financials",
  "documents",
];

export const FEDERAL_8A_SECTIONS: Record<
  Federal8aSectionKey,
  FederalSectionDefinition
> = {
  business: {
    key: "business",
    step: 1,
    title: "Business Story And Readiness",
    shortTitle: "Business",
    officialLabel: "Business history and potential for success",
    applicantNote:
      "We use simple questions here, but this mirrors the part of the SBA path where your business history, work experience, and operating track record need to make sense.",
    description:
      "This section helps turn your business history into clear language that supports federal readiness and shows that the company has real operating traction.",
    whyItMatters:
      "SBA wants to see that the business is real, active, and clearly able to explain what it does.",
    nextStepLabel: "Continue To Ownership",
    questions: [
      {
        id: "core_services",
        label: "What does your business mainly do?",
        helpText: "Describe your main service or product in plain language.",
        explainWhy: "This helps connect your business story to federal opportunities and your NAICS path.",
        type: "textarea",
        placeholder:
          "We provide janitorial, facility support, and light maintenance services for public and private clients.",
        required: true,
        documentHints: ["Capability statement", "Company website", "Marketing overview"],
      },
      {
        id: "primary_customers",
        label: "Who do you mainly serve today?",
        helpText: "List your main customer types or sectors.",
        explainWhy: "This shows where your traction is already coming from.",
        type: "text",
        placeholder: "Private companies, schools, and local agencies",
      },
      {
        id: "years_operating",
        label: "How long has the business been operating?",
        helpText: "Use years or a simple business age description.",
        explainWhy: "Business history helps shape the readiness conversation.",
        type: "text",
        placeholder: "2 years",
        required: true,
      },
      {
        id: "past_performance",
        label: "What past work best shows your experience?",
        helpText: "List real contracts, invoices, projects, or repeat customers.",
        explainWhy: "Past performance strengthens your business story and future application packet.",
        type: "textarea",
        placeholder:
          "Commercial cleaning for 3 office buildings, seasonal county support work, recurring service contract with a local nonprofit.",
        documentHints: ["Invoices", "Contracts", "Reference letters"],
      },
    ],
  },
  ownership: {
    key: "ownership",
    step: 2,
    title: "Ownership And Main Owner",
    shortTitle: "Ownership",
    officialLabel: "Ownership",
    applicantNote:
      "This mirrors the SBA ownership review, but asks it in plain English so you can confirm who owns the company and how that is documented.",
    description:
      "This section clarifies who owns the business and how that ownership is documented.",
    whyItMatters:
      "Ownership must be real, documented, and easy to prove, not just listed casually.",
    nextStepLabel: "Continue To Control",
    questions: [
      {
        id: "owner_names",
        label: "Who are the owners and what percentages do they hold?",
        helpText: "List each owner and their ownership percentage.",
        explainWhy: "Federal reviews often start by checking ownership first.",
        type: "textarea",
        placeholder: "Jane Doe - 51%, John Doe - 49%",
        required: true,
        documentHints: ["Operating agreement", "Bylaws", "Stock or membership records"],
      },
      {
        id: "qualifying_owner_percent",
        label: "What percentage is owned by the main owner you are reviewing for 8(a)?",
        helpText: "Enter the exact percent if you know it.",
        explainWhy: "Majority ownership is a key part of many certification paths.",
        type: "number",
        placeholder: "51",
        required: true,
      },
      {
        id: "ownership_documents_ready",
        label: "Do you already have your ownership papers ready?",
        helpText: "Examples include your operating agreement, bylaws, or member records.",
        explainWhy: "These documents help prove ownership clearly.",
        type: "radio",
        options: YES_NO_NOT_SURE,
        required: true,
        documentHints: ["Operating agreement", "Bylaws", "Stock certificates"],
      },
    ],
  },
  control: {
    key: "control",
    step: 3,
    title: "Control And Day-To-Day Management",
    shortTitle: "Control",
    officialLabel: "Control and management",
    applicantNote:
      "This is the real-world check behind the SBA control review: not just who owns the business on paper, but who actually runs it.",
    description:
      "This section checks whether the main owner you are reviewing truly runs and controls the business.",
    whyItMatters:
      "Ownership on paper is not enough. Federal programs often look closely at real control.",
    nextStepLabel: "Continue To Disadvantage",
    questions: [
      {
        id: "daily_control",
        label: "Who usually makes the day-to-day business decisions?",
        helpText: "Describe who handles staffing, operations, contracts, and approvals.",
        explainWhy: "This helps show whether the main owner you are reviewing is really leading the business.",
        exampleAnswer:
          "Example: The main owner approves contracts, oversees staff, makes pricing decisions, and signs off on major business choices.",
        type: "textarea",
        placeholder:
          "The majority owner approves contracts, supervises staff, signs checks, and directs daily operations.",
        required: true,
      },
      {
        id: "signing_authority",
        label: "Who has authority to sign contracts, checks, or legal documents?",
        helpText: "List the person or people who can bind the business.",
        explainWhy: "Signature authority is a strong signal of real control.",
        exampleAnswer:
          "Example: Jane Doe can sign contracts, checks, and official business documents without needing another owner to approve them first.",
        type: "text",
        placeholder: "Jane Doe",
      },
      {
        id: "outside_influence",
        label: "Does anyone outside the main owner have unusual control over major decisions?",
        helpText: "Include investors, managers, spouses, or former owners if they have unusual influence.",
        explainWhy: "Outside influence can create questions about real control.",
        exampleAnswer:
          "Example: Choose Yes if another person regularly overrides major decisions or must approve them. Choose Not sure if you think that may be happening but you are not fully certain.",
        type: "radio",
        options: YES_NO_NOT_SURE,
        required: true,
      },
    ],
  },
  disadvantage: {
    key: "disadvantage",
    step: 4,
    title: "Owner Background And Eligibility",
    shortTitle: "Owner Eligibility",
    officialLabel: "Owner-side 8(a) eligibility review",
    applicantNote:
      "This section covers the owner-side eligibility pieces in softer language, including the owner background, the story they may need to explain later, and the records that may support it.",
    description:
      "This section walks through the owner-side part of the 8(a) path in a calmer, more plain-English way.",
    whyItMatters:
      "8(a) looks at the owner, not just the business. This step helps you get familiar with that part gradually instead of all at once.",
    nextStepLabel: "Continue To Financials",
    questions: [
      {
        id: "social_disadvantage_basis",
        label: "Is there anything in the owner's background that SBA may ask to understand for 8(a)?",
        helpText:
          "Use plain language and keep it factual. A short, honest explanation is enough for now. You do not need to write it in legal language.",
        explainWhy:
          "This helps organize the owner story that may need to be explained later in the real application, without forcing you to perfect it right now.",
        exampleAnswer:
          "Example: The owner has personal background details that may need to be explained later, and we still need to gather the documents and timeline that support that story.",
        type: "textarea",
        placeholder:
          "The owner has background details they may need to explain later, and we are organizing the story and supporting records now so the next steps feel clearer.",
        required: true,
      },
      {
        id: "economic_disadvantage_ready",
        label: "Are the owner's personal financial records reasonably easy to gather?",
        helpText:
          "This may include personal financial statements, asset details, debts, or other records tied to net worth and finances.",
        explainWhy:
          "Personal financial readiness is part of the 8(a) path, so this helps you see whether that part feels organized already or still needs attention.",
        exampleAnswer:
          "Example: Choose Yes if the owner could pull together their core financial records without much digging. Choose Not sure if the records exist but are scattered or incomplete.",
        type: "radio",
        options: YES_NO_NOT_SURE,
        required: true,
      },
      {
        id: "citizenship_ready",
        label: "Are the owner's identity or citizenship documents easy to find?",
        helpText:
          "Examples may include a passport, birth certificate, naturalization document, or other identity records.",
        explainWhy:
          "These are common support documents. We ask now so you can spot missing paperwork early instead of scrambling later.",
        exampleAnswer:
          "Example: Choose Yes if those documents are already easy to find. Choose Not sure if you think they exist but you would need to search for them first.",
        type: "radio",
        options: YES_NO_NOT_SURE,
        required: true,
      },
    ],
  },
  financials: {
    key: "financials",
    step: 5,
    title: "Economic Eligibility And Financial Readiness",
    shortTitle: "Financials",
    officialLabel: "Financials, taxes, and economic eligibility support",
    applicantNote:
      "This is where the app starts to mirror the records side of the real process: tax returns, statements, and the financial documents that usually slow people down.",
    description:
      "This section helps organize financial records before they become a last-minute source of stress.",
    whyItMatters:
      "Financial and tax records are one of the most common places people get delayed.",
    nextStepLabel: "Continue To Documents",
    questions: [
      {
        id: "business_tax_returns",
        label: "Do you have recent business tax returns ready?",
        helpText: "Include the most recent years you have available.",
        explainWhy: "Tax records are a major support item in federal review.",
        type: "radio",
        options: YES_NO_NOT_SURE,
        required: true,
        documentHints: ["Business tax returns"],
      },
      {
        id: "financial_statements",
        label: "Do you have business financial statements ready?",
        helpText: "Examples include profit and loss statements and balance sheets.",
        explainWhy: "These help prove that the business is active and organized.",
        type: "radio",
        options: YES_NO_NOT_SURE,
        required: true,
        documentHints: ["Profit and loss statement", "Balance sheet"],
      },
      {
        id: "personal_financials",
        label: "Do you have personal financial records ready for the owner you are reviewing?",
        helpText: "This may include personal financial statements, debts, and income records.",
        explainWhy: "The owner’s financial readiness can matter in 8(a) review.",
        type: "radio",
        options: YES_NO_NOT_SURE,
        required: true,
      },
    ],
  },
  documents: {
    key: "documents",
    step: 6,
    title: "Supporting Documents And Upload Prep",
    shortTitle: "Documents",
    officialLabel: "Supporting documents",
    applicantNote:
      "The official application expects evidence. This step turns that into a calmer gather-and-upload plan so first-timers are not guessing what comes next.",
    description:
      "This section turns answers into a practical document sequence so the user knows what to gather first.",
    whyItMatters:
      "A good document sequence creates momentum and reduces overwhelm.",
    nextStepLabel: "Continue To Review",
    questions: [
      {
        id: "first_document_ready",
        label: "Which important document do you already have ready first?",
        helpText: "Start with one easy win if possible.",
        explainWhy: "One ready document helps the user move from planning into action.",
        type: "text",
        placeholder: "EIN letter, business license, or operating agreement",
      },
      {
        id: "missing_documents",
        label: "Which key documents are still missing?",
        helpText: "List the missing records you already know about.",
        explainWhy: "This turns a vague to-do list into a realistic prep plan.",
        type: "textarea",
        placeholder: "UEI confirmation, SAM registration proof, ownership documents, personal financial statement",
      },
      {
        id: "upload_sequence",
        label: "Would you like the wizard to sort your documents into gather-now versus later?",
        helpText: "This helps the user move in a practical order.",
        explainWhy: "A good sequence reduces overwhelm and makes the process feel manageable.",
        type: "radio",
        options: [
          { label: "Yes, sort them for me", value: "yes" },
          { label: "No, just show the full list", value: "no" },
        ],
        required: true,
      },
    ],
  },
};

export const getFederal8aSection = (key: Federal8aSectionKey) =>
  FEDERAL_8A_SECTIONS[key];

export const getFederal8aSectionList = () =>
  FEDERAL_8A_SECTION_ORDER.map((key) => FEDERAL_8A_SECTIONS[key]);
