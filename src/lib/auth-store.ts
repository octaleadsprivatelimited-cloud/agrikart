// Local-storage backed auth + bookings stub. Replace with Firebase later.
import { useEffect, useState } from "react";

export type FarmerProfile = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  aadhaar?: string;
  village: string;
  district: string;
  landSize: string;
  crops: string;
  createdAt: number;
};

type StoredUser = FarmerProfile & { password: string };

const USERS_KEY = "agrikart.users";
const SESSION_KEY = "agrikart.session";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(localStorage.getItem(key) ?? "") as T;
  } catch {
    return fallback;
  }
}
function uuidv4() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function write(key: string, val: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(val));
}

export function signup(
  input: Omit<FarmerProfile, "id" | "createdAt"> & { password: string },
): FarmerProfile {
  const users = read<StoredUser[]>(USERS_KEY, []);
  if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error("EMAIL_EXISTS");
  }
  const user: StoredUser = { ...input, id: uuidv4(), createdAt: Date.now() };
  users.push(user);
  write(USERS_KEY, users);
  write(SESSION_KEY, user.id);
  window.dispatchEvent(new Event("agrikart-auth"));
  const { password: _pw, ...profile } = user;
  return profile;
}

export function login(email: string, password: string): FarmerProfile {
  const users = read<StoredUser[]>(USERS_KEY, []);
  const u = users.find(
    (x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password,
  );
  if (!u) throw new Error("INVALID_LOGIN");
  write(SESSION_KEY, u.id);
  window.dispatchEvent(new Event("agrikart-auth"));
  const { password: _pw, ...profile } = u;
  return profile;
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("agrikart-auth"));
}

export function getCurrentUser(): FarmerProfile | null {
  const id = read<string | null>(SESSION_KEY, null);
  if (!id) return null;
  const users = read<StoredUser[]>(USERS_KEY, []);
  const u = users.find((x) => x.id === id);
  if (!u) return null;
  const { password: _pw, ...profile } = u;
  return profile;
}

export function useCurrentUser() {
  const [user, setUser] = useState<FarmerProfile | null>(() => getCurrentUser());
  useEffect(() => {
    const sync = () => setUser(getCurrentUser());
    window.addEventListener("agrikart-auth", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("agrikart-auth", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return user;
}

// ---------- Bookings ----------
export type BookingStatus = "Pending" | "Approved" | "Rejected";
export type Booking = {
  id: string;
  farmerId: string;
  serviceCategory: string;
  description: string;
  status: BookingStatus;
  paymentLink?: string;
  createdAt: number;
};

const BOOKINGS_KEY = "agrikart.bookings";

export function createBooking(
  farmerId: string,
  serviceCategory: string,
  description: string,
): Booking {
  const items = read<Booking[]>(BOOKINGS_KEY, []);
  const b: Booking = {
    id: uuidv4(),
    farmerId,
    serviceCategory,
    description,
    status: "Pending",
    createdAt: Date.now(),
  };
  items.unshift(b);
  write(BOOKINGS_KEY, items);
  window.dispatchEvent(new Event("agrikart-bookings"));
  return b;
}

export function listBookings(farmerId: string): Booking[] {
  return read<Booking[]>(BOOKINGS_KEY, []).filter((b) => b.farmerId === farmerId);
}

export function useBookings(farmerId: string | undefined) {
  const [items, setItems] = useState<Booking[]>(() => (farmerId ? listBookings(farmerId) : []));
  useEffect(() => {
    if (!farmerId) {
      setItems([]);
      return;
    }
    const sync = () => setItems(listBookings(farmerId));
    sync();
    window.addEventListener("agrikart-bookings", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("agrikart-bookings", sync);
      window.removeEventListener("storage", sync);
    };
  }, [farmerId]);
  return items;
}
