import React, { useState } from "react";
import { s } from "../styles";
import { Modal } from "./Modal";
import { FONT_OPTIONS } from "../data/fonts";
import { THEME_PRESETS, GREEN_BACKGROUNDS, SECTION_DEFS, sectionValue } from "../data/themes";

const COLOR_KEYS = [
  { key: "paper", label: "Paper (background)" },
  { key: "ink", label: "Ink (text)" },
  { key: "accent", label: "Primary accent" },
  { key: "accent2", label: "Secondary accent" },
  { key: "danger", label: "Danger / alert" },
];

const FONT_ROLES = [
  { role: "display", label: "Display (headings)" },
  { role: "body", label: "Body (paragraphs)" },
  { role: "mono", label: "Mono (labels & badges)" },
];

function isLightHex(hex = "") {
  const h = String(hex).replace("#", "");
  if (h.length !== 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  // Relative luminance threshold
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) > 160;
}

function isSectionVisible(theme, sectionId) {
  const entry = theme?.sections?.[sectionId];
  if (!entry) return true;
  return entry.visible !== false;
}

export function ThemeModal({ theme, onSave, onClose }) {
  const [tab, setTab] = useState("global");

  const setColor = (key, value) => {
    onSave({ ...theme, colors: { ...theme.colors, [key]: value } });
  };

  const setFont = (role, value) => {
    onSave({ ...theme, fonts: { ...theme.fonts, [role]: value } });
  };

  const applyPreset = (preset) => {
    onSave({
      ...theme,
      colors: { ...preset.colors },
      fonts: { ...preset.fonts },
    });
  };

  const applyGreenBackground = (swatch) => {
    const nextColors = { ...theme.colors, paper: swatch.paper };
    // Keep text readable when jumping between dark and light greens
    if (swatch.inkHint === "light" && !isLightHex(theme.colors?.ink)) {
      nextColors.ink = "#F3EEE4";
    }
    if (swatch.inkHint === "dark" && isLightHex(theme.colors?.ink)) {
      nextColors.ink = "#243028";
    }
    onSave({ ...theme, colors: nextColors });
  };

  const setSectionField = (sectionId, key, value) => {
    const current = { ...(theme.sections?.[sectionId] || {}) };
    if (!value && value !== false) delete current[key];
    else current[key] = value;
    const sections = { ...(theme.sections || {}) };
    if (Object.keys(current).length === 0) delete sections[sectionId];
    else sections[sectionId] = current;
    onSave({ ...theme, sections });
  };

  const toggleSectionVisible = (sectionId, visible) => {
    setSectionField(sectionId, "visible", visible);
  };

  return (
    <Modal title="Theme & colors" onClose={onClose}>
      <div style={s.themeTabRow}>
        <button
          type="button"
          style={tab === "global" ? { ...s.themeTab, ...s.themeTabActive } : s.themeTab}
          onClick={() => setTab("global")}
        >
          Global look
        </button>
        <button
          type="button"
          style={tab === "sections" ? { ...s.themeTab, ...s.themeTabActive } : s.themeTab}
          onClick={() => setTab("sections")}
        >
          Section by section
        </button>
      </div>

      {tab === "global" && (
        <>
          <p style={{ margin: "0 0 12px", color: "var(--muted)", fontSize: 14, lineHeight: 1.55 }}>
            Pick a preset or fine-tune colors and fonts. Changes apply live across the marketplace.
          </p>

          <p style={s.previewLabel}>Background greens</p>
          <p style={{ margin: "0 0 10px", color: "var(--muted)", fontSize: 12.5, lineHeight: 1.45 }}>
            Tap a shade to change only the page background. Text color adjusts automatically if needed.
          </p>
          <div style={s.greenBgGrid}>
            {GREEN_BACKGROUNDS.map((swatch) => {
              const active = (theme.colors?.paper || "").toLowerCase() === swatch.paper.toLowerCase();
              return (
                <button
                  key={swatch.id}
                  type="button"
                  className="aa-btn"
                  style={{
                    ...s.greenBgSwatch,
                    background: swatch.paper,
                    color: swatch.inkHint === "light" ? "#F3EEE4" : "#243028",
                    outline: active ? "2px solid var(--accent)" : "1px solid var(--border)",
                    outlineOffset: 2,
                  }}
                  onClick={() => applyGreenBackground(swatch)}
                  aria-label={`${swatch.name} background ${swatch.paper}`}
                  title={`${swatch.name} · ${swatch.paper}`}
                >
                  <span style={s.greenBgName}>{swatch.name}</span>
                  <span style={s.greenBgHex}>{swatch.paper}</span>
                </button>
              );
            })}
          </div>

          <p style={{ ...s.previewLabel, marginTop: 18 }}>Full presets</p>
          <div style={s.presetGrid}>
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                style={s.presetCard}
                onClick={() => applyPreset(preset)}
                aria-label={`Apply ${preset.name} preset`}
              >
                <div style={s.presetSwatches}>
                  {["paper", "ink", "accent", "accent2"].map((k) => (
                    <span
                      key={k}
                      style={{ ...s.presetSwatch, background: preset.colors[k] }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span style={s.presetName}>{preset.name}</span>
              </button>
            ))}
          </div>

          <p style={s.previewLabel}>Colors</p>
          <div style={s.colorGrid}>
            {COLOR_KEYS.map(({ key, label }) => (
              <div key={key} style={s.colorRow}>
                <label style={s.label} htmlFor={`theme-color-${key}`}>
                  {label}
                </label>
                <input
                  id={`theme-color-${key}`}
                  type="color"
                  value={theme.colors?.[key] || "#000000"}
                  onChange={(e) => setColor(key, e.target.value)}
                />
              </div>
            ))}
          </div>

          <p style={s.previewLabel}>Fonts</p>
          {FONT_ROLES.map(({ role, label }) => (
            <div key={role} style={s.formRow}>
              <label style={s.label} htmlFor={`theme-font-${role}`}>
                {label}
              </label>
              <select
                id={`theme-font-${role}`}
                style={s.input}
                value={theme.fonts?.[role] || FONT_OPTIONS[role][0].id}
                onChange={(e) => setFont(role, e.target.value)}
              >
                {FONT_OPTIONS[role].map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </>
      )}

      {tab === "sections" && (
        <>
          <p style={{ margin: "0 0 14px", color: "var(--muted)", fontSize: 14, lineHeight: 1.55 }}>
            Override colors or fonts for individual page sections. Leave blank to inherit the global theme.
          </p>

          {SECTION_DEFS.map((sec) => {
            const visible = isSectionVisible(theme, sec.id);
            const bg = sectionValue(theme, sec.id, "bg");
            const text = sectionValue(theme, sec.id, "text");
            const font = sectionValue(theme, sec.id, "font");

            return (
              <div key={sec.id} style={s.sectionEditorCard}>
                <div style={s.sectionEditorHead}>
                  <h3 style={s.sectionEditorTitle}>{sec.label}</h3>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={visible}
                      onChange={(e) => toggleSectionVisible(sec.id, e.target.checked)}
                    />
                    Visible
                  </label>
                </div>

                <div style={s.sectionEditorRow}>
                  <label style={s.label} htmlFor={`sec-bg-${sec.id}`}>
                    Background override
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input
                      id={`sec-bg-${sec.id}`}
                      type="color"
                      value={bg || theme.colors?.paper || "#EDE6D6"}
                      onChange={(e) => setSectionField(sec.id, "bg", e.target.value)}
                    />
                    {bg && (
                      <button type="button" style={s.adminExit} onClick={() => setSectionField(sec.id, "bg", "")}>
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                <div style={s.sectionEditorRow}>
                  <label style={s.label} htmlFor={`sec-text-${sec.id}`}>
                    Text override
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input
                      id={`sec-text-${sec.id}`}
                      type="color"
                      value={text || theme.colors?.ink || "#2B2016"}
                      onChange={(e) => setSectionField(sec.id, "text", e.target.value)}
                    />
                    {text && (
                      <button type="button" style={s.adminExit} onClick={() => setSectionField(sec.id, "text", "")}>
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                <div style={s.sectionEditorRow}>
                  <label style={s.label} htmlFor={`sec-font-${sec.id}`}>
                    Heading font override
                  </label>
                  <select
                    id={`sec-font-${sec.id}`}
                    style={s.input}
                    value={font || ""}
                    onChange={(e) => setSectionField(sec.id, "font", e.target.value)}
                  >
                    <option value="">Theme default</option>
                    {FONT_OPTIONS.display.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </>
      )}

      <div style={{ ...s.uploadRow, marginTop: 18, justifyContent: "flex-end" }}>
        <button type="button" style={s.checkoutBtn} onClick={onClose}>
          Done
        </button>
      </div>
    </Modal>
  );
}
