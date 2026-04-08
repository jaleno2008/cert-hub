"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { STORAGE_KEYS } from "../../../lib/chub-flow";
import { FEDERAL_STORAGE_KEYS } from "../../../lib/federal-prep";

const RESET_KEYS = [
  STORAGE_KEYS.email,
  STORAGE_KEYS.assessment,
  STORAGE_KEYS.assessmentComplete,
  STORAGE_KEYS.apply,
  FEDERAL_STORAGE_KEYS.wizard,
  "chub_answers",
  "chub_results",
  "chub_apply_data",
  "certhub_user",
  "capabilityStatementDraft",
] as const;

export default function CleanQaPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"clearing" | "ready">("clearing");

  useEffect(() => {
    for (const key of RESET_KEYS) {
      window.localStorage.removeItem(key);
    }

    setStatus("ready");
    router.replace("/login");
    window.location.replace("/login");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 py-10 text-white">
      <div className="w-full max-w-2xl rounded-[32px] border border-zinc-800 bg-[#0b0b0f] p-8 text-center shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
          Clean QA Reset
        </p>
        <h1 className="mt-4 text-4xl font-bold text-white">
          {status === "clearing" ? "Resetting tester data..." : "Tester data cleared"}
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-300">
          This page clears the saved CHUB and federal answers in this browser so the tester starts
          from a blank login and sees the real first-time flow.
        </p>
        <div className="mt-8">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-2xl bg-yellow-400 px-6 py-4 text-sm font-bold text-black transition hover:bg-yellow-300"
          >
            Go To Clean Login
          </Link>
        </div>
      </div>
    </main>
  );
}
