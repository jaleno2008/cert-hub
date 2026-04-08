"use client";

import { notFound } from "next/navigation";
import FederalDocumentMap from "../../../../../components/federal-document-map";
import FederalIntroCard from "../../../../../components/federal-intro-card";
import FederalLoadingState from "../../../../../components/federal-loading-state";
import FederalQuestionBlock from "../../../../../components/federal-question-block";
import FederalSupportRail from "../../../../../components/federal-support-rail";
import { useFederalWizard } from "../../../../../components/use-federal-wizard";
import FederalWizardLayout from "../../../../../components/federal-wizard-layout";
import {
  FEDERAL_8A_SECTION_ORDER,
  FEDERAL_8A_SECTIONS,
  getFederal8aSection,
} from "../../../../../lib/federal-8a-sections";
import { FEDERAL_PROGRESS_ITEMS } from "../../../../../lib/federal-progress";
import {
  buildFederalDocumentPlan,
  type Federal8aSectionKey,
} from "../../../../../lib/federal-prep";

function getBackHref(section: Federal8aSectionKey) {
  if (section === "business") return "/federal/8a/eligibility";
  const currentIndex = FEDERAL_8A_SECTION_ORDER.indexOf(section);
  return `/federal/8a/sections/${FEDERAL_8A_SECTION_ORDER[currentIndex - 1]}`;
}

function getNextHref(section: Federal8aSectionKey) {
  if (section === "documents") return "/federal/8a/review";
  const currentIndex = FEDERAL_8A_SECTION_ORDER.indexOf(section);
  return `/federal/8a/sections/${FEDERAL_8A_SECTION_ORDER[currentIndex + 1]}`;
}

