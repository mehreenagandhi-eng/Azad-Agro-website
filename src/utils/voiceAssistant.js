import { categoryIcon, uid } from "../data/defaults";

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^\w\s₹.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(s) {
  return norm(s).split(" ").filter(Boolean);
}

/** Soft match product/farm names from spoken text. */
export function fuzzyFind(list, spoken, getName = (x) => x.name) {
  const q = norm(spoken);
  if (!q || !list?.length) return null;
  let best = null;
  let bestScore = 0;
  for (const item of list) {
    const name = norm(getName(item));
    if (!name) continue;
    if (q.includes(name) || name.includes(q)) {
      const score = name.length + (q.includes(name) ? 50 : 0);
      if (score > bestScore) {
        best = item;
        bestScore = score;
      }
      continue;
    }
    const nt = new Set(tokens(name));
    const qt = tokens(q);
    let hit = 0;
    for (const t of qt) {
      if (t.length < 3) continue;
      for (const n of nt) {
        if (n.includes(t) || t.includes(n)) hit += 1;
      }
    }
    if (hit > bestScore) {
      best = item;
      bestScore = hit;
    }
  }
  return bestScore > 0 ? best : null;
}

function parsePrice(text) {
  const t = norm(text);
  const m =
    t.match(/(?:₹|rs\.?|rupees?|inr)\s*(\d+(?:\.\d+)?)/i) ||
    t.match(/(\d+(?:\.\d+)?)\s*(?:₹|rs\.?|rupees?|inr)/i) ||
    t.match(/(?:price|cost|for|at|to)\s+(\d+(?:\.\d+)?)/i) ||
    t.match(/\b(\d{2,6})\b/);
  return m ? Number(m[1]) : null;
}

function parseStock(text) {
  const t = norm(text);
  const m =
    t.match(/(?:stock|inventory|qty|quantity|units?|packets?|bags?|jars?)\s*(?:to|as|is|=|:)?\s*(\d+)/i) ||
    t.match(/(\d+)\s*(?:left|in stock|available|units?|packets?|bags?)/i);
  return m ? Number(m[1]) : null;
}

function parseUnit(text) {
  const t = norm(text);
  const m = t.match(
    /(?:per|unit|pack(?:age)?|in)\s+([\w\s.]{2,40}?)(?:\s+(?:category|priced|for|at|note|stock)|$)/i
  );
  if (m) return m[1].trim();
  const u = t.match(/\b(\d+\s?(?:kg|g|ml|l|litre|liter|tin|jar|pouch|sack|bottle|pack)s?)\b/i);
  return u ? u[1].trim() : "";
}

function parseCategory(text) {
  const t = norm(text);
  const cats = [
    "Grains",
    "Spices",
    "Oils & Ghee",
    "Pulses",
    "Sweeteners",
    "Preserves",
    "Herbs",
    "Fruits",
  ];
  for (const c of cats) {
    if (t.includes(norm(c))) return c;
  }
  if (t.includes("spice")) return "Spices";
  if (t.includes("grain") || t.includes("rice") || t.includes("wheat") || t.includes("millet"))
    return "Grains";
  if (t.includes("oil") || t.includes("ghee") || t.includes("honey")) return "Oils & Ghee";
  if (t.includes("dal") || t.includes("pulse") || t.includes("lentil") || t.includes("chana"))
    return "Pulses";
  if (t.includes("jaggery") || t.includes("sweet")) return "Sweeteners";
  if (t.includes("pickle") || t.includes("preserve") || t.includes("murabba")) return "Preserves";
  return "";
}

function extractProductPhrase(text, verbs) {
  let t = norm(text);
  for (const v of verbs) {
    t = t.replace(new RegExp(`^${v}\\s+`, "i"), "");
  }
  t = t
    .replace(/\b(please|can you|could you|i want to|i wanna|help me)\b/g, " ")
    .replace(/\b(price|cost|stock|inventory|quantity|unit|category|note|featured)\b.*/i, " ")
    .replace(/(?:₹|rs\.?|rupees?|inr)\s*\d+(?:\.\d+)?/gi, " ")
    .replace(/\b\d+(?:\.\d+)?\s*(?:₹|rs\.?|rupees?|inr)?\b/gi, " ")
    .replace(/\b(?:to|for|at|as|with|from|the|a|an|my|product|item)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return t;
}

function speakSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text, { lang = "en-IN" } = {}) {
  if (!speakSupported() || !text) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text));
    u.lang = lang;
    u.rate = 1;
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
}

