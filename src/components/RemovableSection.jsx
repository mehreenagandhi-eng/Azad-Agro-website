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
          <strong>{sectionLabel}</strong> — deleted from the page
        </span>
        <button type="button" style={s.showSectionBtn} onClick={() => onToggleVisible?.(sectionId, true)}>
          Restore section
        </button>
      </div>
    );
  }

  const deleteSection = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleVisible?.(sectionId, false);
  };

  return (
    <section style={{ ...(isAdmin ? s.removableSection : { marginBottom: 28 }), ...(style || {}) }}>
      {isAdmin && (
        <div style={s.removableSectionToolbar}>
          <button
            type="button"
            style={s.customTextDeleteBtn}
            aria-label={`Delete ${sectionLabel}`}
            title="Delete this wording section"
            onMouseDown={deleteSection}
            onClick={deleteSection}
          >
            Delete section
          </button>
        </div>
      )}
      {children}
    </section>
  );
}
