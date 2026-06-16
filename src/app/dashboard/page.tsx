"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import Checkout from '../../components/Checkout';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [masterLicenses, setMasterLicenses] = useState<any[]>([]);
  const [subNodes, setSubNodes] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'tenants' | 'procurement' | 'billing'>('tenants');
  const [configLicenseId, setConfigLicenseId] = useState<string | null>(null);
  
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
      const masters: any[] = [];
      const subs: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        if (data.type === 'sub_node') subs.push(data);
        else masters.push(data);
      });
      setMasterLicenses(masters);
      setSubNodes(subs);
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

    // handleRevokeMulti is deprecated with sub-nodes

  const handleSaveDeviceDetails = async (lic: any) => {
    if (!editingDevice) return;
    
    if (editingDevice.type === 'pin') {
      if (!/^[a-zA-Z0-9]{6}$/.test(tempValue)) {
        alert("Node Password must be exactly 6 alphanumeric characters.");
        return;
      }
    }
    
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
              <h2 style={{ fontSize: '2rem', margin: 0 }}>
                {configLicenseId ? 'Workspace Configuration' : 'Tenant Workspaces'}
              </h2>
              <div>
                {configLicenseId && (
                  <button onClick={() => setConfigLicenseId(null)} className="oru-btn oru-btn-outline" style={{ padding: '0.5rem 1rem', marginRight: '1rem' }}>BACK TO LIST</button>
                )}
                <button onClick={() => fetchLicenses(user!.uid)} className="oru-btn oru-btn-outline" style={{ padding: '0.5rem 1rem' }}>REFRESH</button>
              </div>
            </div>

            {masterLicenses.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center', border: '2px solid var(--ink)', backgroundColor: 'var(--paper)' }}>
                <p style={{ opacity: 0.7 }}>You do not own any tenant workspaces yet. Visit Procurement.</p>
              </div>
            ) : configLicenseId ? (
              // DETAILED CONFIGURATION VIEW
              (() => {
                const lic = masterLicenses.find(l => l.id === configLicenseId);
                if (!lic) return <div>License not found.</div>;
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', backgroundColor: 'var(--paper)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
                  >
                    
                    {/* Header */}
                    <div style={{ padding: '2rem', background: 'linear-gradient(135deg, var(--ink) 0%, #333 100%)', color: 'var(--paper)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.7, marginBottom: '0.25rem', letterSpacing: '1px' }}>TENANT ID</p>
                        <p style={{ fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 'bold', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{lic.id}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.7, marginBottom: '0.25rem', letterSpacing: '1px' }}>EXPIRY</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4CAF50', boxShadow: '0 0 10px #4CAF50' }}></span>
                          <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.125rem' }}>
                            {lic.expiry_date ? new Date(lic.expiry_date).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {/* Left Column: Nodes & Telemetry */}
                      <div style={{ flex: '1 1 50%', padding: '2rem', borderRight: '1px solid rgba(0,0,0,0.05)', backgroundColor: 'var(--canvas)' }}>
                        <h4 style={{ fontWeight: 800, fontSize: '0.875rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--ink)' }}>
                          <span style={{ borderBottom: '2px solid var(--ink)', paddingBottom: '0.25rem' }}>Connected Nodes</span>
                        </h4>
                        
                        {lic.type === 'single_user' ? (
                          <motion.div layout>
                            {lic.bound_device_id ? (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{ padding: '1.5rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: 'var(--paper)', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                                  <div>
                                    <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.7 }}>Device ID</strong><br/>
                                    <span style={{ fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: 600 }}>{lic.bound_device_id}</span>
                                  </div>
                                  <button onClick={() => handleRevokeSingle(lic.id)} style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', color: '#d32f2f', backgroundColor: 'rgba(211,47,47,0.1)', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>REVOKE</button>
                                </div>
                                <div style={{ fontSize: '0.875rem', marginBottom: '1.5rem', padding: '0.75rem', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '4px' }}>
                                  <strong style={{ opacity: 0.7 }}>Telemetry:</strong> <span style={{ fontWeight: 500 }}>{lic.device_info || 'Unknown OS/Model'}</span>
                                </div>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                  {/* Nickname */}
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px dashed rgba(0,0,0,0.1)' }}>
                                    <strong style={{ fontSize: '0.875rem', opacity: 0.8 }}>Node Name</strong>
                                    {editingDevice?.licenseId === lic.id && editingDevice.type === 'nickname' ? (
                                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input value={tempValue} onChange={e => setTempValue(e.target.value)} style={{ padding: '0.25rem 0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} autoFocus />
                                        <button onClick={() => handleSaveDeviceDetails(lic)} style={{ fontSize: '0.75rem', fontWeight: 'bold', background: 'var(--ink)', color: 'white', border: 'none', borderRadius: '4px', padding: '0 0.5rem', cursor: 'pointer' }}>SAVE</button>
                                        <button onClick={() => setEditingDevice(null)} style={{ fontSize: '0.75rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>CANCEL</button>
                                      </div>
                                    ) : (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{ fontWeight: 600 }}>{lic.device_nickname || 'Unnamed Node'}</span>
                                        <button onClick={() => { setEditingDevice({ licenseId: lic.id, deviceId: 'single', type: 'nickname' }); setTempValue(lic.device_nickname || ''); }} style={{ fontSize: '0.75rem', color: 'var(--ink)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                                      </div>
                                    )}
                                  </div>

                                  {/* PIN */}
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <strong style={{ fontSize: '0.875rem', opacity: 0.8 }}>Node Password</strong>
                                    {editingDevice?.licenseId === lic.id && editingDevice.type === 'pin' ? (
                                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input value={tempValue} onChange={e => setTempValue(e.target.value.toUpperCase())} placeholder="e.g. A1B2C3" maxLength={6} style={{ padding: '0.25rem 0.5rem', border: '1px solid #ccc', borderRadius: '4px', textTransform: 'uppercase' }} autoFocus />
                                        <button onClick={() => handleSaveDeviceDetails(lic)} style={{ fontSize: '0.75rem', fontWeight: 'bold', background: 'var(--ink)', color: 'white', border: 'none', borderRadius: '4px', padding: '0 0.5rem', cursor: 'pointer' }}>SAVE</button>
                                        <button onClick={() => setEditingDevice(null)} style={{ fontSize: '0.75rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>CANCEL</button>
                                      </div>
                                    ) : (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', letterSpacing: '2px', color: lic.device_pin ? 'var(--ink)' : 'red' }}>{lic.device_pin ? '******' : 'NOT SET'}</span>
                                        <button onClick={() => { setEditingDevice({ licenseId: lic.id, deviceId: 'single', type: 'pin' }); setTempValue(lic.device_pin || ''); }} style={{ fontSize: '0.75rem', color: 'var(--ink)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ) : (
                              <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                style={{ padding: '2rem', border: '2px dashed rgba(0,0,0,0.1)', borderRadius: '8px', textAlign: 'center', backgroundColor: 'var(--paper)' }}
                              >
                                <div style={{ width: '48px', height: '48px', margin: '0 auto 1rem', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                                </div>
                                <p style={{ fontWeight: 600, opacity: 0.7, margin: 0 }}>WAITING FOR ACTIVATION</p>
                                <p style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.5rem' }}>Enter the Tenant ID on your hardware node to link it.</p>
                              </motion.div>
                            )}
                          </motion.div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {(() => {
                              const mySubs = subNodes.filter(sn => sn.parent_id === lic.id).sort((a,b) => a.role.localeCompare(b.role) || a.seat_index - b.seat_index);
                              const usedSeats = mySubs.filter(sn => sn.bound_device_id).length;
                              return (
                                <>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: '8px' }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600, opacity: 0.8 }}>WORKSPACE CAPACITY</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                      <div style={{ width: '100px', height: '8px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <motion.div 
                                          initial={{ width: 0 }} 
                                          animate={{ width: `${(usedSeats / lic.max_users) * 100}%` }} 
                                          style={{ height: '100%', backgroundColor: usedSeats === lic.max_users ? '#4CAF50' : 'var(--ink)' }}
                                        />
                                      </div>
                                      <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{usedSeats} <span style={{ opacity: 0.5, fontSize: '0.875rem' }}>/ {lic.max_users}</span></span>
                                    </div>
                                  </div>

                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <AnimatePresence>
                                      {mySubs.map((device: any, index: number) => (
                                        <motion.div 
                                          key={device.id}
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: index * 0.05 }}
                                          style={{ padding: '1.5rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: 'var(--paper)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}
                                        >
                                          {/* Role Badge Accent */}
                                          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: device.bound_device_id ? '#4CAF50' : '#ccc' }} />
                                          
                                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>
                                            <div>
                                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                <span style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--ink)', color: 'white', fontSize: '0.65rem', fontWeight: 'bold', borderRadius: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                                  {device.role}
                                                </span>
                                                <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>Seat {device.seat_index}</span>
                                              </div>
                                              <span style={{ fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: 600 }}>{device.id}</span>
                                            </div>
                                            {device.bound_device_id && (
                                              <button onClick={() => handleRevokeSingle(device.id)} style={{ padding: '0.5rem', fontSize: '0.75rem', color: '#d32f2f', backgroundColor: 'transparent', border: '1px solid rgba(211,47,47,0.3)', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>REVOKE</button>
                                            )}
                                          </div>
                                          
                                          <div style={{ paddingLeft: '0.5rem' }}>
                                            {device.bound_device_id ? (
                                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                <div style={{ fontSize: '0.875rem', padding: '0.5rem', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                                                  <span style={{ opacity: 0.7 }}>Telemetry:</span>
                                                  <span style={{ fontWeight: 500 }}>{device.device_info || 'Unknown'}</span>
                                                </div>

                                                {/* Nickname */}
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                  <strong style={{ fontSize: '0.875rem', opacity: 0.8 }}>Node Name</strong>
                                                  {editingDevice?.licenseId === device.id && editingDevice.type === 'nickname' ? (
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                      <input value={tempValue} onChange={e => setTempValue(e.target.value)} style={{ padding: '0.25rem 0.5rem', border: '1px solid #ccc', borderRadius: '4px', width: '120px' }} autoFocus />
                                                      <button onClick={() => handleSaveDeviceDetails({ id: device.id, type: 'single_user' })} style={{ fontSize: '0.75rem', fontWeight: 'bold', background: 'var(--ink)', color: 'white', border: 'none', borderRadius: '4px', padding: '0 0.5rem', cursor: 'pointer' }}>SAVE</button>
                                                      <button onClick={() => setEditingDevice(null)} style={{ fontSize: '0.75rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>X</button>
                                                    </div>
                                                  ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{device.device_nickname || 'Unnamed'}</span>
                                                      <button onClick={() => { setEditingDevice({ licenseId: device.id, deviceId: 'single', type: 'nickname' }); setTempValue(device.device_nickname || ''); }} style={{ fontSize: '0.75rem', color: 'var(--ink)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                                                    </div>
                                                  )}
                                                </div>

                                                {/* PIN */}
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                  <strong style={{ fontSize: '0.875rem', opacity: 0.8 }}>Node Password</strong>
                                                  {editingDevice?.licenseId === device.id && editingDevice.type === 'pin' ? (
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                      <input value={tempValue} onChange={e => setTempValue(e.target.value.toUpperCase())} placeholder="A1B2C3" maxLength={6} style={{ padding: '0.25rem 0.5rem', border: '1px solid #ccc', borderRadius: '4px', textTransform: 'uppercase', width: '80px' }} autoFocus />
                                                      <button onClick={() => handleSaveDeviceDetails({ id: device.id, type: 'single_user' })} style={{ fontSize: '0.75rem', fontWeight: 'bold', background: 'var(--ink)', color: 'white', border: 'none', borderRadius: '4px', padding: '0 0.5rem', cursor: 'pointer' }}>SAVE</button>
                                                      <button onClick={() => setEditingDevice(null)} style={{ fontSize: '0.75rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>X</button>
                                                    </div>
                                                  ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                      <span style={{ fontFamily: 'monospace', fontSize: '1rem', letterSpacing: '2px', color: device.device_pin ? 'var(--ink)' : 'red' }}>{device.device_pin ? '******' : 'NOT SET'}</span>
                                                      <button onClick={() => { setEditingDevice({ licenseId: device.id, deviceId: 'single', type: 'pin' }); setTempValue(device.device_pin || ''); }} style={{ fontSize: '0.75rem', color: 'var(--ink)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            ) : (
                                              <div style={{ padding: '1rem', border: '1px dashed rgba(0,0,0,0.1)', borderRadius: '4px', textAlign: 'center', fontSize: '0.75rem', opacity: 0.5, fontWeight: 600 }}>
                                                AWAITING DEVICE ACTIVATION
                                              </div>
                                            )}
                                          </div>
                                        </motion.div>
                                      ))}
                                    </AnimatePresence>
                                  </div>
                                  
                                  {mySubs.length === 0 && (
                                    <div style={{ padding: '2rem', border: '2px dashed rgba(0,0,0,0.1)', borderRadius: '8px', textAlign: 'center', opacity: 0.5 }}>
                                      No roles purchased.
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        )}
                      </div>

                      {/* Right Column: RBAC Controls */}
                      <div style={{ flex: '1 1 50%', padding: '2rem', backgroundColor: 'var(--paper)' }}>
                        <h4 style={{ fontWeight: 800, fontSize: '0.875rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--ink)' }}>
                          <span style={{ borderBottom: '2px solid var(--ink)', paddingBottom: '0.25rem' }}>RBAC Protocols</span>
                        </h4>
                        
                        {Object.keys(lic.allowed_roles || {}).length === 0 ? (
                          <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5, border: '1px dashed rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                            No roles defined for this workspace.
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {Object.keys(lic.allowed_roles).map((role, idx) => (
                              <motion.div 
                                key={role} 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                style={{ padding: '1.5rem', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', backgroundColor: 'var(--canvas)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.75rem' }}>
                                  <h5 style={{ margin: 0, fontWeight: 800, fontSize: '1.125rem' }}>{role}</h5>
                                  <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '12px', fontWeight: 600 }}>
                                    {lic.allowed_roles[role]} Seat(s)
                                  </span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                  {['Manage Orders', 'Manage Inventory', 'Manage HR', 'View Finance'].map(perm => {
                                    const isGranted = lic.rbac_controls?.[role]?.[perm] || false;
                                    return (
                                      <motion.label 
                                        key={perm} 
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{ 
                                          display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', cursor: 'pointer',
                                          padding: '0.75rem', borderRadius: '6px',
                                          backgroundColor: isGranted ? 'rgba(76, 175, 80, 0.1)' : 'rgba(0,0,0,0.02)',
                                          border: `1px solid ${isGranted ? 'rgba(76, 175, 80, 0.3)' : 'transparent'}`,
                                          transition: 'all 0.2s'
                                        }}
                                      >
                                        <div style={{ position: 'relative', width: '36px', height: '20px', borderRadius: '10px', backgroundColor: isGranted ? '#4CAF50' : '#ccc', transition: 'background-color 0.3s' }}>
                                          <div style={{ position: 'absolute', top: '2px', left: isGranted ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'white', transition: 'left 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                                        </div>
                                        {/* Hidden real checkbox */}
                                        <input 
                                          type="checkbox" 
                                          checked={isGranted} 
                                          onChange={() => handleToggleRbac(lic, role, perm)}
                                          style={{ display: 'none' }}
                                        />
                                        <span style={{ fontWeight: isGranted ? 600 : 400, opacity: isGranted ? 1 : 0.7 }}>{perm}</span>
                                      </motion.label>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })()
            ) : (
              // SUMMARY VIEW
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {masterLicenses.map(lic => (
                  <div key={lic.id} style={{ border: '2px solid var(--ink)', backgroundColor: 'var(--paper)', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.7, marginBottom: '0.25rem', textTransform: 'uppercase' }}>{(lic.tier || 'Tenant').replace('_', ' ')} WORKSPACE</p>
                    <p style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 1rem 0' }}>{lic.id}</p>
                    
                    <div style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                      <p style={{ margin: '0 0 0.5rem 0' }}><strong>Seats:</strong> {lic.type === 'single_user' ? (lic.bound_device_id ? 1 : 0) : subNodes.filter(sn => sn.parent_id === lic.id && sn.bound_device_id).length} / {lic.max_users}</p>
                      <p style={{ margin: 0 }}><strong>Expiry:</strong> {lic.expiry_date ? new Date(lic.expiry_date).toLocaleDateString() : 'N/A'}</p>
                    </div>

                    <button 
                      onClick={() => setConfigLicenseId(lic.id)}
                      className="oru-btn" 
                      style={{ marginTop: 'auto', width: '100%', padding: '0.5rem' }}
                    >
                      CONFIGURE
                    </button>
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
            <Checkout onSuccess={() => { setActiveTab('tenants'); fetchLicenses(user!.uid); }} />
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
