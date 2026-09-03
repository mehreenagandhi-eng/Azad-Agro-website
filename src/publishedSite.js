/**
 * Load permanently published website content from /published-site.json.
 * This is what makes a stable link always show the same writing/colors,
 * even in a new browser or after the tab is closed.
 */

export async function loadPublishedSite() {
  try {
    const base = import.meta.env.BASE_URL || "/";
    const url = `${base}published-site.json?t=${Date.now()}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || typeof data !== "object") return null;
    return data;
  } catch {
    return null;
  }
}

export function publishedHasContent(data) {
  if (!data || typeof data !== "object") return false;
  return Boolean(data.site || data.theme || (Array.isArray(data.manufacturers) && data.manufacturers.length));
}
