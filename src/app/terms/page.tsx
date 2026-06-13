export default function Terms() {
  return (
    <main className="container" style={{ paddingTop: '6rem', paddingBottom: '6rem', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem' }}>TERMS OF SERVICE</h1>
      <p style={{ fontWeight: 600, opacity: 0.7, marginBottom: '4rem' }}>Last Updated: October 2026</p>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--ink)', paddingBottom: '0.5rem' }}>1. B2B LICENSING LIMITS</h2>
        <p>Oru FMS is provided exclusively for business-to-business (B2B) operational usage. Single-user licenses are strictly locked to the initial hardware node via cryptographic hash verification.</p>
        <p>Attempting to circumvent hardware locks or virtualization to bypass seat limits constitutes a material breach of this agreement.</p>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--ink)', paddingBottom: '0.5rem' }}>2. REVERSE ENGINEERING</h2>
        <p>You may not decompile, reverse engineer, disassemble, or attempt to derive the source code of the Flutter executable or the React Admin Dashboard under any circumstances.</p>
        <p>The compiled binaries are proprietary intellectual property of EasyioTechnologies.</p>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--ink)', paddingBottom: '0.5rem' }}>3. FAIR USE AND AVAILABILITY</h2>
        <p>While Oru FMS employs an offline-first architecture, the validation and synchronization infrastructure relies on Firebase. You agree not to intentionally abuse or DDOS the synchronization endpoints.</p>
      </section>
    </main>
  );
}
