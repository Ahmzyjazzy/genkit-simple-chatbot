import { initializeApp, getApps, getApp, cert, ServiceAccount } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "../../google-service-account.json";

const projectId = process.env.GCLOUD_PROJECT;

const admin = getApps().length
    ? getApp()
    : initializeApp({
        credential: cert(serviceAccount as ServiceAccount),
        databaseURL: `https://${projectId}-default-rtdb.firebaseio.com/`,
    });

export const adminRtdb = getDatabase(admin);
export const adminAuth = getAuth(admin);
