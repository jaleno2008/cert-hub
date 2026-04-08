"use client";

import {
  type CSSProperties,
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import ChubStageBanner from "../../components/chub-stage-banner";

type CapabilityStatement = {
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  website: string;
  addressLine: string;
  ein: string;
  yearEstablished: string;
  employees: string;
  industry: string;
  naicsCodes: string;
  certifications: string;
  coreCompetencies: string;
  differentiators: string;
  pastPerformance: string;
  serviceArea: string;
  capabilityNarrative: string;
  brandPrimary: string;
  brandAccent: string;
  brandFooter: string;
};

const emptyStatement: CapabilityStatement = {
  companyName: "",
  ownerName: "",
  email: "",
  phone: "",
  website: "",
  addressLine: "",
  ein: "",
  yearEstablished: "",
  employees: "",
  industry: "",
  naicsCodes: "",
  certifications: "",
  coreCompetencies: "",
  differentiators: "",
  pastPerformance: "",
  serviceArea: "",
  capabilityNarrative: "",
  brandPrimary: "#111827",
  brandAccent: "#c7941f",
  brandFooter: "#111827",
};

const brandSchemes = [
  {
    name: "Executive Gold",
    primary: "#111827",
    accent: "#c7941f",
    footer: "#111827",
  },
  {
    name: "Civic Blue",
    primary: "#123f6d",
    accent: "#2f80ed",
    footer: "#0b2545",
  },
  {
    name: "Growth Green",
    primary: "#12372a",
    accent: "#2e7d4f",
    footer: "#0f2a21",
  },
  {
    name: "Miami Coral",
    primary: "#143642",
    accent: "#e26d5c",
    footer: "#143642",
  },
];

type CapabilityBrandStyle = CSSProperties & Record<`--${string}`, string>;

function cleanValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string" || typeof item === "number") {
          return String(item).trim();
        }
        if (item && typeof item === "object") {
          const possible =
            (item as Record<string, unknown>).label ??
            (item as Record<string, unknown>).value ??
            (item as Record<string, unknown>).name;
          return possible ? String(possible).trim() : "";
        }
        return "";
      })
      .filter(Boolean)
      .join(", ");
  }

  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function normalizeBulletText(value: unknown): string {
  const raw = cleanValue(value);
  if (!raw) return "";

  const parts = raw
    .split(/\n|•|;|\|/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (parts.length <= 1) return raw;

  return parts.map((item) => `• ${item.replace(/^•\s*/, "")}`).join("\n");
}

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function getByPath(obj: unknown, path: string): unknown {
  if (!isObject(obj)) return undefined;

  const parts = path.split(".");
  let current: unknown = obj;

  for (const part of parts) {
    if (!isObject(current) && !Array.isArray(current)) return undefined;

    if (Array.isArray(current)) {
      const index = Number(part);
      if (Number.isNaN(index)) return undefined;
      current = current[index];
      continue;
    }

    current = current[part];
  }

  return current;
}

function findInAnswerArray(data: unknown, candidateKeys: string[]): unknown {
  if (!Array.isArray(data)) return undefined;

  const normalizedKeys = candidateKeys.map((key) => key.toLowerCase());

  for (const item of data) {
    if (!isObject(item)) continue;

    const id = String(item.id ?? item.key ?? item.name ?? item.field ?? "").toLowerCase();
    const label = String(item.label ?? "").toLowerCase();

    if (
      normalizedKeys.includes(id) ||
      normalizedKeys.includes(label)
    ) {
      return item.value ?? item.answer ?? item.response ?? item.text ?? "";
    }
  }

  return undefined;
}

function findFirstValue(source: unknown, candidatePaths: string[]): string {
  for (const path of candidatePaths) {
    const direct = getByPath(source, path);
    const cleanedDirect = cleanValue(direct);
    if (cleanedDirect) return cleanedDirect;
  }

  if (isObject(source)) {
    const arrayCandidates = [
      source.answers,
      source.responses,
      source.fields,
      source.formData,
      source.items,
      source.values,
    ];

    const lastKeyNames = candidatePaths.map((path) => {
      const parts = path.split(".");
      return parts[parts.length - 1];
    });

    for (const candidate of arrayCandidates) {
      const fromArray = findInAnswerArray(candidate, lastKeyNames);
      const cleaned = cleanValue(fromArray);
      if (cleaned) return cleaned;
    }
  }

  return "";
}

function buildAddress(source: unknown): string {
  const fullAddress = findFirstValue(source, [
    "address",
    "businessAddress",
    "mailingAddress",
    "companyAddress",
    "formData.address",
    "formData.businessAddress",
    "answers.address",
    "answers.businessAddress",
    "application.address",
  ]);

  if (fullAddress) return fullAddress;

  const street = findFirstValue(source, [
    "street",
    "streetAddress",
    "address1",
    "formData.street",
    "formData.address1",
    "formData.streetAddress",
    "answers.street",
    "answers.address1",
    "answers.streetAddress",
  ]);

  const city = findFirstValue(source, [
    "city",
    "formData.city",
    "answers.city",
    "application.city",
  ]);

  const state = findFirstValue(source, [
    "state",
    "stateRegistered",
    "formData.state",
    "formData.stateRegistered",
    "answers.state",
    "answers.stateRegistered",
    "application.state",
    "application.stateRegistered",
  ]);

  const zip = findFirstValue(source, [
    "zip",
    "zipCode",
    "zipcode",
    "postalCode",
    "formData.zip",
    "formData.zipCode",
    "formData.zipcode",
    "answers.zip",
    "answers.zipCode",
    "answers.zipcode",
  ]);

  return [street, city, state, zip].filter(Boolean).join(", ");
}

function generateNarrative(data: CapabilityStatement) {
  const companyName = data.companyName || "Our company";
  const industry = data.industry || "its industry";
  const serviceArea = data.serviceArea || "its service area";

  const firstCore =
    data.coreCompetencies
      .split("\n")
      .map((line) => line.replace(/^•\s*/, "").trim())
      .filter(Boolean)[0] || "high-quality services";

  const firstDiff =
    data.differentiators
      .split("\n")
      .map((line) => line.replace(/^•\s*/, "").trim())
      .filter(Boolean)[0] || "responsive service and dependable execution";

  return `${companyName} is a ${industry.toLowerCase()} business serving ${serviceArea.toLowerCase()}. The company provides ${firstCore.toLowerCase()} and supports clients through ${firstDiff.toLowerCase()}. This draft is built from the current fields and can be polished before it is used for buyer or agency conversations.`;
}

function toCleanSentence(value: string) {
  const cleaned = value.replace(/^•\s*/, "").trim();
  if (!cleaned) return "";
  return cleaned.endsWith(".") ? cleaned : `${cleaned}.`;
}

function getFirstBullet(value: string, fallback: string) {
  return (
    value
      .split("\n")
      .map((line) => line.replace(/^•\s*/, "").trim())
      .filter(Boolean)[0] || fallback
  );
}

function polishCapabilityStatement(data: CapabilityStatement): CapabilityStatement {
  const companyName = data.companyName || "The company";
  const industry = data.industry || "its field";
  const serviceArea =
    data.serviceArea || "its local, regional, and public-sector service area";
  const core = getFirstBullet(
    data.coreCompetencies,
    `${industry} services and day-to-day project support`
  );
  const differentiator = getFirstBullet(
    data.differentiators,
    "direct owner involvement and responsive communication"
  );
  const performance = getFirstBullet(
    data.pastPerformance,
    `${companyName} has completed work that required accuracy, timeliness, and clear client communication`
  );

  const polishedCore = [
    `• ${core}`,
    "• Contract readiness preparation and document organization",
    "• Buyer communication, follow-up, and service coordination",
    "• Quality control, scheduling, and responsive customer support",
  ].join("\n");
  const polishedDiff = [
    `• ${differentiator}`,
    "• Organized records that make agency review and buyer conversations easier",
    "• Clear follow-through from first request through final delivery",
    "• Dependable execution for small-business, local-agency, and public-sector opportunities",
  ].join("\n");
  const polishedPastPerformance = [
    `• ${performance}`,
    "• Supported projects involving coordination, follow-up, and reliable service delivery",
    "• Maintained organized records and project details that can support future buyer conversations",
  ].join("\n");

  return {
    ...data,
    capabilityNarrative: [
      `${companyName} is a professional firm operating in ${industry}.`,
      `We provide ${core.toLowerCase()} across ${serviceArea}.`,
      "Our team is committed to clear communication, reliable delivery, and client-focused service.",
      `We stand out through ${differentiator.toLowerCase()}, helping clients move projects forward with confidence.`,
    ]
      .map(toCleanSentence)
      .join(" "),
    coreCompetencies: polishedCore,
    differentiators: polishedDiff,
    pastPerformance: polishedPastPerformance,
  };
}

function getSampleStatement(): CapabilityStatement {
  return {
    ...emptyStatement,
    companyName: "Sample Business Name",
    ownerName: "Main Owner",
    email: "contact@example.com",
    phone: "(555) 123-4567",
    website: "example.com",
    addressLine: "Miami, FL",
    yearEstablished: "2024",
    employees: "1-5",
    industry: "Professional Services",
    naicsCodes: "541611",
    certifications: "Certification readiness in progress",
    coreCompetencies:
      "• Business support and administrative services\n• Document organization and process coordination\n• Customer communication and project follow-through",
    differentiators:
      "• Hands-on owner involvement\n• Responsive service and clear communication\n• Organized records and buyer-ready presentation",
    pastPerformance:
      "• Supported customers with organized service delivery\n• Coordinated work requiring accuracy and timely follow-up",
    serviceArea: "Miami-Dade County, City of Miami, and surrounding markets",
    capabilityNarrative:
      "Sample Business Name is a professional services business serving Miami-Dade County, City of Miami, and surrounding markets. The company supports customers with business support, document organization, communication, and dependable follow-through.",
  };
}

function mapStoredDataToCapability(source: unknown): CapabilityStatement {
  const mapped: CapabilityStatement = {
    companyName: findFirstValue(source, [
      "businessName",
      "companyName",
      "legalBusinessName",
      "business_name",
      "company_name",
      "legal_business_name",
      "formData.businessName",
      "formData.companyName",
      "formData.legalBusinessName",
      "answers.businessName",
      "answers.companyName",
      "application.businessName",
      "application.companyName",
    ]),
    ownerName: findFirstValue(source, [
      "ownerName",
      "ownerFullName",
      "principalName",
      "contactName",
      "fullName",
      "name",
      "owner_name",
      "owner_full_name",
      "principal_name",
      "contact_name",
      "formData.ownerName",
      "formData.ownerFullName",
      "formData.contactName",
      "answers.ownerName",
      "answers.ownerFullName",
      "answers.contactName",
      "application.ownerName",
      "application.contactName",
    ]),
    email: findFirstValue(source, [
      "email",
      "emailAddress",
      "contactEmail",
      "businessEmail",
      "email_address",
      "contact_email",
      "business_email",
      "formData.email",
      "formData.emailAddress",
      "answers.email",
      "answers.emailAddress",
      "application.email",
    ]),
    phone: findFirstValue(source, [
      "phone",
      "phoneNumber",
      "contactPhone",
      "businessPhone",
      "telephone",
      "phone_number",
      "contact_phone",
      "business_phone",
      "formData.phone",
      "formData.phoneNumber",
      "answers.phone",
      "answers.phoneNumber",
      "application.phone",
    ]),
    website: findFirstValue(source, [
      "website",
      "websiteUrl",
      "companyWebsite",
      "businessWebsite",
      "website_url",
      "company_website",
      "business_website",
      "formData.website",
      "formData.websiteUrl",
      "answers.website",
      "application.website",
    ]),
    addressLine: buildAddress(source),
    ein: findFirstValue(source, [
      "ein",
      "federalEin",
      "taxId",
      "taxID",
      "employerIdentificationNumber",
      "formData.ein",
      "answers.ein",
      "application.ein",
    ]),
    yearEstablished: findFirstValue(source, [
      "yearEstablished",
      "foundedYear",
      "establishedYear",
      "year_started",
      "year_established",
      "formData.yearEstablished",
      "answers.yearEstablished",
      "application.yearEstablished",
    ]),
    employees: findFirstValue(source, [
      "employees",
      "employeeCount",
      "numberOfEmployees",
      "staffSize",
      "employee_count",
      "number_of_employees",
      "formData.employees",
      "answers.employees",
      "application.employees",
    ]),
    industry: findFirstValue(source, [
      "industry",
      "industryType",
      "businessIndustry",
      "sector",
      "formData.industry",
      "answers.industry",
      "application.industry",
    ]),
    naicsCodes: findFirstValue(source, [
      "naicsCodes",
      "naics",
      "naicsCode",
      "naics_codes",
      "naics_code",
      "formData.naicsCodes",
      "formData.naics",
      "answers.naicsCodes",
      "answers.naics",
      "application.naicsCodes",
    ]),
    certifications: findFirstValue(source, [
      "certifications",
      "capabilityCertifications",
      "currentCertifications",
      "businessCertifications",
      "formData.certifications",
      "formData.capabilityCertifications",
      "answers.certifications",
      "answers.capabilityCertifications",
      "application.certifications",
      "application.capabilityCertifications",
    ]),
    coreCompetencies: normalizeBulletText(
      findFirstValue(source, [
        "capabilityCoreServices",
        "coreServices",
        "coreCompetencies",
        "services",
        "primaryServices",
        "serviceOfferings",
        "core_services",
        "core_competencies",
        "formData.coreServices",
        "formData.capabilityCoreServices",
        "formData.coreCompetencies",
        "answers.coreServices",
        "answers.capabilityCoreServices",
        "answers.coreCompetencies",
        "application.coreServices",
        "application.capabilityCoreServices",
      ])
    ),
    differentiators: normalizeBulletText(
      findFirstValue(source, [
        "capabilityDifferentiators",
        "differentiators",
        "competitiveAdvantages",
        "whyChooseUs",
        "valueProposition",
        "formData.capabilityDifferentiators",
        "formData.differentiators",
        "answers.capabilityDifferentiators",
        "answers.differentiators",
        "application.capabilityDifferentiators",
        "application.differentiators",
      ])
    ),
    pastPerformance: normalizeBulletText(
      findFirstValue(source, [
        "capabilityPastPerformanceExample",
        "pastPerformance",
        "experience",
        "projectHistory",
        "relevantExperience",
        "formData.capabilityPastPerformanceExample",
        "formData.pastPerformance",
        "answers.capabilityPastPerformanceExample",
        "answers.pastPerformance",
        "application.capabilityPastPerformanceExample",
        "application.pastPerformance",
      ])
    ),
    serviceArea: findFirstValue(source, [
      "serviceArea",
      "serviceAreas",
      "coverageArea",
      "marketArea",
      "county",
      "region",
      "formData.serviceArea",
      "answers.serviceArea",
      "application.serviceArea",
    ]),
    capabilityNarrative: findFirstValue(source, [
      "capabilityNarrative",
      "companyNarrative",
      "summary",
      "overview",
      "formData.capabilityNarrative",
      "answers.capabilityNarrative",
      "application.capabilityNarrative",
    ]),
    brandPrimary: emptyStatement.brandPrimary,
    brandAccent: emptyStatement.brandAccent,
    brandFooter: emptyStatement.brandFooter,
  };

  if (!mapped.capabilityNarrative) {
    mapped.capabilityNarrative = generateNarrative(mapped);
  }

  return mapped;
}

function getStoredApplicationData(): unknown {
  if (typeof window === "undefined") return {};

  const keysToTry = [
    "chubApplyAnswers",
    "chubApplicationAnswers",
    "applyAnswers",
    "applicationAnswers",
    "capabilityBuilderSeed",
    "chubAssessmentAnswers",
    "assessmentAnswers",
    "certificationHubApplication",
    "applicationData",
    "chubFormData",
  ];

  for (const key of keysToTry) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    } catch {
      continue;
    }
  }

  return {};
}

