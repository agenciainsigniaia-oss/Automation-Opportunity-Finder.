import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/ui/Layout';
import { Dashboard } from './components/Dashboard';
import { DiagnosticWizard } from './components/DiagnosticWizard';
import { ReportView } from './components/ReportView';
import { SettingsView } from './components/SettingsView';
import { PublicReportView } from './components/PublicReportView';
import { QuotesManager } from './components/QuotesManager';
import { ClientsManager } from './components/ClientsManager';
import { OfflineNotice } from './components/OfflineNotice';
import { AppProvider, useAppContext } from './AppContext';

// Auth imports
import { AuthProvider } from './components/auth/AuthProvider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { VerifyEmailPage } from './components/auth/VerifyEmailPage';

const AppRoutes = () => {
  const { analysisResult, setAnalysisResult, isDarkMode, toggleTheme } = useAppContext();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/share/:token" element={<PublicReportView />} />

      {/* Protected Routes */}
      <Route path="*" element={
        <ProtectedRoute>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/wizard" element={<DiagnosticWizard />} />
              <Route
                path="/report"
                element={
                  analysisResult ? <ReportView data={analysisResult} /> : <Navigate to="/" replace />
                }
              />
              <Route
                path="/settings"
                element={
                  <SettingsView isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                }
              />
              <Route path="/quotes" element={<QuotesManager />} />
              <Route path="/clients" element={<ClientsManager />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <OfflineNotice />
        </AuthProvider>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;