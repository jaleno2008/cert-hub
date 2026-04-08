import type { ReactNode } from "react";
import Link from "next/link";
import LocalProgressRail from "./local-progress-rail";
import type { LocalJourneyKey } from "../lib/local-progress";

export default function LocalJourneyLayout({
  journeyTitle,
  title,
  stepLabel,
  progressItems,
  currentKey,
  backHref = "/local",
  children,
}: {
  journeyTitle: string;
  title: string;
  stepLabel: string;
  progressItems: Array<{ key: LocalJourneyKey; label: string; href: string }>;
  currentKey: LocalJourneyKey;
  backHref?: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#081019_0%,_#0c1622_28%,_#0b1017_58%,_#080b11_100%)] px-5 py-8 text-white md:px-8">
      <div className="mx-auto max-w-[1580px] space-y-6">
        <section className="rounded-[28px] border border-slate-500/20 bg-[linear-gradient(180deg,_rgba(12,21,32,0.98)_0%,_rgba(14,24,36,0.98)_54%,_rgba(10,16,25,0.98)_100%)] px-6 py-6 shadow-[0_16px_48px_rgba(0,0,0,0.32)] md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.34em] text-slate-300">
                {journeyTitle}
              </p>
              <h1 className="mt-3 max-w-4xl text-3xl font-bold leading-tight text-white md:text-5xl">
                {title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                We&apos;ll keep this local path organized step by step so the business can move from vendor registration into the right city or county branch without starting over.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-[18px] border border-amber-200/15 bg-amber-100/5 px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-[0.24em] text-amber-100/80">Current Step</p>
                <p className="mt-1 text-sm font-semibold text-white">{stepLabel}</p>
              </div>
              <Link
                href={backHref}
                className="rounded-[18px] border border-slate-500/20 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800/70"
              >
                Back
              </Link>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <LocalProgressRail title={journeyTitle} items={progressItems} currentKey={currentKey} />
          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
