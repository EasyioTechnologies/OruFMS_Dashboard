"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [licenses, setLicenses] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
        fetchLicenses(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchLicenses = async (uid: string) => {
    try {
      const q = query(collection(db, "licenses"), where("owner_uid", "==", uid));
      const querySnapshot = await getDocs(q);
      const lics: any[] = [];
      querySnapshot.forEach((doc) => {
        lics.push({ id: doc.id, ...doc.data() });
      });
      setLicenses(lics);
    } catch (err) {
      console.error("Error fetching licenses", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeSingle = async (licenseId: string) => {
    if (!confirm("Revoke this device? It will be permanently disconnected.")) return;
    try {
      await updateDoc(doc(db, "licenses", licenseId), {
        bound_device_id: null,
        status: 'inactive'
      });
      fetchLicenses(user!.uid);
    } catch (err) {
      console.error(err);
      alert("Failed to revoke device.");
    }
  };

  const handleRevokeMulti = async (licenseId: string, deviceIdToRemove: string, currentDevices: any[]) => {
    if (!confirm("Revoke this device? It will be permanently disconnected.")) return;
    try {
      const updatedDevices = currentDevices.filter(d => d.id !== deviceIdToRemove);
      await updateDoc(doc(db, "licenses", licenseId), {
        active_devices: updatedDevices,
        status: updatedDevices.length === 0 ? 'inactive' : 'active'
      });
      fetchLicenses(user!.uid);
    } catch (err) {
      console.error(err);
      alert("Failed to revoke device.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading) return <div style={{ padding: '6rem', textAlign: 'center' }}>LOADING DASHBOARD...</div>;

  return (
    <main className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem', borderBottom: '2px solid var(--ink)', paddingBottom: '1rem' }}>
        <h1 style={{ marginBottom: 0 }}>CLIENT DASHBOARD</h1>
        <button onClick={handleLogout} className="oru-btn oru-btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>LOGOUT</button>
      </div>

      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>MY LICENSES & HARDWARE NODES</h2>
        
        {licenses.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', border: '2px solid var(--ink)', backgroundColor: 'var(--paper)' }}>
            <p style={{ opacity: 0.7 }}>You do not own any licenses yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
            {licenses.map(lic => (
              <div key={lic.id} style={{ border: '2px solid var(--ink)', backgroundColor: 'var(--paper)' }}>
                {/* License Header */}
                <div style={{ padding: '1.5rem', borderBottom: '2px solid var(--ink)', backgroundColor: 'var(--ink)', color: 'var(--paper)' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.7, marginBottom: '0.5rem' }}>LICENSE KEY</p>
                  <p style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 'bold' }}>{lic.id}</p>
                  <p style={{ fontSize: '0.875rem', textTransform: 'uppercase', marginTop: '1rem' }}>
                    TYPE: {lic.type.replace('_', ' ')}
                  </p>
                </div>

                {/* Hardware Nodes */}
                <div style={{ padding: '1.5rem' }}>
                  <p style={{ fontWeight: 800, fontSize: '0.875rem', marginBottom: '1rem' }}>ACTIVE HARDWARE NODES</p>
                  
                  {lic.type === 'single_user' ? (
                    <div>
                      {lic.bound_device_id ? (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--ink)', backgroundColor: 'var(--canvas)' }}>
                          <div style={{ fontSize: '0.875rem' }}>
                            <strong>Device ID:</strong> <br/><span style={{ fontFamily: 'monospace', opacity: 0.8 }}>{lic.bound_device_id}</span>
                          </div>
                          <button onClick={() => handleRevokeSingle(lic.id)} className="oru-btn oru-btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'red' }}>REVOKE</button>
                        </div>
                      ) : (
                        <div style={{ padding: '1rem', border: '1px dashed var(--ink)', textAlign: 'center', fontSize: '0.875rem', opacity: 0.7 }}>
                          NO DEVICE BOUND (1 SEAT AVAILABLE)
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div style={{ marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>
                        SEATS UTILIZED: {(lic.active_devices || []).length} / {lic.max_users}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {(lic.active_devices || []).map((device: any, index: number) => (
                          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--ink)', backgroundColor: 'var(--canvas)' }}>
                            <div style={{ fontSize: '0.875rem' }}>
                              <strong>Device ID:</strong> <span style={{ fontFamily: 'monospace', opacity: 0.8 }}>{device.id}</span>
                            </div>
                            <button onClick={() => handleRevokeMulti(lic.id, device.id, lic.active_devices)} className="oru-btn oru-btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'red' }}>REVOKE</button>
                          </div>
                        ))}
                        {(lic.active_devices || []).length === 0 && (
                          <div style={{ padding: '1rem', border: '1px dashed var(--ink)', textAlign: 'center', fontSize: '0.875rem', opacity: 0.7 }}>
                            NO DEVICES CONNECTED
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
