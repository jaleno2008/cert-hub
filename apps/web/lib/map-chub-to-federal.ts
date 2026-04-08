import type { ApplyAnswers, AssessmentAnswers } from "./chub-flow";
import {
  getEmptyFederal8aSections,
  getEmptyFederalProfile,
  getEmptyFederalWizardState,
  type FederalWizardState,
} from "./federal-prep";

const normalizeYesNoUnknown = (value?: string): "yes" | "no" | "not_sure" => {
  if (!value) return "not_sure";
  const normalized = value.trim().toLowerCase();
  if (["yes", "y", "ready", "complete", "sam-active"].includes(normalized)) return "yes";
  if (["no", "n", "missing", "not-started"].includes(normalized)) return "no";
  return "not_sure";
};

const nowOrNull = (value: string | undefined) =>
  value && value.trim() ? new Date().toISOString() : null;

export const mapChubToFederalWizardState = (
  assessment: Partial<AssessmentAnswers>,
  apply: Partial<ApplyAnswers>,
): FederalWizardState => {
  const base = getEmptyFederalWizardState();
  const sectionsBase = getEmptyFederal8aSections();
  const profileBase = getEmptyFederalProfile();

  const ueiStatus =
    apply.ueiSamStatus === "uei-only"
      ? "has-uei"
      : apply.ueiSamStatus === "sam-active" || apply.ueiSamStatus === "sam-in-progress"
        ? "has-uei"
        : apply.ueiSamStatus === "planning"
          ? "applying"
          : "no-uei";

  const samStatus =
    apply.ueiSamStatus === "sam-active"
      ? "active"
      : apply.ueiSamStatus === "sam-in-progress"
        ? "in_progress"
        : apply.ueiSamStatus
          ? "not_sure"
          : "not_started";

  return {
    ...base,
    profile: {
      ...profileBase,
      legalBusinessName: apply.legalBusinessName ?? "",
      entityType: apply.businessEntity ?? "",
      ownerName: apply.ownerName ?? "",
      companyEmail: apply.companyEmail ?? "",
      phone: apply.phone ?? "",
      address1: apply.address1 ?? "",
      city: apply.city ?? "",
      state: apply.stateRegistered ?? "",
      zip: apply.zipCode ?? "",
      industry: apply.industry ?? "",
      naicsCode: apply.naicsCodes ?? "",
      website: apply.businessWebsite === "yes" ? "Website confirmed in CHub" : "",
      yearsInBusiness: assessment.businessAge ?? "",
      annualRevenue: assessment.annualRevenue ?? "",
      employeeCount: assessment.employees ?? "",
      einStatus:
        apply.einStatus === "has-ein"
          ? "has-ein"
          : apply.einStatus === "in-progress"
            ? "applying"
            : "no-ein",
      ein: apply.ein ?? "",
      ueiStatus,
      samStatus,
    },
    eligibility: {
      ...base.eligibility,
      targetTrack: "8a",
      sociallyDisadvantaged:
        apply.minorityOwned === "yes" ? "yes" : normalizeYesNoUnknown(apply.minorityOwned),
      economicallyDisadvantaged: "not_sure",
      ownerCitizenStatus: normalizeYesNoUnknown(apply.citizenshipDocs),
      ownerControlsBusiness: normalizeYesNoUnknown(apply.ownershipControl),
      ownerManagesDayToDay: normalizeYesNoUnknown(apply.ownershipControl),
      businessInGoodStanding:
        assessment.registeredBusiness === "yes"
          ? "yes"
          : normalizeYesNoUnknown(assessment.registeredBusiness),
      taxesCurrent: normalizeYesNoUnknown(apply.taxesCurrent),
      priorFederalWork: normalizeYesNoUnknown(apply.governmentExperience),
      capabilityStatementReady: normalizeYesNoUnknown(apply.capabilityStatement),
      financialStatementsReady: normalizeYesNoUnknown(apply.financialsReady),
      taxReturnsReady: normalizeYesNoUnknown(apply.taxesCurrent),
      businessHistoryStrong: normalizeYesNoUnknown(apply.pastPerformance),
      notes: assessment.targetCertification
        ? `Original CHub target: ${assessment.targetCertification}`
        : "",
    },
    sections: {
      business: {
        ...sectionsBase.business,
        status: apply.legalBusinessName ? "in_progress" : "not_started",
        startedAt: nowOrNull(apply.legalBusinessName),
        updatedAt: nowOrNull(apply.legalBusinessName),
        answers: {
          core_services: apply.capabilityCoreServices ?? "",
          primary_customers: Array.isArray(apply.targetMarkets)
            ? apply.targetMarkets.join(", ")
            : "",
          years_operating: assessment.businessAge ?? "",
          past_performance: apply.capabilityPastPerformanceExample ?? "",
        },
      },
      ownership: {
        ...sectionsBase.ownership,
        status: apply.ownerName ? "in_progress" : "not_started",
        startedAt: nowOrNull(apply.ownerName),
        updatedAt: nowOrNull(apply.ownerName),
        answers: {
          owner_names: apply.ownerName ?? "",
          qualifying_owner_percent:
            apply.womanOwned === "yes" ||
            apply.minorityOwned === "yes" ||
            apply.veteranOwned === "yes"
              ? "51"
              : "",
          ownership_documents_ready:
            apply.ownershipDocs === "yes"
              ? "yes"
              : apply.ownershipDocs === "partial"
                ? "not_sure"
                : normalizeYesNoUnknown(apply.ownershipDocs),
        },
      },
      control: {
        ...sectionsBase.control,
        status: apply.ownershipControl ? "in_progress" : "not_started",
        startedAt: nowOrNull(apply.ownershipControl),
        updatedAt: nowOrNull(apply.ownershipControl),
        answers: {
          daily_control:
            apply.ownershipControl === "yes"
              ? "The qualifying owner appears to run the business day to day."
              : "",
          signing_authority: apply.ownerName ?? "",
          outside_influence: apply.ownershipControl === "no" ? "yes" : "no",
        },
      },
      disadvantage: {
        ...sectionsBase.disadvantage,
        status:
          apply.minorityOwned || apply.womanOwned || apply.veteranOwned
            ? "in_progress"
            : "not_started",
        startedAt:
          apply.minorityOwned || apply.womanOwned || apply.veteranOwned
            ? new Date().toISOString()
            : null,
        updatedAt:
          apply.minorityOwned || apply.womanOwned || apply.veteranOwned
            ? new Date().toISOString()
            : null,
        answers: {
          social_disadvantage_basis:
            apply.minorityOwned === "yes"
              ? "This CHub profile indicates a minority-owned business path."
              : apply.womanOwned === "yes"
                ? "This CHub profile indicates a woman-owned business path."
                : "",
          economic_disadvantage_ready: "not_sure",
          citizenship_ready:
            apply.citizenshipDocs === "yes"
              ? "yes"
              : apply.citizenshipDocs === "partial"
                ? "not_sure"
                : normalizeYesNoUnknown(apply.citizenshipDocs),
        },
      },
      financials: {
        ...sectionsBase.financials,
        status: apply.financialsReady ? "in_progress" : "not_started",
        startedAt: nowOrNull(apply.financialsReady),
        updatedAt: nowOrNull(apply.financialsReady),
        answers: {
          business_tax_returns: normalizeYesNoUnknown(apply.taxesCurrent),
          financial_statements: normalizeYesNoUnknown(apply.financialsReady),
          personal_financials: "not_sure",
        },
      },
      documents: {
        ...sectionsBase.documents,
        status: apply.readyToUpload ? "in_progress" : "not_started",
        startedAt: nowOrNull(apply.readyToUpload),
        updatedAt: nowOrNull(apply.readyToUpload),
        answers: {
          first_document_ready:
            apply.ownershipDocs === "yes"
              ? "Ownership documents"
              : apply.ownerBioResume === "yes"
                ? "Owner bio or resume"
                : apply.officeProof === "yes"
                  ? "Proof of business address"
                  : "",
          missing_documents: [
            apply.ueiSamStatus ? "" : "UEI / SAM.gov setup",
            apply.ownershipDocs === "yes" ? "" : "Ownership documents",
            apply.ownerBioResume === "yes" ? "" : "Owner bio or resume",
            apply.officeProof === "yes" ? "" : "Proof of business address",
          ]
            .filter(Boolean)
            .join(", "),
          upload_sequence: "yes",
        },
      },
    },
    documents: [],
  };
};
