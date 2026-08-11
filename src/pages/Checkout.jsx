import React, { useMemo, useState } from "react";
import { s } from "../styles";
import { Icon, ProductVisual } from "../components/Icon";
import { SectionColorControl } from "../components/SectionColorControl";
import { rupee } from "../data/defaults";

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
        <h1 style={s.confirmTitle}>{copy.confirmHeading || "Your crate is being packed."}</h1>
        <p style={s.confirmText}>
          We&apos;ve received your order. The manufacturer will pack your items and reach out if
          anything needs confirming.
        </p>

        {order && (
          <div style={s.confirmCard}>
            <p style={{ ...s.summaryRow, margin: "0 0 8px" }}>
              <span>Order</span>
              <span style={s.mono}>{order.id}</span>
            </p>
            <p style={{ ...s.summaryRow, margin: "0 0 8px" }}>
              <span>Payment</span>
              <span>{order.payment === "upi" ? copy.upiLabel || "UPI" : copy.codLabel || "Cash on delivery"}</span>
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
  cartItems = [],
  onBack,
  onPlaceOrder,
  confirmedOrder,
  onContinueShopping,
}) {
  const copy = marketplace.copy || {};
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [payment, setPayment] = useState("cod");

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + lineTotal(item), 0),
    [cartItems]
  );
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : subtotal > 0 ? 60 : 0;
  const total = subtotal + delivery;

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
    if (!cartItems.length) return;
    onPlaceOrder?.({
      id: "ORD-" + Date.now().toString(36).toUpperCase(),
      name,
      phone,
      address,
      city,
      pincode,
      payment,
      items: cartItems,
      subtotal,
      delivery,
      total,
      placedAt: new Date().toISOString(),
    });
  };

  return (
    <main style={s.checkoutMain}>
      {onBack && (
        <button type="button" style={s.backLink} onClick={onBack}>
          ← Back
        </button>
      )}

      <h1 style={{ ...s.pageHeading, marginBottom: 20 }}>
        {copy.proceedCheckoutLabel?.replace(/\s*→\s*$/, "") || "Checkout"}
      </h1>

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

            <h2 style={{ ...s.sectionTitle, marginTop: 18 }}>{copy.paymentHeading || "Payment"}</h2>
            <div style={s.payOptions}>
              <button
                type="button"
                style={{ ...s.payOption, ...(payment === "cod" ? s.payOptionActive : {}) }}
                onClick={() => setPayment("cod")}
              >
                {copy.codLabel || "Cash on delivery"}
              </button>
              <button
                type="button"
                style={{ ...s.payOption, ...(payment === "upi" ? s.payOptionActive : {}) }}
                onClick={() => setPayment("upi")}
              >
                {copy.upiLabel || "UPI"}
              </button>
            </div>

            <button type="submit" style={s.placeBtn}>
              {copy.placeOrderPrefix || "Place order"} · {rupee(total)}
            </button>
          </form>

          <aside style={s.summaryCard}>
            <h2 style={s.sectionTitle}>{copy.orderSummaryHeading || "Order summary"}</h2>

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
