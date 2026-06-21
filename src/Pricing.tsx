import { useState } from "react";

export default function Pricing({ onStart }: { onStart: () => void }) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleWaitlist = () => {
    if (!email) return alert("Please enter your email!");
    setJoined(true);
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      color: "#888",
      border: "#1a1a1a",
      badge: null,
      cta: "Get started free",
      ctaAction: onStart,
      ctaStyle: { background: "#111", color: "#fff", border: "1px solid #333" },
      features: [
        { text: "3 SDK generations (lifetime)", included: true },
        { text: "1 language per generation", included: true },
        { text: "Code preview", included: true },
        { text: "Single file download", included: true },
        { text: "Last 3 projects in history", included: true },
        { text: "ZIP download", included: false },
        { text: "AI Documentation", included: false },
        { text: "Batch Upload & Download", included: false },
        { text: "API Change Detection", included: false },
        { text: "GitHub Export", included: false },
        { text: "SDK History (unlimited)", included: false },
      ],
    },
    {
      name: "Pro",
      price: "$15",
      period: "per month",
      color: "#22c55e",
      border: "#22c55e44",
      badge: "RECOMMENDED",
      cta: "Join Waitlist",
      ctaAction: null,
      ctaStyle: { background: "#22c55e", color: "#000", border: "none" },
      features: [
        { text: "Unlimited SDK generations", included: true },
        { text: "All languages (TS, Python, Dart, Go, Java, Kotlin, Swift)", included: true },
        { text: "ZIP download", included: true },
        { text: "AI Documentation Generator", included: true },
        { text: "Batch Upload & Download", included: true },
        { text: "API Change Detection", included: true },
        { text: "Breaking Changes Report", included: true },
        { text: "GitHub Export", included: true },
        { text: "SDK History (unlimited)", included: true },
        { text: "Restore Previous SDKs", included: true },
      ],
    },
    {
      name: "Team",
      price: "$25",
      period: "per month",
      color: "#7c3aed",
      border: "#7c3aed44",
      badge: null,
      cta: "Join Waitlist",
      ctaAction: null,
      ctaStyle: { background: "#7c3aed", color: "#fff", border: "none" },
      features: [
        { text: "Everything in Pro", included: true },
        { text: "Multiple team members", included: true },
        { text: "Shared projects", included: true },
        { text: "GitHub Organizations", included: true },
        { text: "Shared API Keys", included: true },
        { text: "Team Dashboard", included: true },
        { text: "Audit Logs", included: true },
        { text: "Priority Support", included: true },
      ],
    },
  ];

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
      {/* Nav */}
      <nav style={{ borderBottom: "1px solid #111", padding: "0 40px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#000", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={onStart}>
          <span style={{ color: "#22c55e", fontSize: "18px", fontWeight: 700 }}>&lt;/&gt;</span>
          <span style={{ fontWeight: 700, fontSize: "16px" }}>SDKCraft</span>
        </div>
        <button onClick={onStart} style={{ background: "#22c55e", color: "#000", border: "none", padding: "8px 18px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Try free →</button>
      </nav>

      {/* Header */}
      <section style={{ maxWidth: "760px", margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>
        <h1 style={{ fontSize: "48px", fontWeight: 800, margin: "0 0 16px", letterSpacing: "-1.5px" }}>Simple, transparent pricing</h1>
        <p style={{ color: "#888", fontSize: "18px", margin: 0 }}>Start free. Upgrade when you're ready.</p>
      </section>

      {/* Plans */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 60px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
        {plans.map(plan => (
          <div key={plan.name} style={{ background: "#0a0a0a", border: `1px solid ${plan.border}`, borderRadius: "16px", padding: "32px", position: "relative" }}>
            {plan.badge && (
              <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: plan.color, color: "#000", fontSize: "12px", fontWeight: 700, padding: "4px 14px", borderRadius: "999px" }}>{plan.badge}</div>
            )}
            <div style={{ fontSize: "14px", color: plan.color, marginBottom: "12px", fontWeight: 600 }}>{plan.name.toUpperCase()}</div>
            <div style={{ fontSize: "48px", fontWeight: 800, marginBottom: "4px" }}>{plan.price}</div>
            <div style={{ color: "#555", fontSize: "14px", marginBottom: "32px" }}>{plan.period}</div>
            <button
              onClick={plan.ctaAction || (() => {})}
              style={{ width: "100%", padding: "12px", borderRadius: "10px", fontSize: "15px", fontWeight: 700, cursor: plan.ctaAction ? "pointer" : "not-allowed", marginBottom: "32px", opacity: plan.ctaAction ? 1 : 0.7, ...plan.ctaStyle }}
            >
              {plan.cta} {!plan.ctaAction && "— Coming soon"}
            </button>
            {plan.features.map(f => (
              <div key={f.text} style={{ display: "flex", gap: "10px", marginBottom: "12px", fontSize: "14px", color: f.included ? "#aaa" : "#444" }}>
                <span style={{ color: f.included ? plan.color : "#333" }}>{f.included ? "✓" : "✗"}</span>
                {f.text}
              </div>
            ))}
          </div>
        ))}
      </section>

      {/* Enterprise */}
      <section style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px 60px" }}>
        <div style={{ background: "#0a0a0a", border: "1px solid #d97706aa", borderRadius: "16px", padding: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
          <div>
            <div style={{ fontSize: "14px", color: "#d97706", fontWeight: 600, marginBottom: "8px" }}>ENTERPRISE</div>
            <div style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>For large teams & healthcare companies</div>
            <div style={{ color: "#888", fontSize: "15px", maxWidth: "500px" }}>
              Custom integrations, FHIR & DICOM support, White Label SDK Portal, SSO, On-Premise deployment, SLA, and dedicated support.
            </div>
          </div>
          <a href="mailto:ihsan.elashhab@gmail.com?subject=SDKCraft Enterprise Inquiry" style={{ background: "#d97706", color: "#000", padding: "14px 28px", borderRadius: "10px", fontWeight: 700, fontSize: "15px", textDecoration: "none", whiteSpace: "nowrap" as const }}>
            Get a custom quote →
          </a>
        </div>
      </section>

      {/* Free limit notice */}
      <section style={{ maxWidth: "760px", margin: "0 auto", padding: "0 24px 60px", textAlign: "center" }}>
        <div style={{ background: "#0a0a0a", border: "1px solid #22c55e22", borderRadius: "12px", padding: "24px", color: "#888", fontSize: "14px" }}>
          💡 Free users get <strong style={{ color: "#fff" }}>3 SDK generations</strong> to try the platform. After that, you'll see an upgrade prompt. No credit card required to start.
        </div>
      </section>

      {/* Waitlist */}
      <section style={{ maxWidth: "600px", margin: "0 auto", padding: "0 24px 100px", textAlign: "center" }}>
        <div style={{ background: "#0a0a0a", border: "1px solid #22c55e33", borderRadius: "16px", padding: "40px" }}>
          <div style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}> Join the Pro Waitlist</div>
          <div style={{ color: "#888", marginBottom: "24px" }}>Be first when Pro launches. Early adopters get <strong style={{ color: "#22c55e" }}>30% off</strong>.</div>
          {joined ? (
            <div style={{ color: "#22c55e", fontWeight: 700, fontSize: "18px" }}>✅ You're on the list! We'll notify you soon.</div>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
                style={{ flex: 1, padding: "12px 16px", borderRadius: "8px", border: "1px solid #333", background: "#111", color: "#fff", fontSize: "14px" }} />
              <button onClick={handleWaitlist} style={{ padding: "12px 20px", borderRadius: "8px", background: "#22c55e", color: "#000", border: "none", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" as const }}>
                Join Waitlist
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #111", padding: "24px 40px", display: "flex", justifyContent: "space-between", color: "#555", fontSize: "13px" }}>
        <span>SDKCraft © 2025</span>
        <a href="https://github.com/ihsanelashhab-web/api-to-sdk" target="_blank" rel="noreferrer" style={{ color: "#555", textDecoration: "none" }}>GitHub</a>
      </footer>
    </div>
  );
}