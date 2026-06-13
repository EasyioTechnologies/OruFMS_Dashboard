import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oru FMS | Factory Management System",
  description: "The definitive factory management system for modern industrial operations.",
};

function Navbar() {
  return (
    <nav style={{ padding: '1.5rem 2rem', borderBottom: '2px solid var(--ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--canvas)' }}>
      <Link href="/" style={{ fontWeight: 900, fontFamily: 'var(--font-serif)', fontSize: '1.5rem', letterSpacing: '-0.02em', border: 'none' }}>
        Oru FMS
      </Link>
      <div style={{ display: 'flex', gap: '2rem', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase' }}>
        <Link href="/pricing" style={{ border: 'none' }}>Pricing</Link>
        <Link href="/contact" style={{ border: 'none' }}>Contact</Link>
        <Link href="/admin/login" style={{ border: 'none' }}>Admin</Link>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: '2px solid var(--ink)', padding: '4rem 0', backgroundColor: 'var(--paper)' }}>
      <div className="container grid grid-cols-2">
        <div>
          <div style={{ fontWeight: 900, fontFamily: 'var(--font-serif)', fontSize: '1.5rem', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Oru FMS
          </div>
          <p style={{ fontSize: '0.875rem' }}>© 2026 EasyioTechnologies. All rights reserved.</p>
        </div>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'flex-end', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase' }}>
          <Link href="/terms" style={{ border: 'none' }}>Terms</Link>
          <Link href="/privacy" style={{ border: 'none' }}>Privacy</Link>
          <Link href="/refunds" style={{ border: 'none' }}>Refunds</Link>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
