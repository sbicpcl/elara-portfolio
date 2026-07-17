import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects, getProject, adjacentProject } from "@/lib/projects";
import ProjectThumb from "@/components/ProjectThumb";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProject(params.slug);
  if (!p) return { title: "Case study not found" };
  return {
    title: `${p.title} — Elara Vance`,
    description: p.summary,
  };
}

export default function CaseStudy({ params }: { params: { slug: string } }) {
  const p = getProject(params.slug);
  if (!p) notFound();
  const next = adjacentProject(p.slug);

  const facts = [
    { k: "Client", v: p.client },
    { k: "Role", v: p.role },
    { k: "Timeline", v: p.timeline },
    { k: "Discipline", v: p.discipline },
  ];

  return (
    <>
      <main className="wrap cs" id="top">
        <Link href="/#work" className="cs-back">&larr; Back to work</Link>

        <div className="cs-head reveal">
          <div>
            <span className="sec-label" style={{ marginBottom: "1.2rem" }}>Case Study</span>
            <h1>{p.title}</h1>
          </div>
          <p className="summary">{p.summary}</p>
        </div>

        <div className="cs-cover reveal">
          <ProjectThumb id={`cover-${p.slug}`} gradient={p.gradient} art={p.art} image={p.image} alt={p.imageAlt ?? `${p.title} cover`} />
        </div>

        <div className="cs-facts reveal">
          {facts.map((f) => (
            <div key={f.k}>
              <div className="k">{f.k}</div>
              <div className="v">{f.v}</div>
            </div>
          ))}
        </div>

        <div className="cs-body">
          <div className="cs-block reveal">
            <div className="lbl">Overview</div>
            <h2>{p.overview}</h2>
          </div>

          <div className="cs-block reveal">
            <div className="lbl">The challenge</div>
            <p>{p.challenge}</p>
          </div>

          <div className="cs-block reveal">
            <div className="lbl">Approach</div>
            <div className="approach-list">
              {p.approach.map((a) => (
                <div className="approach-item" key={a.title}>
                  <h3>{a.title}</h3>
                  <p>{a.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="cs-block reveal">
            <div className="lbl">Outcome</div>
            <div className="outcomes">
              {p.outcomes.map((o) => (
                <div className="outcome" key={o.label}>
                  <div className="num">{o.num}</div>
                  <div className="olbl">{o.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="cs-next reveal">
          <span className="lbl">Next project</span>
          <Link href={`/work/${next.slug}`}>{next.title} &#8599;</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
