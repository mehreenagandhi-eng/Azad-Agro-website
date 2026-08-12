import React, { useEffect, useState } from "react";
import { isMediaRef, resolvePhotoSrc } from "../mediaStore";

/** Renders an <img> for a data URL or media: IndexedDB ref. */
export function ResolvedImage({ src, alt = "", style, ...rest }) {
  const [resolved, setResolved] = useState(() => (isMediaRef(src) ? "" : src || ""));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next = await resolvePhotoSrc(src);
      if (!cancelled) setResolved(next || "");
    })();
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!resolved) return null;
  return <img src={resolved} alt={alt} style={style} {...rest} />;
}

/** Hook for places that need a CSS background-image url. */
export function useResolvedPhoto(src) {
  const [resolved, setResolved] = useState(() => (isMediaRef(src) ? "" : src || ""));
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next = await resolvePhotoSrc(src);
      if (!cancelled) setResolved(next || "");
    })();
    return () => {
      cancelled = true;
    };
  }, [src]);
  return resolved;
}
