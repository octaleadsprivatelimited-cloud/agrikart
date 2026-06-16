// Staff (employee/admin) + customer + service-request store. localStorage-backed.
import { useEffect, useState } from "react";
import { firebaseAuth, firebaseConfig } from "./firebase";
import { initializeApp, getApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut, signInWithEmailAndPassword } from "firebase/auth";

export type StaffRole = "employee" | "admin";
export type Staff = { id: string; email: string; name: string; role: StaffRole };
type StoredStaff = Staff & { password: string };

const STAFF_KEY = "agrikart.staff";
const STAFF_SESSION_KEY = "agrikart.staff_session";
const CUSTOMERS_KEY = "agrikart.customers";
const REQUESTS_KEY = "agrikart.service_requests";
const PAYMENTS_KEY = "agrikart.payments";
const CUSTOMER_EDITS_KEY = "agrikart.customer_edits";
const SUBMISSIONS_KEY = "agrikart.submissions";
const SEED_KEY = "agrikart.seeded_v4";
export const ADMIN_DEFAULT_EMAIL = "agrikartfintechpvtltd@gmail.com";
export const ADMIN_DEFAULT_PASSWORD = "Agri@2026";

// ---------- Permissions (role-based access control) ----------
export const permissions = {
  canEditCustomer(staff: Staff | null, c: Pick<Customer, "employeeId">): boolean {
    if (!staff) return false;
    if (staff.role === "admin") return true;
    return staff.id === c.employeeId;
  },
  canDeleteCustomer(_staff: Staff | null): boolean { return false; },
  canChangeCustomerStatus(staff: Staff | null): boolean { return staff?.role === "admin"; },
  canManageStaff(staff: Staff | null): boolean { return staff?.role === "admin"; },
  canViewAllCustomers(staff: Staff | null): boolean { return staff?.role === "admin"; },
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(key) ?? "") as T; } catch { return fallback; }
}
function write(key: string, val: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(val));
}

function seed() {
  if (typeof window === "undefined") return;
  const required: StoredStaff[] = [
    { id: "emp-demo", email: "employee@agrifincart.com", password: "password123", name: "Ravi Kumar", role: "employee" },
    { id: "adm-demo", email: ADMIN_DEFAULT_EMAIL, password: ADMIN_DEFAULT_PASSWORD, name: "Site Admin", role: "admin" },
  ];
  const existing = read<StoredStaff[]>(STAFF_KEY, []);
  const seeded = localStorage.getItem(SEED_KEY);
  let changed = false;

  if (!seeded) {
    // One-time forced rotation: ensure the canonical admin account exists with the
    // configured email/password, and drop any legacy admin@agrifincart.com seed.
    const legacyIdx = existing.findIndex(s => s.email.toLowerCase() === "admin@agrifincart.com");
    if (legacyIdx !== -1) { existing.splice(legacyIdx, 1); changed = true; }
    const admIdx = existing.findIndex(s => s.id === "adm-demo");
    const adm = required[1];
    if (admIdx === -1) { existing.push(adm); changed = true; }
    else {
      existing[admIdx] = { ...existing[admIdx], email: adm.email, password: adm.password, role: "admin" };
      changed = true;
    }
  }

  for (const r of required) {
    const idx = existing.findIndex(s => s.email.toLowerCase() === r.email.toLowerCase());
    if (idx === -1) { existing.push(r); changed = true; }
  }

  if (changed || !seeded) {
    write(STAFF_KEY, existing);
    localStorage.setItem(SEED_KEY, "1");
  }
}
seed();

// ---------- Password management ----------
export function changeStaffPassword(id: string, currentPassword: string, newPassword: string) {
  if (!newPassword || newPassword.length < 6) throw new Error("New password must be at least 6 characters.");
  const all = read<StoredStaff[]>(STAFF_KEY, []);
  const idx = all.findIndex(s => s.id === id);
  if (idx === -1) throw new Error("Account not found");
  if (all[idx].password !== currentPassword) throw new Error("Current password is incorrect");
  all[idx] = { ...all[idx], password: newPassword };
  write(STAFF_KEY, all);
  window.dispatchEvent(new Event("agrikart-staff"));
}

