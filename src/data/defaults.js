export const OWNER_PASSCODE = "owner123"; // demo-only gate for approve/deny, not real auth
export const LOGO_SRC = "/logo.svg";

export const AZAD_AGRO_PRODUCTS = [
  { id: "p1", name: "Sona Masuri Rice", cat: "Grains", unit: "5 kg sack", price: 420, icon: "grain", image: "", note: "Rain-fed, hand-winnowed", featured: true },
  { id: "p2", name: "Emmer Wheat Atta", cat: "Grains", unit: "5 kg sack", price: 380, icon: "grain", image: "", note: "Stone-ground, whole grain", featured: false },
  { id: "p3", name: "Foxtail Millet", cat: "Grains", unit: "1 kg pouch", price: 160, icon: "seed", image: "", note: "Dry-land, no irrigation", featured: false },
  { id: "p4", name: "Turmeric Root Powder", cat: "Spices", unit: "250 g tin", price: 190, icon: "root", image: "", note: "Sun-dried, single origin", featured: true },
  { id: "p5", name: "Black Mustard Seed", cat: "Spices", unit: "200 g pouch", price: 110, icon: "seed", image: "", note: "Cold-pressed grade", featured: false },
  { id: "p6", name: "Guntur Dry Chilli", cat: "Spices", unit: "250 g pouch", price: 175, icon: "pod", image: "", note: "Shade-dried, whole pods", featured: false },
  { id: "p7", name: "Cold-Pressed Groundnut Oil", cat: "Oils & Ghee", unit: "1 L bottle", price: 340, icon: "drop", image: "", note: "Wood-press, unrefined", featured: false },
  { id: "p8", name: "A2 Desi Cow Ghee", cat: "Oils & Ghee", unit: "500 ml jar", price: 650, icon: "jar", image: "", note: "Bilona churned", featured: true },
  { id: "p9", name: "Wild Forest Honey", cat: "Oils & Ghee", unit: "500 g jar", price: 410, icon: "comb", image: "", note: "Raw, unheated", featured: true },
  { id: "p10", name: "Toor Dal", cat: "Pulses", unit: "1 kg pouch", price: 195, icon: "pod", image: "", note: "Farm-sorted, unpolished", featured: false },
  { id: "p11", name: "Kabuli Chana", cat: "Pulses", unit: "1 kg pouch", price: 165, icon: "pod", image: "", note: "Rotation-crop, rain-fed", featured: false },
  { id: "p12", name: "Moong Whole", cat: "Pulses", unit: "1 kg pouch", price: 175, icon: "pod", image: "", note: "Sun-cured", featured: false },
  { id: "p13", name: "Palm Jaggery Blocks", cat: "Sweeteners", unit: "1 kg pack", price: 220, icon: "drop", image: "", note: "Open-pan, unrefined", featured: false },
  { id: "p14", name: "Sugarcane Jaggery Powder", cat: "Sweeteners", unit: "500 g pouch", price: 130, icon: "seed", image: "", note: "Chemical-free clarified", featured: false },
  { id: "p15", name: "Amla Murabba", cat: "Preserves", unit: "400 g jar", price: 240, icon: "jar", image: "", note: "Hand-preserved, small batch", featured: false },
  { id: "p16", name: "Mango Pickle (Avakaya)", cat: "Preserves", unit: "400 g jar", price: 260, icon: "jar", image: "", note: "Mustard-oil cured", featured: false },
];

