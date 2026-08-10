import React, { useRef, useState } from "react";
import { s } from "../styles";
import { Modal } from "./Modal";
import { ImageCropper } from "./ImageCropper";
import { Icon, ICON_KEYS } from "./Icon";

export function ProductEditModal({ product, categories, onCancel, onSave }) {
  const [form, setForm] = useState({ ...product });
  const [cropSource, setCropSource] = useState(null);
  const fileRef = useRef(null);

  const patch = (partial) => setForm((prev) => ({ ...prev, ...partial }));

  const openPicker = () => fileRef.current?.click();

  const onFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) setCropSource(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      name: form.name.trim(),
      cat: form.cat.trim(),
      unit: form.unit.trim(),
      price: Number(form.price) || 0,
      note: form.note.trim(),
    });
  };

  const categoryOptions = Array.from(new Set([...(categories || []), form.cat].filter(Boolean)));

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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
        </div>

        <div style={s.formRow}>
          <span style={s.label}>Icon (used when no photo)</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {ICON_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => patch({ icon: key })}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  border:
                    form.icon === key
                      ? "2px solid var(--accent)"
                      : "1px solid var(--border)",
                  background:
                    form.icon === key
                      ? "color-mix(in srgb, var(--accent) 12%, var(--paper))"
                      : "var(--paper)",
                  color: "var(--accent2)",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                }}
                aria-label={`Select ${key} icon`}
                aria-pressed={form.icon === key}
              >
                <Icon name={key} size={28} />
              </button>
            ))}
          </div>
        </div>

        <div style={s.formRow}>
          <span style={s.label}>Product image</span>
          {form.image ? (
            <img
              src={form.image}
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
            <div
              style={{
                width: "100%",
                maxWidth: 200,
                aspectRatio: "6 / 7",
                borderRadius: 12,
                border: "1px dashed var(--border)",
                display: "grid",
                placeItems: "center",
                color: "var(--muted)",
                fontSize: 13,
                marginBottom: 10,
              }}
            >
              <Icon name={form.icon || "leaf"} size={48} />
            </div>
          )}

          <div style={s.uploadRow}>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
            <button type="button" style={s.uploadBtn} onClick={openPicker}>
              {form.image ? "Replace image" : "Upload image"}
            </button>
            {form.image && (
              <button type="button" style={s.removePhotoBtn} onClick={() => patch({ image: "" })}>
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
            placeholder="Paste image URL"
            value={form.image?.startsWith("data:") ? "" : form.image || ""}
            onChange={(e) => patch({ image: e.target.value })}
          />
        </div>

        <div style={s.formRow}>
          <label style={s.label} htmlFor="product-note">
            Short note
          </label>
          <input
            id="product-note"
            style={s.input}
            placeholder="e.g. Rain-fed, hand-winnowed"
            value={form.note}
            onChange={(e) => patch({ note: e.target.value })}
          />
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, cursor: "pointer" }}>
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
        <Modal title="Crop product image" onClose={() => setCropSource(null)}>
          <ImageCropper
            source={cropSource}
            aspect={6 / 7}
            onCancel={() => setCropSource(null)}
            onComplete={(dataUrl) => {
              patch({ image: dataUrl });
              setCropSource(null);
            }}
          />
        </Modal>
      )}
    </Modal>
  );
}
