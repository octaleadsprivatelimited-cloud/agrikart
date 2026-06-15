// E-commerce store: products, cart, orders, addresses, tickets, settings.
// LocalStorage-backed. Replace with backend later.
import { useEffect, useState } from "react";

export type Category = "Pesticides" | "Fertilisers" | "Implements" | "Organic" | "Speciality Nutrients" | "Veterinary" | "Seeds" | "Nano";
export const CATEGORIES: Category[] = ["Pesticides", "Fertilisers", "Implements", "Organic", "Speciality Nutrients", "Veterinary", "Seeds", "Nano"];

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  brand: string;
  manufacturer: string;
  price: number;
  discountPrice?: number;
  stock: number;
  reorderLevel: number;
  batchNumber: string;
  expiryDate: string; // ISO date
  license: string;
  description: string;
  usage: string;
  safety: string;
  image: string; // emoji or url
  status: "Active" | "Inactive";
  supplier: string;
  cropTags: string[];
};

export type CartLine = { productId: string; qty: number };
export type Address = {
  id: string; userId: string; label: string; name: string; mobile: string;
  line1: string; village: string; mandal: string; district: string; pincode: string; isDefault?: boolean;
};
export type OrderStatus = "New" | "Approved" | "Packed" | "Shipped" | "Delivered" | "Cancelled" | "Returned";
export type PaymentMode = "COD" | "Online";
export type PaymentState = "Pending" | "Paid" | "Refunded";
export type OrderLine = { productId: string; name: string; price: number; qty: number };
export type Order = {
  id: string; userId: string; userName: string; mobile: string;
  lines: OrderLine[]; subtotal: number; shipping: number; total: number;
  paymentMode: PaymentMode; paymentState: PaymentState;
  status: OrderStatus; address: Address; createdAt: number;
  deliveryPerson?: string; expectedDelivery?: number; deliveredProof?: string;
  history: { ts: number; note: string }[];
};
export type Ticket = {
  id: string; userId: string; userName: string; orderId?: string;
  topic: "Product" | "Order" | "Delivery" | "Payment" | "Other";
  subject: string; message: string;
  status: "Open" | "In Progress" | "Closed";
  replies: { ts: number; author: string; message: string }[];
  createdAt: number;
};
export type CompanySettings = {
  name: string; tagline: string; gstin: string; license: string;
  phone: string; email: string; address: string;
  codEnabled: boolean; onlineEnabled: boolean; freeShippingAbove: number; shippingFee: number;
  bankAccountNumber: string; bankAccountName: string; bankAccountType: string; bankIfsc: string; bankName: string;
};

const PROD_KEY = "agrikart.products";
const CART_KEY = "agrikart.cart"; // per session, latest user
const ORDERS_KEY = "agrikart.orders";
const ADDR_KEY = "agrikart.addresses";
const TICKETS_KEY = "agrikart.tickets";
const SETTINGS_KEY = "agrikart.settings";
const MOVES_KEY = "agrikart.stock_moves";
const SEED_KEY = "agrikart.shop_seed_v2";

export type StockMove = {
  id: string; productId: string; productName: string;
  delta: number; reason: string; ts: number;
};

function read<T>(k: string, fb: T): T {
  if (typeof window === "undefined") return fb;
  try { return JSON.parse(localStorage.getItem(k) ?? "") as T; } catch { return fb; }
}
function write(k: string, v: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(k, JSON.stringify(v));
}
function emit(name: string) { window.dispatchEvent(new Event(name)); }

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const today = () => Date.now();
const isoPlus = (days: number) => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);

