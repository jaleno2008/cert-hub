export type LocalJourneyKey = "vendor" | "sbe" | "dbe";
export type LocalAgencyKey = "miami-dade" | "city-of-miami";

export const LOCAL_PROGRESS_ITEMS: Record<
  LocalAgencyKey,
  Array<{ key: LocalJourneyKey; label: string; href: string }>
> = {
  "miami-dade": [
    { key: "vendor", label: "Vendor Setup", href: "/local/miami-dade/vendor" },
    { key: "sbe", label: "SBE", href: "/local/miami-dade/sbe" },
    { key: "dbe", label: "DBE", href: "/local/miami-dade/dbe" },
  ],
  "city-of-miami": [
    { key: "vendor", label: "Vendor Setup", href: "/local/city-of-miami/vendor" },
    { key: "sbe", label: "Small-Business Path", href: "/local/city-of-miami/sbe" },
  ],
};
