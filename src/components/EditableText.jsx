import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  TextStyleContext,
  applyTextOverride,
  TextStylePopover,
} from "../context/TextStyleContext";
import { clearPendingTextCommit, registerPendingTextCommit } from "../persistence";
import { s } from "../styles";

const adminShell = {
  display: "inline",
  outline: "none",
  border: "1px dashed color-mix(in srgb, var(--accent) 45%, var(--border))",
  borderRadius: 6,
  padding: "1px 5px",
  minWidth: 24,
  cursor: "text",
};

const bigBase = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(2rem, 5vw, 3.4rem)",
  lineHeight: 1.05,
  fontWeight: 600,
  letterSpacing: "-0.03em",
};

export function EditableText({
  isAdmin,
  value,
  onSave,
  textStyle,
  big,
  multiline,
  id,
  as: Tag = multiline ? "div" : "span",
}) {
  const { overrides, setOverride } = useContext(TextStyleContext);
  const [draft, setDraft] = useState(value ?? "");
  const [popOpen, setPopOpen] = useState(false);
  const wrapRef = useRef(null);
  const draftRef = useRef(draft);
  const valueRef = useRef(value);
  const saveTimer = useRef(null);
  const commitKey = id || `field-${multiline ? "multi" : "single"}`;

  useEffect(() => {
    setDraft(value ?? "");
  }, [value]);

  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const commit = useCallback(() => {
    const next = String(draftRef.current ?? "").trimEnd();
    if (next !== String(valueRef.current ?? "")) onSave?.(next);
    clearPendingTextCommit(commitKey);
  }, [onSave, commitKey]);

  useEffect(() => {
    registerPendingTextCommit(commitKey, commit);
    return () => clearPendingTextCommit(commitKey);
  }, [commitKey, commit]);

  const queueSave = (nextDraft) => {
    setDraft(nextDraft);
    draftRef.current = nextDraft;
    registerPendingTextCommit(commitKey, commit);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => commit(), 300);
  };

  const override = (id && overrides[id]) || null;
  const resolvedStyle = applyTextOverride(
    {
      ...(big ? bigBase : {}),
      ...(textStyle || {}),
    },
    override
  );

  const onKeyDown = (e) => {
    if (e.key === "Enter" && (!multiline || !e.shiftKey)) {
      e.preventDefault();
      if (saveTimer.current) clearTimeout(saveTimer.current);
      commit();
      e.currentTarget.blur();
    }
    if (e.key === "Escape") {
      setDraft(value ?? "");
      draftRef.current = value ?? "";
      clearPendingTextCommit(commitKey);
      e.currentTarget.blur();
    }
  };

  if (!isAdmin) {
    return (
      <Tag style={resolvedStyle}>
        {value}
      </Tag>
    );
  }

  const fieldStyle = {
    ...resolvedStyle,
    ...adminShell,
    display: multiline ? "block" : "inline",
    width: multiline ? "100%" : undefined,
    whiteSpace: multiline ? "pre-wrap" : undefined,
  };

  return (
    <span ref={wrapRef} style={{ position: "relative", display: multiline ? "block" : "inline-flex", alignItems: "center", gap: 6, maxWidth: "100%" }}>
      {multiline ? (
        <textarea
          value={draft}
          onChange={(e) => queueSave(e.target.value)}
          onBlur={() => {
            if (saveTimer.current) clearTimeout(saveTimer.current);
            commit();
          }}
          onKeyDown={onKeyDown}
          rows={3}
          style={{
            ...fieldStyle,
            resize: "vertical",
            font: "inherit",
            background: "transparent",
          }}
        />
      ) : (
        <input
          type="text"
          value={draft}
          onChange={(e) => queueSave(e.target.value)}
          onBlur={() => {
            if (saveTimer.current) clearTimeout(saveTimer.current);
            commit();
          }}
          onKeyDown={onKeyDown}
          style={{
            ...fieldStyle,
            font: "inherit",
            background: "transparent",
            minWidth: 48,
          }}
        />
      )}

      <button
        type="button"
        style={s.textStyleBadge}
        title="Text style"
        onClick={(e) => {
          e.stopPropagation();
          setPopOpen((o) => !o);
        }}
      >
        🎨
      </button>

      {popOpen && id && (
        <TextStylePopover
          override={override || { colorRole: "", customColor: "#2B2016", fontId: "" }}
          onChange={(next) => setOverride(id, next)}
          onClose={() => setPopOpen(false)}
        />
      )}
    </span>
  );
}

export function EditableList({
  isAdmin,
  items = [],
  onChange,
  itemStyle,
  variant = "bullet",
  addLabel = "+ Add item",
}) {
  const updateItem = (index, text) => {
    const next = items.map((item, i) => (i === index ? text : item));
    onChange?.(next);
  };

  const removeItem = (index) => {
    onChange?.(items.filter((_, i) => i !== index));
  };

  const addItem = () => {
    onChange?.([...items, variant === "badge" ? "New badge" : "New item"]);
  };

  if (variant === "badge") {
    return (
      <div style={s.badgeRow}>
        {items.map((item, i) => (
          <span key={i} style={s.badgeItem}>
            {isAdmin ? (
              <>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateItem(i, e.target.value)}
                  style={{
                    ...s.badgeText,
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    width: Math.max(80, item.length * 8),
                    ...(itemStyle || {}),
                  }}
                />
                <button type="button" style={s.listRemoveBtn} onClick={() => removeItem(i)} aria-label="Remove">
                  ×
                </button>
              </>
            ) : (
              <span style={{ ...s.badgeText, ...(itemStyle || {}) }}>{item}</span>
            )}
          </span>
        ))}
        {isAdmin && (
          <button type="button" style={s.uploadBtn} onClick={addItem}>
            {addLabel}
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <ul style={s.bulletList}>
        {items.map((item, i) => (
          <li key={i} style={s.bulletItem}>
            <span style={s.bulletDot} aria-hidden="true" />
            {isAdmin ? (
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(i, e.target.value)}
                style={{
                  ...s.bulletText,
                  border: "1px dashed color-mix(in srgb, var(--accent) 35%, var(--border))",
                  borderRadius: 6,
                  padding: "4px 8px",
                  background: "transparent",
                  width: "100%",
                  font: "inherit",
                  ...(itemStyle || {}),
                }}
              />
            ) : (
              <p style={{ ...s.bulletText, ...(itemStyle || {}) }}>{item}</p>
            )}
            {isAdmin && (
              <button type="button" style={s.listRemoveBtn} onClick={() => removeItem(i)} aria-label="Remove">
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>
      {isAdmin && (
        <button type="button" style={s.uploadBtn} onClick={addItem}>
          {addLabel}
        </button>
      )}
    </>
  );
}
