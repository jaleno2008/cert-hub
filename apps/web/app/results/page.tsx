"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ChubStageBanner from "../../components/chub-stage-banner";
import ResultsAiAssistant from "../../components/results-ai-assistant";
import {
  type ApplyAnswers,
  type AssessmentAnswers,
  type FixNowAction,
  STORAGE_KEYS,
  buildCertificationInsights,
  buildFixNowActions,
  formatEin,
  getApplySnapshotItems,
  getAssessmentSummaryItems,
  getDocumentsChecklist,
  getReadinessScore,
  getReadinessTier,
  normalizeApplyAnswers,
  normalizeAssessmentAnswers,
} from "../../lib/chub-flow";

function FixActionButton({ action }: { action: FixNowAction }) {
  const classes =
    "inline-flex items-center justify-center rounded-2xl bg-[#b78a2a] px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-[#c99735]";

  if (action.external) {
    return (
      <a href={action.href} target="_blank" rel="noreferrer" className={classes}>
        {action.title}
      </a>
    );
  }

  return (
    <Link href={action.href} className={classes}>
      {action.title}
    </Link>
  );
}

const localCertificationRoutes: Record<string, { href: string; label: string; note: string }> = {
  mbe: {
    href: "/local/miami-dade/sbe",
    label: "Open Miami-Dade Local Mirror",
    note: "Start with the local county path, then reuse the profile and documents for the right ownership-based certification lane.",
  },
  dbe: {
    href: "/local/miami-dade/dbe",
    label: "Open DBE Mirror",
    note: "This routes into the Miami-Dade County DBE prep path and explains how Florida UCP lets one DBE certification carry across participating agencies.",
  },
  sbe: {
    href: "/local/miami-dade/sbe",
    label: "Open SBE Mirror",
    note: "This routes into the Miami-Dade SBE prep path, where the user can choose the right category lane.",
  },
};

const localMirrorCards = [
  {
    title: "Miami-Dade County Vendor Registration",
    label: "County vendor setup",
    detail:
      "Start here when the business wants to register as a Miami-Dade County vendor before choosing SBE or DBE.",
    href: "/local/miami-dade/vendor",
  },
  {
    title: "City of Miami Vendor Registration",
    label: "City vendor setup",
    detail:
      "Use this when the business wants to line up the City of Miami supplier profile and procurement basics.",
    href: "/local/city-of-miami/vendor",
  },
  {
    title: "Miami-Dade SBE",
    label: "Local / county certification",
    detail:
      "This mirrors the small-business path by category, including Goods & Services, Construction, and A&E.",
    href: "/local/miami-dade/sbe",
  },
  {
    title: "Miami-Dade County DBE",
    label: "County front door / statewide UCP",
    detail:
      "This explains that Miami-Dade County can be the DBE front door, while Florida UCP makes one approved certification usable across participating agencies.",
    href: "/local/miami-dade/dbe",
  },
];

