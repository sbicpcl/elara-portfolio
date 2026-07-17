"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const SUN = (
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </>
);
const MOON = <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />;

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.getAttribute("data-theme") === "light");
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = light ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* ignore */
    }
    setLight(!light);
  };

  const close = () => setOpen(false);

  return (
    <nav id="nav" className={`${open ? "menu-open" : ""}${scrolled ? " scrolled" : ""}`}>
      <Link href="/#top" className="logo" onClick={close}>
        <span className="mark" aria-hidden="true" /> Lumi
      </Link>

      <div className={`nav-links${open ? " open" : ""}`}>
        <Link href="/#how" onClick={close}>How it works</Link>
        <Link href="/#ingredients" onClick={close}>Ingredients</Link>
        <Link href="/#about" onClick={close}>About</Link>
      </div>

      <div className="nav-right">
        <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle colour theme">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {light ? MOON : SUN}
          </svg>
        </button>
        <Link href="/#analyze" className="cta-btn desk" onClick={close}>
          Analyze my skin
        </Link>
        <button
          className="burger"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
