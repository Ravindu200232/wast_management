// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import TrackVehicle from "./components/TrackVehicle";
import ExtraPickup from "./components/ExtraPickup";
import MyCoupons from "./components/MyCoupons";
import CollectionHistory from "./components/CollectionHistory";
import Feedback from "./components/Feedback";
import Profile from "./components/Profile";
import Layout from "./components/Layout";

// Factory Components
import FactoryLayout from "./components/factory/FactoryLayout";
import FactoryDashboard from "./components/factory/FactoryDashboard";
import FactoryInventory from "./components/factory/FactoryInventory";
import FactoryRequests from "./components/factory/FactoryRequests";
import FactoryOrders from "./components/factory/FactoryOrders";
import FactoryHistory from "./components/factory/FactoryHistory";
import FactoryAnalytics from "./components/factory/FactoryAnalytics";

// Admin Components
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserManagement from "./components/admin/UserManagement";
import AdminFactoryRequests from "./components/admin/FactoryRequests";
import InventoryManagement from "./components/admin/InventoryManagement";
import VehicleManagement from "./components/admin/VehicleManagement";
import RouteManagement from "./components/admin/RouteManagement";
import CouponManagement from "./components/admin/CouponManagement";
import Analytics from "./components/admin/Analytics";
import SystemSettings from "./components/admin/SystemSettings";

// Add these imports
import DriverLayout from "./components/driver/DriverLayout";
import DriverDashboard from "./components/driver/DriverDashboard";
import TodaysSchedule from "./components/driver/TodaysSchedule";
import RecordCollection from "./components/driver/RecordCollection";
import ReportIssues from "./components/driver/ReportIssues";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

function RoleBasedRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "factory":
      return <Navigate to="/factory" replace />;
    case "admin":
      return <Navigate to="/admin" replace />;
    case "driver":
      return <Navigate to="/driver" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}

function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">401</h1>
        <p className="text-xl text-gray-600 mb-4">Unauthorized Access</p>
        <p className="text-gray-500 mb-8">
          You don't have permission to access this page.
        </p>
        <button
          onClick={() => window.history.back()}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          {/* Resident Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["resident", "admin", "driver"]}>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/track-vehicle"
            element={
              <ProtectedRoute allowedRoles={["resident", "admin", "driver"]}>
                <Layout>
                  <TrackVehicle />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/extra-pickup"
            element={
              <ProtectedRoute allowedRoles={["resident", "admin"]}>
                <Layout>
                  <ExtraPickup />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-coupons"
            element={
              <ProtectedRoute allowedRoles={["resident", "admin"]}>
                <Layout>
                  <MyCoupons />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/collection-history"
            element={
              <ProtectedRoute allowedRoles={["resident", "admin"]}>
                <Layout>
                  <CollectionHistory />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <ProtectedRoute allowedRoles={["resident", "admin"]}>
                <Layout>
                  <Feedback />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute
                allowedRoles={["resident", "factory", "admin", "driver"]}
              >
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* Factory Routes */}
          <Route
            path="/factory"
            element={
              <ProtectedRoute allowedRoles={["factory", "admin"]}>
                <FactoryLayout>
                  <FactoryDashboard />
                </FactoryLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/factory/inventory"
            element={
              <ProtectedRoute allowedRoles={["factory", "admin"]}>
                <FactoryLayout>
                  <FactoryInventory />
                </FactoryLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/factory/requests"
            element={
              <ProtectedRoute allowedRoles={["factory", "admin"]}>
                <FactoryLayout>
                  <FactoryRequests />
                </FactoryLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/factory/orders"
            element={
              <ProtectedRoute allowedRoles={["factory", "admin"]}>
                <FactoryLayout>
                  <FactoryOrders />
                </FactoryLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/factory/history"
            element={
              <ProtectedRoute allowedRoles={["factory", "admin"]}>
                <FactoryLayout>
                  <FactoryHistory />
                </FactoryLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/factory/analytics"
            element={
              <ProtectedRoute allowedRoles={["factory", "admin"]}>
                <FactoryLayout>
                  <FactoryAnalytics />
                </FactoryLayout>
              </ProtectedRoute>
            }
          />
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <UserManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/requests"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <AdminFactoryRequests />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/inventory"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <InventoryManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vehicles"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <VehicleManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/routes"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <RouteManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/coupons"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <CouponManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <Analytics />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <SystemSettings />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          {/* driver route */}
          // Add these routes inside your Routes component
          <Route
            path="/driver"
            element={
              <ProtectedRoute allowedRoles={["driver", "admin"]}>
                <DriverLayout>
                  <DriverDashboard />
                </DriverLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/today"
            element={
              <ProtectedRoute allowedRoles={["driver", "admin"]}>
                <DriverLayout>
                  <TodaysSchedule />
                </DriverLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/collections"
            element={
              <ProtectedRoute allowedRoles={["driver", "admin"]}>
                <DriverLayout>
                  <RecordCollection />
                </DriverLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/issues"
            element={
              <ProtectedRoute allowedRoles={["driver", "admin"]}>
                <DriverLayout>
                  <ReportIssues />
                </DriverLayout>
              </ProtectedRoute>
            }
          />
          {/* Default redirect based on role */}
          <Route path="*" element={<RoleBasedRedirect />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
