"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import Link from 'next/link';

export default function Signup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Step 1
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Woodworking');
  const [factorySize, setFactorySize] = useState('');

  // Step 3
  const [employeeCount, setEmployeeCount] = useState('1-10');
  const [orderVolume, setOrderVolume] = useState('10-50');
  const [painPoints, setPainPoints] = useState('');

  // Step 4
  const [adminName, setAdminName] = useState('');
  const [phone, setPhone] = useState('');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (step === 1 && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => setStep(prev => prev - 1);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save all analytics data
      await setDoc(doc(db, 'users', user.uid), {
        email,
        adminName,
        phone,
        companyName,
        industry,
        factorySize,
        employeeCount,
        orderVolume,
        painPoints,
        created_at: serverTimestamp(),
      });

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ paddingTop: '6rem', paddingBottom: '6rem', maxWidth: '700px' }}>
      <div style={{ border: '2px solid var(--ink)', padding: '3rem', backgroundColor: 'var(--paper)' }}>
        <h1 style={{ marginBottom: '1rem', fontSize: '2rem', textAlign: 'center', textTransform: 'uppercase' }}>Client Registration</h1>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          {[1, 2, 3, 4].map(num => (
            <div key={num} style={{ flex: 1, height: '4px', backgroundColor: num <= step ? 'var(--ink)' : 'var(--canvas)', margin: '0 4px' }} />
          ))}
        </div>

        <form onSubmit={step === 4 ? handleSignup : handleNext}>
          
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Step 1: Account Credentials</h2>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.875rem' }}>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--ink)' }} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.875rem' }}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--ink)' }} />
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.875rem' }}>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--ink)' }} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Step 2: Company Details</h2>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.875rem' }}>Company/Factory Name</label>
                <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} required style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--ink)' }} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.875rem' }}>Industry / Sector</label>
                <select value={industry} onChange={e => setIndustry(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--ink)', backgroundColor: 'var(--canvas)' }}>
                  <option value="Woodworking">Woodworking / Furniture</option>
                  <option value="Metalworking">Metalworking / Machining</option>
                  <option value="Textiles">Textiles / Garments</option>
                  <option value="Plastics">Plastics / Molding</option>
                  <option value="Electronics">Electronics Assembly</option>
                  <option value="3D Printing">3D Print Farm</option>
                  <option value="Generic">Other / Generic</option>
                </select>
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.875rem' }}>Factory Size (Sq. Ft) - Optional</label>
                <input type="text" value={factorySize} onChange={e => setFactorySize(e.target.value)} placeholder="e.g. 5000" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--ink)' }} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Step 3: Analytics & Scale</h2>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.875rem' }}>Current Number of Employees</label>
                <select value={employeeCount} onChange={e => setEmployeeCount(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--ink)', backgroundColor: 'var(--canvas)' }}>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="200+">200+</option>
                </select>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.875rem' }}>Estimated Monthly Order Volume</label>
                <select value={orderVolume} onChange={e => setOrderVolume(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--ink)', backgroundColor: 'var(--canvas)' }}>
                  <option value="1-10">1-10 Orders</option>
                  <option value="10-50">10-50 Orders</option>
                  <option value="50-200">50-200 Orders</option>
                  <option value="200+">200+ Orders</option>
                </select>
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.875rem' }}>Primary Pain Points / Reason for FMS Adoption</label>
                <textarea value={painPoints} onChange={e => setPainPoints(e.target.value)} rows={3} placeholder="e.g., Inventory tracking, order delays..." style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--ink)', fontFamily: 'var(--font-sans)' }} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Step 4: Contact & Verification</h2>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.875rem' }}>Admin / Owner Name</label>
                <input type="text" value={adminName} onChange={e => setAdminName(e.target.value)} required style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--ink)' }} />
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.875rem' }}>Phone Number</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--ink)' }} />
              </div>
            </div>
          )}

          {error && <p style={{ color: 'red', marginBottom: '1rem', fontWeight: 600 }}>{error}</p>}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            {step > 1 && (
              <button type="button" onClick={handleBack} className="oru-btn oru-btn-outline" style={{ flex: 1 }} disabled={loading}>
                BACK
              </button>
            )}
            <button type="submit" className="oru-btn" style={{ flex: 2 }} disabled={loading}>
              {step === 4 ? (loading ? 'PROCESSING...' : 'COMPLETE REGISTRATION') : 'NEXT'}
            </button>
          </div>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem' }}>
          Already registered? <Link href="/login" style={{ fontWeight: 800 }}>Log In Here</Link>
        </div>
      </div>
    </main>
  );
}
