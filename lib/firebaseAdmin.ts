import admin from "firebase-admin";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

let isInitialized = false;

if (!admin.apps.length) {
  if (projectId && clientEmail && privateKey) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      });
      isInitialized = true;
    } catch (error) {
      console.error("Firebase Admin initialization failed:", error);
    }
  } else {
    console.warn("Firebase Admin environment variables are missing. Initialization skipped.");
  }
} else {
  isInitialized = true;
}

export const adminAuth = {
  get auth() {
    if (!isInitialized) {
      throw new Error("Firebase Admin is not initialized. Please ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in your environment.");
    }
    return admin.auth();
  },
  // Keep the original name for compatibility, but it's now a getter-based proxy or we can just export a function
  getUserByEmail: async (email: string) => {
    if (!isInitialized) throw new Error("Firebase Admin not initialized");
    return admin.auth().getUserByEmail(email);
  },
  updateUser: async (uid: string, properties: any) => {
    if (!isInitialized) throw new Error("Firebase Admin not initialized");
    return admin.auth().updateUser(uid, properties);
  }
} as any; // Caste as any to maintain compatibility with existing calls like adminAuth.getUserByEmail

export const db = {
  get firestore() {
    if (!isInitialized) {
      throw new Error("Firebase Admin is not initialized. Please ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in your environment.");
    }
    return admin.firestore();
  }
} as any;
