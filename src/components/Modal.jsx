import React from "react";
import { s } from "../styles";

export function Modal({ title, onClose, children }) {
  return (
    <div
      style={s.modalWrap}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div style={s.modalBody} onClick={(e) => e.stopPropagation()}>
        <div style={s.modalHead}>
          <h2 style={s.drawerTitle}>{title}</h2>
          <button type="button" style={s.iconBtn} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div style={{ padding: "16px 18px 18px" }}>{children}</div>
      </div>
    </div>
  );
}
