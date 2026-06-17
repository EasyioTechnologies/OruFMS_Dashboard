import Link from 'next/link';

export const metadata = {
  title: 'About | Oru FMS',
  description: 'The story behind the #1 Industrial Management Operating System.',
};

export default function About() {
  return (
    <main style={{ backgroundColor: 'var(--canvas)', paddingBottom: '6rem' }}>
      {/* Hero */}
      <section style={{ backgroundColor: 'var(--ink)', color: 'var(--paper)', padding: '8rem 2rem' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', marginBottom: '1.5rem', lineHeight: 1.1 }}>COMMANDING THE FLOOR.</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, lineHeight: 1.6 }}>
            EasyioTechnologies was founded with a singular purpose: to replace fragile web-based apps with a rigid, impenetrable operating system built for heavy industry.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container grid grid-cols-2" style={{ alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, opacity: 0.6, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>OUR MISSION</div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>Engineering Order Out of Chaos</h2>
            <p style={{ fontSize: '1.125rem', opacity: 0.8, marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Most SaaS platforms are designed for tech startups. They rely on constant internet connectivity, modern browsers, and trusting users with access from anywhere.
            </p>
            <p style={{ fontSize: '1.125rem', opacity: 0.8, lineHeight: 1.6 }}>
              Oru FMS is different. We built an offline-first, node-locked architecture that thrives in environments where Wi-Fi drops, hardware is bolted to the floor, and security is non-negotiable.
            </p>
          </div>
          <div style={{ padding: '3rem', backgroundColor: 'var(--paper)', border: '2px solid var(--ink)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-1rem', right: '-1rem', width: '3rem', height: '3rem', backgroundColor: 'var(--ink)' }}></div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Built for the Factory Floor</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ fontWeight: 800 }}>01</span>
                <span><strong style={{ display: 'block' }}>Zero Cloud Dependency</strong> Operate normally during multi-day ISP outages.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ fontWeight: 800 }}>02</span>
                <span><strong style={{ display: 'block' }}>Hardware Bound</strong> Licenses tie directly to specific machine terminals.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ fontWeight: 800 }}>03</span>
                <span><strong style={{ display: 'block' }}>Instant Sync</strong> Millisecond data resolution when networks reconnect.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Team / Heritage */}
      <section className="section" style={{ borderBottom: 'none' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Heritage</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.125rem', opacity: 0.8 }}>
              Oru FMS was engineered by a coalition of manufacturing veterans and distributed systems architects.
            </p>
          </div>
          <div className="grid grid-cols-2" style={{ gap: '3rem' }}>
            <div style={{ padding: '2rem', border: '1px solid var(--ink)' }}>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 900 }}>Industrial DNA</h4>
              <p style={{ opacity: 0.8 }}>We spent years on assembly lines and warehouse floors understanding where commercial software fails. We built Oru FMS because we needed it.</p>
            </div>
            <div style={{ padding: '2rem', border: '1px solid var(--ink)' }}>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 900 }}>Cryptographic Security</h4>
              <p style={{ opacity: 0.8 }}>Led by cybersecurity experts, our node-locking and RBAC protocols ensure your proprietary blueprints and CAD files never leave authorized terminals.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
