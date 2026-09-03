/**
 * Shared-storage shim for the seed app.
 * Mirrors the window.storage API used by the original prototype:
 *   get(key, shared?) -> { value }
 *   set(key, value, shared?)
 *   delete(key, shared?)
 *
 * Shared keys use localStorage under a namespace so edits persist for visitors
 * in the same browser. Account data uses a separate local namespace.
 */

const SHARED_PREFIX = "azadagro:shared:";
const LOCAL_PREFIX = "azadagro:local:";

function storageKey(key, shared) {
  return (shared ? SHARED_PREFIX : LOCAL_PREFIX) + key;
}

if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    async get(key, shared = false) {
      const raw = localStorage.getItem(storageKey(key, shared));
      if (raw == null) throw new Error("not found");
      return { key, value: raw };
    },
    async set(key, value, shared = false) {
      localStorage.setItem(storageKey(key, shared), String(value));
      return { key };
    },
    async delete(key, shared = false) {
      localStorage.removeItem(storageKey(key, shared));
      return { key };
    },
  };
}