function toBulletArray(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.replace(/^•\s*/, "").trim())
    .filter(Boolean);
}

function saveTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  saveBlobFile(filename, blob);
}

function saveHtmlFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/html;charset=utf-8" });
  saveBlobFile(filename, blob);
}

function saveBlobFile(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function getSafeFilename(companyName: string, suffix: string, extension = "txt") {
  const safeName = (companyName || "capability-statement")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${safeName}-${suffix}.${extension}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildCapabilityText(form: CapabilityStatement) {
  return `
${form.companyName || "Company Name"}
${form.addressLine}
${form.phone}
${form.email}
${form.website}

CAPABILITY NARRATIVE
${form.capabilityNarrative}

CORE COMPETENCIES
${toBulletArray(form.coreCompetencies).map((item) => `- ${item}`).join("\n")}

DIFFERENTIATORS
${toBulletArray(form.differentiators).map((item) => `- ${item}`).join("\n")}

PAST PERFORMANCE
${toBulletArray(form.pastPerformance).map((item) => `- ${item}`).join("\n")}

NAICS CODES
${form.naicsCodes}

CERTIFICATIONS
${form.certifications}

BUSINESS INFO
EIN: ${form.ein}
Year Established: ${form.yearEstablished}
Employees: ${form.employees}
Industry: ${form.industry}
Service Area: ${form.serviceArea}
Owner: ${form.ownerName}
`.trim();
}

function buildCapabilityHtml(form: CapabilityStatement) {
  const list = (value: string, placeholder: string) => {
    const items = toBulletArray(value);
    if (!items.length) return `<p class="muted">${escapeHtml(placeholder)}</p>`;

    return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  };

  const simple = (value: string, placeholder: string) =>
    value ? escapeHtml(value).replace(/\n/g, "<br />") : `<span class="muted">${escapeHtml(placeholder)}</span>`;

  const snapshotItems = [
    form.yearEstablished ? `Est. ${form.yearEstablished}` : "",
    form.employees ? `${form.employees} Employees` : "",
    form.industry || "",
    form.serviceArea || "",
  ].filter(Boolean);

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(form.companyName || "Capability Statement")}</title>
  <style>
    :root {
      --primary: ${form.brandPrimary};
      --accent: ${form.brandAccent};
      --footer: ${form.brandFooter};
      --ink: #111827;
      --muted: #5f6673;
      --paper: #ffffff;
      --panel: #f8fafc;
      --line: #e5e7eb;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #eef1f5;
      color: var(--ink);
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.45;
    }
    .page {
      width: min(8.5in, calc(100vw - 32px));
      margin: 24px auto;
      background: var(--paper);
      border: 1px solid #d1d5db;
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.18);
      overflow: hidden;
    }
    .topbar { height: 14px; background: var(--primary); }
    .inner { padding: 34px; }
    .header {
      display: grid;
      grid-template-columns: 1fr 245px;
      gap: 24px;
      border-bottom: 5px solid var(--accent);
      padding-bottom: 22px;
    }
    h1 { margin: 0 0 12px; font-size: 34px; line-height: 1; color: var(--primary); }
    .narrative { margin: 0; color: #4b5563; font-size: 15px; }
    .contact {
      border: 1px solid var(--line);
      border-radius: 18px;
      background: var(--panel);
      padding: 16px;
      font-size: 14px;
    }
    .pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
    .pill {
      border: 1px solid var(--accent);
      background: color-mix(in srgb, var(--accent) 14%, white);
      color: var(--primary);
      border-radius: 999px;
      padding: 5px 11px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .sections { display: grid; gap: 18px; margin-top: 24px; }
    .section-box {
      border: 1px solid var(--line);
      border-radius: 18px;
      background: var(--panel);
      padding: 16px;
    }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    h2 {
      margin: 0 0 9px;
      color: var(--accent);
      font-size: 12px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
    ul { margin: 0; padding-left: 20px; }
    li { margin: 0 0 7px; font-size: 14px; }
    p { font-size: 14px; margin: 0; }
    .muted { color: var(--muted); }
    .footer {
      background: var(--footer);
      color: #fff;
      padding: 12px 34px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
    @media print {
      @page { size: letter; margin: 0.35in; }
      body { background: #fff; }
      .page { width: 100%; margin: 0; box-shadow: none; }
    }
    @media (max-width: 760px) {
      .header, .two-col { grid-template-columns: 1fr; }
      .inner { padding: 24px; }
    }
  </style>
</head>
<body>
  <main class="page">
    <div class="topbar"></div>
    <div class="inner">
      <header class="header">
        <div>
          <h1>${escapeHtml(form.companyName || "Your Company Name")}</h1>
          <p class="narrative">${escapeHtml(form.capabilityNarrative || "Your capability narrative will appear here.")}</p>
          ${
            snapshotItems.length
              ? `<div class="pills">${snapshotItems.map((item) => `<span class="pill">${escapeHtml(item)}</span>`).join("")}</div>`
              : ""
          }
        </div>
        <aside class="contact">
          <p><strong>Owner:</strong> ${escapeHtml(form.ownerName || "—")}</p>
          <p><strong>Phone:</strong> ${escapeHtml(form.phone || "—")}</p>
          <p><strong>Email:</strong> ${escapeHtml(form.email || "—")}</p>
          <p><strong>Website:</strong> ${escapeHtml(form.website || "—")}</p>
          <p><strong>Address:</strong> ${escapeHtml(form.addressLine || "—")}</p>
        </aside>
      </header>
      <section class="sections">
        <div class="section-box"><h2>Core Competencies</h2>${list(form.coreCompetencies, "Add core services and capabilities.")}</div>
        <div class="section-box"><h2>Differentiators</h2>${list(form.differentiators, "Add what makes the business stand out.")}</div>
        <div class="section-box"><h2>Past Performance</h2>${list(form.pastPerformance, "Add relevant experience or project history.")}</div>
        <div class="two-col">
          <div class="section-box"><h2>NAICS Codes</h2><p>${simple(form.naicsCodes, "Add NAICS codes")}</p></div>
          <div class="section-box"><h2>Certifications</h2><p>${simple(form.certifications, "Add certifications")}</p></div>
        </div>
        <div class="two-col">
          <div class="section-box"><h2>Business Info</h2><p>${simple([
            form.ein ? `EIN: ${form.ein}` : "",
            form.yearEstablished ? `Year Established: ${form.yearEstablished}` : "",
            form.employees ? `Employees: ${form.employees}` : "",
            form.industry ? `Industry: ${form.industry}` : "",
          ].filter(Boolean).join("\n"), "Business info will appear here")}</p></div>
          <div class="section-box"><h2>Service Area</h2><p>${simple(form.serviceArea, "Add service area")}</p></div>
        </div>
      </section>
    </div>
    <footer class="footer">Buyer-ready capability statement</footer>
  </main>
</body>
</html>`;
}

function applyBrandScheme(
  scheme: (typeof brandSchemes)[number],
  setForm: Dispatch<SetStateAction<CapabilityStatement>>,
  setStatusMessage: Dispatch<SetStateAction<string>>
) {
  setForm((current) => ({
    ...current,
    brandPrimary: scheme.primary,
    brandAccent: scheme.accent,
    brandFooter: scheme.footer,
  }));
  setStatusMessage(`${scheme.name} color scheme applied to the capability statement.`);
}

export default function CapabilityBuilderPage() {
  const [form, setForm] = useState<CapabilityStatement>(emptyStatement);
  const [autoFilled, setAutoFilled] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Open this after the 24-question apply flow for the best auto-filled draft."
  );

  useEffect(() => {
    loadFromApplication();
  }, []);

  function loadFromApplication() {
    const storedData = getStoredApplicationData();
    const mapped = mapStoredDataToCapability(storedData);
    const hasRealFields =
      !!mapped.companyName ||
      !!mapped.ownerName ||
      !!mapped.email ||
      !!mapped.phone ||
      !!mapped.website ||
      !!mapped.ein ||
      !!mapped.coreCompetencies ||
      !!mapped.naicsCodes;

    setForm(hasRealFields ? mapped : getSampleStatement());

    setAutoFilled(hasRealFields);
    setStatusMessage(
      hasRealFields
        ? "Regenerated from saved CHUB application answers."
        : "No saved CHUB application answers were found, so CHUB loaded a clean sample draft for testing."
    );
  }

  function updateField(field: keyof CapabilityStatement, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function saveCapabilityDraft() {
    localStorage.setItem("capabilityStatementDraft", JSON.stringify(form));
    saveHtmlFile(
      getSafeFilename(form.companyName, "branded-capability-statement", "html"),
      buildCapabilityHtml(form)
    );
    setStatusMessage(
      "Draft saved in this browser and downloaded as a branded one-page document."
    );
    alert("Capability Statement draft saved and downloaded as a branded page.");
  }

  function exportPlainText() {
    saveTextFile(
      getSafeFilename(form.companyName, "capability-statement"),
      buildCapabilityText(form)
    );
  }

  function useSampleCore() {
    const industry = form.industry || "business support";
    updateField(
      "coreCompetencies",
      [
        `• ${industry} services and day-to-day project support`,
        "• Contract readiness preparation and document organization",
        "• Buyer communication, follow-up, and service coordination",
        "• Quality control, scheduling, and responsive customer support",
      ].join("\n")
    );
    setStatusMessage(
      "Sample core competencies added. Review and edit them so they match the real business."
    );
  }

  function useSampleDiff() {
    updateField(
      "differentiators",
      [
        "• Direct owner involvement and responsive communication",
        "• Organized records that make agency review and buyer conversations easier",
        "• Clear follow-through from first request through final delivery",
        "• Dependable execution for small-business, local-agency, and public-sector opportunities",
      ].join("\n")
    );
    setStatusMessage(
      "Sample differentiators added. These are starter points, not final claims."
    );
  }

  function useSamplePastPerformance() {
    const company = form.companyName || "The business";
    updateField(
      "pastPerformance",
      [
        `• ${company} has completed work that required accuracy, timeliness, and clear client communication`,
        "• Supported projects involving coordination, follow-up, and reliable service delivery",
        "• Maintained organized records and project details that can support future buyer conversations",
      ].join("\n")
    );
    setStatusMessage(
      "Sample past performance added. Replace anything that does not match the business's real experience."
    );
  }

  function regenerateNarrative() {
    const updated = {
      ...form,
      capabilityNarrative: generateNarrative(form),
    };
    setForm(updated);
    setStatusMessage("Narrative regenerated from the current fields.");
  }

  function polishStatement() {
    setForm((current) => polishCapabilityStatement(current));
    setStatusMessage(
      "Statement polished into the stronger buyer-ready version. Review the wording before saving or printing."
    );
  }

  const snapshotItems = useMemo(() => {
    return [
      form.yearEstablished ? `Est. ${form.yearEstablished}` : "",
      form.employees ? `${form.employees} Employees` : "",
      form.industry || "",
      form.serviceArea || "",
    ].filter(Boolean);
  }, [form]);

  const completionScore = useMemo(() => {
    const fields = [
      form.companyName,
      form.ownerName,
      form.email,
      form.phone,
      form.addressLine,
      form.coreCompetencies,
      form.differentiators,
      form.pastPerformance,
      form.naicsCodes,
      form.certifications,
      form.capabilityNarrative,
    ];

    const completed = fields.filter((item) => item.trim() !== "").length;
    return Math.round((completed / fields.length) * 100);
  }, [form]);

  const brandStyle = useMemo<CapabilityBrandStyle>(
    () => ({
      "--capability-primary": form.brandPrimary,
      "--capability-accent": form.brandAccent,
      "--capability-footer": form.brandFooter,
    }),
    [form.brandAccent, form.brandFooter, form.brandPrimary]
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="no-print mb-8 rounded-[28px] border border-yellow-500/25 bg-gradient-to-r from-zinc-950 via-black to-zinc-950 p-6 shadow-[0_0_40px_rgba(250,204,21,0.08)]">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-yellow-400">
                Capability Builder
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Build a Professional Capability Statement
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-300">
                This builder auto-fills from the applicant’s answers, then lets
                them polish the final language before printing or saving.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-yellow-500/25 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100">
                {autoFilled
                  ? "Application answers found and mapped."
                  : "No mapped application values found yet."}
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-200">
                Completion Score:{" "}
                <span className="font-bold text-yellow-400">{completionScore}%</span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={loadFromApplication}
              className="rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-bold text-black transition hover:bg-yellow-300"
            >
              Regenerate from Answers
            </button>
            <button
              onClick={saveCapabilityDraft}
              className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:border-yellow-400 hover:text-yellow-300"
            >
              Save + Download Branded Page
            </button>
            <button
              onClick={exportPlainText}
              className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:border-yellow-400 hover:text-yellow-300"
            >
              Download Text Backup
            </button>
            <button
              onClick={() => window.print()}
              className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:border-yellow-400 hover:text-yellow-300"
            >
              Print / Save One-Page PDF
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-200">
                  Smart Polish
                </p>
                <p className="mt-2 text-sm leading-7 text-cyan-50">
                  We can make the wording more buyer-ready without adding facts
                  the user did not provide.
                </p>
              </div>
              <button
                onClick={polishStatement}
                className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-bold text-black transition hover:bg-cyan-200"
              >
                Polish My Statement
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm font-semibold leading-7 text-emerald-50">
            {statusMessage}
          </div>
        </div>

        <div className="no-print mb-8">
          <ChubStageBanner
            stage="highlight"
            title="CHUB Stage: Highlight"
            detail="This is where CHUB helps the business present itself clearly. The goal is to turn raw answers into a sharper story that buyers, agencies, and partners can understand fast."
          />
        </div>

        <div className="capability-builder-grid grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="no-print rounded-[28px] border border-zinc-800 bg-zinc-950 p-6">
            <SectionTitle
              title="Company Information"
              subtitle="These fields should auto-fill from the application answers."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Company Name"
                value={form.companyName}
                onChange={(value) => updateField("companyName", value)}
              />
              <InputField
                label="Owner / Principal"
                value={form.ownerName}
                onChange={(value) => updateField("ownerName", value)}
              />
              <InputField
                label="Email"
                value={form.email}
                onChange={(value) => updateField("email", value)}
              />
              <InputField
                label="Phone"
                value={form.phone}
                onChange={(value) => updateField("phone", value)}
              />
              <InputField
                label="Website"
                value={form.website}
                onChange={(value) => updateField("website", value)}
              />
              <InputField
                label="EIN"
                value={form.ein}
                onChange={(value) => updateField("ein", value)}
              />
              <InputField
                label="Year Established"
                value={form.yearEstablished}
                onChange={(value) => updateField("yearEstablished", value)}
              />
              <InputField
                label="Employees"
                value={form.employees}
                onChange={(value) => updateField("employees", value)}
              />
            </div>

            <div className="mt-4">
              <InputField
                label="Address / Location"
                value={form.addressLine}
                onChange={(value) => updateField("addressLine", value)}
              />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <InputField
                label="Industry"
                value={form.industry}
                onChange={(value) => updateField("industry", value)}
              />
              <InputField
                label="Service Area"
                value={form.serviceArea}
                onChange={(value) => updateField("serviceArea", value)}
              />
            </div>

            <div className="mt-6 rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-5">
              <SectionTitle
                title="Brand Colors"
                subtitle="Give the one-page statement a different header, accent, and footer color so it feels like this business's own marketing piece."
              />
              <div className="grid gap-3 md:grid-cols-4">
                {brandSchemes.map((scheme) => (
                  <button
                    key={scheme.name}
                    onClick={() =>
                      applyBrandScheme(scheme, setForm, setStatusMessage)
                    }
                    className="rounded-2xl border border-zinc-800 bg-black p-3 text-left transition hover:border-yellow-400"
                  >
                    <div className="mb-3 flex overflow-hidden rounded-full border border-white/10">
                      <span
                        className="h-3 flex-1"
                        style={{ backgroundColor: scheme.primary }}
                      />
                      <span
                        className="h-3 flex-1"
                        style={{ backgroundColor: scheme.accent }}
                      />
                      <span
                        className="h-3 flex-1"
                        style={{ backgroundColor: scheme.footer }}
                      />
                    </div>
                    <span className="text-sm font-bold text-white">
                      {scheme.name}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <ColorField
                  label="Header Color"
                  value={form.brandPrimary}
                  onChange={(value) => updateField("brandPrimary", value)}
                />
                <ColorField
                  label="Accent Color"
                  value={form.brandAccent}
                  onChange={(value) => updateField("brandAccent", value)}
                />
                <ColorField
                  label="Footer Color"
                  value={form.brandFooter}
                  onChange={(value) => updateField("brandFooter", value)}
                />
              </div>
            </div>

            <div className="mt-6">
              <SectionTitle
                title="Capability Narrative"
                subtitle="This is the short company overview buyers read first. Regenerate it after the fields below are filled in."
              />
              <TextAreaField
                label="Narrative"
                value={form.capabilityNarrative}
                onChange={(value) => updateField("capabilityNarrative", value)}
                rows={5}
              />
              <div className="mt-3">
                <button
                  onClick={regenerateNarrative}
                  className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-200 transition hover:bg-yellow-500/20"
                >
                  Regenerate Company Overview
                </button>
              </div>
            </div>

            <div className="mt-6">
              <SectionTitle
                title="Core Competencies"
                subtitle="This is the plain-English list of what the business actually does."
              />
              <TextAreaField
                label="Core Competencies"
                value={form.coreCompetencies}
                onChange={(value) => updateField("coreCompetencies", value)}
                rows={6}
              />
              <InlineAction
                onClick={useSampleCore}
                label="Fill Starter Competencies"
                note="Use this only when the user needs help turning services into buyer-friendly bullets."
              />
            </div>

            <div className="mt-6">
              <SectionTitle
                title="Differentiators"
                subtitle="This explains why a buyer should remember or trust this business."
              />
              <TextAreaField
                label="Differentiators"
                value={form.differentiators}
                onChange={(value) => updateField("differentiators", value)}
                rows={6}
              />
              <InlineAction
                onClick={useSampleDiff}
                label="Fill Starter Differentiators"
                note="Use this as a starting point, then remove anything that is not true for the business."
              />
            </div>

            <div className="mt-6">
              <SectionTitle
                title="Past Performance"
                subtitle="This should only include real work, project history, or relevant experience."
              />
              <TextAreaField
                label="Past Performance"
                value={form.pastPerformance}
                onChange={(value) => updateField("pastPerformance", value)}
                rows={6}
              />
              <InlineAction
                onClick={useSamplePastPerformance}
                label="Fill Starter Past Performance"
                note="Use this when the user has experience but does not know how to describe it yet."
              />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <TextAreaField
                label="NAICS Codes"
                value={form.naicsCodes}
                onChange={(value) => updateField("naicsCodes", value)}
                rows={4}
              />
              <TextAreaField
                label="Certifications"
                value={form.certifications}
                onChange={(value) => updateField("certifications", value)}
                rows={4}
              />
            </div>
          </div>

          <div className="capability-print-wrap rounded-[28px] border border-yellow-500/25 bg-gradient-to-b from-zinc-950 to-black p-6">
            <SectionTitle
              title="Live Capability Statement Preview"
              subtitle="This side gives them a clean, professional statement preview."
            />

            <div
              className="capability-document overflow-hidden rounded-[26px] border border-zinc-800 bg-white text-black shadow-2xl"
              style={brandStyle}
            >
              <div className="capability-document-topbar h-3" />
              <div className="capability-document-inner p-8">
              <div className="capability-document-header border-b-4 pb-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="capability-company-name text-3xl font-black tracking-tight">
                      {form.companyName || "Your Company Name"}
                    </h2>
                    <p className="capability-narrative mt-2 max-w-2xl text-sm leading-6 text-zinc-700">
                      {form.capabilityNarrative ||
                        "Your capability narrative will appear here."}
                    </p>
                  </div>

                  <div className="capability-contact-box rounded-2xl border border-zinc-300 bg-zinc-50 p-4 text-sm leading-6">
                    <div><strong>Owner:</strong> {form.ownerName || "—"}</div>
                    <div><strong>Phone:</strong> {form.phone || "—"}</div>
                    <div><strong>Email:</strong> {form.email || "—"}</div>
                    <div><strong>Website:</strong> {form.website || "—"}</div>
                    <div><strong>Address:</strong> {form.addressLine || "—"}</div>
                  </div>
                </div>

                {snapshotItems.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {snapshotItems.map((item) => (
                      <span
                        key={item}
                        className="capability-pill rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="capability-document-body mt-6 grid gap-6">
                <PreviewListSection
                  title="Core Competencies"
                  items={toBulletArray(form.coreCompetencies)}
                  placeholder="Add core services and capabilities."
                />

                <PreviewListSection
                  title="Differentiators"
                  items={toBulletArray(form.differentiators)}
                  placeholder="Add what makes the business stand out."
                />

                <PreviewListSection
                  title="Past Performance"
                  items={toBulletArray(form.pastPerformance)}
                  placeholder="Add relevant experience or project history."
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <PreviewSimpleSection
                    title="NAICS Codes"
                    content={form.naicsCodes}
                    placeholder="Add NAICS codes"
                  />
                  <PreviewSimpleSection
                    title="Certifications"
                    content={form.certifications}
                    placeholder="Add certifications"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <PreviewSimpleSection
                    title="Business Info"
                    content={[
                      form.ein ? `EIN: ${form.ein}` : "",
                      form.yearEstablished
                        ? `Year Established: ${form.yearEstablished}`
                        : "",
                      form.employees ? `Employees: ${form.employees}` : "",
                      form.industry ? `Industry: ${form.industry}` : "",
                    ]
                      .filter(Boolean)
                      .join("\n")}
                    placeholder="Business info will appear here"
                    preserveLines
                  />
                  <PreviewSimpleSection
                    title="Service Area"
                    content={form.serviceArea}
                    placeholder="Add service area"
                  />
                </div>
              </div>
              </div>
              <div className="capability-document-footer px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white">
                Buyer-ready capability statement
              </div>
            </div>

            <div className="no-print mt-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm leading-6 text-yellow-100">
              This version fixes the real issue: it maps application data from
              different saved structures instead of assuming one exact object shape.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold text-yellow-400">{title}</h3>
      {subtitle ? <p className="mt-1 text-sm text-zinc-400">{subtitle}</p> : null}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-300">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none transition focus:border-yellow-400"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-300">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none transition focus:border-yellow-400"
      />
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-300">{label}</span>
      <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-black px-3 py-2">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-12 cursor-pointer rounded-lg border border-zinc-700 bg-transparent"
        />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none"
        />
      </div>
    </label>
  );
}

function InlineAction({
  onClick,
  label,
  note,
}: {
  onClick: () => void;
  label: string;
  note?: string;
}) {
  return (
    <div className="mt-3">
      <button
        onClick={onClick}
        className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-200 transition hover:bg-yellow-500/20"
      >
        {label}
      </button>
      {note ? <p className="mt-2 text-sm leading-6 text-zinc-500">{note}</p> : null}
    </div>
  );
}

function PreviewListSection({
  title,
  items,
  placeholder,
}: {
  title: string;
  items: string[];
  placeholder: string;
}) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-yellow-700">
        {title}
      </h4>
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        {items.length ? (
          <ul className="space-y-2 text-sm leading-6 text-zinc-800">
            {items.map((item, index) => (
              <li key={`${title}-${index}`} className="flex gap-2">
                <span className="capability-bullet font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500">{placeholder}</p>
        )}
      </div>
    </div>
  );
}

function PreviewSimpleSection({
  title,
  content,
  placeholder,
  preserveLines = false,
}: {
  title: string;
  content: string;
  placeholder: string;
  preserveLines?: boolean;
}) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-yellow-700">
        {title}
      </h4>
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        {content ? (
          <p
            className={`text-sm leading-6 text-zinc-800 ${
              preserveLines ? "whitespace-pre-line" : ""
            }`}
          >
            {content}
          </p>
        ) : (
          <p className="text-sm text-zinc-500">{placeholder}</p>
        )}
      </div>
    </div>
  );
}
