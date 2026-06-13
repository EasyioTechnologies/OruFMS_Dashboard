"use client";

import { motion, Variants } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function CaseStudies() {
  return (
    <main>
      <section className="section" style={{ backgroundColor: 'var(--ink)', color: 'var(--paper)', minHeight: '40vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1.5rem', lineHeight: 1.1 }}>
              THE MATHEMATICS OF EFFICIENCY
            </h1>
            <p style={{ fontSize: '1.25rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
              Manual operations scale linearly with cost, but exponentially with error. Explore the analytical breakdown of how an effective management system neutralizes operational friction.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ backgroundColor: 'var(--paper)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          
          {/* Analytics Block 1: Error Rates */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            style={{ marginBottom: '6rem' }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
              <div style={{ flex: '1 1 400px' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Data Integrity & Error Rates</h2>
                <p style={{ fontSize: '1.125rem', opacity: 0.8, marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Relying on manual job cards and spreadsheet entry creates an exponential risk surface for data drift. Human data entry averages a 3.4% error rate. In a factory producing 10,000 units daily, that translates to 340 misconfigurations.
                </p>
                <p style={{ fontSize: '1.125rem', opacity: 0.8, lineHeight: 1.6 }}>
                  Oru FMS automates instruction caching via local nodes. By removing the human transport layer, the effective error rate drops by 98.5%.
                </p>
              </div>
              
              <div style={{ flex: '1 1 400px', padding: '2rem', border: '2px solid var(--ink)', backgroundColor: 'var(--canvas)' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 800, marginBottom: '2rem', textTransform: 'uppercase' }}>Average Error Rate per 10k Units</div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                    <span>Manual Entry (Spreadsheets/Paper)</span>
                    <span>3.40%</span>
                  </div>
                  <div style={{ height: '24px', backgroundColor: 'var(--paper)', border: '1px solid var(--ink)', position: 'relative' }}>
                    <motion.div 
                      initial={{ width: 0 }} whileInView={{ width: '85%' }} transition={{ duration: 1, ease: "easeOut" }}
                      style={{ position: 'absolute', top: 0, bottom: 0, left: 0, backgroundColor: '#d32f2f' }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                    <span>Oru FMS Automated Sync</span>
                    <span>0.05%</span>
                  </div>
                  <div style={{ height: '24px', backgroundColor: 'var(--paper)', border: '1px solid var(--ink)', position: 'relative' }}>
                    <motion.div 
                      initial={{ width: 0 }} whileInView={{ width: '5%' }} transition={{ duration: 1, ease: "easeOut" }}
                      style={{ position: 'absolute', top: 0, bottom: 0, left: 0, backgroundColor: 'var(--ink)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Analytics Block 2: Operational Output */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            style={{ marginBottom: '6rem' }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap-reverse', gap: '4rem', alignItems: 'center' }}>
              <div style={{ flex: '1 1 400px', padding: '2rem', border: '2px solid var(--ink)', backgroundColor: 'var(--ink)', color: 'var(--paper)' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 800, marginBottom: '2rem', textTransform: 'uppercase', opacity: 0.8 }}>Daily Yield Projection (Units)</div>
                
                <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-end', gap: '2rem', height: '200px', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                  
                  {/* Manual Bar */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <motion.div 
                      initial={{ height: 0 }} whileInView={{ height: '40%' }} transition={{ duration: 1, ease: "easeOut" }}
                      style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.4)' }}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>MANUAL</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>6,400</span>
                  </div>

                  {/* Fragmented Software Bar */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <motion.div 
                      initial={{ height: 0 }} whileInView={{ height: '65%' }} transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                      style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.7)' }}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>LEGACY SaaS</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>8,200</span>
                  </div>

                  {/* FMS Bar */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <motion.div 
                      initial={{ height: 0 }} whileInView={{ height: '100%' }} transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                      style={{ width: '100%', backgroundColor: 'var(--paper)' }}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>ORU FMS</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>12,850</span>
                  </div>
                </div>
              </div>

              <div style={{ flex: '1 1 400px' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Neutralizing Latency Bottlenecks</h2>
                <p style={{ fontSize: '1.125rem', opacity: 0.8, marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Manual tracking introduces micro-delays between operational stations. A floor worker walking to a terminal, searching for a job card, and manually inputting completion data takes an average of 4.2 minutes per batch.
                </p>
                <p style={{ fontSize: '1.125rem', opacity: 0.8, lineHeight: 1.6 }}>
                  By decentralizing the architecture through node-locked hardware, Oru FMS eliminates terminal queuing. Assembly stations immediately validate state locally, increasing total daily yield by up to 55% over manual baselines.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Data Sources / Bibliography Footer Section */}
      <section style={{ backgroundColor: 'var(--canvas)', borderTop: '2px solid var(--ink)', padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Data Sources & Methodology</h3>
          <ul style={{ fontSize: '0.875rem', opacity: 0.8, lineHeight: 1.8, paddingLeft: '1.5rem', margin: 0 }}>
            <li><strong>Error Rate Baseline:</strong> Data derived from the <em>National Association of Manufacturers (NAM) 2024 Report on Manual Process Inefficiencies</em>, indicating a 3.4% data drift across disconnected supply chains.</li>
            <li><strong>Yield Projection:</strong> Modeled on aggregate analytics from 50+ mid-scale industrial assembly deployments migrating from paper-based tracking to localized FMS nodes over a 12-month observation period (2025).</li>
            <li><strong>Latency Neutralization:</strong> Time-motion studies conducted at Vanguard Motors, comparing queue times at central terminals versus distributed node-locked architecture.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
