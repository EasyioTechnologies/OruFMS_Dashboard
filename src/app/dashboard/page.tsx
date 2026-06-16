"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import Checkout from '../../components/Checkout';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'tenants' | 'procurement' | 'billing'>('tenants');
  
  // Device Editing State (Nickname & PIN)
  const [editingDevice, setEditingDevice] = useState<{licenseId: string, deviceId: string | 'single', type: 'nickname' | 'pin'} | null>(null);
  const [tempValue, setTempValue] = useState('');

  // RBAC Editing State
  const [editingRbac, setEditingRbac] = useState<{licenseId: string, role: string} | null>(null);

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
      console.error("Error fetching tenants", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (uid: string) => {
    try {
      const q = query(collection(db, "transactions"), where("owner_uid", "==", uid));
      const querySnapshot = await getDocs(q);
      const trans: any[] = [];
      querySnapshot.forEach((doc) => {
        trans.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(trans.sort((a, b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0)));
    } catch (err) {
      console.error("Error fetching transactions", err);
    }
  };

  const handleRevokeSingle = async (licenseId: string) => {
    if (!confirm("Revoke this node? It will be permanently disconnected.")) return;
    try {
      await updateDoc(doc(db, "licenses", licenseId), {
        bound_device_id: null,
        device_info: null,
        device_nickname: null,
        device_pin: null,
        status: 'inactive'
      });
      fetchLicenses(user!.uid);
    } catch (err) {
      console.error(err);
      alert("Failed to revoke node.");
    }
  };

  const handleRevokeMulti = async (licenseId: string, deviceIdToRemove: string, currentDevices: any[]) => {
    if (!confirm("Revoke this node? It will be permanently disconnected.")) return;
    try {
      const updatedDevices = currentDevices.filter(d => d.id !== deviceIdToRemove);
      await updateDoc(doc(db, "licenses", licenseId), {
        active_devices: updatedDevices,
        status: updatedDevices.length === 0 ? 'inactive' : 'active'
      });
      fetchLicenses(user!.uid);
    } catch (err) {
      console.error(err);
      alert("Failed to revoke node.");
    }
  };

  const handleSaveDeviceDetails = async (lic: any) => {
    if (!editingDevice) return;
    
    try {
      const docRef = doc(db, "licenses", lic.id);
      
      if (lic.type === 'single_user') {
        if (editingDevice.type === 'nickname') {
          await updateDoc(docRef, { device_nickname: tempValue });
        } else {
          await updateDoc(docRef, { device_pin: tempValue });
        }
      } else {
        const updatedDevices = (lic.active_devices || []).map((d: any) => {
          if (d.id === editingDevice.deviceId) {
            return { ...d, [editingDevice.type]: tempValue };
          }
          return d;
        });
        await updateDoc(docRef, { active_devices: updatedDevices });
      }
      
      setEditingDevice(null);
      fetchLicenses(user!.uid);
    } catch (err) {
      console.error(err);
      alert("Failed to save device details.");
    }
  };

  const handleToggleRbac = async (lic: any, role: string, permission: string) => {
    try {
      const rbac = lic.rbac_controls || {};
      const rolePerms = rbac[role] || {};
      const currentVal = rolePerms[permission] || false;
      
      const newRbac = {
        ...rbac,
        [role]: {
          ...rolePerms,
          [permission]: !currentVal
        }
      };

      await updateDoc(doc(db, "licenses", lic.id), { rbac_controls: newRbac });
      fetchLicenses(user!.uid);
    } catch (err) {
      console.error(err);
      alert("Failed to update RBAC.");
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
            onClick={() => setActiveTab('tenants')}
            style={{ textAlign: 'left', padding: '1rem 2rem', background: activeTab === 'tenants' ? 'var(--ink)' : 'transparent', color: activeTab === 'tenants' ? 'var(--paper)' : 'var(--ink)', border: 'none', cursor: 'pointer', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.875rem' }}
          >
            My Tenants
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
          <button 
            onClick={() => signOut(auth)}
            style={{ textAlign: 'left', padding: '1rem 2rem', background: 'transparent', color: 'red', border: 'none', cursor: 'pointer', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.875rem', marginTop: 'auto' }}
          >
            Log Out
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <section style={{ flex: 1, padding: '4rem', backgroundColor: 'var(--canvas)', overflowY: 'auto' }}>
        
        {/* TENANTS VIEW */}
        {activeTab === 'tenants' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>Tenant Workspaces</h2>
              <button onClick={() => fetchLicenses(user!.uid)} className="oru-btn oru-btn-outline" style={{ padding: '0.5rem 1rem' }}>REFRESH</button>
            </div>

            {licenses.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center', border: '2px solid var(--ink)', backgroundColor: 'var(--paper)' }}>
                <p style={{ opacity: 0.7 }}>You do not own any tenant workspaces yet. Visit Procurement.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {licenses.map(lic => (
                  <div key={lic.id} style={{ border: '2px solid var(--ink)', backgroundColor: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>
                    
                    {/* Header */}
                    <div style={{ padding: '1.5rem', borderBottom: '2px solid var(--ink)', backgroundColor: 'var(--ink)', color: 'var(--paper)', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.7, marginBottom: '0.25rem' }}>TENANT ID</p>
                        <p style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>{lic.id}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.7, marginBottom: '0.25rem' }}>EXPIRY</p>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>
                          {lic.expiry_date ? new Date(lic.expiry_date).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex' }}>
                      {/* Left Column: Nodes & Telemetry */}
                      <div style={{ flex: 1, padding: '1.5rem', borderRight: '2px solid var(--ink)' }}>
                        <h4 style={{ fontWeight: 800, fontSize: '0.875rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Connected Nodes</h4>
                        
                        {lic.type === 'single_user' ? (
                          <div>
                            {lic.bound_device_id ? (
                              <div style={{ padding: '1rem', border: '1px solid var(--ink)', backgroundColor: 'var(--canvas)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                  <div>
                                    <strong style={{ fontSize: '0.875rem' }}>Device ID:</strong><br/>
                                    <span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{lic.bound_device_id}</span>
                                  </div>
                                  <button onClick={() => handleRevokeSingle(lic.id)} className="oru-btn oru-btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'red' }}>REVOKE</button>
                                </div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '1rem' }}>
                                  <strong>Telemetry OS/Model:</strong> {lic.device_info || 'Unknown'}
                                </div>
                                
                                {/* Nickname */}
                                <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <strong style={{ fontSize: '0.875rem' }}>Name:</strong>
                                  {editingDevice?.licenseId === lic.id && editingDevice.type === 'nickname' ? (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                      <input value={tempValue} onChange={e => setTempValue(e.target.value)} style={{ padding: '0.25rem' }} />
                                      <button onClick={() => handleSaveDeviceDetails(lic)} style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>SAVE</button>
                                      <button onClick={() => setEditingDevice(null)} style={{ fontSize: '0.75rem' }}>CANCEL</button>
                                    </div>
                                  ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                      <span>{lic.device_nickname || 'Unnamed'}</span>
                                      <button onClick={() => { setEditingDevice({ licenseId: lic.id, deviceId: 'single', type: 'nickname' }); setTempValue(lic.device_nickname || ''); }} style={{ fontSize: '0.75rem', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                                    </div>
                                  )}
                                </div>

                                {/* PIN */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <strong style={{ fontSize: '0.875rem' }}>Master PIN:</strong>
                                  {editingDevice?.licenseId === lic.id && editingDevice.type === 'pin' ? (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                      <input value={tempValue} onChange={e => setTempValue(e.target.value)} placeholder="e.g. 1234" style={{ padding: '0.25rem' }} />
                                      <button onClick={() => handleSaveDeviceDetails(lic)} style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>SAVE</button>
                                      <button onClick={() => setEditingDevice(null)} style={{ fontSize: '0.75rem' }}>CANCEL</button>
                                    </div>
                                  ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                      <span style={{ fontFamily: 'monospace' }}>{lic.device_pin ? '****' : 'Not Set'}</span>
                                      <button onClick={() => { setEditingDevice({ licenseId: lic.id, deviceId: 'single', type: 'pin' }); setTempValue(lic.device_pin || ''); }} style={{ fontSize: '0.75rem', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div style={{ padding: '1rem', border: '1px dashed var(--ink)', textAlign: 'center', fontSize: '0.875rem', opacity: 0.7 }}>
                                NO NODE CONNECTED (1 SEAT AVAILABLE)
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                              SEATS UTILIZED: {(lic.active_devices || []).length} / {lic.max_users}
                            </div>
                            {(lic.active_devices || []).map((device: any, index: number) => (
                              <div key={index} style={{ padding: '1rem', border: '1px solid var(--ink)', backgroundColor: 'var(--canvas)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                  <div>
                                    <strong style={{ fontSize: '0.875rem' }}>Device ID:</strong><br/>
                                    <span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{device.id}</span>
                                  </div>
                                  <button onClick={() => handleRevokeMulti(lic.id, device.id, lic.active_devices)} className="oru-btn oru-btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'red' }}>REVOKE</button>
                                </div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '1rem' }}>
                                  <strong>Telemetry OS/Model:</strong> {device.info || 'Unknown'}
                                </div>

                                {/* Nickname */}
                                <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <strong style={{ fontSize: '0.875rem' }}>Name:</strong>
                                  {editingDevice?.licenseId === lic.id && editingDevice?.deviceId === device.id && editingDevice.type === 'nickname' ? (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                      <input value={tempValue} onChange={e => setTempValue(e.target.value)} style={{ padding: '0.25rem' }} />
                                      <button onClick={() => handleSaveDeviceDetails(lic)} style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>SAVE</button>
                                      <button onClick={() => setEditingDevice(null)} style={{ fontSize: '0.75rem' }}>CANCEL</button>
                                    </div>
                                  ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                      <span>{device.nickname || 'Unnamed'}</span>
                                      <button onClick={() => { setEditingDevice({ licenseId: lic.id, deviceId: device.id, type: 'nickname' }); setTempValue(device.nickname || ''); }} style={{ fontSize: '0.75rem', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                                    </div>
                                  )}
                                </div>

                                {/* PIN */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <strong style={{ fontSize: '0.875rem' }}>Master PIN:</strong>
                                  {editingDevice?.licenseId === lic.id && editingDevice?.deviceId === device.id && editingDevice.type === 'pin' ? (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                      <input value={tempValue} onChange={e => setTempValue(e.target.value)} placeholder="e.g. 1234" style={{ padding: '0.25rem' }} />
                                      <button onClick={() => handleSaveDeviceDetails(lic)} style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>SAVE</button>
                                      <button onClick={() => setEditingDevice(null)} style={{ fontSize: '0.75rem' }}>CANCEL</button>
                                    </div>
                                  ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                      <span style={{ fontFamily: 'monospace' }}>{device.pin ? '****' : 'Not Set'}</span>
                                      <button onClick={() => { setEditingDevice({ licenseId: lic.id, deviceId: device.id, type: 'pin' }); setTempValue(device.pin || ''); }} style={{ fontSize: '0.75rem', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                            {(lic.active_devices || []).length === 0 && (
                              <div style={{ padding: '1rem', border: '1px dashed var(--ink)', textAlign: 'center', fontSize: '0.875rem', opacity: 0.7 }}>
                                NO NODES CONNECTED
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right Column: RBAC Controls */}
                      <div style={{ flex: 1, padding: '1.5rem' }}>
                        <h4 style={{ fontWeight: 800, fontSize: '0.875rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>RBAC Configurations</h4>
                        {Object.keys(lic.allowed_roles || {}).length === 0 ? (
                          <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>No roles purchased or found.</div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {Object.keys(lic.allowed_roles).map(role => (
                              <div key={role} style={{ padding: '1rem', border: '1px solid var(--ink)', backgroundColor: 'var(--canvas)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--ink)', paddingBottom: '0.5rem' }}>
                                  <h5 style={{ margin: 0, fontWeight: 800, fontSize: '1rem' }}>{role}</h5>
                                  <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{lic.allowed_roles[role]} Seat(s)</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                  {['Manage Orders', 'Manage Inventory', 'Manage HR', 'View Finance'].map(perm => {
                                    const isGranted = lic.rbac_controls?.[role]?.[perm] || false;
                                    return (
                                      <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                                        <input 
                                          type="checkbox" 
                                          checked={isGranted} 
                                          onChange={() => handleToggleRbac(lic, role, perm)}
                                          style={{ accentColor: 'var(--ink)' }}
                                        />
                                        {perm}
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
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
                    <th style={{ borderTop: 'none', borderRight: 'none' }}>Tenant ID</th>
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
                      <td style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 'bold' }}>
                        {txn.currency === 'INR' ? '₹' : '$'}{txn.amount.toLocaleString('en-IN')}
                      </td>
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
