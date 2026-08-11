/** Quick background-only greens (updates `colors.paper`). */
export const GREEN_BACKGROUNDS = [
  { id: "pine", name: "Deep pine", paper: "#14201A", inkHint: "light" },
  { id: "forest", name: "Forest canopy", paper: "#1C2A22", inkHint: "light" },
  { id: "jungle", name: "Jungle shade", paper: "#1A2F24", inkHint: "light" },
  { id: "emerald", name: "Emerald shadow", paper: "#163028", inkHint: "light" },
  { id: "tea", name: "Tea leaf", paper: "#1F2E26", inkHint: "light" },
  { id: "moss", name: "Moss night", paper: "#243528", inkHint: "light" },
  { id: "fern", name: "Fern dark", paper: "#22362B", inkHint: "light" },
  { id: "olive", name: "Olive dusk", paper: "#2A3324", inkHint: "light" },
  { id: "charcoal", name: "Sage charcoal", paper: "#2C3530", inkHint: "light" },
  { id: "softmoss", name: "Soft moss", paper: "#334238", inkHint: "light" },
  { id: "mist", name: "Mist sage", paper: "#E8EDE6", inkHint: "dark" },
  { id: "paleolive", name: "Pale olive", paper: "#E4E8DC", inkHint: "dark" },
  { id: "softfern", name: "Soft fern", paper: "#DCE5D8", inkHint: "dark" },
  { id: "meadow", name: "Meadow wash", paper: "#E7EFE4", inkHint: "dark" },
];

export const THEME_PRESETS = [
  {
    id: "forest",
    name: "Forest Canopy",
    colors: {
      paper: "#1C2A22",
      ink: "#F3EEE4",
      accent: "#B7C98A",
      accent2: "#6E8B74",
      danger: "#D17A63",
    },
    fonts: { display: "fraunces", body: "worksans", mono: "ibmplex" },
  },
  {
    id: "pine",
    name: "Deep Pine",
    colors: {
      paper: "#14201A",
      ink: "#F2EDE4",
      accent: "#AFC48A",
      accent2: "#5F7F68",
      danger: "#D17A63",
    },
    fonts: { display: "fraunces", body: "worksans", mono: "ibmplex" },
  },
  {
    id: "moss",
    name: "Moss Night",
    colors: {
      paper: "#243528",
      ink: "#F4F0E6",
      accent: "#C2D19A",
      accent2: "#7A947C",
      danger: "#D17A63",
    },
    fonts: { display: "spectral", body: "karla", mono: "ibmplex" },
  },
  {
    id: "olive",
    name: "Olive Dusk",
    colors: {
      paper: "#2A3324",
      ink: "#F5F1E7",
      accent: "#C9B87A",
      accent2: "#7E8B5C",
      danger: "#D17A63",
    },
    fonts: { display: "cormorant", body: "dmsans", mono: "ibmplex" },
  },
  {
    id: "mist",
    name: "Mist Sage",
    colors: {
      paper: "#E8EDE6",
      ink: "#243028",
      accent: "#6E8B5C",
      accent2: "#4F6A56",
      danger: "#B25445",
    },
    fonts: { display: "fraunces", body: "worksans", mono: "ibmplex" },
  },
  {
    id: "ledger",
    name: "Harvest Ledger",
    colors: {
      paper: "#EDE6D6",
      ink: "#2B2016",
      accent: "#C98A2B",
      accent2: "#4A5D3A",
      danger: "#A8451F",
    },
    fonts: { display: "fraunces", body: "worksans", mono: "ibmplex" },
  },
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
