import React from "react";
import { s } from "../styles";
import { EditableText } from "../components/EditableText";
import { CoverPhotoBlock } from "../components/CoverPhotoBlock";

/**
 * Homepage is branding-only (no shopping CTAs), matching the seed handoff.
 */
export function MarketplaceHome({ marketplace, isAdmin = false, onUpdateMarketplace }) {
  const set = (field, value) => {
    if (onUpdateMarketplace) onUpdateMarketplace({ ...marketplace, [field]: value });
  };

  return (
    <main>
      <section style={s.hero}>
        <div className="aa-hero-grid" style={s.heroGrid}>
          <div>
            <EditableText
              id="txt21"
              isAdmin={isAdmin}
              value={marketplace.ledgerLine}
              onSave={(v) => set("ledgerLine", v)}
              textStyle={s.ledgerLine}
            />
            <h1 style={s.heroTitle}>
              <EditableText
                id="txt22"
                isAdmin={isAdmin}
                value={marketplace.heroLine1}
                onSave={(v) => set("heroLine1", v)}
                textStyle={s.heroTitle}
              />
              <br />
              <EditableText
                id="txt23"
                isAdmin={isAdmin}
                value={marketplace.heroLine2}
                onSave={(v) => set("heroLine2", v)}
                textStyle={s.heroTitle}
              />
            </h1>
            <EditableText
              id="txt24"
              isAdmin={isAdmin}
              value={marketplace.heroText}
              onSave={(v) => set("heroText", v)}
              textStyle={s.heroText}
              multiline
            />

            <div style={s.heroLedger}>
              {[1, 2, 3].map((n) => (
                <React.Fragment key={n}>
                  <div style={s.ledgerItem}>
                    <EditableText
                      id={n === 1 ? "txt25" : undefined}
                      isAdmin={isAdmin}
                      value={marketplace[`stat${n}Num`]}
                      onSave={(v) => set(`stat${n}Num`, v)}
                      textStyle={s.ledgerNum}
                    />
                    <EditableText
                      id={n === 1 ? "txt26" : undefined}
                      isAdmin={isAdmin}
                      value={marketplace[`stat${n}Label`]}
                      onSave={(v) => set(`stat${n}Label`, v)}
                      textStyle={s.ledgerLabel}
                    />
                  </div>
                  {n < 3 && <div style={s.ledgerDivider} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div style={s.homeManufacturerPreview}>
            <CoverPhotoBlock
              isAdmin={isAdmin}
              photo={marketplace.heroPhoto}
              caption={marketplace.heroPhotoCaption}
              onPhotoChange={(dataUrl) => set("heroPhoto", dataUrl)}
              onCaptionChange={(v) => set("heroPhotoCaption", v)}
              placeholder="Add a photo that represents this marketplace"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
