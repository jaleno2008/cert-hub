"use client";

import { useEffect, useMemo, useState } from "react";
import ChubStageBanner from "../../components/chub-stage-banner";

type StoredResults = {
  qualifiesNow?: string[];
  closeTo?: string[];
  future?: string[];
};

type PathLevel = "Foundation" | "Preparation" | "Application";

function getPathLevel(results: StoredResults | null): PathLevel {
  if (!results) return "Foundation";

  const qualifiesNow = results.qualifiesNow ?? [];
  const closeTo = results.closeTo ?? [];

  if (qualifiesNow.length >= 2) return "Application";
  if (qualifiesNow.length >= 1 || closeTo.length >= 1) return "Preparation";
  return "Foundation";
}

function getLevelDescription(level: PathLevel) {
  switch (level) {
    case "Application":
      return "You have enough in place to begin moving into active certification and contract-readiness steps.";
    case "Preparation":
      return "You are on the right path. A few strategic improvements can move you into stronger certification positioning.";
    case "Foundation":
    default:
      return "You are building the base. Start with structure, registration, and readiness so you can grow into larger opportunities.";
  }
}

function getTopAction(results: StoredResults | null) {
  if (!results) {
    return {
      title: "Complete your assessment flow",
      description:
        "Finish the guided application and results process so CHub can show you your best path forward.",
      href: "/apply",
      label: "Go to Apply",
    };
  }

  const qualifiesNow = results.qualifiesNow ?? [];
  const closeTo = results.closeTo ?? [];

  if (qualifiesNow.includes("Local Small Business Certification")) {
    return {
      title: "Start with local certification and vendor entry",
      description:
        "This is your best first move. Local registration and certification often create the fastest entry into contracting opportunities.",
      href: "/documents",
      label: "Prepare Documents",
    };
  }

  if (closeTo.includes("SBA 8(a) Certification")) {
    return {
      title: "Close the gap for SBA 8(a)",
      description:
        "You may be closer than you think. Focus on readiness items and missing requirements before moving into a federal application path.",
      href: "/documents",
      label: "See What You Need",
    };
  }

  return {
    title: "Keep building your readiness",
    description:
      "Continue strengthening your foundation so you can move toward the certifications that fit your business best.",
    href: "/readiness",
    label: "View Readiness",
  };
}

