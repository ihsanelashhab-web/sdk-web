export default function Pricing({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ borderBottom: '1px solid #111', padding: '0 40px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#000', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={onStart}>
          <span style={{ color: '#22c55e', fontSize: '18px', fontWeight: 700 }}>&lt;/&gt;</span>
          <span style={{ fontWeight: 700, fontSize: '16px' }}>SDKCraft</span>
        </div>
        <button onClick={onStart} style={{ background: '#22c55e', color: '#000', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Try free</button>
      </nav>
      <section style={{ maxWidth: '760px', margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-1.5px' }}>Simple, transparent pricing</h1>
        <p style={{ color: '#888', fontSize: '18px', margin: 0 }}>Start free. Upgrade when you need more.</p>
      </section>
      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px 100px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '32px' }}>
          <div style={{ fontSize: '14px', color: '#888', marginBottom: '12px', fontWeight: 600 }}>FREE</div>
          <div style={{ fontSize: '48px', fontWeight: 800, marginBottom: '4px' }}>$0</div>
          <div style={{ color: '#555', fontSize: '14px', marginBottom: '32px' }}>Forever free</div>
          <button onClick={onStart} style={{ width: '100%', padding: '12px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginBottom: '32px', background: '#111', color: '#fff', border: '1px solid #333' }}>Get started free</button>
          {['5 SDK generations / month', '1 language per generation', 'TypeScript only', 'Code preview', 'GitHub Issues support'].map(f => (
            <div key={f} style={{ display: 'flex', gap: '10px', marginBottom: '12px', fontSize: '14px', color: '#aaa' }}>
              <span style={{ color: '#22c55e' }}>✓</span> {f}
            </div>
          ))}
        </div>
        <div style={{ background: '#0a0a0a', border: '1px solid #22c55e44', borderRadius: '16px', padding: '32px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#22c55e', color: '#000', fontSize: '12px', fontWeight: 700, padding: '4px 14px', borderRadius: '999px' }}>MOST POPULAR</div>
          <div style={{ fontSize: '14px', color: '#22c55e', marginBottom: '12px', fontWeight: 600 }}>PRO</div>
          <div style={{ fontSize: '48px', fontWeight: 800, marginBottom: '4px' }}>$9</div>
          <div style={{ color: '#555', fontSize: '14px', marginBottom: '32px' }}>per month</div>
          <button style={{ width: '100%', padding: '12px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: 'not-allowed', marginBottom: '32px', background: '#22c55e', color: '#000', border: 'none', opacity: 0.6 }}>Coming soon</button>
          {['Unlimited SDK generations', 'All 5 languages', 'SDK history and dashboard', 'Priority support', 'Early access to new languages'].map(f => (
            <div key={f} style={{ display: 'flex', gap: '10px', marginBottom: '12px', fontSize: '14px', color: '#aaa' }}>
              <span style={{ color: '#22c55e' }}>✓</span> {f}
            </div>
          ))}
        </div>
      </section>
      <footer style={{ borderTop: '1px solid #111', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', color: '#555', fontSize: '13px' }}>
        <span>SDKCraft</span>
        <a href='https://github.com/ihsanelashhab-web/api-to-sdk' target='_blank' rel='noreferrer' style={{ color: '#555', textDecoration: 'none' }}>GitHub</a>
      </footer>
    </div>
  );
}