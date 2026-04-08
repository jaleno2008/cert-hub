"use client";

export default function FederalEligibilityGrid({
  items,
  onChange,
}: {
  items: Array<{
    key: string;
    label: string;
    definition: string;
    notSureHint: string;
    value: string;
  }>;
  onChange: (key: string, value: string) => void;
}) {
  const options = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
    { label: "Not sure", value: "not_sure" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.key}
          className="rounded-[24px] border border-zinc-800 bg-black p-5"
        >
          <h3 className="text-lg font-semibold text-white">{item.label}</h3>
          <p className="mt-3 text-sm leading-7 text-zinc-300">{item.definition}</p>
          <div className="mt-4 rounded-[18px] border border-cyan-300/15 bg-cyan-300/8 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
              If You&apos;re Not Sure
            </p>
            <p className="mt-2 text-sm leading-7 text-zinc-200">{item.notSureHint}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {options.map((option) => {
              const active = option.value === item.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange(item.key, option.value)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "border-cyan-300 bg-cyan-300 text-black"
                      : "border-zinc-700 bg-[#090d10] text-zinc-200 hover:border-cyan-300/60"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
