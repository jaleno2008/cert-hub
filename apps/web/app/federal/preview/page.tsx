import Link from "next/link";

const comparisonSections = [
  {
    id: "federal-entry",
    title: "Federal Entry",
    premiumSrc: "/previews/federal-entry-premium.png",
    governmentSrc: "/previews/federal-entry-government.png",
    liveHref: "/federal",
    liveLabel: "Open Live Entry",
    detail: "Start at the federal landing page to choose between previewing the flow and entering the live wizard.",
  },
  {
    id: "federal-setup",
    title: "Federal Setup",
    premiumSrc: "/previews/federal-setup-premium.png",
    governmentSrc: "/previews/federal-setup-government.png",
    liveHref: "/federal/setup",
    liveLabel: "Open Live Setup",
    detail: "This is the basics step where business profile, EIN, UEI, and SAM.gov status get lined up.",
  },
  {
    id: "eligibility",
    title: "8(a) Eligibility",
    premiumSrc: "/previews/federal-eligibility-premium.png",
    governmentSrc: "/previews/federal-eligibility-government.png",
    liveHref: "/federal/8a/eligibility",
    liveLabel: "Open Live Eligibility",
    detail: "Use this step to pressure-test early 8(a) fit before you spend time in the deeper sections.",
  },
  {
    id: "documents-step",
    title: "Documents Step",
    premiumSrc: "/previews/federal-documents-premium.png",
    governmentSrc: "/previews/federal-documents-government.png",
    liveHref: "/federal/8a/sections/documents",
    liveLabel: "Open Live Documents",
    detail: "This step turns the answers into a practical document-gathering order instead of a vague checklist.",
  },
  {
    id: "review",
    title: "Review",
    premiumSrc: "/previews/federal-review-premium.png",
    governmentSrc: "/previews/federal-review-government.png",
    liveHref: "/federal/8a/review",
    liveLabel: "Open Live Review",
    detail: "The review page pulls setup, section answers, and document planning into one final prep dashboard.",
  },
];

function PreviewCard({
  label,
  src,
}: {
  label: string;
  src: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#091018] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.24)] md:p-4">
      <div className="mb-3 flex items-center justify-between gap-3 md:mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.26em] text-zinc-300 md:text-sm">
          {label}
        </p>
      </div>
      <div className="overflow-hidden rounded-[20px] border border-white/10 bg-black">
        <img src={src} alt={label} className="h-auto w-full" />
      </div>
    </div>
  );
}

export default function FederalPreviewPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#02060a_0%,_#081018_34%,_#060a10_100%)] px-4 py-6 text-white md:px-8 md:py-8">
      <div className="mx-auto max-w-[1800px] space-y-8">
        <section className="rounded-[28px] border border-cyan-300/18 bg-[linear-gradient(135deg,_rgba(7,20,28,0.96)_0%,_rgba(9,18,28,0.98)_55%,_rgba(13,17,24,0.98)_100%)] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.38)] md:rounded-[32px] md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.34em] text-cyan-200">
            Federal Style Compare
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white md:text-5xl">
            Premium vs government-ready on one page
          </h1>
          <p className="mt-4 max-w-5xl text-sm leading-7 text-zinc-100/88 md:text-base md:leading-8">
            This view shows both federal directions side by side so you can compare
            tone, hierarchy, and trust level without opening separate tabs. The live
            wizard stays on the current government-ready version.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 md:gap-4">
            <Link
              href="/federal/setup"
              className="rounded-2xl bg-amber-100 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-50 md:px-5"
            >
              Open Live Federal Wizard
            </Link>
            <Link
              href="/federal/premium/setup"
              className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/15 md:px-5"
            >
              Open Premium Live Flow
            </Link>
            <Link
              href="/federal"
              className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/15 md:px-5"
            >
              Open Federal Landing Page
            </Link>
            <Link
              href="/results"
              className="rounded-2xl border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900 md:px-5"
            >
              Back To Results
            </Link>
          </div>
        </section>

        <nav className="sticky top-3 z-10 -mx-1 overflow-x-auto rounded-[22px] border border-white/10 bg-[#091018]/90 px-3 py-3 backdrop-blur md:static md:mx-0 md:overflow-visible md:bg-[#091018]/70">
          <div className="flex min-w-max gap-2 md:flex-wrap">
            {comparisonSections.map((section) => (
              <Link
                key={section.id}
                href={`#${section.id}`}
                className="rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-200 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-100"
              >
                {section.title}
              </Link>
            ))}
          </div>
        </nav>

        {comparisonSections.map((section) => (
          <section
            id={section.id}
            key={section.title}
            className="scroll-mt-24 space-y-5 rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,_rgba(5,10,15,0.72)_0%,_rgba(8,14,20,0.62)_100%)] p-4 md:p-6"
          >
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white md:text-3xl">{section.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-300">
                  {section.detail}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                <div className="flex flex-wrap gap-3 text-[11px] font-bold uppercase tracking-[0.24em] md:text-xs">
                  <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-cyan-100">
                    Premium
                  </span>
                  <span className="rounded-full border border-amber-200/25 bg-amber-100/10 px-4 py-2 text-amber-100">
                    Government-ready
                  </span>
                </div>
                <Link
                  href={section.liveHref}
                  className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/15"
                >
                  {section.liveLabel}
                </Link>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <PreviewCard label="Premium Direction" src={section.premiumSrc} />
              <PreviewCard label="Government-ready Direction" src={section.governmentSrc} />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
