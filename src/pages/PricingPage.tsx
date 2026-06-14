import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function PricingPage() {
  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePlanSelect = async (plan: 'free' | 'paid') => {
    if (!user) {
      navigate('/register');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/user/tier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ accountType: plan })
      });
      const data = await res.json();
      if (res.ok) {
        updateUser(data.user);
        alert(`Successfully switched to the ${plan} plan!`);
      } else {
        alert('Failed to update subscription: ' + data.error);
      }
    } catch (err) {
      alert('Error updating subscription');
    } finally {
      setLoading(false);
    }
  };

  const isFree = user?.accountType === 'free';
  const isPaid = user?.accountType === 'paid';

  return (
    <div className="container" style={{ paddingBottom: '96px' }}>
      
      <div style={{ marginBottom: '64px', borderBottom: '8px solid var(--color-primary)', paddingBottom: '16px' }}>
        <h1 className="display-text" style={{ textTransform: 'uppercase' }}>Choose Your Power</h1>
        <p className="label-caps" style={{ color: 'var(--color-secondary)', marginTop: '8px' }}>Scale your industrial-grade marketing persona engine.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', marginBottom: '96px' }}>
        
        {/* Tier: Free */}
        <div className="card brutal-border brutal-shadow hover-bg-surface-bright" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '32px' }}>
            <span className="label-caps" style={{ color: 'var(--color-secondary)', display: 'block', marginBottom: '16px' }}>LEVEL 01</span>
            <h2 className="headline-text" style={{ textTransform: 'uppercase', marginBottom: '8px' }}>Free</h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span className="display-text">$0</span>
              <span className="label-caps" style={{ color: 'var(--color-secondary)' }}>/MO</span>
            </div>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px', borderTop: '1px solid var(--color-primary)', paddingTop: '24px' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>check_circle</span>
              <span>03. UPLOADS / MO</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>check_circle</span>
              <span>BASIC PERSONA GEN</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>check_circle</span>
              <span>STANDARD SUPPORT</span>
            </li>
          </ul>
          <button 
            className="btn-secondary" 
            style={{ marginTop: 'auto', width: '100%' }}
            onClick={() => handlePlanSelect('free')}
            disabled={loading || !!(user && isFree)}
          >
            {user ? (isFree ? 'Current Plan' : 'Downgrade to Free') : 'Get Started'}
          </button>
        </div>

        {/* Tier: Pro */}
        <div className="card brutal-border-heavy brutal-shadow" style={{ display: 'flex', flexDirection: 'column', position: 'relative', transform: 'scale(1.05)', zIndex: 10 }}>
          <div className="label-caps" style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', padding: '4px 16px' }}>
            Most Popular
          </div>
          <div style={{ marginBottom: '32px' }}>
            <span className="label-caps" style={{ color: 'var(--color-secondary)', display: 'block', marginBottom: '16px' }}>LEVEL 02</span>
            <h2 className="headline-text" style={{ textTransform: 'uppercase', marginBottom: '8px' }}>Pro</h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span className="display-text">$49</span>
              <span className="label-caps" style={{ color: 'var(--color-secondary)' }}>/MO</span>
            </div>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px', borderTop: '2px solid var(--color-primary)', paddingTop: '24px' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>check_circle</span>
              <span style={{ fontWeight: 700 }}>UNLIMITED UPLOADS</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>check_circle</span>
              <span>HIGH-FIDELITY PHOTOS</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>check_circle</span>
              <span>STRATEGIC NEXT MOVES</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>check_circle</span>
              <span>PRIORITY SUPPORT</span>
            </li>
          </ul>
          <button 
            className="btn-primary" 
            style={{ marginTop: 'auto', width: '100%' }}
            onClick={() => handlePlanSelect('paid')}
            disabled={loading || !!(user && isPaid)}
          >
            {user ? (isPaid ? 'Current Plan' : 'Upgrade to Pro') : 'Upgrade Now'}
          </button>
        </div>

        {/* Tier: Enterprise */}
        <div className="card brutal-border brutal-shadow hover-bg-surface-bright" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '32px' }}>
            <span className="label-caps" style={{ color: 'var(--color-secondary)', display: 'block', marginBottom: '16px' }}>LEVEL 03</span>
            <h2 className="headline-text" style={{ textTransform: 'uppercase', marginBottom: '8px' }}>Enterprise</h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span className="display-text">Custom</span>
            </div>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px', borderTop: '1px solid var(--color-primary)', paddingTop: '24px' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>check_circle</span>
              <span>FULL API ACCESS</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>check_circle</span>
              <span>CUSTOM MODEL TRAINING</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>check_circle</span>
              <span>DEDICATED ACCOUNT MGR</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>check_circle</span>
              <span>24/7 PRIORITY SUPPORT</span>
            </li>
          </ul>
          <button className="btn-secondary" style={{ marginTop: 'auto', width: '100%' }} onClick={() => alert('Contacting sales... (mocked)')}>Contact Sales</button>
        </div>

      </div>

      <section style={{ marginBottom: '96px' }}>
        <h3 className="label-caps" style={{ marginBottom: '32px' }}>Detailed Comparison</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-border">
            <thead>
              <tr style={{ borderBottom: '4px solid var(--color-primary)' }}>
                <th style={{ textAlign: 'left' }} className="label-caps">Feature</th>
                <th className="label-caps" style={{ backgroundColor: 'var(--color-surface-container-highest)' }}>Free</th>
                <th className="label-caps" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>Pro</th>
                <th className="label-caps" style={{ backgroundColor: 'var(--color-surface-container-highest)' }}>Enterprise</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: 'var(--color-background)' }}>
              <tr>
                <td className="label-caps" style={{ color: 'var(--color-secondary)' }}>Upload Limit</td>
                <td style={{ textAlign: 'center' }}>3 / Month</td>
                <td style={{ textAlign: 'center', fontWeight: 700 }}>Unlimited</td>
                <td style={{ textAlign: 'center' }}>Unlimited</td>
              </tr>
              <tr>
                <td className="label-caps" style={{ color: 'var(--color-secondary)' }}>Persona Fidelity</td>
                <td style={{ textAlign: 'center' }}>Standard</td>
                <td style={{ textAlign: 'center', fontWeight: 700 }}>Ultra-HD</td>
                <td style={{ textAlign: 'center' }}>Customizable</td>
              </tr>
              <tr>
                <td className="label-caps" style={{ color: 'var(--color-secondary)' }}>AI Strategy</td>
                <td style={{ textAlign: 'center' }}>-</td>
                <td style={{ textAlign: 'center' }}><span className="material-symbols-outlined">check</span></td>
                <td style={{ textAlign: 'center' }}><span className="material-symbols-outlined">check</span></td>
              </tr>
              <tr>
                <td className="label-caps" style={{ color: 'var(--color-secondary)' }}>Support</td>
                <td style={{ textAlign: 'center' }}>Standard</td>
                <td style={{ textAlign: 'center', fontWeight: 700 }}>Priority</td>
                <td style={{ textAlign: 'center' }}>24/7 Dedicated</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="card brutal-border brutal-shadow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap', padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="material-symbols-outlined display-text">hub</span>
          <div>
            <h4 className="headline-text" style={{ textTransform: 'uppercase' }}>Need a custom solution?</h4>
            <p style={{ color: 'var(--color-secondary)' }}>Our team can architect a bespoke marketing engine for high-volume needs.</p>
          </div>
        </div>
        <button className="btn-primary" onClick={() => alert('Contacting sales... (mocked)')}>Contact Sales</button>
      </div>
      
    </div>
  );
}
