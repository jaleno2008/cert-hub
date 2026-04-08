import Link from "next/link";
import LocalJourneyLayout from "../../../../components/local-journey-layout";
import { LOCAL_PROGRESS_ITEMS } from "../../../../lib/local-progress";

const dbeChecks = [
  "The business should qualify as a small business under the applicable size standards.",
  "The disadvantaged owner should generally hold at least 51% ownership.",
  "That owner should control the business and make the major day-to-day decisions.",
  "The business should be ready to support the owner, control, and financial records the DBE review will ask for.",
];

const dbeDocs = [
  "Business registration",
  "Ownership documents",
  "Operating agreement or bylaws",
  "Owner ID and citizenship records",
  "Resumes and experience records",
  "Tax returns",
  "Financial statements",
  "Business address proof",
  "Vehicle or equipment records when applicable",
];

const ucpAgencies = [
  "Miami-Dade County",
  "Broward County",
  "FDOT",
  "Jacksonville Transportation Authority",
  "Greater Orlando Aviation Authority",
  "Hillsborough County Aviation Authority",
  "Lee County Port Authority",
  "Volusia County",
  "City of Tallahassee",
];

const mirrorQuestions = [
  "Is the business pursuing DBE because it wants transportation, transit, airport, or public infrastructure work?",
  "Who is the disadvantaged owner, and does that person own at least 51% of the business?",
  "Does that owner control the business and make the important day-to-day decisions?",
  "Are the tax returns, financial statements, ownership records, and resumes ready to gather?",
  "Which vendor-registration documents can be reused before the user opens the Miami-Dade County DBE system?",
];

export default function MiamiDadeDbePage() {
  return (
    <LocalJourneyLayout
      journeyTitle="Miami-Dade County Journey"
      title="Use Miami-Dade County as the DBE front door, then let Florida UCP carry that certification statewide."
      stepLabel="DBE"
      progressItems={LOCAL_PROGRESS_ITEMS["miami-dade"]}
      currentKey="dbe"
      backHref="/local/miami-dade/vendor"
    >
        <section className="rounded-[30px] border border-slate-600/20 bg-[linear-gradient(180deg,_rgba(14,24,36,0.98)_0%,_rgba(13,22,33,0.98)_58%,_rgba(10,17,26,0.98)_100%)] p-8 shadow-[0_16px_48px_rgba(0,0,0,0.28)] md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-300">
            Miami-Dade DBE Mirror
          </p>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-200">
            Miami-Dade County is the clean local front door for this DBE path. Because Florida uses
            a Unified Certification Program, one approved DBE certification through Miami-Dade
            County or another Florida UCP certifying agency can be recognized statewide. This means
            the user should not feel like they need to apply separately to Miami-Dade, Florida, and
            the City of Miami for the same DBE certification.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="https://mdcsbd.gob2g.com/"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl bg-[#b78a2a] px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-[#c99735]"
            >
              Open Miami-Dade County DBE System
            </a>
            <a
              href="https://www.miamidade.gov/global/service.page?Mduid_service=ser154032152188682"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-6 py-4 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/15"
            >
              Open Miami-Dade County DBE Info
            </a>
            <Link
              href="/local/miami-dade/vendor"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900"
            >
              Back To Miami-Dade Vendor Setup
            </Link>
          </div>
        </section>

        <section className="rounded-[28px] border border-amber-200/12 bg-[linear-gradient(180deg,_rgba(33,24,12,0.45)_0%,_rgba(18,14,10,0.9)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-100/80">
            What this branch is checking
          </p>
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {[
              "Whether the business is really trying to pursue the DBE path, not just county vendor setup",
              "Whether the owner, control, and small-business basics are strong enough to move into the Miami-Dade County DBE application",
              "Whether the business already has the core records DBE commonly asks for",
              "Whether the user understands that Florida UCP makes one DBE certification portable across participating agencies",
              "Which of the same county vendor documents can be reused so the user does not start over",
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
            Walk the DBE fit before the official Miami-Dade County application
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-zinc-200">
            This keeps the DBE path from feeling like a cold government form. CHUB helps the user
            understand what Miami-Dade County is likely checking before they leave the app, and it
            reinforces that they do not need to complete a separate City of Miami DBE application.
          </p>
          <div className="mt-5 grid gap-3 xl:grid-cols-2">
            {mirrorQuestions.map((question) => (
              <div
                key={question}
                className="rounded-[20px] border border-yellow-500/15 bg-black/40 p-4"
              >
                <p className="text-sm font-semibold leading-7 text-white">{question}</p>
                <p className="mt-2 text-sm leading-7 text-zinc-300">
                  Not sure is okay here. CHUB should flag it for review instead
                  of forcing the user to guess.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-cyan-300/18 bg-[linear-gradient(180deg,_rgba(12,22,34,0.98)_0%,_rgba(10,18,28,0.98)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">
            How Florida UCP works
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white">
            One DBE certification can open multiple Florida doors
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-zinc-200">
            Florida uses a Unified Certification Program. Once the business is approved through
            Miami-Dade County or another participating Florida UCP certifying agency, that DBE
            certification can be recognized by participating agencies statewide. CHUB should make
            this simple: apply once through the right UCP front door, then reuse that approval
            instead of starting over.
          </p>
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {[
              "Miami-Dade County can be the application front door for South Florida DBE users.",
              "Once approved through a Florida UCP certifying agency, the business does not need to apply again for a separate Florida DBE certification.",
              "There is no separate City of Miami DBE certification for the user to chase.",
              "The same owner, control, financial, and identity documents should be reused instead of rebuilt agency by agency.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[20px] border border-slate-700/30 bg-slate-950/65 p-4"
              >
                <p className="text-sm leading-7 text-zinc-100">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-[24px] border border-slate-700/30 bg-slate-950/65 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-100/80">
              Florida UCP certifying agencies
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {ucpAgencies.map((agency) => (
                <span
                  key={agency}
                  className="rounded-full border border-zinc-700 bg-black/30 px-4 py-2 text-sm text-zinc-200"
                >
                  {agency}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-700/30 bg-[linear-gradient(180deg,_rgba(12,18,27,0.98)_0%,_rgba(10,14,21,0.98)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">
                Florida UCP DBE baseline
              </p>
              <div className="mt-4 space-y-3">
                {dbeChecks.map((check) => (
                  <div
                    key={check}
                    className="rounded-[20px] border border-slate-700/30 bg-slate-950/60 p-4"
                  >
                    <p className="text-sm leading-7 text-zinc-100">{check}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-700/30 bg-[linear-gradient(180deg,_rgba(12,18,27,0.98)_0%,_rgba(10,14,21,0.98)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">
                Common documents to reuse
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {dbeDocs.map((doc) => (
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
                Official sources
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                Miami-Dade County DBE system:{" "}
                <a
                  href="https://mdcsbd.gob2g.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-200 underline underline-offset-4"
                >
                  Business Management Workforce System
                </a>
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                Miami-Dade County DBE information:{" "}
                <a
                  href="https://www.miamidade.gov/global/service.page?Mduid_service=ser154032152188682"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-200 underline underline-offset-4"
                >
                  Disadvantaged Business Enterprise
                </a>
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                Important note: DBE is not a separate City of Miami certification. Because Florida
                uses a Unified Certification Program, users should understand that one approved DBE
                certification through Miami-Dade County or another Florida UCP agency can be used
                statewide.
              </p>
            </div>
          </div>
        </section>
    </LocalJourneyLayout>
  );
}
