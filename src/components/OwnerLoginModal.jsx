import React, { useState } from "react";
import { s } from "../styles";
import { Modal } from "./Modal";
import { OWNER_PASSCODE } from "../data/defaults";

export function OwnerLoginModal({ onClose, onSubmit, error }) {
  const [passcode, setPasscode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(passcode);
  };

  return (
    <Modal title="Owner login" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <p style={{ margin: "0 0 14px", color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
          Enter the marketplace owner passcode to approve manufacturers and access owner-only controls.
        </p>

        <div style={s.formRow}>
          <label style={s.label} htmlFor="owner-passcode">
            Passcode
          </label>
          <input
            id="owner-passcode"
            type="password"
            style={s.input}
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            autoComplete="off"
            autoFocus
          />
        </div>

        {error && (
          <p style={{ margin: "0 0 12px", color: "var(--danger)", fontSize: 14 }} role="alert">
            {error}
          </p>
        )}

        <p style={{ ...s.ownerOnlyNote, margin: "0 0 16px", lineHeight: 1.55 }}>
          Demo passcode: <strong>{OWNER_PASSCODE}</strong>
        </p>

        <div style={{ ...s.uploadRow, justifyContent: "flex-end" }}>
          <button type="button" style={s.adminExit} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" style={s.checkoutBtn}>
            Sign in as owner
          </button>
        </div>
      </form>
    </Modal>
  );
}
