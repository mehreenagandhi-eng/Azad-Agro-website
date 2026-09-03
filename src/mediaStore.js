/**
 * IndexedDB media store for uploaded photos.
 * Keeps large images out of localStorage so refresh still restores edits.
 */

const DB_NAME = "azadagro-media-v1";
const STORE = "photos";
const DB_VERSION = 1;

function openDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("IndexedDB open failed"));
  });
}

export function isMediaRef(value) {
  return typeof value === "string" && value.startsWith("media:");
}

export function mediaIdFromRef(ref) {
  return isMediaRef(ref) ? ref.slice("media:".length) : null;
}

export async function putMedia(id, dataUrl) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(dataUrl, id);
    tx.oncomplete = () => resolve(id);
    tx.onerror = () => reject(tx.error || new Error("putMedia failed"));
  });
}

export async function getMedia(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error || new Error("getMedia failed"));
  });
}

export async function deleteMedia(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error("deleteMedia failed"));
  });
}

/** Resolve a data URL or media:id ref into a displayable URL. */
export async function resolvePhotoSrc(ref) {
  if (!ref) return "";
  if (!isMediaRef(ref)) return ref;
  const id = mediaIdFromRef(ref);
  if (!id) return "";
  try {
    return (await getMedia(id)) || "";
  } catch {
    return "";
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Compress a data URL for durable storage. */
export async function compressDataUrl(dataUrl, { maxWidth = 1600, quality = 0.72 } = {}) {
  if (!dataUrl || typeof dataUrl !== "string") return dataUrl;
  try {
    const img = await loadImage(dataUrl);
    const scale = Math.min(1, maxWidth / Math.max(img.naturalWidth || img.width, 1));
    const w = Math.max(1, Math.round((img.naturalWidth || img.width) * scale));
    const h = Math.max(1, Math.round((img.naturalHeight || img.height) * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", quality);
  } catch {
    return dataUrl;
  }
}

/**
 * Store photo in IndexedDB and return a compact media: ref for site JSON.
 * Falls back to compressed data URL if IDB fails.
 */
export async function persistPhoto(dataUrl, existingRef = "") {
  if (!dataUrl) {
    const oldId = mediaIdFromRef(existingRef);
    if (oldId) {
      try {
        await deleteMedia(oldId);
      } catch {
        /* ignore */
      }
    }
    return "";
  }
  const compressed = await compressDataUrl(dataUrl);
  const id = mediaIdFromRef(existingRef) || `ph_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  try {
    await putMedia(id, compressed);
    return `media:${id}`;
  } catch {
    return compressed;
  }
}
