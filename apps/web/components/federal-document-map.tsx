export default function FederalDocumentMap({
  documents,
}: {
  documents: Array<{
    label: string;
    description: string;
    status: string;
  }>;
}) {
  return (
    <div className="grid gap-4">
      {documents.map((document, index) => (
        <div
          key={document.label}
          className="rounded-[22px] border border-slate-700/30 bg-[linear-gradient(180deg,_rgba(8,12,18,0.96)_0%,_rgba(10,15,22,0.96)_100%)] p-5 shadow-[0_12px_36px_rgba(0,0,0,0.22)]"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-200/15 bg-amber-100/5 text-sm font-bold text-amber-100/90">
                {index + 1}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{document.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
                  {document.description}
                </p>
              </div>
            </div>
            <span
              className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] ${
                document.status === "verified" || document.status === "uploaded"
                  ? "border-emerald-400/15 bg-emerald-400/10 text-emerald-100"
                  : document.status === "planned"
                    ? "border-amber-200/15 bg-amber-100/10 text-amber-100"
                    : "border-rose-400/15 bg-rose-400/10 text-rose-100"
              }`}
            >
              {document.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
