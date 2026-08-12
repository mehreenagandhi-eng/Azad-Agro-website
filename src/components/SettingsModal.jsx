import React, { useEffect, useMemo, useRef, useState } from "react";
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

function BackupPanel({ onExportEdits, onImportEdits }) {
  const fileRef = useRef(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [paste, setPaste] = useState("");

  const applyPayload = (data) => {
    onImportEdits?.(data);
    setMessage("Restored. Refresh the page if you don’t see your writing and colors yet.");
  };

  const exportEdits = () => {
    setError("");
    try {
      const payload = onExportEdits?.();
      if (!payload) throw new Error("Nothing to export");
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `published-site-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setMessage("Backup downloaded. Keep this file — you can import it on any new preview link.");
    } catch (err) {
      setError(err?.message || "Export failed");
    }
  };

  const importEdits = async (file) => {
    setError("");
    setMessage("");
    if (!file) return;
    try {
      const text = await file.text();
      applyPayload(JSON.parse(text));
    } catch (err) {
      setError(err?.message || "Import failed — choose a valid backup JSON file.");
    }
  };

  const importPasted = () => {
    setError("");
    setMessage("");
    try {
      const raw = paste.trim();
      if (!raw) throw new Error("Paste your backup JSON first.");
      const data = JSON.parse(raw);
      // Allow either full backup or raw site-config / theme pieces from DevTools
      if (data.site || data.theme || data.manufacturers) {
        applyPayload(data);
      } else if (data.title || data.heroLine1 || data.customTextSections) {
        applyPayload({ site: data });
      } else if (data.colors || data.fonts || data.sections) {
        applyPayload({ theme: data });
      } else {
        throw new Error("That JSON doesn’t look like a site/theme backup.");
      }
      setPaste("");
    } catch (err) {
      setError(err?.message || "Could not read pasted JSON.");
    }
  };

  return (
    <div>
      <p style={{ margin: "0 0 14px", color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
        Closing a tab keeps edits on the <strong>same</strong> link. To make writing/colors part of the
        website itself (so every visit shows them), download a backup and keep that file — or paste it
        below to restore.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <button type="button" className="aa-btn" style={s.addProductBtn} onClick={exportEdits}>
          Download backup
        </button>
        <button
          type="button"
          className="aa-btn"
          style={s.uploadBtn}
          onClick={() => fileRef.current?.click()}
        >
          Import backup file
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            importEdits(file);
            e.target.value = "";
          }}
        />
      </div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
        Or paste backup JSON
      </label>
      <textarea
        value={paste}
        onChange={(e) => setPaste(e.target.value)}
        rows={6}
        placeholder='Paste JSON from a backup file or from Chrome DevTools (site-config-v2 / theme-v2 values)'
        style={{
          width: "100%",
          boxSizing: "border-box",
          borderRadius: 10,
          border: "1px solid var(--border)",
          background: "var(--paper)",
          color: "var(--ink)",
          padding: 10,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          lineHeight: 1.45,
          marginBottom: 10,
        }}
      />
      <button type="button" className="aa-btn" style={s.uploadBtn} onClick={importPasted}>
        Restore pasted JSON
      </button>
      {message ? (
        <p style={{ margin: "12px 0 0", color: "var(--accent)", fontSize: 13 }}>{message}</p>
      ) : null}
      {error ? (
        <p style={{ margin: "12px 0 0", color: "var(--danger)", fontSize: 13 }}>{error}</p>
      ) : null}
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
  onExportEdits,
  onImportEdits,
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
        <button
          type="button"
          style={tab === "backup" ? { ...s.themeTab, ...s.themeTabActive } : s.themeTab}
          onClick={() => setTab("backup")}
        >
          Backup
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

      {tab === "backup" && (
        <BackupPanel onExportEdits={onExportEdits} onImportEdits={onImportEdits} />
      )}
    </Modal>
  );
}
