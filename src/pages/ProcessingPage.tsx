import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProcessingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const jobId = localStorage.getItem('monolith_job_id');
    
    if (!jobId) {
      navigate('/');
      return;
    }

    const analyzeVideo = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/analyze/${jobId}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          // Polling isn't strictly necessary here since /api/analyze/:id in our mock backend waits to resolve
          // Wait actually, looking at our mock backend, it resolves immediately with status: 'processing'.
          // So we should poll /api/insights/:id until status === 'completed'.
          const checkStatus = async () => {
            const token = localStorage.getItem('token');
            const statusRes = await fetch(`/api/insights/${jobId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (statusRes.ok) {
              const data = await statusRes.json();
              if (data.status === 'completed') {
                navigate('/insights');
              } else if (data.status === 'failed') {
                alert('Analysis failed. Please try again.');
                navigate('/');
              } else {
                setTimeout(checkStatus, 1000);
              }
            }
          };
          setTimeout(checkStatus, 1000);
        }
      } catch (err) {
        console.error(err);
      }
    };

    analyzeVideo();
  }, [navigate]);
  return (
    <div className="container flex-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="flex-col" style={{ alignItems: 'center', textAlign: 'center', width: '100%', maxWidth: '800px' }}>
        
        {/* Mock 3D Animation Container using CSS */}
        <div style={{
          width: '256px',
          height: '256px',
          border: '2px solid var(--color-primary)',
          backgroundColor: 'var(--color-surface)',
          padding: '8px',
          marginBottom: '48px',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            inset: '8px',
            border: '1px solid var(--color-primary)',
            opacity: 0.2
          }}></div>
          <div className="flex-center" style={{ width: '100%', height: '100%' }}>
            <div 
              style={{
                width: '64px',
                height: '64px',
                border: '2px solid var(--color-primary)',
                animation: 'spin 4s linear infinite, pulse 2s ease-in-out infinite'
              }}
            ></div>
          </div>
        </div>

        <div className="flex-col" style={{ gap: '16px', alignItems: 'center' }}>
          <h2 className="headline-text" style={{ textTransform: 'uppercase', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
            Analyzing video frames...
          </h2>
          <p className="label-caps" style={{ color: 'var(--color-on-surface-variant)', letterSpacing: '0.2em' }}>
            Constructing target persona...
          </p>

          <div style={{
            width: '100%',
            maxWidth: '400px',
            height: '2px',
            backgroundColor: 'transparent',
            borderBottom: '2px solid var(--color-primary)',
            position: 'relative',
            marginTop: '32px',
            overflow: 'hidden'
          }}>
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                backgroundColor: 'var(--color-primary)',
                width: '33%',
                animation: 'loadingBar 2s infinite ease-in-out'
              }}
            ></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loadingBar {
          0% { transform: translateX(-100%); width: 33%; }
          50% { width: 50%; }
          100% { transform: translateX(300%); width: 33%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </div>
  );
}
