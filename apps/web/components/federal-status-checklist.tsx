export default function FederalStatusChecklist({
  items,
}: {
  items: Array<{ label: string; complete: boolean }>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[24px] border border-zinc-800 bg-black p-5"
        >
          <p className="text-sm uppercase tracking-[0.22em] text-zinc-400">Checklist</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{item.label}</h3>
          <p
            className={`mt-3 text-sm font-semibold ${
              item.complete ? "text-emerald-300" : "text-amber-300"
            }`}
          >
            {item.complete ? "Done" : "Needs attention"}
          </p>
        </div>
      ))}
    </div>
  );
}
