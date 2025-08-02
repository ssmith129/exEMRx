import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import SmartCharting from './components/SmartCharting';
import ReferralForm from './components/ReferralForm';
import CaseNotes from './components/CaseNotes';
import PatientChart from './components/PatientChart';
import ReportsAnalytics from './components/ReportsAnalytics';
import Settings from './components/Settings';
import MessageCenter from './components/MessageCenter';
import Layout from './components/Layout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? 
                <LoginScreen onLogin={() => setIsAuthenticated(true)} /> : 
                <Navigate to="/dashboard" replace />
            } 
          />
          <Route
            path="/*"
            element={
              isAuthenticated ? (
                <Layout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/charting" element={<SmartCharting />} />
                    <Route path="/referrals" element={<ReferralForm />} />
                    <Route path="/notes" element={<CaseNotes />} />
                    <Route path="/patient/:id" element={<PatientChart patientId="1" onClose={() => window.history.back()} />} />
                    <Route path="/reports" element={<ReportsAnalytics />} />
                    <Route path="/messages" element={<MessageCenter />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;