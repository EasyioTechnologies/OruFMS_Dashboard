import Link from 'next/link';

export const metadata = {
  title: 'Use Cases | Oru FMS',
  description: 'See how Oru FMS powers small shops to mega factories.',
};

export default function UseCases() {
  return (
    <main style={{ backgroundColor: 'var(--canvas)', paddingBottom: '0' }}>
      {/* Hero */}
      <section style={{ backgroundColor: 'var(--ink)', color: 'var(--paper)', padding: '8rem 2rem' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '900px' }}>
          <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', marginBottom: '1.5rem', lineHeight: 1.1 }}>BUILT FOR THE EXTREMES.</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, lineHeight: 1.6 }}>
            From high-security aerospace facilities to 5-person job shops looking to ditch the clipboards, Oru FMS adapts to your scale.
          </p>
        </div>
      </section>

      {/* Scenario 1: Small Scale */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, opacity: 0.6, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>SCENARIO 01</div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>Small-Scale Manufacturing & Job Shops</h2>
              <p style={{ opacity: 0.8, fontSize: '1.125rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Small shops often drown in paperwork, Excel sheets, and whiteboards. Oru FMS provides a single pane of glass without massive overhead.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <li style={{ paddingLeft: '1.5rem', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, top: '0.5rem', width: '0.5rem', height: '0.5rem', backgroundColor: 'var(--ink)' }}></span>
                  <strong>Eliminate Paper:</strong> Digital job cards and BOM tracking.
                </li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, top: '0.5rem', width: '0.5rem', height: '0.5rem', backgroundColor: 'var(--ink)' }}></span>
                  <strong>Cost Control:</strong> Track labor and material costs with exact precision.
                </li>
              </ul>
              <Link href="/pricing" className="oru-btn">VIEW SINGLE SEAT PRICING</Link>
            </div>
            <div style={{ flex: '1 1 400px', padding: '3rem', border: '2px solid var(--ink)', backgroundColor: 'var(--paper)' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>The Single Seat Advantage</h3>
              <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
                For just $799, a small shop can set up a central terminal on the floor. Workers clock in, check their jobs, update inventory, and clock out—all from one highly durable, offline-capable machine. No subscriptions, no per-user fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scenario 2: Intermittent Connectivity */}
      <section className="section" style={{ backgroundColor: 'var(--paper)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap-reverse', gap: '4rem', alignItems: 'center' }}>
            <div style={{ flex: '1 1 400px', padding: '3rem', border: '2px solid var(--ink)', backgroundColor: 'var(--canvas)' }}>
               <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>The Offline-First Guarantee</h3>
               <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
                 When the router goes down, production shouldn't stop. Terminals cache all scans and edits locally. Upon reconnection, our conflict-free resolution engine syncs the entire floor in milliseconds.
               </p>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, opacity: 0.6, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>SCENARIO 02</div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>Intermittent Connectivity Warehouses</h2>
              <p style={{ opacity: 0.8, fontSize: '1.125rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Deep inside concrete warehouses or remote facilities, Wi-Fi is rarely reliable. Cloud-only SaaS applications freeze and lose data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scenario 3: High-Security */}
      <section className="section" style={{ borderBottom: 'none' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, opacity: 0.6, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>SCENARIO 03</div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>High-Security & Complex Floors</h2>
              <p style={{ opacity: 0.8, fontSize: '1.125rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Defense contractors, aerospace facilities, and advanced machining floors cannot risk intellectual property leaks or unauthorized access.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <li style={{ paddingLeft: '1.5rem', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, top: '0.5rem', width: '0.5rem', height: '0.5rem', backgroundColor: 'var(--ink)' }}></span>
                  <strong>Node-Locked Terminals:</strong> Access is physically restricted to registered machine IDs.
                </li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, top: '0.5rem', width: '0.5rem', height: '0.5rem', backgroundColor: 'var(--ink)' }}></span>
                  <strong>Granular RBAC:</strong> Sub-node management allows 14+ distinct permission protocols.
                </li>
              </ul>
              <Link href="/pricing" className="oru-btn">VIEW MULTI-SEAT PRICING</Link>
            </div>
            <div style={{ flex: '1 1 400px', padding: '3rem', border: '2px solid var(--ink)', backgroundColor: 'var(--ink)', color: 'var(--paper)' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Total Control Architecture</h3>
              <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
                With the Multi-Seat Builder, administrators provision exact roles to specific terminals. An inventory terminal cannot access CAD files; a POS terminal cannot alter payroll. Security by rigid structure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 0', borderTop: '2px solid var(--ink)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Ready to optimize your floor?</h2>
        <Link href="/signup" className="oru-btn" style={{ padding: '1.5rem 3rem', fontSize: '1.125rem' }}>START YOUR 30-DAY FREE TRIAL</Link>
      </section>
    </main>
  );
}
