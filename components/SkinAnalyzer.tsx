"use client";

import { useRef, useState } from "react";
import type { Analysis, Severity } from "@/lib/anthropic";

type Stage = "upload" | "analyzing" | "results";
type ChatMsg = { role: "user" | "assistant"; content: string };

/** Downscale an image file to a max dimension and return a JPEG data URL. */
function downscale(file: File, max = 1024, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas unsupported"));
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image."));
    };
    img.src = url;
  });
}

/** Read a file as a base64 data URL (used for PDFs, which aren't downscaled). */
function readDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("Could not read that file."));
    r.readAsDataURL(file);
  });
}

const SEVERITY_LABEL: Record<Severity, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "Needs attention",
};

export default function SkinAnalyzer() {
  const [stage, setStage] = useState<Stage>("upload");
  const [preview, setPreview] = useState<string>("");
  const [fileKind, setFileKind] = useState<"image" | "pdf" | null>(null);
  const [fileName, setFileName] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [demo, setDemo] = useState(false);

  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatBusy, setChatBusy] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    if (!isImage && !isPdf) {
      setError("Please choose an image or a PDF.");
      return;
    }
    if (isPdf && file.size > 10 * 1024 * 1024) {
      setError("That PDF is a little large — please use one under 10 MB.");
      return;
    }
    setError("");
    try {
      if (isPdf) {
        const dataUrl = await readDataUrl(file); // PDFs sent as-is (no downscale)
        setPreview(dataUrl);
        setFileKind("pdf");
        setFileName(file.name);
      } else {
        const dataUrl = await downscale(file);
        setPreview(dataUrl);
        setFileKind("image");
        setFileName(file.name);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that file.");
    }
  }

  async function analyze() {
    if (!preview) return;
    setStage("analyzing");
    setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: preview, notes }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Analysis failed.");
      setAnalysis(json.analysis);
      setDemo(Boolean(json.demo));
      setChat([]);
      setStage("results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed.");
      setStage("upload");
    }
  }

  function reset() {
    setStage("upload");
    setPreview("");
    setFileKind(null);
    setFileName("");
    setNotes("");
    setAnalysis(null);
    setChat([]);
    setChatInput("");
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function sendChat(e: React.FormEvent) {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text || chatBusy) return;
    const next = [...chat, { role: "user" as const, content: text }];
    setChat(next);
    setChatInput("");
    setChatBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, analysis }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Chat failed.");
      setChat((c) => [...c, { role: "assistant", content: json.reply }]);
    } catch (e) {
      setChat((c) => [
        ...c,
        { role: "assistant", content: e instanceof Error ? e.message : "Something went wrong." },
      ]);
    } finally {
      setChatBusy(false);
      requestAnimationFrame(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }));
    }
  }

  return (
    <div className="analyzer" id="analyze">
      {/* ---------- Upload ---------- */}
      {stage !== "results" && (
        <div className="card upload-card">
          <label
            className={`dropzone${dragging ? " drag" : ""}${preview ? " has-image" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
          >
            {preview && fileKind === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Your uploaded photo" className="preview" />
            ) : preview && fileKind === "pdf" ? (
              <div className="pdf-preview">
                <div className="pdf-ico" aria-hidden="true">PDF</div>
                <span className="pdf-name">{fileName}</span>
              </div>
            ) : (
              <div className="dz-inner">
                <div className="dz-icon" aria-hidden="true">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <rect x="3" y="5" width="18" height="14" rx="3" />
                    <circle cx="9" cy="11" r="2" />
                    <path d="M21 17l-5-5-4 4-2-2-4 4" />
                  </svg>
                </div>
                <p className="dz-title">Upload a photo or a PDF</p>
                <p className="dz-sub">Drag &amp; drop, or tap to choose. A clear photo or a PDF document both work.</p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*,application/pdf"
              className="dz-input"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>

          <div className="field">
            <label htmlFor="notes">Anything specific? (optional)</label>
            <textarea
              id="notes"
              rows={2}
              placeholder="e.g. I get oily by midday, or I want to reduce dullness…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && <p className="err" role="alert">{error}</p>}

          <div className="upload-actions">
            <button className="btn primary" onClick={analyze} disabled={!preview || stage === "analyzing"}>
              {stage === "analyzing" ? "Analyzing…" : "Analyze my skin"}
            </button>
            {preview && stage !== "analyzing" && (
              <button className="btn ghost" onClick={reset}>
                Clear
              </button>
            )}
          </div>
          <p className="privacy">🔒 Your photo is analyzed in the moment and never stored.</p>
        </div>
      )}

      {/* ---------- Analyzing overlay ---------- */}
      {stage === "analyzing" && (
        <div className="analyzing" role="status">
          <div className="scan">
            {fileKind === "pdf" ? (
              <div className="pdf-preview scan-doc">
                <div className="pdf-ico" aria-hidden="true">PDF</div>
                <span className="pdf-name">{fileName}</span>
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Analyzing" />
            )}
            <div className="scan-line" />
          </div>
          <p>Reading your {fileKind === "pdf" ? "document" : "skin"}…</p>
        </div>
      )}

      {/* ---------- Results ---------- */}
      {stage === "results" && analysis && (
        <div className="results">
          {demo && (
            <div className="demo-banner">
              Showing <strong>sample results</strong> — add an <code>ANTHROPIC_API_KEY</code> to enable live AI analysis.
            </div>
          )}

          <div className="result-head">
            <div className="result-thumb">
              {fileKind === "pdf" ? (
                <div className="pdf-ico small" aria-hidden="true">PDF</div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Your upload" />
              )}
            </div>
            <div>
              <span className="eyebrow">Skin type</span>
              <h3>{analysis.skinType}</h3>
              <p className="summary">{analysis.summary}</p>
            </div>
            <button className="btn ghost small" onClick={reset}>
              New photo
            </button>
          </div>

          <section className="block">
            <h4>What Lumi noticed</h4>
            <div className="concerns">
              {analysis.concerns.map((c) => (
                <div className={`concern sev-${c.severity}`} key={c.name}>
                  <span className="sev-stripe" aria-hidden="true" />
                  <div>
                    <div className="concern-top">
                      <span className="concern-name">{c.name}</span>
                      <span className="sev-chip">{SEVERITY_LABEL[c.severity]}</span>
                    </div>
                    <p>{c.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="block">
            <h4>Your suggested routine</h4>
            <div className="routines">
              {(["am", "pm"] as const).map((time) => (
                <div className="routine" key={time}>
                  <div className="routine-label">{time === "am" ? "☀ Morning" : "☾ Evening"}</div>
                  <ol>
                    {analysis.routine[time].map((s, i) => (
                      <li key={i}>
                        <span className="rstep">{s.step}</span>
                        <span className="rproduct">{s.product}</span>
                        <span className="rwhy">{s.why}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </section>

          <section className="block">
            <h4>Key ingredients to look for</h4>
            <div className="ingredients">
              {analysis.ingredients.map((ing) => (
                <div className="ingredient" key={ing.name}>
                  <span className="ing-name">{ing.name}</span>
                  <span className="ing-benefit">{ing.benefit}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ---------- Chat ---------- */}
          <section className="block chat">
            <h4>Ask Lumi a follow-up</h4>
            <div className="chat-log">
              {chat.length === 0 && (
                <p className="chat-hint">
                  e.g. &ldquo;Can I use retinol with this routine?&rdquo; or &ldquo;What order do the serums go in?&rdquo;
                </p>
              )}
              {chat.map((m, i) => (
                <div className={`bubble ${m.role}`} key={i}>
                  {m.content}
                </div>
              ))}
              {chatBusy && <div className="bubble assistant typing">Lumi is typing…</div>}
              <div ref={chatEndRef} />
            </div>
            <form className="chat-form" onSubmit={sendChat}>
              <input
                type="text"
                placeholder="Ask about products, order, or ingredients…"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button className="btn primary small" type="submit" disabled={chatBusy || !chatInput.trim()}>
                Send
              </button>
            </form>
          </section>

          <p className="disclaimer">{analysis.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
