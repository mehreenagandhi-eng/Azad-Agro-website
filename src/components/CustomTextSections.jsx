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

function CustomTextSectionBlock({
  item,
  index,
  total,
  isAdmin,
  onUpdate,
  onRemove,
  onMove,
  dragId,
  dropTargetId,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}) {
  const btnRef = useRef(null);
  const [colorOpen, setColorOpen] = useState(false);
  const isDragging = dragId === item.id;
  const isDropTarget = dropTargetId === item.id && dragId && dragId !== item.id;

  const shellStyle = {
    ...s.customTextSection,
    ...(item.bg ? { background: item.bg } : null),
    ...(item.text ? { color: item.text } : null),
    ...(isAdmin ? s.customTextSectionAdmin : null),
    ...(isDragging ? s.customTextSectionDragging : null),
    ...(isDropTarget ? s.customTextSectionDropTarget : null),
  };

  const deleteSection = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setColorOpen(false);
    onRemove?.(item.id);
  };

  return (
    <section
      style={shellStyle}
      data-custom-text-section={item.id}
      onDragOver={(e) => onDragOver?.(e, item.id)}
      onDragLeave={() => onDragLeave?.(item.id)}
      onDrop={(e) => onDrop?.(e, item.id)}
    >
      {isAdmin && (
        <div style={s.customTextSectionToolbar}>
          <div style={s.customTextReorderGroup}>
            <span
              style={s.customTextDragHandle}
              title="Drag to reorder"
              aria-label="Drag to reorder"
              role="button"
              tabIndex={0}
              draggable
              onDragStart={(e) => onDragStart?.(e, item.id)}
              onDragEnd={onDragEnd}
            >
              ⋮⋮
            </span>
            <button
              type="button"
              style={s.customTextReorderBtn}
              disabled={index === 0}
              aria-label="Move section up"
              onClick={() => onMove?.(item.id, -1)}
            >
              ↑
            </button>
            <button
              type="button"
              style={s.customTextReorderBtn}
              disabled={index >= total - 1}
              aria-label="Move section down"
              onClick={() => onMove?.(item.id, 1)}
            >
              ↓
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginLeft: "auto" }}>
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
 * Edit Mode: add / delete / recolor / drag-reorder freeform text section boxes.
 */
export function CustomTextSections({ isAdmin = false, sections = [], onChange, addLabel = "+ Add text section" }) {
  const list = Array.isArray(sections) ? sections : [];
  const listRef = useRef(list);
  const removedIdsRef = useRef(new Set());
  const dragIdRef = useRef(null);
  const [dragId, setDragId] = useState(null);
  const [dropTargetId, setDropTargetId] = useState(null);
  const [, bump] = useState(0);
  listRef.current = list;

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
    bump((n) => n + 1);
    persist(listRef.current.filter((item) => item.id !== id));
  };

  const moveItem = (id, delta) => {
    const current = listRef.current.filter((item) => !removedIdsRef.current.has(item.id));
    const from = current.findIndex((item) => item.id === id);
    if (from < 0) return;
    const to = from + delta;
    if (to < 0 || to >= current.length) return;
    const next = current.slice();
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row);
    persist(next);
  };

  const reorderByIds = (fromId, toId) => {
    if (!fromId || !toId || fromId === toId) return;
    const current = listRef.current.filter((item) => !removedIdsRef.current.has(item.id));
    const from = current.findIndex((item) => item.id === fromId);
    const to = current.findIndex((item) => item.id === toId);
    if (from < 0 || to < 0 || from === to) return;
    const next = current.slice();
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row);
    persist(next);
  };

  const onDragStart = (e, id) => {
    dragIdRef.current = id;
    setDragId(id);
    try {
      e.dataTransfer.setData("text/plain", id);
      e.dataTransfer.effectAllowed = "move";
    } catch {
      /* ignore */
    }
  };

  const onDragOver = (e, id) => {
    e.preventDefault();
    try {
      e.dataTransfer.dropEffect = "move";
    } catch {
      /* ignore */
    }
    if (id !== dropTargetId) setDropTargetId(id);
  };

  const onDragLeave = (id) => {
    if (dropTargetId === id) setDropTargetId(null);
  };

  const onDrop = (e, id) => {
    e.preventDefault();
    const fromId = dragIdRef.current || e.dataTransfer.getData("text/plain");
    reorderByIds(fromId, id);
    dragIdRef.current = null;
    setDragId(null);
    setDropTargetId(null);
  };

  const onDragEnd = () => {
    dragIdRef.current = null;
    setDragId(null);
    setDropTargetId(null);
  };

  const addItem = () => {
    persist([
      ...listRef.current.filter((item) => !removedIdsRef.current.has(item.id)),
      {
        id: sectionId(),
        heading: "New text section",
        body: "Write your content here. Drag the ⋮⋮ handle to reorder. Use Delete section to remove this box.",
        bg: "",
        text: "",
      },
    ]);
  };

  if (!isAdmin && visibleList.length === 0) return null;

  return (
    <div style={s.customTextSectionsWrap}>
      {isAdmin && visibleList.length > 1 && (
        <p style={s.customTextReorderHint}>
          Drag boxes with ⋮⋮, or use ↑ ↓, to change order. Delete section removes a box completely.
        </p>
      )}
      {visibleList.map((item, index) => (
        <CustomTextSectionBlock
          key={item.id}
          item={item}
          index={index}
          total={visibleList.length}
          isAdmin={isAdmin}
          onUpdate={updateItem}
          onRemove={removeItem}
          onMove={moveItem}
          dragId={dragId}
          dropTargetId={dropTargetId}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onDragEnd={onDragEnd}
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
