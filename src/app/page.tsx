import Link from 'next/link';
import Checkout from '../components/Checkout';

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <header className="section" style={{ backgroundColor: 'var(--ink)', color: 'var(--paper)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <h1 style={{ maxWidth: '800px' }}>
            ELIMINATE BOTTLENECKS.
            <br />
            OPTIMIZE THE FLOOR.
          </h1>
          <p style={{ maxWidth: '600px', fontSize: '1.5rem', fontWeight: 400, opacity: 0.9, marginTop: '2rem' }}>
            Oru FMS is the definitive factory management system for modern industrial operations. Weave every thread of your production into a single, unified command center.
          </p>
        </div>
      </header>

      {/* Narrative Section */}
      <section className="section container">
        <div className="grid grid-cols-2" style={{ alignItems: 'center', gap: '4rem' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem' }}>The Anatomy of Scale</h2>
            <p>
              When a factory scales, systems break. Job cards get lost, inventory counts drift from reality, and machine schedules clash. The operational bottlenecks are silent profit killers.
            </p>
            <p>
              Oru FMS was architected to enforce rigid structure over chaos. It provides a node-locked, highly secure interface that binds directly to your hardware, ensuring data integrity and absolute control over the factory floor.
            </p>
          </div>
          <div style={{ border: '2px solid var(--ink)', padding: '4rem 2rem', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.1em', fontSize: '1rem', marginBottom: '2rem' }}>INDUSTRIAL SPECIFICATIONS</h3>
            <ul style={{ listStyle: 'none', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--ink)', paddingBottom: '0.5rem' }}>
                <strong>ARCHITECTURE</strong> <span>OFFLINE-FIRST</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--ink)', paddingBottom: '0.5rem' }}>
                <strong>SYNC</strong> <span>CONFLICT-FREE</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--ink)', paddingBottom: '0.5rem' }}>
                <strong>SECURITY</strong> <span>NODE-LOCKED</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--ink)', paddingBottom: '0.5rem' }}>
                <strong>DEPLOYMENT</strong> <span>ON-PREMISE / CLOUD</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Checkout Section */}
      <section className="section" style={{ backgroundColor: 'var(--canvas)' }}>
        <div className="container">
          <div className="grid grid-cols-2" style={{ gap: '4rem' }}>
            <div>
              <h2>Procure Your License</h2>
              <p>
                Deployment begins with secure authentication. Generate a cryptographically secure activation key here, and input it into your terminal to bind the software to your hardware.
              </p>
              <p>
                Our strict node-locking ensures that a Single User license remains bound to one machine. Multi-User licenses allow for dynamic revocation and seat transfers directly from the Admin Dashboard.
              </p>
            </div>
            <div>
              <Checkout />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
