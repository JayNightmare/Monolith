import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { user, token, updateUser } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('http://localhost:3001/api/user/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email, displayName })
      });
      const data = await res.json();
      if (res.ok) {
        updateUser(data.user);
        setMessage('Profile updated successfully.');
      } else {
        setError(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      setError('An error occurred while updating profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h1>Settings</h1>
      
      <div className="card" style={{ marginTop: '2rem', padding: '2rem' }}>
        <h3>Profile Settings</h3>
        
        {message && <div style={{ color: 'green', margin: '1rem 0' }}>{message}</div>}
        {error && <div style={{ color: 'red', margin: '1rem 0' }}>{error}</div>}

        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Display Name</label>
            <input 
              type="text" 
              value={displayName} 
              onChange={e => setDisplayName(e.target.value)} 
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Subscription Plan</h4>
              <p style={{ margin: '0.5rem 0 0', color: '#6b7280' }}>
                You are currently on the <strong style={{ textTransform: 'capitalize', color: user.accountType === 'paid' ? '#10b981' : '#374151' }}>{user.accountType}</strong> plan.
              </p>
            </div>
            <Link to="/pricing">
              <button className="btn-secondary">Manage Subscription</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
