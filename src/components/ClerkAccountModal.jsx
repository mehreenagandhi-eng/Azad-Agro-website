import React from "react";
import { s } from "../styles";
import { Modal } from "./Modal";

export function ClerkSetupHelpModal({ onClose }) {
  return (
    <Modal title="Sign up with Clerk" onClose={onClose}>
      <p style={{ margin: "0 0 12px", color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
        Sign up opens Clerk so visitors can create an account with email or Google. Add your Clerk
        publishable key to turn that button on.
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
          Enable <strong>Email</strong> and <strong>Google</strong> under User &amp; authentication
        </li>
        <li>Restart the app — then <strong>Sign up</strong> connects visitors to Clerk</li>
      </ol>
      <button type="button" style={s.checkoutBtn} onClick={onClose}>
        Got it
      </button>
    </Modal>
  );
}
