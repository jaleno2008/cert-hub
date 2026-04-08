import Link from "next/link";
import { LOCAL_AGENCY_REGISTRATIONS } from "../../lib/local-agencies";

export default function LocalEntryPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#081019_0%,_#0c1622_28%,_#0b1017_58%,_#080b11_100%)] px-5 py-8 text-white md:px-8">
      <div className="mx-auto max-w-[1480px] space-y-6">
        <section className="rounded-[30px] border border-slate-600/20 bg-[linear-gradient(180deg,_rgba(14,24,36,0.98)_0%,_rgba(13,22,33,0.98)_58%,_rgba(10,17,26,0.98)_100%)] p-8 shadow-[0_16px_48px_rgba(0,0,0,0.28)] md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-300">
            Local Registration
          </p>
          <h1 className="mt-4 max-w-5xl text-4xl font-bold leading-tight text-white md:text-6xl">
            Start with local vendor registration, then branch into DBE and SBE.
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-200">
            This branch mirrors the front door most local agencies require first:
            the vendor or supplier setup. Once that baseline is organized, CHUB can
            carry the same profile and documents into county or city certification paths.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              "Use one local business profile instead of repeating the same setup for every agency.",
              "Mirror the agency's vendor-registration step before asking for local certification details.",
              "Reuse the same documents later for Miami-Dade DBE/SBE and City of Miami programs.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-slate-700/30 bg-slate-950/60 p-5"
              >
                <p className="text-sm leading-7 text-slate-200">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          {LOCAL_AGENCY_REGISTRATIONS.map((agency) => (
            <div
              key={agency.slug}
              className="rounded-[30px] border border-slate-700/30 bg-[linear-gradient(180deg,_rgba(12,18,27,0.98)_0%,_rgba(10,14,21,0.98)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]"
            >
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">
                {agency.shortName}
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">{agency.vendorTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-zinc-300">{agency.vendorSummary}</p>

              <div className="mt-6 rounded-[20px] border border-slate-700/30 bg-slate-950/60 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">Why this comes first</p>
                <p className="mt-2 text-sm leading-7 text-zinc-200">{agency.whyItMatters}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href={`/local/${agency.slug}/vendor`}
                  className="rounded-2xl bg-[#b78a2a] px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-[#c99735]"
                >
                  Open Vendor Mirror
                </Link>
                <a
                  href={agency.systemUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900"
                >
                  Open Official System
                </a>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
