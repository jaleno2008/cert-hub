import Link from "next/link";
import type { LocalJourneyKey } from "../lib/local-progress";

export default function LocalProgressRail({
  title,
  items,
  currentKey,
}: {
  title: string;
  items: Array<{ key: LocalJourneyKey; label: string; href: string }>;
  currentKey: LocalJourneyKey;
}) {
  return (
    <aside className="space-y-4 rounded-[26px] border border-slate-700/30 bg-[linear-gradient(180deg,_rgba(12,18,27,0.98)_0%,_rgba(10,14,21,0.98)_100%)] p-5 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-300">
        {title}
      </p>
      <div className="space-y-3">
        {items.map((item, index) => {
          const active = item.key === currentKey;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`block rounded-[20px] border px-4 py-4 transition ${
                active
                  ? "border-amber-200/20 bg-amber-100/8"
                  : "border-slate-700/30 bg-slate-950/60 hover:bg-slate-900/80"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                Step {index + 1}
              </p>
              <p className="mt-2 text-base font-semibold text-white">{item.label}</p>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
