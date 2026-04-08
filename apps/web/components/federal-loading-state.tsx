import Link from "next/link";

export default function FederalLoadingState({
  loadingLabel,
  pageState,
  redirectTarget,
}: {
  loadingLabel: string;
  pageState: "loading" | "redirecting" | "ready";
  redirectTarget: string;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-5 text-white">
      <div className="max-w-xl rounded-[28px] border border-zinc-800 bg-[#0b0b0f] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <h1 className="text-2xl font-bold text-white">
          {pageState === "redirecting" ? "Taking you to the right step..." : loadingLabel}
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-300">
          {pageState === "redirecting"
            ? "The federal wizard needs your completed CHub flow first. If the browser does not move automatically, use the button below."
            : "Please wait while CHub loads your saved answers and prepares the federal path."}
        </p>
        <div className="mt-6">
          <Link
            href={redirectTarget}
            className="inline-flex items-center justify-center rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-bold text-black transition hover:bg-cyan-200"
          >
            Go To{" "}
            {redirectTarget === "/login"
              ? "Login"
              : redirectTarget === "/assessment"
                ? "Assessment"
                : redirectTarget === "/apply"
                  ? "Application"
                  : "Results"}
          </Link>
        </div>
      </div>
    </main>
  );
}