function seed() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(SEED_KEY)) return;

  const seedProducts: Omit<Product, "id" | "slug">[] = [
    {
      name: "Tata Bahaar Imidacloprid 17.8% SL", category: "Pesticides", brand: "Tata Rallis", manufacturer: "Rallis India Ltd",
      price: 420, discountPrice: 380, stock: 120, reorderLevel: 20,
      batchNumber: "BH2025-A18", expiryDate: isoPlus(540), license: "CIB&RC/2024/PEST/1187",
      description: "Systemic insecticide for sucking pests in cotton, paddy, vegetables.",
      usage: "Dissolve 1 ml per litre of water. Spray uniformly during early infestation, preferably in evening.",
      safety: "Wear gloves and mask. Do not eat or smoke while spraying. Keep away from children and water sources. Toxic to bees — avoid flowering stage.",
      image: "🧪", status: "Active", supplier: "Rallis Wholesale, Hyderabad", cropTags: ["Cotton", "Paddy", "Chilli"],
    },
    {
      name: "Coromandel Gromor 28-28-0 Complex", category: "Fertilisers", brand: "Coromandel", manufacturer: "Coromandel International",
      price: 1450, stock: 88, reorderLevel: 15,
      batchNumber: "CRM-GR-28C", expiryDate: isoPlus(900), license: "FCO/AP/2024/F-2241",
      description: "Balanced NPK complex fertilizer ideal for basal application across most crops.",
      usage: "Apply 50 kg per acre as basal dose before sowing. Mix well with topsoil.",
      safety: "Store in dry place. Avoid skin contact for long durations. Wash hands after use.",
      image: "🌱", status: "Active", supplier: "Coromandel Depot, Vijayawada", cropTags: ["Paddy", "Maize", "Cotton"],
    },
    {
      name: "Mahyco Bt Cotton MRC 7351 BG-II", category: "Seeds", brand: "Mahyco", manufacturer: "Maharashtra Hybrid Seeds",
      price: 950, stock: 6, reorderLevel: 10,
      batchNumber: "MH-7351-25", expiryDate: isoPlus(180), license: "SEED/CERT/AP/2024/2210",
      description: "High-yielding Bt cotton hybrid with bollworm resistance, suitable for rainfed and irrigated areas.",
      usage: "Sow 1 packet per acre with 90x60 cm spacing. Treat seeds with recommended fungicide before sowing.",
      safety: "Genetically modified seed — sow refuge crop as per ICAR guidelines. Do not consume.",
      image: "🌾", status: "Active", supplier: "Mahyco AP Depot", cropTags: ["Cotton"],
    },
    {
      name: "Knapsack Manual Sprayer 16L", category: "Implements", brand: "Aspee", manufacturer: "American Spring & Pressing",
      price: 1850, discountPrice: 1699, stock: 42, reorderLevel: 8,
      batchNumber: "ASP-KS16-A12", expiryDate: isoPlus(1800), license: "BIS:IS-3756",
      description: "Durable 16-litre manual knapsack sprayer with brass nozzle and adjustable strap.",
      usage: "Fill up to 16 L. Pump to build pressure, hold trigger and spray evenly. Clean after every use.",
      safety: "Do not over-pressurize. Inspect hose and seals before use. Keep away from children.",
      image: "🛠️", status: "Active", supplier: "Aspee Distributors", cropTags: ["All Crops"],
    },
    {
      name: "UPL Saaf Carbendazim + Mancozeb 75% WP", category: "Organic", brand: "UPL", manufacturer: "UPL Limited",
      price: 540, stock: 0, reorderLevel: 12,
      batchNumber: "UPL-SAAF-24", expiryDate: isoPlus(60), license: "CIB&RC/2023/PROT/0902",
      description: "Broad-spectrum systemic + contact fungicide for blight, sheath blight, rust and leaf spots.",
      usage: "Mix 2 g per litre of water and spray on leaves at first symptom. Repeat after 10–14 days.",
      safety: "Wear protective clothing, gloves and mask. Wash thoroughly after handling. Do not contaminate water bodies.",
      image: "🛡️", status: "Active", supplier: "UPL South India", cropTags: ["Paddy", "Wheat", "Vegetables"],
    },
    {
      name: "IFFCO Urea 46% N", category: "Fertilisers", brand: "IFFCO", manufacturer: "IFFCO",
      price: 295, stock: 240, reorderLevel: 50,
      batchNumber: "IFC-UREA-08", expiryDate: isoPlus(720), license: "FCO/2024/UREA",
      description: "Nitrogen-rich urea fertilizer for top-dressing and tillering stages.",
      usage: "Apply 40–60 kg per acre split across tillering and panicle initiation stages.",
      safety: "Avoid contact with eyes. Do not apply on wet leaves to prevent scorching.",
      image: "🌿", status: "Active", supplier: "IFFCO Cooperative", cropTags: ["Paddy", "Wheat"],
    },
    {
      name: "Kaveri Tomato KS-227 Hybrid Seed", category: "Seeds", brand: "Kaveri", manufacturer: "Kaveri Seeds",
      price: 1200, discountPrice: 1099, stock: 35, reorderLevel: 8,
      batchNumber: "KS-227-T", expiryDate: isoPlus(220), license: "SEED/CERT/AP/2024/2284",
      description: "Determinate tomato hybrid with firm fruits, good shelf life and transport tolerance.",
      usage: "Nursery 25 days, transplant 60x45 cm. Drip irrigation recommended. Stake plants at 30 DAT.",
      safety: "Treat seeds with Thiram before sowing. Keep away from rodents.",
      image: "🍅", status: "Active", supplier: "Kaveri Seeds Hyderabad", cropTags: ["Tomato"],
    },
    {
      name: "Battery Operated Cordless Pruner", category: "Implements", brand: "Stihl", manufacturer: "Stihl India",
      price: 8500, stock: 14, reorderLevel: 5,
      batchNumber: "STL-PR-12V", expiryDate: isoPlus(1800), license: "BIS:IS-13947",
      description: "Lightweight cordless pruner for orchards and vineyards. 30 mm cutting capacity.",
      usage: "Charge battery fully before use. Cut at 45° angle for healthy regrowth.",
      safety: "Always engage safety lock when not cutting. Wear cut-resistant gloves.",
      image: "✂️", status: "Active", supplier: "Stihl Authorized Dealer", cropTags: ["Mango", "Grapes", "Citrus"],
    },
  ];

  const products: Product[] = seedProducts.map((p, i) => ({
    ...p,
    id: "prd-" + (i + 1).toString().padStart(3, "0"),
    slug: slugify(p.name),
  }));
  write(PROD_KEY, products);

  const settings: CompanySettings = {
    name: "AgriKart Fin Tech Pvt Ltd",
    tagline: "Smart agri-inputs and finance for Indian farmers",
    gstin: "36AAFCA1234L1ZP",
    license: "Pesticide License No. AP/PEST/2024/1187 · Fertilizer License No. FCO/AP/F-2241",
    phone: "+91 98765 43210",
    email: "support@agrifincart.com",
    address: "AgriKart Fin Tech Pvt Ltd, Plot 12, Madhapur, Hyderabad, Telangana 500081",
    codEnabled: true, onlineEnabled: true, freeShippingAbove: 999, shippingFee: 49,
    bankAccountNumber: "50200121562101",
    bankAccountName: "AGRIKART FIN TECH PRIVATE LIMITED",
    bankAccountType: "Current",
    bankIfsc: "HDFC0000518",
    bankName: "HDFC Bank",
  };
  write(SETTINGS_KEY, settings);

  // Demo orders for admin views
  const demoUser = "user-demo";
  const demoAddr: Address = {
    id: "addr-demo", userId: demoUser, label: "Home", name: "Demo Farmer",
    mobile: "9876543210", line1: "H.No 2-15, Main Road", village: "Mulkanoor",
    mandal: "Bheemadevarapalli", district: "Hanamkonda", pincode: "506367", isDefault: true,
  };
  write(ADDR_KEY, [demoAddr]);

  const sample = (lines: OrderLine[], status: OrderStatus, daysAgo: number, mode: PaymentMode): Order => {
    const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
    const shipping = subtotal >= settings.freeShippingAbove ? 0 : settings.shippingFee;
    return {
      id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      userId: demoUser, userName: demoAddr.name, mobile: demoAddr.mobile,
      lines, subtotal, shipping, total: subtotal + shipping,
      paymentMode: mode, paymentState: mode === "COD" ? "Pending" : "Paid",
      status, address: demoAddr, createdAt: today() - daysAgo * 86400000,
      history: [{ ts: today() - daysAgo * 86400000, note: "Order placed" }],
    };
  };
  const p = (id: string) => products.find(x => x.id === id)!;
  const orders: Order[] = [
    sample([{ productId: p("prd-001").id, name: p("prd-001").name, price: p("prd-001").discountPrice!, qty: 2 }], "Delivered", 14, "Online"),
    sample([{ productId: p("prd-002").id, name: p("prd-002").name, price: p("prd-002").price, qty: 1 }], "Shipped", 3, "COD"),
    sample([{ productId: p("prd-004").id, name: p("prd-004").name, price: p("prd-004").discountPrice!, qty: 1 }], "Packed", 1, "Online"),
    sample([{ productId: p("prd-006").id, name: p("prd-006").name, price: p("prd-006").price, qty: 4 }], "New", 0, "COD"),
  ];
  write(ORDERS_KEY, orders);

  const tickets: Ticket[] = [
    {
      id: "TKT-1001", userId: demoUser, userName: "Demo Farmer",
      topic: "Delivery", subject: "Delivery delayed for ORD-001",
      message: "Order was promised in 3 days but still not received.",
      status: "Open", replies: [], createdAt: today() - 2 * 86400000,
    },
  ];
  write(TICKETS_KEY, tickets);

  localStorage.setItem(SEED_KEY, "1");
}
seed();

