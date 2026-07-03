// ─── Firebase App Initialization ─────────────────────────────────────────────
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyCuQ0HdbLTl_C1bkO4un0YFLElnouytKxs',
  authDomain: 'skysense-0000.firebaseapp.com',
  projectId: 'skysense-0000',
  storageBucket: 'skysense-0000.firebasestorage.app',
  messagingSenderId: '221973439684',
  appId: '1:221973439684:web:894c0eea372d1def4e5591',
  measurementId: 'G-WGY3VZLDPY'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Analytics only in browser environments that support it
isSupported().then(supported => {
  if (supported) getAnalytics(app);
});

export default app;
