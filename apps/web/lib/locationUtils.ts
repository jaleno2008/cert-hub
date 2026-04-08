export const normalizeCountyName = (county: string) => {
  if (!county) return "";

  const value = county
    .trim()
    .toLowerCase()
    .replace(/[.,]/g, "")
    .replace(/\s+/g, " ")
    .replace(/-/g, " ");

  if (
    value.includes("miami dade") ||
    value.includes("miami dadw") ||
    value.includes("dade") ||
    value.includes("dadw")
  ) {
    return "Miami-Dade";
  }

  return county.trim();
};

export const formatLocation = (
  city?: string,
  county?: string,
  state?: string
) => {
  const cleanCounty = normalizeCountyName(county || "");
  return [city, cleanCounty, state].filter(Boolean).join(", ");
};