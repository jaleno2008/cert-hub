import Link from "next/link";

export default function FederalPremiumEntryPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(72,217,255,0.16)_0%,_rgba(9,18,30,0.96)_28%,_rgba(6,10,18,1)_72%)] px-5 py-8 text-white md:px-8">
      <div className="mx-auto max-w-[1480px] space-y-6">
        <section className="overflow-hidden rounded-[32px] border border-cyan-200/15 bg-[linear-gradient(135deg,_rgba(11,24,34,0.96)_0%,_rgba(12,25,38,0.98)_48%,_rgba(20,33,29,0.98)_100%)] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.34)] md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.34em] text-cyan-200">
            Premium Federal Prep
          </p>
          <h1 className="mt-4 max-w-5xl text-4xl font-bold leading-tight text-white md:text-6xl">
            Start the federal branch with SAM.gov and UEI first, then move into SBA 8(a).
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-200">
            CHUB carries the business profile you already built into a cleaner,
            calmer federal prep experience. Instead of starting over, this branch
            picks up after Results, mirrors the SAM.gov / UEI setup first, and then
            walks the user step by step into the SBA 8(a) questions.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              "Reuse the CHub answers you already completed.",
              "Translate complex federal questions into plain English.",
              "Move from Results into SAM.gov / UEI, then into SBA 8(a), without losing progress.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-cyan-200/12 bg-[#08131a]/78 p-5 backdrop-blur"
              >
                <p className="text-sm leading-7 text-slate-100">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/federal/premium/setup"
              className="rounded-2xl bg-cyan-300 px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
            >
              Continue To SAM.gov / UEI Mirror
            </Link>
            <Link
              href="/federal/preview#federal-entry"
              className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-6 py-4 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/15"
            >
              Compare Premium To Guided
            </Link>
            <Link
              href="/federal"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900"
            >
              Open Guided Version
            </Link>
          </div>

          <div className="mt-8 rounded-[24px] border border-cyan-200/12 bg-[#08131a]/78 p-5 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-100/80">
              Federal Premium Path
            </p>
            <p className="mt-3 text-sm leading-7 text-zinc-100">
              Results decides whether the federal path is relevant. From here, the user
              moves into the SAM.gov / UEI mirror first, then into SBA 8(a) eligibility, the section
              questions, document ordering, and final review.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
