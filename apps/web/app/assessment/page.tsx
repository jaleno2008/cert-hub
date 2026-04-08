"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChubStageBanner from "../../components/chub-stage-banner";
import {
  type AssessmentAnswers,
  STORAGE_KEYS,
  assessmentQuestions,
  getEmptyAssessmentAnswers,
} from "../../lib/chub-flow";

export default function AssessmentPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<AssessmentAnswers>(
    getEmptyAssessmentAnswers()
  );
  const [openExplain, setOpenExplain] = useState<string | null>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem(STORAGE_KEYS.email);
    if (!savedEmail) {
      router.push("/login");
      return;
    }

    const savedAnswers = localStorage.getItem(STORAGE_KEYS.assessment);
    if (!savedAnswers) return;

    try {
      setAnswers({
        ...getEmptyAssessmentAnswers(),
        ...JSON.parse(savedAnswers),
      });
    } catch {
      localStorage.removeItem(STORAGE_KEYS.assessment);
    }
  }, [router]);

  const updateAnswer = (field: keyof AssessmentAnswers, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContinue = () => {
    const allFilled = Object.values(answers).every((value) => value.trim() !== "");

    if (!allFilled) {
      alert("Please answer all 5 questions before continuing.");
      return;
    }

    localStorage.setItem(STORAGE_KEYS.assessment, JSON.stringify(answers));
    localStorage.setItem(STORAGE_KEYS.assessmentComplete, "true");

    router.push("/apply");
  };

  return (
    <main className="min-h-screen bg-black px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-[30px] border border-zinc-800 bg-[#0b0b0f] p-6 shadow-2xl">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-400">
                Step 1 of 4
              </p>
              <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
                5-Question Readiness Intake
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
                This intake stays in front of the application flow. Complete
                these 5 guided questions before moving into the approved
                24-question readiness application.
              </p>
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-yellow-400">
                Please read the explain tabs so every answer reflects the right
                business stage and certification direction.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Stage check", value: "Business age, revenue, team" },
                { label: "Readiness", value: "Registration and fit" },
                { label: "Hand-off", value: "Feeds the 24-question app" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-zinc-800 bg-black p-5"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                    {item.label}
                  </p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <ChubStageBanner
            stage="clarify"
            title="CHUB Stage: Clarify"
            detail="This intake is where CHUB starts. We are identifying who the business is, what stage it is in, and which certification direction deserves attention first."
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
              Intake Questions
            </p>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Quick enough to complete in minutes, structured enough to keep the
              next pages aligned.
            </p>
          </div>

          <div className="space-y-5">
            {assessmentQuestions.map((question, index) => {
              const isOpen = openExplain === question.key;

              return (
                <div
                  key={question.key}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base font-semibold text-white">
                      {index + 1}. {question.title}
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenExplain(isOpen ? null : question.key)
                      }
                      className="rounded-lg border border-yellow-500/40 px-3 py-1 text-xs font-semibold text-yellow-300 hover:bg-yellow-500/10"
                    >
                      Explain
                    </button>
                  </div>

                  {isOpen && (
                    <div className="mt-3 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-100">
                      {question.explain}
                    </div>
                  )}

                  <div className="mt-4">
                    <select
                      value={answers[question.key]}
                      onChange={(e) =>
                        updateAnswer(question.key, e.target.value)
                      }
                      className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-yellow-400"
                    >
                      <option value="">Select one</option>
                      {question.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              onClick={() => router.push("/login")}
              className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 hover:bg-zinc-800"
            >
              Back
            </button>

            <button
              onClick={handleContinue}
              className="rounded-xl bg-yellow-400 px-6 py-3 text-sm font-bold text-black hover:bg-yellow-300"
            >
              Continue to Full Application
            </button>
          </div>
        </section>

        <aside className="h-fit rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-2xl lg:sticky lg:top-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-yellow-400">
              Smart Guidance Engine
            </h2>
            <p className="mt-2 text-sm text-zinc-300">
              This short intake is your front door. It helps the results and
              application layers stay aligned to your business stage instead of
              forcing a generic path.
            </p>
          </div>

          <div className="space-y-4 text-sm text-zinc-200">
            <div className="rounded-2xl border border-zinc-800 bg-black p-4">
              <h3 className="font-semibold text-white">Flow map</h3>
              <div className="mt-3 space-y-2">
                {["Login", "Assessment", "Apply", "Results", "Documents"].map(
                  (step, index) => (
                    <div
                      key={step}
                      className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
                    >
                      <span>{step}</span>
                      <span className="text-xs uppercase tracking-[0.18em] text-yellow-300">
                        {index === 1 ? "Now" : index < 1 ? "Done" : "Next"}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-black p-4">
              <h3 className="font-semibold text-white">Why these 5 questions matter</h3>
              <p className="mt-2 text-zinc-300">
                They show whether you are in a foundation, building, or more
                advanced readiness stage before the 24-question application
                evaluates your profile in detail.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-black p-4">
              <h3 className="font-semibold text-white">What happens next</h3>
              <p className="mt-2 text-zinc-300">
                After this intake you move into the guided 24-question
                application, then into results and the document vault without
                losing anything you already answered.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-black p-4">
              <h3 className="font-semibold text-white">Saved as you go</h3>
              <p className="mt-2 text-zinc-300">
                Your intake answers are saved locally in the browser so the
                application and results pages can auto-fill the right snapshot.
              </p>
            </div>
          </div>
        </aside>
        </div>
      </div>
    </main>
  );
}
