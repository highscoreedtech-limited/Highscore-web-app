import { auth } from "@/lib/firebase";

export async function getFirebaseToken() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No authenticated user");
  }

  // 🔥 Automatically refreshes if expired
  return await user.getIdToken();
}