export function stopSpeaking() {
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* ignore */
  }
}

export function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

/**
 * Interpret a farmer or customer voice/text command against marketplace state.
 * Returns { reply, actions[] } where actions are applied by the host.
 */
export function interpretCommand(rawText, ctx) {
  const text = String(rawText || "").trim();
  const n = norm(text);
  const role = ctx.role || "customer";
  const manufacturers = ctx.manufacturers || [];
  const activeMfg = ctx.activeManufacturer || null;
  const products = activeMfg?.products || [];

  if (!n) {
    return {
      reply: "I didn’t catch that. Try again, or type your request.",
      actions: [],
    };
  }

  if (/\b(help|what can you do|commands|examples)\b/.test(n)) {
    if (role === "farmer") {
      return {
        reply:
          "As a farmer I can add products, change prices, update stock, edit notes, feature items, remove products, or list your inventory. For example: add turmeric for 200 rupees, or set rice stock to 40.",
        actions: [],
      };
    }
    return {
      reply:
        "As a customer I can find products, add them to your crate, open a farm page, or take you to checkout. For example: add turmeric to cart, or show me spices.",
      actions: [],
    };
  }

  if (role === "farmer") {
    return interpretFarmer(n, text, { manufacturers, activeMfg, products, ...ctx });
  }
  return interpretCustomer(n, text, ctx);
}

