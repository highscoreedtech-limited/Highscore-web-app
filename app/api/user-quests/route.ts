import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { authid } = body;

    if (!authid) {
      return NextResponse.json({ error: "Missing authid" }, { status: 400 });
    }

    // Fetch all quests
    const { data: quests, error: questsError } = await supabase
      .from("quests")
      .select("id");
    if (questsError) throw questsError;

    // Insert a user_quest for each quest
    const inserts = quests.map((q) => ({
      authid,
      quest_id: q.id,
      progress: 0,
      completed: false,
    }));

    const { data, error } = await supabase.from("user_quests").insert(inserts);
    if (error) throw error;

    return NextResponse.json({ message: "User quests created", data });
  } catch (err: any) {
    console.error("Error creating user quests:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