export function resetStaffPassword(actor: Staff | null, targetId: string, newPassword: string) {
  if (!actor || actor.role !== "admin") throw new Error("Only admins can reset passwords");
  if (!newPassword || newPassword.length < 6) throw new Error("Password must be at least 6 characters.");
  const all = read<StoredStaff[]>(STAFF_KEY, []);
  const idx = all.findIndex(s => s.id === targetId);
  if (idx === -1) throw new Error("Account not found");
  all[idx] = { ...all[idx], password: newPassword };
  write(STAFF_KEY, all);
  window.dispatchEvent(new Event("agrikart-staff"));
}

export async function staffLogin(email: string, password: string): Promise<Staff> {
  seed();
  const cleanEmail = email.trim();
  let firebaseUser = null;
  let loginError: any = null;

  try {
    const res = await signInWithEmailAndPassword(firebaseAuth, cleanEmail, password);
    firebaseUser = res.user;
  } catch (err: any) {
    loginError = err;
  }

  const all = read<StoredStaff[]>(STAFF_KEY, []);

  if (firebaseUser) {
    const uid = firebaseUser.uid;
    const name = firebaseUser.displayName || "Staff Member";
    const role = (firebaseUser.photoURL === "admin" ? "admin" : "employee") as StaffRole;

    const existingIdx = all.findIndex(s => s.email.toLowerCase() === cleanEmail.toLowerCase());
    const staffData: StoredStaff = { id: uid, email: cleanEmail, name, role, password };
    
    if (existingIdx !== -1) {
      all[existingIdx] = staffData;
    } else {
      all.push(staffData);
    }
    write(STAFF_KEY, all);
    write(STAFF_SESSION_KEY, uid);
    window.dispatchEvent(new Event("agrikart-staff"));
    return { id: uid, email: cleanEmail, name, role };
  }

  // Fallback to local storage (e.g. initial demo login credentials or offline)
  const s = all.find(x => x.email.toLowerCase() === cleanEmail.toLowerCase() && x.password === password);
  if (!s) {
    if (loginError) {
      throw new Error(loginError.message || "INVALID_LOGIN");
    }
    throw new Error("INVALID_LOGIN");
  }
  write(STAFF_SESSION_KEY, s.id);
  window.dispatchEvent(new Event("agrikart-staff"));
  const { password: _p, ...rest } = s;
  return rest;
}

export function staffLogout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STAFF_SESSION_KEY);
  window.dispatchEvent(new Event("agrikart-staff"));
}

export function getCurrentStaff(): Staff | null {
  if (typeof window === "undefined") return null;
  const id = read<string | null>(STAFF_SESSION_KEY, null);
  if (!id) return null;
  const all = read<StoredStaff[]>(STAFF_KEY, []);
  const s = all.find(x => x.id === id);
  if (!s) return null;
  const { password: _p, ...rest } = s;
  return rest;
}

