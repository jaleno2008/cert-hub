"use client";

import Link from "next/link";
import FederalLoadingState from "../../../../components/federal-loading-state";
import FederalQuestionBlock from "../../../../components/federal-question-block";
import FederalStatusChecklist from "../../../../components/federal-status-checklist";
import { useFederalWizard } from "../../../../components/use-federal-wizard";
import {
  businessEntityOptions,
  industryOptions,
  naicsIndustryPresets,
} from "../../../../lib/chub-flow";
import { getFederalSetupItems } from "../../../../lib/federal-prep";

export default function FederalPremiumSetupPage() {
  const { pageState, wizard, updateWizard, redirectTarget } = useFederalWizard();

  if (pageState !== "ready" || !wizard) {
    return (
      <FederalLoadingState
        loadingLabel="Loading premium federal setup..."
        pageState={pageState}
        redirectTarget={redirectTarget}
      />
    );
  }

  const setProfile = (key: keyof typeof wizard.profile, value: string) => {
    updateWizard((previous) => ({
      ...previous,
      profile: {
        ...previous.profile,
        [key]: value,
      },
    }));
  };

  const checklist = getFederalSetupItems(wizard.profile).map((item) => ({
    label: item.label,
    complete: item.complete,
  }));

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(72,217,255,0.14)_0%,_rgba(9,18,30,0.97)_28%,_rgba(6,10,18,1)_78%)] px-5 py-8 text-white md:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <section className="overflow-hidden rounded-[32px] border border-cyan-200/15 bg-[linear-gradient(135deg,_rgba(11,24,34,0.96)_0%,_rgba(12,25,38,0.98)_48%,_rgba(20,33,29,0.98)_100%)] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.34)] md:p-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <p className="text-sm font-bold uppercase tracking-[0.34em] text-cyan-200">
                Premium Federal Prep
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-6xl">
                Start with the SAM.gov and UEI mirror, then keep the momentum up.
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-200">
                This premium setup screen carries your CHub profile into the federal
                prep flow with a cleaner front end while keeping the same underlying
                answers and progress. This is the first guided federal step after Results,
                and it mirrors the SAM.gov / UEI side before the SBA 8(a) branch.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/federal/preview#federal-setup"
                className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/15"
              >
                Compare Setup Screens
              </Link>
              <Link
                href="/federal/setup"
                className="rounded-2xl border border-zinc-600/40 bg-zinc-950/40 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-900/60"
              >
                Open Guided Version
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              "Keep your business details aligned before the deeper certification steps.",
              "Use plain-English prompts without losing the federal meaning behind them.",
              "Carry the same saved answers forward into the shared review flow.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-cyan-200/12 bg-[#08131a]/78 p-5 backdrop-blur"
              >
                <p className="text-sm leading-7 text-slate-100">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <section className="rounded-[28px] border border-cyan-200/12 bg-[#091018]/88 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-200">
                Setup Focus
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                Let&apos;s line up the details that make the federal registration step easier
              </h2>
              <p className="mt-4 max-w-4xl text-base leading-8 text-slate-200">
                We&apos;ll use this information to keep your legal business details, EIN,
                UEI, and SAM.gov status in one place before you move into the
                SBA 8(a) certification flow.
              </p>
            </section>

            <section className="rounded-[24px] border border-amber-200/12 bg-[linear-gradient(180deg,_rgba(33,24,12,0.45)_0%,_rgba(18,14,10,0.9)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-100/80">
                What This SAM.gov / UEI Setup Is Checking
              </p>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-zinc-200">
                This first step is making sure the federal registration basics are lined up before
                you get into SBA 8(a) ownership, control, and documents. Most federal
                applications ask for these same foundation details in one form or another.
              </p>
              <div className="mt-5 grid gap-4 xl:grid-cols-2">
                {[
                  "What the business is legally called and who the main owner is",
                  "How to contact the business and where it is based",
                  "What type of business it is and which industry code best fits it",
                  "Whether the core federal IDs like EIN, UEI, and SAM.gov are already in place",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[20px] border border-amber-200/10 bg-black/30 p-4"
                  >
                    <p className="text-sm leading-7 text-zinc-100">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <FederalStatusChecklist items={checklist} />

            <div className="grid gap-6 xl:grid-cols-2">
              <FederalQuestionBlock
                label="What is the legal business name?"
                helpText="Use the registered business name exactly as it appears on your official records."
                explainWhy="This becomes the anchor for the federal setup path."
                value={wizard.profile.legalBusinessName}
                onChange={(value) => setProfile("legalBusinessName", value)}
                type="text"
                placeholder="ABC Services LLC"
              />
              <FederalQuestionBlock
                label="Who is the main owner?"
                helpText="Enter the person the business profile should center around."
                explainWhy="This helps connect setup, ownership, and control steps."
                value={wizard.profile.ownerName}
                onChange={(value) => setProfile("ownerName", value)}
                type="text"
                placeholder="Jane Doe"
              />
              <FederalQuestionBlock
                label="What is the company email?"
                helpText="Use the email you want tied to the federal path."
                explainWhy="This becomes part of the core contact profile."
                value={wizard.profile.companyEmail}
                onChange={(value) => setProfile("companyEmail", value)}
                type="text"
                placeholder="owner@company.com"
              />
              <FederalQuestionBlock
                label="What is the business phone?"
                helpText="Use the main business phone number."
                explainWhy="This keeps the profile consistent across later steps."
                value={wizard.profile.phone}
                onChange={(value) => setProfile("phone", value)}
                type="text"
                placeholder="305-555-1234"
              />
              <FederalQuestionBlock
                label="What is the business address?"
                helpText="Use the main address tied to your business records."
                explainWhy="This helps align your profile, registration, and supporting documents."
                value={wizard.profile.address1}
                onChange={(value) => setProfile("address1", value)}
                type="text"
                placeholder="123 Main Street"
              />
              <FederalQuestionBlock
                label="Which city should we use?"
                helpText="Use the city tied to the business records."
                explainWhy="City should stay aligned with the rest of the registered profile."
                value={wizard.profile.city}
                onChange={(value) => setProfile("city", value)}
                type="text"
                placeholder="Miami"
              />
              <FederalQuestionBlock
                label="Which state is the business tied to?"
                helpText="Use the registered state or the main business state."
                explainWhy="State alignment matters for later documents and setup records."
                value={wizard.profile.state}
                onChange={(value) => setProfile("state", value)}
                type="text"
                placeholder="FL"
              />
              <FederalQuestionBlock
                label="What is the zip code?"
                helpText="Use the zip connected to the business address."
                explainWhy="This keeps location details consistent across setup and documents."
                value={wizard.profile.zip}
                onChange={(value) => setProfile("zip", value)}
                type="text"
                placeholder="33101"
              />
              <FederalQuestionBlock
                label="What type of business entity is this?"
                helpText="Examples include LLC, Corporation, Sole Proprietorship, or Partnership."
                explainWhy="Entity type matters for ownership and document review."
                exampleAnswer="Example: LLC if the business is a limited liability company, Corporation if it is formally incorporated, or Sole Proprietorship if one person owns it directly."
                value={wizard.profile.entityType}
                onChange={(value) => setProfile("entityType", value)}
                type="select"
                options={businessEntityOptions.map((option) => ({ label: option, value: option }))}
              />
              <FederalQuestionBlock
                label="What is the main industry?"
                helpText="Pick the closest main industry for now."
                explainWhy="This helps us match the business to the right kind of opportunities and language later."
                value={wizard.profile.industry}
                onChange={(value) => {
                  const preset = naicsIndustryPresets.find((item) => item.industry === value);
                  updateWizard((previous) => ({
                    ...previous,
                    profile: {
                      ...previous.profile,
                      industry: value,
                      naicsCode: previous.profile.naicsCode || preset?.code || "",
                    },
                  }));
                }}
                type="select"
                options={industryOptions.map((option) => ({ label: option, value: option }))}
              />
              <FederalQuestionBlock
                label="What NAICS code should we carry into the federal path?"
                helpText="Use the known code or start from the preset CHub suggested."
                explainWhy="NAICS is the industry code many government systems use to describe what your business does."
                exampleAnswer="Example: 561720 for janitorial services. If you do not know the code yet, start with the closest one and refine it later."
                value={wizard.profile.naicsCode}
                onChange={(value) => setProfile("naicsCode", value)}
                type="text"
                placeholder="561720"
              />
              <FederalQuestionBlock
                label="What is the EIN status?"
                helpText="Tell the flow whether the EIN is already finished or still pending."
                explainWhy="EIN is one of the first federal setup checks."
                exampleAnswer="Example: Choose 'I have an EIN' if the IRS already issued it. Choose 'I am applying' if the request is in process."
                value={wizard.profile.einStatus}
                onChange={(value) => setProfile("einStatus", value)}
                type="radio"
                options={[
                  { label: "I have an EIN", value: "has-ein" },
                  { label: "I am applying", value: "applying" },
                  { label: "I do not have one yet", value: "no-ein" },
                ]}
              />
              <FederalQuestionBlock
                label="What is the UEI status?"
                helpText="Use this to show whether the UEI is already done or still being worked on."
                explainWhy="UEI is one of the basic IDs used in federal systems, so it helps to know whether you already have it."
                exampleAnswer="Example: Choose 'I have a UEI' if one was already assigned. Choose 'I am applying' if you have started that process but do not have the ID yet."
                value={wizard.profile.ueiStatus}
                onChange={(value) =>
                  updateWizard((previous) => ({
                    ...previous,
                    profile: {
                      ...previous.profile,
                      ueiStatus: value as typeof previous.profile.ueiStatus,
                    },
                  }))
                }
                type="radio"
                options={[
                  { label: "I have a UEI", value: "has-uei" },
                  { label: "I am applying", value: "applying" },
                  { label: "I do not have one yet", value: "no-uei" },
                ]}
              />
              <FederalQuestionBlock
                label="What is the UEI number?"
                helpText="If it is already available, store it here."
                explainWhy="This gives the business one clear place for the federal identifier."
                exampleAnswer="Example: If the business already has a UEI, save it here once so you do not have to keep hunting for it later."
                value={wizard.profile.uei}
                onChange={(value) => setProfile("uei", value)}
                type="text"
                placeholder="AB12CDEF3456"
              />
              <FederalQuestionBlock
                label="What is the SAM.gov status?"
                helpText="Show whether SAM.gov is active, in progress, or still not started."
                explainWhy="SAM.gov is one of the most common setup steps that can slow people down later if it is still unfinished."
                exampleAnswer="Example: Choose 'Active' if the registration is live now, 'In progress' if the account is being worked on, or 'Not sure' if you still need to confirm the current status."
                value={wizard.profile.samStatus}
                onChange={(value) =>
                  updateWizard((previous) => ({
                    ...previous,
                    profile: {
                      ...previous.profile,
                      samStatus: value as typeof previous.profile.samStatus,
                    },
                  }))
                }
                type="radio"
                options={[
                  { label: "Active", value: "active" },
                  { label: "In progress", value: "in_progress" },
                  { label: "Not started", value: "not_started" },
                  { label: "Not sure", value: "not_sure" },
                ]}
              />
              <FederalQuestionBlock
                label="Do you already have a CAGE code?"
                helpText="This can stay blank for now if you do not have it yet."
                explainWhy="It is optional in this first pass, but useful if it is already known."
                exampleAnswer="Example: Some businesses receive a CAGE code as part of their federal registration path. If you do not know it yet, you can leave this blank for now."
                value={wizard.profile.cageCode}
                onChange={(value) => setProfile("cageCode", value)}
                type="text"
                placeholder="7ABC1"
              />
            </div>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[26px] border border-cyan-200/12 bg-[#091018]/88 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.24)]">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">
                Premium Notes
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                This premium route is designed to feel lighter and more polished for
                testers who prefer the more elevated visual direction.
              </p>
            </section>

            <section className="rounded-[26px] border border-cyan-200/12 bg-[#091018]/88 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.24)]">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-100/80">
                Suggested Documents
              </p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-200">
                {["EIN letter", "Business registration", "UEI confirmation", "SAM.gov confirmation"].map(
                  (item) => (
                    <p key={item}>{item}</p>
                  ),
                )}
              </div>
            </section>

            <section className="rounded-[26px] border border-cyan-200/12 bg-[#091018]/88 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.24)]">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-100/80">
                Next Move
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                When this setup step is done, the user continues into the shared SBA 8(a)
                eligibility screen, then deeper SBA 8(a) section questions, then the
                document map and final review.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/federal/8a/eligibility"
                  className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
                >
                  Continue To SBA 8(a) Fit Check
                </Link>
                <Link
                  href="/federal/premium"
                  className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900"
                >
                  Back To Premium Entry
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