export const DEFAULT_MANUFACTURERS = [
  {
    id: "azad-agro",
    status: "approved",
    name: "Azad Agro",
    tagline: "farm direct · no middlemen",
    logo: "",
    coverPhoto: "",
    coverCaption: "Zia Chacha, tending these fields since 1994",
    story: "Azad Agro started as a single field looked after by Zia Chacha, who set one rule from day one: nothing goes on this land that we wouldn't want on our own plates. That rule hasn't changed since, even as the farm has grown to supply households well beyond our village.",
    mission: "To prove that organic farming can be small, honest, and still put a fair wage in a farmer's pocket — without a broker standing in between.",
    values: [
      "No synthetic pesticides or fertilizers, ever",
      "Every harvest tested before it reaches a shelf",
      "Fair prices paid directly to the people who grow it",
      "Soil health tracked season over season, not assumed",
    ],
    practicesIntro: "Regenerative isn't a label we bought — it's how this soil has been managed for three decades.",
    practicesPoints: [
      "Crop rotation across every field, every season",
      "Compost and green manure instead of chemical inputs",
      "Rainwater harvesting to reduce pressure on groundwater",
      "Native seed varieties saved and replanted year over year",
    ],
    certIntro: "Every claim on this page is backed by third-party inspection, not just our word.",
    certBadges: ["India Organic (NPOP)", "USDA Organic", "EU Organic", "Jaivik Bharat"],
    contactEmail: "hello@azadagro.farm",
    contactPhone: "+91 98765 43210",
    contactAddress: "Azad Agro Farm, Near Ring Road, Nashik, Maharashtra, India",
    deliveryInfo: "Free delivery on orders above ₹999. Pay this farm directly by UPI (Google Pay, PhonePe, Paytm). Most orders ship within 2–3 days of payment confirmation.",
    upiId: "azadagro@upi",
    upiQrPhoto: "",
    fssaiLicense: "",
    products: AZAD_AGRO_PRODUCTS,
    customTextSections: [],
    sectionStack: null,
    hiddenBuiltins: [],
    sectionPhotos: {},
  },
];

