export default function Refunds() {
  return (
    <main className="container" style={{ paddingTop: '6rem', paddingBottom: '6rem', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem' }}>REFUND POLICY</h1>
      <p style={{ fontWeight: 600, opacity: 0.7, marginBottom: '4rem' }}>Last Updated: October 2026</p>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--ink)', paddingBottom: '0.5rem' }}>1. DIGITAL ACTIVATION KEYS</h2>
        <p>Because Oru FMS relies on cryptographically generated digital activation keys, all sales are final.</p>
        <p>Once an alphanumeric license key is generated and dispatched to your procurement email or written to the database, it cannot be refunded, reversed, or invalidated for a credit.</p>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--ink)', paddingBottom: '0.5rem' }}>2. DISPUTES</h2>
        <p>Chargebacks or payment disputes initiated after a key has been generated will result in the immediate and permanent revocation of all active licenses associated with the purchasing entity.</p>
      </section>
    </main>
  );
}