// ---------- Hooks helpers ----------
function useStore<T>(key: string, eventName: string, fb: T): T {
  // Start with fallback on both server and client first render to avoid
  // hydration mismatches; populate from localStorage in an effect.
  const [v, set] = useState<T>(fb);
  useEffect(() => {
    const sync = () => set(read<T>(key, fb));
    sync();
    window.addEventListener(eventName, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(eventName, sync);
      window.removeEventListener("storage", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, eventName]);
  return v;
}

// ---------- Products ----------
export const useProducts = () => useStore<Product[]>(PROD_KEY, "agrikart-products", []);
export function getProductBySlug(slug: string) { return read<Product[]>(PROD_KEY, []).find(p => p.slug === slug); }
export function getProduct(id: string) { return read<Product[]>(PROD_KEY, []).find(p => p.id === id); }
export function upsertProduct(input: Omit<Product, "id" | "slug"> & { id?: string }) {
  const all = read<Product[]>(PROD_KEY, []);
  if (input.id) {
    const next = all.map(p => p.id === input.id ? { ...p, ...input, slug: slugify(input.name) } as Product : p);
    write(PROD_KEY, next);
  } else {
    const id = "prd-" + crypto.randomUUID().slice(0, 6);
    const item: Product = { ...input, id, slug: slugify(input.name) };
    write(PROD_KEY, [item, ...all]);
  }
  emit("agrikart-products");
}
export function deleteProduct(id: string) {
  write(PROD_KEY, read<Product[]>(PROD_KEY, []).filter(p => p.id !== id));
  emit("agrikart-products");
}
export const useStockMoves = () => useStore<StockMove[]>(MOVES_KEY, "agrikart-moves", []);
export function adjustStock(id: string, delta: number, reason: string) {
  const all = read<Product[]>(PROD_KEY, []);
  const prod = all.find(p => p.id === id);
  write(PROD_KEY, all.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p));
  const moves = read<StockMove[]>(MOVES_KEY, []);
  write(MOVES_KEY, [{
    id: "mv-" + crypto.randomUUID().slice(0, 6),
    productId: id, productName: prod?.name ?? id,
    delta, reason, ts: Date.now(),
  }, ...moves].slice(0, 500));
  emit("agrikart-products");
  emit("agrikart-moves");
}

// ---------- Cart ----------
type CartMap = Record<string, CartLine[]>;
export function useCart(userId?: string) {
  const all = useStore<CartMap>(CART_KEY, "agrikart-cart", {});
  return userId ? (all[userId] ?? []) : [];
}
function writeCart(userId: string, lines: CartLine[]) {
  const all = read<CartMap>(CART_KEY, {});
  all[userId] = lines;
  write(CART_KEY, all);
  emit("agrikart-cart");
}
export function addToCart(userId: string, productId: string, qty = 1) {
  const all = read<CartMap>(CART_KEY, {});
  const lines = all[userId] ?? [];
  const i = lines.findIndex(l => l.productId === productId);
  if (i >= 0) lines[i] = { ...lines[i], qty: lines[i].qty + qty };
  else lines.push({ productId, qty });
  writeCart(userId, lines);
}
export function updateCartQty(userId: string, productId: string, qty: number) {
  const lines = (read<CartMap>(CART_KEY, {})[userId] ?? []).map(l => l.productId === productId ? { ...l, qty } : l).filter(l => l.qty > 0);
  writeCart(userId, lines);
}
export function removeFromCart(userId: string, productId: string) {
  const lines = (read<CartMap>(CART_KEY, {})[userId] ?? []).filter(l => l.productId !== productId);
  writeCart(userId, lines);
}
export function clearCart(userId: string) { writeCart(userId, []); }

// ---------- Addresses ----------
export const useAddresses = (userId?: string) => useStore<Address[]>(ADDR_KEY, "agrikart-addr", []).filter(a => !userId || a.userId === userId);
export function addAddress(a: Omit<Address, "id">) {
  const all = read<Address[]>(ADDR_KEY, []);
  const item: Address = { ...a, id: "addr-" + crypto.randomUUID().slice(0, 6) };
  if (item.isDefault) all.forEach(x => { if (x.userId === item.userId) x.isDefault = false; });
  write(ADDR_KEY, [item, ...all]);
  emit("agrikart-addr");
}
export function deleteAddress(id: string) {
  write(ADDR_KEY, read<Address[]>(ADDR_KEY, []).filter(a => a.id !== id));
  emit("agrikart-addr");
}

// ---------- Orders ----------
export const useOrders = (userId?: string) => useStore<Order[]>(ORDERS_KEY, "agrikart-orders", []).filter(o => !userId || o.userId === userId);
export function getOrder(id: string) { return read<Order[]>(ORDERS_KEY, []).find(o => o.id === id); }
export function placeOrder(input: {
  userId: string; userName: string; mobile: string; address: Address;
  lines: OrderLine[]; paymentMode: PaymentMode;
}): Order {
  const settings = getSettings();
  const subtotal = input.lines.reduce((s, l) => s + l.price * l.qty, 0);
  const shipping = subtotal >= settings.freeShippingAbove ? 0 : settings.shippingFee;
  const order: Order = {
    id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
    ...input, subtotal, shipping, total: subtotal + shipping,
    paymentState: input.paymentMode === "COD" ? "Pending" : "Paid",
    status: "New", createdAt: today(),
    history: [{ ts: today(), note: "Order placed" }],
  };
  const all = read<Order[]>(ORDERS_KEY, []);
  write(ORDERS_KEY, [order, ...all]);
  // Decrement stock
  input.lines.forEach(l => adjustStock(l.productId, -l.qty, "order:" + order.id));
  clearCart(input.userId);
  emit("agrikart-orders");
  return order;
}
export function updateOrderStatus(id: string, status: OrderStatus, note?: string) {
  const all = read<Order[]>(ORDERS_KEY, []);
  write(ORDERS_KEY, all.map(o => o.id === id ? {
    ...o, status,
    history: [...o.history, { ts: today(), note: note ?? `Status → ${status}` }],
  } : o));
  emit("agrikart-orders");
}
export function setOrderPayment(id: string, state: PaymentState) {
  const all = read<Order[]>(ORDERS_KEY, []);
  write(ORDERS_KEY, all.map(o => o.id === id ? { ...o, paymentState: state } : o));
  emit("agrikart-orders");
}
export function assignDelivery(id: string, person: string, expected: number) {
  const all = read<Order[]>(ORDERS_KEY, []);
  write(ORDERS_KEY, all.map(o => o.id === id ? {
    ...o, deliveryPerson: person, expectedDelivery: expected,
    history: [...o.history, { ts: today(), note: `Assigned to ${person}` }],
  } : o));
  emit("agrikart-orders");
}

// ---------- Tickets ----------
export const useTickets = (userId?: string) => useStore<Ticket[]>(TICKETS_KEY, "agrikart-tickets", []).filter(t => !userId || t.userId === userId);
export function createTicket(input: Omit<Ticket, "id" | "status" | "replies" | "createdAt">): Ticket {
  const item: Ticket = { ...input, id: "TKT-" + Math.floor(1000 + Math.random() * 9000), status: "Open", replies: [], createdAt: today() };
  const all = read<Ticket[]>(TICKETS_KEY, []);
  write(TICKETS_KEY, [item, ...all]);
  emit("agrikart-tickets");
  return item;
}
export function replyTicket(id: string, author: string, message: string, status?: Ticket["status"]) {
  const all = read<Ticket[]>(TICKETS_KEY, []);
  write(TICKETS_KEY, all.map(t => t.id === id ? {
    ...t, status: status ?? t.status,
    replies: [...t.replies, { ts: today(), author, message }],
  } : t));
  emit("agrikart-tickets");
}

// ---------- Settings ----------
export function getSettings(): CompanySettings { return read<CompanySettings>(SETTINGS_KEY, {
  name: "AgriKart Fin Tech Pvt Ltd", tagline: "", gstin: "", license: "",
  phone: "", email: "", address: "", codEnabled: true, onlineEnabled: true, freeShippingAbove: 999, shippingFee: 49,
  bankAccountNumber: "50200121562101", bankAccountName: "AGRIKART FIN TECH PRIVATE LIMITED", bankAccountType: "Current",
  bankIfsc: "HDFC0000518", bankName: "HDFC Bank",
}); }
export const useSettings = () => useStore<CompanySettings>(SETTINGS_KEY, "agrikart-settings", getSettings());
export function updateSettings(patch: Partial<CompanySettings>) {
  write(SETTINGS_KEY, { ...getSettings(), ...patch });
  emit("agrikart-settings");
}

// ---------- Derived helpers ----------
export function lowStock(products: Product[]) { return products.filter(p => p.stock > 0 && p.stock <= p.reorderLevel); }
export function outOfStock(products: Product[]) { return products.filter(p => p.stock === 0); }
export function nearExpiry(products: Product[], days = 90) {
  const cutoff = Date.now() + days * 86400000;
  return products.filter(p => new Date(p.expiryDate).getTime() <= cutoff);
}
export const fmt = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
