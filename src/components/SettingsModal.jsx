import React, { useEffect, useMemo, useState } from "react";
import { Show, SignInButton, SignOutButton, SignUpButton, UserButton, useClerk, useUser } from "@clerk/react";
import { s } from "../styles";
import { Modal } from "./Modal";
import { rupee } from "../data/defaults";

const STATUS_LABELS = {
  packing: "Being packed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatDateTime(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function orderStatus(order) {
  if (order?.status && STATUS_LABELS[order.status]) return order.status;
  const placed = new Date(order?.placedAt || Date.now()).getTime();
  const hours = (Date.now() - placed) / 3600000;
  if (hours < 12) return "packing";
  if (hours < 36) return "shipped";
  if (hours < 72) return "out_for_delivery";
  return "delivered";
}

function ClerkAccountPanel({ localName, localEmail, onSaveProfile }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const clerk = useClerk();
  const [name, setName] = useState(localName || "");
  const [email, setEmail] = useState(localEmail || "");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && user) {
      setName(
        user.fullName ||
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          localName ||
          ""
      );
      setEmail(user.primaryEmailAddress?.emailAddress || localEmail || "");
    } else {
      setName(localName || "");
      setEmail(localEmail || "");
    }
  }, [isLoaded, isSignedIn, user, localName, localEmail]);

  if (!isLoaded) {
    return <p style={{ margin: 0, color: "var(--muted)" }}>Loading account…</p>;
  }

  return (
    <>
      <Show when="signed-out">
        <p style={{ margin: "0 0 14px", color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
          Sign in or create an account to manage your email and keep order history with your profile.
        </p>
        <div style={s.clerkAuthActions}>
          <SignInButton mode="modal">
            <button type="button" className="aa-btn" style={s.checkoutBtn}>
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button type="button" className="aa-btn" style={s.signUpBtnWide}>
              Sign up with email or Google
            </button>
          </SignUpButton>
        </div>
      </Show>

      <Show when="signed-in">
        <div style={{ ...s.clerkAccountRow, marginBottom: 16 }}>
          <UserButton afterSignOutUrl="/" />
          <div>
            <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600 }}>{name || "Account"}</p>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>{email}</p>
          </div>
        </div>

        <div style={s.formRow}>
          <label style={s.label} htmlFor="settings-name">
            Display name
          </label>
          <input
            id="settings-name"
            style={s.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={s.formRow}>
          <label style={s.label} htmlFor="settings-email">
            Account email
          </label>
          <input
            id="settings-email"
            style={s.input}
            type="email"
            value={email}
            readOnly
            title="Change email in Clerk account settings"
          />
          <p style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: 12.5, lineHeight: 1.45 }}>
            To change or verify your email (or Google link), open Clerk account settings.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
          <button
            type="button"
            className="aa-btn"
            style={s.checkoutBtn}
            onClick={() => {
              onSaveProfile?.({ name: name.trim(), email });
              setNote("Profile updated for checkout");
            }}
          >
            Save profile
          </button>
          <button
            type="button"
            className="aa-btn"
            style={s.navLink}
            onClick={() => clerk.openUserProfile()}
          >
            Change email / Google
          </button>
          <SignOutButton>
            <button type="button" className="aa-btn" style={s.adminExit}>
              Sign out
            </button>
          </SignOutButton>
        </div>
        {note ? <p style={{ margin: "10px 0 0", color: "var(--accent2)", fontSize: 13 }}>{note}</p> : null}
      </Show>
    </>
  );
}

