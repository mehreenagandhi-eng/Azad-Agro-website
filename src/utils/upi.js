/** Build a UPI deep link buyers can open in Google Pay / PhonePe / Paytm. */
export function buildUpiPayUrl({ upiId, payeeName, amount, note } = {}) {
  const id = String(upiId || "").trim();
  if (!id) return "";
  const params = new URLSearchParams();
  params.set("pa", id);
  if (payeeName) params.set("pn", payeeName);
  if (amount != null && Number(amount) > 0) params.set("am", Number(amount).toFixed(2));
  params.set("cu", "INR");
  if (note) params.set("tn", String(note).slice(0, 80));
  return `upi://pay?${params.toString()}`;
}

/** Public QR image URL for a UPI pay string (preview / download). */
export function qrImageUrl(data, size = 280) {
  if (!data) return "";
  const dim = Math.max(120, Math.min(Number(size) || 280, 512));
  return `https://api.qrserver.com/v1/create-qr-code/?size=${dim}x${dim}&margin=12&data=${encodeURIComponent(data)}`;
}

/** Fetch a QR image as a data URL so it can be saved to the storefront. */
export async function fetchQrDataUrl(data, size = 320) {
  const url = qrImageUrl(data, size);
  if (!url) throw new Error("Missing UPI data");

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("QR fetch failed");
    const blob = await res.blob();
    return await blobToDataUrl(blob);
  } catch {
    // Fallback when fetch/CORS fails: draw the image onto a canvas.
    return await imageUrlToDataUrl(url);
  }
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("FileReader failed"));
    reader.readAsDataURL(blob);
  });
}

function imageUrlToDataUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || 320;
        canvas.height = img.naturalHeight || 320;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error("Could not load QR image"));
    img.src = url;
  });
}
