import Link from "next/link";
import LocalJourneyLayout from "../../../../components/local-journey-layout";
import { LOCAL_PROGRESS_ITEMS } from "../../../../lib/local-progress";

const tracks = [
  {
    title: "City Supplier Participation",
    summary:
      "The first practical city lane is getting the supplier profile and procurement visibility in place so the business can respond to city opportunities.",
    checks: [
      "City vendor registration should already be underway through the supplier system.",
      "The business profile, contact details, and service categories should match what the firm actually sells.",
      "Core business records should already be organized so the city-facing path does not feel like starting over.",
    ],
  },
  {
    title: "County SBE For City Work",
    summary:
      "For City of Miami SBE participation, the certification itself runs through Miami-Dade County. CHUB should explain that the city uses the county SBE structure rather than a separate city-only SBE application.",
    checks: [
      "The business should understand that vendor registration with the city and SBE certification through the county are related but not the same step.",
      "Local business records and ownership details should already match the vendor profile before moving into the county SBE path.",
      "The business should be ready to reuse the same records when it opens the Miami-Dade SBE application.",
    ],
  },
];

const commonDocs = [
  "Business registration",
  "City or local business tax records",
  "EIN letter and W-9",
  "Ownership documents",
  "Business address proof",
  "Insurance or license records when applicable",
  "Capability statement or service summary",
];

const mirrorQuestions = [
  "Is the City of Miami vendor setup already started or completed?",
  "Does the business have local business tax, license, or registration records ready?",
  "Does the vendor profile clearly match the services the business wants to sell to the city?",
  "Does the business understand that City of Miami SBE certification is handled through Miami-Dade County?",
  "Does the business have a one-page capability statement or service summary ready?",
  "Which local records can be reused later for Miami-Dade SBE, DBE, or other local paths?",
];

export default function CityOfMiamiSbePage() {
  return (
    <LocalJourneyLayout
      journeyTitle="City Of Miami Journey"
      title="Mirror the City of Miami procurement path and county SBE handoff after vendor registration."
      stepLabel="Small-Business Path"
      progressItems={LOCAL_PROGRESS_ITEMS["city-of-miami"]}
      currentKey="sbe"
      backHref="/local/city-of-miami/vendor"
    >
        <section className="rounded-[30px] border border-slate-600/20 bg-[linear-gradient(180deg,_rgba(14,24,36,0.98)_0%,_rgba(13,22,33,0.98)_58%,_rgba(10,17,26,0.98)_100%)] p-8 shadow-[0_16px_48px_rgba(0,0,0,0.28)] md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-300">
            City Of Miami Procurement Mirror
          </p>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-200">
            This branch keeps the city flow honest and simple: vendor setup first, then city-facing
            procurement readiness, and then the county SBE handoff when the user wants SBE credit
            for City of Miami opportunities. The goal is to reuse the same business profile and
            documents instead of making the user restart for each local step.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="https://www.miami.gov/My-Government/Departments/Office-of-Capital-Improvements/Small-Business-Enterprise-FAQs"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl bg-[#b78a2a] px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-[#c99735]"
            >
              Open Official City SBE FAQ
            </a>
            <Link
              href="/local/miami-dade/sbe"
              className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-6 py-4 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/15"
            >
              Open Miami-Dade SBE Mirror
            </Link>
            <Link
              href="/local/city-of-miami/vendor"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900"
            >
              Back To City Vendor Setup
            </Link>
          </div>
        </section>

        <section className="rounded-[28px] border border-amber-200/12 bg-[linear-gradient(180deg,_rgba(33,24,12,0.45)_0%,_rgba(18,14,10,0.9)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-100/80">
            What this branch is checking
          </p>
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {[
              "Whether the city vendor setup is already lined up",
              "Whether the business profile and local records match the city-facing story",
              "Whether the firm has the common documents a city procurement path usually needs",
              "Whether the user understands that SBE certification itself is centralized through Miami-Dade County",
              "Whether the same records can be reused later for county certification and broader local branches",
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

        <section className="rounded-[28px] border border-yellow-500/20 bg-[linear-gradient(180deg,_rgba(33,24,12,0.45)_0%,_rgba(18,14,10,0.9)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-yellow-200">
            Mirror application questions
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white">
            Walk the city procurement path and county SBE handoff before opening the official sites
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-zinc-200">
            This mirror keeps the city path simple and practical: vendor setup,
            local proof, service categories, buyer-ready materials, and a clear
            reminder that City of Miami SBE itself is handled through Miami-Dade County.
          </p>
          <div className="mt-5 grid gap-3 xl:grid-cols-2">
            {mirrorQuestions.map((question) => (
              <div
                key={question}
                className="rounded-[20px] border border-yellow-500/15 bg-black/40 p-4"
              >
                <p className="text-sm font-semibold leading-7 text-white">{question}</p>
                <p className="mt-2 text-sm leading-7 text-zinc-300">
                  Not sure is okay. CHUB should turn it into a review item, not
                  a reason to stop.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            {tracks.map((track) => (
              <div
                key={track.title}
                className="rounded-[28px] border border-slate-700/30 bg-[linear-gradient(180deg,_rgba(12,18,27,0.98)_0%,_rgba(10,14,21,0.98)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]"
              >
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">
                  City Path
                </p>
                <h2 className="mt-3 text-3xl font-bold text-white">{track.title}</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-300">{track.summary}</p>
                <div className="mt-5 space-y-3">
                  {track.checks.map((check) => (
                    <div
                      key={check}
                      className="rounded-[20px] border border-slate-700/30 bg-slate-950/60 p-4"
                    >
                      <p className="text-sm leading-7 text-zinc-100">{check}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-700/30 bg-[linear-gradient(180deg,_rgba(12,18,27,0.98)_0%,_rgba(10,14,21,0.98)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">
                Common documents to reuse
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {commonDocs.map((doc) => (
                  <span
                    key={doc}
                    className="rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-zinc-200"
                  >
                    {doc}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-700/30 bg-[linear-gradient(180deg,_rgba(12,18,27,0.98)_0%,_rgba(10,14,21,0.98)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-100/80">
                Important note
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                There is no separate City of Miami SBE certification mirror here because the city
                points businesses to Miami-Dade County for SBE certification. CHUB should explain
                that clearly instead of pretending there is a city-only SBE application.
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                Official source:{" "}
                <a
                  href="https://www.miami.gov/My-Government/Departments/Office-of-Capital-Improvements/Small-Business-Enterprise-FAQs"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-200 underline underline-offset-4"
                >
                  City of Miami SBE FAQs
                </a>
              </p>
            </div>
          </div>
        </section>
    </LocalJourneyLayout>
  );
}
