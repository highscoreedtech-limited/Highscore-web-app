import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { authid, coinsEarned, xpEarned, didWin } = body;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase Admin missing" }, { status: 500 });
    }

    // Get the user's current stats
    const { data: user, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("coins, xp, totalmatches, wins")
      .eq("authid", authid)
      .single();

    if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 400 });

    const newCoins = (user.coins || 0) + coinsEarned;
    const newXP = (user.xp || 0) + xpEarned;
    const newTotal = (user.totalmatches || 0) + 1;
    const newWins = didWin ? (user.wins || 0) + 1 : (user.wins || 0);
    const newWinrate = Math.floor((newWins / newTotal) * 100);

    // Update user record
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        coins: newCoins,
        xp: newXP,
        totalmatches: newTotal,
        wins: newWins,
        winrate: newWinrate,
        updated_at: new Date().toISOString()
      })
      .eq("authid", authid);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
