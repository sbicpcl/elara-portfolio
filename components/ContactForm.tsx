"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="form-done" role="status">
        <div className="form-done-mark" aria-hidden="true">&#10003;</div>
        <h3>Message sent</h3>
        <p>Thanks for reaching out — I&rsquo;ll get back to you within a couple of days.</p>
        <button className="chip" onClick={() => setStatus("idle")}>Send another</button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      {/* Honeypot: hidden from humans, tempting to bots. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" required autoComplete="name" placeholder="Your name" />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="message">Project details</label>
        <textarea id="message" name="message" rows={4} required placeholder="Tell me a little about what you're building…" />
      </div>

      {status === "error" && <p className="form-status err" role="alert">{error}</p>}

      <button type="submit" className="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send message"} <span aria-hidden="true">&#8599;</span>
      </button>
    </form>
  );
}