export const DEFAULT_MARKETPLACE = {
  title: "Indias Organic Marketplace",
  headerLogo: "",
  tagline: "A marketplace of organic manufacturers",
  ledgerLine: "ENTRY №01 — MARKETPLACE LEDGER",
  heroLine1: "Indias Organic",
  heroLine2: "Marketplace",
  heroText: "Every manufacturer here sells direct, under their own name, with their own story. Browse the directory, pick a manufacturer, and see exactly who grew what you're buying.",
  heroPhoto: "",
  heroPhotoCaption: "Add a photo that represents this marketplace",
  browseLabel: "Browse Manufacturers",
  stat1Num: "1",
  stat1Label: "manufacturers listed",
  stat2Num: "0",
  stat2Label: "middlemen involved",
  stat3Num: "₹999",
  stat3Label: "free delivery threshold (typical)",
  directoryHeading: "Manufacturers",
  directoryIntro: "Every seller on this marketplace runs their own storefront — their own story, their own products, their own prices.",
  missionHeading: "Our Mission",
  missionIntro: "We built this marketplace on one belief: buying organic shouldn't mean trusting a label — it should mean trusting a name.",
  missionBody: "Every manufacturer here sells under their own identity, with their own story and their own certifications, so you always know exactly whose farm your food came from. We don't buy, repackage, or resell anything ourselves — we just make it possible to find and buy directly from the people who grew it.",
  missionPoints: [
    "No private-label repackaging — every product is sold under the maker's own name",
    "Every manufacturer's certifications are visible on their own page",
    "Manufacturers set their own prices; we don't mark anything up",
    "Direct contact information for every seller, always",
  ],
  getStartedHeading: "How to Get Started",
  getStartedIntro: "Whether you're here to buy or here to sell, getting started takes just a few steps.",
  buyerHeading: "For Buyers",
  buyerIntro: "Buying direct from an organic manufacturer takes three steps.",
  buyerSteps: [
    "Browse the Manufacturers directory and open a storefront that interests you",
    "Read their story, mission, and certifications so you know exactly who you're buying from",
    "Add their products to your crate and check out — each order is from one farm so you can pay that farm directly by UPI",
  ],
  manufacturerHeading: "For Manufacturers",
  manufacturerIntro: "Are you a farmer or organic producer? Here's how to list your company and start selling direct.",
  manufacturerSteps: [
    "Turn on Edit Mode, then open the Manufacturers directory and click \"+ Add manufacturer\"",
    "Enter your company name, tagline, and logo to create your storefront",
    "Visit your new page and fill in your story, mission, farming practices, and certifications",
    "Add your products with photos, prices, and units on the Order Now tab",
    "Open Contact Information → enter your UPI ID → tap Generate QR code (and optional FSSAI)",
    "You're live — buyers scan your QR at checkout and pay you with Google Pay, PhonePe, or Paytm",
  ],
  footerText: "A marketplace for organic manufacturers who sell direct, under their own name.",
  contactEmail: "hello@indiasorganic.market",
  contactPhone: "+91 98765 43210",
  footerBottomText: "Every manufacturer, verified.",
  copy: {
    navHome: "Home",
    navManufacturers: "Manufacturers",
    navMission: "Our Mission",
    navGetStarted: "How to Get Started",
    missionPointsHeading: "What that means in practice",
    emptyDirectoryText: "No manufacturers listed yet.",
    emptyDirectoryAdminText: "No manufacturers listed yet — add one above.",
    emptyShopText: "No products in this category yet.",
    allCategoryLabel: "All",
    featuredHeading: "Featured this season",
    addButtonLabel: "Add",
    addProductButtonLabel: "+ Add product",
    addManufacturerLabel: "+ Add manufacturer",
    pendingBadgeLabel: "Pending Review",
    rejectedBadgeLabel: "Not Approved",
    approveLabel: "Approve",
    denyLabel: "Deny",
    reviewBannerText: "This manufacturer hasn't been approved yet. Review their story, mission, and products, then approve or deny below.",
    rejectedBannerText: "This manufacturer was denied. They're hidden from the public directory.",
    visitStoreLabel: "Visit store →",
    cartTitle: "Your Crate",
    emptyCartText: "Your crate is empty. Add something fresh from the shop.",
    removeLabel: "Remove",
    subtotalLabel: "Subtotal",
    deliveryLabel: "Delivery",
    totalLabel: "Total",
    freeLabel: "Free",
    proceedCheckoutLabel: "Order online →",
    deliveryDetailsHeading: "Delivery details",
    paymentHeading: "Pay this farm",
    codLabel: "Cash on delivery",
    upiLabel: "UPI (Google Pay / PhonePe / Paytm)",
    placeOrderPrefix: "I have paid",
    orderSummaryHeading: "Order summary",
    confirmHeading: "Payment noted — your crate is being packed.",
    continueShoppingLabel: "Continue shopping",
    valuesHeading: "What we hold ourselves to",
    missionHeading: "Our mission",
    practicesHeading: "How we grow",
    certHeading: "Certifications",
    contactHeading: "Contact & delivery",
    shopHeading: "Shop this manufacturer",
    orderNowLabel: "Order Now",
    ourStoryLabel: "Our Story",
    contactInfoLabel: "Contact Information",
    footerContactHeading: "Contact",
    footerDeliveryHeading: "About this marketplace",
    oneFarmCartNote: "Your crate is for one farm at a time. Adding from another farm clears the previous crate.",
    payScanHint: "Scan this farm’s QR code with Google Pay, PhonePe, Paytm, or any UPI app. Then tap “I have paid”.",
  },
  customTextSections: {
    home: [],
    directory: [],
    mission: [],
    getstarted: [],
  },
  sectionStacks: {
    home: [],
    directory: [],
    mission: null,
    getstarted: null,
  },
  sectionPhotos: {
    home: {},
    directory: {},
    mission: {},
    getstarted: {},
  },
};

export function manufacturerId() {
  return "m_" + Math.random().toString(36).slice(2, 9);
}

export function uid() {
  return "p_" + Math.random().toString(36).slice(2, 9);
}

export function rupee(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

export function categoryIcon(cat = "") {
  const c = cat.toLowerCase();
  if (c.includes("grain") || c.includes("rice") || c.includes("wheat")) return "wheat";
  if (c.includes("chilli")) return "chilli";
  if (c.includes("spice") || c.includes("turmeric")) return "root";
  if (c.includes("honey")) return "comb";
  if (c.includes("oil") || c.includes("ghee")) return "drop";
  if (c.includes("pulse") || c.includes("dal") || c.includes("lentil")) return "pod";
  if (c.includes("sweet") || c.includes("jaggery")) return "seed";
  if (c.includes("preserve") || c.includes("pickle") || c.includes("murabba")) return "jar";
  if (c.includes("herb") || c.includes("tea")) return "herb";
  if (c.includes("fruit") || c.includes("citrus")) return "citrus";
  if (c.includes("flower")) return "flower";
  return "plant";
}
