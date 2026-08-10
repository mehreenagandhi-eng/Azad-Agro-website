import React, { useState } from "react";
import { s } from "../styles";
import { Modal } from "./Modal";

export function SettingsModal({ account, onSignIn, onSignOut, onClose }) {
  const [name, setName] = useState(account?.name || "");
  const [email, setEmail] = useState(account?.email || "");

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSignIn(name, email);
    onClose();
  };

  return (
    <Modal title="Account" onClose={onClose}>
      {account ? (
        <>
          <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600 }}>{account.name}</p>
          <p style={{ margin: "0 0 18px", color: "var(--muted)", fontSize: 14 }}>{account.email}</p>
          <p style={{ margin: "0 0 18px", color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
            You&apos;re signed in for this browser session. Your name appears on checkout orders.
          </p>
          <button
            type="button"
            style={s.adminExit}
            onClick={() => {
              onSignOut();
              onClose();
            }}
          >
            Sign out
          </button>
        </>
      ) : (
        <form onSubmit={handleSignIn}>
          <p style={{ margin: "0 0 14px", color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
            Sign in with your name and email so checkout can pre-fill your details. This is a local demo — no password
            required.
          </p>

          <div style={s.formRow}>
            <label style={s.label} htmlFor="settings-name">
              Name
            </label>
            <input
              id="settings-name"
              style={s.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={s.formRow}>
            <label style={s.label} htmlFor="settings-email">
              Email
            </label>
            <input
              id="settings-email"
              type="email"
              style={s.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="button" style={{ ...s.googleDisabledBtn, marginBottom: 12 }} disabled>
            Continue with Google (disabled in demo)
          </button>

          <button type="submit" style={{ ...s.checkoutBtn, marginBottom: 12 }}>
            Sign in
          </button>
        </form>
      )}

      <p style={{ ...s.ownerOnlyNote, margin: "16px 0 0", lineHeight: 1.55 }}>
        Demo only — account data is stored in your browser, not on a server.
      </p>
    </Modal>
  );
}
