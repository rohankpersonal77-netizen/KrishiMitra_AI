import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { OfflineProvider } from './context/OfflineContext';
import { FarmProvider } from './context/FarmContext';

import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Weather from './pages/Weather';
import DecisionSimulator from './pages/DecisionSimulator';
import Advisory from './pages/Advisory';
import RiskRadar from './pages/RiskRadar';
import FarmImpact from './pages/FarmImpact';
import CropProfile from './pages/CropProfile';
import History from './pages/History';
import Settings from './pages/Settings';

// Root redirect component
function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <OfflineProvider>
          <AuthProvider>
            <FarmProvider>
              <Routes>
                {/* Public Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<RootRedirect />} />

                {/* Protected Application Routes */}
                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/weather" element={<Weather />} />
                  <Route path="/decision-simulator" element={<DecisionSimulator />} />
                  <Route path="/advisory" element={<Advisory />} />
                  <Route path="/risk-radar" element={<RiskRadar />} />
                  <Route path="/farm-impact" element={<FarmImpact />} />
                  <Route path="/crop-profile" element={<CropProfile />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>

                {/* Catch-all fallback */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </FarmProvider>
          </AuthProvider>
        </OfflineProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
