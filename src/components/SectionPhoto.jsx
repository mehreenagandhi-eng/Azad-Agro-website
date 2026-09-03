import React, { useEffect, useRef, useState } from "react";
import { s } from "../styles";
import { ImageCropper } from "./ImageCropper";
import { Modal } from "./Modal";
import { persistPhoto, resolvePhotoSrc } from "../mediaStore";

/**
 * Photo upload for any page section. Stores files in IndexedDB (media: refs)
 * so refresh keeps images even when localStorage is full.
 */
export function SectionPhoto({
  photo = "",
  isAdmin = false,
  onChange,
  aspect = 16 / 9,
  label = "Photo",
}) {
  const fileRef = useRef(null);
  const [cropSource, setCropSource] = useState(null);
  const [src, setSrc] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const resolved = await resolvePhotoSrc(photo);
      if (!cancelled) setSrc(resolved || "");
    })();
    return () => {
      cancelled = true;
    };
  }, [photo]);

  const onFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file && file.type.startsWith("image/")) setCropSource(file);
  };

  const onCropComplete = async (dataUrl) => {
    setBusy(true);
    try {
      const ref = await persistPhoto(dataUrl, photo);
      onChange?.(ref);
      setSrc(dataUrl);
    } finally {
      setBusy(false);
      setCropSource(null);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await persistPhoto("", photo);
      onChange?.("");
      setSrc("");
    } finally {
      setBusy(false);
    }
  };

  if (!isAdmin && !src) return null;

  return (
    <div style={s.sectionPhotoWrap}>
      {src ? (
        <div style={s.sectionPhotoFrame}>
          <img src={src} alt="" style={s.sectionPhotoImg} />
        </div>
      ) : (
        isAdmin && <div style={s.sectionPhotoEmpty}>No photo yet — upload one for this section</div>
      )}

      {isAdmin && (
        <div style={{ ...s.uploadRow, marginTop: 10 }}>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
          <button
            type="button"
            className="aa-btn"
            style={s.uploadBtn}
            disabled={busy}
            onClick={() => fileRef.current?.click()}
          >
            📷 {src ? `Change ${label.toLowerCase()}` : `Upload ${label.toLowerCase()}`}
          </button>
          {src && (
            <button type="button" style={s.removePhotoBtn} disabled={busy} onClick={remove}>
              Remove photo
            </button>
          )}
        </div>
      )}

      {cropSource && (
        <Modal title={`Crop ${label.toLowerCase()}`} onClose={() => setCropSource(null)}>
          <ImageCropper
            source={cropSource}
            aspect={aspect}
            onComplete={onCropComplete}
            onCancel={() => setCropSource(null)}
          />
        </Modal>
      )}
    </div>
  );
}
