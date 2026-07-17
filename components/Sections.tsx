import WorkFilter from "./WorkFilter";
import ContactForm from "./ContactForm";

export function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero-glow g1" aria-hidden="true" />
      <div className="hero-glow g2" aria-hidden="true" />
      <div className="hero-inner">
        <span className="hero-tag"><span className="dot" /> Available for select projects &middot; 2026</span>
        <h1 className="hero-title">
          <span className="line"><span>Designing</span></span>
          <span className="line"><span><em>interfaces</em> that</span></span>
          <span className="line"><span>feel human.</span></span>
        </h1>
        <div className="hero-sub">
          <p>
            I&rsquo;m Elara — a product &amp; interaction designer helping ambitious teams turn complex
            problems into clear, emotional, and beautifully crafted experiences.
          </p>
          <a href="#work" className="hero-scroll">Scroll to explore <span className="arrow">&darr;</span></a>
        </div>
      </div>
    </header>
  );
}

export function Marquee() {
  const line = (
    <span>
      Product Design <b>&#10022;</b> Design Systems <b>&#10022;</b> Prototyping <b>&#10022;</b> Interaction{" "}
      <b>&#10022;</b> Motion <b>&#10022;</b> Research <b>&#10022;</b>
    </span>
  );
  return (
    <div className="marquee full-bleed">
      <div className="marquee-track">
        {line}
        {line}
      </div>
    </div>
  );
}

export function Work() {
  return (
    <section className="section" id="work">
      <div className="sec-head reveal">
        <div>
          <span className="sec-label">Selected Work</span>
          <h2 className="sec-title">Recent projects</h2>
        </div>
        <p style={{ color: "var(--text-dim)", maxWidth: 320 }}>
          A glimpse into products I&rsquo;ve shaped from first sketch to shipped experience. Filter by discipline.
        </p>
      </div>
      <div className="reveal">
        <WorkFilter />
      </div>
    </section>
  );
}

export function About() {
  const stats = [
    { n: 120, l: "Projects shipped" },
    { n: 8, l: "Years crafting" },
    { n: 14, l: "Design awards" },
    { n: 40, l: "Happy clients" },
  ];
  return (
    <section className="section" id="about">
      <div className="about">
        <div className="about-copy reveal">
          <span className="sec-label" style={{ marginBottom: "1.5rem" }}>About</span>
          <p>
            I blend <b>strategy, craft, and motion</b> to build products people genuinely love to use —
            and teams are proud to ship.
          </p>
          <p className="lede">
            Over the past 8 years I&rsquo;ve partnered with startups and global brands to design end-to-end
            experiences: from foundational research and design systems to pixel-perfect interfaces and
            delightful micro-interactions. My work has been featured by Awwwards, CSS Design Awards, and the FWA.
          </p>
        </div>
        <div className="stats reveal">
          {stats.map((s) => (
            <div className="stat" key={s.l}>
              <div className="num" data-count={s.n}>0</div>
              <div className="lbl">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Services() {
  const svc = [
    {
      t: "Product Design",
      d: "End-to-end design of web and mobile products — from flows and wireframes to polished, production-ready interfaces.",
      icon: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M3 9h18M9 21V9" /></>,
    },
    {
      t: "Design Systems",
      d: "Scalable, token-driven component libraries that keep teams fast, consistent, and unmistakably on-brand.",
      icon: <><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18" /></>,
    },
    {
      t: "Motion & Prototyping",
      d: "High-fidelity, interactive prototypes and purposeful motion that make products feel alive and intuitive.",
      icon: <><path d="M4 12h16M12 4v16" /><circle cx="12" cy="12" r="4" /></>,
    },
  ];
  return (
    <section className="section" id="services">
      <div className="sec-head reveal">
        <div>
          <span className="sec-label">Capabilities</span>
          <h2 className="sec-title">What I do best</h2>
        </div>
      </div>
      <div className="services">
        {svc.map((s) => (
          <div className="svc reveal" data-glow key={s.t}>
            <div className="ico">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">{s.icon}</svg>
            </div>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Testimonial() {
  return (
    <section className="section">
      <div className="quote reveal">
        <div className="stars" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <blockquote>
          &ldquo;Elara doesn&rsquo;t just design screens — she designs <span>understanding</span>. She
          elevated our product and our whole team&rsquo;s thinking.&rdquo;
        </blockquote>
        <div className="who"><b>Marcus Reid</b> — VP Product, Nimbus</div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="reveal">
        <span className="sec-label" style={{ justifyContent: "center", marginBottom: "2rem" }}>
          Let&rsquo;s build something
        </span>
        <h2>
          <a href="mailto:hello@elaravance.design">Have an idea?<br />Let&rsquo;s make it real.</a>
        </h2>
        <p>Currently booking projects for Q3 2026. Tell me what you&rsquo;re building — I&rsquo;d love to hear about it.</p>
        <ContactForm />
        <p className="or-line">or email me directly at <a href="mailto:hello@elaravance.design">hello@elaravance.design</a></p>
        <div className="socials">
          <a href="#">Dribbble</a>
          <a href="#">Behance</a>
          <a href="#">LinkedIn</a>
          <a href="#">Instagram</a>
        </div>
      </div>
    </section>
  );
}
