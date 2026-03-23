import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { email, otps: otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Check if the OTP exists in the database
    const { data: latestOtp, error: fetchError } = await supabaseAdmin!
      .from("otps")
      .select("*")
      .eq("email", email)
      .eq("otp", otp)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    console.log("[verify-otp] query result:", { latestOtp, fetchError });

    if (fetchError || !latestOtp) {
      return NextResponse.json(
        { error: "Invalid OTP. Please check the code and try again." },
        { status: 400 }
      );
    }

    // Check expiration — compare UTC ISO strings
    const now = new Date().toISOString();
    console.log("[verify-otp] expires_at:", latestOtp.expires_at, "now:", now);

    if (latestOtp.expires_at && latestOtp.expires_at < now) {
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Delete the OTP so it cannot be reused
    await supabaseAdmin!.from("otps").delete().eq("id", latestOtp.id);

    return NextResponse.json({ success: true, message: "OTP verified successfully!" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}
