import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.authid || !body.email) {
      return NextResponse.json(
        { error: "authId and email are required" },
        { status: 400 }
      );
    }

    const { data: existingUser } = await supabaseAdmin!
      .from("users")
      .select("*")
      .eq("authid", body.authid)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const row = {
      authid: body.authid,
      email: body.email,
      username: body.username || body.email.split("@")[0],
      displayname: body.display_name || body.displayName || body.email.split("@")[0],
      rank: body.rank || "Bronze",
      xp: body.xp || 0,
      coins: body.coins || 0,
      avatar: body.avatar || "🎮",
      totalmatches: body.totalMatches || 0,
      wins: body.wins || 0,
      winrate: body.winRate || 0,
    };

    const { data, error } = await supabaseAdmin!.from("users").insert([row]).select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "User created successfully!", data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
