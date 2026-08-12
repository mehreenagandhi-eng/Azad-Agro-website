import React, { useEffect, useMemo, useState } from "react";
import { s } from "../styles";
import { ProductVisual } from "../components/Icon";
import { SectionColorControl } from "../components/SectionColorControl";
import { ResolvedImage } from "../components/ResolvedImage";
import { SectionPhoto } from "../components/SectionPhoto";
import { rupee } from "../data/defaults";
import { buildUpiPayUrl, qrImageUrl } from "../utils/upi";

const FREE_DELIVERY_THRESHOLD = 999;

function lineTotal(item) {
  return (item.price || 0) * (item.qty || 0);
}

export function Confirmation({ order, marketplace, onContinue }) {
  const copy = marketplace.copy || {};

  return (
    <div style={s.confirmWrap}>
      <div>
        <div style={s.stamp} aria-hidden="true">
          Packed
        </div>
        <h1 style={s.confirmTitle}>{copy.confirmHeading || "Payment noted — your crate is being packed."}</h1>
        <p style={s.confirmText}>
          Thanks. You paid {order?.manufacturerName || "the farm"} directly by UPI. They’ll pack your
          order and reach out if anything needs confirming.
        </p>

        {order && (
          <div style={s.confirmCard}>
            <p style={{ ...s.summaryRow, margin: "0 0 8px" }}>
              <span>Order</span>
              <span style={s.mono}>{order.id}</span>
            </p>
            <p style={{ ...s.summaryRow, margin: "0 0 8px" }}>
              <span>Farm</span>
              <span>{order.manufacturerName || "—"}</span>
            </p>
            <p style={{ ...s.summaryRow, margin: "0 0 8px" }}>
              <span>Payment</span>
              <span>{copy.upiLabel || "UPI (Google Pay / PhonePe / Paytm)"}</span>
            </p>
            <p style={{ ...s.summaryRow, margin: 0 }}>
              <span>{copy.totalLabel || "Total"}</span>
              <strong>{rupee(order.total)}</strong>
            </p>
          </div>
        )}

        {onContinue && (
          <button type="button" style={{ ...s.shopNowBtn, marginTop: 22 }} onClick={onContinue}>
            {copy.continueShoppingLabel || "Continue shopping"}
          </button>
        )}
      </div>
    </div>
  );
}

