import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  const [role, setRole] = useState(null);

  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleLogout = () => {
    setRole(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={role ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />}
        />

        <Route
          path="/dashboard/*"
          element={
            role ? (
              <Layout role={role} onLogout={handleLogout}>
                <Routes>
                  <Route index element={role === 'admin' ? <AdminDashboard /> : <Dashboard role={role} />} />
                  <Route path="students" element={<StudentsPage />} />
                  <Route path="students/:id" element={<StudentProfilePage />} />
                  <Route path="staff" element={<StaffPage />} />
                  <Route path="workshops" element={<WorkshopsPage />} />
                  <Route path="attendance" element={<AttendanceCalendarPage />} />
                  <Route path="documents" element={<DocumentsPage />} />
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
  );
}

export default App;
