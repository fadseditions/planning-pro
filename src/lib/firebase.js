import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// --- Matches ---

const matchesRef = collection(db, 'matches');

export function matchesQuery() {
  return query(matchesRef, orderBy('dateTime', 'asc'));
}

export async function addMatch(matchData) {
  const docRef = await addDoc(matchesRef, {
    ...matchData,
    dateTime: Timestamp.fromDate(new Date(matchData.dateTime)),
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateMatch(id, matchData) {
  const docRefItem = doc(db, 'matches', id);
  const updateData = { ...matchData };
  if (matchData.dateTime) {
    updateData.dateTime = Timestamp.fromDate(new Date(matchData.dateTime));
  }
  await updateDoc(docRefItem, updateData);
}

export async function deleteMatch(id) {
  await deleteDoc(doc(db, 'matches', id));
}

// --- Club Config ---

const clubConfigRef = doc(db, 'config', 'club');

export async function getClubConfig() {
  const snap = await getDoc(clubConfigRef);
  if (snap.exists()) {
    return snap.data();
  }
  // Initialize default config
  const defaultConfig = { clubName: 'Mon Club Sportif', adminPassword: 'admin' };
  await setDoc(clubConfigRef, defaultConfig);
  return defaultConfig;
}

export async function updateClubConfig(data) {
  await setDoc(clubConfigRef, data, { merge: true });
}

export { clubConfigRef };
