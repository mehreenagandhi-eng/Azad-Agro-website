import React from "react";
import { s } from "../styles";
import { EditableText, EditableList } from "../components/EditableText";
import { RemovableSection, isSectionVisible } from "../components/RemovableSection";

export function MissionPage({
  marketplace,
  theme,
  isAdmin = false,
  onUpdateMarketplace,
  onToggleSectionVisible,
}) {
  const copy = marketplace.copy || {};
  const bodyVisible = isSectionVisible(theme, "missionBody");
  const pointsVisible = isSectionVisible(theme, "missionPoints");

  const set = (field, value) => {
    if (onUpdateMarketplace) onUpdateMarketplace({ ...marketplace, [field]: value });
  };

  return (
    <>
      <header style={s.pageBanner}>
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
      </header>

      <div style={s.pageBody}>
        <RemovableSection
          sectionId="missionBody"
          theme={theme}
          isAdmin={isAdmin}
          label="Mission body"
          onToggleVisible={onToggleSectionVisible}
        >
          {bodyVisible && (
            <EditableText
              id="txt31"
              isAdmin={isAdmin}
              value={marketplace.missionBody}
              onSave={(v) => set("missionBody", v)}
              textStyle={s.pageParagraph}
              multiline
            />
          )}
        </RemovableSection>

        <RemovableSection
          sectionId="missionPoints"
          theme={theme}
          isAdmin={isAdmin}
          label="Mission points"
          onToggleVisible={onToggleSectionVisible}
        >
          {pointsVisible && (
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
          )}
        </RemovableSection>
      </div>
    </>
  );
}
