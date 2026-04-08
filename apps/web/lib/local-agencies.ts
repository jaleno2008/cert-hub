export type LocalAgencyRegistration = {
  slug: "miami-dade" | "city-of-miami";
  name: string;
  shortName: string;
  vendorTitle: string;
  vendorSummary: string;
  systemLabel: string;
  systemUrl: string;
  paymentLabel?: string;
  paymentUrl?: string;
  sourceLabel: string;
  sourceUrl: string;
  whyItMatters: string;
  vendorSteps: string[];
  mirrorQuestions: string[];
  commonDocuments: string[];
  nextPrograms: Array<{
    label: string;
    detail: string;
    href?: string;
  }>;
};

export const LOCAL_AGENCY_REGISTRATIONS: LocalAgencyRegistration[] = [
  {
    slug: "miami-dade",
    name: "Miami-Dade County",
    shortName: "Miami-Dade",
    vendorTitle: "Miami-Dade County Vendor Registration",
    vendorSummary:
      "This mirror is for the county vendor setup step first. It helps the business get ready for the County's supplier and registration systems before moving into DBE or SBE.",
    systemLabel: "Miami-Dade online vendor registration",
    systemUrl:
      "https://www.miamidade.gov/procurement/vendor-registration.asp",
    paymentLabel: "Miami-Dade vendor payments and invoice inquiry",
    paymentUrl:
      "https://www.miamidade.gov/global/service.page?Mduid_service=ser1471545573198718",
    sourceLabel: "Miami-Dade SBE certification programs",
    sourceUrl:
      "https://www.miamidade.gov/global/strategic-procurement/small-business-enterprise-certification.page",
    whyItMatters:
      "For Miami-Dade, vendor registration is the clean front door. Once the business basics and supplier information are lined up, CHUB can move the firm into the county's SBE path or the county DBE path, while explaining that Florida UCP lets one DBE certification carry across participating agencies.",
    vendorSteps: [
      "Confirm the legal business name, tax ID, and contact details that will be used with the county.",
      "Get the supplier account and online vendor registration information lined up in the county system.",
      "Match the business to the right commodities, services, or industry codes before bidding.",
      "Organize the documents that will likely be reused for SBE or DBE next.",
    ],
    mirrorQuestions: [
      "What legal business name should Miami-Dade use for the vendor profile?",
      "What EIN, W-9, and tax contact information should be attached to the supplier account?",
      "What address, phone, and email should county buyers use to contact the business?",
      "Which goods, services, or industry codes best match what the business sells to the county?",
      "Which documents are already ready to reuse for SBE or DBE after vendor setup?",
    ],
    commonDocuments: [
      "Business registration",
      "EIN letter",
      "W-9",
      "Business address proof",
      "Ownership documents",
      "Capability statement or service summary",
    ],
    nextPrograms: [
      {
        label: "Miami-Dade SBE",
        detail:
          "Best for county small business contracting and local program participation after the vendor account is set up.",
        href: "/local/miami-dade/sbe",
      },
      {
        label: "Miami-Dade DBE",
        detail:
          "Use Miami-Dade County as the DBE front door, then explain that Florida UCP can make that one DBE certification valid across participating agencies.",
        href: "/local/miami-dade/dbe",
      },
    ],
  },
  {
    slug: "city-of-miami",
    name: "City of Miami",
    shortName: "City of Miami",
    vendorTitle: "City of Miami Vendor Registration",
    vendorSummary:
      "This mirror is for the city's supplier setup first. It helps the business get ready for iSupplier and procurement participation before moving into local small-business certifications.",
    systemLabel: "City of Miami iSupplier / Supplier Corner",
    systemUrl: "https://www.miami.gov/Business-Licenses/Doing-Business-with-the-City/Register-as-a-City-Supplier-Vendor",
    sourceLabel: "City of Miami small-business information",
    sourceUrl: "https://www.miami.gov/My-Government/Departments/Office-of-Capital-Improvements/Small-Business-Enterprise-FAQs",
    whyItMatters:
      "For the City of Miami, vendor registration is the first local setup step. Once the supplier profile is ready, CHUB can guide the business into city-facing procurement readiness and then into Miami-Dade County's SBE certification path without restarting the document collection.",
    vendorSteps: [
      "Confirm the legal business name, tax ID, and contact details the city should use.",
      "Get the supplier registration and iSupplier access steps organized before trying to bid.",
      "Line up the right goods and services categories so the vendor profile reflects what the business actually does.",
      "Reuse the same core business documents later for certification and procurement steps.",
    ],
    mirrorQuestions: [
      "What legal business name should the City of Miami use for the supplier profile?",
      "What EIN, W-9, and tax contact information should be tied to the vendor account?",
      "Who should be listed as the main vendor contact for city procurement notices?",
      "Which goods or services should the business select so city buyers understand what it sells?",
      "Which local records are already ready to reuse for city small-business or bidding steps?",
    ],
    commonDocuments: [
      "Business registration",
      "EIN letter",
      "W-9",
      "Business address proof",
      "Ownership documents",
      "Insurance or license records if applicable",
    ],
    nextPrograms: [
      {
        label: "Miami-Dade SBE for City work",
        detail:
          "Use the same local-business proof, ownership records, and contact setup after the vendor profile is complete, because the City points businesses to Miami-Dade for SBE certification.",
        href: "/local/city-of-miami/sbe",
      },
      {
        label: "City procurement bidding prep",
        detail:
          "Once the vendor profile is live, CHUB can guide the business into city-facing capability and solicitation readiness.",
      },
    ],
  },
];

export function getLocalAgencyRegistration(slug: string) {
  return LOCAL_AGENCY_REGISTRATIONS.find((agency) => agency.slug === slug);
}
