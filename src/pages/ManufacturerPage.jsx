import React, { useMemo, useState } from "react";
import { s } from "../styles";
import { Icon } from "../components/Icon";
import { EditableText, EditableList } from "../components/EditableText";
import { ProductCard } from "../components/ProductCard";
import { CoverPhotoBlock } from "../components/CoverPhotoBlock";
import { SectionColorAnchor, SectionColorControl } from "../components/SectionColorControl";
import { PageSectionStack } from "../components/PageSectionStack";
import { isSectionVisible } from "../components/RemovableSection";
import { ResolvedImage } from "../components/ResolvedImage";
import { UpiQrSetup } from "../components/UpiQrSetup";
const TABS = [
  { id: "order", labelKey: "orderNowLabel", fallback: "Order Now" },
  { id: "story", labelKey: "ourStoryLabel", fallback: "Our Story" },
  { id: "contact", labelKey: "contactInfoLabel", fallback: "Contact Information" },
];

export function ManufacturerPage({
  manufacturer,
  marketplace,
  theme,
  isAdmin = false,
  isOwner = false,
  tab = "order",
  onTabChange,
  onBack,
  onApprove,
  onDeny,
  onUpdateManufacturer,
  onToggleSectionVisible,
  cart = {},
  onAddToCart,
  onSetCartQty,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onEditCopy,
}) {
  const copy = marketplace.copy || {};
  const [category, setCategory] = useState(copy.allCategoryLabel || "All");

  const setMfg = (field, value) => {
    if (!onUpdateManufacturer) return;
    onUpdateManufacturer((prev) => ({
      ...prev,
      [field]: typeof value === "function" ? value(prev[field]) : value,
    }));
  };

  const products = manufacturer.products || [];
  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.cat).filter(Boolean))];
    return [copy.allCategoryLabel || "All", ...cats];
  }, [products, copy.allCategoryLabel]);

  const allLabel = copy.allCategoryLabel || "All";
  const filtered = category === allLabel ? products : products.filter((p) => p.cat === category);
  const featured = products.filter((p) => p.featured);

  const showReviewBanner =
    (isOwner || isAdmin) &&
    (manufacturer.status === "pending" || manufacturer.status === "rejected");

  const reviewText =
    manufacturer.status === "rejected"
      ? copy.rejectedBannerText
      : copy.reviewBannerText;

  const sectionVisible = (id) => isSectionVisible(theme, id);

  const storyHidden = Array.isArray(manufacturer.hiddenBuiltins)
    ? manufacturer.hiddenBuiltins
    : ["mfgStory", "mfgMission", "mfgValues", "mfgPractices", "mfgCert"].filter(
        (id) => !sectionVisible(id)
      );

  const onStoryStackChange = ({ stack, customSections, hiddenBuiltins, sectionPhotos }) => {
    onUpdateManufacturer?.((prev) => ({
      ...prev,
      sectionStack: stack,
      customTextSections: customSections,
      hiddenBuiltins,
      sectionPhotos: sectionPhotos || {},
    }));
  };

  return (
    <>
      {onBack && (
        <div style={s.backBar}>
          <button type="button" style={s.backLinkInBar} onClick={onBack}>
            ← Back to directory
          </button>
        </div>
      )}

      <SectionColorAnchor sectionId="contentpages" as="header" style={s.pageBanner}>
        <div style={s.pageBannerInner}>
          {showReviewBanner && (
            <div style={s.reviewBanner}>
              {reviewText}
              {manufacturer.status === "pending" && isOwner && (
                <div style={s.mfgReviewRow}>
                  <button type="button" style={s.approveBtn} onClick={() => onApprove?.(manufacturer.id)}>
                    {copy.approveLabel || "Approve"}
                  </button>
                  <button type="button" style={s.denyBtn} onClick={() => onDeny?.(manufacturer.id)}>
                    {copy.denyLabel || "Deny"}
                  </button>
                </div>
              )}
            </div>
          )}

          <div style={s.mfgHeroGrid}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                <div style={s.mfgCardLogoWrap}>
                  {manufacturer.logo ? (
                    <ResolvedImage src={manufacturer.logo} alt="" style={s.mfgCardLogo} />
                  ) : (
                    <div style={s.mfgCardLogoFallback}>
                      <Icon name="leaf" size={30} />
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <EditableText
                    isAdmin={isAdmin}
                    value={manufacturer.name}
                    onSave={(v) => setMfg("name", v)}
                    textStyle={s.pageHeading}
                  />
                  <EditableText
                    isAdmin={isAdmin}
                    value={manufacturer.tagline}
                    onSave={(v) => setMfg("tagline", v)}
                    textStyle={s.pageIntro}
                  />
                </div>
              </div>
            </div>

            <CoverPhotoBlock
              photo={manufacturer.coverPhoto}
              caption={manufacturer.coverCaption}
              onPhotoChange={(v) => setMfg("coverPhoto", v)}
              onCaptionChange={(v) => setMfg("coverCaption", v)}
              isAdmin={isAdmin}
              placeholder="Upload a cover photo for this manufacturer"
            />
          </div>
        </div>
      </SectionColorAnchor>

      <SectionColorAnchor sectionId="mfgtabs" as="nav" style={s.mfgSubNav} aria-label="Manufacturer sections">
        <div style={s.mfgSubNavInner}>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              style={{
                ...s.mfgSubNavPill,
                ...(tab === t.id ? s.mfgSubNavPillActive : {}),
              }}
              onClick={() => onTabChange?.(t.id)}
            >
              {copy[t.labelKey] || t.fallback}
            </button>
          ))}
        </div>
      </SectionColorAnchor>

      <div style={s.pageBody}>
        {tab === "story" && (
          <PageSectionStack
            pageKey="manufacturerStory"
            isAdmin={isAdmin}
            stack={manufacturer.sectionStack}
            hiddenBuiltins={storyHidden}
            customSections={manufacturer.customTextSections || []}
            sectionPhotos={manufacturer.sectionPhotos || {}}
            onChange={onStoryStackChange}
            renderBuiltin={(id) => {
              if (id === "mfgStory") {
                return (
                  <>
                    <h2 style={s.pageSubheading}>{copy.ourStoryLabel || "Our Story"}</h2>
                    <EditableText
                      isAdmin={isAdmin}
                      value={manufacturer.story}
                      onSave={(v) => setMfg("story", v)}
                      textStyle={s.pageParagraph}
                      multiline
                    />
                  </>
                );
              }
              if (id === "mfgMission") {
                return (
                  <>
                    <h2 style={s.pageSubheading}>{copy.missionHeading || "Our mission"}</h2>
                    <EditableText
                      isAdmin={isAdmin}
                      value={manufacturer.mission}
                      onSave={(v) => setMfg("mission", v)}
                      textStyle={s.pageParagraph}
                      multiline
                    />
                  </>
                );
              }
              if (id === "mfgValues") {
                return (
                  <>
                    <h2 style={s.pageSubheading}>
                      {copy.valuesHeading || "What we hold ourselves to"}
                    </h2>
                    <EditableList
                      isAdmin={isAdmin}
                      items={manufacturer.values || []}
                      onChange={(items) => setMfg("values", items)}
                    />
                  </>
                );
              }
              if (id === "mfgPractices") {
                return (
                  <>
                    <h2 style={s.pageSubheading}>{copy.practicesHeading || "How we grow"}</h2>
                    <EditableText
                      isAdmin={isAdmin}
                      value={manufacturer.practicesIntro}
                      onSave={(v) => setMfg("practicesIntro", v)}
                      textStyle={s.pageParagraph}
                      multiline
                    />
                    <EditableList
                      isAdmin={isAdmin}
                      items={manufacturer.practicesPoints || []}
                      onChange={(items) => setMfg("practicesPoints", items)}
                    />
                  </>
                );
              }
              if (id === "mfgCert") {
                return (
                  <>
                    <h2 style={s.pageSubheading}>{copy.certHeading || "Certifications"}</h2>
                    <EditableText
                      isAdmin={isAdmin}
                      value={manufacturer.certIntro}
                      onSave={(v) => setMfg("certIntro", v)}
                      textStyle={s.pageParagraph}
                      multiline
                    />
                    <EditableList
                      isAdmin={isAdmin}
                      items={manufacturer.certBadges || []}
                      onChange={(items) => setMfg("certBadges", items)}
                      variant="badge"
                      addLabel="+ Add badge"
                    />
                  </>
                );
              }
              return null;
            }}
          />
        )}

        {tab === "contact" && (
          <section style={{ position: "relative" }}>
            <SectionColorControl sectionId="contact" />
            <h2 style={s.pageSubheading}>{copy.contactHeading || "Contact & delivery"}</h2>
            <div style={s.contactGrid}>
              <div style={s.contactDetailsCard}>
                <div style={s.contactRow}>
                  <Icon name="leaf" size={20} />
                  <EditableText
                    isAdmin={isAdmin}
                    value={manufacturer.contactEmail}
                    onSave={(v) => setMfg("contactEmail", v)}
                    textStyle={s.contactText}
                  />
                </div>
                <div style={s.contactRow}>
                  <Icon name="pod" size={20} />
                  <EditableText
                    isAdmin={isAdmin}
                    value={manufacturer.contactPhone}
                    onSave={(v) => setMfg("contactPhone", v)}
                    textStyle={s.contactText}
                  />
                </div>
                <div style={s.contactRow}>
                  <Icon name="grain" size={20} />
                  <EditableText
                    isAdmin={isAdmin}
                    value={manufacturer.contactAddress}
                    onSave={(v) => setMfg("contactAddress", v)}
                    textStyle={s.contactText}
                    multiline
                  />
                </div>
              </div>
              <div style={s.contactFormCard}>
                <h3 style={s.sectionTitle}>Delivery</h3>
                <EditableText
                  isAdmin={isAdmin}
                  value={manufacturer.deliveryInfo}
                  onSave={(v) => setMfg("deliveryInfo", v)}
                  textStyle={s.contactText}
                  multiline
                />
              </div>
              <div style={{ ...s.contactFormCard, gridColumn: "1 / -1" }}>
                <UpiQrSetup
                  manufacturer={manufacturer}
                  isAdmin={isAdmin}
                  onChange={(partial) =>
                    onUpdateManufacturer?.((prev) => ({ ...prev, ...partial }))
                  }
                />
              </div>
            </div>
          </section>
        )}

        {tab === "order" && (
          <>
            <h2 style={s.pageSubheading}>{copy.shopHeading || "Shop this manufacturer"}</h2>

            {isAdmin && products.length > 0 && (
              <div style={s.upiCatalogBanner}>
                <div>
                  <strong style={{ display: "block", marginBottom: 4 }}>
                    Catalog ready? Make your payment QR
                  </strong>
                  <span style={{ fontSize: 13, lineHeight: 1.45, color: "var(--muted)" }}>
                    {manufacturer.upiId?.trim()
                      ? "Open Contact Information to generate or update your UPI QR so buyers can pay you at checkout."
                      : "Add your UPI ID and generate a QR code under Contact Information. Buyers pay you directly with Google Pay, PhonePe, or Paytm."}
                  </span>
                </div>
                <button
                  type="button"
                  style={s.upiCatalogBannerBtn}
                  onClick={() => onTabChange?.("contact")}
                >
                  {manufacturer.upiId?.trim() ? "Manage UPI QR →" : "Make UPI QR →"}
                </button>
              </div>
            )}

            <SectionColorAnchor sectionId="quicknav" as="nav" style={s.quickNav} aria-label="Product categories">
              <div style={s.quickNavInner}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    style={{
                      ...s.quickNavPill,
                      ...(category === cat ? s.quickNavPillActive : {}),
                    }}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </SectionColorAnchor>

            {featured.length > 0 && category === allLabel && (
              <SectionColorAnchor sectionId="featured" as="section" style={s.featuredSection}>
                <h3 style={s.featuredHeading}>{copy.featuredHeading || "Featured this season"}</h3>
                <div style={s.featuredGrid}>
                  {featured.map((p) => (
                    <ProductCard
                      key={p.id}
                      p={p}
                      copy={copy}
                      isAdmin={isAdmin}
                      qty={cart[`${manufacturer.id}::${p.id}`] || 0}
                      onAdd={onAddToCart}
                      onSetQty={onSetCartQty}
                      onEdit={onEditProduct}
                      onDelete={onDeleteProduct}
                      onEditCopy={onEditCopy}
                      ribbon={copy.featuredHeading || "Featured"}
                    />
                  ))}
                </div>
              </SectionColorAnchor>
            )}

            <SectionColorAnchor sectionId="cards" as="section" style={s.shopSection}>
              {isAdmin && onAddProduct && (
                <button type="button" style={s.addProductBtn} onClick={onAddProduct}>
                  {copy.addProductButtonLabel || "+ Add product"}
                </button>
              )}

              {filtered.length === 0 ? (
                <p style={s.pageIntro}>{copy.emptyShopText || "No products in this category yet."}</p>
              ) : (
                <div style={s.grid}>
                  {filtered
                    .filter((p) => !(category === allLabel && p.featured))
                    .map((p) => (
                      <ProductCard
                        key={p.id}
                        p={p}
                        copy={copy}
                        isAdmin={isAdmin}
                        qty={cart[`${manufacturer.id}::${p.id}`] || 0}
                        onAdd={onAddToCart}
                        onSetQty={onSetCartQty}
                        onEdit={onEditProduct}
                        onDelete={onDeleteProduct}
                        onEditCopy={onEditCopy}
                      />
                    ))}
                </div>
              )}
            </SectionColorAnchor>
          </>
        )}
      </div>
    </>
  );
}
