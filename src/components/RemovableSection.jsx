import React from "react";
import { s } from "../styles";

export function isSectionVisible(theme, sectionId) {
  const entry = theme?.sections?.[sectionId];
  if (!entry) return true;
  return entry.visible !== false;
}

export function RemovableSection({
  sectionId,
  theme,
  isAdmin,
  label,
  onToggleVisible,
  children,
  style,
}) {
  const visible = isSectionVisible(theme, sectionId);
  const sectionLabel = label || sectionId;

  if (!visible && !isAdmin) return null;

  if (!visible && isAdmin) {
    return (
      <div style={s.hiddenSectionBox}>
        <span>
          <strong>{sectionLabel}</strong> — hidden from visitors
        </span>
        <button type="button" style={s.showSectionBtn} onClick={() => onToggleVisible?.(sectionId, true)}>
          Show section
        </button>
      </div>
    );
  }

  return (
    <section style={{ ...(isAdmin ? s.removableSection : { marginBottom: 28 }), ...(style || {}) }}>
      {isAdmin && (
        <button
          type="button"
          style={s.sectionRemoveBtn}
          onClick={() => onToggleVisible?.(sectionId, false)}
        >
          Hide section
        </button>
      )}
      {children}
    </section>
  );
}
