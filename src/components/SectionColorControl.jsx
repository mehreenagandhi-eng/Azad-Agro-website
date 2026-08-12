import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { s } from "../styles";
import { SECTION_DEFS, sectionValue } from "../data/themes";
import { useThemeEdit } from "../context/ThemeEditContext";

const FIELDS = [
  { key: "bg", label: "Area background", hint: "Strip / section fill" },
  { key: "box", label: "Boxes & panels", hint: "Cards, pills, nested panels" },
  { key: "text", label: "Text color", hint: "Headings & copy here" },
];

function sectionLabel(sectionId) {
  return SECTION_DEFS.find((sec) => sec.id === sectionId)?.label || sectionId;
}

/**
 * Floating “Color” control for a page section. Visible only in Edit Mode.
 * Place inside a positioned section (or wrap with SectionColorAnchor).
 */
export function SectionColorControl({ sectionId, corner = "top-right" }) {
  const ctx = useThemeEdit();
  const btnRef = useRef(null);
  const popRef = useRef(null);
  const [coords, setCoords] = useState(null);

  const isAdmin = Boolean(ctx?.isAdmin);
  const theme = ctx?.theme;
  const open = ctx?.activeColorSection === sectionId;

  useLayoutEffect(() => {
    if (!open || !btnRef.current) {
      setCoords(null);
      return;
    }
    const place = () => {
      const r = btnRef.current.getBoundingClientRect();
      const width = 278;
      const left = Math.max(12, Math.min(r.right - width, window.innerWidth - width - 12));
      const top = Math.min(r.bottom + 8, window.innerHeight - 12);
      setCoords({ top, left, width });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e) => {
      if (btnRef.current?.contains(e.target)) return;
      if (popRef.current?.contains(e.target)) return;
      ctx?.setActiveColorSection(null);
    };
    const onKey = (e) => {
      if (e.key === "Escape") ctx?.setActiveColorSection(null);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, ctx]);

  if (!isAdmin || !theme) return null;

  const btnStyle =
    corner === "top-left"
      ? { ...s.sectionColorBtn, left: 10, right: "auto" }
      : s.sectionColorBtn;

  const fallbackPaper = theme.colors?.paper || "#1C2A22";
  const fallbackInk = theme.colors?.ink || "#F3EEE4";

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="aa-btn"
        style={{
          ...btnStyle,
          ...(open ? s.sectionColorBtnActive : null),
        }}
        aria-expanded={open}
        aria-label={`Change colors for ${sectionLabel(sectionId)}`}
        title={`Change colors — ${sectionLabel(sectionId)}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          ctx.setActiveColorSection(open ? null : sectionId);
        }}
      >
        Color
      </button>

      {open &&
        coords &&
        createPortal(
          <div
            ref={popRef}
            role="dialog"
            aria-label={`${sectionLabel(sectionId)} colors`}
            style={{
              ...s.sectionColorPopover,
              top: coords.top,
              left: coords.left,
              width: coords.width,
            }}
          >
            <div style={s.sectionColorPopoverHead}>
              <strong style={s.sectionColorPopoverTitle}>{sectionLabel(sectionId)}</strong>
              <button
                type="button"
                style={s.sectionColorClose}
                aria-label="Close color editor"
                onClick={() => ctx.setActiveColorSection(null)}
              >
                ✕
              </button>
            </div>
            <p style={s.sectionColorPopoverHint}>Changes apply live on the page.</p>

            {FIELDS.map((field) => {
              const value = sectionValue(theme, sectionId, field.key);
              const fallback = field.key === "text" ? fallbackInk : fallbackPaper;
              return (
                <div key={field.key} style={s.sectionColorField}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={s.sectionColorFieldLabel}>{field.label}</div>
                    <div style={s.sectionFieldHint}>{field.hint}</div>
                  </div>
                  <input
                    type="color"
                    aria-label={field.label}
                    value={value || fallback}
                    onChange={(e) => ctx.patchSectionField(sectionId, field.key, e.target.value)}
                  />
                  {value ? (
                    <button
                      type="button"
                      style={s.sectionColorReset}
                      onClick={() => ctx.patchSectionField(sectionId, field.key, "")}
                    >
                      Reset
                    </button>
                  ) : (
                    <span style={s.sectionColorMeta}>Default</span>
                  )}
                </div>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
}

/** Wraps a section element and mounts an inline Color control when in Edit Mode. */
export function SectionColorAnchor({
  sectionId,
  as: Tag = "div",
  style,
  className,
  corner,
  children,
  ...rest
}) {
  return (
    <Tag style={{ position: "relative", ...style }} className={className} {...rest}>
      <SectionColorControl sectionId={sectionId} corner={corner} />
      {children}
    </Tag>
  );
}
