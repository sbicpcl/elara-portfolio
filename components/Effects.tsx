"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Effects() {
  const pathname = usePathname();

  // Global, mount-once listeners: cursor, nav scroll state, card glow.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cursor = document.querySelector<HTMLElement>(".cursor");
    const dot = document.querySelector<HTMLElement>(".cursor-dot");
    let mx = 0, my = 0, cx = 0, cy = 0, raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dot) dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    };
    const loop = () => {
      cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
      if (cursor) cursor.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    const interactive = "a,button,.project,.stat,.svc,.mail,.cta-btn,.chip,.approach-item";
    const over = (e: Event) => { if ((e.target as Element).closest?.(interactive)) cursor?.classList.add("hover"); };
    const out = (e: Event) => { if ((e.target as Element).closest?.(interactive)) cursor?.classList.remove("hover"); };

    const nav = document.getElementById("nav");
    const onScroll = () => nav?.classList.toggle("scrolled", window.scrollY > 40);

    const onGlow = (e: MouseEvent) => {
      const card = (e.target as Element).closest?.<HTMLElement>("[data-glow]");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };

    if (!reduce) { window.addEventListener("mousemove", onMove); loop(); }
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    document.addEventListener("mousemove", onGlow);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      document.removeEventListener("mousemove", onGlow);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Per-route: reveal-on-scroll + count-up (re-run when the page changes).
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.15 }
    );
    document.querySelectorAll<HTMLElement>(".reveal").forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 0.08}s`;
      io.observe(el);
    });

    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        const target = Number(el.dataset.count);
        let cur = 0; const inc = target / 45;
        const tick = () => {
          cur += inc;
          if (cur < target) { el.textContent = `${Math.floor(cur)}+`; requestAnimationFrame(tick); }
          else el.textContent = `${target}+`;
        };
        tick(); cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll<HTMLElement>("[data-count]").forEach((c) => cio.observe(c));

    return () => { io.disconnect(); cio.disconnect(); };
  }, [pathname]);

  return (
    <>
      <div className="cursor" aria-hidden="true" />
      <div className="cursor-dot" aria-hidden="true" />
    </>
  );
}
