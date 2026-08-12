import React, { useMemo, useState } from "react";
import { s } from "../styles";
import { ResolvedImage } from "./ResolvedImage";
import { SectionPhoto } from "./SectionPhoto";
import { persistPhoto } from "../mediaStore";
import { buildUpiPayUrl, fetchQrDataUrl, qrImageUrl } from "../utils/upi";

const DEFAULT_STEPS = [
  "Finish your product catalog on the Order Now tab (names, prices, units, photos).",
  "Enter the UPI ID from Google Pay, PhonePe, Paytm, or your bank app (example: farmname@upi).",
  "Tap Generate QR code — buyers will scan this at checkout.",
  "Save the QR to your storefront (or upload the QR screenshot from your UPI app).",
  "Optional: add your FSSAI license/registration if you sell food products.",
  "When a buyer taps Order online, they see your total, scan your QR, pay you, then confirm.",
];

export function UpiQrSetup({
  manufacturer,
  isAdmin = false,
  onChange,
  steps = DEFAULT_STEPS,
}) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [previewBump, setPreviewBump] = useState(0);

  const upiId = String(manufacturer?.upiId || "").trim();
  const farmName = manufacturer?.name || "Farm";
  const savedQr = manufacturer?.upiQrPhoto || "";

  const upiPayUrl = useMemo(
    () =>
      buildUpiPayUrl({
        upiId,
        payeeName: farmName,
        note: `${farmName} order`,
      }),
    [upiId, farmName]
  );

  const generatedPreview = upiPayUrl
    ? `${qrImageUrl(upiPayUrl, 280)}${previewBump ? `&t=${previewBump}` : ""}`
    : "";

  const patch = (partial) => onChange?.(partial);

  const generateAndSave = async () => {
    if (!upiId || !onChange) return;
    setBusy(true);
    setStatus("");
    try {
      const dataUrl = await fetchQrDataUrl(upiPayUrl, 320);
      const ref = await persistPhoto(dataUrl, savedQr);
      patch({ upiQrPhoto: ref });
      setPreviewBump(Date.now());
      setStatus("QR saved to your storefront. Buyers will see it at checkout.");
    } catch {
      setPreviewBump(Date.now());
      setStatus(
        "Preview ready. If Save failed, download the QR or upload a screenshot from your UPI app below."
      );
    } finally {
      setBusy(false);
    }
  };

  const downloadPreview = () => {
    if (!generatedPreview) return;
    const a = document.createElement("a");
    a.href = qrImageUrl(upiPayUrl, 320);
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.download = `${farmName.replace(/\s+/g, "-").toLowerCase() || "farm"}-upi-qr.png`;
    a.click();
  };

  return (
    <div style={s.upiSetupWrap}>
      <h3 style={s.sectionTitle}>Make your UPI QR code</h3>
      <p style={{ ...s.contactText, marginBottom: 14 }}>
        After your catalog is ready, set up direct UPI payment. Buyers pay your farm with Google Pay,
        PhonePe, Paytm, or any UPI app — no Razorpay or business gateway needed.
      </p>

      <ol style={s.upiStepsList}>
        {steps.map((step, i) => (
          <li key={i} style={s.upiStepItem}>
            <span style={s.upiStepNum}>{i + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      {isAdmin ? (
        <>
          <label style={s.formRow}>
            <span style={s.label}>Your UPI ID</span>
            <input
              style={s.input}
              placeholder="farmname@upi"
              value={manufacturer?.upiId || ""}
              onChange={(e) => patch({ upiId: e.target.value })}
              autoComplete="off"
            />
          </label>

          <label style={s.formRow}>
            <span style={s.label}>FSSAI license / registration (optional)</span>
            <input
              style={s.input}
              placeholder="e.g. 10012021000123"
              value={manufacturer?.fssaiLicense || ""}
              onChange={(e) => patch({ fssaiLicense: e.target.value })}
            />
          </label>

          <div style={s.upiSetupActions}>
            <button
              type="button"
              style={{
                ...s.uploadBtn,
                ...(!upiId || busy ? { opacity: 0.5, cursor: "not-allowed" } : null),
              }}
              disabled={!upiId || busy}
              onClick={generateAndSave}
            >
              {busy ? "Generating…" : savedQr ? "Regenerate & save QR" : "Generate QR code"}
            </button>
            {generatedPreview ? (
              <button type="button" style={s.uploadBtn} onClick={downloadPreview}>
                Open / download QR
              </button>
            ) : null}
          </div>

          {(generatedPreview || savedQr) && (
            <div style={s.upiSetupPreviewRow}>
              {generatedPreview ? (
                <div style={s.upiSetupPreview}>
                  <div style={s.upiSetupPreviewLabel}>Generated from your UPI ID</div>
                  <div style={s.upiQrFrame}>
                    <img src={generatedPreview} alt={`${farmName} UPI QR`} style={s.upiQrImg} />
                  </div>
                </div>
              ) : null}
              {savedQr ? (
                <div style={s.upiSetupPreview}>
                  <div style={s.upiSetupPreviewLabel}>Saved on storefront</div>
                  <div style={s.upiQrFrame}>
                    <ResolvedImage src={savedQr} alt={`${farmName} saved UPI QR`} style={s.upiQrImg} />
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {status ? <p style={s.upiSetupStatus}>{status}</p> : null}

          <div style={{ marginTop: 16 }}>
            <p style={{ ...s.contactText, marginBottom: 8, fontSize: 13, color: "var(--muted)" }}>
              Or upload the QR screenshot from your UPI app:
            </p>
            <SectionPhoto
              photo={savedQr}
              isAdmin
              label="UPI QR"
              aspect={1}
              onChange={(photo) => patch({ upiQrPhoto: photo })}
            />
          </div>
        </>
      ) : (
        <>
          <p style={s.contactText}>
            UPI ID: <strong>{upiId || "Not added yet"}</strong>
          </p>
          {manufacturer?.fssaiLicense?.trim() ? (
            <p style={s.contactText}>FSSAI: {manufacturer.fssaiLicense}</p>
          ) : null}
          {(savedQr || generatedPreview) && (
            <div style={{ marginTop: 12, maxWidth: 220 }}>
              {savedQr ? (
                <ResolvedImage
                  src={savedQr}
                  alt={`${farmName} UPI QR`}
                  style={{ width: "100%", borderRadius: 12, display: "block" }}
                />
              ) : (
                <img
                  src={generatedPreview}
                  alt={`${farmName} UPI QR`}
                  style={{ width: "100%", borderRadius: 12, display: "block" }}
                />
              )}
            </div>
          )}
          {!upiId && (
            <p style={{ ...s.contactText, marginTop: 10, color: "var(--muted)" }}>
              Turn on Edit Mode to enter a UPI ID and generate this farm’s QR code.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export { DEFAULT_STEPS as UPI_SETUP_STEPS };
