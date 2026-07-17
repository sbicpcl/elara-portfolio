"use client";

export default function Footer() {
  return (
    <footer>
      <div className="wrap foot">
        <span>&copy; 2026 Elara Vance. Crafted with care.</span>
        <span>Designed &amp; built for the joy of it.</span>
        <button className="up" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Back to top &uarr;
        </button>
      </div>
    </footer>
  );
}
