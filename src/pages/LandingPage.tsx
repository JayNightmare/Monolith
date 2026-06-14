import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartProject = () => {
    if (user) {
      navigate('/new');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="landing-page" style={{ display: 'flex', flexDirection: 'column', gap: '96px', paddingBottom: '96px' }}>
      
      {/* Hero Section */}
      <section className="container" style={{ paddingTop: '48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
          <div>
            <h1 className="display-text animate-slide-up" style={{ textTransform: 'uppercase', marginBottom: '24px', fontWeight: 900 }}>
              Transform Video Into Actionable Personas.
            </h1>
            <p className="headline-text animate-slide-up delay-100" style={{ color: 'var(--color-secondary)', marginBottom: '40px', fontSize: '24px' }}>
              Bridge the gap between creative content and strategic targeting with surgical precision.
            </p>
            <div className="animate-slide-up delay-200" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <button className="btn-primary brutal-shadow-hover" onClick={handleStartProject} style={{ padding: '16px 32px', fontSize: '18px' }}>
                START FREE PROJECT
              </button>
              <button className="btn-secondary" style={{ padding: '16px 32px', fontSize: '18px' }} onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                VIEW PROTOCOL FEATURES
              </button>
            </div>
          </div>
          
          <div className="animate-slide-up delay-300" style={{ position: 'relative' }}>
            <div className="card brutal-border brutal-shadow" style={{ padding: '16px', backgroundColor: '#fff', position: 'relative', zIndex: 2 }}>
              <img 
                alt="Monolith AI Analysis" 
                style={{ width: '100%', filter: 'grayscale(100%)', border: '2px solid var(--color-primary)', display: 'block' }} 
                src="https://lh3.googleusercontent.com/aida/AP1WRLv8hG_fJnILfcyhSS3p9n8twEqHJeeIGqZNk6lAJkPs29R2x-XKaPC-6_n-ImMfN-5iuxTPKPhu7DpNd55g-PcVEXxDZuNsw06GWGZsep_sClUyz5OnZyrx1LewqneSasrjYDDtk1gf6TjGgrtyOkphG3dc28EcPQeryZ74-K9o9iVchPG2A3_7zOXwci7i1d6lObUdoJytU73XI-HMzaYZ3eZyCGo3aPE8LjSNabhcOaDhmo99OQP1bQ" 
              />
            </div>
            {/* Decorative element */}
            <div className="brutal-border animate-pulse-slow" style={{ position: 'absolute', top: '-16px', right: '-16px', width: '96px', height: '96px', backgroundColor: 'var(--color-primary)', zIndex: 1 }}></div>
          </div>
        </div>
      </section>

      {/* The Process Section */}
      <section style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', padding: '96px 0' }}>
        <div className="container">
          <div style={{ marginBottom: '64px' }}>
            <span className="label-caps" style={{ opacity: 0.7 }}>The Process</span>
            <h2 className="headline-text" style={{ color: 'var(--color-on-primary)', marginTop: '8px', textTransform: 'uppercase' }}>
              Industrial-Grade Extraction
            </h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', border: '2px solid var(--color-on-primary)' }}>
            <div className="process-card hover-bg-on-primary animate-slide-up delay-100" style={{ padding: '40px', borderRight: '2px solid var(--color-on-primary)', borderBottom: '2px solid var(--color-on-primary)' }}>
              <span className="label-caps" style={{ fontSize: '36px', display: 'block', marginBottom: '24px' }}>01.</span>
              <h3 className="label-caps" style={{ fontSize: '20px', marginBottom: '16px', color: 'inherit' }}>INTELLIGENT INTAKE</h3>
              <p style={{ opacity: 0.8, lineHeight: 1.6 }}>Drop any video asset (MP4, MOV). Our proprietary engine scans every frame for semantic patterns and visual cues.</p>
            </div>
            
            <div className="process-card hover-bg-on-primary animate-slide-up delay-200" style={{ padding: '40px', borderRight: '2px solid var(--color-on-primary)', borderBottom: '2px solid var(--color-on-primary)' }}>
              <span className="label-caps" style={{ fontSize: '36px', display: 'block', marginBottom: '24px' }}>02.</span>
              <h3 className="label-caps" style={{ fontSize: '20px', marginBottom: '16px', color: 'inherit' }}>AI-DRIVEN ANALYSIS</h3>
              <p style={{ opacity: 0.8, lineHeight: 1.6 }}>Psychographic and demographic mapping powered by advanced computer vision. We identify who is watching and why.</p>
            </div>
            
            <div className="process-card hover-bg-on-primary animate-slide-up delay-300" style={{ padding: '40px', borderBottom: '2px solid var(--color-on-primary)' }}>
              <span className="label-caps" style={{ fontSize: '36px', display: 'block', marginBottom: '24px' }}>03.</span>
              <h3 className="label-caps" style={{ fontSize: '20px', marginBottom: '16px', color: 'inherit' }}>THE PERFECT PERSONA</h3>
              <p style={{ opacity: 0.8, lineHeight: 1.6 }}>Get a high-fidelity profile of your ideal audience member. Strategic insights delivered in raw, actionable data formats.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="container">
        <div style={{ marginBottom: '48px' }}>
          <span className="label-caps" style={{ color: 'var(--color-secondary)' }}>System Capabilities</span>
          <h2 className="headline-text" style={{ marginTop: '8px', textTransform: 'uppercase' }}>Core Protocol Features</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px' }}>
          {/* Feature 1 */}
          <div className="card brutal-shadow hover-bg-surface-bright" style={{ gridColumn: 'span 12', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="material-symbols-outlined" style={{ fontSize: '36px', marginBottom: '16px' }}>analytics</span>
              <h3 className="headline-text" style={{ marginBottom: '16px', textTransform: 'uppercase' }}>Audience Fit Engine</h3>
              <p style={{ color: 'var(--color-secondary)', maxWidth: '600px' }}>
                Real-time scoring against key market segments. Our engine runs 10,000 simulations per minute to determine precisely where your content hits the mark and where it falls short.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '32px' }}>
              <span className="label-caps brutal-border" style={{ padding: '4px 12px', fontSize: '10px' }}>REAL-TIME</span>
              <span className="label-caps brutal-border" style={{ padding: '4px 12px', fontSize: '10px' }}>NEURAL-NET</span>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="card brutal-shadow" style={{ gridColumn: 'span 12', backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', padding: '32px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '36px', marginBottom: '16px' }}>trending_up</span>
            <h3 className="label-caps" style={{ fontSize: '20px', marginBottom: '16px', color: 'var(--color-on-primary)' }}>STRATEGIC NEXT MOVES</h3>
            <p style={{ opacity: 0.8 }}>
              Actionable recommendations to optimize ad spend. No fluff—just cold, hard data on where to deploy your creative assets for maximum ROAS.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="card brutal-shadow" style={{ gridColumn: 'span 12', padding: '32px', transition: 'all 0.3s' }}>
            <div style={{ height: '160px', borderBottom: '2px solid var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '64px' }}>file_export</span>
            </div>
            <h3 className="label-caps" style={{ fontSize: '20px', marginBottom: '16px', textTransform: 'uppercase' }}>Export-Ready Insights</h3>
            <p style={{ color: 'var(--color-secondary)' }}>
              Professional reports for stakeholders. Clean, technical, and ready for the boardroom.
            </p>
          </div>
          
          {/* Feature 4 */}
          <div className="card brutal-shadow" style={{ gridColumn: 'span 12', padding: '32px', backgroundColor: 'var(--color-surface-container-high)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h3 className="headline-text" style={{ marginBottom: '8px', textTransform: 'uppercase' }}>Monolith API</h3>
              <p style={{ color: 'var(--color-secondary)', maxWidth: '400px', marginBottom: '24px' }}>Integrate persona generation directly into your internal marketing stack with our low-latency JSON API.</p>
              <code className="label-caps brutal-border" style={{ display: 'block', backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', padding: '16px', fontSize: '12px' }}>
                POST /v1/analyze {'{'} "source": "s3://assets/hero_v2.mp4" {'}'}
              </code>
            </div>
            <span className="material-symbols-outlined animate-spin-slow" style={{ position: 'absolute', bottom: '-40px', right: '-40px', fontSize: '200px', opacity: 0.05, zIndex: 1, pointerEvents: 'none' }}>code</span>
          </div>
        </div>
      </section>

      {/* Video Upload Zone */}
      <section className="container animate-slide-up delay-400">
        <div 
          onClick={handleStartProject}
          style={{ 
            border: '4px dashed var(--color-primary)', 
            padding: '64px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            textAlign: 'center',
            backgroundColor: '#fff',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          className="hover-bg-surface-bright"
        >
          <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>upload_file</span>
          </div>
          <h3 className="headline-text" style={{ textTransform: 'uppercase', marginBottom: '16px' }}>Initialize Analysis Engine</h3>
          <p style={{ color: 'var(--color-secondary)', marginBottom: '32px', maxWidth: '400px' }}>Drag and drop raw footage or select a file to begin processing. The system will automatically extract keyframes and generate marketing assets.</p>
          <button className="btn-primary brutal-shadow">
            SELECT FILE
          </button>
          <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-secondary)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>info</span>
            <span className="label-caps" style={{ fontSize: '10px' }}>ACCEPTED FORMATS: MP4, MOV, AVI (MAX 2GB)</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '2px solid var(--color-primary)', paddingTop: '48px', paddingBottom: '48px', marginTop: 'auto' }}>
        <div className="container flex-between" style={{ flexWrap: 'wrap', gap: '24px' }}>
          <div className="label-caps" style={{ fontWeight: 700 }}>MONOLITH AI</div>
          <div style={{ display: 'flex', gap: '32px' }}>
            <a href="#" className="label-caps" style={{ color: 'var(--color-secondary)', textDecoration: 'underline' }}>PRIVACY</a>
            <a href="#" className="label-caps" style={{ color: 'var(--color-secondary)' }}>TERMS</a>
            <a href="#" className="label-caps" style={{ color: 'var(--color-secondary)' }}>API</a>
            <a href="#" className="label-caps" style={{ color: 'var(--color-secondary)' }}>SUPPORT</a>
          </div>
          <div className="label-caps" style={{ fontSize: '10px', color: 'var(--color-secondary)' }}>© 2026 MONOLITH AI. ALL RIGHTS RESERVED.</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
