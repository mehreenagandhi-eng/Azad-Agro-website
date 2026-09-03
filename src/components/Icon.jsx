import React from "react";
import { ResolvedImage } from "./ResolvedImage";

/** Plant / produce characters for products without a photo. */
const ICONS = {
  grain: <path d="M32 6C24 14 20 24 20 34c0 8 5.4 14 12 14s12-6 12-14c0-10-4-20-12-28z M32 48v10 M26 54h12" />,
  leaf: <path d="M16 44C16 24 34 12 50 12c0 18-10 34-30 36-2 .2-4-2-4-4z M22 40C30 32 38 24 48 16" />,
  pod: <path d="M20 16c-6 8-6 24 0 32 6 6 18 6 24 0 6-8 6-24 0-32-6-6-18-6-24 0z M22 26h20 M22 36h20" />,
  drop: <path d="M32 8c8 12 16 22 16 32a16 16 0 0 1-32 0c0-10 8-20 16-32z" />,
  jar: <path d="M22 14h20v8l4 4v24a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V26l4-4z M22 14v-4h20v4 M18 32h28" />,
  root: <path d="M32 10v14 M32 24c-8 2-10 10-8 20 M32 24c8 2 10 10 8 20 M32 24c-2 8-2 18 0 26 M22 20l-4-4 M42 20l4-4" />,
  comb: <path d="M32 8l20 12v24L32 56 12 44V20z M32 8v48 M12 20l20 12 20-12 M12 44l20-12 20 12" />,
  seed: <path d="M32 10c14 0 22 10 22 22S46 54 32 54 10 44 10 32 18 10 32 10z M20 32h24 M32 20v24" />,
  plant: (
    <>
      <path d="M32 56V28" />
      <path d="M32 40c-10-2-16-10-16-18 10 0 16 8 16 18z" />
      <path d="M32 34c10-2 16-10 16-18-10 0-16 8-16 18z" />
      <path d="M32 28c-6-8-4-16 0-20 4 4 6 12 0 20z" />
    </>
  ),
  sprout: (
    <>
      <path d="M32 54V30" />
      <path d="M32 36c-12-4-16-14-14-22 12 2 16 12 14 22z" />
      <path d="M32 34c12-4 16-14 14-22-12 2-16 12-14 22z" />
      <path d="M20 54h24" />
    </>
  ),
  flower: (
    <>
      <circle cx="32" cy="28" r="5" />
      <path d="M32 23c0-8 6-12 10-12-2 8-6 12-10 12z" />
      <path d="M37 28c8 0 12 6 12 10-8-2-12-6-12-10z" />
      <path d="M32 33c0 8-6 12-10 12 2-8 6-12 10-12z" />
      <path d="M27 28c-8 0-12-6-12-10 8 2 12 6 12 10z" />
      <path d="M32 33v23 M24 48c4-2 8-2 16 0" />
    </>
  ),
  chilli: (
    <>
      <path d="M38 12c2 4 0 8-4 10" />
      <path d="M34 20c10 4 14 16 8 28-6 10-20 12-28 4C6 42 10 28 20 24c8-4 12-4 14-4z" />
    </>
  ),
  wheat: (
    <>
      <path d="M32 56V12" />
      <path d="M32 18c-8-2-12-8-12-12 8 0 12 6 12 12z" />
      <path d="M32 18c8-2 12-8 12-12-8 0-12 6-12 12z" />
      <path d="M32 28c-8-2-12-8-12-12 8 0 12 6 12 12z" />
      <path d="M32 28c8-2 12-8 12-12-8 0-12 6-12 12z" />
      <path d="M32 38c-8-2-12-8-12-12 8 0 12 6 12 12z" />
      <path d="M32 38c8-2 12-8 12-12-8 0-12 6-12 12z" />
    </>
  ),
  citrus: (
    <>
      <circle cx="32" cy="34" r="18" />
      <path d="M32 16v36 M18 24c8 4 20 4 28 0 M18 44c8-4 20-4 28 0" />
      <path d="M28 12c2-4 6-6 10-4-2 4-6 6-10 4z" />
    </>
  ),
  herb: (
    <>
      <path d="M32 54V22" />
      <path d="M32 28c-10 0-16-8-16-14 10 2 14 8 16 14z" />
      <path d="M32 34c10 0 16-8 16-14-10 2-14 8-16 14z" />
      <path d="M32 42c-8 0-12-6-12-10 8 1 10 6 12 10z" />
      <path d="M32 42c8 0 12-6 12-10-8 1-10 6-12 10z" />
    </>
  ),
};

export const ICON_KEYS = Object.keys(ICONS);

export const ICON_LABELS = {
  grain: "Grain",
  leaf: "Leaf",
  pod: "Pod",
  drop: "Drop",
  jar: "Jar",
  root: "Root",
  comb: "Honeycomb",
  seed: "Seed",
  plant: "Plant",
  sprout: "Sprout",
  flower: "Flower",
  chilli: "Chilli",
  wheat: "Wheat",
  citrus: "Citrus",
  herb: "Herb",
};

export function Icon({ name = "leaf", size = 64, style }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
    >
      {ICONS[name] || ICONS.leaf}
    </svg>
  );
}

export function ProductVisual({ p, size = 64, style }) {
  if (p?.image) {
    return (
      <ResolvedImage
        src={p.image}
        alt={p.name || ""}
        style={{
          width: size,
          height: size,
          objectFit: "cover",
          borderRadius: 10,
          display: "block",
          ...style,
        }}
      />
    );
  }
  return <Icon name={p?.icon || "leaf"} size={size} style={style} />;
}

export { ICONS };
