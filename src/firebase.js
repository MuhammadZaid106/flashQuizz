// Firebase initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDLusUXwA8gaSvX6GO0v3pn4TkTjbWBHtA",
  authDomain: "quizz-5a459.firebaseapp.com",
  projectId: "quizz-5a459",
  storageBucket: "quizz-5a459.firebasestorage.app",
  messagingSenderId: "341735074796",
  appId: "1:341735074796:web:4a5270d360f86d754aaec9",
  measurementId: "G-T3FHTFJFTT"
};

// Initialize Firebase
let app = null;
let auth = null;
let analytics = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  // Initialize Analytics only in browser environment
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (e) {
  // eslint-disable-next-line no-console
  console.error('Firebase initialization error:', e);
  app = null;
  auth = null;
  analytics = null;
}

export { auth, analytics };
export default app;
