// /api/send-reset-email/reset-password.ts
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
import { adminAuth } from "@/lib/firebaseAdmin"; // your initialized Firebase Admin
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { email, newPassword } = await req.json();

  if (!email || !newPassword) {
    return NextResponse.json(
      { error: "Email and new password are required" },
      { status: 400 }
    );
  }

  try {
    // Optional: check that the OTP was verified in Supabase
    // If you stored a 'verified' flag or deleted the OTP after verification, you can skip

    const user = await adminAuth.getUserByEmail(email);
    await adminAuth.updateUser(user.uid, { password: newPassword });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to reset password" },
      { status: 500 }
    );
  }
}
