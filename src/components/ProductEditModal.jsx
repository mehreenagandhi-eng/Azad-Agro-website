import React, { useEffect, useMemo, useRef, useState } from "react";
import { s } from "../styles";
import { Modal } from "./Modal";
import { ImageCropper } from "./ImageCropper";
import { Icon, ICON_KEYS, ICON_LABELS } from "./Icon";
import { persistPhoto, resolvePhotoSrc, isMediaRef } from "../mediaStore";

function initialMode(product) {
  return product?.image ? "photo" : "character";
}

export function ProductEditModal({ product, categories, onCancel, onSave }) {
  const [form, setForm] = useState({
    icon: "leaf",
    image: "",
    ...product,
  });
  const [mode, setMode] = useState(() => initialMode(product));
  const [cropSource, setCropSource] = useState(null);
  const [preview, setPreview] = useState("");
  const [imageUrlDraft, setImageUrlDraft] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const src = await resolvePhotoSrc(form.image);
      if (!cancelled) setPreview(src || "");
    })();
    return () => {
      cancelled = true;
    };
  }, [form.image]);

  const patch = (partial) => setForm((prev) => ({ ...prev, ...partial }));

  const openPicker = () => fileRef.current?.click();

  const onFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file && file.type.startsWith("image/")) setCropSource(file);
  };

  const chooseMode = (next) => {
    setMode(next);
    if (next === "character") {
      // Keep any uploaded photo in memory until save only if they switch back;
      // representation uses character when this mode is active.
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    let image = form.image || "";
    if (mode === "character") {
      if (image) {
        try {
          await persistPhoto("", image);
        } catch {
          /* ignore */
        }
      }
      image = "";
    } else if (mode === "photo" && imageUrlDraft.trim() && !preview) {
      image = imageUrlDraft.trim();
    }

    onSave({
      ...form,
      name: form.name.trim(),
      cat: form.cat.trim(),
      unit: form.unit.trim(),
      price: Number(form.price) || 0,
      note: (form.note || "").trim(),
      icon: form.icon || "leaf",
      image,
      stock:
        form.stock === "" || form.stock == null || Number.isNaN(Number(form.stock))
          ? undefined
          : Number(form.stock),
    });
  };

  const categoryOptions = useMemo(
    () => Array.from(new Set([...(categories || []), form.cat].filter(Boolean))),
    [categories, form.cat]
  );

  const urlFieldValue = (() => {
    if (imageUrlDraft) return imageUrlDraft;
    const img = form.image || "";
    if (!img || img.startsWith("data:") || isMediaRef(img)) return "";
    return img;
  })();

  return (
    <Modal title={product?.name ? "Edit product" : "Add product"} onClose={onCancel}>
      <form onSubmit={handleSave}>
        <div style={s.formRow}>
          <label style={s.label} htmlFor="product-name">
            Name
          </label>
          <input
            id="product-name"
            style={s.input}
            value={form.name}
            onChange={(e) => patch({ name: e.target.value })}
            required
          />
        </div>

        <div style={s.formRow}>
          <label style={s.label} htmlFor="product-cat">
            Category
          </label>
          <input
            id="product-cat"
            style={s.input}
            list="product-categories"
            value={form.cat}
            onChange={(e) => patch({ cat: e.target.value })}
            required
          />
          <datalist id="product-categories">
            {categoryOptions.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div style={s.formRow}>
            <label style={s.label} htmlFor="product-unit">
              Unit
            </label>
            <input
              id="product-unit"
              style={s.input}
              placeholder="e.g. 1 kg pouch"
              value={form.unit}
              onChange={(e) => patch({ unit: e.target.value })}
            />
          </div>
          <div style={s.formRow}>
            <label style={s.label} htmlFor="product-price">
              Price (₹)
            </label>
            <input
              id="product-price"
              type="number"
              min="0"
              step="1"
              style={s.input}
              value={form.price}
              onChange={(e) => patch({ price: e.target.value })}
            />
          </div>
          <div style={s.formRow}>
            <label style={s.label} htmlFor="product-stock">
              Stock
            </label>
            <input
              id="product-stock"
              type="number"
              min="0"
              step="1"
              style={s.input}
              value={form.stock ?? ""}
              onChange={(e) =>
                patch({
                  stock: e.target.value === "" ? "" : Number(e.target.value),
                })
              }
              placeholder="e.g. 40"
            />
          </div>
        </div>

        <div style={s.formRow}>
          <span style={s.label}>How should this plant look?</span>
          <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--muted)", lineHeight: 1.45 }}>
            Upload a photo of the plant/product, or pick a character icon to represent it.
          </p>
          <div style={s.visualModeRow} role="radiogroup" aria-label="Product look">
            <button
              type="button"
              role="radio"
              aria-checked={mode === "photo"}
              style={{
                ...s.visualModeBtn,
                ...(mode === "photo" ? s.visualModeBtnActive : null),
              }}
              onClick={() => chooseMode("photo")}
            >
              Photo
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={mode === "character"}
              style={{
                ...s.visualModeBtn,
                ...(mode === "character" ? s.visualModeBtnActive : null),
              }}
              onClick={() => chooseMode("character")}
            >
              Character
            </button>
          </div>
        </div>

        {mode === "photo" ? (
          <div style={s.formRow}>
            <span style={s.label}>Product photo</span>
            {preview ? (
              <img
                src={preview}
                alt=""
                style={{
                  width: "100%",
                  maxWidth: 200,
                  aspectRatio: "6 / 7",
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  display: "block",
                  marginBottom: 10,
                }}
              />
            ) : (
              <div style={s.visualEmptyPreview}>
                <Icon name={form.icon || "leaf"} size={48} />
                <span>No photo yet</span>
              </div>
            )}

            <div style={s.uploadRow}>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
              <button type="button" style={s.uploadBtn} onClick={openPicker}>
                {preview ? "Replace photo" : "Upload photo"}
              </button>
              {preview && (
                <button
                  type="button"
                  style={s.removePhotoBtn}
                  onClick={async () => {
                    await persistPhoto("", form.image);
                    patch({ image: "" });
                    setImageUrlDraft("");
                  }}
                >
                  Remove
                </button>
              )}
            </div>

            <div style={s.orDivider}>
              <span style={{ height: 1, background: "var(--border)" }} />
              <span>or</span>
              <span style={{ height: 1, background: "var(--border)" }} />
            </div>

            <input
              style={s.input}
              placeholder="Paste photo URL"
              value={urlFieldValue}
              onChange={(e) => {
                const v = e.target.value;
                setImageUrlDraft(v);
                patch({ image: v });
              }}
            />
          </div>
        ) : (
          <div style={s.formRow}>
            <span style={s.label}>Plant character</span>
            <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--muted)", lineHeight: 1.45 }}>
              Choose a character that represents this plant. It shows on the product card when you
              don’t use a photo.
            </p>
            <div style={s.characterPreview}>
              <Icon name={form.icon || "leaf"} size={72} />
              <span style={s.characterPreviewLabel}>
                {ICON_LABELS[form.icon] || form.icon || "Leaf"}
              </span>
            </div>
            <div style={s.characterGrid}>
              {ICON_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => patch({ icon: key })}
                  style={{
                    ...s.characterPick,
                    ...(form.icon === key ? s.characterPickActive : null),
                  }}
                  aria-label={`Select ${ICON_LABELS[key] || key} character`}
                  aria-pressed={form.icon === key}
                  title={ICON_LABELS[key] || key}
                >
                  <Icon name={key} size={30} />
                  <span style={s.characterPickLabel}>{ICON_LABELS[key] || key}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={s.formRow}>
          <label style={s.label} htmlFor="product-note">
            Short note
          </label>
          <input
            id="product-note"
            style={s.input}
            placeholder="e.g. Rain-fed, hand-winnowed"
            value={form.note || ""}
            onChange={(e) => patch({ note: e.target.value })}
          />
        </div>

        <label
          style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, cursor: "pointer" }}
        >
          <input
            type="checkbox"
            checked={Boolean(form.featured)}
            onChange={(e) => patch({ featured: e.target.checked })}
          />
          <span style={s.label}>Featured this season</span>
        </label>

        <div style={{ ...s.uploadRow, justifyContent: "flex-end" }}>
          <button type="button" style={s.adminExit} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" style={s.checkoutBtn}>
            Save product
          </button>
        </div>
      </form>

      {cropSource && (
        <Modal title="Crop product photo" onClose={() => setCropSource(null)}>
          <ImageCropper
            source={cropSource}
            aspect={6 / 7}
            onCancel={() => setCropSource(null)}
            onComplete={async (dataUrl) => {
              const ref = await persistPhoto(dataUrl, form.image);
              patch({ image: ref });
              setImageUrlDraft("");
              setMode("photo");
              setCropSource(null);
            }}
          />
        </Modal>
      )}
    </Modal>
  );
}