export default function FederalSectionPage({
  params,
}: {
  params: { section: string };
}) {
  const sectionKey = params.section as Federal8aSectionKey;
  if (!FEDERAL_8A_SECTIONS[sectionKey]) {
    notFound();
  }

  const { pageState, wizard, updateWizard, redirectTarget } = useFederalWizard();
  if (pageState !== "ready" || !wizard) {
    return (
      <FederalLoadingState
        loadingLabel="Loading section..."
        pageState={pageState}
        redirectTarget={redirectTarget}
      />
    );
  }

  const section = getFederal8aSection(sectionKey);
  const documentHints = Array.from(
    new Set(section.questions.flatMap((question) => question.documentHints ?? [])),
  );
  const documentPlan = buildFederalDocumentPlan(wizard);
  const gatherNow = documentPlan.filter(
    (item) => item.status === "missing" || item.status === "planned",
  );
  const uploadedCount = documentPlan.filter(
    (item) => item.status === "uploaded" || item.status === "verified",
  ).length;

  return (
    <FederalWizardLayout
      title={`SBA 8(a): ${section.shortTitle}`}
      stepLabel={`Step ${section.step + 2} of 9`}
      progressItems={FEDERAL_PROGRESS_ITEMS}
      currentKey={section.key}
      compareHref={
        sectionKey === "documents"
          ? "/federal/preview#documents-step"
          : "/federal/preview#eligibility"
      }
      backHref={getBackHref(sectionKey)}
      nextHref={getNextHref(sectionKey)}
      nextLabel={section.nextStepLabel}
      support={
        <FederalSupportRail
          title={sectionKey === "disadvantage" ? "How To Use This Step" : `${section.shortTitle} Support`}
          description={
            sectionKey === "disadvantage"
              ? "This step can feel more personal than the others. Keep the answers simple and honest. You are not trying to write the final SBA version here."
              : section.whyItMatters
          }
          documentHints={documentHints}
          tips={
            sectionKey === "disadvantage"
              ? [
                  "Short, clear answers are enough for this first pass.",
                  "If something feels sensitive or unfinished, choose the most honest answer you can and keep moving.",
                ]
              : [
                  "Keep answers factual, simple, and easy to support with documents.",
                  "If you are not sure, answer honestly and let the review page flag it for follow-up.",
                ]
          }
        />
      }
    >
      <FederalIntroCard
        title={section.title}
        description={section.description}
        whyItMatters={section.whyItMatters}
        officialLabel={section.officialLabel}
        applicantNote={section.applicantNote}
      />

      {sectionKey === "control" ? (
        <section className="rounded-[24px] border border-amber-200/12 bg-[linear-gradient(180deg,_rgba(33,24,12,0.45)_0%,_rgba(18,14,10,0.9)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-100/80">
            What SBA Is Checking Here
          </p>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-zinc-200">
            On the control side, SBA usually wants to know whether the main owner really runs
            the business in everyday life, not just on paper.
          </p>
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {[
              "Does the main owner make the big business decisions?",
              "Can that owner sign important contracts, checks, and legal documents?",
              "Is the owner actively involved in the daily operation of the business?",
              "Is anyone else quietly controlling major decisions behind the scenes?",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[20px] border border-amber-200/10 bg-black/30 p-4"
              >
                <p className="text-sm leading-7 text-zinc-100">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-[20px] border border-cyan-300/15 bg-cyan-300/8 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
              When To Choose Not Sure
            </p>
            <p className="mt-2 text-sm leading-7 text-zinc-200">
              Choose <strong>Not sure</strong> if ownership looks clear, but you are not fully
              confident about who really makes the final calls day to day.
            </p>
          </div>
        </section>
      ) : null}

      {sectionKey === "disadvantage" ? (
        <section className="rounded-[24px] border border-amber-200/12 bg-[linear-gradient(180deg,_rgba(33,24,12,0.45)_0%,_rgba(18,14,10,0.9)_100%)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)]">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-100/80">
            What SBA Is Checking Here
          </p>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-zinc-200">
            On the owner side, SBA usually wants to understand four things before moving forward with 8(a).
            This page is helping you organize those answers in plain English first.
          </p>
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {[
              "Is this the real owner of the business, with at least majority ownership?",
              "Does this owner actually control the business and make the big decisions?",
              "Is there any owner background story SBA may ask to understand later for 8(a)?",
              "Are the owner’s financial and identity records reasonably easy to gather?",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[20px] border border-amber-200/10 bg-black/30 p-4"
              >
                <p className="text-sm leading-7 text-zinc-100">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-[20px] border border-cyan-300/15 bg-cyan-300/8 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
              When To Choose Not Sure
            </p>
            <p className="mt-2 text-sm leading-7 text-zinc-200">
              Choose <strong>Not sure</strong> if you do not yet know whether the owner’s
              background or finances fully meet SBA’s standards. That is okay. We can still
              keep moving and flag what needs a closer review later.
            </p>
          </div>
        </section>
      ) : null}

      <div className="space-y-5">
        {section.questions.map((question) => (
          <FederalQuestionBlock
            key={question.id}
            label={question.label}
            helpText={question.helpText}
            explainWhy={question.explainWhy}
            exampleAnswer={question.exampleAnswer}
            value={wizard.sections[sectionKey].answers[question.id] ?? ""}
            onChange={(value) =>
              updateWizard((previous) => ({
                ...previous,
                sections: {
                  ...previous.sections,
                  [sectionKey]: {
                    ...previous.sections[sectionKey],
                    status: "in_progress",
                    startedAt:
                      previous.sections[sectionKey].startedAt ?? new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    answers: {
                      ...previous.sections[sectionKey].answers,
                      [question.id]: value,
                    },
                  },
                },
              }))
            }
            type={question.type}
            placeholder={question.placeholder}
            options={question.options}
          />
        ))}
      </div>

      {sectionKey === "documents" ? (
        <section className="space-y-6 rounded-[28px] border border-slate-600/20 bg-[linear-gradient(180deg,_rgba(14,24,36,0.98)_0%,_rgba(13,22,33,0.98)_58%,_rgba(10,17,26,0.98)_100%)] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-300">
                Ordered Upload Sequence
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                Work these documents in this order
              </h2>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
                This sequence starts with your basic federal IDs, then moves into
                ownership, control, financials, and supporting records so you can
                build momentum in a natural order.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[20px] border border-slate-600/20 bg-slate-950/60 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">Gather Now</p>
                <p className="mt-2 text-4xl font-bold text-white">{gatherNow.length}</p>
              </div>
              <div className="rounded-[20px] border border-slate-600/20 bg-slate-950/60 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">Already Ready</p>
                <p className="mt-2 text-4xl font-bold text-emerald-200">{uploadedCount}</p>
              </div>
              <div className="rounded-[20px] border border-slate-600/20 bg-slate-950/60 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">Best Start</p>
                <p className="mt-2 text-base font-semibold text-white">
                  {gatherNow[0]?.label ?? "Federal setup looks strong"}
                </p>
              </div>
            </div>
          </div>

          <FederalDocumentMap
            documents={gatherNow.map((item) => ({
              label: item.label,
              description: item.description,
              status: item.status,
            }))}
          />
        </section>
      ) : null}
    </FederalWizardLayout>
  );
}
