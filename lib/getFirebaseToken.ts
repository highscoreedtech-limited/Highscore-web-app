// lib/getFirebaseToken.ts
import { auth } from "./firebase";

/**
 * Gets the current Firebase ID token.
 * Note: If using Supabase for main auth, this may need alignment with your chat backend.
 */
export async function getFirebaseToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) {
    console.warn("No Firebase user found. Returning null token.");
    return null;
  }
  return user.getIdToken();
}
