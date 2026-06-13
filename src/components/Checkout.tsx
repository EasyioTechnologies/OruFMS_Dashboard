"use client";

import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [licenseType, setLicenseType] = useState('single_user');
  const [user, setUser] = useState<User | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to procure a key.");
      return;
    }
    if (loading) return;
    
    setLoading(true);
    
    // Simulate network delay for effect
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate a secure alphanumeric key
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newKey = '';
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) newKey += '-';
      newKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const maxUsers = licenseType === 'single_user' ? 1 : 5;
    const amount = licenseType === 'single_user' ? 499 : 1999;
    
    try {
      await setDoc(doc(db, 'licenses', newKey), {
        type: licenseType,
        max_users: maxUsers,
        status: 'inactive',
        created_at: serverTimestamp(),
        active_devices: [],
        bound_device_id: null,
        owner_uid: user.uid
      });

      // Write mock transaction
      const transactionId = `INV-${Date.now()}`;
      await setDoc(doc(db, 'transactions', transactionId), {
        owner_uid: user.uid,
        amount: amount,
        description: `${licenseType === 'single_user' ? 'Single User Node' : 'Multi-User Cluster'} License`,
        license_id: newKey,
        created_at: serverTimestamp()
      });

      setGeneratedKey(newKey);
    } catch (error) {
      console.error("Error generating key:", error);
      alert("Failed to generate key. See console.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ border: '2px solid var(--ink)', padding: '2rem', backgroundColor: 'var(--paper)', position: 'relative', overflow: 'hidden' }}>
      <h3 style={{ borderBottom: '2px solid var(--ink)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        SECURE PROCUREMENT GATEWAY
      </h3>
      
      <AnimatePresence mode="wait">
        {!generatedKey ? (
          <motion.form 
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleCheckout}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Select License Tier
              </label>
              <select 
                value={licenseType} 
                onChange={(e) => setLicenseType(e.target.value)}
                style={{ width: '100%', padding: '1rem', border: '2px solid var(--ink)', background: 'var(--canvas)', fontFamily: 'var(--font-sans)', fontSize: '1rem' }}
                disabled={loading}
              >
                <option value="single_user">SINGLE USER NODE - $499 (1 SEAT)</option>
                <option value="multi_user">MULTI-USER CLUSTER - $1999 (5 SEATS)</option>
              </select>
            </div>
            
            {user ? (
              <button 
                type="submit" 
                className="oru-btn" 
                style={{ width: '100%', position: 'relative', transition: 'all 0.2s' }} 
                disabled={loading}
              >
                {loading ? (
                  <motion.span 
                    animate={{ opacity: [0.5, 1, 0.5] }} 
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    AUTHORIZING TRANSACTION...
                  </motion.span>
                ) : (
                  'AUTHORIZE & GENERATE KEY'
                )}
              </button>
            ) : (
              <button type="button" className="oru-btn" style={{ width: '100%', opacity: 0.5, cursor: 'not-allowed' }} disabled>
                LOG IN TO PROCURE KEY
              </button>
            )}
          </motion.form>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2e7d32', fontWeight: 800, marginBottom: '1rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span>TRANSACTION SUCCESSFUL</span>
            </div>

            <div style={{ padding: '2rem', border: '2px solid var(--ink)', backgroundColor: 'var(--canvas)', marginBottom: '1.5rem', textAlign: 'center' }}>
              <p style={{ fontWeight: 800, fontSize: '0.875rem', marginBottom: '1rem', textTransform: 'uppercase', opacity: 0.7 }}>YOUR SECURE ACTIVATION KEY</p>
              <h2 style={{ fontFamily: 'monospace', letterSpacing: '2px', marginBottom: '1.5rem', fontSize: '1.75rem', wordBreak: 'break-all' }}>{generatedKey}</h2>
              
              <button 
                onClick={handleCopy} 
                style={{ backgroundColor: copied ? 'var(--ink)' : 'transparent', color: copied ? 'var(--paper)' : 'var(--ink)', border: '2px solid var(--ink)', padding: '0.5rem 1rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                {copied ? 'KEY COPIED!' : 'COPY TO CLIPBOARD'}
              </button>
            </div>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              This key has been safely vaulted in your account ledger. You can immediately bind it to an active hardware node via the Oru FMS client application.
            </p>
            <button onClick={() => setGeneratedKey(null)} className="oru-btn oru-btn-outline" style={{ width: '100%' }}>
              PROCURE ANOTHER NODE
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