function interpretFarmer(n, text, ctx) {
  const { activeMfg, products, manufacturers } = ctx;
  const actions = [];

  // Switch farm context
  if (/\b(open|go to|switch to|use)\b.*\b(farm|store|manufacturer)\b/.test(n) || /\bopen\b/.test(n)) {
    const farm = fuzzyFind(manufacturers, text);
    if (farm) {
      actions.push({ type: "openManufacturer", manufacturerId: farm.id });
      actions.push({ type: "ensureEditMode" });
      return { reply: `Opened ${farm.name}. You can update their products by voice.`, actions };
    }
  }

  if (!activeMfg) {
    const farm = fuzzyFind(manufacturers, text) || manufacturers[0];
    if (farm) {
      actions.push({ type: "openManufacturer", manufacturerId: farm.id });
      actions.push({ type: "ensureEditMode" });
      return {
        reply: `I’ll work on ${farm.name}. Say your update again, like: add turmeric for 200 rupees.`,
        actions,
      };
    }
    return {
      reply: "Open a manufacturer page first, or say the farm name you want to edit.",
      actions: [],
    };
  }

  actions.push({ type: "ensureEditMode" });

  if (/\b(list|show|what).*(product|inventor|catalog|stock)\b/.test(n) || n === "list products") {
    if (!products.length) {
      return { reply: `${activeMfg.name} has no products yet. Say add, then the product name and price.`, actions };
    }
    const sample = products
      .slice(0, 8)
      .map((p) => `${p.name} at ₹${p.price}${p.stock != null ? `, stock ${p.stock}` : ""}`)
      .join("; ");
    return {
      reply: `${activeMfg.name} has ${products.length} products. ${sample}${products.length > 8 ? "…" : ""}`,
      actions,
    };
  }

  if (/\b(delete|remove|drop)\b/.test(n)) {
    const phrase = extractProductPhrase(text, ["delete", "remove", "drop"]);
    const product = fuzzyFind(products, phrase || text);
    if (!product) {
      return { reply: "Which product should I remove? Say the product name.", actions };
    }
    actions.push({ type: "deleteProduct", manufacturerId: activeMfg.id, productId: product.id });
    return { reply: `Removed ${product.name} from ${activeMfg.name}.`, actions };
  }

  if (/\b(add|create|new product|list a)\b/.test(n)) {
    const price = parsePrice(text);
    const stock = parseStock(text);
    const unit = parseUnit(text) || "1 unit";
    const cat = parseCategory(text) || "Grains";
    let name = extractProductPhrase(text, [
      "add",
      "create",
      "new product",
      "list a",
      "list",
    ]);
    name = name
      .replace(/\b(category|spices?|grains?|pulses?|oils?(?: and ghee)?|sweeteners?|preserves?)\b/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!name || name.length < 2) {
      return {
        reply: "Tell me the product name and price. Example: add organic turmeric for 200 rupees.",
        actions,
      };
    }
    // Title-case-ish
    const niceName = name.replace(/\b\w/g, (c) => c.toUpperCase());
    const product = {
      id: uid(),
      name: niceName,
      cat,
      unit,
      price: price != null ? price : 0,
      icon: categoryIcon(cat),
      image: "",
      note: "",
      featured: false,
      stock: stock != null ? stock : 0,
    };
    actions.push({ type: "upsertProduct", manufacturerId: activeMfg.id, product });
    return {
      reply: `Added ${niceName} under ${cat} at ₹${product.price} per ${unit}${
        stock != null ? `, stock ${stock}` : ""
      }.`,
      actions,
    };
  }

  // Price update
  if (/\b(price|cost|rupees?|₹|rs)\b/.test(n) || /\b(change|update|set|make)\b.*\bto\b/.test(n)) {
    const price = parsePrice(text);
    const product = fuzzyFind(products, extractProductPhrase(text, ["change", "update", "set", "make", "price"]));
    if (product && price != null) {
      actions.push({
        type: "upsertProduct",
        manufacturerId: activeMfg.id,
        product: { ...product, price },
      });
      return { reply: `Updated ${product.name} to ₹${price}.`, actions };
    }
  }

  // Stock / inventory
  if (/\b(stock|inventory|quantity|qty|available)\b/.test(n)) {
    const stock = parseStock(text);
    const product = fuzzyFind(products, text);
    if (product && stock != null) {
      actions.push({
        type: "upsertProduct",
        manufacturerId: activeMfg.id,
        product: { ...product, stock },
      });
      return { reply: `Set ${product.name} stock to ${stock}.`, actions };
    }
    if (!product) {
      return { reply: "Which product’s stock should I update?", actions };
    }
  }

  // Note
  if (/\b(note|description|say it.?s|mark note)\b/.test(n)) {
    const product = fuzzyFind(products, text);
    const noteMatch = text.match(/(?:note|description)\s+(?:to|as|:)?\s*(.+)$/i);
    const note = noteMatch ? noteMatch[1].trim() : "";
    if (product && note) {
      actions.push({
        type: "upsertProduct",
        manufacturerId: activeMfg.id,
        product: { ...product, note },
      });
      return { reply: `Updated the note on ${product.name}.`, actions };
    }
  }

  // Featured
  if (/\b(feature|featured|highlight)\b/.test(n)) {
    const product = fuzzyFind(products, text);
    const off = /\b(unfeature|not featured|remove featured)\b/.test(n);
    if (product) {
      actions.push({
        type: "upsertProduct",
        manufacturerId: activeMfg.id,
        product: { ...product, featured: !off },
      });
      return {
        reply: off ? `${product.name} is no longer featured.` : `Marked ${product.name} as featured.`,
        actions,
      };
    }
  }

  // Character / icon
  if (/\b(character|icon|look like|use .* character)\b/.test(n)) {
    const product = fuzzyFind(products, text);
    const icons = [
      "plant",
      "leaf",
      "sprout",
      "flower",
      "chilli",
      "wheat",
      "grain",
      "seed",
      "herb",
      "citrus",
      "root",
      "pod",
      "drop",
      "jar",
      "comb",
    ];
    const icon = icons.find((i) => n.includes(i));
    if (product && icon) {
      actions.push({
        type: "upsertProduct",
        manufacturerId: activeMfg.id,
        product: { ...product, icon, image: "" },
      });
      return { reply: `Set ${product.name} to the ${icon} character.`, actions };
    }
  }

  // Generic update fallback if product + price found
  {
    const product = fuzzyFind(products, text);
    const price = parsePrice(text);
    const stock = parseStock(text);
    if (product && (price != null || stock != null)) {
      const next = { ...product };
      if (price != null) next.price = price;
      if (stock != null) next.stock = stock;
      actions.push({ type: "upsertProduct", manufacturerId: activeMfg.id, product: next });
      return {
        reply: `Updated ${product.name}${price != null ? ` price ₹${price}` : ""}${
          stock != null ? ` stock ${stock}` : ""
        }.`,
        actions,
      };
    }
  }

  return {
    reply: `I’m ready to update ${activeMfg.name}. Try: add mustard oil for 340 rupees, or set turmeric stock to 25.`,
    actions,
  };
}

