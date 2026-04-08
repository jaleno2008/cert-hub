import FederalDocumentHintList from "./federal-document-hint-list";

export default function FederalSupportRail({
  title = "Support Rail",
  description,
  documentHints = [],
  tips = [],
}: {
  title?: string;
  description: string;
  documentHints?: string[];
  tips?: string[];
}) {
  return (
    <aside className="space-y-5 rounded-[26px] border border-slate-700/30 bg-[linear-gradient(180deg,_rgba(12,18,27,0.98)_0%,_rgba(10,14,21,0.98)_100%)] p-5 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
      <div className="rounded-[22px] border border-slate-700/30 bg-slate-950/70 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-300">
          {title}
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">{description}</p>
      </div>

      <FederalDocumentHintList items={documentHints} />

      {tips.length > 0 ? (
        <div className="rounded-[22px] border border-slate-700/30 bg-slate-950/70 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-100/80">
            Helpful Tips
          </p>
          <div className="mt-4 space-y-3">
            {tips.map((tip) => (
              <p key={tip} className="text-sm leading-7 text-zinc-200">
                {tip}
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
