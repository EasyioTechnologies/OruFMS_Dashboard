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

  return (
    <nav style={{ padding: '1.5rem 2rem', borderBottom: '2px solid var(--ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--canvas)' }}>
      <Link href="/" style={{ fontWeight: 900, fontFamily: 'var(--font-serif)', fontSize: '1.5rem', letterSpacing: '-0.02em', border: 'none' }}>
        Oru FMS
      </Link>
      <div style={{ display: 'flex', gap: '2rem', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', alignItems: 'center' }}>
        <Link href="/pricing" style={{ border: 'none' }}>Pricing</Link>
        <Link href="/contact" style={{ border: 'none' }}>Contact</Link>
        
        {user ? (
          <>
            <Link href="/dashboard" style={{ border: 'none', color: 'var(--paper)', backgroundColor: 'var(--ink)', padding: '0.5rem 1rem' }}>Dashboard</Link>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', padding: 0 }}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ border: 'none' }}>Login</Link>
            <Link href="/signup" style={{ border: '2px solid var(--ink)', padding: '0.5rem 1rem' }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
