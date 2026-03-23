import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Create user via admin — marks email as confirmed, NO Supabase confirmation email sent
    const { data: authData, error: createError } = await supabaseAdmin!.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // ✅ skips Supabase's own confirmation email
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        display_name: `${firstName} ${lastName}`,
      },
    });

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    const user = authData.user;
    if (!user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}
