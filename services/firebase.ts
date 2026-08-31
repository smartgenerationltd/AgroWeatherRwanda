import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase configuration for AgroWeather Rwanda
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB4DZ5fTBJfoRQ6E9dfCIwspVniUw1jr5c",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "alpine-leaf-3b34d.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "alpine-leaf-3b34d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "alpine-leaf-3b34d.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "244486853676",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:244486853676:web:0b6815d0fccc7976c3ed89",
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || "ai-studio-agroweatherrwand-d8dcb721-eda2-4fa1-9035-d51cd0f962de",
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  
  // Custom Firestore database ID as provisioned
  if (firebaseConfig.firestoreDatabaseId) {
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  } else {
    db = getFirestore(app);
  }
} catch (error) {
  console.warn("Firebase initialization notice:", error);
  // Re-attempt standard init
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { app, auth, db };
export const isFirebaseConfigured = (): boolean => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
};