function LocalAccountPanel({ account, onSignIn, onSignOut, onSaveProfile }) {
  const [name, setName] = useState(account?.name || "");
  const [email, setEmail] = useState(account?.email || "");

  useEffect(() => {
    setName(account?.name || "");
    setEmail(account?.email || "");
  }, [account]);

  if (account) {
    return (
      <>
        <p style={{ margin: "0 0 14px", color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
          You&apos;re signed in on this device. Update your email below — it&apos;s used for order history and
          checkout.
        </p>
        <div style={s.formRow}>
          <label style={s.label} htmlFor="local-settings-name">
            Name
          </label>
          <input
            id="local-settings-name"
            style={s.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div style={s.formRow}>
          <label style={s.label} htmlFor="local-settings-email">
            Email
          </label>
          <input
            id="local-settings-email"
            style={s.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button
            type="button"
            style={s.checkoutBtn}
            onClick={() => onSaveProfile?.({ name: name.trim(), email: email.trim() })}
          >
            Save account
          </button>
          <button type="button" style={s.adminExit} onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) return;
        onSignIn?.(name.trim(), email.trim());
      }}
    >
      <p style={{ margin: "0 0 14px", color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
        Sign in with your name and email to track orders on this device. Add a Clerk key later for Google
        sign-in.
      </p>
      <div style={s.formRow}>
        <label style={s.label} htmlFor="guest-name">
          Name
        </label>
        <input
          id="guest-name"
          style={s.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div style={s.formRow}>
        <label style={s.label} htmlFor="guest-email">
          Email
        </label>
        <input
          id="guest-email"
          style={s.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit" style={s.checkoutBtn}>
        Sign in
      </button>
    </form>
  );
}

function OrdersPanel({ orders = [] }) {
  const sorted = useMemo(
    () =>
      [...orders].sort((a, b) => new Date(b.placedAt || 0).getTime() - new Date(a.placedAt || 0).getTime()),
    [orders]
  );

  if (!sorted.length) {
    return (
      <p style={{ margin: 0, color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
        No orders yet. When you place an order, it will show up here with packing status and arrival timing.
      </p>
    );
  }

  return (
    <div style={s.settingsOrderList}>
      {sorted.map((order) => {
        const status = orderStatus(order);
        return (
          <article key={order.id} style={s.settingsOrderCard}>
            <div style={s.settingsOrderHead}>
              <div>
                <p style={s.settingsOrderId}>{order.id}</p>
                <p style={s.settingsOrderMeta}>Placed {formatDateTime(order.placedAt)}</p>
              </div>
              <span style={s.settingsOrderStatus}>{STATUS_LABELS[status]}</span>
            </div>

            <div style={s.settingsOrderGrid}>
              <div>
                <p style={s.settingsOrderLabel}>Arriving</p>
                <p style={s.settingsOrderValue}>
                  {order.etaStart && order.etaEnd
                    ? `${formatDate(order.etaStart)} – ${formatDate(order.etaEnd)}`
                    : order.etaLabel || "2–4 days"}
                </p>
              </div>
              <div>
                <p style={s.settingsOrderLabel}>Delivery time</p>
                <p style={s.settingsOrderValue}>{order.etaLabel || "Usually 2–4 days after packing"}</p>
              </div>
              <div>
                <p style={s.settingsOrderLabel}>Total</p>
                <p style={s.settingsOrderValue}>{rupee(order.total || 0)}</p>
              </div>
              <div>
                <p style={s.settingsOrderLabel}>Payment</p>
                <p style={s.settingsOrderValue}>
                  {order.payment === "upi" ? "UPI" : "Cash on delivery"}
                </p>
              </div>
            </div>

            {order.address ? (
              <p style={s.settingsOrderShip}>
                Shipping to {order.name}
                {order.city ? `, ${order.city}` : ""}
                {order.pincode ? ` ${order.pincode}` : ""}
                {order.address ? ` · ${order.address}` : ""}
              </p>
            ) : null}

            {(order.items || []).length > 0 && (
              <ul style={s.settingsOrderItems}>
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.qty}× {item.name}
                    {item.manufacturerName ? ` · ${item.manufacturerName}` : ""}
                  </li>
                ))}
              </ul>
            )}
          </article>
        );
      })}
    </div>
  );
}

export function SettingsModal({
  clerkEnabled = false,
  account = null,
  orders = [],
  onSignIn,
  onSignOut,
  onSaveProfile,
  onClose,
}) {
  const [tab, setTab] = useState("account");

  return (
    <Modal title="Settings" onClose={onClose}>
      <div style={s.themeTabRow}>
        <button
          type="button"
          style={tab === "account" ? { ...s.themeTab, ...s.themeTabActive } : s.themeTab}
          onClick={() => setTab("account")}
        >
          Account
        </button>
        <button
          type="button"
          style={tab === "orders" ? { ...s.themeTab, ...s.themeTabActive } : s.themeTab}
          onClick={() => setTab("orders")}
        >
          Order history
        </button>
      </div>

      {tab === "account" &&
        (clerkEnabled ? (
          <ClerkAccountPanel
            localName={account?.name || ""}
            localEmail={account?.email || ""}
            onSaveProfile={onSaveProfile}
          />
        ) : (
          <LocalAccountPanel
            account={account}
            onSignIn={onSignIn}
            onSignOut={onSignOut}
            onSaveProfile={onSaveProfile}
          />
        ))}

      {tab === "orders" && <OrdersPanel orders={orders} />}
    </Modal>
  );
}
