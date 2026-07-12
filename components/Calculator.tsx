"use client";

import { useRef, useState } from "react";
import { X, GripHorizontal } from "lucide-react";

/**
 * Floating, draggable calculator for the CBT exam screen. Immediate-execution
 * (phone-style) so there's no expression parsing to go wrong. Basic + scientific.
 */
export default function Calculator({ onClose }: { onClose: () => void }) {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true); // next digit starts a new number
  const [sci, setSci] = useState(false);

  // Drag state
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setPos({ x: e.clientX - drag.current.dx, y: e.clientY - drag.current.dy });
  };
  const onPointerUp = () => { drag.current = null; };

  const cur = () => parseFloat(display) || 0;
  const show = (n: number) => {
    if (!isFinite(n)) return "Error";
    const s = Number(n.toPrecision(12)).toString();
    return s;
  };

  const inputDigit = (d: string) => {
    setDisplay((prevD) => (fresh || prevD === "0" ? (d === "." ? "0." : d) : prevD + d));
    setFresh(false);
  };
  const inputDot = () => {
    if (fresh) { setDisplay("0."); setFresh(false); return; }
    if (!display.includes(".")) setDisplay(display + ".");
  };
  const clearAll = () => { setDisplay("0"); setPrev(null); setOp(null); setFresh(true); };
  const backspace = () => setDisplay((d) => (d.length <= 1 || (d.length === 2 && d.startsWith("-")) ? "0" : d.slice(0, -1)));
  const toggleSign = () => setDisplay((d) => (d.startsWith("-") ? d.slice(1) : d === "0" ? d : "-" + d));

  const apply = (a: number, b: number, o: string) => {
    switch (o) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b === 0 ? NaN : a / b;
      case "^": return Math.pow(a, b);
      default: return b;
    }
  };

  const setOperator = (o: string) => {
    const c = cur();
    if (prev !== null && op && !fresh) {
      const r = apply(prev, c, op);
      setPrev(r); setDisplay(show(r));
    } else {
      setPrev(c);
    }
    setOp(o); setFresh(true);
  };

  const equals = () => {
    if (prev === null || !op) return;
    const r = apply(prev, cur(), op);
    setDisplay(show(r)); setPrev(null); setOp(null); setFresh(true);
  };

  // Unary scientific functions applied to the current display value.
  const fn = (name: string) => {
    const x = cur();
    let r = x;
    switch (name) {
      case "√": r = Math.sqrt(x); break;
      case "x²": r = x * x; break;
      case "1/x": r = x === 0 ? NaN : 1 / x; break;
      case "%": r = x / 100; break;
      case "sin": r = Math.sin((x * Math.PI) / 180); break; // degrees
      case "cos": r = Math.cos((x * Math.PI) / 180); break;
      case "tan": r = Math.tan((x * Math.PI) / 180); break;
      case "ln": r = Math.log(x); break;
      case "log": r = Math.log10(x); break;
      case "π": r = Math.PI; break;
      case "e": r = Math.E; break;
    }
    setDisplay(show(r)); setFresh(true);
  };

  const Btn = ({ label, onClick, kind = "num" }: { label: string; onClick: () => void; kind?: "num" | "op" | "fn" | "eq" | "clr" }) => {
    const styles: Record<string, string> = {
      num: "bg-white text-hs-navy hover:bg-hs-bg",
      op: "bg-hs-blueTint text-hs-blue hover:brightness-95",
      fn: "bg-hs-bg text-hs-navy hover:brightness-95 text-[13px]",
      eq: "bg-hs-blue text-white hover:brightness-110",
      clr: "bg-red-50 text-red-600 hover:bg-red-100",
    };
    return (
      <button onClick={onClick} className={`h-11 rounded-xl text-base font-bold transition ${styles[kind]}`}>{label}</button>
    );
  };

  return (
    <div
      className="fixed z-[80] w-[300px] select-none rounded-2xl border border-hs-border bg-white shadow-2xl"
      style={{ left: `calc(50% + ${pos.x}px)`, top: `calc(20% + ${pos.y}px)`, transform: "translateX(-50%)" }}
    >
      {/* Drag handle */}
      <div
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
        className="flex cursor-move items-center justify-between rounded-t-2xl bg-hs-navy px-3 py-2 text-white"
      >
        <div className="flex items-center gap-2"><GripHorizontal size={16} /><span className="text-xs font-bold">Calculator</span></div>
        <div className="flex items-center gap-1">
          <button onClick={() => setSci((s) => !s)} className="rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-bold">{sci ? "Basic" : "Sci"}</button>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-1 hover:bg-white/15"><X size={15} /></button>
        </div>
      </div>

      {/* Display */}
      <div className="px-3 pt-3">
        <div className="rounded-xl bg-hs-bg px-3 py-3 text-right">
          <p className="truncate text-[26px] font-extrabold text-hs-navy">{display}</p>
        </div>
      </div>

      {/* Keys */}
      <div className="p-3">
        {sci && (
          <div className="mb-2 grid grid-cols-5 gap-1.5">
            {["sin", "cos", "tan", "√", "x²"].map((f) => <Btn key={f} label={f} kind="fn" onClick={() => fn(f)} />)}
            {["ln", "log", "π", "1/x", "^"].map((f) => (
              <Btn key={f} label={f} kind={f === "^" ? "op" : "fn"} onClick={() => (f === "^" ? setOperator("^") : fn(f))} />
            ))}
          </div>
        )}
        <div className="grid grid-cols-4 gap-1.5">
          <Btn label="AC" kind="clr" onClick={clearAll} />
          <Btn label="⌫" kind="fn" onClick={backspace} />
          <Btn label="%" kind="fn" onClick={() => fn("%")} />
          <Btn label="÷" kind="op" onClick={() => setOperator("÷")} />

          <Btn label="7" onClick={() => inputDigit("7")} />
          <Btn label="8" onClick={() => inputDigit("8")} />
          <Btn label="9" onClick={() => inputDigit("9")} />
          <Btn label="×" kind="op" onClick={() => setOperator("×")} />

          <Btn label="4" onClick={() => inputDigit("4")} />
          <Btn label="5" onClick={() => inputDigit("5")} />
          <Btn label="6" onClick={() => inputDigit("6")} />
          <Btn label="−" kind="op" onClick={() => setOperator("-")} />

          <Btn label="1" onClick={() => inputDigit("1")} />
          <Btn label="2" onClick={() => inputDigit("2")} />
          <Btn label="3" onClick={() => inputDigit("3")} />
          <Btn label="+" kind="op" onClick={() => setOperator("+")} />

          <Btn label="±" kind="fn" onClick={toggleSign} />
          <Btn label="0" onClick={() => inputDigit("0")} />
          <Btn label="." onClick={inputDot} />
          <Btn label="=" kind="eq" onClick={equals} />
        </div>
      </div>
    </div>
  );
}
