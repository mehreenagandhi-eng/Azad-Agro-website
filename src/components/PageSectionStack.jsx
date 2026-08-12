import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EditableText } from "./EditableText";
import { SectionPhoto } from "./SectionPhoto";
import {
  builtinLabel,
  newCustomSection,
  resolveSectionStack,
} from "../data/sectionStacks";
import { persistPhoto } from "../mediaStore";
import { s } from "../styles";

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

function SectionShell({
  entry,
  index,
  total,
  isAdmin,
  pageKey,
  isDragging,
  isDropTarget,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onMove,
  onDelete,
  children,
  style,
  toolbarExtra,
}) {
  const label = entry.type === "custom" ? "Text section" : builtinLabel(pageKey, entry.id);

  return (
    <section
      style={{
        ...(isAdmin ? s.removableSection : { marginBottom: 28 }),
        ...(style || null),
        ...(isDragging ? s.customTextSectionDragging : null),
        ...(isDropTarget ? s.customTextSectionDropTarget : null),
      }}
      data-page-section={entry.id}
      onDragOver={(e) => onDragOver?.(e, entry.id)}
      onDragLeave={() => onDragLeave?.(entry.id)}
      onDrop={(e) => onDrop?.(e, entry.id)}
    >
      {isAdmin && (
        <div style={s.customTextSectionToolbar}>
          <div style={s.customTextReorderGroup}>
            <span
              style={s.customTextDragHandle}
              title="Drag to reorder"
              aria-label={`Drag ${label}`}
              role="button"
              tabIndex={0}
              draggable
              onDragStart={(e) => onDragStart?.(e, entry.id)}
              onDragEnd={onDragEnd}
            >
              ⋮⋮
            </span>
            <button
              type="button"
              style={s.customTextReorderBtn}
              disabled={index === 0}
              aria-label={`Move ${label} up`}
              onClick={() => onMove?.(entry.id, -1)}
            >
              ↑
            </button>
            <button
              type="button"
              style={s.customTextReorderBtn}
              disabled={index >= total - 1}
              aria-label={`Move ${label} down`}
              onClick={() => onMove?.(entry.id, 1)}
            >
              ↓
            </button>
            <span style={s.pageSectionLabel}>{label}</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginLeft: "auto" }}>
            {toolbarExtra}
            <button
              type="button"
              style={s.customTextDeleteBtn}
              aria-label={`Delete ${label}`}
              title="Delete this block"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete?.(entry);
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete?.(entry);
              }}
            >
              Delete section
            </button>
          </div>
        </div>
      )}
      {children}
    </section>
  );
}

function CustomBlock({ item, isAdmin, onUpdate }) {
  return (
    <div>
      <SectionPhoto
        photo={item.photo || ""}
        isAdmin={isAdmin}
        label="section photo"
        onChange={(photo) => onUpdate?.(item.id, { photo })}
      />
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
    </div>
  );
}

function CustomSectionRow({
  entry,
  item,
  index,
  total,
  isAdmin,
  pageKey,
  isDragging,
  isDropTarget,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onMove,
  onDelete,
  onUpdate,
}) {
  const btnRef = useRef(null);
  const [colorOpen, setColorOpen] = useState(false);

  return (
    <SectionShell
      entry={entry}
      index={index}
      total={total}
      isAdmin={isAdmin}
      pageKey={pageKey}
      isDragging={isDragging}
      isDropTarget={isDropTarget}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onMove={onMove}
      onDelete={onDelete}
      style={{
        ...s.customTextSection,
        ...(isAdmin ? s.customTextSectionAdmin : null),
        ...(item.bg ? { background: item.bg } : null),
        ...(item.text ? { color: item.text } : null),
      }}
      toolbarExtra={
        isAdmin ? (
          <>
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
            {colorOpen && (
              <ColorPopover
                item={item}
                anchorRef={btnRef}
                onClose={() => setColorOpen(false)}
                onPatch={(partial) => onUpdate?.(item.id, partial)}
              />
            )}
          </>
        ) : null
      }
    >
      <CustomBlock item={item} isAdmin={isAdmin} onUpdate={onUpdate} />
    </SectionShell>
  );
}

/**
 * One reorderable stack for an entire page body:
 * built-in wording blocks + custom text boxes share drag / delete / restore.
 */
