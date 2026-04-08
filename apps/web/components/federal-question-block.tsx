"use client";

type FieldType = "text" | "textarea" | "select" | "radio" | "number";

export default function FederalQuestionBlock({
  label,
  helpText,
  explainWhy,
  exampleAnswer,
  value,
  onChange,
  type,
  placeholder,
  options,
}: {
  label: string;
  helpText: string;
  explainWhy: string;
  exampleAnswer?: string;
  value: string;
  onChange: (value: string) => void;
  type: FieldType;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="rounded-[26px] border border-zinc-800 bg-black p-5">
      <h3 className="text-xl font-semibold text-white">{label}</h3>
      <p className="mt-2 text-sm leading-7 text-zinc-300">{helpText}</p>

      <div className="mt-4">
        {type === "textarea" ? (
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            rows={4}
            className="w-full rounded-2xl border border-zinc-700 bg-[#090d10] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-cyan-300"
          />
        ) : type === "select" ? (
          <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-2xl border border-zinc-700 bg-[#090d10] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300"
          >
            <option value="">Choose one</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === "radio" ? (
          <div className="flex flex-wrap gap-3">
            {options?.map((option) => {
              const active = value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange(option.value)}
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
        ) : (
          <input
            type={type === "number" ? "number" : "text"}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="w-full rounded-2xl border border-zinc-700 bg-[#090d10] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-cyan-300"
          />
        )}
      </div>

      <div className="mt-4 rounded-[20px] border border-zinc-800 bg-[#07131a] p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Why We&apos;re Asking</p>
        <p className="mt-2 text-sm leading-7 text-zinc-200">{explainWhy}</p>
      </div>

      {exampleAnswer ? (
        <div className="mt-4 rounded-[20px] border border-amber-200/15 bg-amber-100/5 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-amber-100/80">
            Good Enough For Now Example
          </p>
          <p className="mt-2 text-sm leading-7 text-zinc-200">{exampleAnswer}</p>
        </div>
      ) : null}
    </div>
  );
}
