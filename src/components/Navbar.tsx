"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const navLinkStyle = {
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    padding: '0 1rem',
    height: '100%',
  };

  return (
    <nav style={{ padding: '0 2rem', height: '5rem', borderBottom: '2px solid var(--ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', backgroundColor: 'var(--canvas)' }}>
      <Link href="/" style={{ fontWeight: 900, fontFamily: 'var(--font-serif)', fontSize: '1.5rem', letterSpacing: '-0.02em', border: 'none', display: 'flex', alignItems: 'center' }}>
        Oru FMS
      </Link>
      <div style={{ display: 'flex', gap: '0.5rem', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', alignItems: 'stretch' }}>
        <Link href="/about" style={navLinkStyle}>About</Link>
        <Link href="/use-cases" style={navLinkStyle}>Use Cases</Link>
        <Link href="/pricing" style={navLinkStyle}>Pricing</Link>
        <Link href="/contact" style={navLinkStyle}>Contact</Link>
        
        {user ? (
          <>
            <Link href="/dashboard" style={{ ...navLinkStyle, color: 'var(--paper)', backgroundColor: 'var(--ink)' }}>Dashboard</Link>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', padding: '0 1rem', display: 'flex', alignItems: 'center', height: '100%' }}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" style={navLinkStyle}>Login</Link>
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '0.5rem' }}>
              <Link href="/signup" style={{ border: '2px solid var(--ink)', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', height: 'auto' }}>Sign Up</Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
