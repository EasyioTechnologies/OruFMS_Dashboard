"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [targetVersion, setTargetVersion] = useState('');
  const [currentVersion, setCurrentVersion] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/admin/login');
      } else {
        setUser(currentUser);
        fetchData();
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchData = async () => {
    try {
      // Fetch Licenses
      const querySnapshot = await getDocs(collection(db, "licenses"));
      const lics: any[] = [];
      querySnapshot.forEach((doc) => {
        lics.push({ id: doc.id, ...doc.data() });
      });
      setLicenses(lics);

      // Fetch Version
      const versionDoc = await getDoc(doc(db, "app_settings", "version"));
      if (versionDoc.exists()) {
        setCurrentVersion(versionDoc.data().requiredMinimumVersion || '0.0.0');
        setTargetVersion(versionDoc.data().requiredMinimumVersion || '0.0.0');
      }
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "app_settings", "version"), {
        requiredMinimumVersion: targetVersion,
        changelog: "Mandatory system update deployed via Super Admin.",
        downloadUrl: "https://orufms.com/download"
      }, { merge: true });
      setCurrentVersion(targetVersion);
      alert("Version updated successfully. Clients will be forced to update.");
    } catch (err) {
      console.error(err);
      alert("Failed to update version.");
    }
  };

  const handleRevoke = async (licenseId: string) => {
    if (!confirm("Are you sure you want to revoke this license?")) return;
    try {
      await updateDoc(doc(db, "licenses", licenseId), {
        status: 'revoked'
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to revoke license.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading) return <div style={{ padding: '6rem', textAlign: 'center' }}>LOADING TERMINAL...</div>;

  const totalKeys = licenses.length;
  const singleKeys = licenses.filter(l => l.type === 'single_user').length;
  const multiKeys = licenses.filter(l => l.type === 'multi_user').length;
  const mockRevenue = (singleKeys * 499) + (multiKeys * 1999);

  return (
    <main className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem', borderBottom: '2px solid var(--ink)', paddingBottom: '1rem' }}>
        <h1 style={{ marginBottom: 0 }}>SUPER ADMIN TERMINAL</h1>
        <button onClick={handleLogout} className="oru-btn oru-btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>LOGOUT</button>
      </div>

      <div className="grid grid-cols-2" style={{ marginBottom: '4rem' }}>
        {/* Analytics */}
        <section style={{ border: '2px solid var(--ink)', padding: '2rem', backgroundColor: 'var(--ink)', color: 'var(--paper)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--paper)' }}>SYSTEM ANALYTICS</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 800, opacity: 0.7, marginBottom: '0.5rem' }}>TOTAL REVENUE</p>
              <p style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)' }}>${mockRevenue.toLocaleString()}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 800, opacity: 0.7, marginBottom: '0.5rem' }}>KEYS GENERATED</p>
              <p style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)' }}>{totalKeys}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 800, opacity: 0.7, marginBottom: '0.5rem' }}>SINGLE USER</p>
              <p style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)' }}>{singleKeys}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 800, opacity: 0.7, marginBottom: '0.5rem' }}>MULTI-USER</p>
              <p style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)' }}>{multiKeys}</p>
            </div>
          </div>
        </section>

        {/* Update Manager */}
        <section style={{ border: '2px solid var(--ink)', padding: '2rem', backgroundColor: 'var(--paper)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>UPDATE MANAGER</h2>
          <p style={{ marginBottom: '2rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Current Enforced Version: <strong>{currentVersion}</strong><br/>
            Updating this will force all connected Flutter clients below this version to update immediately.
          </p>
          <form onSubmit={handleUpdateVersion}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.875rem' }}>Target Version (e.g. 1.0.1)</label>
              <input 
                type="text" 
                value={targetVersion} 
                onChange={e => setTargetVersion(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="oru-btn" style={{ width: '100%' }}>PUSH UPDATE TO CLIENTS</button>
          </form>
        </section>
      </div>

      {/* License Manager */}
      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>LICENSE LEDGER</h2>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>License Key</th>
                <th>Type</th>
                <th>Status</th>
                <th>Bound Node(s)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map(lic => (
                <tr key={lic.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{lic.id}</td>
                  <td style={{ textTransform: 'uppercase', fontSize: '0.875rem' }}>{lic.type.replace('_', ' ')}</td>
                  <td>
                    <span style={{ 
                      display: 'inline-block', padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase',
                      backgroundColor: lic.status === 'active' ? '#e6ffe6' : lic.status === 'revoked' ? '#ffe6e6' : '#f0f0f0',
                      color: lic.status === 'active' ? '#006600' : lic.status === 'revoked' ? '#cc0000' : '#666666',
                      border: `1px solid ${lic.status === 'active' ? '#006600' : lic.status === 'revoked' ? '#cc0000' : '#666666'}`
                    }}>
                      {lic.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.875rem' }}>
                    {lic.type === 'single_user' ? (
                      lic.bound_device_id ? <span title={lic.bound_device_id}>1/1 Seat Occupied</span> : '0/1 Seat'
                    ) : (
                      <span title={lic.active_devices?.map((d:any)=>d.id).join(', ')}>
                        {(lic.active_devices || []).length} / {lic.max_users} Seats Occupied
                      </span>
                    )}
                  </td>
                  <td>
                    {lic.status !== 'revoked' && (
                      <button onClick={() => handleRevoke(lic.id)} className="oru-btn oru-btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
                        REVOKE
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {licenses.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>NO LICENSES FOUND</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
