import { useState } from "react";

export default function Pricing({ onStart }: { onStart: () => void }) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleWaitlist = () => {
    if (!email) return alert("Please enter your email!");
    setJoined(true);
  };

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #111', padding: '0 40px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#000', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={onStart}>
          <span style={{ color: '#22c55e', fontSize: '18px', fontWeight: 700 }}>&lt;/&gt;</span>
          <span style={{ fontWeight: 700, fontSize: '16px' }}>SDKCraft</span>
        </div>
        <button onClick={onStart} style={{ background: '#22c55e', color: '#000', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Try free</button>
      </nav>

      {/* Header */}
      <section style={{ maxWidth: '760px', margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-1.5px' }}>Simple, transparent pricing</h1>
        <p style={{ color: '#888', fontSize: '18px', margin: 0 }}>Start free. Upgrade when you need more.</p>
      </section>

      {/* Plans */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>

        {/* Free */}
        <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '32px' }}>
          <div style={{ fontSize: '14px', color: '#888', marginBottom: '12px', fontWeight: 600 }}>FREE</div>
          <div style={{ fontSize: '48px', fontWeight: 800, marginBottom: '4px' }}>$0</div>
          <div style={{ color: '#555', fontSize: '14px', marginBottom: '32px' }}>Forever free</div>
          <button onClick={onStart} style={{ width: '100%', padding: '12px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginBottom: '32px', background: '#111', color: '#fff', border: '1px solid #333' }}>Get started free</button>
          {[
            'SDK Generator (5 languages)',
            'AI Documentation Generator',
            'API Change Detection',
            'Batch Upload (up to 3 files)',
            'JSON & YAML support',
            'GitHub Issues support',
          ].map(f => (
            <div key={f} style={{ display: 'flex', gap: '10px', marginBottom: '12px', fontSize: '14px', color: '#aaa' }}>
              <span style={{ color: '#22c55e' }}>✓</span> {f}
            </div>
          ))}
        </div>

        {/* Pro */}
        <div style={{ background: '#0a0a0a', border: '1px solid #22c55e44', borderRadius: '16px', padding: '32px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#22c55e', color: '#000', fontSize: '12px', fontWeight: 700, padding: '4px 14px', borderRadius: '999px' }}>MOST POPULAR</div>
          <div style={{ fontSize: '14px', color: '#22c55e', marginBottom: '12px', fontWeight: 600 }}>PRO</div>
          <div style={{ fontSize: '48px', fontWeight: 800, marginBottom: '4px' }}>$49</div>
          <div style={{ color: '#555', fontSize: '14px', marginBottom: '32px' }}>per month</div>
          <button style={{ width: '100%', padding: '12px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: 'not-allowed', marginBottom: '32px', background: '#22c55e', color: '#000', border: 'none', opacity: 0.6 }}>Coming soon</button>
          {[
            'Everything in Free',
            'Unlimited batch processing',
            'AI Test Generator',
            'SDK Update Manager',
            'Multi-Platform Publishing',
            'Interactive API Playground',
            'Priority support',
            'Early access to new features',
          ].map(f => (
            <div key={f} style={{ display: 'flex', gap: '10px', marginBottom: '12px', fontSize: '14px', color: '#aaa' }}>
              <span style={{ color: '#22c55e' }}>✓</span> {f}
            </div>
          ))}
        </div>

        {/* Enterprise */}
        <div style={{ background: '#0a0a0a', border: '1px solid #7c3aed44', borderRadius: '16px', padding: '32px' }}>
          <div style={{ fontSize: '14px', color: '#7c3aed', marginBottom: '12px', fontWeight: 600 }}>ENTERPRISE</div>
          <div style={{ fontSize: '48px', fontWeight: 800, marginBottom: '4px' }}>$299</div>
          <div style={{ color: '#555', fontSize: '14px', marginBottom: '32px' }}>per month</div>
          <button style={{ width: '100%', padding: '12px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: 'not-allowed', marginBottom: '32px', background: '#7c3aed', color: '#fff', border: 'none', opacity: 0.6 }}>Coming soon</button>
          {[
            'Everything in Pro',
            'Health Edition (FHIR + DICOM)',
            'White Label SDK Portal',
            'Team Collaboration',
            'SSO Integration',
            'On-Premise Deployment',
            'SLA 99.9% uptime',
            'Dedicated support',
          ].map(f => (
            <div key={f} style={{ display: 'flex', gap: '10px', marginBottom: '12px', fontSize: '14px', color: '#aaa' }}>
              <span style={{ color: '#7c3aed' }}>✓</span> {f}
            </div>
          ))}
        </div>
      </section>

      {/* Waitlist */}
      <section style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px 100px', textAlign: 'center' }}>
        <div style={{ background: '#0a0a0a', border: '1px solid #22c55e33', borderRadius: '16px', padding: '40px' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>🚀 Join the Pro Waitlist</div>
          <div style={{ color: '#888', marginBottom: '24px' }}>Be the first to know when Pro launches. Get 30% off for early adopters.</div>
          {joined ? (
            <div style={{ color: '#22c55e', fontWeight: 700, fontSize: '18px' }}>✅ You're on the list! We'll notify you soon.</div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '14px' }}
              />
              <button onClick={handleWaitlist} style={{ padding: '12px 20px', borderRadius: '8px', background: '#22c55e', color: '#000', border: 'none', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
                Join Waitlist
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #111', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', color: '#555', fontSize: '13px' }}>
        <span>SDKCraft © 2025</span>
        <a href='https://github.com/ihsanelashhab-web/api-to-sdk' target='_blank' rel='noreferrer' style={{ color: '#555', textDecoration: 'none' }}>GitHub</a>
      </footer>
    </div>
  );
}