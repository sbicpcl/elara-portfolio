"use client";

import { useEffect, useRef, useState } from "react";

export default function Preloader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let n = 0;
    const step = () => {
      n = Math.min(100, n + Math.floor(Math.random() * 12) + 4);
      setPct(n);
      if (n < 100) window.setTimeout(step, reduce ? 0 : 90);
      else window.setTimeout(() => setDone(true), reduce ? 0 : 350);
    };
    step();
  }, []);

  return (
    <div id="loader" className={done ? "done" : ""} aria-hidden={done}>
      <div style={{ textAlign: "center" }}>
        <div className="loader-num">{String(pct).padStart(2, "0")}</div>
        <div className="loader-bar">
          <span style={{ width: `${pct}%`, transition: "width .2s var(--ease)" }} />
        </div>
      </div>
    </div>
  );
}
