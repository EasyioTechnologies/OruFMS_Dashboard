export default function Contact() {
  return (
    <main className="container" style={{ paddingTop: '6rem', paddingBottom: '6rem', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem' }}>CONTACT DISPATCH</h1>
      <p style={{ fontWeight: 600, opacity: 0.7, marginBottom: '4rem' }}>For Procurement and Critical Support.</p>

      <section style={{ border: '2px solid var(--ink)', padding: '3rem', backgroundColor: 'var(--paper)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--ink)', paddingBottom: '0.5rem' }}>COMMUNICATION CHANNELS</h2>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
          <li>
            <strong>SUPPORT SLA:</strong> Guaranteed 24-hour response for critical tier issues.
          </li>
          <li>
            <strong>EMAIL:</strong> support@easyiotechnologies.com
          </li>
          <li>
            <strong>REGISTRATION:</strong><br/>
            EasyioTechnologies HQ<br/>
            [PLACEHOLDER ADDRESS]<br/>
            [CITY, STATE, ZIP]
          </li>
        </ul>
      </section>
    </main>
  );
}
