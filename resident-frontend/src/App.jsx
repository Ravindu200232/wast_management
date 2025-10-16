// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import TrackVehicle from './components/TrackVehicle';
import ExtraPickup from './components/ExtraPickup';
import MyCoupons from './components/MyCoupons';
import CollectionHistory from './components/CollectionHistory';
import Feedback from './components/Feedback';
import Profile from './components/Profile';
import Layout from './components/Layout';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/track-vehicle" element={
            <ProtectedRoute>
              <Layout>
                <TrackVehicle />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/extra-pickup" element={
            <ProtectedRoute>
              <Layout>
                <ExtraPickup />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/my-coupons" element={
            <ProtectedRoute>
              <Layout>
                <MyCoupons />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/collection-history" element={
            <ProtectedRoute>
              <Layout>
                <CollectionHistory />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/feedback" element={
            <ProtectedRoute>
              <Layout>
                <Feedback />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;