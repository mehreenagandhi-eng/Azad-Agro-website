import React from "react";
import { s } from "../styles";
import { EditableText } from "../components/EditableText";
import { SectionColorAnchor, SectionColorControl } from "../components/SectionColorControl";
import { CustomTextSections } from "../components/CustomTextSections";

function StepSection({
  heading,
  intro,
  steps = [],
  headingId,
  introId,
  isAdmin = false,
  onHeadingChange,
  onIntroChange,
  onStepsChange,
}) {
  return (
    <section style={s.stepSection}>
      <EditableText
        id={headingId}
        isAdmin={isAdmin}
        value={heading}
        onSave={onHeadingChange}
        textStyle={s.stepSectionHeading}
      />
      <hr style={s.stepSectionDivider} />
      <EditableText
        id={introId}
        isAdmin={isAdmin}
        value={intro}
        onSave={onIntroChange}
        textStyle={s.pageIntro}
        multiline
      />
      <ol style={s.stepsList}>
        {steps.map((step, i) => (
          <li key={i} style={s.stepRow}>
            <span style={s.stepNum}>{i + 1}</span>
            {isAdmin && onStepsChange ? (
              <EditableText
                isAdmin={isAdmin}
                value={step}
                onSave={(v) => {
                  const next = [...steps];
                  next[i] = v;
                  onStepsChange(next);
                }}
                textStyle={s.stepText}
                multiline
              />
            ) : (
              <p style={s.stepText}>{step}</p>
            )}
            {isAdmin && onStepsChange && (
              <button
                type="button"
                style={s.listRemoveBtn}
                onClick={() => onStepsChange(steps.filter((_, j) => j !== i))}
                aria-label="Remove step"
              >
                ×
              </button>
            )}
          </li>
        ))}
      </ol>
      {isAdmin && onStepsChange && (
        <button
          type="button"
          style={s.showSectionBtn}
          onClick={() => onStepsChange([...steps, "New step"])}
        >
          + Add step
        </button>
      )}
    </section>
  );
}

export function GetStartedPage({
  marketplace,
  isAdmin = false,
  onUpdateMarketplace,
  onBrowseManufacturers,
  onAddManufacturer,
}) {
  const copy = marketplace.copy || {};

  const set = (field, value) => {
    if (!onUpdateMarketplace) return;
    onUpdateMarketplace((prev) => ({
      ...prev,
      [field]: typeof value === "function" ? value(prev[field]) : value,
    }));
  };

  return (
    <>
      <SectionColorAnchor sectionId="contentpages" as="header" style={s.pageBanner}>
        <div style={s.pageBannerInner}>
          <p style={s.ledgerLine}>{marketplace.ledgerLine}</p>
          <EditableText
            id="txt33"
            isAdmin={isAdmin}
            value={marketplace.getStartedHeading}
            onSave={(v) => set("getStartedHeading", v)}
            textStyle={s.pageHeading}
          />
          <EditableText
            id="txt34"
            isAdmin={isAdmin}
            value={marketplace.getStartedIntro}
            onSave={(v) => set("getStartedIntro", v)}
            textStyle={s.pageIntro}
            multiline
          />
        </div>
      </SectionColorAnchor>

      <div style={{ ...s.pageBody, position: "relative" }}>
        <SectionColorControl sectionId="contentpanels" />
        <StepSection
          heading={marketplace.buyerHeading}
          intro={marketplace.buyerIntro}
          steps={marketplace.buyerSteps || []}
          headingId="txt35"
          introId="txt36"
          isAdmin={isAdmin}
          onHeadingChange={(v) => set("buyerHeading", v)}
          onIntroChange={(v) => set("buyerIntro", v)}
          onStepsChange={(items) => set("buyerSteps", items)}
        />

        {onBrowseManufacturers && (
          <button type="button" style={s.shopNowBtn} onClick={onBrowseManufacturers}>
            {marketplace.browseLabel || copy.navManufacturers || "Browse Manufacturers"}
          </button>
        )}

        <StepSection
          heading={marketplace.manufacturerHeading}
          intro={marketplace.manufacturerIntro}
          steps={marketplace.manufacturerSteps || []}
          headingId="txt37"
          introId="txt38"
          isAdmin={isAdmin}
          onHeadingChange={(v) => set("manufacturerHeading", v)}
          onIntroChange={(v) => set("manufacturerIntro", v)}
          onStepsChange={(items) => set("manufacturerSteps", items)}
        />

        {isAdmin && onAddManufacturer && (
          <button type="button" style={s.addProductBtn} onClick={onAddManufacturer}>
            {copy.addManufacturerLabel || "+ Add manufacturer"}
          </button>
        )}

        <CustomTextSections
          isAdmin={isAdmin}
          sections={marketplace.customTextSections?.getstarted || []}
          onChange={(next) =>
            set("customTextSections", (prev) => ({
              ...(prev || {}),
              getstarted: next,
            }))
          }
        />
      </div>
    </>
  );
}

export { StepSection };