export function useCurrentStaff() {
  const [s, setS] = useState<Staff | null>(null);
  useEffect(() => {
    const sync = () => setS(getCurrentStaff());
    window.addEventListener("agrikart-staff", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("agrikart-staff", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return s;
}

// ---------- Staff management (admin) ----------
export function useStaffList() {
  const [items, setItems] = useState<Staff[]>([]);
  useEffect(() => {
    const sync = () => {
      const all = read<StoredStaff[]>(STAFF_KEY, []);
      setItems(all.map(({ password: _p, ...rest }) => rest));
    };
    sync();
    window.addEventListener("agrikart-staff", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("agrikart-staff", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return items;
}

async function createFirebaseStaff(input: { email: string; name: string; password: string; role: StaffRole }): Promise<string> {
  let tempApp;
  try {
    tempApp = getApp("TempRegistrationApp");
  } catch {
    tempApp = initializeApp(firebaseConfig, "TempRegistrationApp");
  }
  const tempAuth = getAuth(tempApp);
  try {
    const userCredential = await createUserWithEmailAndPassword(tempAuth, input.email, input.password);
    await updateProfile(userCredential.user, {
      displayName: input.name,
      photoURL: input.role,
    });
    await signOut(tempAuth);
    return userCredential.user.uid;
  } finally {
    await tempApp.delete();
  }
}

export async function createStaff(input: { email: string; name: string; password: string; role: StaffRole }): Promise<Staff> {
  const all = read<StoredStaff[]>(STAFF_KEY, []);
  if (all.some(s => s.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error("Email already in use");
  }
  
  let uid = (input.role === "admin" ? "adm-" : "emp-") + crypto.randomUUID().slice(0, 8);
  try {
    const firebaseUid = await createFirebaseStaff(input);
    uid = firebaseUid;
  } catch (err: any) {
    throw new Error(err.message || "Failed to create user in Firebase Auth");
  }

  const item: StoredStaff = { ...input, id: uid };
  all.push(item);
  write(STAFF_KEY, all);
  window.dispatchEvent(new Event("agrikart-staff"));
  const { password: _p, ...rest } = item;
  return rest;
}

export function deleteStaff(id: string) {
  const all = read<StoredStaff[]>(STAFF_KEY, []);
  write(STAFF_KEY, all.filter(s => s.id !== id));
  window.dispatchEvent(new Event("agrikart-staff"));
}

export function updateStaffRole(id: string, role: StaffRole) {
  const all = read<StoredStaff[]>(STAFF_KEY, []);
  write(STAFF_KEY, all.map(s => s.id === id ? { ...s, role } : s));
  window.dispatchEvent(new Event("agrikart-staff"));
}

// ---------- Customers ----------
export type CustomerStatus = "Pending" | "Approved" | "Rejected";
// Base64 data URL upload (kept small — single doc, max ~1.5 MB).
export type DocFile = {
  name: string;
  type: string;       // MIME
  size: number;       // bytes
  dataUrl: string;    // data:...;base64,...
};
export type CustomerDocuments = {
  aadhaar: { number: string; file: DocFile };
  pan:     { number: string; file: DocFile };
  land:    { surveyNo: string; file: DocFile };
};
export const DOC_MAX_BYTES = 1_500_000; // ~1.5 MB per file (localStorage safety)
export const DOC_ACCEPT_MIME = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export type FarmerType = "Owner" | "Tenant" | "Both";
export const FARMER_TYPE_LABELS: Record<FarmerType, string> = {
  Owner: "Land Owner (Sontha Rythu)",
  Tenant: "Tenant Farmer (Koulu Rythu)",
  Both: "Owner + Tenant",
};

export type Customer = {
  id: string;
  farmerCode: string;
  farmerName: string;
  farmerType?: FarmerType;
  mobile: string;
  aadhaar?: string;        // legacy plain number (deprecated, kept for old records)
  village: string;
  district: string;
  landSize: string;
  crops: string;
  gps: { lat: number; lng: number; accuracy: number; timestamp: number };
  status: CustomerStatus;
  remarks?: string;
  employeeId: string;
  employeeName: string;
  createdAt: number;
  documents?: CustomerDocuments;
};

export function isFarmerVerified(c: Pick<Customer, "status" | "documents"> | null | undefined): boolean {
  if (!c) return false;
  if (c.status !== "Approved") return false;
  const d = c.documents;
  return !!(d?.aadhaar?.file?.dataUrl && d?.pan?.file?.dataUrl && d?.land?.file?.dataUrl);
}

function generateFarmerCode(existing: Pick<Customer, "farmerCode">[]): string {
  const used = new Set(existing.map(c => c.farmerCode).filter(Boolean));
  let code = "";
  do {
    code = "AKF" + Math.random().toString(36).slice(2, 8).toUpperCase();
  } while (used.has(code));
  return code;
}

export function createCustomer(c: Omit<Customer, "id" | "status" | "createdAt" | "farmerCode">): Customer {
  const all = read<Customer[]>(CUSTOMERS_KEY, []);
  const item: Customer = {
    ...c,
    id: crypto.randomUUID(),
    farmerCode: "", // assigned only when admin approves
    status: "Pending",
    createdAt: Date.now(),
  };
  all.unshift(item);
  write(CUSTOMERS_KEY, all);
  window.dispatchEvent(new Event("agrikart-customers"));
  return item;
}

export function findCustomerByCode(code: string): Customer | undefined {
  const q = code.trim().toUpperCase();
  return read<Customer[]>(CUSTOMERS_KEY, []).find(c => c.farmerCode?.toUpperCase() === q);
}

export function updateCustomerStatus(id: string, status: CustomerStatus, editor: Staff, remarks?: string) {
  if (!permissions.canChangeCustomerStatus(editor)) {
    throw new Error("Only admins can change customer status");
  }
  const all = read<Customer[]>(CUSTOMERS_KEY, []);
  const current = all.find(c => c.id === id);
  if (!current) throw new Error("Customer not found");
  // Assign permanent Farmer ID at first approval
  const assignedCode = status === "Approved" && !current.farmerCode ? generateFarmerCode(all) : current.farmerCode;
  const next = all.map(c => c.id === id ? { ...c, status, remarks, farmerCode: assignedCode } : c);
  write(CUSTOMERS_KEY, next);
  // Log status change to audit
  const changes: CustomerEditChange[] = [{ field: "status", from: current.status, to: status }];
  if ((remarks ?? "") !== (current.remarks ?? "")) {
    changes.push({ field: "remarks", from: current.remarks ?? "", to: remarks ?? "" });
  }
  const edit: CustomerEdit = {
    id: crypto.randomUUID(), customerId: id,
    editorId: editor.id, editorName: editor.name, editorRole: editor.role,
    changes, at: Date.now(),
  };
  const log = read<CustomerEdit[]>(CUSTOMER_EDITS_KEY, []);
  log.unshift(edit);
  write(CUSTOMER_EDITS_KEY, log);
  window.dispatchEvent(new Event("agrikart-customers"));
  window.dispatchEvent(new Event("agrikart-customer-edits"));
}

export function getCustomer(id: string): Customer | undefined {
  return read<Customer[]>(CUSTOMERS_KEY, []).find(c => c.id === id);
}

export function useCustomer(id: string | undefined) {
  const [c, setC] = useState<Customer | undefined>(undefined);
  useEffect(() => {
    if (!id) return;
    const sync = () => setC(getCustomer(id));
    sync();
    window.addEventListener("agrikart-customers", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("agrikart-customers", sync);
      window.removeEventListener("storage", sync);
    };
  }, [id]);
  return c;
}

export function useCustomers(opts?: { employeeId?: string }) {
  const [items, setItems] = useState<Customer[]>([]);
  useEffect(() => {
    const sync = () => {
      const all = read<Customer[]>(CUSTOMERS_KEY, []);
      setItems(opts?.employeeId ? all.filter(c => c.employeeId === opts.employeeId) : all);
    };
    sync();
    window.addEventListener("agrikart-customers", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("agrikart-customers", sync);
      window.removeEventListener("storage", sync);
    };
  }, [opts?.employeeId]);
  return items;
}

// ---------- Customer edit history (audit log) ----------
export type CustomerEditChange = { field: string; from: string; to: string };
export type CustomerEdit = {
  id: string;
  customerId: string;
  editorId: string;
  editorName: string;
  editorRole: StaffRole;
  changes: CustomerEditChange[];
  at: number;
};

const EDITABLE_FIELDS = [
  "farmerName", "farmerType", "mobile", "aadhaar", "village", "district", "landSize", "crops", "remarks",
] as const;
type EditableField = (typeof EDITABLE_FIELDS)[number];

export function editCustomer(
  id: string,
  patch: Partial<Pick<Customer, EditableField>>,
  editor: Staff,
): { customer: Customer; edit: CustomerEdit | null } {
  const all = read<Customer[]>(CUSTOMERS_KEY, []);
  const current = all.find(c => c.id === id);
  if (!current) throw new Error("Customer not found");
  if (!permissions.canEditCustomer(editor, current)) {
    throw new Error("You don't have permission to edit this customer");
  }

  const changes: CustomerEditChange[] = [];
  const next: Customer = { ...current };
  for (const f of EDITABLE_FIELDS) {
    if (!(f in patch)) continue;
    const newVal = (patch[f] ?? "") as string;
    const oldVal = ((current[f] as string | undefined) ?? "");
    if (String(newVal).trim() !== String(oldVal).trim()) {
      changes.push({ field: f, from: String(oldVal), to: String(newVal) });
      (next[f] as string) = String(newVal);
    }
  }

  if (changes.length === 0) return { customer: current, edit: null };

  write(CUSTOMERS_KEY, all.map(c => c.id === id ? next : c));
  const edit: CustomerEdit = {
    id: crypto.randomUUID(),
    customerId: id,
    editorId: editor.id,
    editorName: editor.name,
    editorRole: editor.role,
    changes,
    at: Date.now(),
  };
  const log = read<CustomerEdit[]>(CUSTOMER_EDITS_KEY, []);
  log.unshift(edit);
  write(CUSTOMER_EDITS_KEY, log);
  window.dispatchEvent(new Event("agrikart-customers"));
  window.dispatchEvent(new Event("agrikart-customer-edits"));
  return { customer: next, edit };
}

export function useCustomerEdits(customerId: string | undefined) {
  const [items, setItems] = useState<CustomerEdit[]>([]);
  useEffect(() => {
    if (!customerId) return;
    const sync = () => {
      const all = read<CustomerEdit[]>(CUSTOMER_EDITS_KEY, []);
      setItems(all.filter(e => e.customerId === customerId).sort((a, b) => b.at - a.at));
    };
    sync();
    window.addEventListener("agrikart-customer-edits", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("agrikart-customer-edits", sync);
      window.removeEventListener("storage", sync);
    };
  }, [customerId]);
  return items;
}

// ---------- Service requests (per customer) ----------
export type ServiceCategory = "Drone" | "Seeds" | "Fertilizers" | "Pesticides" | "Loan" | "Insurance" | "Cold Storage" | "Market Linkage & Buy-back" | "General Inquiry";
export type ServiceRequest = {
  id: string;
  customerId: string;
  category: ServiceCategory;
  description: string;
  status: CustomerStatus;
  createdAt: number;
};

export const serviceCategories: ServiceCategory[] = ["Drone","Seeds","Fertilizers","Pesticides","Loan","Insurance","Cold Storage","Market Linkage & Buy-back","General Inquiry"];

export function addServiceRequest(customerId: string, category: ServiceCategory, description: string): ServiceRequest {
  const all = read<ServiceRequest[]>(REQUESTS_KEY, []);
  const item: ServiceRequest = {
    id: crypto.randomUUID(), customerId, category, description,
    status: "Pending", createdAt: Date.now(),
  };
  all.unshift(item);
  write(REQUESTS_KEY, all);
  window.dispatchEvent(new Event("agrikart-requests"));
  return item;
}

export function updateRequestStatus(id: string, status: CustomerStatus) {
  const all = read<ServiceRequest[]>(REQUESTS_KEY, []);
  write(REQUESTS_KEY, all.map(r => r.id === id ? { ...r, status } : r));
  window.dispatchEvent(new Event("agrikart-requests"));
}

export function useRequests(opts?: { customerId?: string }) {
  const [items, setItems] = useState<ServiceRequest[]>([]);
  useEffect(() => {
    const sync = () => {
      const all = read<ServiceRequest[]>(REQUESTS_KEY, []);
      setItems(opts?.customerId ? all.filter(r => r.customerId === opts.customerId) : all);
    };
    sync();
    window.addEventListener("agrikart-requests", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("agrikart-requests", sync);
      window.removeEventListener("storage", sync);
    };
  }, [opts?.customerId]);
  return items;
}

// ---------- Geolocation helper ----------
export function captureGps(): Promise<{ lat: number; lng: number; accuracy: number; timestamp: number }> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        timestamp: pos.timestamp,
      }),
      (err) => reject(new Error(err.message || "Geolocation permission denied.")),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  });
}

// ---------- Payments ----------
export type PaymentKind = "joining" | "renewal";
export type PaymentStatus = "Succeeded" | "Refunded" | "Failed";
export type Payment = {
  id: string;          // Transaction ID
  orderId: string;     // Order ID
  farmerId: string;
  farmerName?: string;
  mobile?: string;
  email?: string;
  kind: PaymentKind;
  amount: number;
  status: PaymentStatus;
  method?: "Cash" | "UPI" | "Card" | "NetBanking";
  reference?: string;   // UPI ref / cheque no / receipt no
  note?: string;
  collectedById?: string;   // staff id who collected
  collectedByName?: string;
  refundedAt?: number;
  refundReason?: string;
  createdAt: number;
};

export function recordPayment(p: Omit<Payment, "id" | "orderId" | "createdAt" | "status"> & { status?: PaymentStatus }): Payment {
  const all = read<Payment[]>(PAYMENTS_KEY, []);
  const methods: NonNullable<Payment["method"]>[] = ["UPI", "Card", "NetBanking"];
  const item: Payment = {
    ...p,
    status: p.status ?? "Succeeded",
    method: p.method ?? methods[Math.floor(Math.random() * methods.length)],
    id: "TXN-" + crypto.randomUUID().slice(0, 10).toUpperCase().replace(/-/g, ""),
    orderId: "ORD-" + Date.now().toString(36).toUpperCase() + "-" + Math.floor(Math.random() * 9000 + 1000),
    createdAt: Date.now(),
  };
  all.unshift(item);
  write(PAYMENTS_KEY, all);
  window.dispatchEvent(new Event("agrikart-payments"));
  return item;
}

export function refundPayment(id: string, reason: string) {
  const all = read<Payment[]>(PAYMENTS_KEY, []);
  write(PAYMENTS_KEY, all.map(p => p.id === id ? { ...p, status: "Refunded" as PaymentStatus, refundedAt: Date.now(), refundReason: reason } : p));
  window.dispatchEvent(new Event("agrikart-payments"));
}

export function usePayments() {
  const [items, setItems] = useState<Payment[]>([]);
  useEffect(() => {
    const sync = () => setItems(read<Payment[]>(PAYMENTS_KEY, []));
    sync();
    window.addEventListener("agrikart-payments", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("agrikart-payments", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return items;
}

// ---------- Public submissions (farmers submit forms without login) ----------
export type SubmissionStatus = "New" | "Approved" | "Assigned" | "In Progress" | "Completed" | "Rejected";
export type Submission = {
  id: string;
  farmerName: string;
  mobile: string;
  village: string;
  district: string;
  serviceCategory: ServiceCategory;
  message: string;
  status: SubmissionStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedAt?: number;
  createdAt: number;
};

export function createSubmission(input: Omit<Submission, "id" | "status" | "createdAt" | "assignedStaffId" | "assignedStaffName" | "assignedAt">): Submission {
  const all = read<Submission[]>(SUBMISSIONS_KEY, []);
  const item: Submission = {
    ...input,
    id: "SUB-" + crypto.randomUUID().slice(0, 8).toUpperCase(),
    status: "New",
    createdAt: Date.now(),
  };
  all.unshift(item);
  write(SUBMISSIONS_KEY, all);
  if (typeof window !== "undefined") window.dispatchEvent(new Event("agrikart-submissions"));
  return item;
}

export function assignSubmission(id: string, staffId: string) {
  const staffList = read<StoredStaff[]>(STAFF_KEY, []);
  const target = staffList.find(s => s.id === staffId);
  if (!target) throw new Error("Staff not found");
  const all = read<Submission[]>(SUBMISSIONS_KEY, []);
  write(SUBMISSIONS_KEY, all.map(s => s.id === id
    ? { ...s, assignedStaffId: target.id, assignedStaffName: target.name, assignedAt: Date.now(), status: s.status === "New" ? "Assigned" : s.status }
    : s));
  window.dispatchEvent(new Event("agrikart-submissions"));
}

export function updateSubmissionStatus(id: string, status: SubmissionStatus) {
  const all = read<Submission[]>(SUBMISSIONS_KEY, []);
  write(SUBMISSIONS_KEY, all.map(s => s.id === id ? { ...s, status } : s));
  window.dispatchEvent(new Event("agrikart-submissions"));
}

export function approveSubmission(id: string) {
  const all = read<Submission[]>(SUBMISSIONS_KEY, []);
  write(SUBMISSIONS_KEY, all.map(s => s.id === id ? { ...s, status: "Approved" as SubmissionStatus } : s));
  window.dispatchEvent(new Event("agrikart-submissions"));
}

export function approveAndAssignSubmission(id: string, staffId: string) {
  const staffList = read<StoredStaff[]>(STAFF_KEY, []);
  const target = staffList.find(s => s.id === staffId);
  if (!target) throw new Error("Staff not found");
  const all = read<Submission[]>(SUBMISSIONS_KEY, []);
  write(SUBMISSIONS_KEY, all.map(s => s.id === id
    ? { ...s, status: "Assigned" as SubmissionStatus, assignedStaffId: target.id, assignedStaffName: target.name, assignedAt: Date.now() }
    : s));
  window.dispatchEvent(new Event("agrikart-submissions"));
}


export function useSubmissions(opts?: { assignedStaffId?: string; forStaffId?: string }) {
  const [items, setItems] = useState<Submission[]>([]);
  useEffect(() => {
    const sync = () => {
      const all = read<Submission[]>(SUBMISSIONS_KEY, []);
      let r = all;
      if (opts?.assignedStaffId) r = r.filter(s => s.assignedStaffId === opts.assignedStaffId);
      if (opts?.forStaffId) {
        r = r.filter(s =>
          s.assignedStaffId === opts.forStaffId ||
          (["Approved", "In Progress", "Completed"] as SubmissionStatus[]).includes(s.status) && !s.assignedStaffId
        );
      }
      setItems(r);
    };
    sync();
    window.addEventListener("agrikart-submissions", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("agrikart-submissions", sync);
      window.removeEventListener("storage", sync);
    };
  }, [opts?.assignedStaffId, opts?.forStaffId]);
  return items;
}


