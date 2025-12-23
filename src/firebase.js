// Firebase initialization (uses environment variables)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

let app = null;
let auth = null;

// Only initialize Firebase when an API key is present to avoid runtime errors
if (firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (e) {
    // initialization problems (invalid key, network) — log and continue with auth=null
    // eslint-disable-next-line no-console
    console.error('Firebase initialization error:', e);
    app = null;
    auth = null;
  }
} else {
  // eslint-disable-next-line no-console
  console.warn('Firebase not configured - missing REACT_APP_FIREBASE_API_KEY. Skipping initialization.');
}

export { auth };
export default app;
