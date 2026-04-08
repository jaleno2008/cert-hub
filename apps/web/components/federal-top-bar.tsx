import Link from "next/link";

export default function FederalTopBar({
  title,
  stepLabel,
  compareHref,
}: {
  title: string;
  stepLabel: string;
  compareHref?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-slate-500/20 bg-[linear-gradient(180deg,_rgba(12,21,32,0.98)_0%,_rgba(14,24,36,0.98)_54%,_rgba(10,16,25,0.98)_100%)] px-5 py-6 shadow-[0_16px_48px_rgba(0,0,0,0.32)] md:px-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(209,188,136,0.72),transparent)]" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.34em] text-slate-300">
          Guided Federal Prep
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-bold leading-tight text-white md:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          We will walk through this one step at a time in plain English, so you can keep moving without guessing what comes next.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-[18px] border border-amber-200/15 bg-amber-100/5 px-4 py-3 text-right">
          <p className="text-xs uppercase tracking-[0.24em] text-amber-100/80">Current Step</p>
          <p className="mt-1 text-sm font-semibold text-white">{stepLabel}</p>
        </div>
        {compareHref ? (
          <Link
            href={compareHref}
            className="rounded-[18px] border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/15"
          >
            Compare Screens
          </Link>
        ) : null}
        <Link
          href="/results"
          className="rounded-[18px] border border-slate-500/20 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800/70"
        >
          Back To Results
        </Link>
      </div>
      </div>
    </div>
  );
}
