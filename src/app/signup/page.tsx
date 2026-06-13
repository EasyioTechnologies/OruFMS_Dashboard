"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import Link from 'next/link';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ paddingTop: '8rem', paddingBottom: '8rem', maxWidth: '600px' }}>
      <div style={{ border: '2px solid var(--ink)', padding: '4rem 3rem', backgroundColor: 'var(--paper)' }}>
        <h1 style={{ marginBottom: '1rem', fontSize: '2rem', textAlign: 'center' }}>CLIENT REGISTRATION</h1>
        <p style={{ textAlign: 'center', marginBottom: '3rem', opacity: 0.7 }}>Create an account to manage your factory nodes.</p>

        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.875rem' }}>Email Address</label>
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

          <button type="submit" className="oru-btn" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'PROCESSING...' : 'REGISTER'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem' }}>
          Already registered? <Link href="/login" style={{ fontWeight: 800 }}>Log In Here</Link>
        </div>
      </div>
    </main>
  );
}
