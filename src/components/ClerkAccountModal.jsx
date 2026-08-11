import React from "react";
import { Show, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/react";
import { s } from "../styles";
import { Modal } from "./Modal";

export function ClerkAccountModal({ onClose }) {
  const { isLoaded, isSignedIn, user } = useUser();

  const name =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "Signed in";
  const email = user?.primaryEmailAddress?.emailAddress || "";

  return (
    <Modal title="Account" onClose={onClose}>
      {!isLoaded ? (
        <p style={{ margin: 0, color: "var(--muted)" }}>Loading account…</p>
      ) : isSignedIn ? (
        <>
          <div style={s.clerkAccountRow}>
            <UserButton afterSignOutUrl="/" />
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600 }}>{name}</p>
              <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>{email}</p>
            </div>
          </div>
          <p style={{ margin: "16px 0 0", color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
            You&apos;re signed in with Clerk. Manage your Google-linked or email account from the avatar menu.
            Checkout will use this name and email when available.
          </p>
          <div style={{ marginTop: 16, displayContent: "flex-end" }}>
            <button type="button" style={s.checkoutBtn} onClick={onClose}>
              Done
            </button>
          </div>
        </>
      ) : (
        <>
          <p style={{ margin: "0 0 16px", color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
            Create an account with your email, or continue with Google. Clerk handles verification and secure
            sign-in.
          </p>
          <div style={s.clerkAuthActions}>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button type="button" className="aa-btn" style={s.checkoutBtn}>
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button type="button" className="aa-btn" style={s.signUpBtnWide}>
                  Sign up with email or Google
                </button>
              </SignUpButton>
            </Show>
          </div>
        </>
      )}
    </Modal>
  );
}

export function ClerkSetupHelpModal({ onClose }) {
  return (
    <Modal title="Connect Clerk" onClose={onClose}>
      <p style={{ margin: "0 0 12px", color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
        Sign-in is powered by Clerk, but this environment doesn&apos;t have a publishable key yet.
      </p>
      <ol style={{ margin: "0 0 14px", paddingLeft: 18, color: "var(--ink)", fontSize: 14, lineHeight: 1.65 }}>
        <li>
          Create an app at{" "}
          <a href="https://dashboard.clerk.com" target="_blank" rel="noreferrer">
            dashboard.clerk.com
          </a>
        </li>
        <li>
          Copy the <strong>Publishable key</strong> into <code>VITE_CLERK_PUBLISHABLE_KEY</code>
        </li>
        <li>
          Enable <strong>Email</strong> and <strong>Google</strong> under User &amp; authentication → Social
          connections
        </li>
        <li>Restart the dev server</li>
      </ol>
      <button type="button" style={s.checkoutBtn} onClick={onClose}>
        Got it
      </button>
    </Modal>
  );
}
