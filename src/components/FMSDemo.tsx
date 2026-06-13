"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function FMSDemo() {
  const [isOptimized, setIsOptimized] = useState(false);

  // Simulation Metrics
  const [metrics, setMetrics] = useState({
    latency: 1450,
    packetLoss: 12,
    output: 64,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOptimized) {
      // Transition to optimized metrics
      interval = setInterval(() => {
        setMetrics(prev => ({
          latency: prev.latency > 15 ? prev.latency - Math.floor(prev.latency * 0.2) : 12,
          packetLoss: prev.packetLoss > 0.1 ? prev.packetLoss * 0.5 : 0,
          output: prev.output < 99 ? prev.output + 2 : 99.8,
        }));
      }, 200);
    } else {
      // Chaotic metrics
      interval = setInterval(() => {
        setMetrics({
          latency: 1200 + Math.random() * 500,
          packetLoss: 8 + Math.random() * 10,
          output: 50 + Math.random() * 15,
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isOptimized]);

  return (
    <div style={{ border: '2px solid var(--ink)', backgroundColor: 'var(--paper)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--ink)', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', margin: 0, textTransform: 'uppercase' }}>Live Floor Simulation</h3>
          <p style={{ fontSize: '0.875rem', opacity: 0.7, margin: 0 }}>Visualize the impact of centralizing factory data.</p>
        </div>
        <button 
          onClick={() => setIsOptimized(!isOptimized)}
          className={isOptimized ? "oru-btn" : "oru-btn oru-btn-outline"}
          style={{ width: '200px', backgroundColor: isOptimized ? 'var(--ink)' : 'transparent', color: isOptimized ? 'var(--paper)' : 'var(--ink)' }}
        >
          {isOptimized ? "SYSTEM OPTIMIZED" : "INITIALIZE ORU FMS"}
        </button>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-3" style={{ gap: '1rem', textAlign: 'center' }}>
        <div style={{ padding: '1rem', border: '1px solid var(--ink)', backgroundColor: 'var(--canvas)' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 800 }}>SYNC LATENCY</p>
          <p style={{ fontSize: '1.5rem', fontFamily: 'monospace', color: isOptimized ? 'var(--ink)' : '#d32f2f' }}>
            {metrics.latency.toFixed(0)} ms
          </p>
        </div>
        <div style={{ padding: '1rem', border: '1px solid var(--ink)', backgroundColor: 'var(--canvas)' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 800 }}>DATA INTEGRITY</p>
          <p style={{ fontSize: '1.5rem', fontFamily: 'monospace', color: isOptimized ? 'var(--ink)' : '#d32f2f' }}>
            {100 - metrics.packetLoss | 0}%
          </p>
        </div>
        <div style={{ padding: '1rem', border: '1px solid var(--ink)', backgroundColor: 'var(--canvas)' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 800 }}>OVERALL YIELD</p>
          <p style={{ fontSize: '1.5rem', fontFamily: 'monospace', color: isOptimized ? 'var(--ink)' : '#f57c00' }}>
            {metrics.output.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Assembly Line Visualization */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 800 }}>ASSEMBLY LINE SYNCHRONIZATION</p>
        
        {[1, 2, 3].map((line) => (
          <div key={line} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '60px', fontSize: '0.75rem', fontFamily: 'monospace' }}>LINE {line}</div>
            <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--canvas)', border: '1px solid var(--ink)', position: 'relative', overflow: 'hidden' }}>
              <motion.div 
                animate={{ 
                  x: ["-100%", "100%"],
                  backgroundColor: isOptimized ? 'var(--ink)' : (line % 2 === 0 ? '#d32f2f' : '#f57c00')
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: isOptimized ? 1.5 : 2 + Math.random(), 
                  ease: "linear",
                  delay: isOptimized ? 0 : Math.random() // Chaos vs Sync
                }}
                style={{ position: 'absolute', top: 0, bottom: 0, width: '40%' }}
              />
            </div>
            <div style={{ width: '80px', textAlign: 'right', fontSize: '0.75rem', fontFamily: 'monospace' }}>
              {isOptimized ? "SYNCED" : "DRIFTING"}
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}
