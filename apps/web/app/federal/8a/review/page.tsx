"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import FederalLoadingState from "../../../../components/federal-loading-state";
import FederalReviewSummary from "../../../../components/federal-review-summary";
import FederalSupportRail from "../../../../components/federal-support-rail";
import { useFederalWizard } from "../../../../components/use-federal-wizard";
import FederalWizardLayout from "../../../../components/federal-wizard-layout";
import { FEDERAL_8A_SECTIONS } from "../../../../lib/federal-8a-sections";
import { FEDERAL_PROGRESS_ITEMS } from "../../../../lib/federal-progress";
import {
  buildFederalDocumentPlan,
  buildFederalPrepPacket,
  buildFederalReviewSummary,
} from "../../../../lib/federal-prep";

export default function FederalReviewPage() {
  const { pageState, wizard, updateWizard, redirectTarget } = useFederalWizard();
  const [showPacket, setShowPacket] = useState(false);
  const summary = useMemo(
    () => (wizard ? buildFederalReviewSummary(wizard, FEDERAL_8A_SECTIONS) : null),
    [wizard],
  );
  const documentPlan = useMemo(
    () => (wizard ? buildFederalDocumentPlan(wizard) : []),
    [wizard],
  );
  const prepPacket = useMemo(
    () =>
      wizard && summary
        ? buildFederalPrepPacket(
            { ...wizard, documents: documentPlan },
            FEDERAL_8A_SECTIONS,
            summary,
          )
        : null,
    [documentPlan, summary, wizard],
  );

  useEffect(() => {
    if (!wizard || !summary) return;
    if (JSON.stringify(wizard.review) === JSON.stringify(summary)) return;

    updateWizard((previous) => ({
      ...previous,
      documents: documentPlan,
      review: summary,
    }));
  }, [documentPlan, summary, updateWizard, wizard]);

  if (pageState !== "ready" || !wizard) {
    return (
      <FederalLoadingState
        loadingLabel="Loading review..."
        pageState={pageState}
        redirectTarget={redirectTarget}
      />
    );
  }

  return (
    <FederalWizardLayout
      title="Review Everything In One Place"
      stepLabel="Step 9 of 9"
      progressItems={FEDERAL_PROGRESS_ITEMS}
      currentKey="review"
      compareHref="/federal/preview#review"
      backHref="/federal/8a/sections/documents"
      nextHref="/federal/8a/complete"
      nextLabel="Finish Federal Prep"
      support={
        <FederalSupportRail
          title="How To Read This Page"
          description="This review page pulls your answers into one place so you can see what looks strong, what is still missing, and what to do next before the full application."
          documentHints={summary.missingDocuments}
          tips={[
            "Use this page to decide what to finish now and what can wait until later.",
            "The best next step is usually the smallest missing item that helps you regain momentum.",
          ]}
        />
      }
    >
      <FederalReviewSummary summary={summary} />

      <div className="rounded-[28px] border border-slate-600/20 bg-[linear-gradient(180deg,_rgba(14,24,36,0.98)_0%,_rgba(13,22,33,0.98)_58%,_rgba(10,17,26,0.98)_100%)] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-300">
              Draft Prep Packet
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Turn your answers into a plain-English prep packet
            </h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
              This turns your setup answers, section answers, and document order into one reviewable packet you can follow before touching the full federal application.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowPacket((current) => !current)}
            className="rounded-2xl bg-[#b78a2a] px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-[#c99735]"
          >
            {showPacket ? "Hide Draft Packet" : "Generate Draft Packet"}
          </button>
        </div>

        {showPacket && prepPacket ? (
          <div className="mt-6 space-y-5 rounded-[24px] border border-slate-600/20 bg-slate-950/70 p-6">
            <div>
              <h3 className="text-2xl font-bold text-white">{prepPacket.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-300">{prepPacket.overview}</p>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {prepPacket.sections.map((section) => (
                <div
                  key={section.title}
                  className="rounded-[18px] border border-slate-700/30 bg-[#101822] p-4"
                >
                  <p className="text-sm font-semibold text-white">{section.title}</p>
                  <p className="mt-2 text-sm leading-7 text-zinc-300">{section.summary}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <div className="rounded-[18px] border border-slate-700/30 bg-[#101822] p-4">
                <p className="text-sm font-semibold text-white">Next Steps</p>
                <div className="mt-3 space-y-3">
                  {prepPacket.nextSteps.map((step) => (
                    <p key={step} className="text-sm leading-7 text-zinc-300">
                      {step}
                    </p>
                  ))}
                </div>
              </div>
              <div className="rounded-[18px] border border-slate-700/30 bg-[#101822] p-4">
                <p className="text-sm font-semibold text-white">Document Order</p>
                <div className="mt-3 space-y-3">
                  {prepPacket.documentOrder.map((item, index) => (
                    <p key={item} className="text-sm leading-7 text-zinc-300">
                      {index + 1}. {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-[24px] border border-slate-700/30 bg-[linear-gradient(180deg,_rgba(12,18,27,0.98)_0%,_rgba(10,14,21,0.98)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
        <h2 className="text-2xl font-bold text-white">What To Do Next</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          Use these actions to tighten up your answers, reorder your prep work, or move back into the main CHub documents flow.
        </p>
        <div className="mt-5 flex flex-wrap gap-4">
          <Link
            href="/federal/setup"
            className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900"
          >
            Review Setup
          </Link>
          <Link
            href="/federal/8a/sections/documents"
            className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900"
          >
            Reorder Documents
          </Link>
          <Link
            href="/documents"
            className="rounded-2xl bg-[#b78a2a] px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-[#c99735]"
          >
            Open CHub Documents
          </Link>
        </div>
      </div>
    </FederalWizardLayout>
  );
}
