/**
 * Durable browser persistence helpers.
 * Writes go to localStorage immediately so refresh keeps text + theme edits.
 */

const SHARED_PREFIX = "azadagro:shared:";
const LOCAL_PREFIX = "azadagro:local:";

const pendingTextCommits = new Map();
let themeFlush = null;
let siteFlush = null;
let manufacturersFlush = null;

export function sharedKey(key) {
  return SHARED_PREFIX + key;
}

export function localKey(key) {
  return LOCAL_PREFIX + key;
}

export function readJson(storageKey, fallback) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJson(storageKey, value) {
  localStorage.setItem(storageKey, JSON.stringify(value));
}

export function registerPendingTextCommit(id, commitFn) {
  if (!id) return;
  pendingTextCommits.set(id, commitFn);
}

export function clearPendingTextCommit(id) {
  if (!id) return;
  pendingTextCommits.delete(id);
}

export function flushPendingTextCommits() {
  const fns = [...pendingTextCommits.values()];
  pendingTextCommits.clear();
  for (const fn of fns) {
    try {
      fn();
    } catch {
      /* ignore */
    }
  }
}

export function setThemeFlush(fn) {
  themeFlush = fn;
}

export function setSiteFlush(fn) {
  siteFlush = fn;
}

export function setManufacturersFlush(fn) {
  manufacturersFlush = fn;
}

export function flushAllPersistence() {
  flushPendingTextCommits();
  try {
    themeFlush?.();
  } catch {
    /* ignore */
  }
  try {
    siteFlush?.();
  } catch {
    /* ignore */
  }
  try {
    manufacturersFlush?.();
  } catch {
    /* ignore */
  }
}

let listenersBound = false;
export function bindPersistenceLifecycle() {
  if (typeof window === "undefined" || listenersBound) return;
  listenersBound = true;
  const flush = () => flushAllPersistence();
  window.addEventListener("pagehide", flush);
  window.addEventListener("beforeunload", flush);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
}

export function mergeSite(defaults, saved) {
  if (!saved || typeof saved !== "object") return { ...defaults, copy: { ...defaults.copy } };
  return {
    ...defaults,
    ...saved,
    copy: { ...(defaults.copy || {}), ...(saved.copy || {}) },
  };
}

export function mergeTheme(defaults, saved) {
  if (!saved || typeof saved !== "object") {
    return {
      ...defaults,
      colors: { ...defaults.colors },
      fonts: { ...defaults.fonts },
      sections: {},
      textOverrides: {},
    };
  }
  return {
    ...defaults,
    ...saved,
    colors: { ...(defaults.colors || {}), ...(saved.colors || {}) },
    fonts: { ...(defaults.fonts || {}), ...(saved.fonts || {}) },
    sections: { ...(saved.sections || {}) },
    textOverrides: { ...(saved.textOverrides || {}) },
  };
}

export function exportMarketplaceBackup({ site, theme, manufacturers }) {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    site,
    theme,
    manufacturers,
  };
}

export function downloadBackup(payload, filename = "indias-organic-marketplace-backup.json") {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
