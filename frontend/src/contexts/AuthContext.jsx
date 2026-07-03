import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  updateProfile as fbUpdateProfile,
  deleteUser,
  GoogleAuthProvider
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

const AuthContext = createContext(null);

const DEFAULT_PREFERENCES = {
  unit: 'c',
  defaultCity: 'Manchester',
  notifications: true
};

// ─── Firestore helpers ────────────────────────────────────────────────────────
const userDocRef = (uid) => doc(db, 'users', uid);

async function createUserDoc(uid, { name, email }) {
  try {
    const ref = userDocRef(uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        name,
        email,
        avatar: '',
        savedLocations: [],
        preferences: DEFAULT_PREFERENCES,
        createdAt: new Date().toISOString()
      });
    }
    return (await getDoc(ref)).data();
  } catch (err) {
    console.warn('Firestore createUserDoc failed, falling back to local defaults:', err);
    return {
      name,
      email,
      avatar: '',
      savedLocations: [],
      preferences: DEFAULT_PREFERENCES,
      createdAt: new Date().toISOString()
    };
  }
}

async function getUserDoc(uid) {
  try {
    const snap = await getDoc(userDocRef(uid));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('Firestore getUserDoc failed, returning default local profile:', err);
    return {
      name: auth.currentUser?.displayName || 'User',
      email: auth.currentUser?.email || '',
      avatar: auth.currentUser?.photoURL || '',
      savedLocations: [],
      preferences: DEFAULT_PREFERENCES
    };
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // enriched user object
  const [fbUser, setFbUser] = useState(null);  // raw Firebase user
  const [loading, setLoading] = useState(true);

  // Merge Firebase Auth user with Firestore profile
  const buildUser = useCallback(async (firebaseUser) => {
    if (!firebaseUser) return null;
    const profile = await getUserDoc(firebaseUser.uid);
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: profile?.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0],
      avatar: profile?.avatar || firebaseUser.photoURL || '',
      savedLocations: profile?.savedLocations || [],
      preferences: profile?.preferences || DEFAULT_PREFERENCES,
      createdAt: profile?.createdAt || null
    };
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFbUser(firebaseUser);
      if (firebaseUser) {
        const enriched = await buildUser(firebaseUser);
        setUser(enriched);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [buildUser]);

  // ─── Auth actions ──────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const enriched = await buildUser(credential.user);
    setUser(enriched);
    return enriched;
  }, [buildUser]);

  const loginWithGoogle = useCallback(async () => {
    const credential = await signInWithPopup(auth, googleProvider);
    const isNew = credential._tokenResponse?.isNewUser;
    if (isNew) {
      await createUserDoc(credential.user.uid, {
        name: credential.user.displayName || 'User',
        email: credential.user.email
      });
    }
    const enriched = await buildUser(credential.user);
    setUser(enriched);
    return enriched;
  }, [buildUser]);

  const register = useCallback(async (name, email, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await fbUpdateProfile(credential.user, { displayName: name });
    await createUserDoc(credential.user.uid, { name, email });
    const enriched = await buildUser(credential.user);
    setUser(enriched);
    return enriched;
  }, [buildUser]);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setFbUser(null);
  }, []);

  const updateUser = useCallback(async (updates) => {
    if (!fbUser) throw new Error('Not authenticated');
    const ref = userDocRef(fbUser.uid);
    const firestoreUpdates = {};
    if (updates.name) firestoreUpdates.name = updates.name;
    if (updates.avatar !== undefined) firestoreUpdates.avatar = updates.avatar;
    if (updates.preferences) firestoreUpdates.preferences = { ...user?.preferences, ...updates.preferences };

    try {
      await updateDoc(ref, firestoreUpdates);
    } catch (err) {
      console.warn('Firestore updateProfile failed, updating local state only:', err);
    }

    if (updates.name) {
      try {
        await fbUpdateProfile(fbUser, { displayName: updates.name });
      } catch (_) {}
    }

    // Merge changes locally so UI updates immediately
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        name: updates.name || prev.name,
        avatar: updates.avatar !== undefined ? updates.avatar : prev.avatar,
        preferences: updates.preferences ? { ...prev.preferences, ...updates.preferences } : prev.preferences
      };
    });
  }, [fbUser, user]);

  const pinLocation = useCallback(async (location) => {
    if (!fbUser) throw new Error('Not authenticated');
    const ref = userDocRef(fbUser.uid);
    const alreadySaved = user?.savedLocations?.some(
      l => l.name.toLowerCase() === location.name.toLowerCase()
    );
    if (alreadySaved) throw new Error('Location already saved');

    const newLocs = [...(user?.savedLocations || []), location];
    try {
      await updateDoc(ref, { savedLocations: arrayUnion(location) });
    } catch (err) {
      console.warn('Firestore pinLocation failed, syncing state locally:', err);
    }

    setUser(prev => prev ? { ...prev, savedLocations: newLocs } : null);
    return newLocs;
  }, [fbUser, user]);

  const unpinLocation = useCallback(async (locationName) => {
    if (!fbUser) throw new Error('Not authenticated');
    const loc = user?.savedLocations?.find(
      l => l.name.toLowerCase() === locationName.toLowerCase()
    );
    if (!loc) return user?.savedLocations || [];
    const ref = userDocRef(fbUser.uid);

    try {
      await updateDoc(ref, { savedLocations: arrayRemove(loc) });
    } catch (err) {
      console.warn('Firestore unpinLocation failed, syncing state locally:', err);
    }

    const newLocs = (user?.savedLocations || []).filter(
      l => l.name.toLowerCase() !== locationName.toLowerCase()
    );
    setUser(prev => prev ? { ...prev, savedLocations: newLocs } : null);
    return newLocs;
  }, [fbUser, user]);

  const removeAccount = useCallback(async () => {
    if (!fbUser) throw new Error('Not authenticated');
    try {
      await deleteDoc(userDocRef(fbUser.uid));
    } catch (_) {}
    await deleteUser(fbUser);
    setUser(null);
    setFbUser(null);
  }, [fbUser]);

  const exportUserData = useCallback(async () => {
    if (!fbUser) throw new Error('Not authenticated');
    const profile = await getUserDoc(fbUser.uid);
    return {
      profile,
      firebaseUid: fbUser.uid,
      email: fbUser.email,
      exportedAt: new Date().toISOString()
    };
  }, [fbUser]);

  const isLocationSaved = useCallback((locationName) => {
    if (!user) return false;
    return user.savedLocations?.some(
      l => l.name.toLowerCase() === locationName?.toLowerCase()
    );
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      fbUser,
      loading,
      login,
      loginWithGoogle,
      register,
      logout,
      updateUser,
      pinLocation,
      unpinLocation,
      removeAccount,
      exportUserData,
      isLocationSaved
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
