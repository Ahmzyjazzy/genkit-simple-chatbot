import { initializeApp, getApps, getApp, cert, ServiceAccount } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { getAuth } from "firebase-admin/auth";

const projectId = process.env.GCLOUD_PROJECT || "genkit-simple-chatbot";
const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_API_KEY;

const admin = getApps().length
    ? getApp()
    : initializeApp({
        credential: cert({
            projectId: projectId,
            clientEmail: "firebase-adminsdk-fbsvc@genkit-examples.iam.gserviceaccount.com",
            privateKey: privateKey?.replace(/\\n/g, "\n")
        } as ServiceAccount),
        projectId,
        databaseURL: `https://${projectId}-default-rtdb.firebaseio.com/`,
    });

export const adminRtdb = getDatabase(admin);
export const adminAuth = getAuth(admin);