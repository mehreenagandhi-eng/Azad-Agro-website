export const THEME_PRESETS = [
  { id: "ledger", name: "Harvest Ledger", colors: { paper: "#EDE6D6", ink: "#2B2016", accent: "#C98A2B", accent2: "#4A5D3A", danger: "#A8451F" }, fonts: { display: "fraunces", body: "worksans", mono: "ibmplex" } },
  { id: "terracotta", name: "Terracotta Market", colors: { paper: "#F3E7DA", ink: "#3B241A", accent: "#C2673A", accent2: "#7A8B5C", danger: "#9C3B2E" }, fonts: { display: "playfair", body: "inter", mono: "spacemono" } },
  { id: "sage", name: "Sage & Stone", colors: { paper: "#EAEDE4", ink: "#2A322A", accent: "#8A9A5B", accent2: "#5B7065", danger: "#B25445" }, fonts: { display: "spectral", body: "karla", mono: "robotomono" } },
  { id: "indigo", name: "Indigo Bazaar", colors: { paper: "#EDE9DE", ink: "#22283A", accent: "#C99A3B", accent2: "#3B5170", danger: "#A8451F" }, fonts: { display: "dmserif", body: "manrope", mono: "jetbrains" } },
  { id: "monsoon", name: "Monsoon Orchard", colors: { paper: "#EFE6DC", ink: "#26302A", accent: "#B8763B", accent2: "#3E5C43", danger: "#8C3B4A" }, fonts: { display: "cormorant", body: "dmsans", mono: "ibmplex" } },
];

export const DEFAULT_THEME = { ...THEME_PRESETS[0], sections: {}, textOverrides: {} };

export const SECTION_DEFS = [
  { id: "header", label: "Header & navigation" },
  { id: "hero", label: "Hero banner (Home)" },
  { id: "contentpages", label: "Manufacturers / Mission / Get Started banners" },
  { id: "mfgtabs", label: "Manufacturer page tabs (Our Story / Order Now / Contact)" },
  { id: "quicknav", label: "Category quick-nav" },
  { id: "featured", label: "Featured products section" },
  { id: "cards", label: "Product cards" },
  { id: "drawer", label: "Cart drawer" },
  { id: "checkout", label: "Checkout page" },
  { id: "footer", label: "Footer" },
];

export function sectionValue(theme, id, key) {
  return (theme.sections && theme.sections[id] && theme.sections[id][key]) || "";
}
