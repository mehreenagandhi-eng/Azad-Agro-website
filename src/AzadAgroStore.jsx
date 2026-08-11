import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TextStyleContext } from "./context/TextStyleContext";
import { ThemeEditProvider } from "./context/ThemeEditContext";
import { EditableText } from "./components/EditableText";
import { Modal } from "./components/Modal";
import { ImageCropper } from "./components/ImageCropper";
import { ThemeModal } from "./components/ThemeModal";
import { SectionColorAnchor } from "./components/SectionColorControl";
import {
  ClerkAccountControls,
  ClerkAccountSync,
  ClerkMissingKeyControls,
} from "./components/ClerkAccountControls";
import { ClerkSetupHelpModal } from "./components/ClerkAccountModal";
import { SettingsModal } from "./components/SettingsModal";
import { ProductEditModal } from "./components/ProductEditModal";
import { ManufacturerEditModal } from "./components/ManufacturerEditModal";
import { OwnerLoginModal } from "./components/OwnerLoginModal";
import { MarketplaceHome } from "./pages/MarketplaceHome";
import { ManufacturerDirectory } from "./pages/ManufacturerDirectory";
import { MissionPage } from "./pages/MissionPage";
import { GetStartedPage } from "./pages/GetStartedPage";
import { ManufacturerPage } from "./pages/ManufacturerPage";
import { Checkout, Confirmation } from "./pages/Checkout";
import {
  DEFAULT_MANUFACTURERS,
  DEFAULT_MARKETPLACE,
  LOGO_SRC,
  OWNER_PASSCODE,
  manufacturerId,
  rupee,
  uid,
} from "./data/defaults";
import { DEFAULT_THEME, SECTION_DEFS, sectionValue } from "./data/themes";
import { enrichOrder, refreshOrderStatus } from "./data/orders";
import { buildGoogleFontsUrl, findFont } from "./data/fonts";
import { s } from "./styles";
import { Icon } from "./components/Icon";
import {
  bindPersistenceLifecycle,
  flushAllPersistence,
  localKey,
  mergeSite,
  mergeTheme,
  readJson,
  setManufacturersFlush,
  setSiteFlush,
  setThemeFlush,
  sharedKey,
  writeJson,
} from "./persistence";

