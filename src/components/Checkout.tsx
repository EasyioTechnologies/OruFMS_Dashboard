"use client";

import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { doc, setDoc, serverTimestamp, getDocs, query, collection, where } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';

const ROLES = [
  'Manager', 'Floor Manager', 'Machine Ops', 
  'Inventory Manager', 'Procurement Manager', 
  'Finance', 'HR', 'Payroll'
];

const ROLE_SHORTCODES: {[key: string]: string} = {
  'Admin': 'ADM',
  'Manager': 'MGR',
  'Floor Manager': 'FLR',
  'Machine Ops': 'OPS',
  'Inventory Manager': 'INV',
  'Procurement Manager': 'PRC',
  'Finance': 'FIN',
  'HR': 'HRX',
  'Payroll': 'PRL'
};

const DEFAULT_RBAC: {[key: string]: any} = {
  'Admin': { 'pos': true, 'orders': true, 'tracking': true, 'client_tracking': true, 'machines': true, 'bom': true, 'labor': true, 'inventory': true, 'suppliers': true, 'employees': true, 'attendance': true, 'payroll': true, 'analytics': true, 'settings': true },
  'Manager': { 'pos': true, 'orders': true, 'tracking': true, 'client_tracking': true, 'machines': true, 'bom': true, 'labor': true, 'inventory': true, 'suppliers': true, 'employees': true, 'attendance': true, 'payroll': true, 'analytics': false, 'settings': false },
  'Floor Manager': { 'pos': false, 'orders': true, 'tracking': true, 'client_tracking': false, 'machines': true, 'bom': true, 'labor': true, 'inventory': false, 'suppliers': false, 'employees': false, 'attendance': false, 'payroll': false, 'analytics': false, 'settings': false },
  'Machine Ops': { 'pos': false, 'orders': false, 'tracking': true, 'client_tracking': false, 'machines': true, 'bom': false, 'labor': true, 'inventory': false, 'suppliers': false, 'employees': false, 'attendance': false, 'payroll': false, 'analytics': false, 'settings': false },
  'Inventory Manager': { 'pos': true, 'orders': false, 'tracking': false, 'client_tracking': false, 'machines': false, 'bom': false, 'labor': false, 'inventory': true, 'suppliers': true, 'employees': false, 'attendance': false, 'payroll': false, 'analytics': false, 'settings': false },
  'Procurement Manager': { 'pos': false, 'orders': true, 'tracking': false, 'client_tracking': false, 'machines': false, 'bom': true, 'labor': false, 'inventory': true, 'suppliers': true, 'employees': false, 'attendance': false, 'payroll': false, 'analytics': false, 'settings': false },
  'Finance': { 'pos': false, 'orders': false, 'tracking': false, 'client_tracking': false, 'machines': false, 'bom': true, 'labor': false, 'inventory': false, 'suppliers': false, 'employees': false, 'attendance': false, 'payroll': true, 'analytics': true, 'settings': true },
  'HR': { 'pos': false, 'orders': false, 'tracking': false, 'client_tracking': false, 'machines': false, 'bom': false, 'labor': false, 'inventory': false, 'suppliers': false, 'employees': true, 'attendance': true, 'payroll': true, 'analytics': false, 'settings': false },
  'Payroll': { 'pos': false, 'orders': false, 'tracking': false, 'client_tracking': false, 'machines': false, 'bom': false, 'labor': false, 'inventory': false, 'suppliers': false, 'employees': false, 'attendance': true, 'payroll': true, 'analytics': false, 'settings': false }
};