function interpretCustomer(n, text, ctx) {
  const manufacturers = ctx.manufacturers || [];
  const activeMfg = ctx.activeManufacturer || null;
  const allProducts = manufacturers.flatMap((m) =>
    (m.products || []).map((p) => ({ ...p, manufacturerId: m.id, manufacturerName: m.name }))
  );
  const actions = [];

  if (/\b(checkout|order online|pay|crate)\b/.test(n)) {
    actions.push({ type: "openCheckout" });
    return { reply: "Opening checkout so you can order online and pay by UPI.", actions };
  }

  if (/\b(cart|crate)\b/.test(n) && /\b(open|show|view)\b/.test(n)) {
    actions.push({ type: "openCart" });
    return { reply: "Opening your crate.", actions };
  }

  if (/\b(farm|manufacturer|store|seller)s?\b/.test(n) && /\b(list|show|browse|what)\b/.test(n)) {
    const names = manufacturers.map((m) => m.name).join(", ");
    return {
      reply: names ? `Farms on this marketplace: ${names}.` : "No farms listed yet.",
      actions: [],
    };
  }

  if (/\b(open|visit|go to)\b/.test(n)) {
    const farm = fuzzyFind(manufacturers, text);
    if (farm) {
      actions.push({ type: "openManufacturer", manufacturerId: farm.id });
      return { reply: `Opening ${farm.name}.`, actions };
    }
  }

  if (/\b(add|put|buy)\b/.test(n)) {
    const product =
      fuzzyFind(activeMfg?.products || [], text) ||
      fuzzyFind(allProducts, text);
    if (product) {
      const mid = product.manufacturerId || activeMfg?.id;
      const pid = product.id;
      if (mid && pid) {
        actions.push({ type: "addToCart", manufacturerId: mid, productId: pid });
        return {
          reply: `Added ${product.name} from ${product.manufacturerName || activeMfg?.name || "the farm"} to your crate.`,
          actions,
        };
      }
    }
    return { reply: "Which product should I add? Say the product name.", actions: [] };
  }

  if (/\b(price|how much|cost)\b/.test(n)) {
    const product =
      fuzzyFind(activeMfg?.products || [], text) || fuzzyFind(allProducts, text);
    if (product) {
      return {
        reply: `${product.name} is ₹${product.price} per ${product.unit}${
          product.manufacturerName ? ` from ${product.manufacturerName}` : ""
        }.`,
        actions: [],
      };
    }
  }

  if (/\b(show|find|search|looking for|spices|grains|oils|pulses)\b/.test(n)) {
    const cat = parseCategory(text);
    const pool = activeMfg?.products || allProducts;
    const filtered = cat ? pool.filter((p) => norm(p.cat).includes(norm(cat))) : pool;
    if (cat && activeMfg) {
      actions.push({ type: "setCategoryFilter", category: cat });
    }
    if (!filtered.length) {
      return { reply: cat ? `I couldn’t find ${cat} products.` : "No matching products.", actions };
    }
    const sample = filtered
      .slice(0, 6)
      .map((p) => `${p.name} ₹${p.price}`)
      .join("; ");
    return {
      reply: cat
        ? `Here are ${cat} options: ${sample}.`
        : `I found: ${sample}. Say add, then a product name.`,
      actions,
    };
  }

  return {
    reply:
      "I can help you shop by voice. Try: add turmeric to cart, how much is ghee, or open Azad Agro.",
    actions: [],
  };
}
