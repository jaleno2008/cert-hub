"use client";

import Link from "next/link";
import { useMemo } from "react";
import FederalLoadingState from "../../../../components/federal-loading-state";
import FederalSupportRail from "../../../../components/federal-support-rail";
import { useFederalWizard } from "../../../../components/use-federal-wizard";
import FederalWizardLayout from "../../../../components/federal-wizard-layout";
import { FEDERAL_PROGRESS_ITEMS } from "../../../../lib/federal-progress";
import {
  buildFederalDocumentPlan,
  buildFederalReviewSummary,
} from "../../../../lib/federal-prep";
import { FEDERAL_8A_SECTIONS } from "../../../../lib/federal-8a-sections";

function getCompletionMode(score: number) {
  if (score >= 80) return "ready_now";
  if (score >= 55) return "almost_ready";
  return "needs_foundation";
}

export default function FederalCompletePage() {
  const { pageState, wizard, redirectTarget } = useFederalWizard();

  const summary = useMemo(
    () => (wizard ? wizard.review ?? buildFederalReviewSummary(wizard, FEDERAL_8A_SECTIONS) : null),
    [wizard],
  );
  const documentPlan = useMemo(() => (wizard ? buildFederalDocumentPlan(wizard) : []), [wizard]);

  if (pageState !== "ready" || !wizard || !summary) {
    return (
      <FederalLoadingState
        loadingLabel="Loading federal completion..."
        pageState={pageState}
        redirectTarget={redirectTarget}
      />
    );
  }

  const completionMode = getCompletionMode(summary.readinessScore);
  const gatherNow = documentPlan.filter(
    (item) => item.status === "missing" || item.status === "planned",
  );

  const completionConfig =
    completionMode === "ready_now"
      ? {
          badge: "Ready Now",
          title: "You have a strong federal prep foundation.",
          description:
            "The user has enough in place to move from prep into document collection and buyer-facing follow-through without a major reset.",
          primaryHref: "/documents",
          primaryLabel: "Go To Document Uploads",
          secondaryHref: "/dashboard",
          secondaryLabel: "Open Dashboard",
        }
      : completionMode === "almost_ready"
        ? {
            badge: "Almost Ready",
            title: "A few targeted fixes can move this into a stronger submission posture.",
            description:
              "The federal branch is doing its job: the path is clear, but the next move should focus on the highest-value missing items before pushing forward.",
            primaryHref: "/federal/8a/sections/documents",
            primaryLabel: "Fix Missing Federal Items",
            secondaryHref: "/documents",
            secondaryLabel: "Open Document Uploads",
          }
        : {
            badge: "Needs Foundation",
            title: "The user should return to the broader CHUB unblock plan before pushing further.",
            description:
              "This does not mean the federal path is closed. It means the business will benefit more from fixing basics first than from forcing the application branch too early.",
            primaryHref: "/results",
            primaryLabel: "Return To Results",
            secondaryHref: "/readiness",
            secondaryLabel: "Open Readiness Plan",
          };

  return (
    <FederalWizardLayout
      title="Federal Prep Complete"
      stepLabel="Next Step"
      progressItems={FEDERAL_PROGRESS_ITEMS}
      currentKey="review"
      compareHref="/federal/preview#review"
      backHref="/federal/8a/review"
      nextHref={completionConfig.primaryHref}
      nextLabel={completionConfig.primaryLabel}
      support={
        <FederalSupportRail
          title="What Happens After This"
          description="This handoff screen decides whether the user should move into uploads, fix a few federal gaps, or return to the broader CHUB action plan."
          documentHints={summary.missingDocuments}
          tips={[
            "If the next action feels too big, start with the first missing document or smallest unresolved issue.",
            "Use the dashboard after this screen if you want the broader CHUB roadmap, not just the federal branch.",
          ]}
        />
      }
    >
      <section className="rounded-[28px] border border-slate-600/20 bg-[linear-gradient(180deg,_rgba(14,24,36,0.98)_0%,_rgba(13,22,33,0.98)_58%,_rgba(10,17,26,0.98)_100%)] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">
          {completionConfig.badge}
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white">{completionConfig.title}</h2>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-200">
          {completionConfig.description}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[22px] border border-slate-700/30 bg-slate-950/60 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">Readiness Score</p>
            <p className="mt-2 text-4xl font-bold text-white">{summary.readinessScore}</p>
          </div>
          <div className="rounded-[22px] border border-slate-700/30 bg-slate-950/60 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">Readiness Level</p>
            <p className="mt-2 text-2xl font-bold text-cyan-100">{summary.readinessLevel}</p>
          </div>
          <div className="rounded-[22px] border border-slate-700/30 bg-slate-950/60 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">Gather Next</p>
            <p className="mt-2 text-base font-semibold text-white">
              {gatherNow[0]?.label ?? "Federal prep looks organized"}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[24px] border border-slate-700/30 bg-[linear-gradient(180deg,_rgba(12,18,27,0.98)_0%,_rgba(10,14,21,0.98)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
          <h2 className="text-2xl font-bold text-white">What Looks Strong</h2>
          <div className="mt-4 space-y-3">
            {summary.strongSections.length > 0 ? (
              summary.strongSections.map((section) => (
                <p key={section} className="text-sm leading-7 text-zinc-200">
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </p>
              ))
            ) : (
              <p className="text-sm leading-7 text-zinc-300">
                No section is strongly complete yet, which usually means the next move should stay focused on fundamentals.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-700/30 bg-[linear-gradient(180deg,_rgba(12,18,27,0.98)_0%,_rgba(10,14,21,0.98)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
          <h2 className="text-2xl font-bold text-white">What Still Needs Attention</h2>
          <div className="mt-4 space-y-3">
            {summary.issues.length > 0 ? (
              summary.issues.slice(0, 4).map((issue) => (
                <p key={issue.id} className="text-sm leading-7 text-zinc-200">
                  {issue.label}
                </p>
              ))
            ) : (
              <p className="text-sm leading-7 text-zinc-300">
                No major federal issues are showing right now.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-slate-700/30 bg-[linear-gradient(180deg,_rgba(12,18,27,0.98)_0%,_rgba(10,14,21,0.98)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
        <h2 className="text-2xl font-bold text-white">Choose Your Next Step</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          The federal branch is complete. Use the next action below to move into uploads, fix remaining gaps, or return to the wider CHUB roadmap.
        </p>
        <div className="mt-5 flex flex-wrap gap-4">
          <Link
            href={completionConfig.primaryHref}
            className="rounded-2xl bg-[#b78a2a] px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-[#c99735]"
          >
            {completionConfig.primaryLabel}
          </Link>
          <Link
            href={completionConfig.secondaryHref}
            className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900"
          >
            {completionConfig.secondaryLabel}
          </Link>
          <Link
            href="/federal/8a/review"
            className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900"
          >
            Back To Federal Review
          </Link>
        </div>
      </section>
    </FederalWizardLayout>
  );
}
