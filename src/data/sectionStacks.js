import { uid } from "./defaults";

export function customSectionId() {
  return "cts_" + uid().replace(/^p_/, "");
}

export const PAGE_BUILTIN_SECTIONS = {
  home: [],
  directory: [],
  mission: [
    { id: "missionBody", label: "Mission body" },
    { id: "missionPoints", label: "Mission points" },
  ],
  getstarted: [
    { id: "buyerSteps", label: "For buyers" },
    { id: "manufacturerSteps", label: "For manufacturers" },
  ],
  manufacturerStory: [
    { id: "mfgStory", label: "Our Story" },
    { id: "mfgMission", label: "Our mission" },
    { id: "mfgValues", label: "Values" },
    { id: "mfgPractices", label: "How we grow" },
    { id: "mfgCert", label: "Certifications" },
  ],
};

export function defaultStackEntries(pageKey) {
  return (PAGE_BUILTIN_SECTIONS[pageKey] || []).map((sec) => ({
    id: sec.id,
    type: "builtin",
  }));
}

/**
 * Resolve the ordered stack for a page.
 * Migrates older customTextSections-only data into the stack when needed.
 */
export function resolveSectionStack(pageKey, stack, customSections = []) {
  const customs = Array.isArray(customSections) ? customSections : [];
  const customIds = new Set(customs.map((c) => c.id));
  const defaults = defaultStackEntries(pageKey);

  let entries = Array.isArray(stack) ? stack.map((e) => ({ ...e })) : null;

  if (!entries) {
    entries = [...defaults, ...customs.map((c) => ({ id: c.id, type: "custom" }))];
  } else {
    // Keep builtins that still exist in defaults; drop unknown builtins.
    const defaultIds = new Set(defaults.map((d) => d.id));
    entries = entries.filter((e) => {
      if (e.type === "custom") return customIds.has(e.id);
      return defaultIds.has(e.id);
    });
    // Append any new default builtins not yet in the stack (not deleted intentionally).
    // Only auto-append if stack never had them recorded as hidden — hidden tracked separately.
    for (const d of defaults) {
      if (!entries.some((e) => e.id === d.id)) {
        // If hidden list includes it, skip; caller merges hidden.
      }
    }
    // Append custom sections missing from stack
    for (const c of customs) {
      if (!entries.some((e) => e.id === c.id)) {
        entries.push({ id: c.id, type: "custom" });
      }
    }
  }

  return entries;
}

export function builtinLabel(pageKey, id) {
  return (PAGE_BUILTIN_SECTIONS[pageKey] || []).find((s) => s.id === id)?.label || id;
}

export function newCustomSection() {
  return {
    id: customSectionId(),
    heading: "New text section",
    body: "Write your content here. Drag ⋮⋮ to move this block anywhere on the page.",
    bg: "",
    text: "",
  };
}
