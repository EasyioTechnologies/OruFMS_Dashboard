import Link from 'next/link';

export default function Pricing() {
  return (
    <main className="container" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
      <h1 style={{ marginBottom: '4rem', textAlign: 'center' }}>LICENSE PRICING</h1>
      
      <div className="grid grid-cols-2">
        {/* Single User */}
        <div style={{ border: '2px solid var(--ink)', padding: '3rem', backgroundColor: 'var(--paper)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>SINGLE USER NODE</h2>
          <p style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '2rem', fontFamily: 'var(--font-serif)' }}>$499 <span style={{ fontSize: '1rem', fontWeight: 600, fontFamily: 'var(--font-sans)', textTransform: 'uppercase' }}>/ LIFETIME</span></p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            <li style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--ink)' }}>1 Hardware Locked Seat</li>
            <li style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--ink)' }}>All Standard Modules</li>
            <li style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--ink)' }}>1 Year Free Updates</li>
            <li style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--ink)' }}>Standard Support SLA</li>
          </ul>
          <Link href="/" className="oru-btn" style={{ width: '100%', textAlign: 'center' }}>
            PROCURE KEY
          </Link>
        </div>

        {/* Multi User */}
        <div style={{ border: '2px solid var(--ink)', padding: '3rem', backgroundColor: 'var(--ink)', color: 'var(--paper)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>MULTI-USER CLUSTER</h2>
          <p style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '2rem', fontFamily: 'var(--font-serif)' }}>$1,999 <span style={{ fontSize: '1rem', fontWeight: 600, fontFamily: 'var(--font-sans)', textTransform: 'uppercase', color: 'var(--paper)', opacity: 0.8 }}>/ LIFETIME</span></p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            <li style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--paper)' }}>Up to 5 Floating Seats</li>
            <li style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--paper)' }}>Seat Revocation & Transfer</li>
            <li style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--paper)' }}>Priority Sync Channels</li>
            <li style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--paper)' }}>24/7 Priority Support SLA</li>
          </ul>
          <Link href="/" className="oru-btn" style={{ width: '100%', textAlign: 'center', backgroundColor: 'var(--paper)', color: 'var(--ink)' }}>
            PROCURE KEY
          </Link>
        </div>
      </div>
    </main>
  );
}
