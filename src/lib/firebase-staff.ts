// Firebase-backed staff auth. Bridges Firebase Auth + Firestore into the existing
// localStorage staff-store so the rest of the app continues to work unchanged.
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { firebaseAuth, firestore, secondaryAuth } from "./firebase";
import {
  type Staff,
  type StaffRole,
  hydrateStaffSession,
  upsertLocalStaff,
  removeLocalStaff,
} from "./staff-store";

type StaffDoc = { name: string; role: StaffRole; email: string };

export async function firebaseStaffLogin(email: string, password: string): Promise<Staff> {
  const cred = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
  const uid = cred.user.uid;
  const snap = await getDoc(doc(firestore, "staff", uid));
  if (!snap.exists()) {
    // Auth user exists but no profile — treat as not provisioned.
    await signOut(firebaseAuth);
    throw new Error("Staff profile not found. Contact admin.");
  }
  const data = snap.data() as StaffDoc;
  const staff: Staff = {
    id: `fb-${uid}`,
    email: data.email ?? cred.user.email ?? email,
    name: data.name,
    role: data.role,
  };
  // Bridge into local store so existing UI works.
  hydrateStaffSession(staff, password);
  return staff;
}

export async function firebaseCreateStaff(input: {
  email: string;
  password: string;
  name: string;
  role: StaffRole;
}): Promise<Staff> {
  // Use secondaryAuth so the admin's current session is preserved.
  const cred = await createUserWithEmailAndPassword(
    secondaryAuth,
    input.email.trim(),
    input.password,
  );
  const uid = cred.user.uid;
  const profile: StaffDoc = { name: input.name, role: input.role, email: input.email.trim() };
  await setDoc(doc(firestore, "staff", uid), profile);
  await signOut(secondaryAuth);

  const staff: Staff = { id: `fb-${uid}`, ...profile };
  // Mirror into local store so the staff list on this device shows the new user.
  upsertLocalStaff(staff, input.password);
  return staff;
}

export async function firebaseDeleteStaffDoc(staffId: string) {
  // Only removes the Firestore profile (not the Auth user — that requires admin SDK).
  if (!staffId.startsWith("fb-")) return;
  const uid = staffId.slice(3);
  await deleteDoc(doc(firestore, "staff", uid));
  removeLocalStaff(staffId);
}
