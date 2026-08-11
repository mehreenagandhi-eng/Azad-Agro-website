/** Clerk publishable key from Vite env (must start with VITE_). */
export function getClerkPublishableKey() {
  return String(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "").trim();
}

export function isClerkConfigured() {
  return Boolean(getClerkPublishableKey());
}