export default function Checkout({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [licenseType, setLicenseType] = useState('free_trial');
  const [user, setUser] = useState<User | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Multi-seat builder state
  const [additionalRoles, setAdditionalRoles] = useState<{[key: string]: number}>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleRoleCountChange = (role: string, change: number) => {
    setAdditionalRoles(prev => {
      const current = prev[role] || 0;
      const next = current + change;
      if (next < 0) return prev;
      return { ...prev, [role]: next };
    });
  };

  const calculateTotal = () => {
    if (licenseType === 'free_trial') return 0;
    if (licenseType === 'single_seat') return 65000;
    
    // Multi-seat: 65,000 for Admin + 5000 per extra role seat
    let total = 65000; 
    Object.values(additionalRoles).forEach(count => {
      total += count * 5000;
    });
    return total;
  };

  const calculateMaxUsers = () => {
    if (licenseType === 'free_trial') return 1;
    if (licenseType === 'single_seat') return 1;
    
    let total = 1; // Admin
    Object.values(additionalRoles).forEach(count => {
      total += count;
    });
    return total;
  };

  const calculateExpiry = () => {
    const date = new Date();
    if (licenseType === 'free_trial') {
      date.setDate(date.getDate() + 30); // 30 days
    } else {
      date.setFullYear(date.getFullYear() + 15); // 15 years
    }
    return date;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to procure a Tenant ID.");
      return;
    }
    if (loading) return;
    
    setLoading(true);

    if (licenseType === 'free_trial') {
      try {
        const q = query(collection(db, 'licenses'), where('owner_uid', '==', user.uid), where('tier', '==', 'free_trial'));
        const existing = await getDocs(q);
        if (!existing.empty) {
          alert("You have already claimed a free trial. You can only create one free trial Tenant ID per account.");
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Error checking for existing free trial", err);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 800));

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newKey = '';
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) newKey += '-';
      newKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const amount = calculateTotal();
    const expiryDate = calculateExpiry();
    const maxUsers = calculateMaxUsers();
    
    // Determine allowed roles and build RBAC
    let allowedRoles: {[key: string]: number} = { 'Admin': 1 };
    let initialRbac: {[key: string]: any} = { 'Admin': DEFAULT_RBAC['Admin'] };
    
    if (licenseType === 'multi_seat') {
      Object.entries(additionalRoles).forEach(([role, count]) => {
        if (count > 0) {
          allowedRoles[role] = count;
          initialRbac[role] = DEFAULT_RBAC[role] || {};
        }
      });
    }

    // Map UI tier to Flutter app's expected type
    let flutterType = 'single_user';
    if (licenseType === 'multi_seat') flutterType = 'multi_user';

    try {
      // Create Tenant / License document
      await setDoc(doc(db, 'licenses', newKey), {
        type: flutterType,
        tier: licenseType,
        max_users: maxUsers,
        status: 'inactive',
        created_at: serverTimestamp(),
        expiry_date: expiryDate.toISOString(),
        allowed_roles: allowedRoles,
        owner_uid: user.uid,
        rbac_controls: initialRbac
      });

      // Generate Sub-Licenses if multi_seat
      if (licenseType === 'multi_seat') {
        const subLicensePromises: Promise<void>[] = [];
        Object.entries(allowedRoles).forEach(([role, count]) => {
          for (let i = 0; i < count; i++) {
            const shortcode = ROLE_SHORTCODES[role] || 'SUB';
            let subKey = '';
            for (let j = 0; j < 16 - shortcode.length; j++) {
              if (j > 0 && j % 4 === 0) subKey += '-';
              subKey += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            subKey += shortcode;
            
            subLicensePromises.push(
              setDoc(doc(db, 'licenses', subKey), {
                type: 'sub_node',
                parent_id: newKey,
                role: role,
                seat_index: i + 1,
                status: 'inactive',
                bound_device_id: null,
                device_info: null,
                device_nickname: null,
                device_pin: null,
                owner_uid: user.uid,
                created_at: serverTimestamp()
              })
            );
          }
        });
        await Promise.all(subLicensePromises);
      }

      // Create an initialization doc for the tenant data scope
      await setDoc(doc(db, 'tenants', newKey), {
        created_at: serverTimestamp(),
        owner_uid: user.uid,
        status: 'active'
      });

      if (amount > 0) {
        const transactionId = `INV-${Date.now()}`;
        await setDoc(doc(db, 'transactions', transactionId), {
          owner_uid: user.uid,
          amount: amount,
          currency: 'INR',
          description: `Tenant Workspace License (${licenseType.replace('_', ' ').toUpperCase()})`,
          license_id: newKey,
          created_at: serverTimestamp()
        });
      }

      setGeneratedKey(newKey);
      if (onSuccess) {
        onSuccess();
      }
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
      <h3 style={{ borderBottom: '2px solid var(--ink)', paddingBottom: '1rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
        Tenant Workspace Procurement
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
                Select Licensing Tier
              </label>
              <select 
                value={licenseType} 
                onChange={(e) => setLicenseType(e.target.value)}
                style={{ width: '100%', padding: '1rem', border: '2px solid var(--ink)', background: 'var(--canvas)', fontFamily: 'var(--font-sans)', fontSize: '1rem' }}
                disabled={loading}
              >
                <option value="free_trial">FREE TRIAL (30 Days)</option>
                <option value="single_seat">SINGLE SEAT ADMIN - ₹65,000 INR (15 Years)</option>
                <option value="multi_seat">MULTI-SEAT BUILDER (Custom Roles, 15 Years)</option>
              </select>
            </div>

            {licenseType === 'multi_seat' && (
              <div style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px dashed var(--ink)', backgroundColor: 'var(--canvas)' }}>
                <p style={{ fontWeight: 800, marginBottom: '1rem', fontSize: '0.875rem' }}>BUILD YOUR WORKSPACE</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--ink)' }}>
                  <span>Admin Seat (Mandatory)</span>
                  <span style={{ fontWeight: 'bold' }}>₹65,000</span>
                </div>
                
                {ROLES.map(role => (
                  <div key={role} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem' }}>{role} (+₹5,000)</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button type="button" onClick={() => handleRoleCountChange(role, -1)} style={{ padding: '0.2rem 0.5rem', border: '1px solid var(--ink)' }}>-</button>
                      <span style={{ minWidth: '20px', textAlign: 'center', fontFamily: 'monospace' }}>{additionalRoles[role] || 0}</span>
                      <button type="button" onClick={() => handleRoleCountChange(role, 1)} style={{ padding: '0.2rem 0.5rem', border: '1px solid var(--ink)' }}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '2px solid var(--ink)', paddingTop: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.7, marginBottom: '0.25rem' }}>TOTAL AMOUNT</p>
                <h4 style={{ margin: 0, fontSize: '2rem', fontFamily: 'var(--font-serif)' }}>
                  ₹{calculateTotal().toLocaleString('en-IN')}
                </h4>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.7, marginBottom: '0.25rem' }}>VALIDITY</p>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{licenseType === 'free_trial' ? '30 Days' : '15 Years'}</p>
              </div>
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
                    AUTHORIZING PROCUREMENT...
                  </motion.span>
                ) : (
                  `AUTHORIZE & GENERATE TENANT ID`
                )}
              </button>
            ) : (
              <button type="button" className="oru-btn" style={{ width: '100%', opacity: 0.5, cursor: 'not-allowed' }} disabled>
                LOG IN TO PROCURE TENANT ID
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
              <span>PROCUREMENT SUCCESSFUL</span>
            </div>

            <div style={{ padding: '2rem', border: '2px solid var(--ink)', backgroundColor: 'var(--canvas)', marginBottom: '1.5rem', textAlign: 'center' }}>
              <p style={{ fontWeight: 800, fontSize: '0.875rem', marginBottom: '1rem', textTransform: 'uppercase', opacity: 0.7 }}>YOUR SECURE TENANT ID</p>
              <h2 style={{ fontFamily: 'monospace', letterSpacing: '2px', marginBottom: '1.5rem', fontSize: '1.75rem', wordBreak: 'break-all' }}>{generatedKey}</h2>
              
              <button 
                onClick={handleCopy} 
                style={{ backgroundColor: copied ? 'var(--ink)' : 'transparent', color: copied ? 'var(--paper)' : 'var(--ink)', border: '2px solid var(--ink)', padding: '0.5rem 1rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                {copied ? 'ID COPIED!' : 'COPY TO CLIPBOARD'}
              </button>
            </div>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              This Tenant ID has been safely vaulted in your account ledger. You can immediately bind it to active hardware nodes via the Oru FMS client application.
            </p>
            <button onClick={() => { setGeneratedKey(null); setLicenseType('free_trial'); setAdditionalRoles({}); }} className="oru-btn oru-btn-outline" style={{ width: '100%' }}>
              PROCURE ANOTHER WORKSPACE
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
