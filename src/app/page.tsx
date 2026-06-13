"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import FMSDemo from '../components/FMSDemo';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Home() {
  return (
    <main>
      {/* Hero Section with Parallax Background */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '90vh', backgroundColor: 'var(--ink)', color: 'var(--paper)', display: 'flex', alignItems: 'center' }}>
        
        {/* Animated Abstract Background Image */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'url(/images/factory_bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
            mixBlendMode: 'luminosity'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '4rem 2rem' }}>
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            style={{ maxWidth: '900px' }}
          >
            <motion.div variants={fadeUp} style={{ display: 'inline-block', border: '1px solid var(--paper)', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2rem', letterSpacing: '0.1em' }}>
              The #1 Industrial Management Operating System
            </motion.div>

            <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1.1, marginBottom: '2rem' }}>
              ELIMINATE BOTTLENECKS.<br />
              COMMAND THE FLOOR.
            </motion.h1>

            <motion.p variants={fadeUp} style={{ fontSize: '1.25rem', fontWeight: 400, opacity: 0.9, marginBottom: '3rem', maxWidth: '600px', lineHeight: 1.6 }}>
              Join 500+ top-tier manufacturing facilities using Oru FMS to enforce rigid structure over chaos. Secure, node-locked, and offline-first architecture built for scale.
            </motion.p>

            <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <Link href="/signup" className="oru-btn" style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)' }}>
                PROCURE LICENSE TODAY
              </Link>
              <Link href="https://github.com/EasyioTechnologies/OruFMC/releases/download/v1.0.0/orufms_v1.0.0.msix" target="_blank" rel="noopener noreferrer" className="oru-btn oru-btn-outline" style={{ color: 'var(--paper)', borderColor: 'var(--paper)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                DOWNLOAD FOR WINDOWS
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust & Social Proof Bar */}
      <section style={{ borderBottom: '2px solid var(--ink)', padding: '2rem 0', backgroundColor: 'var(--canvas)' }}>
        <div className="container">
          <p style={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.6, marginBottom: '1.5rem', letterSpacing: '0.1em' }}>
            TRUSTED BY INDUSTRY LEADERS IN AUTOMATION
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', opacity: 0.8, fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 900 }}>
            <span>STEELCORP</span>
            <span>NEXUS ASSEMBLY</span>
            <span>AERO-MACHINING</span>
            <span>VANGUARD MOTORS</span>
          </div>
        </div>
      </section>

      {/* Bento Grid Architecture Section */}
      <section className="section" style={{ backgroundColor: 'var(--paper)' }}>
        <div className="container">
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>The Architecture of Scale</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.25rem', opacity: 0.8 }}>
              When a factory scales, systems break. Oru FMS enforces structure over chaos. Explore the core specifications that make our platform impenetrable.
            </p>
          </motion.div>

          <motion.div 
            className="bento-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            
            {/* Interactive Demo (Large Card) */}
            <motion.div variants={fadeUp} className="bento-card col-span-2 row-span-2" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '2rem', borderBottom: '2px solid var(--ink)', backgroundColor: 'var(--ink)', color: 'var(--paper)' }}>
                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Experience the Sync</h3>
                <p style={{ margin: 0, opacity: 0.8, fontSize: '0.875rem' }}>Interact with the live simulation to see FMS neutralize latency.</p>
              </div>
              <div style={{ backgroundColor: 'var(--canvas)', height: '100%' }}>
                <FMSDemo />
              </div>
            </motion.div>

            {/* Offline-First Spec (Small Card) */}
            <motion.div variants={fadeUp} className="bento-card">
              <div style={{ fontSize: '0.875rem', fontWeight: 800, opacity: 0.6, marginBottom: '0.5rem', textTransform: 'uppercase' }}>SPECIFICATION 01</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Offline-First Sync</h3>
              <p style={{ opacity: 0.8, fontSize: '0.875rem', flex: 1 }}>
                Local network caching ensures zero downtime. When the network returns, conflict-free sync protocols merge your local floor operations directly into the cloud ledger without data loss.
              </p>
            </motion.div>

            {/* Node-Locked Security Spec (Small Card) */}
            <motion.div variants={fadeUp} className="bento-card" style={{ backgroundColor: 'var(--ink)', color: 'var(--paper)' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, opacity: 0.6, marginBottom: '0.5rem', textTransform: 'uppercase' }}>SPECIFICATION 02</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Node-Locked Hash</h3>
              <p style={{ opacity: 0.8, fontSize: '0.875rem', flex: 1 }}>
                Every terminal is cryptographically bound to its physical device via a unique hardware ID hash. Remote authorization breaches are statistically and practically impossible.
              </p>
            </motion.div>

            {/* Case Study 1 (Medium Card) */}
            <motion.div variants={fadeUp} className="bento-card" style={{ borderStyle: 'dashed' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, opacity: 0.6, marginBottom: '1rem', textTransform: 'uppercase' }}>PRODUCTION IMPACT</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>Vanguard Motors</h3>
              <p style={{ opacity: 0.8, fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                A 14-hour fiber outage historically cost $200k/hr in downtime. Oru FMS's offline architecture saved Vanguard $2.8M in a single incident.
              </p>
              <div style={{ marginTop: 'auto', fontWeight: 800, fontSize: '1.5rem' }}>$2.8M SAVED</div>
            </motion.div>

            {/* Case Study 2 (Medium Card) */}
            <motion.div variants={fadeUp} className="bento-card" style={{ borderStyle: 'dashed' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, opacity: 0.6, marginBottom: '1rem', textTransform: 'uppercase' }}>PRODUCTION IMPACT</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>Nexus Assembly</h3>
              <p style={{ opacity: 0.8, fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Leveraged strict hardware node-locking to eliminate 100% of external breach vectors overnight.
              </p>
              <div style={{ marginTop: 'auto', fontWeight: 800, fontSize: '1.5rem' }}>0 DATA LEAKS</div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section" style={{ backgroundColor: 'var(--ink)', color: 'var(--paper)', textAlign: 'center' }}>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="container"
          style={{ maxWidth: '800px' }}
        >
          <motion.h2 variants={fadeUp} style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Ready to Take Control?</motion.h2>
          <motion.p variants={fadeUp} style={{ fontSize: '1.25rem', opacity: 0.8, marginBottom: '3rem' }}>
            Get instant access to the Oru FMS client dashboard and procure your first node license in under 60 seconds.
          </motion.p>
          <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" className="oru-btn" style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)', padding: '1.5rem 3rem', fontSize: '1.125rem' }}>
              CREATE CLIENT ACCOUNT
            </Link>
            <Link href="https://github.com/EasyioTechnologies/OruFMC/releases/download/v1.0.0/orufms_v1.0.0.msix" target="_blank" rel="noopener noreferrer" className="oru-btn oru-btn-outline" style={{ color: 'var(--paper)', borderColor: 'var(--paper)', padding: '1.5rem 3rem', fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              DOWNLOAD FOR WINDOWS
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
