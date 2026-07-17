import SkinAnalyzer from "@/components/SkinAnalyzer";
import Footer from "@/components/Footer";

const STEPS = [
  {
    t: "Share a photo",
    d: "Upload or snap a clear, well-lit photo of your skin. It's analyzed in the moment and never stored.",
  },
  {
    t: "Lumi reads your skin",
    d: "Claude vision assesses your skin type and visible concerns — texture, hydration, oiliness, and tone.",
  },
  {
    t: "Get your routine",
    d: "Receive a personalized AM/PM routine, key ingredients to look for, and a chat to ask follow-ups.",
  },
];

const INGREDIENTS = [
  { n: "Niacinamide", d: "Balances oil, calms redness, refines the look of pores." },
  { n: "Hyaluronic acid", d: "Featherlight hydration that plumps and smooths." },
  { n: "Retinoids", d: "Boost cell turnover for texture and fine lines." },
  { n: "Vitamin C", d: "Brightens tone and defends against daily stressors." },
  { n: "Salicylic acid", d: "Clears pores and refines uneven texture." },
  { n: "SPF", d: "The single most effective anti-aging step, every morning." },
];

export default function Home() {
  return (
    <>
      <main id="top">
        <header className="hero wrap">
          <div className="hero-copy">
            <span className="pill">
              <span className="dot" /> AI skincare, powered by Claude vision
            </span>
            <h1>
              Meet Lumi, your <em>personal</em> AI skin specialist.
            </h1>
            <p>
              Share a photo and get a clear read on your skin — type, concerns, and a routine built
              around you. Friendly, specific, and free of jargon.
            </p>
          </div>
          <SkinAnalyzer />
        </header>

        <section className="section wrap" id="how">
          <div className="sec-head">
            <span className="eyebrow">How it works</span>
            <h2>Three steps to a routine that fits.</h2>
          </div>
          <ol className="steps">
            {STEPS.map((s, i) => (
              <li className="step reveal" key={s.t}>
                <span className="step-num">{i + 1}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="section wrap" id="ingredients">
          <div className="sec-head">
            <span className="eyebrow">The good stuff</span>
            <h2>Ingredients Lumi loves.</h2>
            <p className="sec-lede">
              Lumi recommends ingredient <em>types</em>, not brands — so you can shop with confidence.
            </p>
          </div>
          <div className="ing-grid">
            {INGREDIENTS.map((ing) => (
              <div className="ing-card reveal" key={ing.n}>
                <h3>{ing.n}</h3>
                <p>{ing.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section wrap about" id="about">
          <div className="about-inner reveal">
            <span className="eyebrow">About Lumi</span>
            <h2>Skincare guidance that feels human.</h2>
            <p>
              Lumi is a friendly AI skincare specialist. It uses vision to understand what your skin
              actually needs, then translates that into a calm, practical routine you can start today.
              No overwhelm, no hard sell — just clear next steps.
            </p>
            <p className="fineprint">
              Lumi provides general cosmetic guidance, not medical advice. It doesn&rsquo;t diagnose
              conditions. Patch-test new products, introduce one active at a time, and consult a
              board-certified dermatologist for persistent or concerning issues.
            </p>
            <a className="btn primary" href="#analyze">
              Analyze my skin
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
