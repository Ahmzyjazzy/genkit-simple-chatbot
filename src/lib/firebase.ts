import { initializeApp } from "firebase/app";
import {
    getAnalytics,
    logEvent as analyticsLogEvent,
    Analytics,
    setUserId,
} from "firebase/analytics";
import {
    indexedDBLocalPersistence,
    initializeAuth,
    onAuthStateChanged,
    signInAnonymously,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

let firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Example of what you might add to .env.local to use your own project
// NEXT_PUBLIC_FIREBASE_CONFIG_JSON_STRING={"apiKey": "AIzaSyBHg4Y_CEMBU7aaxrO19Y1NsvUXiVeiGfo", "authDomain": "genkit-by-example.firebaseapp.com", "projectId": "genkit-by-example", "storageBucket": "genkit-by-example.firebasestorage.app", "messagingSenderId": "515443902134", "appId": "1:515443902134:web:ce23c3419ffbc81b240817", "measurementId": "G-PVQ062HLN2"}
const firebaseConfigString = process.env.NEXT_PUBLIC_FIREBASE_CONFIG_JSON_STRING;
if (firebaseConfigString) {
    firebaseConfig = JSON.parse(firebaseConfigString);
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

let analytics: Analytics;
if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
}
export function logEvent(name: string, props: Record<string, unknown>) {
    if (!analytics) analytics = getAnalytics(app);
    analyticsLogEvent(analytics, name, props);
}

export const auth = initializeAuth(app, {
    persistence: [indexedDBLocalPersistence],
});
export const db = getFirestore();

onAuthStateChanged(auth, async (user) => {
    if (typeof window !== "undefined") {
        if (!user) {
            const { user: createdUser } = await signInAnonymously(auth);
            console.log("Created guest user account with id", createdUser.uid);
            return;
        }

        setUserId(getAnalytics(app), user.uid);
    }
});