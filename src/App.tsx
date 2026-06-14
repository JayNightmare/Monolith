import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import ProcessingPage from './pages/ProcessingPage';
import InsightsPage from './pages/InsightsPage';
import PricingPage from './pages/PricingPage';
import ArchivePage from './pages/ArchivePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="navbar">
        <div className="flex-center" style={{ gap: '16px' }}>
          <button aria-label="Open menu" className="md-hidden" style={{ display: 'none' /* handled by responsive css later if needed */ }}>
            <span className="material-symbols-outlined">menu</span>
          </button>
          <Link to="/" className="headline-text" style={{ fontWeight: 700, textDecoration: 'none', color: 'inherit' }}>MONOLITH</Link>
        </div>
        
        <nav className="nav-links">
          {user ? (
            <>
              <Link to="/new" className="nav-link">New Project</Link>
              <Link to="/archive" className="nav-link">Archive</Link>
              <Link to="/settings" className="nav-link">Settings</Link>
            </>
          ) : (
            <>
              <Link to="/pricing" className="nav-link">Pricing</Link>
            </>
          )}
        </nav>
        
        <div className="md-block">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>{user.displayName || user.email}</span>
              <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/login"><button className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Login</button></Link>
              <Link to="/register"><button className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Sign Up</button></Link>
            </div>
          )}
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Protected Routes */}
            <Route path="/new" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
            <Route path="/processing" element={<ProtectedRoute><ProcessingPage /></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />
            <Route path="/archive" element={<ProtectedRoute><ArchivePage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
