export default function Privacy() {
  return (
    <main className="container" style={{ paddingTop: '6rem', paddingBottom: '6rem', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem' }}>PRIVACY POLICY</h1>
      <p style={{ fontWeight: 600, opacity: 0.7, marginBottom: '4rem' }}>Last Updated: October 2026</p>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--ink)', paddingBottom: '0.5rem' }}>1. FACTORY OPERATIONAL DATA</h2>
        <p>All operational data synchronized through the Oru FMS ecosystem is encrypted in transit and at rest within Firebase.</p>
        <p>EasyioTechnologies has strictly zero visibility into your BOMs, supplier data, client lists, or machine schedules. You maintain complete ownership of your industrial data.</p>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--ink)', paddingBottom: '0.5rem' }}>2. LICENSE TELEMETRY</h2>
        <p>To enforce node-locking and seat limits, we collect cryptographic hashes of hardware configurations (Motherboard IDs, CPU IDs). These hashes cannot be reverse-engineered to identify specific individuals and are used exclusively for license verification.</p>
      </section>
    </main>
  );
}
