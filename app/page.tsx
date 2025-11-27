// app/page.tsx

import React from "react";

export default function Home() {
  const skills = [
    "OpenAI Codex & GPT automation",
    "Python + Node.js workflows",
    "Financial modeling & Excel automation",
    "Next.js / React web apps",
    "API integrations (Perplexity, GitHub, etc.)",
    "Process design & documentation",
  ];

  const projects = [
    {
      title: "Daily Automation Runner",
      tag: "Python + Node + Codex",
      desc: "One-command workflow that ingests notes, summarizes with GPT, updates Excel models, and opens a Codex task on the active repo.",
    },
    {
      title: "AI-Powered Investor Summary Generator",
      tag: "Python + OpenAI",
      desc: "Takes raw deal notes, models, and PDFs, then outputs clean investor-ready summaries and docx packs for lenders and partners.",
    },
    {
      title: "Codex-Assisted Web App Scaffold",
      tag: "Next.js + Codex",
      desc: "Repo-native Codex assistant that proposes changes, drafts docs, and guides deployment for client-facing web apps.",
    },
  ];

  const steps = [
    "Clarify the target workflow and business goal.",
    "Map tools (Codex, GPT, Excel, docs, repos) into a single pipeline.",
    "Ship a minimal, working version fast.",
    "Iterate with metrics, logs, and user feedback.",
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        background: "#050816",
        color: "#f9fafb",
      }}
    >
      {/* Top bar */}
      <header
        style={{
          borderBottom: "1px solid rgba(148,163,184,0.4)",
          position: "sticky",
          top: 0,
          backdropFilter: "blur(12px)",
          zIndex: 20,
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "0.75rem 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontWeight: 700, letterSpacing: "0.08em", fontSize: 12, textTransform: "uppercase" }}>
            Codex Automation Portfolio
          </div>
          <nav style={{ display: "flex", gap: "1rem", fontSize: 14 }}>
            <a href="#projects" style={{ opacity: 0.8 }}>Projects</a>
            <a href="#stack" style={{ opacity: 0.8 }}>Stack</a>
            <a href="#process" style={{ opacity: 0.8 }}>Process</a>
            <a href="#contact" style={{ opacity: 0.8 }}>Contact</a>
          </nav>
        </div>
      </header>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "2.5rem 1.25rem 4rem" }}>
        {/* Hero */}
        <section style={{ display: "grid", gap: "2.5rem", gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "0.16em", color: "#a5b4fc", marginBottom: 8 }}>
              Automation • AI • Web
            </p>
            <h1 style={{ fontSize: "2.75rem", lineHeight: 1.1, fontWeight: 700, marginBottom: "0.75rem" }}>
              I build repo-native automations <br /> powered by Codex & GPT.
            </h1>
            <p style={{ fontSize: 15, color: "#cbd5f5", maxWidth: 540, marginBottom: "1.5rem" }}>
              From daily runners that summarize your work and update models, to Codex-assisted web apps
              deployed from GitHub – I streamline the workflows that keep your business moving.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              <span
                style={{
                  borderRadius: 999,
                  border: "1px solid rgba(129,140,248,0.7)",
                  padding: "0.35rem 0.9rem",
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                }}
              >
                OpenAI Codex
              </span>
              <span
                style={{
                  borderRadius: 999,
                  border: "1px solid rgba(45,212,191,0.8)",
                  padding: "0.35rem 0.9rem",
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                }}
              >
                Next.js
              </span>
              <span
                style={{
                  borderRadius: 999,
                  border: "1px solid rgba(248,250,252,0.5)",
                  padding: "0.35rem 0.9rem",
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                }}
              >
                Python • Excel • Docs
              </span>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <a
                href="#projects"
                style={{
                  background: "linear-gradient(to right, #4f46e5, #7c3aed)",
                  borderRadius: 999,
                  padding: "0.6rem 1.4rem",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                View automation examples
              </a>
              <a
                href="#contact"
                style={{
                  borderRadius: 999,
                  padding: "0.6rem 1.1rem",
                  fontSize: 14,
                  border: "1px solid rgba(148,163,184,0.7)",
                }}
              >
                Book a short call
              </a>
            </div>
          </div>

          <div
            style={{
              borderRadius: 24,
              border: "1px solid rgba(148,163,184,0.6)",
              background: "radial-gradient(circle at top, rgba(56,189,248,0.12), transparent 55%), #020617",
              padding: "1.2rem 1.4rem",
              fontSize: 13,
            }}
          >
            <div style={{ marginBottom: "0.75rem", opacity: 0.75 }}>Sample daily automation:</div>
            <ol style={{ paddingLeft: "1.1rem", lineHeight: 1.4, marginBottom: "1rem" }}>
              <li>Pull today&apos;s notes from your repo or folder.</li>
              <li>Summarize with GPT into investor-ready bullets.</li>
              <li>Update an Excel model tab with a new log entry.</li>
              <li>Open a Codex task with highest-leverage changes.</li>
              <li>Prepare a manifest for Adobe exports if needed.</li>
            </ol>
            <div
              style={{
                borderRadius: 16,
                border: "1px solid rgba(52,211,153,0.7)",
                padding: "0.75rem 0.9rem",
                background: "rgba(6,95,70,0.35)",
              }}
            >
              <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>
                Outcome
              </div>
              <p style={{ fontSize: 13, color: "#ecfdf5" }}>
                Less time moving files and updating spreadsheets; more time on decisions, clients, and actual strategy.
              </p>
            </div>
          </div>
        </section>

        {/* Skills / stack */}
        <section id="stack" style={{ marginTop: "3.5rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 600, marginBottom: "0.75rem" }}>What I automate</h2>
          <p style={{ fontSize: 14, color: "#cbd5f5", marginBottom: "1rem" }}>
            I connect AI models, code, and business tools into opinionated, reliable workflows.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {skills.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: 13,
                  padding: "0.35rem 0.7rem",
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.8)",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" style={{ marginTop: "3.5rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 600, marginBottom: "0.75rem" }}>Selected automation projects</h2>
          <div
            style={{
              display: "grid",
              gap: "1.25rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            }}
          >
            {projects.map((p) => (
              <article
                key={p.title}
                style={{
                  borderRadius: 20,
                  border: "1px solid rgba(148,163,184,0.7)",
                  padding: "1rem 1.1rem",
                  background: "rgba(15,23,42,0.9)",
                }}
              >
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em", color: "#a5b4fc", marginBottom: 4 }}>
                  {p.tag}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{p.title}</h3>
                <p style={{ fontSize: 13, color: "#e2e8f0" }}>{p.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Process */}
        <section id="process" style={{ marginTop: "3.5rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 600, marginBottom: "0.75rem" }}>How I work with clients</h2>
          <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 2fr)" }}>
            <p style={{ fontSize: 14, color: "#cbd5f5" }}>
              I focus on high-leverage automations that have a clear owner and a clear ROI: fewer clicks, fewer errors,
              faster feedback loops. Most projects ship a working version in 1–2 weeks, then we iterate.
            </p>
            <ol style={{ paddingLeft: "1.1rem", fontSize: 13, color: "#e5e7eb", lineHeight: 1.5 }}>
              {steps.map((s, i) => (
                <li key={i} style={{ marginBottom: "0.35rem" }}>
                  <strong style={{ color: "#a5b4fc" }}>Step {i + 1}.</strong> {s}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" style={{ marginTop: "3.5rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 600, marginBottom: "0.75rem" }}>Let&apos;s streamline your stack</h2>
          <p style={{ fontSize: 14, color: "#cbd5f5", marginBottom: "1rem", maxWidth: 540 }}>
            Share a brief description of your current workflow (tools, pain points, and ideal outcome). I&apos;ll respond
            with a concrete, staged automation plan and an estimate.
          </p>
          <div
            style={{
              borderRadius: 18,
              border: "1px solid rgba(148,163,184,0.7)",
              padding: "1rem 1.1rem",
              fontSize: 13,
              maxWidth: 560,
            }}
          >
            <p style={{ marginBottom: "0.5rem" }}>Drop me a note:</p>
            <ul style={{ paddingLeft: "1.1rem", lineHeight: 1.6 }}>
              <li>Email: <span style={{ fontFamily: "monospace" }}>your.email@example.com</span></li>
              <li>GitHub: <span style={{ fontFamily: "monospace" }}>github.com/your-handle</span></li>
              <li>Upwork: link to your freelancer profile (optional)</li>
            </ul>
          </div>
        </section>
      </div>

      <footer
        style={{
          borderTop: "1px solid rgba(148,163,184,0.4)",
          padding: "0.9rem 1.25rem",
          fontSize: 12,
          color: "#9ca3af",
          textAlign: "center",
        }}
      >
        © {new Date().getFullYear()} • Codex & Automation Portfolio
      </footer>
    </main>
  );
}
