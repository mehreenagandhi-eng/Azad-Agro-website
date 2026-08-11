import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EditableText } from "./EditableText";
import { uid } from "../data/defaults";
import { s } from "../styles";

function sectionId() {
  return "cts_" + uid().replace(/^p_/, "");
}

function ColorPopover({ item, onPatch, onClose, anchorRef }) {
  const popRef = useRef(null);
  const [coords, setCoords] = useState(null);
  const paperFallback = "#1C2A22";
  const inkFallback = "#F3EEE4";

  useLayoutEffect(() => {
    if (!anchorRef?.current) return undefined;
    const place = () => {
      const r = anchorRef.current.getBoundingClientRect();
      const width = 268;
      const left = Math.max(12, Math.min(r.right - width, window.innerWidth - width - 12));
      setCoords({ top: Math.min(r.bottom + 8, window.innerHeight - 12), left, width });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [anchorRef]);

  useEffect(() => {
    const onPointer = (e) => {
      if (popRef.current?.contains(e.target)) return;
      if (anchorRef?.current?.contains(e.target)) return;
      onClose?.();
    };
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose, anchorRef]);

  if (!coords) return null;

  const fields = [
    { key: "bg", label: "Background", value: item.bg, fallback: paperFallback },
    { key: "text", label: "Text color", value: item.text, fallback: inkFallback },
  ];

  return createPortal(
    <div
      ref={popRef}
      role="dialog"
      aria-label="Section colors"
      style={{
        ...s.sectionColorPopover,
        top: coords.top,
        left: coords.left,
        width: coords.width,
      }}
    >
      <div style={s.sectionColorPopoverHead}>
        <strong style={s.sectionColorPopoverTitle}>Section colors</strong>
        <button type="button" style={s.sectionColorClose} onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>
      <p style={s.sectionColorPopoverHint}>Changes apply live. Reset uses the page theme.</p>
      {fields.map((field) => (
        <div key={field.key} style={s.sectionColorField}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={s.sectionColorFieldLabel}>{field.label}</div>
          </div>
          <input
            type="color"
            aria-label={field.label}
            value={field.value || field.fallback}
            onChange={(e) => onPatch({ [field.key]: e.target.value })}
          />
          {field.value ? (
            <button type="button" style={s.sectionColorReset} onClick={() => onPatch({ [field.key]: "" })}>
              Reset
            </button>
          ) : (
            <span style={s.sectionColorMeta}>Default</span>
          )}
        </div>
      ))}
    </div>,
    document.body
  );
}

function CustomTextSectionBlock({ item, isAdmin, onUpdate, onRemove }) {
  const btnRef = useRef(null);
  const [colorOpen, setColorOpen] = useState(false);

  const shellStyle = {
    ...s.customTextSection,
    ...(item.bg ? { background: item.bg } : null),
    ...(item.text ? { color: item.text } : null),
    ...(isAdmin ? s.customTextSectionAdmin : null),
  };

  const deleteSection = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setColorOpen(false);
    onRemove?.(item.id);
  };

  return (
    <section style={shellStyle} data-custom-text-section={item.id}>
      {isAdmin && (
        <div style={s.customTextSectionToolbar}>
          <button
            ref={btnRef}
            type="button"
            className="aa-btn"
            style={{
              ...s.sectionColorBtn,
              position: "static",
              top: "auto",
              right: "auto",
              ...(colorOpen ? s.sectionColorBtnActive : null),
            }}
            onClick={() => setColorOpen((o) => !o)}
          >
            Color
          </button>
          <button
            type="button"
            style={s.customTextDeleteBtn}
            aria-label="Delete this text section"
            title="Delete this text box"
            onMouseDown={deleteSection}
            onClick={deleteSection}
          >
            Delete section
          </button>
        </div>
      )}

      {colorOpen && (
        <ColorPopover
          item={item}
          anchorRef={btnRef}
          onClose={() => setColorOpen(false)}
          onPatch={(partial) => onUpdate?.(item.id, partial)}
        />
      )}

      <EditableText
        id={`cts_${item.id}_h`}
        isAdmin={isAdmin}
        value={item.heading}
        onSave={(v) => onUpdate?.(item.id, { heading: v })}
        textStyle={{
          ...s.pageSubheading,
          marginTop: 0,
          ...(item.text ? { color: item.text } : null),
        }}
      />
      <EditableText
        id={`cts_${item.id}_b`}
        isAdmin={isAdmin}
        value={item.body}
        onSave={(v) => onUpdate?.(item.id, { body: v })}
        textStyle={{
          ...s.pageParagraph,
          ...(item.text ? { color: item.text } : null),
        }}
        multiline
      />
    </section>
  );
}

/**
 * Edit Mode: add / delete / recolor freeform text section boxes.
 * Fully controlled by `sections` + `onChange` so deletes persist cleanly.
 */
export function CustomTextSections({ isAdmin = false, sections = [], onChange, addLabel = "+ Add text section" }) {
  const list = Array.isArray(sections) ? sections : [];
  const listRef = useRef(list);
  const removedIdsRef = useRef(new Set());
  const [, bump] = useState(0);
  listRef.current = list;

  // Once parent no longer has a removed id, drop the guard.
  useEffect(() => {
    const liveIds = new Set(list.map((item) => item.id));
    let changed = false;
    for (const id of [...removedIdsRef.current]) {
      if (!liveIds.has(id)) {
        removedIdsRef.current.delete(id);
        changed = true;
      }
    }
    if (changed) bump((n) => n + 1);
  }, [list]);

  const visibleList = list.filter((item) => !removedIdsRef.current.has(item.id));

  const persist = (next) => {
    listRef.current = next;
    onChange?.(next);
  };

  const updateItem = (id, partial) => {
    if (removedIdsRef.current.has(id)) return;
    const current = listRef.current;
    if (!current.some((item) => item.id === id)) return;
    persist(current.map((item) => (item.id === id ? { ...item, ...partial } : item)));
  };

  const removeItem = (id) => {
    removedIdsRef.current.add(id);
    bump((n) => n + 1); // hide the box immediately
    persist(listRef.current.filter((item) => item.id !== id));
  };

  const addItem = () => {
    persist([
      ...listRef.current.filter((item) => !removedIdsRef.current.has(item.id)),
      {
        id: sectionId(),
        heading: "New text section",
        body: "Write your content here. Use Color to set background and text colors for this section.",
        bg: "",
        text: "",
      },
    ]);
  };

  if (!isAdmin && visibleList.length === 0) return null;

  return (
    <div style={s.customTextSectionsWrap}>
      {visibleList.map((item) => (
        <CustomTextSectionBlock
          key={item.id}
          item={item}
          isAdmin={isAdmin}
          onUpdate={updateItem}
          onRemove={removeItem}
        />
      ))}
      {isAdmin && (
        <button type="button" className="aa-btn" style={s.addProductBtn} onClick={addItem}>
          {addLabel}
        </button>
      )}
    </div>
  );
}
