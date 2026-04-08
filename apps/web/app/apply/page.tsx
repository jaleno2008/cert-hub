"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ChubStageBanner from "../../components/chub-stage-banner";
import {
  type ApplyAnswers,
  type AssessmentAnswers,
  STORAGE_KEYS,
  applyExplainMap,
  assessmentQuestions,
  businessEntityOptions,
  formatEin,
  getAssessmentLabel,
  getAssessmentSummaryItems,
  getEmptyApplyAnswers,
  getMissingApplyItems,
  industryOptions,
  naicsIndustryPresets,
  insuranceOptions,
  marketOptions,
  normalizeApplyAnswers,
  normalizeAssessmentAnswers,
  sanitizeEin,
} from "../../lib/chub-flow";

type QuestionCardProps = {
  number: number;
  title: string;
  explain: string;
  children: React.ReactNode;
  openExplain: string | null;
  setOpenExplain: (value: string | null) => void;
  id: string;
  isMissing?: boolean;
  innerClassName?: string;
  cardRef?: (node: HTMLDivElement | null) => void;
};

function QuestionCard({
  number,
  title,
  explain,
  children,
  openExplain,
  setOpenExplain,
  id,
  isMissing = false,
  innerClassName,
  cardRef,
}: QuestionCardProps) {
  const isOpen = openExplain === id;

  return (
    <div
      ref={cardRef}
      className={`rounded-[28px] border bg-gradient-to-b from-zinc-950 to-black p-6 transition ${
        isMissing
          ? "border-rose-500/70 shadow-[0_0_0_1px_rgba(244,63,94,0.35)]"
          : "border-zinc-800"
      } ${innerClassName ?? ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="pr-4 text-[26px] font-semibold leading-tight text-white md:text-[28px]">
          {number}. {title}
        </h3>

        <button
          type="button"
          onClick={() => setOpenExplain(isOpen ? null : id)}
          className="shrink-0 rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-300 transition hover:bg-yellow-500/20"
        >
          Explain
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 whitespace-pre-line rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5 text-[15px] leading-7 text-yellow-100">
          {explain}
        </div>
      )}

      <div className="mt-5">{children}</div>
    </div>
  );
}

function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-2xl border border-zinc-700 bg-black px-5 py-4 text-lg text-white outline-none transition placeholder:text-zinc-500 focus:border-yellow-400"
    />
  );
}

function FormTextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="min-h-[130px] w-full rounded-2xl border border-zinc-700 bg-black px-5 py-4 text-lg text-white outline-none transition placeholder:text-zinc-500 focus:border-yellow-400"
    />
  );
}

function FormSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-zinc-700 bg-black px-5 py-4 text-lg text-white outline-none transition focus:border-yellow-400"
    >
      {children}
    </select>
  );
}

function YesNoSelect({
  value,
  onChange,
  includeInProgress,
  includeNotSure,
  includePartial,
  labels,
}: {
  value: string;
  onChange: (value: string) => void;
  includeInProgress?: boolean;
  includeNotSure?: boolean;
  includePartial?: boolean;
  labels?: Partial<Record<string, string>>;
}) {
  return (
    <FormSelect value={value} onChange={onChange}>
      <option value="">Select one</option>
      <option value="yes">{labels?.yes ?? "Yes"}</option>
      <option value="no">{labels?.no ?? "No"}</option>
      {includeInProgress && <option value="in-progress">In Progress</option>}
      {includePartial && <option value="partial">Partially</option>}
      {includeNotSure && <option value="not-sure">Not Sure</option>}
    </FormSelect>
  );
}

export default function ApplyPage() {
  const router = useRouter();
  const [assessmentAnswers, setAssessmentAnswers] =
    useState<AssessmentAnswers | null>(null);
  const [form, setForm] = useState<ApplyAnswers>(getEmptyApplyAnswers());
  const [openExplain, setOpenExplain] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [ready, setReady] = useState(false);
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const email = localStorage.getItem(STORAGE_KEYS.email);
    const assessmentComplete = localStorage.getItem(STORAGE_KEYS.assessmentComplete);
    const assessmentRaw = localStorage.getItem(STORAGE_KEYS.assessment);

    if (!email) {
      router.push("/login");
      return;
    }

    if (assessmentComplete !== "true" || !assessmentRaw) {
      router.push("/assessment");
      return;
    }

    try {
      setAssessmentAnswers(normalizeAssessmentAnswers(JSON.parse(assessmentRaw)));
    } catch {
      router.push("/assessment");
      return;
    }

    const savedApply = localStorage.getItem(STORAGE_KEYS.apply);
    if (savedApply) {
      try {
        setForm(normalizeApplyAnswers(JSON.parse(savedApply)));
      } catch {
        localStorage.removeItem(STORAGE_KEYS.apply);
      }
    }

    setReady(true);
  }, [router]);

  const updateField = <K extends keyof ApplyAnswers>(
    field: K,
    value: ApplyAnswers[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleMulti = (
    field: "insuranceTypes" | "targetMarkets",
    value: string
  ) => {
    const current = form[field];
    const exists = current.includes(value);

    updateField(
      field,
      (exists
        ? current.filter((item) => item !== value)
        : [...current, value]) as ApplyAnswers[typeof field]
    );
  };

  const missingItems = useMemo(() => getMissingApplyItems(form), [form]);
  const missingKeys = useMemo(
    () => new Set(missingItems.map((item) => item.key)),
    [missingItems]
  );

  const fieldToCardId: Record<string, string> = {
    legalBusinessName: "legalBusinessName",
    ownerName: "ownerName",
    companyEmail: "companyEmail",
    phone: "phone",
    address1: "address1",
    city: "city",
    stateRegistered: "stateRegistered",
    zipCode: "zipCode",
    industry: "industry",
    naicsStatus: "naicsCodes",
    naicsCodes: "naicsCodes",
    businessEntity: "businessEntity",
    einStatus: "einStatus",
    ein: "einStatus",
    businessLicense: "businessLicense",
    businessBankAccount: "businessBankAccount",
    capabilityStatement: "capabilityStatement",
    capabilityCoreServices: "capabilityCoreServices",
    capabilityDifferentiators: "capabilityDifferentiators",
    capabilityPastPerformanceExample: "capabilityPastPerformanceExample",
    capabilityCertifications: "capabilityCertifications",
    capabilityContactInfo: "capabilityContactInfo",
    pastPerformance: "pastPerformance",
    businessWebsite: "businessWebsite",
    insuranceTypes: "insuranceTypes",
    taxesCurrent: "taxesCurrent",
    financialsReady: "financialsReady",
    ueiSamStatus: "ueiSamStatus",
    referencesAvailable: "referencesBundle",
    ownerBioResume: "referencesBundle",
    ownershipDocs: "referencesBundle",
    ownershipControl: "ownershipProfile",
    citizenshipDocs: "ownershipProfile",
    officeProof: "ownershipProfile",
    certificationsAppliedBefore: "ownershipProfile",
    minorityOwned: "ownershipProfile",
    womanOwned: "ownershipProfile",
    veteranOwned: "ownershipProfile",
    governmentExperience: "ownershipProfile",
    targetMarkets: "finalStep",
    readyToUpload: "finalStep",
  };

  const goToField = (fieldKey: string) => {
    const cardId = fieldToCardId[fieldKey] || fieldKey;
    setOpenExplain(cardId);
    questionRefs.current[cardId]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  useEffect(() => {
    if (!ready) return;

    localStorage.setItem(
      STORAGE_KEYS.apply,
      JSON.stringify({
        ...form,
        ein: form.einStatus === "has-ein" ? sanitizeEin(form.ein) : "",
      })
    );
  }, [form, ready]);

  const handleContinue = () => {
    setSubmitAttempted(true);

    if (missingItems.length > 0) {
      goToField(missingItems[0].key);
      alert(
        `Please complete all required questions before continuing.\n\nMissing items:\n- ${missingItems
          .map((item) => item.label)
          .join("\n- ")}`
      );
      return;
    }

    localStorage.setItem(
      STORAGE_KEYS.apply,
      JSON.stringify({
        ...form,
        ein: form.einStatus === "has-ein" ? sanitizeEin(form.ein) : "",
      })
    );

    router.push("/results");
  };

  if (!ready || !assessmentAnswers) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-xl">Loading application...</div>
      </main>
    );
  }

  const assessmentSummary = getAssessmentSummaryItems(assessmentAnswers);
  const completion = Math.round(((24 - missingItems.length) / 24) * 100);
  const targetCertificationLabel = getAssessmentLabel(
    "targetCertification",
    assessmentAnswers.targetCertification
  );
  const cardMissing = (keys: string[]) =>
    submitAttempted && keys.some((key) => missingKeys.has(key));

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white md:px-8">
      <div className="mx-auto grid max-w-[1700px] grid-cols-1 gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[32px] border border-zinc-800 bg-[#0b0b0f] p-6 md:p-8">
          <div className="mb-8 rounded-[28px] border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-transparent p-6">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
              Step 2 of 4
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-white md:text-5xl">
              24-Question Readiness Application
            </h1>
            <p className="mt-4 max-w-4xl text-lg leading-8 text-zinc-300">
              This guided application walks the applicant step by step through
              the information needed for certification readiness. It keeps the
              process structured without expecting them to already know the
              system.
            </p>
          </div>

          <div className="mb-8">
            <ChubStageBanner
              stage="clarify"
              title="CHUB Stage: Clarify"
              detail="This application keeps building the Clarify stage. The goal is to organize the business facts, ownership details, readiness signals, and certification context before we start diagnosing blockers."
            />
          </div>

          <div className="space-y-7">
            <QuestionCard number={1} title="What is your legal business name?" explain={applyExplainMap.legalBusinessName} id="legalBusinessName" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["legalBusinessName"])} cardRef={(node) => { questionRefs.current.legalBusinessName = node; }}>
              <FormInput value={form.legalBusinessName} onChange={(e) => updateField("legalBusinessName", e.target.value)} placeholder="Enter your legal business name" />
            </QuestionCard>

            <QuestionCard number={2} title="Who is the main owner?" explain={applyExplainMap.ownerName} id="ownerName" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["ownerName"])} cardRef={(node) => { questionRefs.current.ownerName = node; }}>
              <FormInput value={form.ownerName} onChange={(e) => updateField("ownerName", e.target.value)} placeholder="Enter owner name" />
            </QuestionCard>

            <QuestionCard number={3} title="What is your company email?" explain={applyExplainMap.companyEmail} id="companyEmail" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["companyEmail"])} cardRef={(node) => { questionRefs.current.companyEmail = node; }}>
              <FormInput type="email" value={form.companyEmail} onChange={(e) => updateField("companyEmail", e.target.value)} placeholder="name@company.com" />
            </QuestionCard>

            <QuestionCard number={4} title="What is your business phone number?" explain={applyExplainMap.phone} id="phone" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["phone"])} cardRef={(node) => { questionRefs.current.phone = node; }}>
              <FormInput value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="Enter business phone number" />
            </QuestionCard>

            <QuestionCard number={5} title="What is your business street address?" explain={applyExplainMap.address1} id="address1" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["address1"])} cardRef={(node) => { questionRefs.current.address1 = node; }}>
              <FormInput value={form.address1} onChange={(e) => updateField("address1", e.target.value)} placeholder="Enter street address" />
            </QuestionCard>

            <QuestionCard number={6} title="What city is your business in?" explain={applyExplainMap.city} id="city" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["city"])} cardRef={(node) => { questionRefs.current.city = node; }}>
              <FormInput value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="Enter city" />
            </QuestionCard>

            <QuestionCard number={7} title="What state is your business registered in?" explain={applyExplainMap.stateRegistered} id="stateRegistered" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["stateRegistered"])} cardRef={(node) => { questionRefs.current.stateRegistered = node; }}>
              <FormInput value={form.stateRegistered} onChange={(e) => updateField("stateRegistered", e.target.value)} placeholder="Example: Florida or FL" />
            </QuestionCard>

            <QuestionCard number={8} title="What is your business zip code?" explain={applyExplainMap.zipCode} id="zipCode" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["zipCode"])} cardRef={(node) => { questionRefs.current.zipCode = node; }}>
              <FormInput value={form.zipCode} onChange={(e) => updateField("zipCode", e.target.value)} placeholder="Enter zip code" />
            </QuestionCard>

            <QuestionCard number={9} title="What industry are you in?" explain={applyExplainMap.industry} id="industry" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["industry"])} cardRef={(node) => { questionRefs.current.industry = node; }}>
              <FormSelect value={form.industry} onChange={(value) => updateField("industry", value)}>
                <option value="">Select industry</option>
                {industryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </FormSelect>
            </QuestionCard>

            <QuestionCard number={10} title="Do you already know your NAICS code, or do you need help choosing one?" explain={`${applyExplainMap.naicsStatus}\n\n${applyExplainMap.naicsCodes}`} id="naicsCodes" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["naicsStatus", "naicsCodes"])} cardRef={(node) => { questionRefs.current.naicsCodes = node; }}>
              <div className="space-y-4">
                <FormSelect value={form.naicsStatus} onChange={(value) => updateField("naicsStatus", value)}>
                  <option value="">Select one</option>
                  <option value="yes">Yes, I already have a NAICS code</option>
                  <option value="need-guidance">I need help choosing one</option>
                  <option value="not-sure">I am not sure yet</option>
                </FormSelect>

                <div className={`rounded-2xl border p-4 ${submitAttempted && missingKeys.has("naicsCodes") ? "border-rose-500/70 bg-rose-500/5" : "border-zinc-800 bg-zinc-950"}`}>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-yellow-300">
                    Major Industry NAICS Guide
                  </p>
                  <FormSelect
                    value=""
                    onChange={(value) => {
                      if (!value) return;
                      const preset = naicsIndustryPresets.find(
                        (item) => `${item.code}|${item.industry}` === value
                      );
                      if (!preset) return;
                      updateField("industry", preset.industry);
                      updateField("naicsCodes", preset.code);
                      if (!form.naicsStatus) updateField("naicsStatus", "need-guidance");
                    }}
                  >
                    <option value="">Choose a major industry and sample NAICS code</option>
                    {naicsIndustryPresets.map((preset) => (
                      <option
                        key={`${preset.code}-${preset.industry}`}
                        value={`${preset.code}|${preset.industry}`}
                      >
                        {preset.label} — {preset.code} ({preset.description})
                      </option>
                    ))}
                  </FormSelect>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    These are common starter examples to help a beginner get
                    close to the right code before finalizing it.
                  </p>
                </div>

                <FormInput value={form.naicsCodes} onChange={(e) => updateField("naicsCodes", e.target.value)} placeholder="Enter one or more NAICS codes" />
              </div>
            </QuestionCard>

            <QuestionCard number={11} title="What type of business entity do you have?" explain={applyExplainMap.businessEntity} id="businessEntity" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["businessEntity"])} cardRef={(node) => { questionRefs.current.businessEntity = node; }}>
              <FormSelect value={form.businessEntity} onChange={(value) => updateField("businessEntity", value)}>
                <option value="">Select entity type</option>
                {businessEntityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </FormSelect>
            </QuestionCard>

            <QuestionCard number={12} title="What is your EIN status?" explain={`${applyExplainMap.einStatus}\n\n${applyExplainMap.ein}`} id="einStatus" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["einStatus", "ein"])} cardRef={(node) => { questionRefs.current.einStatus = node; }}>
              <div className="space-y-4">
                <FormSelect value={form.einStatus} onChange={(value) => updateField("einStatus", value)}>
                  <option value="">Select one</option>
                  <option value="has-ein">I have an EIN</option>
                  <option value="no-ein">I do not have an EIN yet</option>
                  <option value="in-progress">I am applying for one</option>
                </FormSelect>

                {form.einStatus === "has-ein" && (
                  <div className="space-y-2">
                    <FormInput
                      inputMode="numeric"
                      value={formatEin(form.ein)}
                      onChange={(e) => updateField("ein", sanitizeEin(e.target.value))}
                      placeholder="Enter 9-digit EIN"
                    />
                    <p className="text-sm text-zinc-400">
                      Enter all 9 digits. We store the number as digits only and
                      display it as {`XX-XXXXXXX`}.
                    </p>
                  </div>
                )}
              </div>
            </QuestionCard>

            <QuestionCard number={13} title="Do you have a business registration or license in place?" explain={applyExplainMap.businessLicense} id="businessLicense" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["businessLicense"])} cardRef={(node) => { questionRefs.current.businessLicense = node; }}>
              <YesNoSelect value={form.businessLicense} onChange={(value) => updateField("businessLicense", value)} includeInProgress includeNotSure />
            </QuestionCard>

            <QuestionCard number={14} title="Do you have a business bank account?" explain={applyExplainMap.businessBankAccount} id="businessBankAccount" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["businessBankAccount"])} cardRef={(node) => { questionRefs.current.businessBankAccount = node; }}>
              <YesNoSelect value={form.businessBankAccount} onChange={(value) => updateField("businessBankAccount", value)} />
            </QuestionCard>

            <QuestionCard number={15} title="Do you have a one-page business summary (capability statement)?" explain={applyExplainMap.capabilityStatement} id="capabilityStatement" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["capabilityStatement"])} cardRef={(node) => { questionRefs.current.capabilityStatement = node; }}>
              <FormSelect value={form.capabilityStatement} onChange={(value) => updateField("capabilityStatement", value)}>
                <option value="">Select one</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="need-help">Need Help Building One</option>
              </FormSelect>
            </QuestionCard>

            {(form.capabilityStatement === "yes" ||
              form.capabilityStatement === "need-help") && (
              <div className="rounded-[28px] border border-yellow-500/20 bg-yellow-500/[0.06] p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-yellow-300">
                    One-Page Business Summary Builder — 5 Questions
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-zinc-300">
                    Think of this as a guided one-page business summary. Your
                    answers here will help shape the results and document steps
                    later.
                  </p>
                </div>

                <div className="space-y-6">
                  <QuestionCard number={1} title="What are your core services?" explain={applyExplainMap.capabilityCoreServices} id="capabilityCoreServices" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["capabilityCoreServices"])} cardRef={(node) => { questionRefs.current.capabilityCoreServices = node; }}>
                    <FormTextArea value={form.capabilityCoreServices} onChange={(e) => updateField("capabilityCoreServices", e.target.value)} placeholder="List core services" />
                  </QuestionCard>

                  <QuestionCard number={2} title="What makes your company different?" explain={applyExplainMap.capabilityDifferentiators} id="capabilityDifferentiators" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["capabilityDifferentiators"])} cardRef={(node) => { questionRefs.current.capabilityDifferentiators = node; }}>
                    <FormTextArea value={form.capabilityDifferentiators} onChange={(e) => updateField("capabilityDifferentiators", e.target.value)} placeholder="Describe differentiators" />
                  </QuestionCard>

                  <QuestionCard number={3} title="Give one real example of past performance" explain={applyExplainMap.capabilityPastPerformanceExample} id="capabilityPastPerformanceExample" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["capabilityPastPerformanceExample"])} cardRef={(node) => { questionRefs.current.capabilityPastPerformanceExample = node; }}>
                    <FormTextArea value={form.capabilityPastPerformanceExample} onChange={(e) => updateField("capabilityPastPerformanceExample", e.target.value)} placeholder="Describe a real example of past work" />
                  </QuestionCard>

                  <QuestionCard number={4} title="What certifications, registrations, or readiness items do you currently have?" explain={applyExplainMap.capabilityCertifications} id="capabilityCertifications" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["capabilityCertifications"])} cardRef={(node) => { questionRefs.current.capabilityCertifications = node; }}>
                    <FormTextArea value={form.capabilityCertifications} onChange={(e) => updateField("capabilityCertifications", e.target.value)} placeholder="List what you currently have" />
                  </QuestionCard>

                  <QuestionCard number={5} title="What contact information should appear on the capability statement?" explain={applyExplainMap.capabilityContactInfo} id="capabilityContactInfo" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["capabilityContactInfo"])} cardRef={(node) => { questionRefs.current.capabilityContactInfo = node; }}>
                    <FormTextArea value={form.capabilityContactInfo} onChange={(e) => updateField("capabilityContactInfo", e.target.value)} placeholder="Enter contact information" />
                  </QuestionCard>
                </div>
              </div>
            )}

            <QuestionCard number={16} title="Have you done this kind of work before?" explain={applyExplainMap.pastPerformance} id="pastPerformance" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["pastPerformance"])} cardRef={(node) => { questionRefs.current.pastPerformance = node; }}>
              <FormSelect value={form.pastPerformance} onChange={(value) => updateField("pastPerformance", value)}>
                <option value="">Select one</option>
                <option value="yes-government">Yes, for government</option>
                <option value="yes-commercial">Yes, for private/commercial clients</option>
                <option value="subcontract">Yes, as a subcontractor</option>
                <option value="no">No</option>
              </FormSelect>
            </QuestionCard>

            <QuestionCard number={17} title="Do you have a business website?" explain={applyExplainMap.businessWebsite} id="businessWebsite" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["businessWebsite"])} cardRef={(node) => { questionRefs.current.businessWebsite = node; }}>
              <YesNoSelect value={form.businessWebsite} onChange={(value) => updateField("businessWebsite", value)} includeInProgress />
            </QuestionCard>

            <QuestionCard number={18} title="What types of insurance do you currently have?" explain={applyExplainMap.insuranceTypes} id="insuranceTypes" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["insuranceTypes"])} cardRef={(node) => { questionRefs.current.insuranceTypes = node; }}>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {insuranceOptions.map((option) => {
                  const checked = form.insuranceTypes.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleMulti("insuranceTypes", option)}
                      className={`rounded-2xl border px-4 py-4 text-left text-base font-medium transition ${
                        checked
                          ? "border-yellow-400 bg-yellow-500/15 text-yellow-200"
                          : "border-zinc-700 bg-black text-zinc-200 hover:border-yellow-500/40"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </QuestionCard>

            <QuestionCard number={19} title="Are your taxes current?" explain={applyExplainMap.taxesCurrent} id="taxesCurrent" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["taxesCurrent"])} cardRef={(node) => { questionRefs.current.taxesCurrent = node; }}>
              <FormSelect value={form.taxesCurrent} onChange={(value) => updateField("taxesCurrent", value)}>
                <option value="">Select one</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="working-on-it">Working on it</option>
              </FormSelect>
            </QuestionCard>

            <QuestionCard number={20} title="Do you have your bookkeeping or financial records ready?" explain={applyExplainMap.financialsReady} id="financialsReady" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["financialsReady"])} cardRef={(node) => { questionRefs.current.financialsReady = node; }}>
              <FormSelect value={form.financialsReady} onChange={(value) => updateField("financialsReady", value)}>
                <option value="">Select one</option>
                <option value="yes">Yes</option>
                <option value="partial">Partially</option>
                <option value="no">No</option>
              </FormSelect>
            </QuestionCard>

            <QuestionCard number={21} title="Have you started your federal vendor account setup (SAM.gov / UEI)?" explain={applyExplainMap.ueiSamStatus} id="ueiSamStatus" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["ueiSamStatus"])} cardRef={(node) => { questionRefs.current.ueiSamStatus = node; }}>
              <FormSelect value={form.ueiSamStatus} onChange={(value) => updateField("ueiSamStatus", value)}>
                <option value="">Select one</option>
                <option value="sam-active">Finished</option>
                <option value="sam-in-progress">Started but not finished</option>
                <option value="not-started">Not started</option>
                <option value="not-sure">Not sure</option>
              </FormSelect>
            </QuestionCard>

            <QuestionCard number={22} title="Do you have references, an owner bio, and papers showing who owns the business?" explain={`${applyExplainMap.referencesAvailable}\n\n${applyExplainMap.ownerBioResume}\n\n${applyExplainMap.ownershipDocs}`} id="referencesBundle" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["referencesAvailable", "ownerBioResume", "ownershipDocs"])} cardRef={(node) => { questionRefs.current.referencesBundle = node; }}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormSelect value={form.referencesAvailable} onChange={(value) => updateField("referencesAvailable", value)}>
                  <option value="">References</option>
                  <option value="yes">Yes</option>
                  <option value="a-few">A few</option>
                  <option value="no">No</option>
                </FormSelect>

                <FormSelect value={form.ownerBioResume} onChange={(value) => updateField("ownerBioResume", value)}>
                  <option value="">Owner Bio or Resume</option>
                  <option value="yes">Yes</option>
                  <option value="partial">Partially</option>
                  <option value="no">No</option>
                </FormSelect>

                <FormSelect value={form.ownershipDocs} onChange={(value) => updateField("ownershipDocs", value)}>
                  <option value="">Papers Showing Ownership</option>
                  <option value="yes">Yes</option>
                  <option value="partial">Partially</option>
                  <option value="no">No</option>
                </FormSelect>
              </div>
            </QuestionCard>

            <QuestionCard number={23} title="Owner qualifications and business background" explain={`${applyExplainMap.ownershipControl}\n\n${applyExplainMap.citizenshipDocs}\n\n${applyExplainMap.officeProof}\n\n${applyExplainMap.certificationsAppliedBefore}\n\n${applyExplainMap.minorityOwned}\n\n${applyExplainMap.womanOwned}\n\n${applyExplainMap.veteranOwned}\n\n${applyExplainMap.governmentExperience}`} id="ownershipProfile" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["ownershipControl", "citizenshipDocs", "officeProof", "certificationsAppliedBefore", "minorityOwned", "womanOwned", "veteranOwned", "governmentExperience"])} cardRef={(node) => { questionRefs.current.ownershipProfile = node; }}>
              <div className="space-y-5">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-300">
                    Who runs the business and what papers you have
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormSelect value={form.ownershipControl} onChange={(value) => updateField("ownershipControl", value)}>
                      <option value="">Does the qualifying owner run the business day to day?</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                      <option value="not-sure">Not sure</option>
                    </FormSelect>

                    <FormSelect value={form.citizenshipDocs} onChange={(value) => updateField("citizenshipDocs", value)}>
                      <option value="">ID or citizenship papers</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                      <option value="not-applicable">Not applicable</option>
                      <option value="not-sure">Not sure</option>
                    </FormSelect>

                    <FormSelect value={form.officeProof} onChange={(value) => updateField("officeProof", value)}>
                      <option value="">Proof of business address</option>
                      <option value="yes">Yes</option>
                      <option value="partial">Partially</option>
                      <option value="no">No</option>
                    </FormSelect>

                    <FormSelect value={form.certificationsAppliedBefore} onChange={(value) => updateField("certificationsAppliedBefore", value)}>
                      <option value="">Past certification applications</option>
                      <option value="yes-approved">Yes, approved</option>
                      <option value="yes-denied">Yes, denied</option>
                      <option value="yes-pending">Yes, still pending</option>
                      <option value="no">No</option>
                    </FormSelect>
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-300">
                    Ownership profile and work history
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormSelect value={form.minorityOwned} onChange={(value) => updateField("minorityOwned", value)}>
                      <option value="">Is the business minority-owned?</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </FormSelect>

                    <FormSelect value={form.womanOwned} onChange={(value) => updateField("womanOwned", value)}>
                      <option value="">Is the business woman-owned?</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </FormSelect>

                    <FormSelect value={form.veteranOwned} onChange={(value) => updateField("veteranOwned", value)}>
                      <option value="">Is the business veteran-owned?</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </FormSelect>

                    <FormSelect value={form.governmentExperience} onChange={(value) => updateField("governmentExperience", value)}>
                      <option value="">Any government work experience?</option>
                      <option value="yes">Yes</option>
                      <option value="some">Some</option>
                      <option value="no">No</option>
                    </FormSelect>
                  </div>
                </div>
              </div>
            </QuestionCard>

            <QuestionCard number={24} title="Which market do you want to go after first, and are you ready for the next document step?" explain={`${applyExplainMap.targetMarkets}\n\n${applyExplainMap.readyToUpload}`} id="finalStep" openExplain={openExplain} setOpenExplain={setOpenExplain} isMissing={cardMissing(["targetMarkets", "readyToUpload"])} cardRef={(node) => { questionRefs.current.finalStep = node; }}>
              <div className="space-y-4">
                <div className={`rounded-2xl border p-3 ${submitAttempted && missingKeys.has("targetMarkets") ? "border-rose-500/70 bg-rose-500/5" : "border-transparent"}`}>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {marketOptions.map((option) => {
                    const checked = form.targetMarkets.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleMulti("targetMarkets", option)}
                        className={`rounded-2xl border px-4 py-4 text-left text-base font-medium transition ${
                          checked
                            ? "border-yellow-400 bg-yellow-500/15 text-yellow-200"
                            : "border-zinc-700 bg-black text-zinc-200 hover:border-yellow-500/40"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {submitAttempted && missingKeys.has("targetMarkets") && (
                  <p className="mt-3 text-sm font-semibold text-rose-300">
                    Select at least one target market before continuing.
                  </p>
                )}
                </div>

                <div className={`rounded-2xl border p-3 ${submitAttempted && missingKeys.has("readyToUpload") ? "border-rose-500/70 bg-rose-500/5" : "border-transparent"}`}>
                  <FormSelect value={form.readyToUpload} onChange={(value) => updateField("readyToUpload", value)}>
                    <option value="">Are you ready to upload documents now?</option>
                    <option value="yes">Yes</option>
                    <option value="almost">Almost</option>
                    <option value="no">No</option>
                  </FormSelect>
                  {submitAttempted && missingKeys.has("readyToUpload") && (
                    <p className="mt-3 text-sm font-semibold text-rose-300">
                      Tell us whether you are ready to upload documents yet.
                    </p>
                  )}
                </div>
              </div>
            </QuestionCard>
          </div>

          <div className="mt-10 flex flex-col gap-4 rounded-[28px] border border-zinc-800 bg-zinc-950 p-5 md:flex-row md:items-center md:justify-between">
            <button
              type="button"
              onClick={() => router.push("/assessment")}
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-base font-semibold text-zinc-200 transition hover:bg-zinc-900"
            >
              Back to 5 Questions
            </button>

            <button
              type="button"
              onClick={handleContinue}
              className="rounded-2xl bg-yellow-400 px-6 py-4 text-base font-bold text-black transition hover:bg-yellow-300"
            >
              Continue to Results
            </button>
          </div>
        </section>

        <aside className="h-fit rounded-[32px] border border-yellow-500/25 bg-[#050508] p-6 xl:sticky xl:top-6">
          <h2 className="text-4xl font-bold text-yellow-400">Intake Summary</h2>

          <div className="mt-6 space-y-5">
            {assessmentSummary.map((item) => (
              <div key={item.label} className="rounded-[24px] border border-zinc-800 bg-black p-5">
                <p className="text-xl text-zinc-400">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-7 rounded-[24px] border border-zinc-800 bg-black p-5">
            <h3 className="text-2xl font-bold text-white">Application Health</h3>
            <p className="mt-3 text-lg text-zinc-300">
              Target path: <span className="font-semibold text-white">{targetCertificationLabel}</span>
            </p>
            <div className="mt-4 overflow-hidden rounded-full bg-zinc-900">
              <div
                className="h-3 rounded-full bg-yellow-400 transition-all"
                style={{ width: `${Math.max(6, completion)}%` }}
              />
            </div>
            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-yellow-300">
              Completion estimate {completion}%
            </p>
          </div>

          <div className="mt-7 rounded-[24px] border border-zinc-800 bg-black p-5">
            <h3 className="text-2xl font-bold text-white">Missing Items Check</h3>
            {missingItems.length === 0 ? (
              <p className="mt-3 text-lg text-green-300">
                Everything required is filled out.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {missingItems.slice(0, 10).map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => goToField(item.key)}
                    className="block w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-left text-base text-zinc-200 transition hover:border-yellow-500/40"
                  >
                    {item.label}
                  </button>
                ))}
                {missingItems.length > 10 && (
                  <p className="text-sm text-zinc-400">
                    + {missingItems.length - 10} more missing item(s)
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-7 rounded-[24px] border border-zinc-800 bg-black p-5">
            <h3 className="text-2xl font-bold text-white">Guided Flow</h3>
            <div className="mt-4 space-y-3">
              {[
                { label: "Login", status: "Complete" },
                { label: "Assessment", status: "Complete" },
                { label: "Apply", status: "In progress" },
                { label: "Results", status: "Next" },
                { label: "Documents", status: "Then upload" },
              ].map((step) => (
                <div
                  key={step.label}
                  className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
                >
                  <span className="text-base text-white">{step.label}</span>
                  <span className="text-sm uppercase tracking-[0.2em] text-yellow-300">
                    {step.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 rounded-[24px] border border-zinc-800 bg-black p-5">
            <h3 className="text-2xl font-bold text-white">Assessment Answers</h3>
            <div className="mt-4 space-y-3 text-sm text-zinc-300">
              {assessmentQuestions.map((question) => (
                <div key={question.key}>
                  <p className="font-semibold text-white">{question.title}</p>
                  <p className="mt-1">
                    {getAssessmentLabel(question.key, assessmentAnswers[question.key])}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
