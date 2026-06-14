import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ArchivePage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchive = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/archive', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (err) {
        console.error('Failed to fetch archive', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArchive();
  }, []);

  return (
    <div className="container" style={{ paddingBottom: '96px' }}>
      <div style={{ marginBottom: '48px', borderBottom: '8px solid var(--color-primary)', paddingBottom: '16px' }}>
        <h1 className="display-text" style={{ textTransform: 'uppercase' }}>Insights Archive</h1>
        <p className="label-caps" style={{ color: 'var(--color-secondary)', marginTop: '8px' }}>Review past audience personas and strategic analyses.</p>
      </div>

      {loading ? (
        <div className="flex-center" style={{ minHeight: '200px' }}>Loading archive...</div>
      ) : jobs.length === 0 ? (
        <div className="card brutal-border" style={{ padding: '64px', textAlign: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--color-secondary)', marginBottom: '16px' }}>history</span>
          <h3 className="headline-text" style={{ textTransform: 'uppercase', marginBottom: '8px' }}>No Data Found</h3>
          <p style={{ color: 'var(--color-secondary)' }}>You haven't processed any videos yet.</p>
          <Link to="/">
            <button className="btn-primary" style={{ marginTop: '24px' }}>Upload Video</button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
          {jobs.map(job => (
            <Link to={`/insights?id=${job.id}`} key={job.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card brutal-border brutal-shadow hover-bg-surface-bright" style={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.2s' }}>
                <div style={{ marginBottom: '16px', borderBottom: '2px solid var(--color-primary)', paddingBottom: '8px' }}>
                  <span className="label-caps" style={{ color: 'var(--color-secondary)' }}>{new Date(job.createdAt).toLocaleDateString()}</span>
                  <h3 className="headline-text" style={{ textTransform: 'uppercase', marginTop: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {job.insights?.persona?.title || 'Unknown Persona'}
                  </h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-secondary)' }}>video_file</span>
                  <span style={{ color: 'var(--color-secondary)', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.filename}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
