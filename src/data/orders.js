/** Build delivery ETA + status fields for an order. */

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function enrichOrder(order) {
  const placedAt = order.placedAt || new Date().toISOString();
  const placed = new Date(placedAt);
  const etaDaysMin = 2;
  const etaDaysMax = 4;
  const etaStart = addDays(placed, etaDaysMin);
  const etaEnd = addDays(placed, etaDaysMax);

  return {
    ...order,
    placedAt,
    status: order.status || "packing",
    etaDaysMin,
    etaDaysMax,
    etaLabel: `${etaDaysMin}–${etaDaysMax} days`,
    etaStart: etaStart.toISOString(),
    etaEnd: etaEnd.toISOString(),
    accountEmail: order.accountEmail || order.email || "",
    accountName: order.accountName || order.name || "",
  };
}

export function refreshOrderStatus(order) {
  const placed = new Date(order.placedAt || Date.now()).getTime();
  const hours = (Date.now() - placed) / 3600000;
  let status = "packing";
  if (hours >= 72) status = "delivered";
  else if (hours >= 36) status = "out_for_delivery";
  else if (hours >= 12) status = "shipped";
  return { ...order, status };
}