export function PageSectionStack({
  pageKey,
  isAdmin = false,
  stack,
  hiddenBuiltins = [],
  customSections = [],
  sectionPhotos = {},
  onChange,
  renderBuiltin,
  addLabel = "+ Add text section",
  afterStack = null,
}) {
  const customs = Array.isArray(customSections) ? customSections : [];
  const hidden = Array.isArray(hiddenBuiltins) ? hiddenBuiltins : [];
  const photos = sectionPhotos && typeof sectionPhotos === "object" ? sectionPhotos : {};

  const entries = useMemo(() => {
    const resolved = resolveSectionStack(pageKey, stack, customs);
    const hiddenSet = new Set(hidden);
    const defaultsMissing = resolveSectionStack(pageKey, null, [])
      .filter((e) => e.type === "builtin" && !hiddenSet.has(e.id))
      .filter((d) => !resolved.some((e) => e.id === d.id));
    return [...resolved.filter((e) => !(e.type === "builtin" && hiddenSet.has(e.id))), ...defaultsMissing];
  }, [pageKey, stack, customs, hidden]);

  const entriesRef = useRef(entries);
  entriesRef.current = entries;
  const customsRef = useRef(customs);
  customsRef.current = customs;
  const hiddenRef = useRef(hidden);
  hiddenRef.current = hidden;
  const photosRef = useRef(photos);
  photosRef.current = photos;

  const dragIdRef = useRef(null);
  const [dragId, setDragId] = useState(null);
  const [dropTargetId, setDropTargetId] = useState(null);

  const emit = (
    nextEntries,
    nextCustoms = customsRef.current,
    nextHidden = hiddenRef.current,
    nextPhotos = photosRef.current
  ) => {
    onChange?.({
      stack: nextEntries,
      customSections: nextCustoms,
      hiddenBuiltins: nextHidden,
      sectionPhotos: nextPhotos,
    });
  };

  const moveItem = (id, delta) => {
    const current = entriesRef.current.slice();
    const from = current.findIndex((e) => e.id === id);
    if (from < 0) return;
    const to = from + delta;
    if (to < 0 || to >= current.length) return;
    const next = current.slice();
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row);
    emit(next);
  };

  const reorderByIds = (fromId, toId) => {
    if (!fromId || !toId || fromId === toId) return;
    const current = entriesRef.current.slice();
    const from = current.findIndex((e) => e.id === fromId);
    const to = current.findIndex((e) => e.id === toId);
    if (from < 0 || to < 0 || from === to) return;
    const next = current.slice();
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row);
    emit(next);
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

  const deleteEntry = (entry) => {
    const nextEntries = entriesRef.current.filter((e) => e.id !== entry.id);
    if (entry.type === "custom") {
      const doomed = customsRef.current.find((c) => c.id === entry.id);
      if (doomed?.photo) persistPhoto("", doomed.photo).catch(() => {});
      emit(
        nextEntries,
        customsRef.current.filter((c) => c.id !== entry.id),
        hiddenRef.current,
        photosRef.current
      );
      return;
    }
    const nextHidden = hiddenRef.current.includes(entry.id)
      ? hiddenRef.current
      : [...hiddenRef.current, entry.id];
    const nextPhotos = { ...photosRef.current };
    if (nextPhotos[entry.id]) {
      persistPhoto("", nextPhotos[entry.id]).catch(() => {});
      delete nextPhotos[entry.id];
    }
    emit(nextEntries, customsRef.current, nextHidden, nextPhotos);
  };

  const restoreBuiltin = (id) => {
    const nextHidden = hiddenRef.current.filter((h) => h !== id);
    const nextEntries = [...entriesRef.current, { id, type: "builtin" }];
    emit(nextEntries, customsRef.current, nextHidden);
  };

  const updateCustom = (id, partial) => {
    const nextCustoms = customsRef.current.map((c) => (c.id === id ? { ...c, ...partial } : c));
    emit(entriesRef.current, nextCustoms, hiddenRef.current);
  };

  const setBuiltinPhoto = (id, photo) => {
    emit(entriesRef.current, customsRef.current, hiddenRef.current, {
      ...photosRef.current,
      [id]: photo || "",
    });
  };

  const addCustom = () => {
    const item = newCustomSection();
    emit(
      [...entriesRef.current, { id: item.id, type: "custom" }],
      [...customsRef.current, item],
      hiddenRef.current
    );
  };

  const customById = useMemo(() => {
    const map = {};
    for (const c of customs) map[c.id] = c;
    return map;
  }, [customs]);

  if (!isAdmin && entries.length === 0 && hidden.length === 0) return null;

  return (
    <div style={s.customTextSectionsWrap}>
      {isAdmin && entries.length > 0 && (
        <p style={s.customTextReorderHint}>
          Drag blocks with ⋮⋮ to reorder. Upload a photo on any section — files are saved in this
          browser so a refresh keeps your writing and images on this same link.
        </p>
      )}

      {entries.map((entry, index) => {
        if (entry.type === "custom") {
          const item = customById[entry.id];
          if (!item) return null;
          return (
            <CustomSectionRow
              key={entry.id}
              entry={entry}
              item={item}
              index={index}
              total={entries.length}
              isAdmin={isAdmin}
              pageKey={pageKey}
              isDragging={dragId === entry.id}
              isDropTarget={dropTargetId === entry.id && dragId && dragId !== entry.id}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onDragEnd={onDragEnd}
              onMove={moveItem}
              onDelete={deleteEntry}
              onUpdate={updateCustom}
            />
          );
        }

        const builtin = renderBuiltin?.(entry.id);
        if (!builtin && !isAdmin) return null;

        return (
          <SectionShell
            key={entry.id}
            entry={entry}
            index={index}
            total={entries.length}
            isAdmin={isAdmin}
            pageKey={pageKey}
            isDragging={dragId === entry.id}
            isDropTarget={dropTargetId === entry.id && dragId && dragId !== entry.id}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
            onMove={moveItem}
            onDelete={deleteEntry}
          >
            <SectionPhoto
              photo={photos[entry.id] || ""}
              isAdmin={isAdmin}
              label="section photo"
              onChange={(photo) => setBuiltinPhoto(entry.id, photo)}
            />
            {builtin}
          </SectionShell>
        );
      })}

      {afterStack}

      {isAdmin && (
        <button type="button" className="aa-btn" style={s.addProductBtn} onClick={addCustom}>
          {addLabel}
        </button>
      )}

      {isAdmin && hidden.length > 0 && (
        <div style={s.hiddenSectionsRestoreList}>
          <p style={s.customTextReorderHint}>Deleted blocks</p>
          {hidden.map((id) => (
            <div key={id} style={s.hiddenSectionBox}>
              <span>
                <strong>{builtinLabel(pageKey, id)}</strong> — deleted from the page
              </span>
              <button type="button" style={s.showSectionBtn} onClick={() => restoreBuiltin(id)}>
                Restore section
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
