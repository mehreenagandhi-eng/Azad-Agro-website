import React from "react";
import { s } from "../styles";
import { EditableText, EditableList } from "../components/EditableText";
import { SectionColorAnchor, SectionColorControl } from "../components/SectionColorControl";
import { PageSectionStack } from "../components/PageSectionStack";

export function MissionPage({
  marketplace,
  isAdmin = false,
  onUpdateMarketplace,
}) {
  const copy = marketplace.copy || {};

  const set = (field, value) => {
    if (!onUpdateMarketplace) return;
    onUpdateMarketplace((prev) => ({
      ...prev,
      [field]: typeof value === "function" ? value(prev[field]) : value,
    }));
  };

  const onStackChange = ({ stack, customSections, hiddenBuiltins }) => {
    onUpdateMarketplace?.((prev) => ({
      ...prev,
      sectionStacks: { ...(prev.sectionStacks || {}), mission: stack },
      customTextSections: { ...(prev.customTextSections || {}), mission: customSections },
      hiddenBuiltins: { ...(prev.hiddenBuiltins || {}), mission: hiddenBuiltins },
    }));
  };

  return (
    <>
      <SectionColorAnchor sectionId="contentpages" as="header" style={s.pageBanner}>
        <div style={s.pageBannerInner}>
          <p style={s.ledgerLine}>{marketplace.ledgerLine}</p>
          <EditableText
            id="txt29"
            isAdmin={isAdmin}
            value={marketplace.missionHeading}
            onSave={(v) => set("missionHeading", v)}
            textStyle={s.pageHeading}
          />
          <EditableText
            id="txt30"
            isAdmin={isAdmin}
            value={marketplace.missionIntro}
            onSave={(v) => set("missionIntro", v)}
            textStyle={s.pageIntro}
            multiline
          />
        </div>
      </SectionColorAnchor>

      <div style={{ ...s.pageBody, position: "relative" }}>
        <SectionColorControl sectionId="contentpanels" />
        <PageSectionStack
          pageKey="mission"
          isAdmin={isAdmin}
          stack={marketplace.sectionStacks?.mission}
          hiddenBuiltins={marketplace.hiddenBuiltins?.mission || []}
          customSections={marketplace.customTextSections?.mission || []}
          onChange={onStackChange}
          renderBuiltin={(id) => {
            if (id === "missionBody") {
              return (
                <EditableText
                  id="txt31"
                  isAdmin={isAdmin}
                  value={marketplace.missionBody}
                  onSave={(v) => set("missionBody", v)}
                  textStyle={s.pageParagraph}
                  multiline
                />
              );
            }
            if (id === "missionPoints") {
              return (
                <>
                  <h2 style={s.pageSubheading}>
                    {copy.missionPointsHeading || "What that means in practice"}
                  </h2>
                  <EditableList
                    isAdmin={isAdmin}
                    items={marketplace.missionPoints || []}
                    onChange={(items) => set("missionPoints", items)}
                  />
                </>
              );
            }
            return null;
          }}
        />
      </div>
    </>
  );
}
