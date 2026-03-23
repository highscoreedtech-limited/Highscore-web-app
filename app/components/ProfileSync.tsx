"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";

export default function ProfileSync() {
  const { user, loading } = useAuth();
  const syncAttempted = useRef(false);

  useEffect(() => {
    // We only try to sync once per session/mount when user is detected
    if (!loading && user && !syncAttempted.current) {
      syncAttempted.current = true;
      syncProfile(user);
    } else if (!user) {
      // If user logs out, reset the sync ref so it can re-sync if a different user logs in
      syncAttempted.current = false;
    }
  }, [user, loading]);

  const syncProfile = async (supabaseUser: any) => {
    try {
      console.log("Checking/Syncing profile for user:", supabaseUser.id);
      
      // 1. Create/Check profile in the users table
      // Note: /api/users POST already handles existence check
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authid: supabaseUser.id,
          email: supabaseUser.email,
          username: supabaseUser.user_metadata?.first_name || supabaseUser.email.split("@")[0],
          displayName: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.display_name || supabaseUser.email.split("@")[0],
          avatar: supabaseUser.user_metadata?.avatar_url || "🎮",
        }),
      });

      if (res.ok) {
        console.log("Profile sync successful (or user already exists).");
        
        // 2. Also ensure quests are created
        const questsRes = await fetch("/api/user-quests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ authid: supabaseUser.id }),
        });

        if (!questsRes.ok) {
          console.error("Failed to sync user quests.");
        }
      } else {
        const errorData = await res.json();
        // Ignore "User already exists" errors
        if (errorData.error !== "User already exists") {
          console.error("Profile sync error:", errorData.error);
        }
      }
    } catch (err) {
      console.error("Failed to sync profile:", err);
    }
  };

  return null; // This component doesn't render anything
}
