import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
  User
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { UserProfile, UserRole, Language } from '../types';
import { saveUserProfile, getUserProfile, DEMO_USER } from './firestoreService';

export interface AuthState {
  user: UserProfile | null;
  firebaseUser: User | null;
  loading: boolean;
  error: string | null;
}

export const registerWithEmail = async (
  email: string,
  pass: string,
  fullName: string,
  role: UserRole = UserRole.Farmer,
  district: string = 'Musanze',
  sector: string = 'Kinigi',
  phone: string = '',
  preferredLanguage: Language = 'rw'
): Promise<UserProfile> => {
  if (!auth) {
    throw new Error("Authentication service is not initialized");
  }

  const credential = await createUserWithEmailAndPassword(auth, email, pass);
  await updateProfile(credential.user, { displayName: fullName });

  const newProfile: UserProfile = {
    uid: credential.user.uid,
    fullName,
    email,
    phone,
    role,
    preferredLanguage,
    district,
    sector,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDemo: false
  };

  await saveUserProfile(newProfile);
  return newProfile;
};

export const loginWithEmail = async (email: string, pass: string): Promise<UserProfile> => {
  if (!auth) {
    throw new Error("Authentication service is not initialized");
  }

  const credential = await signInWithEmailAndPassword(auth, email, pass);
  const profile = await getUserProfile(credential.user.uid);

  if (profile) return profile;

  // If no Firestore profile yet, synthesize from Auth user
  const fallbackProfile: UserProfile = {
    uid: credential.user.uid,
    fullName: credential.user.displayName || email.split('@')[0],
    email: credential.user.email || email,
    role: UserRole.Farmer,
    preferredLanguage: 'rw',
    district: 'Musanze',
    sector: 'Kinigi',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDemo: false
  };

  await saveUserProfile(fallbackProfile);
  return fallbackProfile;
};

export const loginWithGoogle = async (): Promise<UserProfile> => {
  if (!auth) {
    throw new Error("Authentication service is not initialized");
  }

  const credential = await signInWithPopup(auth, googleProvider);
  const profile = await getUserProfile(credential.user.uid);

  if (profile) return profile;

  const newProfile: UserProfile = {
    uid: credential.user.uid,
    fullName: credential.user.displayName || 'Farmer',
    email: credential.user.email || '',
    photoURL: credential.user.photoURL || undefined,
    role: UserRole.Farmer,
    preferredLanguage: 'rw',
    district: 'Musanze',
    sector: 'Kinigi',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDemo: false
  };

  await saveUserProfile(newProfile);
  return newProfile;
};

export const resetPassword = async (email: string): Promise<void> => {
  if (!auth) throw new Error("Auth not initialized");
  await sendPasswordResetEmail(auth, email);
};

export const logoutUser = async (): Promise<void> => {
  try {
    if (auth) {
      await firebaseSignOut(auth);
    }
  } catch (err) {
    console.warn("Sign out notice:", err);
  }
  localStorage.removeItem('agroweather_currentUser');
};

export const updateProfileData = async (uid: string, data: Partial<UserProfile>): Promise<void> => {
  const existing = await getUserProfile(uid);
  if (existing) {
    const updated: UserProfile = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString()
    };
    await saveUserProfile(updated);
  }
};

export const getCurrentUserProfile = (): UserProfile | null => {
  try {
    const saved = localStorage.getItem('agroweather_currentUser');
    return saved ? JSON.parse(saved) : DEMO_USER;
  } catch {
    return DEMO_USER;
  }
};

export const subscribeToAuthChanges = (callback: (user: UserProfile | null) => void): (() => void) => {
  if (!auth) {
    callback(getCurrentUserProfile());
    return () => {};
  }

  return auth.onAuthStateChanged(async (user) => {
    if (user) {
      const profile = await getUserProfile(user.uid);
      callback(profile);
    } else {
      const local = getCurrentUserProfile();
      callback(local);
    }
  });
};

export const startDemoSession = (role: UserRole = UserRole.Farmer, district: string = 'Musanze'): UserProfile => {
  const customDemo: UserProfile = {
    ...DEMO_USER,
    role,
    district,
    updatedAt: new Date().toISOString()
  };
  saveUserProfile(customDemo);
  return customDemo;
};


