"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { gameApi, OnlineUser } from "@/lib/api";

const C = {
  surf: "#1A1210", surf2: "#241A17", brand: "#FF6624", brandDark: "#C03D27",
  brandLight: "#FF9A62", green: "#2ECC71", text: "#F5EDE8", text2: "#A08070",
};

function badgeColor(b: string) {
  switch (b) {
    case "Diamond": return "#00B4D8";
    case "Platinum": return "#7C3AED";
    case "Gold": return "#D97706";
    case "Silver": return "#94A3B8";
    default: return "#CD7F32";
  }
}
function uname(u: OnlineUser) {
  const n = `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim();
  return n || u.username || "User";
}
function uinit(u: OnlineUser) {
  if (u.initials) return u.initials;
  const n = uname(u);
  return n.split(" ").map((w) => w[0] || "").slice(0, 2).join("").toUpperCase() || "??";
}

export default function FindPlayers({ subject, onBack }: { subject: string; onBack: () => void; }) {
  const [tab, setTab] = useState<"online" | "friends">("online");
  const [query, setQuery] = useState("");
  const [online, setOnline] = useState<OnlineUser[]>([]);
  const [friends, setFriends] = useState<OnlineUser[]>([]);
  const [results, setResults] = useState<OnlineUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [waitingFor, setWaitingFor] = useState<string | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    Promise.all([gameApi.onlineUsers().catch(() => []), gameApi.friends().catch(() => [])])
      .then(([o, f]) => { setOnline(Array.isArray(o) ? o : []); setFriends(Array.isArray(f) ? f : []); })
      .finally(() => setLoading(false));
  }, []);

  const onSearch = (q: string) => {
    setQuery(q);
    if (debounce.current) clearTimeout(debounce.current);
    if (!q.trim()) { setResults([]); return; }
    setSearching(true);
    debounce.current = setTimeout(async () => {
      try { const r = await gameApi.searchUsers(q); setResults(Array.isArray(r) ? r : []); }
      catch { setResults([]); }
      finally { setSearching(false); }
    }, 500);
  };

  const challenge = async (u: OnlineUser) => {
    try {
      await gameApi.sendChallenge(u.id, subject);
      setWaitingFor(uname(u));
    } catch {
      toast.error("Could not send challenge. Try again.");
    }
  };

  const addFriend = async (u: OnlineUser) => {
    try { await gameApi.addFriend(u.id); toast.success(`${uname(u)} added as friend! 🎉`); }
    catch { toast.error("Could not add friend."); }
  };

  const list = query.trim() ? results : tab === "online" ? online : friends;
  const emptyMsg = query.trim()
    ? `No users found for "${query}"`
    : tab === "online" ? "No players online right now.\nBe the first to battle! ⚔️" : "No friends yet.\nSearch by name to add friends! 👥";

  return (
    <div className="px-4 pb-6 pt-4">
      {/* Header */}
      <div className="flex items-center">
        <button onClick={onBack} className="flex h-[34px] w-[34px] items-center justify-center rounded-full" style={{ backgroundColor: C.surf2, border: "1px solid rgba(255,255,255,0.08)", color: C.text }}>‹</button>
        <span className="ml-3 text-xl font-extrabold" style={{ color: C.text }}>Find Players</span>
        <span className="ml-auto flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ backgroundColor: `${C.green}1F`, border: `1px solid ${C.green}4D` }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: C.green }} />
          <span className="text-[10px] font-bold" style={{ color: C.green }}>{online.length} ONLINE</span>
        </span>
      </div>

      {/* Search */}
      <div className="mt-3.5 flex items-center gap-2 rounded-[14px] px-3.5 py-3" style={{ backgroundColor: C.surf2, border: "1px solid rgba(255,255,255,0.1)" }}>
        <span style={{ color: C.text2 }}>🔍</span>
        <input value={query} onChange={(e) => onSearch(e.target.value)} placeholder="Search by name or email…"
          className="w-full bg-transparent text-sm font-semibold outline-none" style={{ color: C.text }} />
        {query && <button onClick={() => onSearch("")} style={{ color: C.text2 }}>✕</button>}
      </div>

      {/* Tabs (hidden while searching) */}
      {!query.trim() && (
        <div className="mt-3 flex rounded-xl p-1" style={{ backgroundColor: C.surf2 }}>
          {(["online", "friends"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className="flex-1 rounded-[10px] py-2 text-xs font-bold"
              style={tab === t ? { backgroundColor: `${C.brand}33`, border: `1px solid ${C.brand}66`, color: C.brandLight } : { color: C.text2 }}>
              {t === "online" ? "🌐  Online Now" : "👥  Friends"}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      <div className="mt-4">
        {(loading || searching) ? (
          <div className="flex justify-center py-10"><span className="h-7 w-7 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: `${C.brand} transparent ${C.brand} ${C.brand}` }} /></div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <span className="text-5xl">{tab === "friends" && !query ? "👥" : "🌐"}</span>
            <p className="mt-3 whitespace-pre-line text-sm font-semibold" style={{ color: C.text2 }}>{emptyMsg}</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {list.map((u) => {
              const bc = badgeColor(u.badge);
              return (
                <div key={u.id} className="flex items-center gap-3 rounded-2xl p-3.5" style={{ backgroundColor: C.surf, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex h-[46px] w-[46px] items-center justify-center rounded-[14px] text-base font-extrabold" style={{ backgroundColor: C.surf2, border: `1px solid ${bc}66`, color: bc }}>{uinit(u)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold" style={{ color: C.text }}>{uname(u)}</p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="rounded-md px-1.5 py-0.5 text-[10px] font-bold" style={{ backgroundColor: `${bc}26`, color: bc }}>{u.badge}</span>
                      <span className="text-[11px] font-semibold" style={{ color: C.text2 }}>{u.total_score} pts</span>
                    </div>
                  </div>
                  {!u.is_friend && tab !== "friends" && (
                    <button onClick={() => addFriend(u)} className="flex h-9 w-9 items-center justify-center rounded-[10px]" style={{ backgroundColor: C.surf2, border: "1px solid rgba(255,255,255,0.08)", color: C.text2 }}>＋</button>
                  )}
                  <button onClick={() => challenge(u)} className="rounded-[10px] px-3 py-2 text-[11px] font-extrabold text-white" style={{ background: `linear-gradient(135deg,${C.brand},${C.brandDark})`, boxShadow: `0 3px 8px ${C.brand}4D` }}>⚔️ Challenge</button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Waiting sheet */}
      <AnimatePresence>
        {waitingFor && (
          <motion.div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="w-full max-w-xl rounded-t-[24px] px-6 pb-9 pt-7"
              style={{ backgroundColor: C.surf }} initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
              <div className="mx-auto h-1 w-10 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.15)" }} />
              <div className="mt-6 text-center">
                <span className="text-5xl">⚔️</span>
                <p className="mt-3 text-[22px] font-black" style={{ color: C.text }}>Challenge Sent!</p>
                <p className="mt-2 text-sm" style={{ color: C.text2 }}>
                  Waiting for <span style={{ color: C.brandLight, fontWeight: 700 }}>{waitingFor}</span><br />to accept your challenge…
                </p>
                <div className="mt-5 h-1 w-full overflow-hidden rounded-full" style={{ backgroundColor: C.surf2 }}>
                  <motion.div className="h-full w-1/3 rounded-full" style={{ backgroundColor: C.brand }} animate={{ x: ["-100%", "300%"] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} />
                </div>
                <button onClick={() => setWaitingFor(null)} className="mt-6 w-full rounded-[14px] py-3.5 text-sm font-bold" style={{ backgroundColor: C.surf2, border: "1px solid rgba(255,255,255,0.08)", color: C.text2 }}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
