import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './components/NotificationSystem';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import SmartCharting from './components/SmartCharting';
import ReferralForm from './components/ReferralForm';
import CaseNotes from './components/CaseNotes';
import PatientChart from './components/PatientChart';
import ReportsAnalytics from './components/ReportsAnalytics';
import Settings from './components/Settings';
import MessageCenter from './components/MessageCenter';
import Layout from './components/Layout';

// Root Route Component - redirects to dashboard
const RootRoute: React.FC = () => {
  return <Navigate to="/app/dashboard" replace />;
};

// Authentication context for managing login state
interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => boolean;
  logout: () => void;
  user: { name: string; email: string; role: string } | null;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication
    const authStatus = localStorage.getItem('ezEMRx_authenticated');
    const userData = localStorage.getItem('ezEMRx_user');
    
    if (authStatus === 'true' && userData) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ezEMRx...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <LandingPage />;
};

// Authentication Provider Component
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    // Check authentication status on app load
    const authStatus = localStorage.getItem('ezEMRx_authenticated');
    const userData = localStorage.getItem('ezEMRx_user');
    
    if (authStatus === 'true' && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = (credentials: { email: string; password: string }) => {
    // Simulate authentication - in real app, this would be an API call
    if (credentials.email && credentials.password) {
      const mockUser = {
        name: 'Dr. Sarah Chen',
        email: credentials.email,
        role: 'Primary Care Physician'
      };
      
      setIsAuthenticated(true);
      setUser(mockUser);
      localStorage.setItem('ezEMRx_authenticated', 'true');
      localStorage.setItem('ezEMRx_user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('ezEMRx_authenticated');
    localStorage.removeItem('ezEMRx_user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Root Route - Dashboard for authenticated users, Landing for guests */}
              <Route path="/" element={<RootRoute />} />
              
              {/* Protected App Routes - Wrapped in Layout */}
              <Route path="/app/*" element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="charting" element={<SmartCharting />} />
                      <Route path="referrals" element={<ReferralForm />} />
                      <Route path="notes" element={<CaseNotes />} />
                      <Route path="patient/:id" element={<PatientChart patientId="1" onClose={() => window.history.back()} />} />
                      <Route path="reports" element={<ReportsAnalytics />} />
                      <Route path="messages" element={<MessageCenter />} />
                      <Route path="settings" element={<Settings />} />
                     <Route path="compliance" element={<div className="p-6"><h1 className="text-2xl font-bold">Compliance Dashboard</h1><p>Compliance monitoring coming soon...</p></div>} />
                     <Route path="help" element={<div className="p-6"><h1 className="text-2xl font-bold">Help & Support</h1><p>Documentation and support resources coming soon...</p></div>} />
                     <Route path="appointments" element={<div className="p-6"><h1 className="text-2xl font-bold">Appointments</h1><p>Appointment scheduling coming soon...</p></div>} />
                      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Legacy redirects for backward compatibility */}
              <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
              <Route path="/charting" element={<Navigate to="/app/charting" replace />} />
              <Route path="/referrals" element={<Navigate to="/app/referrals" replace />} />
              <Route path="/notes" element={<Navigate to="/app/notes" replace />} />
              <Route path="/reports" element={<Navigate to="/app/reports" replace />} />
              <Route path="/messages" element={<Navigate to="/app/messages" replace />} />
              <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
              
              {/* Catch all route - redirect to landing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;