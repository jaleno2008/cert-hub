import type { ReactNode } from "react";
import FederalBottomNav from "./federal-bottom-nav";
import FederalProgressRail, { type FederalProgressItem } from "./federal-progress-rail";
import FederalTopBar from "./federal-top-bar";

export default function FederalWizardLayout({
  title,
  stepLabel,
  progressItems,
  currentKey,
  children,
  support,
  backHref,
  nextHref,
  nextLabel,
  compareHref,
}: {
  title: string;
  stepLabel: string;
  progressItems: readonly FederalProgressItem[];
  currentKey: string;
  children: ReactNode;
  support?: ReactNode;
  backHref?: string;
  nextHref?: string;
  nextLabel?: string;
  compareHref?: string;
}) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#081019_0%,_#0c1622_28%,_#0b1017_58%,_#080b11_100%)] px-5 py-8 text-white md:px-8">
      <div className="mx-auto max-w-[1750px] space-y-6">
        <FederalTopBar title={title} stepLabel={stepLabel} compareHref={compareHref} />
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
          <FederalProgressRail items={progressItems} currentKey={currentKey} />
          <div className="space-y-6">{children}</div>
          <div className="space-y-6">{support}</div>
        </div>
        <FederalBottomNav backHref={backHref} nextHref={nextHref} nextLabel={nextLabel} />
      </div>
    </main>
  );
}
