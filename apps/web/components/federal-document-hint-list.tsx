export default function FederalDocumentHintList({
  items,
}: {
  items: string[];
}) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-[24px] border border-zinc-800 bg-black p-5">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-400">
        Helpful Documents
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-zinc-200"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
