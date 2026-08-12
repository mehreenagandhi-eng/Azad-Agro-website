/**
 * Durable browser persistence helpers.
 * Writes go to localStorage immediately so refresh / closed tabs keep edits
 * on the same website link.
 */

const SHARED_PREFIX = "azadagro:shared:";
const LOCAL_PREFIX = "azadagro:local:";
const BACKUP_BUNDLE_KEY = SHARED_PREFIX + "backup-bundle-v1";

const pendingTextCommits = new Map();
let themeFlush = null;
let siteFlush = null;
let manufacturersFlush = null;
let bundleFlush = null;

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
  try {
    localStorage.setItem(storageKey, JSON.stringify(value));
  } catch (err) {
    console.warn("Could not save to localStorage", storageKey, err);
    throw err;
  }
}

/** Extra full-site snapshot so a single key can restore after refresh. */
export function writeBackupBundle(bundle) {
  try {
    localStorage.setItem(BACKUP_BUNDLE_KEY, JSON.stringify(bundle));
  } catch (err) {
    console.warn("Could not write backup bundle", err);
  }
}

export function readBackupBundle() {
  return readJson(BACKUP_BUNDLE_KEY, null);
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

export function setBundleFlush(fn) {
  bundleFlush = fn;
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
  try {
    bundleFlush?.();
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
  window.addEventListener("freeze", flush);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
  // Catch half-typed edits even if the tab is closed mid-debounce.
  window.setInterval(flush, 2000);
}

export function mergeSite(defaults, saved) {
  if (!saved || typeof saved !== "object") {
    return {
      ...defaults,
      copy: { ...defaults.copy },
      customTextSections: { ...(defaults.customTextSections || {}) },
      sectionStacks: { ...(defaults.sectionStacks || {}) },
      hiddenBuiltins: { ...(defaults.hiddenBuiltins || {}) },
    };
  }
  return {
    ...defaults,
    ...saved,
    copy: { ...(defaults.copy || {}), ...(saved.copy || {}) },
    customTextSections: {
      ...(defaults.customTextSections || {}),
      ...(saved.customTextSections || {}),
    },
    sectionStacks: {
      ...(defaults.sectionStacks || {}),
      ...(saved.sectionStacks || {}),
    },
    hiddenBuiltins: {
      ...(defaults.hiddenBuiltins || {}),
      ...(saved.hiddenBuiltins || {}),
    },
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
