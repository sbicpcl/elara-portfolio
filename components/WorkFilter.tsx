"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { projects, disciplines } from "@/lib/projects";
import ProjectThumb from "./ProjectThumb";

export default function WorkFilter() {
  const [active, setActive] = useState<(typeof disciplines)[number]>("All");

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: projects.length };
    for (const p of projects) map[p.discipline] = (map[p.discipline] ?? 0) + 1;
    return map;
  }, []);

  const filtered = active === "All" ? projects : projects.filter((p) => p.discipline === active);

  const onTilt = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  const resetTilt = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = "";
  };

  return (
    <>
      <div className="filter-bar" role="group" aria-label="Filter projects by discipline">
        {disciplines.map((d) => (
          <button
            key={d}
            className={`chip${active === d ? " active" : ""}`}
            onClick={() => setActive(d)}
            aria-pressed={active === d}
          >
            {d}
            {counts[d] ? <span className="count">{counts[d]}</span> : null}
          </button>
        ))}
      </div>

      <div className="work-grid" key={active}>
        {filtered.map((p, i) => (
          <Link
            key={p.slug}
            href={`/work/${p.slug}`}
            className="project"
            style={{ animationDelay: `${i * 0.06}s` }}
            onMouseMove={onTilt}
            onMouseLeave={resetTilt}
            aria-label={`${p.title} — ${p.discipline} case study`}
          >
            <div className="thumb">
              <ProjectThumb id={p.slug} gradient={p.gradient} art={p.art} image={p.image} alt={p.imageAlt ?? `${p.title} preview`} />
            </div>
            <div className="arrow-badge" aria-hidden="true">↗</div>
            <div className="meta">
              <div className="tags">
                {p.tags.map((t) => <span key={t}>{t}</span>)}
              </div>
              <h3>{p.title} <span className="yr">&rsquo;{p.year.slice(2)}</span></h3>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && <p className="empty">No projects in this discipline yet.</p>}
      </div>
    </>
  );
}
