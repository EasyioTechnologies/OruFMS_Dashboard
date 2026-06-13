"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import Checkout from '../../components/Checkout';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'nodes' | 'procurement' | 'billing'>('nodes');
  
  // Nickname Editing State
  const [editingLicenseId, setEditingLicenseId] = useState<string | null>(null);
  const [tempNickname, setTempNickname] = useState('');

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
        fetchLicenses(currentUser.uid);
        fetchTransactions(currentUser.uid);
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

  const fetchTransactions = async (uid: string) => {
    try {
      const q = query(collection(db, "transactions"), where("owner_uid", "==", uid), orderBy("created_at", "desc"));
      const querySnapshot = await getDocs(q);
      const trans: any[] = [];
      querySnapshot.forEach((doc) => {
        trans.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(trans);
    } catch (err) {
      console.error("Error fetching transactions (If missing index, check console for link)", err);
      // Fallback without ordering if index is missing initially
      try {
        const qFallback = query(collection(db, "transactions"), where("owner_uid", "==", uid));
        const fbSnap = await getDocs(qFallback);
        const fbTrans: any[] = [];
        fbSnap.forEach((doc) => {
          fbTrans.push({ id: doc.id, ...doc.data() });
        });
        setTransactions(fbTrans.sort((a,b) => b.created_at?.seconds - a.created_at?.seconds));
      } catch (e) {
        console.error("Fallback error", e);
      }
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

  const handleSaveNickname = async (licenseId: string) => {
    try {
      await updateDoc(doc(db, "licenses", licenseId), {
        nickname: tempNickname
      });
      setEditingLicenseId(null);
      fetchLicenses(user!.uid);
    } catch (err) {
      console.error(err);
      alert("Failed to save nickname.");
    }
  };

  if (loading) return <div style={{ padding: '6rem', textAlign: 'center' }}>LOADING DASHBOARD...</div>;

  return (
    <main style={{ minHeight: '100vh', display: 'flex' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '250px', borderRight: '2px solid var(--ink)', backgroundColor: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '2rem', borderBottom: '2px solid var(--ink)' }}>
          <h1 style={{ fontSize: '1.25rem', marginBottom: 0 }}>DASHBOARD</h1>
          <p style={{ fontSize: '0.75rem', opacity: 0.7, wordBreak: 'break-all' }}>{user?.email}</p>
        </div>
        
        <nav style={{ flex: 1, padding: '2rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('nodes')}
            style={{ textAlign: 'left', padding: '1rem 2rem', background: activeTab === 'nodes' ? 'var(--ink)' : 'transparent', color: activeTab === 'nodes' ? 'var(--paper)' : 'var(--ink)', border: 'none', cursor: 'pointer', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.875rem' }}
          >
            My Nodes
          </button>
          <button 
            onClick={() => setActiveTab('procurement')}
            style={{ textAlign: 'left', padding: '1rem 2rem', background: activeTab === 'procurement' ? 'var(--ink)' : 'transparent', color: activeTab === 'procurement' ? 'var(--paper)' : 'var(--ink)', border: 'none', cursor: 'pointer', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.875rem' }}
          >
            Procurement
          </button>
          <button 
            onClick={() => setActiveTab('billing')}
            style={{ textAlign: 'left', padding: '1rem 2rem', background: activeTab === 'billing' ? 'var(--ink)' : 'transparent', color: activeTab === 'billing' ? 'var(--paper)' : 'var(--ink)', border: 'none', cursor: 'pointer', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.875rem' }}
          >
            Billing
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <section style={{ flex: 1, padding: '4rem', backgroundColor: 'var(--canvas)', overflowY: 'auto' }}>
        
        {/* NODES VIEW */}
        {activeTab === 'nodes' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>Hardware Nodes</h2>
              <button onClick={() => fetchLicenses(user!.uid)} className="oru-btn oru-btn-outline" style={{ padding: '0.5rem 1rem' }}>REFRESH</button>
            </div>

            {licenses.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center', border: '2px solid var(--ink)', backgroundColor: 'var(--paper)' }}>
                <p style={{ opacity: 0.7 }}>You do not own any licenses yet. Visit Procurement.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
                {licenses.map(lic => (
                  <div key={lic.id} style={{ border: '2px solid var(--ink)', backgroundColor: 'var(--paper)' }}>
                    
                    {/* License Header */}
                    <div style={{ padding: '1.5rem', borderBottom: '2px solid var(--ink)', backgroundColor: 'var(--ink)', color: 'var(--paper)' }}>
                      
                      {/* Nickname Editor */}
                      {editingLicenseId === lic.id ? (
                        <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                          <input 
                            value={tempNickname} 
                            onChange={(e) => setTempNickname(e.target.value)} 
                            placeholder="Nickname (e.g. Factory Floor A)"
                            style={{ padding: '0.5rem', flex: 1, color: 'var(--ink)' }}
                          />
                          <button onClick={() => handleSaveNickname(lic.id)} style={{ padding: '0.5rem', background: 'var(--paper)', color: 'var(--ink)', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>SAVE</button>
                          <button onClick={() => setEditingLicenseId(null)} style={{ padding: '0.5rem', background: 'transparent', color: 'var(--paper)', border: '1px solid var(--paper)', cursor: 'pointer' }}>X</button>
                        </div>
                      ) : (
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h3 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-sans)', textTransform: 'uppercase' }}>
                            {lic.nickname || 'UNNAMED LICENSE'}
                          </h3>
                          <button 
                            onClick={() => { setEditingLicenseId(lic.id); setTempNickname(lic.nickname || ''); }} 
                            style={{ background: 'transparent', border: 'none', color: 'var(--paper)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.75rem' }}
                          >
                            EDIT NAME
                          </button>
                        </div>
                      )}

                      <p style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.7, marginBottom: '0.25rem' }}>LICENSE KEY</p>
                      <p style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 'bold' }}>{lic.id}</p>
                      <p style={{ fontSize: '0.875rem', textTransform: 'uppercase', marginTop: '1rem' }}>
                        TYPE: {lic.type.replace('_', ' ')}
                      </p>
                    </div>

                    {/* Hardware Nodes List */}
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
          </div>
        )}

        {/* PROCUREMENT VIEW */}
        {activeTab === 'procurement' && (
          <div style={{ maxWidth: '800px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Procurement Center</h2>
            <Checkout />
          </div>
        )}

        {/* BILLING VIEW */}
        {activeTab === 'billing' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>Billing Ledger</h2>
              <button onClick={() => fetchTransactions(user!.uid)} className="oru-btn oru-btn-outline" style={{ padding: '0.5rem 1rem' }}>REFRESH</button>
            </div>

            <div style={{ overflowX: 'auto', backgroundColor: 'var(--paper)', border: '2px solid var(--ink)' }}>
              <table style={{ margin: 0, border: 'none' }}>
                <thead>
                  <tr>
                    <th style={{ borderTop: 'none', borderLeft: 'none' }}>Invoice ID</th>
                    <th style={{ borderTop: 'none' }}>Date</th>
                    <th style={{ borderTop: 'none' }}>Description</th>
                    <th style={{ borderTop: 'none' }}>Amount</th>
                    <th style={{ borderTop: 'none', borderRight: 'none' }}>License Key</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(txn => (
                    <tr key={txn.id}>
                      <td style={{ borderLeft: 'none', fontFamily: 'monospace', fontSize: '0.875rem' }}>{txn.id}</td>
                      <td style={{ fontSize: '0.875rem' }}>
                        {txn.created_at?.seconds ? new Date(txn.created_at.seconds * 1000).toLocaleDateString() : 'Just now'}
                      </td>
                      <td style={{ fontWeight: 600, fontSize: '0.875rem' }}>{txn.description}</td>
                      <td style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 'bold' }}>${txn.amount}</td>
                      <td style={{ borderRight: 'none', fontFamily: 'monospace', fontSize: '0.875rem' }}>{txn.license_id}</td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', opacity: 0.5, borderLeft: 'none', borderRight: 'none' }}>
                        NO TRANSACTIONS FOUND
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </section>
    </main>
  );
}
