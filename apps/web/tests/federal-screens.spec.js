const { test } = require("@playwright/test");

const assessment = {
  businessAge: "1-2-years",
  registeredBusiness: "yes",
  annualRevenue: "50k-250k",
  employees: "2-5",
  targetCertification: "sba-8a",
};

const apply = {
  legalBusinessName: "Bless Federal Services LLC",
  ownerName: "Jay Bless",
  companyEmail: "jay@blessfederal.com",
  phone: "3055551234",
  address1: "123 Main Street",
  city: "Miami",
  stateRegistered: "FL",
  zipCode: "33101",
  industry: "Janitorial / Facilities",
  naicsStatus: "have-code",
  naicsCodes: "561720",
  businessEntity: "LLC",
  einStatus: "has-ein",
  ein: "123456789",
  businessLicense: "yes",
  businessBankAccount: "yes",
  capabilityStatement: "yes",
  pastPerformance: "yes",
  businessWebsite: "yes",
  insuranceTypes: ["General Liability", "Workers Compensation"],
  taxesCurrent: "yes",
  financialsReady: "yes",
  ueiSamStatus: "sam-in-progress",
  referencesAvailable: "yes",
  ownerBioResume: "yes",
  ownershipDocs: "partial",
  ownershipControl: "yes",
  citizenshipDocs: "partial",
  officeProof: "yes",
  certificationsAppliedBefore: "no",
  minorityOwned: "yes",
  womanOwned: "no",
  veteranOwned: "no",
  governmentExperience: "no",
  targetMarkets: ["Federal", "State"],
  readyToUpload: "yes",
  capabilityCoreServices:
    "Janitorial services, facility support, and recurring site maintenance.",
  capabilityDifferentiators:
    "Responsive owner-led operations with flexible staffing and compliance support.",
  capabilityPastPerformanceExample:
    "Ongoing commercial cleaning contracts for multi-site office clients in South Florida.",
  capabilityCertifications:
    "Registered business, EIN complete, federal setup in progress.",
  capabilityContactInfo: "Jay Bless | jay@blessfederal.com | 305-555-1234",
};

async function seed(page) {
  await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
  await page.evaluate(
    ({ assessment, apply }) => {
      localStorage.setItem("chubUserEmail", "jay@blessfederal.com");
      localStorage.setItem("assessmentAnswers", JSON.stringify(assessment));
      localStorage.setItem("assessmentComplete", "true");
      localStorage.setItem("applyAnswers", JSON.stringify(apply));
      localStorage.removeItem("federalWizardState");
    },
    { assessment, apply },
  );
}

test.use({ viewport: { width: 1600, height: 1800 }, colorScheme: "dark" });

test("capture federal pages", async ({ page }) => {
  await seed(page);

  await page.goto("http://localhost:3000/federal", { waitUntil: "networkidle" });
  await page.screenshot({ path: "/tmp/federal-entry.png", fullPage: true });

  await page.goto("http://localhost:3000/federal/setup", { waitUntil: "networkidle" });
  await page.screenshot({ path: "/tmp/federal-setup.png", fullPage: true });

  await page.goto("http://localhost:3000/federal/8a/eligibility", {
    waitUntil: "networkidle",
  });
  await page.screenshot({ path: "/tmp/federal-eligibility.png", fullPage: true });

  await page.goto("http://localhost:3000/federal/8a/sections/documents", {
    waitUntil: "networkidle",
  });
  await page.screenshot({ path: "/tmp/federal-documents.png", fullPage: true });

  await page.goto("http://localhost:3000/federal/8a/review", {
    waitUntil: "networkidle",
  });
  await page.screenshot({ path: "/tmp/federal-review.png", fullPage: true });
});
