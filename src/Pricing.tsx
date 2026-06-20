export default function Pricing({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>
      <nav style={{ borderBottom: "1px solid #111", padding: "0 32px", minHeight: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", position: "sticky", top: 0, background: "#000", zIndex: 100, flexWrap: "wrap" }}>
        <button onClick={onStart} style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 0 }}>
          <span style={{ color: "#22c55e", fontSize: "18px", fontWeight: 700 }}>&lt;/&gt;</span>
          <span style={{ fontWeight: 700, fontSize: "16px" }}>SDKCraft</span>
        </button>
        <button onClick={onStart} style={{ background: "#22c55e", color: "#000", border: "none", padding: "8px 18px", borderRadius: "8px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>Try free</button>
      </nav>

      <main>
        <section style={{ maxWidth: "760px", margin: "0 auto", padding: "80px 24px 56px", textAlign: "center" }}>
          <h1 style={{ fontSize: "48px", fontWeight: 800, margin: "0 0 16px", letterSpacing: 0 }}>Simple launch pricing</h1>
          <p style={{ color: "#888", fontSize: "18px", margin: 0 }}>The current SDKCraft beta is free while the product is being validated.</p>
        </section>

        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 56px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          <Plan
            name="Free Beta"
            price="$0"
            note="Available now"
            color="#22c55e"
            action="Start generating"
            active
            onStart={onStart}
            features={[
              "SDK generation for 5 languages",
              "OpenAPI JSON and YAML support",
              "AI documentation generator",
              "API change detection",
              "Batch upload",
              "ZIP download",
              "Optional GitHub login",
            ]}
          />

          <Plan
            name="Pro"
            price="$49"
            note="Planned after launch"
            color="#3b82f6"
            action="Coming soon"
            onStart={onStart}
            features={[
              "Everything in Free Beta",
              "Higher generation limits",
              "SDK update manager",
              "Test generation",
              "Package publishing workflows",
              "Interactive SDK playground",
              "Priority support",
            ]}
          />

          <Plan
            name="Enterprise"
            price="Custom"
            note="For API teams"
            color="#a855f7"
            action="Coming soon"
            onStart={onStart}
            features={[
              "Everything in Pro",
              "Private deployment options",
              "White-label developer portal",
              "Team collaboration",
              "SSO support",
              "Custom language targets",
              "Dedicated onboarding",
            ]}
          />
        </section>

        <section style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px 88px", textAlign: "center" }}>
          <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "32px" }}>
            <div style={{ fontSize: "24px", fontWeight: 800, marginBottom: "10px" }}>Launching in beta</div>
            <div style={{ color: "#888", lineHeight: 1.7, marginBottom: "24px" }}>
              Paid plans are listed as the product direction, but the launch version is focused on feedback, reliability, and developer experience.
            </div>
            <button onClick={onStart} style={{ background: "#22c55e", color: "#000", border: "none", padding: "14px 28px", borderRadius: "8px", fontSize: "16px", fontWeight: 800, cursor: "pointer" }}>
              Try the beta
            </button>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: "1px solid #111", padding: "24px 32px", display: "flex", justifyContent: "space-between", gap: "16px", color: "#555", fontSize: "13px", flexWrap: "wrap" }}>
        <span>SDKCraft 2026</span>
        <a href="https://github.com/ihsanelashhab-web/api-to-sdk" target="_blank" rel="noreferrer" style={{ color: "#555", textDecoration: "none" }}>GitHub</a>
      </footer>
    </div>
  );
}

function Plan({
  name,
  price,
  note,
  color,
  action,
  active,
  onStart,
  features,
}: {
  name: string;
  price: string;
  note: string;
  color: string;
  action: string;
  active?: boolean;
  onStart: () => void;
  features: string[];
}) {
  return (
    <div style={{ background: "#0a0a0a", border: `1px solid ${active ? "#22c55e66" : "#1a1a1a"}`, borderRadius: "8px", padding: "28px" }}>
      <div style={{ fontSize: "14px", color, marginBottom: "12px", fontWeight: 800, textTransform: "uppercase" }}>{name}</div>
      <div style={{ fontSize: "44px", fontWeight: 800, marginBottom: "4px" }}>{price}</div>
      <div style={{ color: "#666", fontSize: "14px", marginBottom: "28px" }}>{note}</div>
      <button
        onClick={active ? onStart : undefined}
        disabled={!active}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          fontSize: "15px",
          fontWeight: 800,
          cursor: active ? "pointer" : "not-allowed",
          marginBottom: "28px",
          background: active ? "#22c55e" : "#111",
          color: active ? "#000" : "#777",
          border: active ? "none" : "1px solid #333",
        }}
      >
        {action}
      </button>

      {features.map((feature) => (
        <div key={feature} style={{ display: "flex", gap: "10px", marginBottom: "12px", fontSize: "14px", color: "#aaa" }}>
          <span style={{ color }}>OK</span> {feature}
        </div>
      ))}
    </div>
  );
}
