import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function InsightsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reportRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`monolith_insights_${data?.persona?.id || 'report'}.pdf`);
    } catch (err) {
      console.error('Failed to export PDF', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  useEffect(() => {
    const jobId = searchParams.get('id') || localStorage.getItem('monolith_job_id');
    if (!jobId) {
      navigate('/');
      return;
    }

    const fetchInsights = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/insights/${jobId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.status === 'completed') {
            setData(json.insights);
          } else {
            // If it's still processing, kick them back to processing
            navigate('/processing');
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [navigate]);

  if (loading || !data) {
    return <div className="container flex-center" style={{ minHeight: '100vh' }}>Loading...</div>;
  }

  const { persona, fit, strategy, recommendations } = data;

  return (
    <div className="container" style={{ paddingBottom: '48px' }} ref={reportRef}>
      <header style={{ marginBottom: '48px' }}>
        <h1 className="display-text" style={{ textTransform: 'uppercase', marginBottom: '8px' }}>Audience Insights</h1>
        <p style={{ color: 'var(--color-secondary)' }}>Data derived from cross-platform behavioral analysis.</p>
      </header>

      <div className="grid-2">
        {/* Left Section: Persona Profile */}
        <section className="flex-col">
          <h2 className="headline-text" style={{ textTransform: 'uppercase', marginBottom: '8px' }}>Target Persona</h2>
          <h3 className="label-caps" style={{ color: 'var(--color-secondary)', marginBottom: '16px' }}>{persona.title}</h3>
          
          <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', boxShadow: '4px 4px 0 0 var(--color-primary)' }}>
            <div style={{ width: '100%', aspectRatio: '1/1', borderBottom: '2px solid var(--color-primary)', overflow: 'hidden', position: 'relative', marginBottom: '16px', backgroundColor: 'var(--color-surface-container-highest)' }}>
              {data.personaImageUrl ? (
                <img src={data.personaImageUrl} alt={persona.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '64px', color: 'var(--color-outline)' }}>person</span>
                </div>
              )}
              <div className="label-caps" style={{ position: 'absolute', bottom: '8px', left: '8px', backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', padding: '4px 8px' }}>
                ID: {persona.id}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flexGrow: 1 }}>
              <div>
                <p className="label-caps" style={{ color: 'var(--color-secondary)', marginBottom: '4px' }}>Age Bracket</p>
                <p style={{ fontWeight: 700 }}>{persona.ageBracket}</p>
              </div>
              <div>
                <p className="label-caps" style={{ color: 'var(--color-secondary)', marginBottom: '4px' }}>Income LvL</p>
                <p style={{ fontWeight: 700 }}>{persona.incomeLevel}</p>
              </div>

              <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--color-primary)', paddingTop: '16px', marginTop: '8px' }}>
                <p className="label-caps" style={{ color: 'var(--color-secondary)', marginBottom: '8px' }}>Core Motivators</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {persona.motivators.map((mot: string, idx: number) => (
                    <span key={idx} className="label-caps" style={{ border: '1px solid var(--color-primary)', padding: '4px 12px' }}>{mot}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Section: Marketing Insights */}
        <section className="flex-col" style={{ gap: '32px' }}>
          
          {/* Audience Fit */}
          <div>
            <h2 className="headline-text" style={{ textTransform: 'uppercase', marginBottom: '16px', borderBottom: '2px solid var(--color-primary)', paddingBottom: '8px' }}>Audience Fit</h2>
            <div className="flex-col" style={{ gap: '16px' }}>
              {fit.map((item: any, idx: number) => (
                <div key={idx} className="card fit-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background-color 0.2s', padding: '16px' }}>
                  <span className="label-caps">{item.label}</span>
                  <div className="flex-center" style={{ gap: '16px' }}>
                    <div style={{ width: '128px', height: '8px', backgroundColor: 'var(--color-surface-container-highest)', border: '1px solid var(--color-primary)', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', backgroundColor: 'var(--color-primary)', width: `${item.percentage}%` }}></div>
                    </div>
                    <span style={{ fontSize: '24px', fontWeight: 700 }}>{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Next Moves */}
          <div>
            <h2 className="headline-text" style={{ textTransform: 'uppercase', marginBottom: '16px', borderBottom: '2px solid var(--color-primary)', paddingBottom: '8px' }}>Strategic Next Moves</h2>
            {strategy && strategy.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {strategy.map((move: any, idx: number) => (
                  <div key={idx} className="card" style={{ padding: '16px' }}>
                    <span className="material-symbols-outlined" style={{ marginBottom: '8px', fontSize: '24px' }}>{move.icon}</span>
                    <h4 className="label-caps" style={{ fontWeight: 700, marginBottom: '8px' }}>{move.title}</h4>
                    <p style={{ fontSize: '14px', color: 'var(--color-secondary)' }}>{move.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card brutal-border" style={{ padding: '32px', textAlign: 'center', backgroundColor: 'var(--color-surface-container-highest)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--color-secondary)', marginBottom: '16px' }}>lock</span>
                <h3 className="headline-text" style={{ textTransform: 'uppercase' }}>Pro Feature</h3>
                <p style={{ color: 'var(--color-secondary)', marginBottom: '16px', marginTop: '8px' }}>Upgrade to Pro to unlock Strategic Next Moves and Optimization Recommendations.</p>
                <button className="btn-primary" onClick={() => navigate('/pricing')}>Upgrade Now</button>
              </div>
            )}
          </div>

          {/* Optimization Recommendations */}
          {recommendations && recommendations.length > 0 && (
            <div>
              <h2 className="headline-text" style={{ textTransform: 'uppercase', marginBottom: '16px', borderBottom: '2px solid var(--color-primary)', paddingBottom: '8px' }}>Optimization Recs</h2>
              <ul style={{ listStyle: 'none' }} className="flex-col">
                {recommendations.map((rec: string, idx: number) => (
                  <li key={idx} style={{ borderBottom: '1px solid var(--color-primary)', padding: '12px 0', display: 'flex', gap: '16px' }}>
                    <span className="label-caps" style={{ color: 'var(--color-secondary)' }}>0{idx + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary" onClick={handleExportPDF}>Export Full Report (PDF)</button>
          </div>

        </section>
      </div>

      <style>{`
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        @media (min-width: 1024px) {
          .grid-2 {
            grid-template-columns: 1fr 1fr;
            gap: 48px;
          }
        }
        .fit-item:hover {
          background-color: var(--color-primary);
          color: var(--color-on-primary);
        }
        .fit-item:hover span {
          color: var(--color-on-primary) !important;
        }
        .fit-item:hover > div > div {
          border-color: var(--color-on-primary) !important;
        }
        .fit-item:hover > div > div > div {
          background-color: var(--color-on-primary) !important;
        }
      `}</style>
    </div>
  );
}
