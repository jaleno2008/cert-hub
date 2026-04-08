export type DocumentStatus = "missing" | "uploaded" | "reviewing" | "approved";

export type RequiredDocument = {
  id: string;
  name: string;
  description: string;
  required: boolean;
  acceptedFileTypes: string[];
  maxFiles: number;
  status: DocumentStatus;
};

export const requiredDocuments: RequiredDocument[] = [
  {
    id: "business-license",
    name: "Business License",
    description: "Upload your active business license or registration document.",
    required: true,
    acceptedFileTypes: ["PDF", "JPG", "PNG"],
    maxFiles: 1,
    status: "missing",
  },
  {
    id: "articles-of-incorporation",
    name: "Articles of Incorporation",
    description: "Upload formation documents for your company.",
    required: true,
    acceptedFileTypes: ["PDF"],
    maxFiles: 1,
    status: "missing",
  },
  {
    id: "ein-letter",
    name: "EIN Letter",
    description: "Upload your IRS EIN confirmation letter.",
    required: true,
    acceptedFileTypes: ["PDF", "JPG", "PNG"],
    maxFiles: 1,
    status: "missing",
  },
  {
    id: "voided-check",
    name: "Voided Check / Bank Letter",
    description: "Upload banking proof for verification.",
    required: false,
    acceptedFileTypes: ["PDF", "JPG", "PNG"],
    maxFiles: 1,
    status: "missing",
  },
  {
    id: "insurance-certificate",
    name: "Certificate of Insurance",
    description: "Upload your general liability or business insurance document.",
    required: false,
    acceptedFileTypes: ["PDF"],
    maxFiles: 1,
    status: "missing",
  },
  {
    id: "capability-statement",
    name: "Capability Statement",
    description: "Upload your capability statement if available.",
    required: false,
    acceptedFileTypes: ["PDF"],
    maxFiles: 1,
    status: "missing",
  },
];