export default function AzadAgroStore({ clerkEnabled = false }) {
  const [view, setView] = useState("home");
  const [activeManufacturerId, setActiveManufacturerId] = useState(null);
  const [mfgTab, setMfgTab] = useState("order");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [order, setOrder] = useState(null);
  const [site, setSite] = useState(() =>
    mergeSite(DEFAULT_MARKETPLACE, readJson(sharedKey("site-config-v2"), null))
  );
  const [manufacturers, setManufacturers] = useState(() => {
    const saved = readJson(sharedKey("manufacturers-v2"), null);
    return Array.isArray(saved) && saved.length ? saved : DEFAULT_MANUFACTURERS;
  });
  const [theme, setTheme] = useState(() =>
    mergeTheme(DEFAULT_THEME, readJson(sharedKey("theme-v2"), null))
  );
  const [activeColorSection, setActiveColorSection] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [logoCropSource, setLogoCropSource] = useState(null);
  const [isAdmin, setIsAdmin] = useState(() => Boolean(readJson(localKey("edit-mode"), false)));
  const [isOwner, setIsOwner] = useState(() => Boolean(readJson(localKey("owner-mode"), false)));
  const [showTheme, setShowTheme] = useState(false);
  const [showOwnerLogin, setShowOwnerLogin] = useState(false);
  const [showClerkHelp, setShowClerkHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [account, setAccount] = useState(() => readJson(localKey("account"), null));
  const [orders, setOrders] = useState(() => {
    const saved = readJson(sharedKey("orders-v1"), []);
    return Array.isArray(saved) ? saved.map(refreshOrderStatus) : [];
  });
  const [ownerLoginError, setOwnerLoginError] = useState("");
  const [savedFlash, setSavedFlash] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingManufacturer, setEditingManufacturer] = useState(null);

  const siteRef = React.useRef(site);
  const themeRef = React.useRef(theme);
  const manufacturersRef = React.useRef(manufacturers);
  siteRef.current = site;
  themeRef.current = theme;
  manufacturersRef.current = manufacturers;

  useEffect(() => {
    bindPersistenceLifecycle();
    setThemeFlush(() => writeJson(sharedKey("theme-v2"), themeRef.current));
    setSiteFlush(() => writeJson(sharedKey("site-config-v2"), siteRef.current));
    setManufacturersFlush(() => writeJson(sharedKey("manufacturers-v2"), manufacturersRef.current));
  }, []);

  useEffect(() => {
    writeJson(localKey("edit-mode"), isAdmin);
  }, [isAdmin]);

  useEffect(() => {
    writeJson(localKey("owner-mode"), isOwner);
  }, [isOwner]);

  useEffect(() => {
    let cancelled = false;
    // Ensure defaults exist only when nothing was ever saved; never overwrite existing edits.
    async function ensureDefaults() {
      try {
        await window.storage.get("site-config-v2", true);
      } catch {
        if (!readJson(sharedKey("site-config-v2"), null)) {
          writeJson(sharedKey("site-config-v2"), siteRef.current);
          await window.storage.set("site-config-v2", JSON.stringify(siteRef.current), true).catch(() => {});
        }
      }
      try {
        await window.storage.get("manufacturers-v2", true);
      } catch {
        if (!readJson(sharedKey("manufacturers-v2"), null)) {
          writeJson(sharedKey("manufacturers-v2"), manufacturersRef.current);
          await window.storage
            .set("manufacturers-v2", JSON.stringify(manufacturersRef.current), true)
            .catch(() => {});
        }
      }
      try {
        await window.storage.get("theme-v2", true);
      } catch {
        if (!readJson(sharedKey("theme-v2"), null)) {
          writeJson(sharedKey("theme-v2"), themeRef.current);
          await window.storage.set("theme-v2", JSON.stringify(themeRef.current), true).catch(() => {});
        }
      }
      if (!cancelled) setLoaded(true);
    }
    ensureDefaults();
    return () => {
      cancelled = true;
      flushAllPersistence();
    };
  }, []);

  const flash = (msg) => {
    setSavedFlash(msg);
    setTimeout(() => setSavedFlash(""), 1800);
  };

  const saveSite = useCallback(async (next) => {
    setSite(next);
    siteRef.current = next;
    try {
      writeJson(sharedKey("site-config-v2"), next);
      await window.storage.set("site-config-v2", JSON.stringify(next), true);
      flash("Saved");
    } catch {
      flash("Save failed — try again");
    }
  }, []);

  const updateCopy = useCallback((key, val) => {
    setSite((prev) => {
      const next = { ...prev, copy: { ...prev.copy, [key]: val } };
      siteRef.current = next;
      try {
        writeJson(sharedKey("site-config-v2"), next);
        window.storage.set("site-config-v2", JSON.stringify(next), true).catch(() => {});
        flash("Saved");
      } catch {
        flash("Save failed — try again");
      }
      return next;
    });
  }, []);

  const saveManufacturers = useCallback(async (next) => {
    setManufacturers(next);
    manufacturersRef.current = next;
    try {
      writeJson(sharedKey("manufacturers-v2"), next);
      await window.storage.set("manufacturers-v2", JSON.stringify(next), true);
      flash("Saved");
    } catch {
      flash("Save failed — try again");
    }
  }, []);

  const saveManufacturer = useCallback((mid, updater) => {
    setManufacturers((prev) => {
      const next = prev.map((m) =>
        m.id === mid ? { ...m, ...(typeof updater === "function" ? updater(m) : updater) } : m
      );
      manufacturersRef.current = next;
      try {
        writeJson(sharedKey("manufacturers-v2"), next);
        window.storage.set("manufacturers-v2", JSON.stringify(next), true).catch(() => {});
        flash("Saved");
      } catch {
        flash("Save failed — try again");
      }
      return next;
    });
  }, []);

  const themeSaveTimer = React.useRef(null);
  const persistTheme = useCallback((next) => {
    themeRef.current = next;
    // Write immediately so a refresh never loses color/theme edits
    try {
      writeJson(sharedKey("theme-v2"), next);
    } catch {
      /* ignore sync write errors; async path still attempts */
    }
    if (themeSaveTimer.current) clearTimeout(themeSaveTimer.current);
    themeSaveTimer.current = setTimeout(async () => {
      try {
        await window.storage.set("theme-v2", JSON.stringify(next), true);
        flash("Saved");
      } catch {
        flash("Save failed — try again");
      }
    }, 250);
  }, []);

  const saveTheme = useCallback(
    (next) => {
      setTheme(next);
      persistTheme(next);
    },
    [persistTheme]
  );

  const patchSectionField = useCallback(
    (sectionId, key, value) => {
      setTheme((prev) => {
        const current = { ...(prev.sections?.[sectionId] || {}) };
        if (!value && value !== false) delete current[key];
        else current[key] = value;
        const sections = { ...(prev.sections || {}) };
        if (Object.keys(current).length === 0) delete sections[sectionId];
        else sections[sectionId] = current;
        const next = { ...prev, sections };
        persistTheme(next);
        return next;
      });
    },
    [persistTheme]
  );

  const setTextOverride = useCallback(
    (textId, patch) => {
      setTheme((prev) => {
        const nextOverrides = { ...(prev.textOverrides || {}) };
        if (patch === null) delete nextOverrides[textId];
        else nextOverrides[textId] = patch;
        const next = { ...prev, textOverrides: nextOverrides };
        persistTheme(next);
        return next;
      });
    },
    [persistTheme]
  );

  const toggleThemeSectionVisible = useCallback((sectionId, visible) => {
    setTheme((prev) => {
      const next = {
        ...prev,
        sections: {
          ...(prev.sections || {}),
          [sectionId]: { ...(prev.sections?.[sectionId] || {}), visible },
        },
      };
      persistTheme(next);
      return next;
    });
  }, [persistTheme]);

  useEffect(() => {
    if (!isAdmin) setActiveColorSection(null);
  }, [isAdmin]);

  const themeEditValue = useMemo(
    () => ({
      isAdmin,
      theme,
      patchSectionField,
      activeColorSection,
      setActiveColorSection,
    }),
    [isAdmin, theme, patchSectionField, activeColorSection]
  );

  const activeManufacturer = manufacturers.find((m) => m.id === activeManufacturerId) || null;

  const items = useMemo(() => {
    const out = [];
    for (const [key, qty] of Object.entries(cart)) {
      const [mid, pid] = key.split("::");
      const m = manufacturers.find((x) => x.id === mid);
      const p = m && m.products.find((x) => x.id === pid);
      if (m && p) out.push({ ...p, id: key, manufacturerId: mid, manufacturerName: m.name, qty });
    }
    return out;
  }, [cart, manufacturers]);

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 999 ? 0 : 60;
  const total = subtotal + shipping;
  const cartCount = items.reduce((sum, it) => sum + it.qty, 0);

  function addToCart(mid, pid) {
    setCart((c) => {
      const key = `${mid}::${pid}`;
      return { ...c, [key]: (c[key] || 0) + 1 };
    });
  }

  function setQty(mid, pid, qty) {
    setCart((c) => {
      const key = `${mid}::${pid}`;
      const next = { ...c };
      if (qty <= 0) delete next[key];
      else next[key] = qty;
      return next;
    });
  }

  function setQtyByKey(key, qty) {
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[key];
      else next[key] = qty;
      return next;
    });
  }

  function placeOrder(payload) {
    const enriched = enrichOrder({
      ...payload,
      accountEmail: account?.email || payload.email || "",
      accountName: account?.name || payload.name || "",
      email: account?.email || payload.email || "",
    });
    setOrder(enriched);
    setOrders((prev) => {
      const next = [enriched, ...prev.filter((o) => o.id !== enriched.id)].map(refreshOrderStatus);
      writeJson(sharedKey("orders-v1"), next);
      window.storage.set("orders-v1", JSON.stringify(next), true).catch(() => {});
      return next;
    });
    setCart({});
    setView("confirmed");
  }

  const saveAccountProfile = useCallback((next) => {
    const cleaned = {
      name: String(next?.name || "").trim(),
      email: String(next?.email || "").trim(),
      imageUrl: next?.imageUrl || account?.imageUrl || "",
      clerkUserId: next?.clerkUserId || account?.clerkUserId || "",
    };
    setAccount(cleaned);
    writeJson(localKey("account"), cleaned);
    flash("Account saved");
  }, [account]);

  const signInLocal = useCallback((name, email) => {
    const next = { name, email, imageUrl: "", clerkUserId: "" };
    setAccount(next);
    writeJson(localKey("account"), next);
    flash("Signed in");
  }, []);

  const signOutLocal = useCallback(() => {
    setAccount(null);
    writeJson(localKey("account"), null);
    try {
      localStorage.removeItem(localKey("account"));
    } catch {
      /* ignore */
    }
    flash("Signed out");
  }, []);

  function saveProduct(p) {
    if (!activeManufacturer) return;
    const exists = activeManufacturer.products.some((x) => x.id === p.id);
    const nextProducts = exists
      ? activeManufacturer.products.map((x) => (x.id === p.id ? p : x))
      : [...activeManufacturer.products, p];
    saveManufacturer(activeManufacturer.id, { products: nextProducts });
    setEditingProduct(null);
  }

  function deleteProduct(productOrId) {
    if (!activeManufacturer) return;
    const id = typeof productOrId === "string" ? productOrId : productOrId?.id;
    if (!id) return;
    if (!window.confirm || confirm("Remove this product from the shop?")) {
      saveManufacturer(activeManufacturer.id, {
        products: activeManufacturer.products.filter((p) => p.id !== id),
      });
    }
  }

  function saveManufacturerEntry(m) {
    const exists = manufacturers.some((x) => x.id === m.id);
    const next = exists
      ? manufacturers.map((x) => (x.id === m.id ? { ...x, ...m } : x))
      : [...manufacturers, m];
    saveManufacturers(next);
    setEditingManufacturer(null);
  }

  function approveManufacturer(mid) {
    if (!isOwner) return;
    saveManufacturer(mid, { status: "approved" });
  }

  function denyManufacturer(mid) {
    if (!isOwner) return;
    saveManufacturer(mid, { status: "rejected" });
  }

  function tryOwnerLogin(pass) {
    if (String(pass || "").trim() === OWNER_PASSCODE) {
      setIsOwner(true);
      setShowOwnerLogin(false);
      setOwnerLoginError("");
    } else setOwnerLoginError("Wrong passcode. Try again.");
  }

  const onClerkAccount = useCallback((next) => {
    if (!next) {
      // Keep local profile if Clerk signed out but user had a local email — clear clerk id only
      setAccount((prev) => {
        if (!prev) return null;
        if (prev.clerkUserId) {
          const cleared = { ...prev, clerkUserId: "" };
          writeJson(localKey("account"), cleared);
          return cleared;
        }
        return prev;
      });
      return;
    }
    setAccount(next);
    writeJson(localKey("account"), next);
  }, []);

  function goToManufacturer(mid) {
    setActiveManufacturerId(mid);
    setMfgTab("order");
    setView("manufacturer");
  }

  function updateManufacturerById(midOrObj, maybeNext) {
    if (typeof midOrObj === "string") {
      saveManufacturer(midOrObj, maybeNext);
      return;
    }
    if (midOrObj?.id) saveManufacturer(midOrObj.id, midOrObj);
  }

  function toggleManufacturerSection(sectionId, visible) {
    if (!activeManufacturer) return;
    const key = sectionId.replace(/^mfg/, "").replace(/^(.)/, (c) => c.toLowerCase());
    const mapped = {
      mfgStory: "story",
      mfgMission: "mission",
      mfgValues: "values",
      mfgPractices: "practices",
      mfgCert: "certifications",
      mfgContact: "contact",
    }[sectionId] || key;
    saveManufacturer(activeManufacturer.id, {
      sections: { ...(activeManufacturer.sections || {}), [mapped]: visible },
    });
  }

  const mfgThemeForSections = useMemo(() => {
    if (!activeManufacturer) return theme;
    const sections = { ...(theme.sections || {}) };
    const map = {
      mfgStory: "story",
      mfgMission: "mission",
      mfgValues: "values",
      mfgPractices: "practices",
      mfgCert: "certifications",
      mfgContact: "contact",
    };
    for (const [themeKey, mfgKey] of Object.entries(map)) {
      const flag = activeManufacturer.sections?.[mfgKey];
      if (flag === false) sections[themeKey] = { ...(sections[themeKey] || {}), visible: false };
      else if (flag === true) sections[themeKey] = { ...(sections[themeKey] || {}), visible: true };
    }
    return { ...theme, sections };
  }, [activeManufacturer, theme]);

  if (!loaded) {
    return (
      <div style={{ ...s.app, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&display=swap');`}</style>
        <div style={{ fontFamily: "var(--font-display)", color: "var(--muted)" }}>Loading the marketplace…</div>
      </div>
    );
  }

  const dFont = findFont("display", theme.fonts.display);
  const bFont = findFont("body", theme.fonts.body);
  const mFont = findFont("mono", theme.fonts.mono);
  const sectionFontIds = SECTION_DEFS.map((sec) => sectionValue(theme, sec.id, "font"));
  const googleFontsUrl = buildGoogleFontsUrl(theme.fonts, sectionFontIds);
  const sectionCssVars = SECTION_DEFS.map((sec) => {
    const bg = sectionValue(theme, sec.id, "bg");
    const box = sectionValue(theme, sec.id, "box");
    const text = sectionValue(theme, sec.id, "text");
    const fontId = sectionValue(theme, sec.id, "font");
    let out = "";
    if (bg) out += `--${sec.id}-bg: ${bg};\n`;
    if (box) out += `--${sec.id}-box: ${box};\n`;
    if (text) out += `--${sec.id}-text: ${text};\n`;
    if (fontId) out += `--${sec.id}-font: '${findFont("display", fontId).family}', serif;\n`;
    return out;
  }).join("");

  return (
    <TextStyleContext.Provider value={{ overrides: theme.textOverrides || {}, setOverride: setTextOverride }}>
      <ThemeEditProvider value={themeEditValue}>
      <div style={s.app} className="aa-app-root">
        <style>{`
        @import url('${googleFontsUrl}');
        :root {
          --paper: ${theme.colors.paper};
          --paper-alt: color-mix(in srgb, var(--paper) 92%, var(--ink) 8%);
          --ink: ${theme.colors.ink};
          --ink-soft: color-mix(in srgb, var(--ink) 88%, var(--paper) 12%);
          --accent: ${theme.colors.accent};
          --accent2: ${theme.colors.accent2};
          --accent2-tint: color-mix(in srgb, var(--accent2) 18%, var(--paper) 82%);
          --danger: ${theme.colors.danger};
          --border: color-mix(in srgb, var(--ink) 16%, var(--paper) 84%);
          --muted: color-mix(in srgb, var(--ink) 68%, var(--paper) 32%);
          --muted-light: color-mix(in srgb, var(--ink) 78%, var(--paper) 22%);
          --divider: color-mix(in srgb, var(--ink) 12%, var(--paper) 88%);
          --surface: color-mix(in srgb, var(--paper) 88%, black 12%);
          --font-display: '${dFont.family}', serif;
          --font-display-style: ${dFont.style};
          --font-body: '${bFont.family}', sans-serif;
          --font-mono: '${mFont.family}', monospace;
          ${sectionCssVars}
        }
        * { box-sizing: border-box; }
        ::selection { background: color-mix(in srgb, var(--accent) 35%, transparent); }
        body, .aa-app-root { font-family: var(--font-body); background: var(--paper); color: var(--ink); }
        .aa-app-root {
          background-image:
            radial-gradient(ellipse 900px 480px at 12% -8%, color-mix(in srgb, var(--accent2) 22%, transparent), transparent 70%),
            radial-gradient(ellipse 700px 420px at 88% 8%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 65%),
            linear-gradient(180deg, color-mix(in srgb, var(--paper) 92%, black 8%) 0%, var(--paper) 38%, var(--paper) 100%);
          background-attachment: fixed;
        }
        .aa-btn { transition: transform .15s ease, box-shadow .15s ease, background .15s ease; }
        .aa-btn:hover { transform: translateY(-1px); }
        .aa-btn:active { transform: translateY(0); }
        .aa-card { transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease; position: relative; }
        .aa-card:hover { transform: translateY(-3px); box-shadow: 0 14px 32px color-mix(in srgb, black 28%, transparent); border-color: color-mix(in srgb, var(--accent) 35%, var(--border)); }
        input:focus, textarea:focus, select:focus { outline: 2px solid var(--accent2); outline-offset: 1px; }
        button:focus-visible { outline: 2px solid var(--accent2); outline-offset: 2px; }
        .aa-editable { border: 1px dashed color-mix(in srgb, var(--accent) 55%, transparent); border-radius: 8px; background: color-mix(in srgb, var(--accent) 10%, transparent); }
        input[type="color"] { -webkit-appearance: none; appearance: none; border: none; padding: 0; width: 44px; height: 34px; border-radius: 8px; cursor: pointer; background: none; }
        input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type="color"]::-webkit-color-swatch { border: 1px solid var(--border); border-radius: 8px; }
        @media (prefers-reduced-motion: reduce) { .aa-btn, .aa-card { transition: none !important; } }
        @media (max-width: 760px) {
          .aa-checkout-grid { grid-template-columns: 1fr !important; }
          .aa-form-row { grid-template-columns: 1fr !important; }
          .aa-footer-grid { grid-template-columns: 1fr !important; gap: 26px !important; }
          .aa-summary-card { position: static !important; }
          .aa-hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

        {savedFlash && <div style={s.flash}>{savedFlash}</div>}

        <SectionColorAnchor sectionId="header" as="header" style={s.header}>
          <div style={s.headerInner}>
            <div
              style={s.logoWrap}
              role="button"
              tabIndex={0}
              onClick={() => setView("home")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setView("home");
              }}
              aria-label="Home"
            >
              <span style={s.logoMark}>
                <img
                  src={site.headerLogo || LOGO_SRC}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
                {isAdmin && (
                  <label style={s.logoEditBadge} onClick={(e) => e.stopPropagation()} title="Change logo">
                    📷
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        const file = e.target.files && e.target.files[0];
                        e.target.value = "";
                        if (file && file.type.startsWith("image/")) setLogoCropSource(file);
                      }}
                    />
                  </label>
                )}
              </span>
              <span>
                <div style={s.headerBrandTitle}>
                  <EditableText
                    id="txt1"
                    isAdmin={isAdmin}
                    value={site.title}
                    onSave={(v) => saveSite({ ...site, title: v })}
                    textStyle={s.headerBrandTitle}
                  />
                </div>
                <div style={s.logoSub}>{site.tagline}</div>
              </span>
            </div>

            <nav style={s.nav}>
              <button
                className="aa-btn"
                style={view === "home" ? s.navLinkActive : s.navLink}
                onClick={() => setView("home")}
              >
                <EditableText
                  id="txt2"
                  isAdmin={isAdmin}
                  value={site.copy.navHome}
                  onSave={(v) => updateCopy("navHome", v)}
                  textStyle={{ color: "inherit", fontFamily: "inherit", fontSize: "inherit" }}
                />
              </button>
              <button
                className="aa-btn"
                style={view === "directory" || view === "manufacturer" ? s.navLinkActive : s.navLink}
                onClick={() => setView("directory")}
              >
                <EditableText
                  id="txt3"
                  isAdmin={isAdmin}
                  value={site.copy.navManufacturers}
                  onSave={(v) => updateCopy("navManufacturers", v)}
                  textStyle={{ color: "inherit", fontFamily: "inherit", fontSize: "inherit" }}
                />
              </button>
              <button
                className="aa-btn"
                style={view === "mission" ? s.navLinkActive : s.navLink}
                onClick={() => setView("mission")}
              >
                <EditableText
                  id="txt4"
                  isAdmin={isAdmin}
                  value={site.copy.navMission}
                  onSave={(v) => updateCopy("navMission", v)}
                  textStyle={{ color: "inherit", fontFamily: "inherit", fontSize: "inherit" }}
                />
              </button>
              <button
                className="aa-btn"
                style={view === "getstarted" ? s.navLinkActive : s.navLink}
                onClick={() => setView("getstarted")}
              >
                <EditableText
                  id="txt5"
                  isAdmin={isAdmin}
                  value={site.copy.navGetStarted}
                  onSave={(v) => updateCopy("navGetStarted", v)}
                  textStyle={{ color: "inherit", fontFamily: "inherit", fontSize: "inherit" }}
                />
              </button>
              {isAdmin && (
                <button className="aa-btn" style={s.navLink} onClick={() => setShowTheme(true)}>
                  🎨 Theme
                </button>
              )}
              {isAdmin &&
                (isOwner ? (
                  <span style={s.ownerBadge}>
                    👑 Owner
                    <button style={s.adminExit} onClick={() => setIsOwner(false)}>
                      Exit
                    </button>
                  </span>
                ) : (
                  <button className="aa-btn" style={s.navLink} onClick={() => setShowOwnerLogin(true)}>
                    🔑 Owner Login
                  </button>
                ))}
              {isAdmin ? (
                <span style={s.adminBadge}>
                  Editing mode · auto-saves
                  <button
                    style={s.adminExit}
                    onClick={() => {
                      flushAllPersistence();
                      setIsAdmin(false);
                      setIsOwner(false);
                    }}
                  >
                    Exit
                  </button>
                </span>
              ) : (
                <button className="aa-btn" style={s.navLink} onClick={() => setIsAdmin(true)}>
                  ✏️ Edit Mode
                </button>
              )}
            </nav>

            {clerkEnabled ? (
              <>
                <ClerkAccountSync onAccount={onClerkAccount} />
                <ClerkAccountControls />
              </>
            ) : (
              <ClerkMissingKeyControls onOpenHelp={() => setShowClerkHelp(true)} />
            )}

            <button
              className="aa-btn"
              style={{ ...s.navLink, position: "relative" }}
              onClick={() => setShowSettings(true)}
              aria-label="Settings"
              title="Settings"
            >
              Settings
              {account ? <span style={s.accountDot} aria-hidden="true" /> : null}
            </button>

            <button
              className="aa-btn"
              style={s.cartBtn}
              onClick={() => setCartOpen(true)}
              aria-label={`Cart, ${cartCount} items`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--paper)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1.4" />
                <circle cx="18" cy="21" r="1.4" />
                <path d="M2.5 3h2l2.6 12.6a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 7H6" />
              </svg>
              <span style={s.cartCount}>{cartCount}</span>
            </button>
          </div>
        </SectionColorAnchor>

        {view === "home" && (
          <MarketplaceHome marketplace={site} isAdmin={isAdmin} onUpdateMarketplace={saveSite} />
        )}

        {view === "directory" && (
          <ManufacturerDirectory
            marketplace={site}
            manufacturers={manufacturers}
            isAdmin={isAdmin}
            isOwner={isOwner}
            onAddManufacturer={() => setEditingManufacturer("new")}
            onVisit={goToManufacturer}
            onApprove={approveManufacturer}
            onDeny={denyManufacturer}
            onUpdateManufacturer={updateManufacturerById}
            onUpdateMarketplace={saveSite}
          />
        )}

        {view === "mission" && (
          <MissionPage
            marketplace={site}
            theme={theme}
            isAdmin={isAdmin}
            onUpdateMarketplace={saveSite}
            onToggleSectionVisible={toggleThemeSectionVisible}
          />
        )}

        {view === "getstarted" && (
          <GetStartedPage
            marketplace={site}
            isAdmin={isAdmin}
            onUpdateMarketplace={saveSite}
            onBrowseManufacturers={() => setView("directory")}
            onAddManufacturer={() => {
              setIsAdmin(true);
              setView("directory");
              setEditingManufacturer("new");
            }}
          />
        )}

        {view === "manufacturer" && activeManufacturer && (
          <ManufacturerPage
            manufacturer={activeManufacturer}
            marketplace={site}
            theme={mfgThemeForSections}
            isAdmin={isAdmin}
            isOwner={isOwner}
            tab={mfgTab}
            onTabChange={setMfgTab}
            onBack={() => setView("directory")}
            onApprove={approveManufacturer}
            onDeny={denyManufacturer}
            onUpdateManufacturer={(next) => saveManufacturer(activeManufacturer.id, next)}
            onToggleSectionVisible={toggleManufacturerSection}
            cart={cart}
            onAddToCart={(pid) => addToCart(activeManufacturer.id, pid)}
            onSetCartQty={(pid, qty) => setQty(activeManufacturer.id, pid, qty)}
            onAddProduct={() => setEditingProduct("new")}
            onEditProduct={(p) => setEditingProduct(p)}
            onDeleteProduct={deleteProduct}
            onEditCopy={updateCopy}
          />
        )}

        {view === "checkout" && (
          <Checkout
            marketplace={site}
            cartItems={items}
            account={account}
            onBack={() => setView(activeManufacturerId ? "manufacturer" : "directory")}
            onPlaceOrder={placeOrder}
          />
        )}

        {view === "confirmed" && order && (
          <Confirmation order={order} marketplace={site} onContinue={() => setView("home")} />
        )}

        {cartOpen && (
          <>
            <div style={s.overlay} onClick={() => setCartOpen(false)} />
            <SectionColorAnchor sectionId="drawer" as="aside" style={s.drawer} aria-label="Shopping cart" corner="top-left">
              <div style={s.drawerHead}>
                <h2 style={s.cartDrawerTitle}>
                  <EditableText
                    id="txt6"
                    isAdmin={isAdmin}
                    value={site.copy.cartTitle}
                    onSave={(v) => updateCopy("cartTitle", v)}
                    textStyle={s.cartDrawerTitle}
                  />
                </h2>
                <button style={s.iconBtn} onClick={() => setCartOpen(false)} aria-label="Close cart">
                  ✕
                </button>
              </div>
              {items.length === 0 ? (
                <div style={s.emptyCart}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>🌾</div>
                  <EditableText
                    id="txt7"
                    isAdmin={isAdmin}
                    value={site.copy.emptyCartText}
                    onSave={(v) => updateCopy("emptyCartText", v)}
                    textStyle={{ margin: 0, fontFamily: "var(--font-body)", color: "var(--muted)" }}
                  />
                </div>
              ) : (
                <div style={s.drawerItems}>
                  {items.map((it) => (
                    <div key={it.id} style={s.drawerItem}>
                      <div style={{ ...s.miniIcon, color: "var(--accent2)" }}>
                        {it.image ? (
                          <img
                            src={it.image}
                            alt=""
                            style={{ width: 34, height: 34, borderRadius: 6, objectFit: "cover" }}
                          />
                        ) : (
                          <Icon name={it.icon} size={22} />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={s.drawerItemName}>{it.name}</div>
                        <div style={s.drawerItemUnit}>
                          {it.unit} · <span style={{ color: "var(--accent2)" }}>{it.manufacturerName}</span>
                        </div>
                        <div style={s.qtyRow}>
                          <button
                            style={s.qtyBtn}
                            onClick={() => setQtyByKey(it.id, it.qty - 1)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span style={s.qtyVal}>{it.qty}</span>
                          <button
                            style={s.qtyBtn}
                            onClick={() => setQtyByKey(it.id, it.qty + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                          <button style={s.removeBtn} onClick={() => setQtyByKey(it.id, 0)}>
                            <EditableText
                              id="txt8"
                              isAdmin={isAdmin}
                              value={site.copy.removeLabel}
                              onSave={(v) => updateCopy("removeLabel", v)}
                              textStyle={{ color: "inherit", fontFamily: "inherit", fontSize: "inherit" }}
                            />
                          </button>
                        </div>
                      </div>
                      <div style={s.drawerItemPrice}>{rupee(it.price * it.qty)}</div>
                    </div>
                  ))}
                </div>
              )}
              {items.length > 0 && (
                <div style={s.drawerFoot}>
                  <div style={s.sumRow}>
                    <EditableText
                      id="txt9"
                      isAdmin={isAdmin}
                      value={site.copy.subtotalLabel}
                      onSave={(v) => updateCopy("subtotalLabel", v)}
                      textStyle={{}}
                    />
                    <span>{rupee(subtotal)}</span>
                  </div>
                  <div style={s.sumRow}>
                    <EditableText
                      id="txt10"
                      isAdmin={isAdmin}
                      value={site.copy.deliveryLabel}
                      onSave={(v) => updateCopy("deliveryLabel", v)}
                      textStyle={{}}
                    />
                    <span>{shipping === 0 ? site.copy.freeLabel : rupee(shipping)}</span>
                  </div>
                  <div style={{ ...s.sumRow, ...s.sumTotal }}>
                    <EditableText
                      id="txt11"
                      isAdmin={isAdmin}
                      value={site.copy.totalLabel}
                      onSave={(v) => updateCopy("totalLabel", v)}
                      textStyle={{}}
                    />
                    <span>{rupee(total)}</span>
                  </div>
                  <button
                    className="aa-btn"
                    style={s.checkoutBtn}
                    onClick={() => {
                      setCartOpen(false);
                      setView("checkout");
                    }}
                  >
                    <EditableText
                      id="txt12"
                      isAdmin={isAdmin}
                      value={site.copy.proceedCheckoutLabel}
                      onSave={(v) => updateCopy("proceedCheckoutLabel", v)}
                      textStyle={{ color: "inherit", fontFamily: "inherit", fontSize: "inherit" }}
                    />
                  </button>
                </div>
              )}
            </SectionColorAnchor>
          </>
        )}

        {showTheme && <ThemeModal theme={theme} onSave={saveTheme} onClose={() => setShowTheme(false)} />}

        {logoCropSource && (
          <Modal onClose={() => setLogoCropSource(null)} title="Adjust logo">
            <ImageCropper
              source={logoCropSource}
              aspect={1}
              onCancel={() => setLogoCropSource(null)}
              onConfirm={(dataUrl) => {
                saveSite({ ...site, headerLogo: dataUrl });
                setLogoCropSource(null);
              }}
            />
          </Modal>
        )}

        {showOwnerLogin && (
          <OwnerLoginModal
            onClose={() => {
              setShowOwnerLogin(false);
              setOwnerLoginError("");
            }}
            onSubmit={tryOwnerLogin}
            error={ownerLoginError}
          />
        )}

        {!clerkEnabled && showClerkHelp && <ClerkSetupHelpModal onClose={() => setShowClerkHelp(false)} />}

        {showSettings && (
          <SettingsModal
            clerkEnabled={clerkEnabled}
            account={account}
            orders={orders.filter((o) => {
              if (!account?.email) return true;
              const email = (o.accountEmail || o.email || "").toLowerCase();
              return !email || email === account.email.toLowerCase();
            })}
            onSignIn={signInLocal}
            onSignOut={clerkEnabled ? undefined : signOutLocal}
            onSaveProfile={saveAccountProfile}
            onClose={() => setShowSettings(false)}
          />
        )}

        {editingProduct && activeManufacturer && (
          <ProductEditModal
            product={
              editingProduct === "new"
                ? {
                    id: uid(),
                    name: "",
                    cat: (activeManufacturer.products[0] || {}).cat || "Grains",
                    unit: "",
                    price: 0,
                    icon: "leaf",
                    image: "",
                    note: "",
                    featured: false,
                  }
                : editingProduct
            }
            categories={Array.from(new Set(activeManufacturer.products.map((p) => p.cat)))}
            onCancel={() => setEditingProduct(null)}
            onSave={saveProduct}
          />
        )}

        {editingManufacturer && (
          <ManufacturerEditModal
            manufacturer={
              editingManufacturer === "new"
                ? {
                    id: manufacturerId(),
                    status: "pending",
                    name: "",
                    tagline: "",
                    logo: "",
                    coverPhoto: "",
                    coverCaption: "",
                    story: "",
                    mission: "",
                    values: [],
                    practicesIntro: "",
                    practicesPoints: [],
                    certIntro: "",
                    certBadges: [],
                    contactEmail: "",
                    contactPhone: "",
                    contactAddress: "",
                    deliveryInfo: "",
                    products: [],
                    customTextSections: [],
                  }
                : editingManufacturer
            }
            onCancel={() => setEditingManufacturer(null)}
            onSave={saveManufacturerEntry}
          />
        )}

        <SectionColorAnchor sectionId="footer" as="footer" style={s.footer}>
          <div className="aa-footer-grid" style={s.footerInner}>
            <div>
              <div style={s.logoTitle}>{site.title}</div>
              <EditableText
                id="txt13"
                isAdmin={isAdmin}
                value={site.footerText}
                multiline
                onSave={(v) => saveSite({ ...site, footerText: v })}
                textStyle={s.footerText}
              />
            </div>
            <div>
              <div style={s.footerHead}>
                <EditableText
                  id="txt14"
                  isAdmin={isAdmin}
                  value={site.copy.footerContactHeading}
                  onSave={(v) => updateCopy("footerContactHeading", v)}
                  textStyle={s.footerHead}
                />
              </div>
              <EditableText
                id="txt15"
                isAdmin={isAdmin}
                value={site.contactEmail}
                onSave={(v) => saveSite({ ...site, contactEmail: v })}
                textStyle={s.footerText}
              />
              <EditableText
                id="txt16"
                isAdmin={isAdmin}
                value={site.contactPhone}
                onSave={(v) => saveSite({ ...site, contactPhone: v })}
                textStyle={s.footerText}
              />
            </div>
            <div>
              <div style={s.footerHead}>
                <EditableText
                  id="txt17"
                  isAdmin={isAdmin}
                  value={site.copy.footerDeliveryHeading}
                  onSave={(v) => updateCopy("footerDeliveryHeading", v)}
                  textStyle={s.footerHead}
                />
              </div>
              <EditableText
                id="txt18"
                isAdmin={isAdmin}
                value={site.footerText}
                multiline
                onSave={(v) => saveSite({ ...site, footerText: v })}
                textStyle={s.footerText}
              />
            </div>
          </div>
          <div style={s.footerBar}>
            © {new Date().getFullYear()} {site.title}.{" "}
            <EditableText
              id="txt19"
              isAdmin={isAdmin}
              value={site.copy.footerBottomText}
              onSave={(v) => updateCopy("footerBottomText", v)}
              textStyle={s.footerBar}
            />
          </div>
        </SectionColorAnchor>
      </div>
      </ThemeEditProvider>
    </TextStyleContext.Provider>
  );
}
