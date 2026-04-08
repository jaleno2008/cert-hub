"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  STORAGE_KEYS,
  normalizeApplyAnswers,
  normalizeAssessmentAnswers,
} from "../lib/chub-flow";
import {
  getEmptyFederalWizardState,
  loadFederalWizardState,
  normalizeFederalWizardState,
  saveFederalWizardState,
  type FederalWizardState,
} from "../lib/federal-prep";
import { mapChubToFederalWizardState } from "../lib/map-chub-to-federal";

function getDemoFederalWizardState(): FederalWizardState {
  const base = getEmptyFederalWizardState();

  return normalizeFederalWizardState({
    ...base,
    profile: {
      ...base.profile,
      legalBusinessName: "Bless Federal Services LLC",
      ownerName: "Jay Bless",
      companyEmail: "jay@blessfederal.com",
      phone: "305-555-1234",
      address1: "123 Main Street",
      city: "Miami",
      state: "FL",
      zip: "33101",
      entityType: "LLC",
      industry: "Janitorial / Facilities",
      naicsCode: "561720",
      yearsInBusiness: "1-2-years",
      annualRevenue: "50k-250k",
      employeeCount: "2-5",
      einStatus: "has-ein",
      ein: "123456789",
      ueiStatus: "applying",
      samStatus: "in_progress",
    },
    eligibility: {
      ...base.eligibility,
      businessInGoodStanding: "yes",
      taxesCurrent: "yes",
      capabilityStatementReady: "yes",
      financialStatementsReady: "yes",
      taxReturnsReady: "yes",
      businessHistoryStrong: "yes",
      ownerControlsBusiness: "yes",
      ownerManagesDayToDay: "yes",
    },
    sections: {
      ...base.sections,
      business: {
        ...base.sections.business,
        status: "in_progress",
        answers: {
          core_services:
            "Janitorial services, facility support, and recurring site maintenance.",
          primary_customers: "Federal, State",
          years_operating: "1-2-years",
          past_performance:
            "Commercial cleaning contracts and multi-site maintenance support in South Florida.",
        },
      },
      ownership: {
        ...base.sections.ownership,
        status: "in_progress",
        answers: {
          owner_names: "Jay Bless - 100%",
          qualifying_owner_percent: "100",
          ownership_documents_ready: "not_sure",
        },
      },
      control: {
        ...base.sections.control,
        status: "in_progress",
        answers: {
          daily_control:
            "The owner appears to run the business day to day and approve major decisions.",
          signing_authority: "Jay Bless",
          outside_influence: "no",
        },
      },
      financials: {
        ...base.sections.financials,
        status: "in_progress",
        answers: {
          business_tax_returns: "yes",
          financial_statements: "yes",
          personal_financials: "not_sure",
        },
      },
      documents: {
        ...base.sections.documents,
        status: "in_progress",
        answers: {
          first_document_ready: "EIN letter",
          missing_documents: "UEI confirmation, SAM.gov activation, ownership documents",
          upload_sequence: "yes",
        },
      },
    },
  });
}

export function useFederalWizard() {
  const router = useRouter();
  const [pageState, setPageState] = useState<"loading" | "ready" | "redirecting">(
    "loading",
  );
  const [wizard, setWizard] = useState<FederalWizardState | null>(null);
  const [redirectTarget, setRedirectTarget] = useState("/results");

  useEffect(() => {
    try {
      const email = window.localStorage.getItem(STORAGE_KEYS.email);
      const assessmentRaw = window.localStorage.getItem(STORAGE_KEYS.assessment);
      const applyRaw = window.localStorage.getItem(STORAGE_KEYS.apply);

      const goTo = (target: string) => {
        setRedirectTarget(target);
        setPageState("redirecting");
        router.replace(target);
        window.location.replace(target);
      };

      const existing = loadFederalWizardState();

      if (!email || !assessmentRaw || !applyRaw) {
        const fallback = normalizeFederalWizardState(existing ?? getDemoFederalWizardState());
        saveFederalWizardState(fallback);
        setWizard(fallback);
        setPageState("ready");
        return;
      }

      const assessment = normalizeAssessmentAnswers(JSON.parse(assessmentRaw));
      const apply = normalizeApplyAnswers(JSON.parse(applyRaw));
      const prefilled = mapChubToFederalWizardState(assessment, apply);
      const merged = normalizeFederalWizardState(existing ?? prefilled);

      if (!existing) {
        saveFederalWizardState(merged);
      }

      setWizard(merged);
      setPageState("ready");
    } catch {
      setRedirectTarget("/results");
      setPageState("redirecting");
      router.replace("/results");
      window.location.replace("/results");
    }
  }, [router]);

  const updateWizard = (
    updater: (previous: FederalWizardState) => FederalWizardState,
  ) => {
    setWizard((previous) => {
      if (!previous) return previous;
      const next = updater(previous);
      saveFederalWizardState(next);
      return next;
    });
  };

  return { pageState, wizard, updateWizard, redirectTarget };
}
