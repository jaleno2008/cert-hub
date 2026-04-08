"use client";

import FederalEligibilityGrid from "../../../../components/federal-eligibility-grid";
import FederalIntroCard from "../../../../components/federal-intro-card";
import FederalLoadingState from "../../../../components/federal-loading-state";
import FederalSupportRail from "../../../../components/federal-support-rail";
import { useFederalWizard } from "../../../../components/use-federal-wizard";
import FederalWizardLayout from "../../../../components/federal-wizard-layout";
import { FEDERAL_PROGRESS_ITEMS } from "../../../../lib/federal-progress";

export default function FederalEligibilityPage() {
  const { pageState, wizard, updateWizard, redirectTarget } = useFederalWizard();

  if (pageState !== "ready" || !wizard) {
    return (
      <FederalLoadingState
        loadingLabel="Loading eligibility..."
        pageState={pageState}
        redirectTarget={redirectTarget}
      />
    );
  }

  const items = [
    {
      key: "sociallyDisadvantaged",
      label: "Does this business look like it may fit the SBA 8(a) owner-eligibility path?",
      definition:
        "This question is asking whether the business appears to be owned by someone who may qualify under the SBA 8(a) disadvantaged-owner rules. It is an early fit check, not a final legal decision.",
      notSureHint:
        "Choose Not sure if you have not yet reviewed the owner’s personal eligibility story or you are unsure whether the owner meets the SBA standard.",
      value: wizard.eligibility.sociallyDisadvantaged,
    },
    {
      key: "ownerControlsBusiness",
      label: "Does the main owner appear to make the big business decisions?",
      definition:
        "This means the main owner should have the real authority to make major business decisions, sign important documents, and direct the company.",
      notSureHint:
        "Choose Not sure if ownership is clear on paper but you are not fully sure who has final decision-making power in practice.",
      value: wizard.eligibility.ownerControlsBusiness,
    },
    {
      key: "ownerManagesDayToDay",
      label: "Does the main owner seem involved in the day-to-day business?",
      definition:
        "This question asks whether the main owner is actively involved in the company’s day-to-day work, like supervising operations, guiding staff, or handling the regular business flow.",
      notSureHint:
        "Choose Not sure if the owner is involved, but another person may currently handle most of the daily operating decisions.",
      value: wizard.eligibility.ownerManagesDayToDay,
    },
    {
      key: "taxesCurrent",
      label: "Do taxes look current?",
      definition:
        "This is asking whether the business appears up to date on required tax filings and tax payments, without obvious unresolved tax problems.",
      notSureHint:
        "Choose Not sure if you do not know whether all returns were filed or whether there are any unpaid balances or tax issues still open.",
      value: wizard.eligibility.taxesCurrent,
    },
    {
      key: "financialStatementsReady",
      label: "Are business financial records in shape?",
      definition:
        "This means the business can pull together basic financial records like profit and loss statements, balance sheets, and other organized financial information without scrambling.",
      notSureHint:
        "Choose Not sure if records exist but are messy, incomplete, or spread across different places.",
      value: wizard.eligibility.financialStatementsReady,
    },
    {
      key: "businessHistoryStrong",
      label: "Is there enough business history to work with?",
      definition:
        "This question is asking whether the business has enough operating history, customer work, contracts, invoices, or track record to tell a believable business story.",
      notSureHint:
        "Choose Not sure if the business is newer, has limited past work, or you are unsure whether the current history is strong enough for the SBA path.",
      value: wizard.eligibility.businessHistoryStrong,
    },
  ];

  return (
    <FederalWizardLayout
      title="See If This Path Looks Like A Fit"
      stepLabel="Step 2 of 9"
      progressItems={FEDERAL_PROGRESS_ITEMS}
      currentKey="eligibility"
      compareHref="/federal/preview#eligibility"
      backHref="/federal/setup"
      nextHref="/federal/8a/sections/business"
      nextLabel="Continue To Business"
      support={
        <FederalSupportRail
          title="How To Use This Step"
          description="This is not a final yes or no. It is a quick fit check to show whether the 8(a) path looks promising now or whether you should strengthen a few basics first."
          documentHints={["Ownership records", "Tax returns", "Financial statements", "Identity documents"]}
          tips={[
            "Use this step to set expectations early instead of finding surprises later.",
            "Not sure is okay. We can keep moving and flag open questions for review.",
          ]}
        />
      }
    >
      <FederalIntroCard
        title="Check the fit before you go deeper"
        description="This screen helps you decide whether the business looks ready to keep moving or whether it would help to tighten a few basics first."
        whyItMatters="A quick fit check helps you move with more confidence and keeps you from spending time in areas that may need prep first."
        officialLabel="Early 8(a) eligibility fit check"
        applicantNote="This is a guided preview of the real 8(a) application questions, not the government form itself. The goal is to help a first-time applicant see whether the path looks realistic before the deeper ownership, control, and document sections."
      />

      <FederalEligibilityGrid
        items={items}
        onChange={(key, value) =>
          updateWizard((previous) => ({
            ...previous,
            eligibility: {
              ...previous.eligibility,
              [key]: value,
            },
          }))
        }
      />
    </FederalWizardLayout>
  );
}
