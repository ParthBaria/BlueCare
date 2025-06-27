import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import DoctorDashboard from './pages/Dashboard/DoctorDashboard';
import PatientDashboard from './pages/Dashboard/PatientDashboard';
import { useAuthStore } from './store/authStore';
import MedicalHistory from './pages/Dashboard/MedicalHistory';
import Appointments from './pages/Dashboard/Appointments';
import Prescriptions from './pages/Dashboard/Prescriptions';
import Analytics from './pages/Dashboard/Analytics';
import UserList from './pages/Dashboard/UserList';
import Profile from './pages/Dashboard/Profile';
import AllDoctors from './pages/Dashboard/AllDoctors';
import DoctorProfile from './pages/Dashboard/DoctorProfile';
import Home from './pages/Dashboard/Home';

const App = () => {
  const { user, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={!user ? <Home /> : <Navigate to={`/${user.role}`} />} />
          <Route path="/login" element={!user ? <LoginForm /> : <Navigate to={`/${user.role}`} />} />
          <Route path="/register" element={!user ? <RegisterForm /> : <Navigate to={`/${user.role}`} />} />

          {user && <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            {/* Redirect root "/" to "/{user.role}" */}
            <Route index element={<Navigate to={`/${user?.role}`} replace />} />

            <Route path='/:role/profile' element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }></Route>
            {/* Admin Routes */}
            <Route path="admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserList />
              </ProtectedRoute>
            } />

            <Route path="admin/analytics" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Analytics />
              </ProtectedRoute>
            } />

            {/* Doctor Routes */}
            <Route path="doctor" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            } />
            <Route path="doctor/patients" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <UserList />
              </ProtectedRoute>
            } />
            <Route path="doctor/appointments" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <Appointments />
              </ProtectedRoute>
            } />
            <Route path="doctor/records" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <MedicalHistory />
              </ProtectedRoute>
            } />
            <Route path="doctor/prescriptions" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <Prescriptions />
              </ProtectedRoute>
            } />

            {/* Patient Routes */}
            <Route path="patient" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            } />
            <Route path="patient/history" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <MedicalHistory />
              </ProtectedRoute>
            } />
            <Route path="patient/appointments" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Appointments />
              </ProtectedRoute>
            } />
            <Route path="patient/medications" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Prescriptions />
              </ProtectedRoute>
            } />
            <Route path="patient/doctors" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <AllDoctors />
              </ProtectedRoute>
            } />
            <Route path="patient/doctors/:id" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <DoctorProfile />
              </ProtectedRoute>
            } />
          </Route>
          }
          {/* Default redirect */}
          <Route path="*" element={
            user ? <Navigate to={`/${user.role}`} /> : <Navigate to="/" />
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;