export default function DashboardPage() {
  const [results, setResults] = useState<StoredResults | null>(null);
  const [answersCount, setAnswersCount] = useState(0);

  useEffect(() => {
    const storedResults = localStorage.getItem("chub_results");
    const storedAnswers = localStorage.getItem("chub_answers");

    if (storedResults) {
      try {
        setResults(JSON.parse(storedResults));
      } catch {
        setResults(null);
      }
    }

    if (storedAnswers) {
      try {
        const parsed = JSON.parse(storedAnswers);
        setAnswersCount(Object.keys(parsed).length);
      } catch {
        setAnswersCount(0);
      }
    }
  }, []);

  const pathLevel = useMemo(() => getPathLevel(results), [results]);
  const topAction = useMemo(() => getTopAction(results), [results]);

  const qualifiesNow = results?.qualifiesNow ?? [];
  const closeTo = results?.closeTo ?? [];
  const future = results?.future ?? [];

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl border border-yellow-500/30 bg-slate-950/80 p-8 shadow-2xl">
          <div className="grid gap-8 md:grid-cols-[1.4fr_0.9fr] md:items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
                Certification Hub Dashboard
              </p>
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                Your pathway is active.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                CHub is designed to help you understand what you qualify for now,
                what you are close to, and what steps move you toward bigger
                contracting opportunities.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-black/40 p-6">
              <p className="text-base text-slate-400">Current Path Level</p>
              <h2 className="mt-2 text-4xl font-semibold tracking-tight text-yellow-400">
                {pathLevel}
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-300">
                {getLevelDescription(pathLevel)}
              </p>
            </div>
          </div>
        </div>

        <ChubStageBanner
          stage={
            pathLevel === "Foundation"
              ? "clarify"
              : pathLevel === "Preparation"
                ? "unblock"
                : "bid-ready"
          }
          title="CHUB Roadmap At A Glance"
          detail="This dashboard is where the full CHUB system comes together. Use Clarify to understand the business, Highlight to package it well, Unblock to clear what is missing, and Bid-Ready to move into real opportunities."
        />

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
            <p className="text-base text-slate-400">Assessment Progress</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-white">
              {answersCount}/24
            </p>
            <p className="mt-2 text-base leading-7 text-slate-400">
              Questions completed in your guided application flow.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
            <p className="text-base text-slate-400">Qualify Now</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-green-400">
              {qualifiesNow.length}
            </p>
            <p className="mt-2 text-base leading-7 text-slate-400">
              Certifications or entry paths you can begin now.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
            <p className="text-base text-slate-400">You&apos;re Close</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-yellow-400">
              {closeTo.length}
            </p>
            <p className="mt-2 text-base leading-7 text-slate-400">
              Opportunities that may open with a few more readiness steps.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
            <p className="text-base text-slate-400">Next Best Action</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              {topAction.title}
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
              {topAction.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={topAction.href}
                className="rounded-2xl bg-yellow-500 px-5 py-3 text-base font-semibold text-black transition hover:bg-yellow-400"
              >
                {topAction.label}
              </a>

              <a
                href="/results"
                className="rounded-2xl border border-slate-700 px-5 py-3 text-base font-semibold text-white transition hover:border-yellow-400 hover:text-yellow-400"
              >
                Review Results
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
            <p className="text-base text-slate-400">CHUB Stages</p>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-black/40 p-4">
                <p className="text-lg font-semibold text-white">C. Clarify</p>
                <p className="mt-1 text-base leading-7 text-slate-400">
                  Get clear on who you are, what you sell, and where certifications really help.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-black/40 p-4">
                <p className="text-lg font-semibold text-white">H. Highlight</p>
                <p className="mt-1 text-base leading-7 text-slate-400">
                  Package the business clearly so buyers and agencies can understand your strengths fast.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-black/40 p-4">
                <p className="text-lg font-semibold text-white">U. Unblock</p>
                <p className="mt-1 text-base leading-7 text-slate-400">
                  Clear the missing documents, misunderstandings, and process gaps that slow you down.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-black/40 p-4">
                <p className="text-lg font-semibold text-white">B. Bid-Ready</p>
                <p className="mt-1 text-base leading-7 text-slate-400">
                  Move into real applications, buyer conversations, and submission readiness with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
            <h3 className="text-3xl font-semibold tracking-tight text-green-400">
              You Qualify Now
            </h3>
            <div className="mt-4 space-y-3">
              {qualifiesNow.length > 0 ? (
                qualifiesNow.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="rounded-2xl border border-slate-800 bg-black/40 p-4"
                  >
                    <p className="text-lg font-semibold text-white">{item}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-slate-800 bg-black/40 p-4 text-base leading-7 text-slate-400">
                  No immediate matches saved yet. Complete your flow to unlock these.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
            <h3 className="text-3xl font-semibold tracking-tight text-yellow-400">
              You&apos;re Close
            </h3>
            <div className="mt-4 space-y-3">
              {closeTo.length > 0 ? (
                closeTo.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="rounded-2xl border border-slate-800 bg-black/40 p-4"
                  >
                    <p className="text-lg font-semibold text-white">{item}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-slate-800 bg-black/40 p-4 text-base leading-7 text-slate-400">
                  No close opportunities identified yet.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
            <h3 className="text-3xl font-semibold tracking-tight text-slate-300">
              Future Opportunities
            </h3>
            <div className="mt-4 space-y-3">
              {future.length > 0 ? (
                future.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="rounded-2xl border border-slate-800 bg-black/40 p-4"
                  >
                    <p className="text-lg font-semibold text-white">{item}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-slate-800 bg-black/40 p-4 text-base leading-7 text-slate-400">
                  Keep building. More opportunities will appear as your readiness grows.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <a
            href="/documents"
            className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 transition hover:border-yellow-400"
          >
            <p className="text-3xl font-semibold tracking-tight text-white">
              Documents
            </p>
            <p className="mt-3 text-base leading-7 text-slate-400">
              Organize the paperwork and supporting items needed for certification readiness.
            </p>
          </a>

          <a
            href="/uploads"
            className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 transition hover:border-yellow-400"
          >
            <p className="text-3xl font-semibold tracking-tight text-white">
              Uploads
            </p>
            <p className="mt-3 text-base leading-7 text-slate-400">
              Upload and manage files as you move through your certification journey.
            </p>
          </a>

          <a
            href="/readiness"
            className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 transition hover:border-yellow-400"
          >
            <p className="text-3xl font-semibold tracking-tight text-white">
              Readiness Plan
            </p>
            <p className="mt-3 text-base leading-7 text-slate-400">
              Follow the step-by-step roadmap that strengthens your qualification path.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
