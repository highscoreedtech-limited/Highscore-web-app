"use client";

import { useRef, useState } from "react";
import { X, GripHorizontal } from "lucide-react";

/**
 * Floating, draggable scientific calculator for the CBT screen.
 * Builds an expression and evaluates it with a proper recursive-descent parser
 * that respects operator precedence, parentheses, unary minus, right-associative
 * powers, and functions (√, sin, cos, tan, ln, log) — so 2 + 3 × 4 = 14, not 20.
 */

// ── Evaluator ─────────────────────────────────────────────────────────────────
type Tok = { t: "num" | "op" | "fn" | "const" | "lp" | "rp"; v: string };

function tokenize(s: string): Tok[] {
  const toks: Tok[] = [];
  const op: Record<string, string> = { "×": "*", "÷": "/", "−": "-", "*": "*", "/": "/", "+": "+", "-": "-", "^": "^" };
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === " ") { i++; continue; }
    if (/[0-9.]/.test(c)) { let n = ""; while (i < s.length && /[0-9.]/.test(s[i])) n += s[i++]; toks.push({ t: "num", v: n }); continue; }
    if (c === "√") { toks.push({ t: "fn", v: "sqrt" }); i++; continue; }
    if (c === "π") { toks.push({ t: "const", v: "pi" }); i++; continue; }
    if (/[a-z]/i.test(c)) { let w = ""; while (i < s.length && /[a-z]/i.test(s[i])) w += s[i++]; w = w.toLowerCase(); toks.push(w === "e" ? { t: "const", v: "e" } : { t: "fn", v: w }); continue; }
    if (c === "(") { toks.push({ t: "lp", v: "(" }); i++; continue; }
    if (c === ")") { toks.push({ t: "rp", v: ")" }); i++; continue; }
    if (op[c]) { toks.push({ t: "op", v: op[c] }); i++; continue; }
    i++; // ignore anything unexpected
  }
  return toks;
}

function evaluate(expr: string): number {
  const toks = tokenize(expr);
  let p = 0;
  const peek = () => toks[p];
  const eat = () => toks[p++];
  const bad = () => { throw new Error("Error"); };
  const deg = (a: number) => (a * Math.PI) / 180;

  const applyFn = (name: string, x: number): number => {
    switch (name) {
      case "sqrt": return Math.sqrt(x);
      case "sin": return Math.sin(deg(x));
      case "cos": return Math.cos(deg(x));
      case "tan": return Math.tan(deg(x));
      case "ln": return Math.log(x);
      case "log": return Math.log10(x);
      default: throw new Error("Error");
    }
  };

  function expr0(): number {
    let v = term();
    while (peek()?.t === "op" && (peek().v === "+" || peek().v === "-")) { const o = eat().v; const r = term(); v = o === "+" ? v + r : v - r; }
    return v;
  }
  function term(): number {
    let v = factor();
    while (peek()?.t === "op" && (peek().v === "*" || peek().v === "/")) { const o = eat().v; const r = factor(); v = o === "*" ? v * r : v / r; }
    return v;
  }
  function factor(): number {
    const base = unary();
    if (peek()?.t === "op" && peek().v === "^") { eat(); return Math.pow(base, factor()); } // right-assoc
    return base;
  }
  function unary(): number {
    if (peek()?.t === "op" && (peek().v === "-" || peek().v === "+")) { const o = eat().v; const v = unary(); return o === "-" ? -v : v; }
    return primary();
  }
  function primary(): number {
    const t = peek();
    if (!t) return bad();
    if (t.t === "num") { eat(); return parseFloat(t.v); }
    if (t.t === "const") { eat(); return t.v === "pi" ? Math.PI : Math.E; }
    if (t.t === "fn") { eat(); if (peek()?.t !== "lp") bad(); eat(); const a = expr0(); if (peek()?.t !== "rp") bad(); eat(); return applyFn(t.v, a); }
    if (t.t === "lp") { eat(); const v = expr0(); if (peek()?.t !== "rp") bad(); eat(); return v; }
    return bad();
  }

  const r = expr0();
  if (p !== toks.length) throw new Error("Error");
  if (!isFinite(r)) throw new Error("Error");
  return r;
}

const fmt = (n: number) => Number(n.toPrecision(12)).toString();

