import Link from "next/link";

export type FederalProgressItem = {
  key: string;
  label: string;
  href?: string;
};

export default function FederalProgressRail({
  items,
  currentKey,
}: {
  items: readonly FederalProgressItem[];
  currentKey: string;
}) {
  const currentIndex = items.findIndex((entry) => entry.key === currentKey);

  return (
    <aside className="rounded-[26px] border border-slate-700/30 bg-[linear-gradient(180deg,_rgba(12,18,27,0.98)_0%,_rgba(10,14,21,0.98)_100%)] p-5 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
      <p className="text-xs font-bold uppercase tracking-[0.32em] text-slate-300">
        Federal Roadmap
      </p>
      <div className="mt-5 space-y-3">
        {items.map((item, index) => {
          const isCurrent = item.key === currentKey;
          const isPassed = currentIndex > index;
          const cardClassName = `block rounded-2xl border px-4 py-4 transition ${
            isCurrent
              ? "border-amber-200/20 bg-amber-100/5"
              : isPassed
                ? "border-slate-500/20 bg-slate-800/40 hover:border-slate-400/30 hover:bg-slate-800/70"
                : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/80"
          }`;
          const content = (
            <>
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                Step {index + 1}
              </p>
              <p className="mt-1 text-sm font-semibold text-white">{item.label}</p>
            </>
          );

          if (!item.href || isCurrent) {
            return (
              <div key={item.key} className={cardClassName} aria-current={isCurrent ? "step" : undefined}>
                {content}
              </div>
            );
          }

          return (
            <Link key={item.key} href={item.href} className={cardClassName}>
              {content}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
