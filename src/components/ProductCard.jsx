import React from "react";
import { rupee } from "../data/defaults";
import { s } from "../styles";
import { ProductVisual } from "./Icon";
import { EditableText } from "./EditableText";
import { useResolvedPhoto } from "./ResolvedImage";

export function ProductCard({
  p,
  qty = 0,
  isAdmin,
  copy,
  onEditCopy,
  onAdd,
  onSetQty,
  onEdit,
  onDelete,
  ribbon,
}) {
  const resolvedImage = useResolvedPhoto(p?.image || "");
  const hasImage = Boolean(resolvedImage);
  const addLabel = copy?.addButtonLabel ?? "Add";

  const adminBar = isAdmin && (
    <div style={s.cardAdminBar}>
      <button type="button" style={s.cardAdminBtn} onClick={() => onEdit?.(p)}>
        Edit
      </button>
      <button type="button" style={s.cardAdminBtn} onClick={() => onDelete?.(p)}>
        Delete
      </button>
    </div>
  );

  const foot = (
    <div style={hasImage ? { ...s.cardFoot, borderTop: "none", paddingTop: 0 } : s.cardFoot}>
      <div>
        <span style={hasImage ? { ...s.cardPrice, color: "var(--paper)" } : s.cardPrice}>
          {rupee(p.price)}
        </span>
        <span style={hasImage ? { ...s.cardUnit, color: "color-mix(in srgb, var(--paper) 75%, transparent)" } : s.cardUnit}>
          per {p.unit}
        </span>
      </div>

      {qty > 0 ? (
        <div style={s.cardQtyRow}>
          <button type="button" style={s.qtyBtn} onClick={() => onSetQty?.(p.id, qty - 1)} aria-label="Decrease quantity">
            −
          </button>
          <span style={s.qtyVal}>{qty}</span>
          <button type="button" style={s.qtyBtn} onClick={() => onSetQty?.(p.id, qty + 1)} aria-label="Increase quantity">
            +
          </button>
        </div>
      ) : (
        <button type="button" style={s.addBtn} onClick={() => onAdd?.(p.id)}>
          {isAdmin ? (
            <EditableText
              id="txt20"
              isAdmin
              value={addLabel}
              onSave={(v) => onEditCopy?.("addButtonLabel", v)}
              textStyle={{ color: "inherit", fontSize: "inherit", fontFamily: "inherit", fontWeight: "inherit" }}
            />
          ) : (
            addLabel
          )}
        </button>
      )}
    </div>
  );

  if (hasImage) {
    return (
      <article style={{ ...s.cardWithBg, backgroundImage: `url(${resolvedImage})` }}>
        {ribbon && <span style={s.cardRibbon}>{ribbon}</span>}
        {adminBar}
        <div style={s.cardOverlay} />
        <span style={s.cardTagOnImage}>{p.cat}</span>
        <div style={s.cardTextOnImage}>
          <h3 style={{ ...s.cardName, color: "var(--paper)", margin: 0 }}>{p.name}</h3>
          {p.note && <p style={s.cardNoteOnImage}>{p.note}</p>}
          {foot}
        </div>
      </article>
    );
  }

  return (
    <article style={s.card}>
      {ribbon && <span style={s.cardRibbon}>{ribbon}</span>}
      {adminBar}
      <div style={s.cardCharacterStage} aria-hidden="true">
        <ProductVisual p={p} size={72} style={{ color: "var(--accent2)" }} />
      </div>
      <span style={s.cardTag}>{p.cat}</span>
      <h3 style={s.cardName}>{p.name}</h3>
      {p.note && <p style={s.cardNote}>{p.note}</p>}
      {p.stock != null && p.stock !== "" && (
        <p style={{ ...s.cardNote, marginTop: -2 }}>Stock: {p.stock}</p>
      )}
      {foot}
    </article>
  );
}