// ── Component ─────────────────────────────────────────────────────────────────
export default function Calculator({ onClose }: { onClose: () => void }) {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState<string>("");
  const [evaluated, setEvaluated] = useState(false);
  const [sci, setSci] = useState(false);

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const onDown = (e: React.PointerEvent) => { drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y }; (e.target as HTMLElement).setPointerCapture(e.pointerId); };
  const onMove = (e: React.PointerEvent) => { if (drag.current) setPos({ x: e.clientX - drag.current.dx, y: e.clientY - drag.current.dy }); };
  const onUp = () => { drag.current = null; };

  const isOp = (c: string) => "+−×÷^".includes(c);

  const push = (s: string, kind: "val" | "op" = "val") => {
    setExpr((prev) => {
      // After "=", a value starts fresh; an operator continues from the result.
      if (evaluated) {
        setEvaluated(false);
        if (kind === "op" && result && result !== "Error") return result + s;
        setResult("");
        return s;
      }
      return prev + s;
    });
    // live preview
    setTimeout(() => {}, 0);
  };

  const clearAll = () => { setExpr(""); setResult(""); setEvaluated(false); };
  const back = () => { if (evaluated) { clearAll(); return; } setExpr((p) => p.slice(0, -1)); };

  const equals = () => {
    if (!expr.trim()) return;
    try {
      const r = evaluate(expr);
      setResult(fmt(r));
      setEvaluated(true);
    } catch {
      setResult("Error");
      setEvaluated(true);
    }
  };

  // Live preview of the current expression (best-effort).
  let preview = "";
  if (!evaluated && expr.trim()) {
    try { preview = fmt(evaluate(expr)); } catch { preview = ""; }
  }

  const Btn = ({ label, on, kind = "num", tap }: { label: string; on: string; kind?: "num" | "op" | "fn" | "eq" | "clr"; tap?: () => void }) => {
    const styles: Record<string, string> = {
      num: "bg-white text-hs-navy hover:bg-hs-bg",
      op: "bg-hs-blueTint text-hs-blue hover:brightness-95",
      fn: "bg-hs-bg text-hs-navy hover:brightness-95 text-[13px]",
      eq: "bg-hs-blue text-white hover:brightness-110",
      clr: "bg-red-50 text-red-600 hover:bg-red-100",
    };
    return <button onClick={tap ?? (() => push(on, isOp(on) ? "op" : "val"))} className={`h-11 rounded-xl text-base font-bold transition ${styles[kind]}`}>{label}</button>;
  };

  return (
    <div className="fixed z-[80] w-[300px] select-none rounded-2xl border border-hs-border bg-white shadow-2xl"
      style={{ left: `calc(50% + ${pos.x}px)`, top: `calc(18% + ${pos.y}px)`, transform: "translateX(-50%)" }}>
      <div onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} className="flex cursor-move items-center justify-between rounded-t-2xl bg-hs-navy px-3 py-2 text-white">
        <div className="flex items-center gap-2"><GripHorizontal size={16} /><span className="text-xs font-bold">Calculator</span></div>
        <div className="flex items-center gap-1">
          <button onClick={() => setSci((s) => !s)} className="rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-bold">{sci ? "Basic" : "Sci"}</button>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-1 hover:bg-white/15"><X size={15} /></button>
        </div>
      </div>

      {/* Display */}
      <div className="px-3 pt-3">
        <div className="rounded-xl bg-hs-bg px-3 py-2.5">
          <p className="min-h-[18px] truncate text-right text-[13px] text-hs-muted">{evaluated ? expr : (preview ? `= ${preview}` : " ")}</p>
          <p className="truncate text-right text-[26px] font-extrabold text-hs-navy">{evaluated ? (result || "0") : (expr || "0")}</p>
        </div>
      </div>

      {/* Keys */}
      <div className="p-3">
        {sci && (
          <div className="mb-2 grid grid-cols-5 gap-1.5">
            <Btn label="sin" on="sin(" kind="fn" />
            <Btn label="cos" on="cos(" kind="fn" />
            <Btn label="tan" on="tan(" kind="fn" />
            <Btn label="√" on="√(" kind="fn" />
            <Btn label="x²" on="^2" kind="fn" />
            <Btn label="ln" on="ln(" kind="fn" />
            <Btn label="log" on="log(" kind="fn" />
            <Btn label="π" on="π" kind="fn" />
            <Btn label="^" on="^" kind="op" />
            <Btn label="%" on="/100" kind="fn" />
          </div>
        )}
        <div className="grid grid-cols-4 gap-1.5">
          <Btn label="AC" on="" kind="clr" tap={clearAll} />
          <Btn label="(" on="(" kind="fn" />
          <Btn label=")" on=")" kind="fn" />
          <Btn label="÷" on="÷" kind="op" />

          <Btn label="7" on="7" />
          <Btn label="8" on="8" />
          <Btn label="9" on="9" />
          <Btn label="×" on="×" kind="op" />

          <Btn label="4" on="4" />
          <Btn label="5" on="5" />
          <Btn label="6" on="6" />
          <Btn label="−" on="−" kind="op" />

          <Btn label="1" on="1" />
          <Btn label="2" on="2" />
          <Btn label="3" on="3" />
          <Btn label="+" on="+" kind="op" />

          <Btn label="⌫" on="" kind="fn" tap={back} />
          <Btn label="0" on="0" />
          <Btn label="." on="." />
          <Btn label="=" on="" kind="eq" tap={equals} />
        </div>
      </div>
    </div>
  );
}
