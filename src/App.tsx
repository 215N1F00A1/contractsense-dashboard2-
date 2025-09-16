import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Contracts from './pages/Contracts';
import ContractDetail from './pages/ContractDetail';
import Upload from './pages/Upload';
import Query from './pages/Query';
import Insights from './pages/Insights';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/contracts" element={<Contracts />} />
                      <Route path="/contracts/:id" element={<ContractDetail />} />
                      <Route path="/upload" element={<Upload />} />
                      <Route path="/query" element={<Query />} />
                      <Route path="/insights" element={<Insights />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;