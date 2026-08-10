export const FONT_OPTIONS = {
  display: [
    { id: "fraunces", label: "Fraunces (warm serif)", family: "Fraunces", google: "Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700", style: "italic" },
    { id: "playfair", label: "Playfair Display (classic)", family: "Playfair Display", google: "Playfair+Display:wght@400;600;700", style: "normal" },
    { id: "dmserif", label: "DM Serif Display (bold editorial)", family: "DM Serif Display", google: "DM+Serif+Display:wght@400", style: "normal" },
    { id: "spectral", label: "Spectral (literary)", family: "Spectral", google: "Spectral:wght@400;500;600;700", style: "normal" },
    { id: "baskerville", label: "Libre Baskerville (traditional)", family: "Libre Baskerville", google: "Libre+Baskerville:wght@400;700", style: "normal" },
    { id: "cormorant", label: "Cormorant Garamond (elegant)", family: "Cormorant Garamond", google: "Cormorant+Garamond:wght@500;600;700", style: "normal" },
  ],
  body: [
    { id: "worksans", label: "Work Sans (clean default)", family: "Work Sans", google: "Work+Sans:wght@400;500;600" },
    { id: "inter", label: "Inter (modern)", family: "Inter", google: "Inter:wght@400;500;600" },
    { id: "karla", label: "Karla (friendly)", family: "Karla", google: "Karla:wght@400;500;600;700" },
    { id: "manrope", label: "Manrope (geometric)", family: "Manrope", google: "Manrope:wght@400;500;600;700" },
    { id: "dmsans", label: "DM Sans (neutral)", family: "DM Sans", google: "DM+Sans:wght@400;500;600" },
    { id: "nunito", label: "Nunito Sans (soft)", family: "Nunito Sans", google: "Nunito+Sans:wght@400;500;600;700" },
  ],
  mono: [
    { id: "ibmplex", label: "IBM Plex Mono (default)", family: "IBM Plex Mono", google: "IBM+Plex+Mono:wght@400;500;600" },
    { id: "spacemono", label: "Space Mono (retro)", family: "Space Mono", google: "Space+Mono:wght@400;700" },
    { id: "jetbrains", label: "JetBrains Mono (crisp)", family: "JetBrains Mono", google: "JetBrains+Mono:wght@400;500;600" },
    { id: "robotomono", label: "Roboto Mono (plain)", family: "Roboto Mono", google: "Roboto+Mono:wght@400;500;600" },
  ],
};

export function findFont(role, id) {
  return FONT_OPTIONS[role].find((f) => f.id === id) || FONT_OPTIONS[role][0];
}

export function buildGoogleFontsUrl(fonts, extraDisplayIds = []) {
  const googleParams = new Set();
  [fonts.display, fonts.body, fonts.mono]
    .map((id, i) => findFont(["display", "body", "mono"][i], id).google)
    .forEach((g) => googleParams.add(g));
  extraDisplayIds.filter(Boolean).forEach((id) => googleParams.add(findFont("display", id).google));
  const families = Array.from(googleParams).map((g) => `family=${g}`).join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}
