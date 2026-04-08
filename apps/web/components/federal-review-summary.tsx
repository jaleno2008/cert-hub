import type { FederalReviewSummary as Summary } from "../lib/federal-prep";

export default function FederalReviewSummary({
  summary,
}: {
  summary: Summary;
}) {
  const setupStateLabel = summary.setupComplete ? "Setup Complete" : "Setup Still Building";

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-600/20 bg-[linear-gradient(180deg,_rgba(14,24,36,0.98)_0%,_rgba(13,22,33,0.98)_58%,_rgba(10,17,26,0.98)_100%)] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-300">
          Federal Readiness
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <div className="rounded-[20px] border border-slate-600/20 bg-slate-950/60 p-5">
            <p className="text-sm uppercase tracking-[0.22em] text-zinc-400">Score</p>
            <p className="mt-2 text-5xl font-bold text-white">{summary.readinessScore}</p>
          </div>
          <div className="rounded-[20px] border border-slate-600/20 bg-slate-950/60 p-5">
            <p className="text-sm uppercase tracking-[0.22em] text-zinc-400">Status</p>
            <p className="mt-2 text-2xl font-bold text-slate-100">
              {summary.readinessLevel.replace("_", " ")}
            </p>
          </div>
          <div className="rounded-[20px] border border-slate-600/20 bg-slate-950/60 p-5">
            <p className="text-sm uppercase tracking-[0.22em] text-zinc-400">Track</p>
            <p className="mt-2 text-2xl font-bold text-white">SBA 8(a)</p>
          </div>
          <div className="rounded-[20px] border border-slate-600/20 bg-slate-950/60 p-5">
            <p className="text-sm uppercase tracking-[0.22em] text-zinc-400">Setup</p>
            <p className="mt-2 text-2xl font-bold text-white">{setupStateLabel}</p>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-950/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-slate-300 via-amber-100 to-amber-200"
            style={{ width: `${Math.max(8, summary.readinessScore)}%` }}
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[24px] border border-slate-700/30 bg-[linear-gradient(180deg,_rgba(12,18,27,0.98)_0%,_rgba(10,14,21,0.98)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-2xl font-bold text-white">Needs Attention</h3>
            <span className="rounded-full border border-amber-200/15 bg-amber-100/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-100">
              {summary.issues.length} items
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {summary.issues.map((issue) => (
              <div
                key={issue.id}
                className="rounded-[20px] border border-slate-700/30 bg-slate-950/60 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-semibold text-white">{issue.label}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${
                      issue.severity === "strong"
                        ? "bg-emerald-400/10 text-emerald-100"
                        : issue.severity === "needs_attention"
                          ? "bg-amber-100/10 text-amber-100"
                          : "bg-rose-400/10 text-rose-100"
                    }`}
                  >
                    {issue.severity.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-300">{issue.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[24px] border border-slate-700/30 bg-[linear-gradient(180deg,_rgba(12,18,27,0.98)_0%,_rgba(10,14,21,0.98)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
            <h3 className="text-2xl font-bold text-white">Next Steps</h3>
            <div className="mt-4 space-y-3">
              {summary.nextSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex gap-4 rounded-[20px] border border-slate-700/30 bg-slate-950/60 p-4 text-sm leading-7 text-slate-200"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-200/15 bg-amber-100/5 text-xs font-bold text-amber-100">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-700/30 bg-[linear-gradient(180deg,_rgba(12,18,27,0.98)_0%,_rgba(10,14,21,0.98)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
            <h3 className="text-2xl font-bold text-white">Missing Setup Items</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {summary.missingSetupItems.length > 0 ? (
                summary.missingSetupItems.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-600/20 bg-slate-950/70 px-4 py-2 text-sm text-slate-200"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="rounded-full border border-emerald-400/15 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100">
                  Federal setup is in strong shape
                </span>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
