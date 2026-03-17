export const DOCUMENT_TYPES = [
  "articles_of_incorporation",
  "ein_letter",
  "capability_statement",
  "insurance_certificate",
  "past_performance",
]

export function getDocumentLabel(type: string) {
  switch (type) {
    case "articles_of_incorporation":
      return "Articles of Incorporation"

    case "ein_letter":
      return "EIN Letter"

    case "capability_statement":
      return "Capability Statement"

    case "insurance_certificate":
      return "Insurance Certificate"

    case "past_performance":
      return "Past Performance"

    default:
      return type
  }
}