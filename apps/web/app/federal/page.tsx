import Link from "next/link";

export default function FederalEntryPage() {
  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white md:px-8">
      <div className="mx-auto max-w-[1480px] space-y-6">
        <section className="rounded-[28px] border border-slate-600/20 bg-[linear-gradient(180deg,_rgba(14,24,36,0.98)_0%,_rgba(13,22,33,0.98)_58%,_rgba(10,17,26,0.98)_100%)] p-8 shadow-[0_16px_48px_rgba(0,0,0,0.28)] md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-300">
            Federal Prep Wizard
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-white md:text-6xl">
            Turn federal certification into a guided road map, not a giant form.
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-200">
            CHub will take the business profile you already built and carry it into a
            federal prep experience that starts with SAM.gov and UEI, then moves into
            the SBA 8(a) branch, ownership, control, documents, and review.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              "Reuse the CHub answers you already completed.",
              "Translate complex federal questions into plain English.",
              "Get a practical document sequence before touching the full application.",
            ].map((item) => (
              <div key={item} className="rounded-[20px] border border-slate-700/30 bg-slate-950/60 p-5">
                <p className="text-sm leading-7 text-slate-200">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/federal/preview"
              className="rounded-2xl bg-amber-100 px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-amber-50"
            >
              Review Federal Screens First
            </Link>
            <Link
              href="/federal/setup"
              className="rounded-2xl border border-slate-500/30 bg-slate-900/60 px-6 py-4 text-sm font-bold text-slate-100 transition hover:bg-slate-800/70"
            >
              Open Live Federal Registration Wizard
            </Link>
            <Link
              href="/results"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900"
            >
              Back To Results
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
