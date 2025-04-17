// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Firebase Authentication
import { getFirestore } from "firebase/firestore"; // Firestore Database
import { getStorage } from "firebase/storage"; // Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDiiwDlnpBH_0ya8RVOCb2f-ILSSvOQURQ",
  authDomain: "findit-1437.firebaseapp.com",
  projectId: "findit-1437",
  storageBucket: "findit-1437.firebasestorage.app",
  messagingSenderId: "1098448808174",
  appId: "1:1098448808174:web:dfc30047e510d779726bff",
  measurementId: "G-R1WS83QYXG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize analytics (optional, for tracking)
const analytics = getAnalytics(app);

// Export the Firebase services for use in other parts of your app
export { auth, db, storage };
