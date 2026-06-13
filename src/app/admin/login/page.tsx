"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../lib/firebase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    }
  };

  return (
    <main className="container" style={{ paddingTop: '10rem', paddingBottom: '10rem', maxWidth: '600px' }}>
      <div style={{ border: '2px solid var(--ink)', padding: '4rem 3rem', backgroundColor: 'var(--paper)' }}>
        <h1 style={{ marginBottom: '1rem', fontSize: '2rem', textAlign: 'center' }}>SUPER ADMIN</h1>
        <p style={{ textAlign: 'center', marginBottom: '3rem', opacity: 0.7 }}>Secure Terminal Access</p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.875rem' }}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.875rem' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>

          {error && <p style={{ color: 'red', marginBottom: '1rem', fontWeight: 600 }}>{error}</p>}

          <button type="submit" className="oru-btn" style={{ width: '100%' }}>
            AUTHENTICATE
          </button>
        </form>
      </div>
    </main>
  );
}
