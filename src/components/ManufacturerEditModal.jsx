import React, { useRef, useState } from "react";
import { s } from "../styles";
import { Modal } from "./Modal";
import { ImageCropper } from "./ImageCropper";

export function ManufacturerEditModal({ manufacturer, onCancel, onSave }) {
  const [form, setForm] = useState({ ...manufacturer });
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
      tagline: form.tagline.trim(),
    });
  };

  const isNew = !manufacturer?.name;

  return (
    <Modal title={isNew ? "Add manufacturer" : "Edit manufacturer"} onClose={onCancel}>
      <form onSubmit={handleSave}>
        <div style={s.formRow}>
          <label style={s.label} htmlFor="mfg-name">
            Company name
          </label>
          <input
            id="mfg-name"
            style={s.input}
            value={form.name}
            onChange={(e) => patch({ name: e.target.value })}
            required
          />
        </div>

        <div style={s.formRow}>
          <label style={s.label} htmlFor="mfg-tagline">
            Tagline
          </label>
          <input
            id="mfg-tagline"
            style={s.input}
            placeholder="e.g. farm direct · no middlemen"
            value={form.tagline}
            onChange={(e) => patch({ tagline: e.target.value })}
          />
        </div>

        <div style={s.formRow}>
          <span style={s.label}>Logo</span>
          {form.logo ? (
            <img
              src={form.logo}
              alt=""
              style={{
                width: 96,
                height: 96,
                objectFit: "cover",
                borderRadius: 14,
                border: "1px solid var(--border)",
                display: "block",
                marginBottom: 10,
              }}
            />
          ) : (
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 14,
                border: "1px dashed var(--border)",
                display: "grid",
                placeItems: "center",
                color: "var(--muted)",
                fontSize: 12,
                marginBottom: 10,
                textAlign: "center",
                padding: 8,
              }}
            >
              No logo
            </div>
          )}

          <div style={s.uploadRow}>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
            <button type="button" style={s.uploadBtn} onClick={openPicker}>
              {form.logo ? "Replace logo" : "Upload logo"}
            </button>
            {form.logo && (
              <button type="button" style={s.removePhotoBtn} onClick={() => patch({ logo: "" })}>
                Remove
              </button>
            )}
          </div>
        </div>

        <p style={{ ...s.ownerOnlyNote, margin: "0 0 16px", lineHeight: 1.55 }}>
          Story, mission, certifications, cover photo, and products are edited on the manufacturer&apos;s page after
          you save.
        </p>

        <div style={{ ...s.uploadRow, justifyContent: "flex-end" }}>
          <button type="button" style={s.adminExit} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" style={s.checkoutBtn}>
            Save manufacturer
          </button>
        </div>
      </form>

      {cropSource && (
        <Modal title="Crop logo" onClose={() => setCropSource(null)}>
          <ImageCropper
            source={cropSource}
            aspect={1}
            onCancel={() => setCropSource(null)}
            onComplete={(dataUrl) => {
              patch({ logo: dataUrl });
              setCropSource(null);
            }}
          />
        </Modal>
      )}
    </Modal>
  );
}
