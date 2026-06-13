"use client";

import { useState } from 'react';
import { db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [licenseType, setLicenseType] = useState('single_user');
  
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Generate a secure alphanumeric key
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newKey = '';
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) newKey += '-';
      newKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const maxUsers = licenseType === 'single_user' ? 1 : 5;
    
    try {
      await setDoc(doc(db, 'licenses', newKey), {
        type: licenseType,
        max_users: maxUsers,
        status: 'inactive',
        created_at: serverTimestamp(),
        active_devices: [],
        bound_device_id: null
      });
      setGeneratedKey(newKey);
    } catch (error) {
      console.error("Error generating key:", error);
      alert("Failed to generate key. See console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '2px solid var(--ink)', padding: '2rem', backgroundColor: 'var(--paper)' }}>
      <h3 style={{ borderBottom: '2px solid var(--ink)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        SECURE ACTIVATION GATEWAY
      </h3>
      
      {!generatedKey ? (
        <form onSubmit={handleCheckout}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Select License Tier
            </label>
            <select 
              value={licenseType} 
              onChange={(e) => setLicenseType(e.target.value)}
              style={{ width: '100%', padding: '1rem', border: '2px solid var(--ink)', background: 'transparent' }}
            >
              <option value="single_user">SINGLE USER NODE (1 SEAT)</option>
              <option value="multi_user">MULTI-USER CLUSTER (5 SEATS)</option>
            </select>
          </div>
          
          <button type="submit" className="oru-btn" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'PROCESSING...' : 'MOCK CHECKOUT & GENERATE KEY'}
          </button>
        </form>
      ) : (
        <div>
          <div style={{ padding: '1.5rem', border: '2px solid var(--ink)', backgroundColor: 'var(--canvas)', marginBottom: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontWeight: 800, fontSize: '0.875rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>YOUR UNIQUE ACTIVATION KEY</p>
            <h2 style={{ fontFamily: 'var(--font-sans)', letterSpacing: '2px', marginBottom: 0 }}>{generatedKey}</h2>
          </div>
          <p style={{ fontSize: '0.875rem' }}>
            This key has been successfully written to the database. You can now use it in the Oru FMS Flutter application to lock it to a node.
          </p>
          <button onClick={() => setGeneratedKey(null)} className="oru-btn oru-btn-outline" style={{ width: '100%', marginTop: '1rem' }}>
            GENERATE ANOTHER
          </button>
        </div>
      )}
    </div>
  );
}
