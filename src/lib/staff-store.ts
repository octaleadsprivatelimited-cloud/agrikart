// Staff (employee/admin) + customer + service-request store. localStorage-backed.
import { useEffect, useState } from "react";

export type StaffRole = "employee" | "admin";
export type Staff = { id: string; email: string; name: string; role: StaffRole };
type StoredStaff = Staff & { password: string };

const STAFF_KEY = "agrikart.staff";
const STAFF_SESSION_KEY = "agrikart.staff_session";
const CUSTOMERS_KEY = "agrikart.customers";
const REQUESTS_KEY = "agrikart.service_requests";
const PAYMENTS_KEY = "agrikart.payments";
const SEED_KEY = "agrikart.seeded_v1";

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
  if (localStorage.getItem(SEED_KEY)) return;
  const staff: StoredStaff[] = [
    { id: "emp-demo", email: "employee@agrikartfin.com", password: "password123", name: "Ravi Kumar", role: "employee" },
    { id: "adm-demo", email: "admin@agrikartfin.com", password: "password123", name: "Site Admin", role: "admin" },
  ];
  write(STAFF_KEY, staff);
  localStorage.setItem(SEED_KEY, "1");
}
seed();

export function staffLogin(email: string, password: string): Staff {
  seed();
  const all = read<StoredStaff[]>(STAFF_KEY, []);
  const s = all.find(x => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
  if (!s) throw new Error("INVALID_LOGIN");
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
  const [s, setS] = useState<Staff | null>(() => getCurrentStaff());
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

export function createStaff(input: { email: string; name: string; password: string; role: StaffRole }): Staff {
  const all = read<StoredStaff[]>(STAFF_KEY, []);
  if (all.some(s => s.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error("Email already in use");
  }
  const item: StoredStaff = { ...input, id: (input.role === "admin" ? "adm-" : "emp-") + crypto.randomUUID().slice(0, 8) };
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
export type Customer = {
  id: string;
  farmerName: string;
  mobile: string;
  aadhaar?: string;
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
};

export function createCustomer(c: Omit<Customer, "id" | "status" | "createdAt">): Customer {
  const all = read<Customer[]>(CUSTOMERS_KEY, []);
  const item: Customer = { ...c, id: crypto.randomUUID(), status: "Pending", createdAt: Date.now() };
  all.unshift(item);
  write(CUSTOMERS_KEY, all);
  window.dispatchEvent(new Event("agrikart-customers"));
  return item;
}

export function updateCustomerStatus(id: string, status: CustomerStatus, remarks?: string) {
  const all = read<Customer[]>(CUSTOMERS_KEY, []);
  const next = all.map(c => c.id === id ? { ...c, status, remarks } : c);
  write(CUSTOMERS_KEY, next);
  window.dispatchEvent(new Event("agrikart-customers"));
}

export function getCustomer(id: string): Customer | undefined {
  return read<Customer[]>(CUSTOMERS_KEY, []).find(c => c.id === id);
}

export function useCustomer(id: string | undefined) {
  const [c, setC] = useState<Customer | undefined>(() => id ? getCustomer(id) : undefined);
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

// ---------- Service requests (per customer) ----------
export type ServiceCategory = "Drone" | "Seeds" | "Fertilizers" | "Pesticides" | "Loan" | "Insurance" | "Cold Storage";
export type ServiceRequest = {
  id: string;
  customerId: string;
  category: ServiceCategory;
  description: string;
  status: CustomerStatus;
  createdAt: number;
};

export const serviceCategories: ServiceCategory[] = ["Drone","Seeds","Fertilizers","Pesticides","Loan","Insurance","Cold Storage"];

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
export type Payment = {
  id: string;
  farmerId: string;
  farmerName?: string;
  mobile?: string;
  kind: PaymentKind;
  amount: number;
  createdAt: number;
};

export function recordPayment(p: Omit<Payment, "id" | "createdAt">): Payment {
  const all = read<Payment[]>(PAYMENTS_KEY, []);
  const item: Payment = { ...p, id: crypto.randomUUID(), createdAt: Date.now() };
  all.unshift(item);
  write(PAYMENTS_KEY, all);
  window.dispatchEvent(new Event("agrikart-payments"));
  return item;
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
