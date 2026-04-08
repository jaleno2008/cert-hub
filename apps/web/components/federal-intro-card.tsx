export default function FederalIntroCard({
  title,
  description,
  whyItMatters,
  officialLabel,
  applicantNote,
}: {
  title: string;
  description: string;
  whyItMatters: string;
  officialLabel?: string;
  applicantNote?: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-slate-600/20 bg-[linear-gradient(180deg,_rgba(14,24,36,0.98)_0%,_rgba(13,22,33,0.98)_58%,_rgba(10,17,26,0.98)_100%)] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(209,188,136,0.7),transparent)]" />
      <div className="relative">
      <p className="text-xs font-bold uppercase tracking-[0.32em] text-slate-300">
        Step Guide
      </p>
      <h2 className="mt-3 max-w-4xl text-3xl font-bold leading-tight text-white md:text-[2.2rem]">
        {title}
      </h2>
      <p className="mt-4 max-w-4xl text-base leading-8 text-slate-200">{description}</p>
      {officialLabel ? (
        <div className="mt-5 rounded-[22px] border border-slate-600/20 bg-slate-950/60 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-amber-100/80">SBA Application Area</p>
          <p className="mt-2 text-sm font-semibold text-white">{officialLabel}</p>
          {applicantNote ? (
            <p className="mt-2 text-sm leading-7 text-slate-300">{applicantNote}</p>
          ) : null}
        </div>
      ) : null}
      <div className="mt-5 rounded-[22px] border border-cyan-300/15 bg-cyan-300/8 p-5">
        <p className="text-sm leading-7 text-cyan-50">
          We ask this now so the real SBA application feels more familiar later.
        </p>
      </div>
      <div className="mt-6 rounded-[22px] border border-slate-600/20 bg-slate-950/60 p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-amber-100/80">Why This Matters</p>
        <p className="mt-2 text-sm leading-7 text-slate-200">{whyItMatters}</p>
      </div>
      </div>
    </section>
  );
}
