export const s = {
  app: {
    minHeight: "100vh",
    background: "var(--paper)",
    color: "var(--ink)",
    fontFamily: "var(--font-body)",
    fontSize: 16,
    lineHeight: 1.55,
    WebkitFontSmoothing: "antialiased",
  },

  flash: {
    position: "fixed",
    top: 16,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 9999,
    padding: "10px 18px",
    borderRadius: 999,
    background: "var(--ink)",
    color: "var(--paper)",
    fontFamily: "var(--font-body)",
    fontSize: 14,
    fontWeight: 500,
    boxShadow: "0 8px 28px color-mix(in srgb, var(--ink) 22%, transparent)",
    pointerEvents: "none",
  },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "var(--header-bg, color-mix(in srgb, var(--paper) 82%, black 18%))",
    backdropFilter: "blur(14px)",
    borderBottom: "1px solid color-mix(in srgb, var(--accent) 28%, var(--border))",
    boxShadow: "0 10px 28px color-mix(in srgb, black 18%, transparent)",
  },

  headerInner: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "16px 22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
    flexWrap: "wrap",
  },

  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    minWidth: 0,
    position: "relative",
    cursor: "pointer",
  },

  logoMark: {
    width: 46,
    height: 46,
    borderRadius: "50%",
    objectFit: "cover",
    border: "1px solid color-mix(in srgb, var(--accent) 40%, var(--border))",
    background: "color-mix(in srgb, var(--ink) 88%, var(--paper) 12%)",
    flexShrink: 0,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },

  logoEditBadge: {
    position: "absolute",
    left: -4,
    top: -6,
    fontSize: 10,
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "2px 6px",
    borderRadius: 4,
    background: "var(--accent)",
    color: "var(--paper)",
    border: "1px solid color-mix(in srgb, var(--ink) 12%, transparent)",
  },

  logoTitle: {
    margin: 0,
    fontFamily: "var(--font-display)",
    fontSize: "clamp(1.15rem, 2vw, 1.45rem)",
    fontWeight: 600,
    lineHeight: 1.15,
    letterSpacing: "-0.01em",
  },

  headerBrandTitle: {
    margin: 0,
    fontFamily: "var(--header-font, var(--font-display))",
    fontSize: "clamp(1.2rem, 2vw, 1.55rem)",
    fontWeight: 600,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
    color: "var(--header-text, var(--ink))",
  },

  logoSub: {
    margin: "3px 0 0",
    fontSize: 11,
    color: "var(--accent)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 500,
  },

  nav: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },

  navLink: {
    border: "1px solid color-mix(in srgb, var(--accent2) 45%, var(--border))",
    background: "transparent",
    color: "var(--header-text, var(--ink))",
    fontFamily: "var(--font-body)",
    fontSize: 13.5,
    fontWeight: 500,
    padding: "9px 14px",
    borderRadius: 10,
    cursor: "pointer",
    transition: "color 0.15s ease, background 0.15s ease, border-color 0.15s ease",
  },

  navLinkActive: {
    border: "1px solid color-mix(in srgb, var(--accent) 55%, transparent)",
    color: "var(--paper)",
    background: "var(--accent)",
    fontWeight: 650,
  },

  pageBanner: {
    borderBottom: "1px solid var(--border)",
    background:
      "linear-gradient(165deg, color-mix(in srgb, var(--surface, var(--paper)) 70%, black 30%) 0%, color-mix(in srgb, var(--accent2) 14%, var(--paper)) 48%, var(--paper) 100%)",
    color: "var(--contentpages-text, var(--ink))",
  },

  pageBannerInner: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "34px 20px 28px",
  },

  pageHeading: {
    margin: "10px 0 0",
    fontFamily: "var(--font-display)",
    fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
    lineHeight: 1.1,
    fontWeight: 600,
    letterSpacing: "-0.02em",
  },

  pageIntro: {
    margin: "12px 0 0",
    maxWidth: 720,
    color: "var(--muted)",
    fontSize: "1.02rem",
    lineHeight: 1.65,
  },

  pageBody: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "28px 20px 72px",
  },

  pageSubheading: {
    margin: "28px 0 10px",
    fontFamily: "var(--font-display)",
    fontSize: "1.35rem",
    fontWeight: 600,
    lineHeight: 1.2,
  },

  removableSection: {
    position: "relative",
    marginBottom: 28,
    padding: "18px 18px 20px",
    borderRadius: 14,
    border: "1px dashed color-mix(in srgb, var(--accent) 35%, var(--border))",
    background: "color-mix(in srgb, var(--paper) 92%, var(--accent) 8%)",
  },

  sectionRemoveBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    border: "1px solid var(--border)",
    background: "var(--paper)",
    color: "var(--danger)",
    borderRadius: 8,
    padding: "4px 10px",
    fontSize: 12,
    fontFamily: "var(--font-mono)",
    cursor: "pointer",
  },

  hiddenSectionBox: {
    marginBottom: 16,
    padding: "14px 16px",
    borderRadius: 12,
    border: "1px dashed var(--border)",
    background: "color-mix(in srgb, var(--ink) 3%, var(--paper))",
    color: "var(--muted)",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },

  showSectionBtn: {
    border: "1px solid var(--border)",
    background: "var(--paper)",
    color: "var(--ink)",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
  },

  pageParagraph: {
    margin: "0 0 14px",
    color: "var(--ink)",
    lineHeight: 1.7,
    maxWidth: 760,
  },

  bulletList: {
    margin: "0 0 18px",
    padding: 0,
    listStyle: "none",
    display: "grid",
    gap: 10,
    maxWidth: 760,
  },

  stepsList: {
    margin: "0 0 24px",
    padding: 0,
    listStyle: "none",
    display: "grid",
    gap: 14,
    maxWidth: 820,
  },

  stepRow: {
    display: "grid",
    gridTemplateColumns: "34px 1fr auto",
    gap: 12,
    alignItems: "start",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "color-mix(in srgb, var(--paper) 94%, var(--accent2) 6%)",
  },

  stepNum: {
    width: 34,
    height: 34,
    borderRadius: 999,
    display: "grid",
    placeItems: "center",
    fontFamily: "var(--font-mono)",
    fontSize: 13,
    fontWeight: 600,
    background: "color-mix(in srgb, var(--accent) 18%, var(--paper))",
    color: "var(--ink)",
    border: "1px solid color-mix(in srgb, var(--accent) 35%, var(--border))",
  },

  stepText: {
    margin: 0,
    lineHeight: 1.6,
    color: "var(--ink)",
    paddingTop: 4,
  },

  stepSection: {
    marginBottom: 34,
    paddingBottom: 8,
  },

  stepSectionHeading: {
    margin: "0 0 8px",
    fontFamily: "var(--font-display)",
    fontSize: "1.25rem",
    fontWeight: 600,
  },

  stepSectionDivider: {
    height: 1,
    border: "none",
    background: "var(--border)",
    margin: "0 0 16px",
  },

  bulletItem: {
    display: "grid",
    gridTemplateColumns: "12px 1fr auto",
    gap: 12,
    alignItems: "start",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid color-mix(in srgb, var(--border) 80%, transparent)",
    background: "color-mix(in srgb, var(--paper) 96%, var(--accent2) 4%)",
  },

  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginTop: 8,
    background: "var(--accent2)",
    boxShadow: "0 0 0 3px color-mix(in srgb, var(--accent2) 18%, transparent)",
  },

  bulletText: {
    margin: 0,
    lineHeight: 1.6,
    color: "var(--ink)",
  },

  listRemoveBtn: {
    border: "1px solid var(--border)",
    background: "var(--paper)",
    color: "var(--danger)",
    borderRadius: 8,
    padding: "4px 8px",
    fontSize: 12,
    cursor: "pointer",
    alignSelf: "center",
  },

  badgeRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    margin: "12px 0 0",
  },

  badgeItem: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid var(--border)",
    background: "color-mix(in srgb, var(--paper) 88%, var(--accent2) 12%)",
  },

  badgeText: {
    fontSize: 12,
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "var(--ink)",
  },

  contactGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 18,
    marginTop: 18,
  },

  contactDetailsCard: {
    padding: "18px 18px 20px",
    borderRadius: 14,
    border: "1px solid var(--border)",
    background: "color-mix(in srgb, var(--paper) 94%, var(--accent) 6%)",
  },

  contactRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },

  contactText: {
    margin: 0,
    lineHeight: 1.55,
    color: "var(--ink)",
    wordBreak: "break-word",
  },

  contactFormCard: {
    padding: "18px 18px 20px",
    borderRadius: 14,
    border: "1px solid var(--border)",
    background: "var(--paper)",
    boxShadow: "0 10px 30px color-mix(in srgb, var(--ink) 6%, transparent)",
  },

  adminBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    background: "color-mix(in srgb, var(--accent) 20%, var(--paper))",
    color: "var(--ink)",
    border: "1px solid color-mix(in srgb, var(--accent) 40%, var(--border))",
  },

  ownerBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    background: "color-mix(in srgb, var(--accent2) 18%, var(--paper))",
    color: "var(--ink)",
    border: "1px solid color-mix(in srgb, var(--accent2) 35%, var(--border))",
  },

  adminExit: {
    border: "1px solid var(--border)",
    background: "var(--paper)",
    color: "var(--ink)",
    borderRadius: 8,
    padding: "6px 10px",
    fontSize: 12,
    fontFamily: "var(--font-mono)",
    cursor: "pointer",
  },

  cartBtn: {
    position: "relative",
    border: "1px solid var(--border)",
    background: "var(--paper)",
    color: "var(--ink)",
    borderRadius: 999,
    padding: "8px 14px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },

  cartCount: {
    minWidth: 20,
    height: 20,
    padding: "0 6px",
    borderRadius: 999,
    display: "inline-grid",
    placeItems: "center",
    fontSize: 11,
    fontFamily: "var(--font-mono)",
    background: "var(--accent)",
    color: "var(--paper)",
    fontWeight: 700,
  },

  accountDot: {
    width: 34,
    height: 34,
    borderRadius: 999,
    border: "1px solid var(--border)",
    background: "color-mix(in srgb, var(--accent2) 16%, var(--paper))",
    color: "var(--ink)",
    display: "grid",
    placeItems: "center",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },

  googleDisabledBtn: {
    width: "100%",
    border: "1px dashed var(--border)",
    background: "color-mix(in srgb, var(--ink) 3%, var(--paper))",
    color: "var(--muted)",
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: 14,
    cursor: "not-allowed",
    opacity: 0.75,
  },

  quickNav: {
    position: "sticky",
    top: 72,
    zIndex: 40,
    borderBottom: "1px solid var(--border)",
    background: "color-mix(in srgb, var(--paper) 90%, transparent)",
    backdropFilter: "blur(8px)",
  },

  mfgSubNav: {
    position: "sticky",
    top: 72,
    zIndex: 40,
    borderBottom: "1px solid var(--border)",
    background: "color-mix(in srgb, var(--paper) 90%, transparent)",
    backdropFilter: "blur(8px)",
  },

  mfgSubNavInner: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "10px 20px",
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },

  mfgSubNavPill: {
    border: "1px solid var(--border)",
    background: "var(--paper)",
    color: "var(--muted)",
    borderRadius: 999,
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },

  mfgSubNavPillActive: {
    border: "1px solid color-mix(in srgb, var(--accent) 45%, var(--border))",
    background: "color-mix(in srgb, var(--accent) 14%, var(--paper))",
    color: "var(--ink)",
  },

  quickNavInner: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "10px 20px",
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    overflowX: "auto",
  },

  quickNavPill: {
    border: "1px solid var(--border)",
    background: "var(--paper)",
    color: "var(--muted)",
    borderRadius: 999,
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  quickNavPillActive: {
    border: "1px solid color-mix(in srgb, var(--accent2) 45%, var(--border))",
    background: "color-mix(in srgb, var(--accent2) 14%, var(--paper))",
    color: "var(--ink)",
  },

  hero: {
    position: "relative",
    overflow: "hidden",
    borderBottom: "1px solid var(--border)",
    background: "var(--hero-bg, transparent)",
    color: "var(--hero-text, var(--ink))",
    minHeight: "calc(100vh - 88px)",
    display: "flex",
    alignItems: "center",
  },

  heroInner: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "56px 22px 64px",
    width: "100%",
  },

  heroGrid: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "56px 22px 64px",
    width: "100%",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.15fr) minmax(280px, 0.85fr)",
    gap: 48,
    alignItems: "center",
  },

  mfgHeroGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(260px, 0.85fr)",
    gap: 36,
    alignItems: "center",
  },

  homeManufacturerPreview: {
    width: "100%",
  },

  previewCard: {
    display: "grid",
    gridTemplateColumns: "56px 1fr auto",
    gap: 14,
    alignItems: "center",
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid var(--border)",
    background: "color-mix(in srgb, var(--paper) 92%, var(--accent) 8%)",
  },

  previewLogo: {
    width: 56,
    height: 56,
    borderRadius: 12,
    objectFit: "cover",
    border: "1px solid var(--border)",
  },

  previewLogoFallback: {
    width: 56,
    height: 56,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    border: "1px solid var(--border)",
    background: "color-mix(in srgb, var(--accent2) 12%, var(--paper))",
    color: "var(--accent2)",
  },

  previewName: {
    margin: 0,
    fontFamily: "var(--font-display)",
    fontSize: "1.05rem",
    fontWeight: 600,
  },

  previewTagline: {
    margin: "4px 0 0",
    fontSize: 13,
    color: "var(--muted)",
  },

  mfgGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 18,
  },

  mfgCard: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: "22px 20px 20px",
    borderRadius: 18,
    border: "1px solid var(--border)",
    background: "color-mix(in srgb, var(--paper) 88%, black 12%)",
    boxShadow: "0 12px 28px color-mix(in srgb, black 22%, transparent)",
    minHeight: 240,
    textAlign: "center",
    alignItems: "center",
  },

  mfgCardLogoWrap: {
    width: 64,
    height: 64,
    borderRadius: 14,
    overflow: "hidden",
    border: "1px solid var(--border)",
    background: "color-mix(in srgb, var(--accent) 10%, var(--paper))",
  },

  mfgCardLogo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  mfgCardLogoFallback: {
    width: "100%",
    height: "100%",
    display: "grid",
    placeItems: "center",
    color: "var(--accent)",
  },

  mfgCardName: {
    margin: 0,
    fontFamily: "var(--font-display)",
    fontSize: "1.15rem",
    fontWeight: 600,
    lineHeight: 1.2,
  },

  mfgCardTagline: {
    margin: "4px 0 0",
    fontSize: 13,
    color: "var(--muted)",
    lineHeight: 1.45,
    flex: 1,
  },

  mfgVisitBtn: {
    alignSelf: "flex-start",
    border: "1px solid color-mix(in srgb, var(--accent) 45%, var(--border))",
    background: "color-mix(in srgb, var(--accent) 12%, var(--paper))",
    color: "var(--ink)",
    borderRadius: 999,
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },

  pendingBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    background: "color-mix(in srgb, var(--accent) 18%, var(--paper))",
    color: "var(--ink)",
    border: "1px solid color-mix(in srgb, var(--accent) 35%, var(--border))",
  },

  rejectedBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    background: "color-mix(in srgb, var(--danger) 12%, var(--paper))",
    color: "var(--danger)",
    border: "1px solid color-mix(in srgb, var(--danger) 30%, var(--border))",
  },

  mfgReviewRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 10,
  },

  approveBtn: {
    border: "1px solid color-mix(in srgb, var(--accent2) 45%, var(--border))",
    background: "color-mix(in srgb, var(--accent2) 16%, var(--paper))",
    color: "var(--ink)",
    borderRadius: 10,
    padding: "8px 12px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },

  denyBtn: {
    border: "1px solid color-mix(in srgb, var(--danger) 35%, var(--border))",
    background: "color-mix(in srgb, var(--danger) 10%, var(--paper))",
    color: "var(--danger)",
    borderRadius: 10,
    padding: "8px 12px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },

  ownerOnlyNote: {
    margin: "8px 0 0",
    fontSize: 12,
    color: "var(--muted)",
    fontFamily: "var(--font-mono)",
  },

  reviewBanner: {
    margin: "0 0 18px",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid color-mix(in srgb, var(--accent) 35%, var(--border))",
    background: "color-mix(in srgb, var(--accent) 10%, var(--paper))",
    color: "var(--ink)",
    lineHeight: 1.55,
    fontSize: 14,
  },

  shopNowBtn: {
    border: "none",
    background: "var(--accent)",
    color: "var(--paper)",
    borderRadius: 999,
    padding: "10px 16px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 8px 20px color-mix(in srgb, var(--accent) 28%, transparent)",
  },

  farmPhotoWrap: {
    width: "100%",
    maxWidth: 520,
    margin: "0 auto",
  },

  farmPhotoFrame: {
    padding: 0,
    borderRadius: 22,
    overflow: "hidden",
    background: "color-mix(in srgb, var(--paper) 70%, black 30%)",
    border: "1px solid color-mix(in srgb, var(--accent) 35%, var(--border))",
    boxShadow: "0 24px 48px color-mix(in srgb, black 35%, transparent)",
  },

  farmPhotoImg: {
    width: "100%",
    display: "block",
    aspectRatio: "4 / 3",
    objectFit: "cover",
    borderRadius: 0,
  },

  farmPhotoPlaceholder: {
    width: "100%",
    aspectRatio: "4 / 3",
    display: "grid",
    placeItems: "center",
    gap: 10,
    borderRadius: 0,
    border: "none",
    background:
      "radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--accent2) 28%, transparent), transparent 55%), linear-gradient(160deg, color-mix(in srgb, var(--paper) 55%, black 45%), color-mix(in srgb, var(--accent2) 22%, var(--paper)))",
    color: "var(--muted-light)",
    fontSize: 14,
    textAlign: "center",
    padding: 24,
  },

  farmPhotoCaption: {
    margin: "12px 0 0",
    fontSize: 13,
    fontStyle: "italic",
    letterSpacing: "0.01em",
    color: "var(--muted)",
    textAlign: "center",
  },

  ledgerLine: {
    margin: "0 0 18px",
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "var(--accent)",
  },

  heroTitle: {
    margin: "0 0 18px",
    fontFamily: "var(--hero-font, var(--font-display))",
    fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
    lineHeight: 1.02,
    fontWeight: 600,
    letterSpacing: "-0.03em",
    fontStyle: "var(--font-display-style)",
  },

  heroText: {
    margin: "0 0 28px",
    maxWidth: 540,
    color: "var(--muted-light)",
    fontSize: "1.05rem",
    lineHeight: 1.7,
  },

  heroLedger: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 22,
    marginTop: 8,
    paddingTop: 22,
    borderTop: "1px solid color-mix(in srgb, var(--accent2) 55%, transparent)",
  },

  ledgerItem: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minWidth: 110,
  },

  ledgerNum: {
    fontFamily: "var(--font-mono)",
    fontSize: "clamp(1.45rem, 2.6vw, 1.9rem)",
    fontWeight: 600,
    lineHeight: 1.1,
    color: "var(--accent)",
  },

  ledgerLabel: {
    fontSize: 11.5,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "var(--muted)",
  },

  ledgerDivider: {
    width: 1,
    height: 34,
    background: "color-mix(in srgb, var(--accent2) 55%, transparent)",
    flexShrink: 0,
  },

  featuredSection: {
    marginTop: 34,
    paddingTop: 26,
    borderTop: "1px solid var(--border)",
  },

  featuredHeading: {
    margin: "0 0 14px",
    fontFamily: "var(--font-display)",
    fontSize: "1.35rem",
    fontWeight: 600,
  },

  featuredGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 16,
  },

  cardRibbon: {
    position: "absolute",
    top: 12,
    left: -8,
    padding: "4px 10px",
    background: "var(--accent)",
    color: "var(--paper)",
    fontSize: 11,
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    borderRadius: 4,
    boxShadow: "0 4px 12px color-mix(in srgb, var(--accent) 25%, transparent)",
  },

  shopSection: {
    marginTop: 8,
  },

  chipRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    margin: "0 0 18px",
  },

  chip: {
    border: "1px solid var(--border)",
    background: "var(--paper)",
    color: "var(--muted)",
    borderRadius: 999,
    padding: "7px 12px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },

  chipActive: {
    border: "1px solid color-mix(in srgb, var(--accent2) 45%, var(--border))",
    background: "color-mix(in srgb, var(--accent2) 14%, var(--paper))",
    color: "var(--ink)",
  },

  addProductBtn: {
    border: "1px dashed color-mix(in srgb, var(--accent) 45%, var(--border))",
    background: "color-mix(in srgb, var(--accent) 8%, var(--paper))",
    color: "var(--ink)",
    borderRadius: 12,
    padding: "10px 14px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: 16,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 16,
  },

  card: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 14,
    borderRadius: 16,
    border: "1px solid var(--border)",
    background: "var(--paper)",
    boxShadow: "0 8px 22px color-mix(in srgb, var(--ink) 5%, transparent)",
    overflow: "hidden",
  },

  cardWithBg: {
    position: "relative",
    minHeight: 260,
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid var(--border)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxShadow: "0 10px 28px color-mix(in srgb, var(--ink) 8%, transparent)",
  },

  cardOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, color-mix(in srgb, var(--ink) 10%, transparent) 0%, color-mix(in srgb, var(--ink) 72%, transparent) 100%)",
  },

  cardTagOnImage: {
    position: "absolute",
    top: 12,
    left: 12,
    padding: "4px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    background: "color-mix(in srgb, var(--paper) 82%, transparent)",
    color: "var(--ink)",
    border: "1px solid color-mix(in srgb, var(--paper) 60%, transparent)",
  },

  cardTextOnImage: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    color: "var(--paper)",
  },

  cardNoteOnImage: {
    margin: "6px 0 0",
    fontSize: 13,
    lineHeight: 1.45,
    color: "color-mix(in srgb, var(--paper) 82%, transparent)",
  },

  cardAdminBar: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
    marginBottom: 4,
  },

  cardAdminBtn: {
    border: "1px solid var(--border)",
    background: "color-mix(in srgb, var(--paper) 92%, var(--accent) 8%)",
    color: "var(--ink)",
    borderRadius: 8,
    padding: "4px 8px",
    fontSize: 11,
    fontFamily: "var(--font-mono)",
    cursor: "pointer",
  },

  cardTag: {
    alignSelf: "flex-start",
    padding: "4px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    background: "color-mix(in srgb, var(--accent2) 12%, var(--paper))",
    color: "var(--ink)",
    border: "1px solid color-mix(in srgb, var(--accent2) 25%, var(--border))",
  },

  cardName: {
    margin: 0,
    fontFamily: "var(--font-display)",
    fontSize: "1.05rem",
    fontWeight: 600,
    lineHeight: 1.25,
  },

  cardNote: {
    margin: 0,
    fontSize: 13,
    color: "var(--muted)",
    lineHeight: 1.45,
    minHeight: 38,
  },

  cardFoot: {
    marginTop: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingTop: 8,
    borderTop: "1px dashed var(--border)",
  },

  cardPrice: {
    fontFamily: "var(--font-display)",
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "var(--ink)",
  },

  cardUnit: {
    display: "block",
    fontSize: 12,
    color: "var(--muted)",
    fontFamily: "var(--font-body)",
    fontWeight: 400,
  },

  addBtn: {
    border: "1px solid color-mix(in srgb, var(--accent) 45%, var(--border))",
    background: "var(--accent)",
    color: "var(--paper)",
    borderRadius: 999,
    padding: "8px 12px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  textStyleBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "2px 6px",
    borderRadius: 6,
    border: "1px solid var(--border)",
    background: "var(--paper)",
    fontSize: 10,
    fontFamily: "var(--font-mono)",
    color: "var(--muted)",
    cursor: "pointer",
  },

  textStylePopover: {
    position: "absolute",
    zIndex: 50,
    minWidth: 220,
    padding: 10,
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "var(--paper)",
    boxShadow: "0 14px 36px color-mix(in srgb, var(--ink) 12%, transparent)",
  },

  textStylePopoverRow: {
    display: "grid",
    gridTemplateColumns: "88px 1fr",
    gap: 8,
    alignItems: "center",
    marginBottom: 8,
  },

  textStylePopoverLabel: {
    fontSize: 11,
    fontFamily: "var(--font-mono)",
    color: "var(--muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },

  cardQtyRow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    border: "1px solid var(--border)",
    borderRadius: 999,
    padding: 2,
    background: "color-mix(in srgb, var(--paper) 94%, var(--accent) 6%)",
  },

  qtyBtn: {
    width: 28,
    height: 28,
    border: "none",
    borderRadius: 999,
    background: "var(--paper)",
    color: "var(--ink)",
    fontSize: 16,
    lineHeight: 1,
    cursor: "pointer",
  },

  qtyVal: {
    minWidth: 22,
    textAlign: "center",
    fontFamily: "var(--font-mono)",
    fontSize: 13,
    fontWeight: 600,
  },

  removeBtn: {
    border: "none",
    background: "transparent",
    color: "var(--danger)",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    padding: "4px 6px",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "color-mix(in srgb, var(--ink) 42%, transparent)",
    zIndex: 200,
  },

  drawer: {
    position: "fixed",
    top: 0,
    right: 0,
    width: "min(420px, 100vw)",
    height: "100vh",
    background: "var(--paper)",
    borderLeft: "1px solid var(--border)",
    zIndex: 210,
    display: "flex",
    flexDirection: "column",
    boxShadow: "-12px 0 40px color-mix(in srgb, var(--ink) 12%, transparent)",
  },

  drawerHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "16px 18px",
    borderBottom: "1px solid var(--border)",
  },

  drawerTitle: {
    margin: 0,
    fontFamily: "var(--font-display)",
    fontSize: "1.2rem",
    fontWeight: 600,
  },

  cartDrawerTitle: {
    margin: 0,
    fontFamily: "var(--font-display)",
    fontSize: "1.2rem",
    fontWeight: 600,
  },

  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 999,
    border: "1px solid var(--border)",
    background: "var(--paper)",
    color: "var(--ink)",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    fontSize: 18,
    lineHeight: 1,
  },

  emptyCart: {
    padding: "28px 18px",
    color: "var(--muted)",
    lineHeight: 1.6,
    textAlign: "center",
  },

  drawerItems: {
    flex: 1,
    overflowY: "auto",
    padding: "12px 14px",
    display: "grid",
    gap: 10,
    alignContent: "start",
  },

  drawerItem: {
    display: "grid",
    gridTemplateColumns: "42px 1fr auto",
    gap: 10,
    alignItems: "center",
    padding: "10px 10px",
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "color-mix(in srgb, var(--paper) 96%, var(--accent2) 4%)",
  },

  miniIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    display: "grid",
    placeItems: "center",
    border: "1px solid var(--border)",
    background: "color-mix(in srgb, var(--accent2) 10%, var(--paper))",
    color: "var(--accent2)",
    overflow: "hidden",
  },

  drawerItemName: {
    margin: 0,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.3,
  },

  drawerItemUnit: {
    margin: "2px 0 0",
    fontSize: 12,
    color: "var(--muted)",
  },

  qtyRow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },

  drawerItemPrice: {
    fontFamily: "var(--font-mono)",
    fontSize: 13,
    fontWeight: 600,
    textAlign: "right",
    whiteSpace: "nowrap",
  },

  drawerFoot: {
    borderTop: "1px solid var(--border)",
    padding: "14px 16px 18px",
    background: "color-mix(in srgb, var(--paper) 92%, var(--accent) 8%)",
  },

  sumRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
    fontSize: 14,
    color: "var(--muted)",
  },

  sumTotal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    margin: "8px 0 14px",
    fontFamily: "var(--font-display)",
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "var(--ink)",
  },

  checkoutBtn: {
    width: "100%",
    border: "none",
    background: "var(--accent)",
    color: "var(--paper)",
    borderRadius: 12,
    padding: "12px 14px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 24px color-mix(in srgb, var(--accent) 24%, transparent)",
  },

  modalWrap: {
    position: "fixed",
    inset: 0,
    zIndex: 300,
    display: "grid",
    placeItems: "center",
    padding: 20,
    background: "color-mix(in srgb, var(--ink) 45%, transparent)",
  },

  modalHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "16px 18px",
    borderBottom: "1px solid var(--border)",
  },

  modalBody: {
    width: "min(720px, 100%)",
    maxHeight: "min(86vh, 900px)",
    overflow: "auto",
    borderRadius: 16,
    border: "1px solid var(--border)",
    background: "var(--paper)",
    boxShadow: "0 24px 60px color-mix(in srgb, var(--ink) 18%, transparent)",
  },

  checkoutMain: {
    maxWidth: 980,
    margin: "0 auto",
    padding: "24px 20px 64px",
  },

  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
    border: "none",
    background: "transparent",
    color: "var(--muted)",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    padding: 0,
  },

  backBar: {
    borderBottom: "1px solid var(--border)",
    background: "color-mix(in srgb, var(--paper) 92%, var(--accent) 8%)",
  },

  backLinkInBar: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    border: "none",
    background: "transparent",
    color: "var(--muted)",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    padding: "12px 20px",
  },

  checkoutGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, 0.8fr)",
    gap: 20,
    alignItems: "start",
  },

  checkoutForm: {
    padding: "18px 18px 20px",
    borderRadius: 14,
    border: "1px solid var(--border)",
    background: "var(--paper)",
  },

  sectionTitle: {
    margin: "0 0 12px",
    fontFamily: "var(--font-display)",
    fontSize: "1.05rem",
    fontWeight: 600,
  },

  formRow: {
    display: "grid",
    gap: 6,
    marginBottom: 12,
  },

  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "var(--ink)",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: 14,
    fontFamily: "var(--font-body)",
    color: "var(--ink)",
    background: "color-mix(in srgb, var(--paper) 96%, var(--accent) 4%)",
    outline: "none",
  },

  greenBgGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(128px, 1fr))",
    gap: 10,
    marginBottom: 6,
  },

  greenBgSwatch: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    gap: 4,
    minHeight: 72,
    padding: "10px 12px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "var(--font-body)",
  },

  greenBgName: {
    fontSize: 12.5,
    fontWeight: 650,
    letterSpacing: "0.01em",
    lineHeight: 1.25,
  },

  greenBgHex: {
    fontSize: 11,
    fontFamily: "var(--font-mono)",
    opacity: 0.78,
    letterSpacing: "0.02em",
  },

  presetGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: 10,
    marginBottom: 14,
  },

  presetCard: {
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 10,
    background: "var(--paper)",
    cursor: "pointer",
    textAlign: "left",
  },

  presetSwatches: {
    display: "flex",
    gap: 4,
    marginBottom: 8,
  },

  presetSwatch: {
    width: 18,
    height: 18,
    borderRadius: 999,
    border: "1px solid color-mix(in srgb, var(--ink) 10%, transparent)",
  },

  presetName: {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--ink)",
  },

  colorGrid: {
    display: "grid",
    gap: 10,
    marginBottom: 12,
  },

  colorRow: {
    display: "grid",
    gridTemplateColumns: "120px 1fr",
    gap: 10,
    alignItems: "center",
  },

  themeTabRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 14,
    borderBottom: "1px solid var(--border)",
    paddingBottom: 10,
  },

  themeTab: {
    border: "1px solid var(--border)",
    background: "var(--paper)",
    color: "var(--muted)",
    borderRadius: 999,
    padding: "7px 12px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },

  themeTabActive: {
    border: "1px solid color-mix(in srgb, var(--accent) 45%, var(--border))",
    background: "color-mix(in srgb, var(--accent) 12%, var(--paper))",
    color: "var(--ink)",
  },

  sectionEditorCard: {
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: "14px 14px 16px",
    marginBottom: 12,
    background: "color-mix(in srgb, var(--paper) 94%, var(--accent2) 6%)",
  },

  sectionEditorHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  },

  sectionEditorTitle: {
    margin: 0,
    fontSize: 14,
    fontWeight: 700,
    color: "var(--ink)",
  },

  sectionEditorRow: {
    display: "grid",
    gap: 8,
    marginBottom: 10,
  },

  uploadRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },

  uploadBtn: {
    border: "1px dashed color-mix(in srgb, var(--accent) 40%, var(--border))",
    background: "color-mix(in srgb, var(--accent) 8%, var(--paper))",
    color: "var(--ink)",
    borderRadius: 10,
    padding: "8px 12px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },

  removePhotoBtn: {
    border: "1px solid color-mix(in srgb, var(--danger) 30%, var(--border))",
    background: "color-mix(in srgb, var(--danger) 8%, var(--paper))",
    color: "var(--danger)",
    borderRadius: 10,
    padding: "8px 12px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },

  orDivider: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    gap: 10,
    alignItems: "center",
    margin: "12px 0",
    color: "var(--muted)",
    fontSize: 12,
    fontFamily: "var(--font-mono)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  previewLabel: {
    fontSize: 12,
    color: "var(--muted)",
    marginBottom: 6,
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },

  payOptions: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10,
    marginBottom: 14,
  },

  payOption: {
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "12px 12px",
    background: "var(--paper)",
    color: "var(--muted)",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "left",
  },

  payOptionActive: {
    border: "1px solid color-mix(in srgb, var(--accent2) 45%, var(--border))",
    background: "color-mix(in srgb, var(--accent2) 12%, var(--paper))",
    color: "var(--ink)",
    boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--accent2) 20%, transparent)",
  },

  placeBtn: {
    width: "100%",
    border: "none",
    background: "var(--accent2)",
    color: "var(--paper)",
    borderRadius: 12,
    padding: "12px 14px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 8,
  },

  summaryCard: {
    padding: "16px 16px 18px",
    borderRadius: 14,
    border: "1px solid var(--border)",
    background: "color-mix(in srgb, var(--paper) 92%, var(--accent) 8%)",
    position: "sticky",
    top: 88,
  },

  summaryRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
    fontSize: 14,
    color: "var(--muted)",
  },

  summaryDivider: {
    height: 1,
    border: "none",
    background: "var(--border)",
    margin: "10px 0",
  },

  mono: {
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.02em",
  },

  confirmWrap: {
    minHeight: "70vh",
    display: "grid",
    placeItems: "center",
    padding: "40px 20px",
    textAlign: "center",
  },

  stamp: {
    display: "inline-grid",
    placeItems: "center",
    width: 120,
    height: 120,
    borderRadius: 999,
    border: "3px double color-mix(in srgb, var(--accent2) 55%, var(--border))",
    color: "color-mix(in srgb, var(--accent2) 75%, var(--ink))",
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    transform: "rotate(-12deg)",
    marginBottom: 18,
    background: "color-mix(in srgb, var(--accent2) 8%, var(--paper))",
  },

  confirmTitle: {
    margin: "0 0 10px",
    fontFamily: "var(--font-display)",
    fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
    fontWeight: 600,
    lineHeight: 1.15,
  },

  confirmText: {
    margin: "0 auto 18px",
    maxWidth: 520,
    color: "var(--muted)",
    lineHeight: 1.65,
  },

  confirmCard: {
    maxWidth: 520,
    margin: "0 auto",
    padding: "16px 18px",
    borderRadius: 14,
    border: "1px solid var(--border)",
    background: "var(--paper)",
    textAlign: "left",
  },

  footer: {
    borderTop: "1px solid var(--border)",
    background: "color-mix(in srgb, var(--ink) 4%, var(--paper))",
    marginTop: "auto",
  },

  footerInner: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "28px 20px 22px",
    display: "grid",
    gap: 18,
  },

  footerHead: {
    margin: 0,
    fontFamily: "var(--font-display)",
    fontSize: "1.05rem",
    fontWeight: 600,
  },

  footerText: {
    margin: "6px 0 0",
    color: "var(--muted)",
    lineHeight: 1.6,
    maxWidth: 640,
    fontSize: 14,
  },

  footerBar: {
    borderTop: "1px solid var(--border)",
    paddingTop: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    fontSize: 12,
    color: "var(--muted)",
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.03em",
  },
};
