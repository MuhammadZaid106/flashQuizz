# Firebase Authentication Setup

1. Create a Firebase project at https://console.firebase.google.com

2. Enable Authentication -> Sign-in methods: Email/Password and Google.

3. In Project Settings, copy the Firebase config and add the following env vars to your `.env` file at the project root:

REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=xxxxx
REACT_APP_FIREBASE_APP_ID=1:xxxxx:web:yyyyy

4. Install the Firebase SDK:

```bash
npm install firebase
```

5. Restart the dev server. The app uses `src/firebase.js` and `src/contexts/AuthContext.js`.

Notes:

- The onboarding modal now collects a password and the app will attempt to create a Firebase account. If Firebase is not configured, onboarding falls back to local profiles stored in `localStorage`.
- If you prefer to only use local profiles, skip step 3/4 and the app will operate without Firebase.
