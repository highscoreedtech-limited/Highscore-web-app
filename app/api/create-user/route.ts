import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Try to create user via admin
    const { data: authData, error: createError } = await supabaseAdmin!.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        display_name: `${firstName} ${lastName}`,
      },
    });
    
    let user = authData?.user;

    // Handle existing user case (e.g. unconfirmed from previous attempt)
    if (createError) {
      if (createError.message.includes("already registered") || createError.message.includes("already exists")) {
        // Fetch the existing user to get their ID
        const { data: listData, error: listError } = await supabaseAdmin!.auth.admin.listUsers();
        if (listError) throw listError;
        
        const existingUser = listData.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
        
        if (existingUser) {
           // Update user: confirm email, update password and metadata
           const { data: updateData, error: updateError } = await supabaseAdmin!.auth.admin.updateUserById(
             existingUser.id,
             {
               password: password,
               email_confirm: true,
               user_metadata: {
                 first_name: firstName,
                 last_name: lastName,
                 display_name: `${firstName} ${lastName}`,
               },
             }
           );
           
           if (updateError) throw updateError;
           user = updateData.user;
        } else {
           // This shouldn't happen if error was "already registered" but we couldn't find them
           throw createError;
        }
      } else {
        return NextResponse.json({ error: createError.message }, { status: 400 });
      }
    }
    if (!user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}
