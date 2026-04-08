import Link from "next/link";
import LocalJourneyLayout from "../../../../components/local-journey-layout";
import { LOCAL_PROGRESS_ITEMS } from "../../../../lib/local-progress";

const categories = [
  {
    title: "SBE Goods & Services",
    summary:
      "Best for suppliers, service companies, and many general business vendors working with county departments.",
    checks: [
      "Small business size limits apply and can vary by category.",
      "Vendor registration and county supplier setup should already be underway.",
      "The business should have the local tax and registration records needed to prove it is real and active.",
    ],
  },
  {
    title: "SBE Construction",
    summary:
      "Best for firms doing construction, trades, and related county construction opportunities.",
    checks: [
      "Construction-specific small business size standards may differ from goods and services.",
      "Licensing, trade, and project classification details matter more here.",
      "Ownership, contact, and vendor setup records should already be organized before certification review.",
    ],
  },
  {
    title: "SBE Architecture & Engineering",
    summary:
      "Best for A&E firms pursuing county professional services opportunities.",
    checks: [
      "Professional licensing and service classification matter here.",
      "Firm structure, key personnel, and qualifications are especially important.",
      "This branch should reuse the same vendor and business records already organized in CHUB.",
    ],
  },
];

const commonDocs = [
  "Business registration",
  "Local business tax receipt or business tax records",
  "EIN letter and W-9",
  "Ownership documents",
  "Business address proof",
  "Licenses or professional credentials when applicable",
  "Capability statement or service summary",
];

const mirrorQuestions = [
  "Which Miami-Dade SBE category fits the business best: Goods & Services, Construction, or Architecture & Engineering?",
  "Is the business located in Miami-Dade County and actively performing the type of work it wants certified?",
  "Does the business have the local tax receipt, license, or registration records needed for the chosen SBE category?",
  "Do the ownership records and business profile match what was entered in vendor registration?",
  "Which documents are already ready, and which ones should CHUB flag before the user opens the official county application?",
];

export default function MiamiDadeSbePage() {
  return (
    <LocalJourneyLayout
      journeyTitle="Miami-Dade County Journey"
      title="Mirror the Miami-Dade Small Business Enterprise path category by category."
      stepLabel="SBE"
      progressItems={LOCAL_PROGRESS_ITEMS["miami-dade"]}
      currentKey="sbe"
      backHref="/local/miami-dade/vendor"
    >
        <section className="rounded-[30px] border border-slate-600/20 bg-[linear-gradient(180deg,_rgba(14,24,36,0.98)_0%,_rgba(13,22,33,0.98)_58%,_rgba(10,17,26,0.98)_100%)] p-8 shadow-[0_16px_48px_rgba(0,0,0,0.28)] md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-300">
            Miami-Dade SBE Mirror
          </p>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-200">
            Miami-Dade SBE is not one single lane. The county splits it by program type,
            so this mirror helps the business understand which SBE branch fits first and
            which common documents can be reused from vendor registration.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="https://www.miamidade.gov/global/strategic-procurement/small-business-enterprise-certification.page"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl bg-[#b78a2a] px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-[#c99735]"
            >
              Open Official Miami-Dade SBE Info
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
              "Which Miami-Dade SBE category actually matches the business",
              "Whether the business already completed the county vendor setup step",
              "Whether the common county small-business documents are easy to gather",
              "Which documents can be reused later for DBE or other county programs",
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
            Walk the SBE fit before the official county application
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-zinc-200">
            These are not meant to be scary. They help the user pick the right
            Miami-Dade SBE lane and spot missing records before opening the county system.
          </p>
          <div className="mt-5 grid gap-3 xl:grid-cols-2">
            {mirrorQuestions.map((question) => (
              <div
                key={question}
                className="rounded-[20px] border border-yellow-500/15 bg-black/40 p-4"
              >
                <p className="text-sm font-semibold leading-7 text-white">{question}</p>
                <p className="mt-2 text-sm leading-7 text-zinc-300">
                  Not sure is okay here. CHUB should flag it for review and still
                  keep the user oriented.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            {categories.map((category) => (
              <div
                key={category.title}
                className="rounded-[28px] border border-slate-700/30 bg-[linear-gradient(180deg,_rgba(12,18,27,0.98)_0%,_rgba(10,14,21,0.98)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]"
              >
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">
                  County SBE Category
                </p>
                <h2 className="mt-3 text-3xl font-bold text-white">{category.title}</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-300">{category.summary}</p>
                <div className="mt-5 space-y-3">
                  {category.checks.map((check) => (
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
                Miami-Dade SBE rules can vary by category, so this mirror should guide users into
                the right lane instead of acting like there is one universal county SBE checklist.
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                Official source:{" "}
                <a
                  href="https://www.miamidade.gov/global/strategic-procurement/small-business-enterprise-certification.page"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-200 underline underline-offset-4"
                >
                  Miami-Dade certification programs
                </a>
              </p>
            </div>
          </div>
        </section>
    </LocalJourneyLayout>
  );
}
