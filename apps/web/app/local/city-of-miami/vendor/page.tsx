import Link from "next/link";
import LocalJourneyLayout from "../../../../components/local-journey-layout";
import { getLocalAgencyRegistration } from "../../../../lib/local-agencies";
import { LOCAL_PROGRESS_ITEMS } from "../../../../lib/local-progress";

const agency = getLocalAgencyRegistration("city-of-miami");

export default function CityOfMiamiVendorPage() {
  if (!agency) return null;

  return (
    <LocalJourneyLayout
      journeyTitle="City Of Miami Journey"
      title="Mirror the City of Miami vendor registration first."
      stepLabel="Vendor Setup"
      progressItems={LOCAL_PROGRESS_ITEMS["city-of-miami"]}
      currentKey="vendor"
      backHref="/local"
    >
        <section className="rounded-[30px] border border-slate-600/20 bg-[linear-gradient(180deg,_rgba(14,24,36,0.98)_0%,_rgba(13,22,33,0.98)_58%,_rgba(10,17,26,0.98)_100%)] p-8 shadow-[0_16px_48px_rgba(0,0,0,0.28)] md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-300">
            City Of Miami Vendor Mirror
          </p>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-200">
            This step is the city supplier front door. It helps the business get
            the supplier profile, tax information, category selections, and reusable
            documents lined up before moving into city-facing procurement steps and,
            when needed, the Miami-Dade SBE certification handoff.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={agency.systemUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl bg-[#b78a2a] px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-[#c99735]"
            >
              Open Official City Registration
            </a>
            <a
              href={agency.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-6 py-4 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/15"
            >
              Open Supplier Corner
            </a>
            <Link
              href="/local"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900"
            >
              Back To Local Hub
            </Link>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-700/30 bg-[linear-gradient(180deg,_rgba(12,18,27,0.98)_0%,_rgba(10,14,21,0.98)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-100/80">
                What this step is checking
              </p>
              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                {agency.vendorSteps.map((step) => (
                  <div
                    key={step}
                    className="rounded-[20px] border border-slate-700/30 bg-slate-950/60 p-4"
                  >
                    <p className="text-sm leading-7 text-zinc-100">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-yellow-500/20 bg-[linear-gradient(180deg,_rgba(33,24,12,0.45)_0%,_rgba(18,14,10,0.9)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-yellow-200">
                Mirror application questions
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                Answer these before opening the city supplier system
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-200">
                This is the CHUB mirror. It prepares the city supplier information
                in plain English so the official portal feels less cold and confusing.
              </p>
              <div className="mt-5 space-y-3">
                {agency.mirrorQuestions.map((question) => (
                  <div
                    key={question}
                    className="rounded-[20px] border border-yellow-500/15 bg-black/40 p-4"
                  >
                    <p className="text-sm font-semibold leading-7 text-white">{question}</p>
                    <p className="mt-2 text-sm leading-7 text-zinc-300">
                      If the user is not sure, they can flag it and keep moving. CHUB
                      should treat it as a review item, not a dead end.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-700/30 bg-[linear-gradient(180deg,_rgba(12,18,27,0.98)_0%,_rgba(10,14,21,0.98)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">
                Common documents to line up now
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {agency.commonDocuments.map((doc) => (
                  <span
                    key={doc}
                    className="rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-zinc-200"
                  >
                    {doc}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-700/30 bg-[linear-gradient(180deg,_rgba(12,18,27,0.98)_0%,_rgba(10,14,21,0.98)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">
                What comes next
              </p>
              <div className="mt-4 space-y-4">
                {agency.nextPrograms.map((program) => (
                  <div
                    key={program.label}
                    className="rounded-[20px] border border-slate-700/30 bg-slate-950/60 p-4"
                  >
                    <p className="text-sm font-semibold text-white">{program.label}</p>
                    <p className="mt-2 text-sm leading-7 text-zinc-300">{program.detail}</p>
                    {program.href ? (
                      <div className="mt-4">
                        <Link
                          href={program.href}
                          className="inline-flex items-center justify-center rounded-2xl bg-[#b78a2a] px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-[#c99735]"
                        >
                          Open {program.label}
                        </Link>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-700/30 bg-[linear-gradient(180deg,_rgba(12,18,27,0.98)_0%,_rgba(10,14,21,0.98)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-100/80">
                Official systems
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                City vendor registration:{" "}
                <a href={agency.systemUrl} target="_blank" rel="noreferrer" className="text-cyan-200 underline underline-offset-4">
                  {agency.systemLabel}
                </a>
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                City procurement supplier information:{" "}
                <a href={agency.sourceUrl} target="_blank" rel="noreferrer" className="text-cyan-200 underline underline-offset-4">
                  {agency.sourceLabel}
                </a>
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                Important note: the City of Miami points businesses to Miami-Dade County
                for SBE certification, so CHUB should treat city vendor setup and county
                SBE certification as connected but separate steps.
              </p>
            </div>
          </div>
        </section>
    </LocalJourneyLayout>
  );
}