export function Checkout({
  marketplace,
  manufacturer = null,
  cartItems = [],
  account = null,
  isAdmin = false,
  onUpdateManufacturer,
  onBack,
  onPlaceOrder,
  confirmedOrder,
  onContinueShopping,
}) {
  const copy = marketplace.copy || {};
  const [name, setName] = useState(account?.name || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [paidChecked, setPaidChecked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (account?.name) setName((prev) => prev || account.name);
  }, [account]);

  const farmName = manufacturer?.name || cartItems[0]?.manufacturerName || "this farm";
  const upiId = String(manufacturer?.upiId || "").trim();
  const upiQrPhoto = manufacturer?.upiQrPhoto || "";

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + lineTotal(item), 0),
    [cartItems]
  );
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : subtotal > 0 ? 60 : 0;
  const total = subtotal + delivery;

  const orderIdPreview = useMemo(() => "ORD-" + Date.now().toString(36).toUpperCase(), []);

  const upiPayUrl = useMemo(() => {
    if (!upiId) return "";
    return buildUpiPayUrl({
      upiId,
      payeeName: farmName,
      amount: total,
      note: `${farmName} order`,
    });
  }, [upiId, farmName, total]);

  const generatedQr = upiPayUrl ? qrImageUrl(upiPayUrl) : "";

  if (confirmedOrder) {
    return (
      <Confirmation
        order={confirmedOrder}
        marketplace={marketplace}
        onContinue={onContinueShopping}
      />
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cartItems.length || !paidChecked) return;
    onPlaceOrder?.({
      id: orderIdPreview,
      name,
      phone,
      address,
      city,
      pincode,
      payment: "upi",
      paymentMethod: "upi_qr",
      manufacturerId: manufacturer?.id || cartItems[0]?.manufacturerId || "",
      manufacturerName: farmName,
      upiId: upiId || "",
      items: cartItems,
      subtotal,
      delivery,
      total,
      placedAt: new Date().toISOString(),
    });
  };

  const copyUpi = async () => {
    if (!upiId) return;
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <main style={s.checkoutMain}>
      {onBack && (
        <button type="button" style={s.backLink} onClick={onBack}>
          ← Back
        </button>
      )}

      <h1 style={{ ...s.pageHeading, marginBottom: 8 }}>Order online</h1>
      <p style={{ ...s.pageIntro, marginTop: 0, marginBottom: 20 }}>
        Choose a farm → select products → view total → scan the farm’s QR → pay → confirm payment.
        This crate is for <strong>{farmName}</strong> only.
      </p>

      {cartItems.length === 0 ? (
        <p style={s.pageIntro}>{copy.emptyCartText || "Your crate is empty."}</p>
      ) : (
        <div style={{ position: "relative" }}>
          <SectionColorControl sectionId="checkout" />
          <div style={s.checkoutGrid}>
            <form style={s.checkoutForm} onSubmit={handleSubmit}>
              <h2 style={s.sectionTitle}>{copy.deliveryDetailsHeading || "Delivery details"}</h2>

              <label style={s.formRow}>
                <span style={s.label}>Full name</span>
                <input
                  style={s.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </label>

              <label style={s.formRow}>
                <span style={s.label}>Phone</span>
                <input
                  style={s.input}
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  autoComplete="tel"
                />
              </label>

              <label style={s.formRow}>
                <span style={s.label}>Address</span>
                <input
                  style={s.input}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  autoComplete="street-address"
                />
              </label>

              <label style={s.formRow}>
                <span style={s.label}>City</span>
                <input
                  style={s.input}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  autoComplete="address-level2"
                />
              </label>

              <label style={s.formRow}>
                <span style={s.label}>PIN code</span>
                <input
                  style={s.input}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  required
                  autoComplete="postal-code"
                />
              </label>

              <h2 style={{ ...s.sectionTitle, marginTop: 18 }}>
                {copy.paymentHeading || "Pay this farm"}
              </h2>
              <p style={s.upiPayHint}>
                {copy.payScanHint ||
                  "Scan this farm’s QR code with Google Pay, PhonePe, Paytm, or any UPI app. Then tap “I have paid”."}
              </p>

              <div style={s.upiPayBox}>
                <div style={s.upiPayFarm}>{farmName}</div>
                <div style={s.upiPayAmount}>{rupee(total)}</div>

                {(upiQrPhoto || generatedQr) && (
                  <div style={s.upiQrFrame}>
                    {upiQrPhoto ? (
                      <ResolvedImage src={upiQrPhoto} alt={`${farmName} UPI QR`} style={s.upiQrImg} />
                    ) : (
                      <img src={generatedQr} alt={`${farmName} UPI QR`} style={s.upiQrImg} />
                    )}
                  </div>
                )}

                {!upiId && !upiQrPhoto && (
                  <p style={s.upiMissing}>
                    This farm hasn’t added a UPI ID or QR yet. In Edit Mode, open Contact Information
                    and add their UPI details.
                  </p>
                )}

                {upiId && (
                  <div style={s.upiIdRow}>
                    <code style={s.upiIdCode}>{upiId}</code>
                    <button type="button" style={s.uploadBtn} onClick={copyUpi}>
                      {copied ? "Copied" : "Copy UPI ID"}
                    </button>
                  </div>
                )}

                <div style={s.upiAppRow}>
                  <span style={s.upiAppChip}>Google Pay</span>
                  <span style={s.upiAppChip}>PhonePe</span>
                  <span style={s.upiAppChip}>Paytm</span>
                  <span style={s.upiAppChip}>Any UPI app</span>
                </div>

                {upiPayUrl && (
                  <a href={upiPayUrl} style={s.upiOpenLink}>
                    Open in UPI app
                  </a>
                )}

                {isAdmin && manufacturer && onUpdateManufacturer && (
                  <div style={s.upiAdminEdit}>
                    <label style={s.formRow}>
                      <span style={s.label}>Farm UPI ID (Edit Mode)</span>
                      <input
                        style={s.input}
                        placeholder="farmname@upi"
                        value={manufacturer.upiId || ""}
                        onChange={(e) =>
                          onUpdateManufacturer((prev) => ({ ...prev, upiId: e.target.value }))
                        }
                      />
                    </label>
                    <SectionPhoto
                      photo={manufacturer.upiQrPhoto || ""}
                      isAdmin
                      label="UPI QR"
                      aspect={1}
                      onChange={(photo) =>
                        onUpdateManufacturer((prev) => ({ ...prev, upiQrPhoto: photo }))
                      }
                    />
                  </div>
                )}
              </div>

              <label style={s.upiConfirmCheck}>
                <input
                  type="checkbox"
                  checked={paidChecked}
                  onChange={(e) => setPaidChecked(e.target.checked)}
                  required
                />
                <span>I have paid {rupee(total)} to {farmName} by UPI</span>
              </label>

              <button
                type="submit"
                style={{
                  ...s.placeBtn,
                  ...(!paidChecked || (!upiId && !upiQrPhoto)
                    ? { opacity: 0.45, cursor: "not-allowed" }
                    : null),
                }}
                disabled={!paidChecked || (!upiId && !upiQrPhoto)}
              >
                {copy.placeOrderPrefix || "I have paid"} · {rupee(total)}
              </button>
            </form>

            <aside style={s.summaryCard}>
              <h2 style={s.sectionTitle}>{copy.orderSummaryHeading || "Order summary"}</h2>
              <p style={s.drawerItemUnit}>Farm: {farmName}</p>

              {cartItems.map((item) => (
                <div key={item.id} style={s.drawerItem}>
                  <div style={s.miniIcon}>
                    <ProductVisual p={item} size={42} />
                  </div>
                  <div>
                    <p style={s.drawerItemName}>{item.name}</p>
                    <p style={s.drawerItemUnit}>
                      {item.qty} × {item.unit}
                    </p>
                  </div>
                  <span style={s.drawerItemPrice}>{rupee(lineTotal(item))}</span>
                </div>
              ))}

              <hr style={s.summaryDivider} />

              <div style={s.summaryRow}>
                <span>{copy.subtotalLabel || "Subtotal"}</span>
                <span>{rupee(subtotal)}</span>
              </div>
              <div style={s.summaryRow}>
                <span>{copy.deliveryLabel || "Delivery"}</span>
                <span>{delivery === 0 ? copy.freeLabel || "Free" : rupee(delivery)}</span>
              </div>
              <div style={s.sumTotal}>
                <span>{copy.totalLabel || "Total"}</span>
                <span>{rupee(total)}</span>
              </div>
            </aside>
          </div>
        </div>
      )}
    </main>
  );
}
