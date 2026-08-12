import React, { useEffect, useRef, useState } from "react";
import { s } from "../styles";
import { EditableText } from "./EditableText";
import { ImageCropper } from "./ImageCropper";
import { Modal } from "./Modal";
import { Icon } from "./Icon";
import { persistPhoto, resolvePhotoSrc } from "../mediaStore";

export function CoverPhotoBlock({
  photo,
  caption,
  isAdmin,
  onPhotoChange,
  onCaptionChange,
  placeholder = "Upload a cover photo",
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

  const openPicker = () => fileRef.current?.click();

  const onFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) setCropSource(file);
  };

  const onCropComplete = async (dataUrl) => {
    setBusy(true);
    try {
      const ref = await persistPhoto(dataUrl, photo);
      onPhotoChange?.(ref);
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
      onPhotoChange?.("");
      setSrc("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={s.farmPhotoWrap}>
      <div style={s.farmPhotoFrame}>
        {src ? (
          <img src={src} alt="" style={s.farmPhotoImg} />
        ) : (
          <div style={s.farmPhotoPlaceholder}>
            <div style={{ color: "var(--accent2)" }}>
              <Icon name="leaf" size={42} />
            </div>
            <span>No photo yet</span>
          </div>
        )}
      </div>

      {isAdmin && (
        <div style={{ ...s.uploadRow, justifyContent: "center", marginTop: 12 }}>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
          <button
            type="button"
            className="aa-btn"
            style={s.uploadBtn}
            disabled={busy}
            onClick={openPicker}
          >
            📷 {src ? "Change photo" : "Upload photo"}
          </button>
          {src && (
            <button type="button" style={s.removePhotoBtn} disabled={busy} onClick={remove}>
              Remove
            </button>
          )}
        </div>
      )}

      {(caption || isAdmin) && (
        <div style={s.farmPhotoCaption}>
          <EditableText
            id="txt38"
            isAdmin={isAdmin}
            value={caption || placeholder}
            onSave={onCaptionChange}
            textStyle={{ fontFamily: "inherit", fontSize: "inherit", color: "inherit", fontStyle: "inherit" }}
          />
        </div>
      )}

      {cropSource && (
        <Modal title="Crop cover photo" onClose={() => setCropSource(null)}>
          <ImageCropper
            source={cropSource}
            aspect={4 / 3}
            onComplete={onCropComplete}
            onCancel={() => setCropSource(null)}
          />
        </Modal>
      )}
    </div>
  );
}
