import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oru FMS | Factory Management System",
  description: "The definitive factory management system for modern industrial operations.",
};

import Navbar from "../components/Navbar";
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
          <Link href="/case-studies" style={{ border: 'none' }}>Analytics & Case Studies</Link>
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
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0 }}>
        <Navbar />
        <div id="root-content-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
