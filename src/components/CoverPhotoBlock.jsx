import React, { useRef, useState } from "react";
import { s } from "../styles";
import { EditableText } from "./EditableText";
import { ImageCropper } from "./ImageCropper";
import { Modal } from "./Modal";
import { Icon } from "./Icon";

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

  const openPicker = () => fileRef.current?.click();

  const onFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) setCropSource(file);
  };

  const onCropComplete = (dataUrl) => {
    onPhotoChange?.(dataUrl);
    setCropSource(null);
  };

  return (
    <div style={s.farmPhotoWrap}>
      <div style={s.farmPhotoFrame}>
        {photo ? (
          <img src={photo} alt="" style={s.farmPhotoImg} />
        ) : (
          <div style={s.farmPhotoPlaceholder}>
            <div style={{ color: "var(--accent2)" }}>
              <Icon name="leaf" size={42} />
            </div>
            <span>{isAdmin ? "No photo yet" : "No photo yet"}</span>
          </div>
        )}
      </div>

      {isAdmin && (
        <div style={{ ...s.uploadRow, justifyContent: "center", marginTop: 12 }}>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
          <button type="button" className="aa-btn" style={s.uploadBtn} onClick={openPicker}>
            📷 {photo ? "Change photo" : "Upload photo"}
          </button>
          {photo && (
            <button type="button" style={s.removePhotoBtn} onClick={() => onPhotoChange?.("")}>
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
            onConfirm={onCropComplete}
            onCancel={() => setCropSource(null)}
          />
        </Modal>
      )}
    </div>
  );
}
