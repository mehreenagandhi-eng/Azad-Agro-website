import React, { useEffect, useRef } from "react";
import { FONT_OPTIONS } from "../data/fonts";
import { s } from "../styles";

export const TextStyleContext = React.createContext({
  overrides: {},
  setOverride: () => {},
  resetOverride: () => {},
});

export const TEXT_COLOR_ROLES = [
  { id: "", label: "Theme default" },
  { id: "ink", label: "Main text color" },
  { id: "paper", label: "Background color" },
  { id: "accent", label: "Primary accent" },
  { id: "accent2", label: "Secondary accent" },
  { id: "danger", label: "Alert color" },
  { id: "custom", label: "Custom color…" },
];

export const ALL_TEXT_FONTS = [...FONT_OPTIONS.display, ...FONT_OPTIONS.body];

export function applyTextOverride(baseStyle, override) {
  const out = { ...(baseStyle || {}) };
  if (!override) return out;

  if (override.fontId) {
    const font = ALL_TEXT_FONTS.find((f) => f.id === override.fontId);
    if (font) {
      out.fontFamily = `"${font.family}", ${font.style === "italic" ? "Georgia, serif" : "system-ui, sans-serif"}`;
      if (font.style === "italic") out.fontStyle = "italic";
      else delete out.fontStyle;
    }
  }

  const role = override.colorRole;
  if (role === "custom" && override.customColor) {
    out.color = override.customColor;
  } else if (role) {
    out.color = `var(--${role})`;
  }

  return out;
}

export function TextStylePopover({ override, onChange, onClose }) {
  const popRef = useRef(null);
  const val = override || { colorRole: "", customColor: "#2B2016", fontId: "" };

  useEffect(() => {
    function onDocClick(e) {
      if (popRef.current && !popRef.current.contains(e.target)) onClose?.();
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [onClose]);

  function patch(partial) {
    onChange?.({ ...val, ...partial });
  }

  return (
    <div ref={popRef} style={s.textStylePopover} onClick={(e) => e.stopPropagation()}>
      <div style={s.textStylePopoverRow}>
        <span style={s.textStylePopoverLabel}>Color</span>
        <select
          style={s.input}
          value={val.colorRole || ""}
          onChange={(e) => patch({ colorRole: e.target.value })}
        >
          {TEXT_COLOR_ROLES.map((r) => (
            <option key={r.id || "default"} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {val.colorRole === "custom" && (
        <div style={s.textStylePopoverRow}>
          <span style={s.textStylePopoverLabel}>Pick</span>
          <input
            type="color"
            value={val.customColor || "#2B2016"}
            onChange={(e) => patch({ customColor: e.target.value })}
            style={{ width: "100%", height: 34, border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer" }}
          />
        </div>
      )}

      <div style={s.textStylePopoverRow}>
        <span style={s.textStylePopoverLabel}>Font</span>
        <select
          style={s.input}
          value={val.fontId || ""}
          onChange={(e) => patch({ fontId: e.target.value })}
        >
          <option value="">Theme default</option>
          {ALL_TEXT_FONTS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
        <button type="button" style={s.adminExit} onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}
