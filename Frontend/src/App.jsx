import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentsPage from './pages/StudentsPage';
import StudentProfilePage from './pages/StudentProfilePage';
import WorkshopsPage from './pages/WorkshopsPage';
import AttendanceCalendarPage from './pages/AttendanceCalendarPage';
import DocumentsPage from './pages/DocumentsPage';
import SettingsPage from './pages/SettingsPage';
import Dashboard from './pages/Dashboard';
import StaffPage from './pages/StaffPage';
import LandingPage from './pages/LandingPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AdminManagement from './pages/AdminManagement';
import PlanManagement from './pages/PlanManagement';
import RevenueTracking from './pages/RevenueTracking';
import SuperAdminSettings from './pages/SuperAdminSettings';
import RegisterAdmin from './pages/RegisterAdmin';

function App() {
  const [role, setRole] = useState(sessionStorage.getItem('userRole'));

  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    sessionStorage.setItem('userRole', selectedRole);
  };

  const handleLogout = () => {
    setRole(null);
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userAvatar');
    sessionStorage.removeItem('user');
  };

  return (
    <>
      <Toaster position="top-center" />
      <Router>
        <Routes>
          <Route
            path="/"
            element={<LandingPage />}
          />

          <Route
            path="/login"
            element={role ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />}
          />

          <Route
            path="/register"
            element={<RegisterAdmin />}
          />

          <Route
            path="/dashboard/*"
            element={
              role ? (
                <Layout role={role} onLogout={handleLogout}>
                  <Routes>
                    <Route index element={
                      role === 'super_admin' ? <SuperAdminDashboard /> : 
                      role === 'admin' ? <AdminDashboard /> : <Dashboard role={role} />
                    } />
                    <Route path="admin" element={<AdminManagement />} />
                    <Route path="plans" element={<PlanManagement />} />
                    <Route path="revenue" element={<RevenueTracking />} />
                    <Route path="settings" element={role === 'super_admin' ? <SuperAdminSettings /> : <SettingsPage role={role} />} />
                    <Route path="students" element={<StudentsPage role={role} />} />
                    <Route path="students/:id" element={<StudentProfilePage role={role} />} />
                    <Route path="staff" element={<StaffPage />} />
                    <Route path="workshops" element={<WorkshopsPage />} />
                    <Route path="attendance" element={<AttendanceCalendarPage />} />
                    <Route path="documents" element={<DocumentsPage role={role} />} />
                    <Route path="settings" element={<SettingsPage role={role} />} />
                  </Routes>
                </Layout>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
