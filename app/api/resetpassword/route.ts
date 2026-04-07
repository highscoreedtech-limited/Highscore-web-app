// /api/send-reset-email/reset-password.ts
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { email, newPassword } = await req.json();

  if (!email || !newPassword) {
    return NextResponse.json(
      { error: "Email and new password are required" },
      { status: 400 }
    );
  }

  try {
    if (!supabaseAdmin) {
      throw new Error("Supabase Admin is not initialized. Please ensure SUPABASE_SERVICE_ROLE_KEY is set in your .env file.");
    }

    // 1️⃣ Find user by email
    const { data: { users }, error: fetchError } = await supabaseAdmin.auth.admin.listUsers();
    if (fetchError) throw fetchError;
    const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error("User not found in Supabase Auth.");

    // 2️⃣ Update password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { 
        password: newPassword,
        email_confirm: true 
      }
    );
    if (updateError) throw updateError;

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
