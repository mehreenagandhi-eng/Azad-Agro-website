import React from "react";
import { s } from "../styles";
import { Icon } from "../components/Icon";
import { EditableText } from "../components/EditableText";
import { SectionColorAnchor, SectionColorControl } from "../components/SectionColorControl";
import { CustomTextSections } from "../components/CustomTextSections";

export function ManufacturerCard({
  mfg,
  copy = {},
  isAdmin = false,
  isOwner = false,
  onVisit,
  onApprove,
  onDeny,
  onUpdate,
}) {
  const pending = mfg.status === "pending";
  const rejected = mfg.status === "rejected";

  return (
    <article style={s.mfgCard}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={s.mfgCardLogoWrap}>
          {mfg.logo ? (
            <img src={mfg.logo} alt="" style={s.mfgCardLogo} />
          ) : (
            <div style={s.mfgCardLogoFallback}>
              <Icon name="leaf" size={30} />
            </div>
          )}
        </div>
        {pending && (
          <span style={s.pendingBadge}>{copy.pendingBadgeLabel || "Pending Review"}</span>
        )}
        {rejected && (
          <span style={s.rejectedBadge}>{copy.rejectedBadgeLabel || "Not Approved"}</span>
        )}
      </div>

      {isAdmin && onUpdate ? (
        <>
          <EditableText
            isAdmin={isAdmin}
            value={mfg.name}
            onSave={(v) => onUpdate({ ...mfg, name: v })}
            textStyle={s.mfgCardName}
          />
          <EditableText
            isAdmin={isAdmin}
            value={mfg.tagline}
            onSave={(v) => onUpdate({ ...mfg, tagline: v })}
            textStyle={s.mfgCardTagline}
            multiline
          />
        </>
      ) : (
        <>
          <h3 style={s.mfgCardName}>{mfg.name}</h3>
          <p style={s.mfgCardTagline}>{mfg.tagline}</p>
        </>
      )}

      {onVisit && (
        <button type="button" style={s.mfgVisitBtn} onClick={() => onVisit(mfg.id)}>
          {copy.visitStoreLabel || "Visit store →"}
        </button>
      )}

      {isOwner && pending && (
        <div style={s.mfgReviewRow}>
          <button type="button" style={s.approveBtn} onClick={() => onApprove?.(mfg.id)}>
            {copy.approveLabel || "Approve"}
          </button>
          <button type="button" style={s.denyBtn} onClick={() => onDeny?.(mfg.id)}>
            {copy.denyLabel || "Deny"}
          </button>
        </div>
      )}

      {isOwner && pending && (
        <p style={s.ownerOnlyNote}>Owner review — approve to list publicly.</p>
      )}
    </article>
  );
}

export function ManufacturerDirectory({
  marketplace,
  manufacturers = [],
  isAdmin = false,
  isOwner = false,
  onAddManufacturer,
  onVisit,
  onApprove,
  onDeny,
  onUpdateManufacturer,
  onUpdateMarketplace,
}) {
  const copy = marketplace.copy || {};
  const visible = manufacturers.filter(
    (m) => isAdmin || isOwner || m.status === "approved"
  );

  const set = (field, value) => {
    if (onUpdateMarketplace) onUpdateMarketplace({ ...marketplace, [field]: value });
  };

  return (
    <>
      <SectionColorAnchor sectionId="contentpages" as="header" style={s.pageBanner}>
        <div style={s.pageBannerInner}>
          <p style={s.ledgerLine}>{marketplace.ledgerLine}</p>
          <EditableText
            id="txt27"
            isAdmin={isAdmin}
            value={marketplace.directoryHeading}
            onSave={(v) => set("directoryHeading", v)}
            textStyle={s.pageHeading}
          />
          <EditableText
            id="txt28"
            isAdmin={isAdmin}
            value={marketplace.directoryIntro}
            onSave={(v) => set("directoryIntro", v)}
            textStyle={s.pageIntro}
            multiline
          />
        </div>
      </SectionColorAnchor>

      <div style={s.pageBody}>
        {isAdmin && onAddManufacturer && (
          <button type="button" style={s.addProductBtn} onClick={onAddManufacturer}>
            {copy.addManufacturerLabel || "+ Add manufacturer"}
          </button>
        )}

        {visible.length === 0 ? (
          <p style={s.pageIntro}>
            {isAdmin
              ? copy.emptyDirectoryAdminText || "No manufacturers listed yet — add one above."
              : copy.emptyDirectoryText || "No manufacturers listed yet."}
          </p>
        ) : (
          <div style={{ position: "relative" }}>
            <SectionColorControl sectionId="directory" />
            <div style={s.mfgGrid}>
            {visible.map((mfg) => (
              <ManufacturerCard
                key={mfg.id}
                mfg={mfg}
                copy={copy}
                isAdmin={isAdmin}
                isOwner={isOwner}
                onVisit={mfg.status === "approved" || isAdmin || isOwner ? onVisit : undefined}
                onApprove={onApprove}
                onDeny={onDeny}
                onUpdate={
                  onUpdateManufacturer ? (next) => onUpdateManufacturer(mfg.id, next) : undefined
                }
              />
            ))}
            </div>
          </div>
        )}

        <CustomTextSections
          isAdmin={isAdmin}
          sections={marketplace.customTextSections?.directory || []}
          onChange={(next) =>
            set("customTextSections", {
              ...(marketplace.customTextSections || {}),
              directory: next,
            })
          }
        />
      </div>
    </>
  );
}
