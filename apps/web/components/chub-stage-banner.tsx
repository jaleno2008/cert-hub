import { CHUB_STAGES, getChubStage, type ChubStageKey } from "../lib/chub-stages";

export default function ChubStageBanner({
  stage,
  title,
  detail,
}: {
  stage: ChubStageKey;
  title?: string;
  detail?: string;
}) {
  const activeStage = getChubStage(stage);

  return (
    <div className="rounded-[24px] border border-cyan-300/18 bg-[linear-gradient(135deg,_rgba(12,22,34,0.96)_0%,_rgba(12,18,28,0.98)_55%,_rgba(10,14,21,0.98)_100%)] p-5 shadow-[0_18px_54px_rgba(0,0,0,0.22)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.34em] text-cyan-200">
            CHUB Roadmap
          </p>
          <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
            {title ?? `${activeStage.letter} — ${activeStage.name}`}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            {detail ?? activeStage.summary}
          </p>
          <div className="mt-4 rounded-[18px] border border-cyan-300/12 bg-slate-950/55 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-100/80">
              Main Question
            </p>
            <p className="mt-2 text-sm leading-7 text-zinc-200">{activeStage.question}</p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {CHUB_STAGES.map((item) => {
            const active = item.key === stage;

            return (
              <div
                key={item.key}
                className={`rounded-[18px] border px-4 py-3 ${
                  active
                    ? "border-cyan-300/28 bg-cyan-300/12"
                    : "border-slate-700/40 bg-slate-950/60"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">
                  {item.letter}
                </p>
                <p className="mt-1 text-sm font-semibold text-white">{item.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
