import { useState } from "react";

const features = [
  { icon: "⚡", title: "One-click generation", desc: "Upload your OpenAPI spec and get a production-ready SDK in seconds." },
  { icon: "🌐", title: "5 languages supported", desc: "TypeScript, Python, Dart, Go, and Java. Swift and C# coming soon." },
  { icon: "🔒", title: "Production-ready code", desc: "Auto-retry, pagination, auth headers, and proper TypeScript types included." },
];

const steps = [
  { n: "01", title: "Upload your spec", desc: "Drop your OpenAPI JSON or YAML file" },
  { n: "02", title: "Pick your language", desc: "Choose one or more target languages" },
  { n: "03", title: "Download your SDK", desc: "Get clean, typed, ready-to-use code" },
];

export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid #111", padding: "0 40px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#000", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#22c55e", fontSize: "18px", fontWeight: 700 }}>&lt;/&gt;</span>
          <span style={{ fontWeight: 700, fontSize: "16px" }}>SDKCraft</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <a href="https://github.com/ihsanelashhab-web/api-to-sdk" target="_blank" rel="noreferrer" style={{ color: "#888", fontSize: "14px", textDecoration: "none" }}>GitHub</a>
          <button onClick={onStart} style={{ background: "#fff", color: "#000", border: "none", padding: "8px 18px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Try free →</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: "760px", margin: "0 auto", padding: "100px 24px 80px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "#111", border: "1px solid #222", borderRadius: "999px", padding: "6px 16px", fontSize: "13px", color: "#888", marginBottom: "32px" }}>
          Open source · Free · No signup required
        </div>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 24px", letterSpacing: "-2px" }}>
          Generate SDKs from<br />
          <span style={{ color: "#22c55e" }}>OpenAPI specs</span> instantly
        </h1>
        <p style={{ fontSize: "18px", color: "#888", lineHeight: 1.7, margin: "0 auto 48px", maxWidth: "540px" }}>
          Stop writing boilerplate API clients. Upload your spec, pick your language, and get production-ready SDK code in seconds.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onStart} style={{ background: "#22c55e", color: "#000", border: "none", padding: "14px 32px", borderRadius: "10px", fontSize: "16px", fontWeight: 700, cursor: "pointer" }}>
            Generate your SDK →
          </button>
          <a href="https://github.com/ihsanelashhab-web/api-to-sdk" target="_blank" rel="noreferrer"
            style={{ background: "#111", color: "#fff", border: "1px solid #222", padding: "14px 32px", borderRadius: "10px", fontSize: "16px", fontWeight: 600, textDecoration: "none" }}>
            ★ Star on GitHub
          </a>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px 100px" }}>
        <h2 style={{ textAlign: "center", fontSize: "32px", fontWeight: 700, marginBottom: "48px", letterSpacing: "-1px" }}>
          Everything you need, nothing you don't
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
          {features.map(f => (
            <div key={f.title} style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "14px", padding: "28px" }}>
              <div style={{ fontSize: "28px", marginBottom: "16px" }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: "16px", marginBottom: "10px" }}>{f.title}</div>
              <div style={{ color: "#888", fontSize: "14px", lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: "760px", margin: "0 auto", padding: "0 24px 100px" }}>
        <h2 style={{ textAlign: "center", fontSize: "32px", fontWeight: 700, marginBottom: "48px", letterSpacing: "-1px" }}>
          How it works
        </h2>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1px solid #22c55e44", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", color: "#22c55e", fontSize: "13px", fontWeight: 700, flexShrink: 0 }}>{s.n}</div>
                {i < steps.length - 1 && <div style={{ width: "1px", height: "40px", background: "#1a1a1a" }} />}
              </div>
              <div style={{ paddingTop: "8px", paddingBottom: "32px" }}>
                <div style={{ fontWeight: 600, fontSize: "16px", marginBottom: "6px" }}>{s.title}</div>
                <div style={{ color: "#888", fontSize: "14px" }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: "1px solid #111", padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "40px", fontWeight: 800, marginBottom: "16px", letterSpacing: "-1.5px" }}>
          Ready to generate your SDK?
        </h2>
        <p style={{ color: "#888", marginBottom: "40px", fontSize: "16px" }}>Free, open source, no signup required.</p>
        <button onClick={onStart} style={{ background: "#22c55e", color: "#000", border: "none", padding: "16px 40px", borderRadius: "10px", fontSize: "18px", fontWeight: 700, cursor: "pointer" }}>
          Get started free →
        </button>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #111", padding: "24px 40px", display: "flex", justifyContent: "space-between", color: "#555", fontSize: "13px" }}>
        <span>&lt;/&gt; SDKCraft — Open source SDK generator</span>
        <a href="https://github.com/ihsanelashhab-web/api-to-sdk" target="_blank" rel="noreferrer" style={{ color: "#555", textDecoration: "none" }}>GitHub</a>
      </footer>

    </div>
  );
}