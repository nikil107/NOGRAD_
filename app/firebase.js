import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9U4DPIMeZ1pyFUQihsz5xYST-dUgA2PE",
  authDomain: "nograd-10eb8.firebaseapp.com",
  projectId: "nograd-10eb8",
  storageBucket: "nograd-10eb8.appspot.com",  // Corrected storage bucket URL
  messagingSenderId: "129026297849",
  appId: "1:129026297849:web:9c5887c451ceb61d577728",
  measurementId: "G-FBKJZ8FKP6"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Analytics (Optional, only works on Web)
const analytics = getAnalytics(app);

// Initialize Auth with React Native Persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firestore
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});

export { app, auth, db, analytics };