export default function ResultsPage() {
  const router = useRouter();
  const [assessmentAnswers, setAssessmentAnswers] =
    useState<AssessmentAnswers | null>(null);
  const [applyAnswers, setApplyAnswers] = useState<ApplyAnswers | null>(null);
  const [pageState, setPageState] = useState<"loading" | "ready" | "redirecting">(
    "loading"
  );
  const [redirectTarget, setRedirectTarget] = useState("/login");

  useEffect(() => {
    try {
      const email = localStorage.getItem(STORAGE_KEYS.email);
      const assessmentRaw = localStorage.getItem(STORAGE_KEYS.assessment);
      const applyRaw = localStorage.getItem(STORAGE_KEYS.apply);

      const goTo = (target: string) => {
        setRedirectTarget(target);
        setPageState("redirecting");
        router.replace(target);
        window.location.replace(target);
      };

      if (!email) {
        goTo("/login");
        return;
      }

      if (!assessmentRaw) {
        goTo("/assessment");
        return;
      }

      if (!applyRaw) {
        goTo("/apply");
        return;
      }

      setAssessmentAnswers(normalizeAssessmentAnswers(JSON.parse(assessmentRaw)));
      setApplyAnswers(normalizeApplyAnswers(JSON.parse(applyRaw)));
      setPageState("ready");
    } catch {
      setRedirectTarget("/apply");
      setPageState("redirecting");
      router.replace("/apply");
      window.location.replace("/apply");
    }
  }, [router]);

  const derived = useMemo(() => {
    if (!assessmentAnswers || !applyAnswers) return null;

    const readinessScore = getReadinessScore(assessmentAnswers, applyAnswers);
    const readinessTier = getReadinessTier(readinessScore);
    const assessmentSummary = getAssessmentSummaryItems(assessmentAnswers);
    const applySnapshot = getApplySnapshotItems(applyAnswers);
    const fixActions = buildFixNowActions(applyAnswers);
    const insights = buildCertificationInsights(assessmentAnswers, applyAnswers);
    const documentChecklist = getDocumentsChecklist(applyAnswers);

    return {
      readinessScore,
      readinessTier,
      assessmentSummary,
      applySnapshot,
      fixActions,
      documentChecklist,
      ...insights,
    };
  }, [assessmentAnswers, applyAnswers]);

  if (pageState !== "ready" || !assessmentAnswers || !applyAnswers || !derived) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="max-w-xl rounded-[28px] border border-zinc-800 bg-[#0b0b0f] p-8 text-center">
          <h1 className="text-2xl font-bold text-white">
            {pageState === "redirecting" ? "Taking you back to the right step..." : "Loading results..."}
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-300">
            {pageState === "redirecting"
              ? "The results page needs your completed login, assessment, and application answers. If the browser does not move automatically, use the button below."
              : "Please wait while we load your saved answers and build your readiness results."}
          </p>
          <div className="mt-6">
            <Link
              href={redirectTarget}
              className="inline-flex items-center justify-center rounded-2xl bg-[#b78a2a] px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-[#c99735]"
            >
              Go To {redirectTarget === "/login" ? "Login" : redirectTarget === "/assessment" ? "Assessment" : "Application"}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const {
    readinessScore,
    readinessTier,
    assessmentSummary,
    applySnapshot,
    fixActions,
    documentChecklist,
    matchedCertifications,
    unlockCandidates,
    actionPlan,
  } = derived;

  const capabilityBuilderActive =
    applyAnswers.capabilityStatement === "yes" ||
    applyAnswers.capabilityStatement === "need-help";
  const federalSignals = [
    assessmentAnswers.targetCertification === "sba-8a",
    applyAnswers.targetMarkets.includes("Federal"),
    applyAnswers.ueiSamStatus.length > 0,
  ];
  const federalSignalCount = federalSignals.filter(Boolean).length;
  const federalPrepRelevant = federalSignalCount > 0;
  const federalPrepPrimary =
    federalSignalCount >= 2 ||
    (assessmentAnswers.targetCertification === "sba-8a" &&
      applyAnswers.targetMarkets.includes("Federal"));
  const federalPrepReasons = [
    assessmentAnswers.targetCertification === "sba-8a"
      ? "they selected SBA 8(a) as the target certification"
      : null,
    applyAnswers.targetMarkets.includes("Federal")
      ? "they said they want to target federal buyers"
      : null,
    applyAnswers.ueiSamStatus.length > 0
      ? "they already shared federal registration progress like UEI or SAM.gov"
      : null,
  ].filter(Boolean) as string[];
  const localMirrorRelevant =
    ["mbe", "dbe", "sbe"].includes(assessmentAnswers.targetCertification) ||
    applyAnswers.targetMarkets.some((market) =>
      ["State", "County", "City / Local"].includes(market)
    );
  const needsCapabilityStatement =
    applyAnswers.capabilityStatement !== "yes" ||
    !applyAnswers.capabilityCoreServices.trim() ||
    !applyAnswers.capabilityDifferentiators.trim() ||
    !applyAnswers.capabilityPastPerformanceExample.trim() ||
    !applyAnswers.capabilityContactInfo.trim();

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white md:px-8">
      <div className="mx-auto max-w-[1750px] space-y-6">
        <section className="rounded-[32px] border border-zinc-800 bg-[#0b0b0f] p-6 md:p-8">
          <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
            <div className="rounded-[28px] border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 via-yellow-500/[0.03] to-transparent p-6">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
                Step 3 of 4
              </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-white md:text-5xl">
              Certification Readiness Results
            </h1>
            <p className="mt-4 max-w-4xl text-lg leading-8 text-zinc-300">
                These results are built from the answers the applicant already
                gave. The goal is to show the simplest next step, not overwhelm
                them with certification jargon.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-4">
                <div className="rounded-[24px] border border-zinc-800 bg-black p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-zinc-400">
                    Readiness Score
                  </p>
                  <p className="mt-3 text-4xl font-bold text-white">
                    {readinessScore}
                  </p>
                </div>
                <div className="rounded-[24px] border border-zinc-800 bg-black p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-zinc-400">
                    Readiness Tier
                  </p>
                  <p className="mt-3 text-3xl font-bold text-yellow-300">
                    {readinessTier}
                  </p>
                </div>
                <div className="rounded-[24px] border border-zinc-800 bg-black p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-zinc-400">
                    EIN Snapshot
                  </p>
                  <p className="mt-3 text-lg font-semibold text-white">
                    {applyAnswers.einStatus === "has-ein"
                      ? formatEin(applyAnswers.ein)
                      : applyAnswers.einStatus === "in-progress"
                        ? "Applying now"
                      : "Not obtained yet"}
                  </p>
                </div>
                <div className="rounded-[24px] border border-zinc-800 bg-black p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-zinc-400">
                    Recommended Path
                  </p>
                  <p className="mt-3 text-lg font-semibold text-white">
                    {assessmentSummary.find((item) => item.label === "Target Certification")?.value}
                  </p>
                </div>
            </div>
          </div>

          <div className="mt-6">
            <ChubStageBanner
              stage="unblock"
              title="CHUB Stage: Unblock"
              detail="Results are where CHUB shifts from understanding the business to clearing what is in the way. This page should tell the owner what matters now, what is missing, and what to do next without overload."
            />
          </div>

            <div className="rounded-[32px] border border-zinc-800 bg-black p-6">
              <h2 className="text-2xl font-bold text-yellow-400">Do This Next</h2>
              <p className="mt-3 text-base leading-7 text-zinc-300">
                These buttons send the applicant straight to the next action
                that will move them forward.
              </p>

              <div className="mt-5 space-y-4">
                {federalPrepPrimary && (
                  <div className="rounded-3xl border border-cyan-300/30 bg-cyan-300/10 p-5">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
                      Recommended Next Step
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">
                      Start Federal Premium Prep
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-zinc-200">
                      The best next move is to carry their CHUB answers into the guided
                      SBA 8(a) branch and walk them through the federal-specific
                      questions step by step.
                    </p>
                    <div className="mt-4 rounded-[20px] border border-cyan-300/12 bg-black/30 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">
                        Why You&apos;re Seeing This
                      </p>
                      <p className="mt-2 text-sm leading-7 text-zinc-200">
                        CHUB is recommending the federal premium path because{" "}
                        {federalPrepReasons.length === 1
                          ? federalPrepReasons[0]
                          : federalPrepReasons.length === 2
                            ? `${federalPrepReasons[0]} and ${federalPrepReasons[1]}`
                            : `${federalPrepReasons.slice(0, -1).join(", ")}, and ${federalPrepReasons[federalPrepReasons.length - 1]}`}.
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href="/federal/premium"
                        className="inline-flex items-center justify-center rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-bold text-black transition hover:bg-cyan-200"
                      >
                        Start Federal Premium Prep
                      </Link>
                      <Link
                        href="/federal/premium/setup"
                        className="inline-flex items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/15"
                      >
                        Go Straight To Setup
                      </Link>
                    </div>
                  </div>
                )}

                <div className="rounded-3xl border border-yellow-500/25 bg-yellow-500/10 p-5">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-300">
                    One-Page Capability Statement
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">
                    {needsCapabilityStatement
                      ? "Create the one-page business summary next"
                      : "Review and polish the capability statement"}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-200">
                    {needsCapabilityStatement
                      ? "Several agency paths ask for a short capability statement or service summary. CHUB can turn the answers already entered into a draft, then the user can edit, save, export text, or print it as a PDF."
                      : "The user already provided capability statement details. They can still open the builder to polish the wording, regenerate the narrative, or print/save a clean one-page version."}
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/capability-builder"
                      className="inline-flex items-center justify-center rounded-2xl bg-[#b78a2a] px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-[#c99735]"
                    >
                      {needsCapabilityStatement
                        ? "Create Capability Statement"
                        : "Open Capability Builder"}
                    </Link>
                  </div>
                </div>

                {localMirrorRelevant && (
                  <div className="rounded-3xl border border-emerald-300/25 bg-emerald-300/10 p-5">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-200">
                      Local Agency Mirror
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">
                      Open the local agency guided path
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-zinc-200">
                      This keeps the user inside CHUB first. They can walk
                      through Miami-Dade County, City of Miami, SBE, or DBE in
                      plain English before opening the official agency portal.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href="/local/miami-dade/vendor"
                        className="inline-flex items-center justify-center rounded-2xl bg-[#b78a2a] px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-[#c99735]"
                      >
                        Miami-Dade Vendor Mirror
                      </Link>
                      <Link
                        href="/local/city-of-miami/vendor"
                        className="inline-flex items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-5 py-3 text-sm font-bold text-emerald-100 transition hover:bg-emerald-300/15"
                      >
                        City of Miami Vendor Mirror
                      </Link>
                      <Link
                        href="/local/miami-dade/dbe"
                        className="inline-flex items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-5 py-3 text-sm font-bold text-emerald-100 transition hover:bg-emerald-300/15"
                      >
                        DBE Mirror
                      </Link>
                    </div>
                  </div>
                )}

                {fixActions.length === 0 ? (
                  <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-5">
                    <p className="text-lg font-semibold text-emerald-300">
                      No urgent blockers were detected.
                    </p>
                    <p className="mt-2 text-sm text-zinc-300">
                      You can move straight into document uploads and target
                      packaging.
                    </p>
                  </div>
                ) : (
                  fixActions.map((action) => (
                    <div
                      key={action.id}
                      className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5"
                    >
                      <h3 className="text-xl font-semibold text-white">
                        {action.title.replace("Fix This Now: ", "")}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-zinc-300">
                        {action.description}
                      </p>
                      <div className="mt-4">
                        <FixActionButton action={action} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-8">
            <div className="rounded-[32px] border border-zinc-800 bg-[#0b0b0f] p-6">
              <h2 className="text-3xl font-bold text-yellow-400">
                Auto-Filled Intake Snapshot
              </h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {assessmentSummary.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-zinc-800 bg-black p-5"
                  >
                    <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
                      {item.label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-zinc-800 bg-[#0b0b0f] p-6">
              <h2 className="text-3xl font-bold text-yellow-400">
                Auto-Filled Application Snapshot
              </h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {applySnapshot.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-zinc-800 bg-black p-5"
                  >
                    <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
                      {item.label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-zinc-800 bg-[#0b0b0f] p-6">
              <h2 className="text-3xl font-bold text-yellow-400">
                Action Plan
              </h2>
              <div className="mt-6 grid gap-4">
                {actionPlan.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-[24px] border border-zinc-800 bg-black p-5"
                  >
                    <p className="text-sm uppercase tracking-[0.2em] text-yellow-300">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-zinc-300">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-[32px] border border-zinc-800 bg-[#0b0b0f] p-6">
              <h2 className="text-3xl font-bold text-yellow-400">
                Best-Fit Certifications
              </h2>
              <div className="mt-6 grid gap-4">
                {matchedCertifications.map((match) => (
                  <div
                    key={match.id}
                    className="rounded-[24px] border border-zinc-800 bg-black p-5"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
                          {match.level}
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold text-white">
                          {match.name}
                        </h3>
                        <p className="mt-2 text-base font-medium text-yellow-200">
                          {match.plainEnglish}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-zinc-300">
                          {match.reason}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-center">
                        <p className="text-xs uppercase tracking-[0.2em] text-yellow-300">
                          Confidence
                        </p>
                        <p className="mt-1 text-2xl font-bold text-white">
                          {match.confidence}%
                        </p>
                      </div>
                    </div>

                    {match.missingDocs.length > 0 && (
                      <div className="mt-5">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
                          Readiness gaps
                        </p>
                        <div className="mt-3 flex flex-wrap gap-3">
                          {match.missingDocs.map((doc) => (
                            <span
                              key={doc}
                              className="rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-zinc-200"
                            >
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-5">
                      {localCertificationRoutes[match.id] ? (
                        <div>
                          <Link
                            href={localCertificationRoutes[match.id].href}
                            className="inline-flex items-center justify-center rounded-2xl bg-[#b78a2a] px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-[#c99735]"
                          >
                            {localCertificationRoutes[match.id].label}
                          </Link>
                          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300">
                            {localCertificationRoutes[match.id].note}
                          </p>
                        </div>
                      ) : (
                        <a
                          href={match.applyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900"
                        >
                          Review Program
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {localMirrorRelevant && (
              <div className="rounded-[32px] border border-yellow-500/20 bg-[#0b0b0f] p-6">
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-yellow-300">
                  Local Agency Mirrors
                </p>
                <h2 className="mt-3 text-3xl font-bold text-yellow-400">
                  Start with the agency registration, then certification
                </h2>
                <p className="mt-3 text-base leading-8 text-zinc-300">
                  CHUB now has a local branch for Miami-Dade County, City of
                  Miami, and the DBE/SBE paths. The idea is the same as federal:
                  line up the profile once, reuse the documents, then walk the
                  user into the right agency mirror step by step.
                </p>
                <div className="mt-6 grid gap-4">
                  {localMirrorCards.map((card) => (
                    <div
                      key={card.href}
                      className="rounded-[24px] border border-zinc-800 bg-black p-5"
                    >
                      <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
                        {card.label}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-white">
                        {card.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-zinc-300">
                        {card.detail}
                      </p>
                      <div className="mt-4">
                        <Link
                          href={card.href}
                          className="inline-flex items-center justify-center rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-3 text-sm font-bold text-yellow-100 transition hover:bg-yellow-500/15"
                        >
                          Open Mirror
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-[32px] border border-zinc-800 bg-[#0b0b0f] p-6">
              <h2 className="text-3xl font-bold text-yellow-400">
                Possible Next Certifications
              </h2>
              <div className="mt-6 space-y-4">
                {unlockCandidates.length === 0 ? (
                  <div className="rounded-[24px] border border-zinc-800 bg-black p-5">
                    <p className="text-lg font-semibold text-white">
                      No near-term unlock gaps were identified.
                    </p>
                  </div>
                ) : (
                  unlockCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="rounded-[24px] border border-zinc-800 bg-black p-5"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
                            {candidate.level}
                          </p>
                          <h3 className="mt-2 text-2xl font-semibold text-white">
                            {candidate.name}
                          </h3>
                          <p className="mt-2 text-base font-medium text-yellow-200">
                            {candidate.plainEnglish}
                          </p>
                          <p className="mt-3 text-sm leading-7 text-zinc-300">
                            {candidate.reason}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-center">
                          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                            Steps Away
                          </p>
                          <p className="mt-1 text-2xl font-bold text-white">
                            {candidate.stepsAway}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        {candidate.missingItems.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-zinc-200"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {capabilityBuilderActive && (
              <div className="rounded-[32px] border border-zinc-800 bg-[#0b0b0f] p-6">
              <h2 className="text-3xl font-bold text-yellow-400">
                  Capability Statement Snapshot
                </h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {[
                    { label: "Core Services", value: applyAnswers.capabilityCoreServices },
                    {
                      label: "Differentiators",
                      value: applyAnswers.capabilityDifferentiators,
                    },
                    {
                      label: "Past Performance Example",
                      value: applyAnswers.capabilityPastPerformanceExample,
                    },
                    {
                      label: "Certifications / Readiness",
                      value: applyAnswers.capabilityCertifications,
                    },
                    { label: "Contact Info", value: applyAnswers.capabilityContactInfo },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[24px] border border-zinc-800 bg-black p-5"
                    >
                      <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
                        {item.label}
                      </p>
                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-zinc-200">
                        {item.value || "—"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <ResultsAiAssistant
          matchedCertifications={matchedCertifications}
          unlockCandidates={unlockCandidates}
          actionPlan={actionPlan}
        />

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[32px] border border-zinc-800 bg-[#0b0b0f] p-6">
              <h2 className="text-3xl font-bold text-yellow-400">
              Document Checklist Preview
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              This is the early checklist the applicant can use before uploading
              documents.
            </p>
            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              {documentChecklist.map((group) => (
                <div
                  key={group.title}
                  className="rounded-[24px] border border-zinc-800 bg-black p-5"
                >
                  <h3 className="text-xl font-semibold text-white">
                    {group.title}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-zinc-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-zinc-800 bg-[#0b0b0f] p-6">
            <h2 className="text-3xl font-bold text-yellow-400">Flow Controls</h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-[24px] border border-zinc-800 bg-black p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
                  Current flow
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  /login → /assessment → /apply → /results
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    label: "Profile owner",
                    value: applyAnswers.ownerName || "—",
                  },
                  {
                    label: "Target markets",
                    value: applyAnswers.targetMarkets.join(", ") || "—",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-zinc-800 bg-black p-5"
                  >
                    <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
                      {item.label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {federalPrepRelevant && (
                <div className="rounded-[24px] border border-cyan-300/20 bg-gradient-to-r from-cyan-400/10 via-cyan-400/[0.05] to-transparent p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
                    Federal Branch
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    Start Federal Premium Prep
                  </h3>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-300">
                    Based on these answers, CHUB can carry the profile into a
                    guided SBA 8(a) branch. We will bring forward what the user
                    already answered, then walk them step by step through the
                    federal-specific setup, eligibility, documents, and review flow.
                  </p>
                  <div className="mt-4 rounded-[20px] border border-cyan-300/12 bg-black/30 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">
                      What Happens Next
                    </p>
                    <p className="mt-2 text-sm leading-7 text-zinc-200">
                      Results → Federal Premium → SAM.gov / UEI Mirror → SBA 8(a) Eligibility →
                      Section Questions → Documents → Review
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href="/federal/premium"
                      className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-bold transition ${
                        federalPrepPrimary
                          ? "border border-cyan-300/30 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/15"
                          : "bg-cyan-300 text-black hover:bg-cyan-200"
                      }`}
                    >
                      Start Federal Premium Prep
                    </Link>
                    <Link
                      href="/federal/premium/setup"
                      className="ml-3 inline-flex items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/15"
                    >
                      Go Straight To SAM.gov / UEI
                    </Link>
                    <Link
                      href="/federal/preview"
                      className="inline-flex items-center justify-center rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900"
                    >
                      Compare Screens First
                    </Link>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/apply"
                  className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900"
                >
                  Back to Application
                </Link>

                <Link
                  href="/documents"
                  className="rounded-2xl bg-[#b78a2a] px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-[#c99735]"
                >
                  Continue to Documents
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
