"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type ApplyPayload = {
  formData: Record<string, string>;
  selectedTargets: string[];
  score: number;
  completion: number;
  answeredCount: number;
  totalQuestions: number;
  statusLabel: string;
  missingItems: Array<{
    key: string;
    label: string;
    sectionId: string;
    sectionNumber: number;
    sectionTitle: string;
  }>;
};

function safeParseData(raw: string | null): ApplyPayload | null {
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return null;
  }
}

function safeParseLocalStorage(): ApplyPayload | null {
  if (typeof window === "undefined") return null;
  const saved = window.localStorage.getItem("chub_apply_data");
  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

function ReadinessPlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [applyData, setApplyData] = useState<ApplyPayload | null>(null);

  useEffect(() => {
    const fromQuery = safeParseData(searchParams.get("data"));
    const fromStorage = safeParseLocalStorage();
    setApplyData(fromQuery ?? fromStorage);
  }, [searchParams]);

  const nextSteps = useMemo(() => {
    if (!applyData) return [];

    const steps: string[] = [];

    if (applyData.missingItems.some((item) => item.key === "ein")) {
      steps.push("Correct the EIN so it contains exactly 9 digits.");
    }

    if (applyData.missingItems.some((item) => item.sectionNumber === 2)) {
      steps.push("Finish the core readiness documents section.");
    }

    if (applyData.missingItems.some((item) => item.sectionNumber === 3)) {
      steps.push("Complete the business credibility section.");
    }

    if (applyData.missingItems.some((item) => item.sectionNumber === 4)) {
      steps.push("Complete the experience and capacity section.");
    }

    if (applyData.missingItems.some((item) => item.sectionNumber === 5)) {
      steps.push("Complete the operational capacity section.");
    }

    if (steps.length === 0) {
      steps.push("Your required items are complete. Move into certification matches.");
      steps.push("Review the programs that fit your selected targets.");
      steps.push("Begin gathering final supporting documents for submission.");
    }

    return steps;
  }, [applyData]);

  return (
    <main className="min-h-screen bg-[#020b36] px-6 py-10 text-white">
      <div className="mx-auto max-w-[1200px]">
        <section className="rounded-[28px] border border-cyan-500/20 bg-[#071246] p-6 md:p-8">
          <p className="mb-2 text-xs tracking-[0.24em] text-cyan-300">
            CERTIFICATION HUB
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">Your Readiness Plan</h1>

          <p className="mt-4 max-w-[900px] text-lg leading-9 text-slate-300">
            This page shows what is complete, what is still missing, and what the
            applicant should do next before applying.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={() => router.push("/apply")}
              className="rounded-xl bg-white/10 px-6 py-4 font-semibold transition hover:bg-white/15"
            >
              Back to Apply
            </button>

            <button
              onClick={() => router.push("/results")}
              className="rounded-xl bg-emerald-500 px-6 py-4 font-semibold transition hover:bg-emerald-400"
            >
              Go to Certification Matches
            </button>
          </div>
        </section>

        {!applyData && (
          <section className="mt-8 rounded-[24px] border border-rose-400/30 bg-rose-500/10 p-6">
            <h2 className="text-xl font-semibold text-rose-200">
              No Application Data Found
            </h2>
            <p className="mt-2 leading-8 text-rose-50/90">
              Go back to the apply page and complete the intake first.
            </p>
          </section>
        )}

        {applyData && (
          <>
            <section className="mt-8 grid gap-6 md:grid-cols-4">
              <div className="rounded-2xl border border-cyan-500/15 bg-[#061042] p-5">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Score
                </div>
                <div className="mt-2 text-3xl font-semibold">{applyData.score}</div>
              </div>

              <div className="rounded-2xl border border-cyan-500/15 bg-[#061042] p-5">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Completion
                </div>
                <div className="mt-2 text-3xl font-semibold">
                  {applyData.completion}%
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-500/15 bg-[#061042] p-5">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Status
                </div>
                <div className="mt-2 text-3xl font-semibold">
                  {applyData.statusLabel}
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-500/15 bg-[#061042] p-5">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Missing Items
                </div>
                <div className="mt-2 text-3xl font-semibold">
                  {applyData.missingItems.length}
                </div>
              </div>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
              <div className="rounded-[24px] border border-cyan-500/20 bg-[#061042] p-6">
                <h2 className="text-2xl font-semibold">Next Steps</h2>

                <div className="mt-5 space-y-4">
                  {nextSteps.map((step, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-cyan-500/15 bg-[#071246] p-4 text-slate-200"
                    >
                      <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/15 text-sm font-semibold text-cyan-300">
                        {index + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-cyan-500/20 bg-[#061042] p-6">
                <h2 className="text-2xl font-semibold">Missing Required Items</h2>

                {applyData.missingItems.length === 0 ? (
                  <p className="mt-4 text-slate-300">
                    No required items are missing. This applicant is ready to move
                    into certification matches.
                  </p>
                ) : (
                  <div className="mt-5 space-y-3">
                    {applyData.missingItems.map((item) => (
                      <div
                        key={item.key}
                        className="rounded-xl border border-rose-400/20 bg-rose-500/10 p-4"
                      >
                        <div className="font-semibold text-rose-200">
                          {item.label}
                        </div>
                        <div className="mt-1 text-sm text-rose-50/90">
                          Section {item.sectionNumber}: {item.sectionTitle}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default function ReadinessPlanPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#020b36] text-white">
          <div className="text-xl">Loading readiness plan...</div>
        </main>
      }
    >
      <ReadinessPlanContent />
    </Suspense>
  );
}
