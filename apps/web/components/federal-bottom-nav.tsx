import Link from "next/link";

export default function FederalBottomNav({
  backHref,
  nextHref,
  nextLabel,
}: {
  backHref?: string;
  nextHref?: string;
  nextLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-zinc-800 bg-[#0a1014] px-5 py-5">
      <div className="text-sm text-zinc-300">
        Take this one screen at a time. Nothing here locks you in, and you can come back to update any answer later.
      </div>
      <div className="flex flex-wrap gap-3">
        {backHref ? (
          <Link
            href={backHref}
            className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900"
          >
            Go Back
          </Link>
        ) : null}
        {nextHref ? (
          <Link
            href={nextHref}
            className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-bold text-black transition hover:bg-cyan-200"
          >
            {nextLabel ?? "Continue"}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
