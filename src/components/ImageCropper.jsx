import React, { useCallback, useEffect, useRef, useState } from "react";
import { s } from "../styles";

export const CROP_VIEW_W = 300;

export function clampCropPos(pos, imgW, imgH, zoom, viewW, viewH) {
  const scaledW = imgW * zoom;
  const scaledH = imgH * zoom;
  const minX = viewW - scaledW;
  const minY = viewH - scaledH;
  return {
    x: Math.min(0, Math.max(minX, pos.x)),
    y: Math.min(0, Math.max(minY, pos.y)),
  };
}

function coverZoom(imgW, imgH, viewW, viewH) {
  return Math.max(viewW / imgW, viewH / imgH);
}

function centerPos(imgW, imgH, zoom, viewW, viewH) {
  const scaledW = imgW * zoom;
  const scaledH = imgH * zoom;
  return clampCropPos(
    { x: (viewW - scaledW) / 2, y: (viewH - scaledH) / 2 },
    imgW,
    imgH,
    zoom,
    viewW,
    viewH
  );
}

export function ImageCropper({ source, aspect = 6 / 7, onComplete, onConfirm, onCancel }) {
  const finish = onComplete || onConfirm;
  const viewW = CROP_VIEW_W;
  const viewH = CROP_VIEW_W / aspect;

  const [imgUrl, setImgUrl] = useState(null);
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ x: 0, y: 0, startX: 0, startY: 0 });
  const imgRef = useRef(null);

  useEffect(() => {
    if (!source) {
      setImgUrl(null);
      return;
    }
    if (typeof source === "string") {
      setImgUrl(source);
      return;
    }
    if (source instanceof File) {
      const reader = new FileReader();
      reader.onload = () => setImgUrl(reader.result);
      reader.readAsDataURL(source);
      return () => reader.abort?.();
    }
    setImgUrl(null);
  }, [source]);

  const onImgLoad = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const z = coverZoom(w, h, viewW, viewH);
    setNatural({ w, h });
    setZoom(z);
    setPos(centerPos(w, h, z, viewW, viewH));
  }, [viewW, viewH]);

  const updatePos = useCallback(
    (next) => {
      setPos(clampCropPos(next, natural.w, natural.h, zoom, viewW, viewH));
    },
    [natural.w, natural.h, zoom, viewW, viewH]
  );

  const onPointerDown = (e) => {
    e.preventDefault();
    setDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      x: pos.x,
      y: pos.y,
    };
  };

  useEffect(() => {
    if (!dragging) return;

    const onPointerMove = (e) => {
      const d = dragRef.current;
      updatePos({
        x: d.x + (e.clientX - d.startX),
        y: d.y + (e.clientY - d.startY),
      });
    };

    const onPointerUp = () => setDragging(false);

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [dragging, updatePos]);

  const onWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    const nextZoom = Math.min(4, Math.max(coverZoom(natural.w, natural.h, viewW, viewH), zoom + delta));
    const ratio = nextZoom / zoom;
    const mx = e.clientX - e.currentTarget.getBoundingClientRect().left;
    const my = e.clientY - e.currentTarget.getBoundingClientRect().top;
    const nextPos = {
      x: mx - (mx - pos.x) * ratio,
      y: my - (my - pos.y) * ratio,
    };
    setZoom(nextZoom);
    setPos(clampCropPos(nextPos, natural.w, natural.h, nextZoom, viewW, viewH));
  };

  const handleCrop = () => {
    const img = imgRef.current;
    if (!img || !natural.w) return;

    const srcX = -pos.x / zoom;
    const srcY = -pos.y / zoom;
    const srcW = viewW / zoom;
    const srcH = viewH / zoom;

    const outW = Math.round(viewW * 2);
    const outH = Math.round(viewH * 2);
    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, outW, outH);
    finish?.(canvas.toDataURL("image/jpeg", 0.82));
  };

  if (!imgUrl) {
    return <p style={{ color: "var(--muted)", margin: 0 }}>Loading image…</p>;
  }

  return (
    <div>
      <p style={s.previewLabel}>Drag to reposition · scroll to zoom</p>
      <div
        style={{
          width: viewW,
          maxWidth: "100%",
          height: viewH,
          margin: "0 auto",
          position: "relative",
          overflow: "hidden",
          borderRadius: 12,
          border: "1px solid var(--border)",
          background: "color-mix(in srgb, var(--ink) 6%, var(--paper))",
          cursor: dragging ? "grabbing" : "grab",
          touchAction: "none",
        }}
        onPointerDown={onPointerDown}
        onWheel={onWheel}
      >
        <img
          ref={imgRef}
          src={imgUrl}
          alt=""
          draggable={false}
          onLoad={onImgLoad}
          style={{
            position: "absolute",
            left: pos.x,
            top: pos.y,
            width: natural.w * zoom,
            height: natural.h * zoom,
            maxWidth: "none",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxShadow: "inset 0 0 0 2px var(--accent)",
            pointerEvents: "none",
          }}
        />
      </div>

      <div style={{ ...s.uploadRow, marginTop: 14, justifyContent: "flex-end" }}>
        <button type="button" style={s.adminExit} onClick={onCancel}>
          Cancel
        </button>
        <button type="button" style={s.uploadBtn} onClick={handleCrop}>
          Apply crop
        </button>
      </div>
    </div>
  );
}
