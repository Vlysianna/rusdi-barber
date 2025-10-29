import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import BookingManagement from "./pages/BookingManagement";
import Login from "./pages/Login";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { AuthProvider, useAuth } from "./hooks/useAuth";

// Stylist Management placeholder
const StylistManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Stylist</h1>
        <p className="text-gray-600">
          Kelola data stylist, jam kerja, dan spesialisasi
        </p>
      </div>
      <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-500">
          Halaman Manajemen Stylist sedang dalam pengembangan
        </p>
      </div>
    </div>
  );
};

// Service Management placeholder
const ServiceManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Layanan</h1>
        <p className="text-gray-600">Kelola layanan, harga, dan durasi</p>
      </div>
      <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-500">
          Halaman Manajemen Layanan sedang dalam pengembangan
        </p>
      </div>
    </div>
  );
};

// Payment Management placeholder
const PaymentManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Manajemen Pembayaran
        </h1>
        <p className="text-gray-600">Kelola pembayaran dan transaksi</p>
      </div>
      <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-500">
          Halaman Manajemen Pembayaran sedang dalam pengembangan
        </p>
      </div>
    </div>
  );
};

// Review Management placeholder
const ReviewManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Manajemen Ulasan & Rating
        </h1>
        <p className="text-gray-600">Moderasi ulasan dan kelola rating</p>
      </div>
      <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-500">
          Halaman Manajemen Ulasan sedang dalam pengembangan
        </p>
      </div>
    </div>
  );
};

// Customer Management placeholder
const CustomerManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Manajemen Pelanggan
        </h1>
        <p className="text-gray-600">
          Kelola data pelanggan dan riwayat booking
        </p>
      </div>
      <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-500">
          Halaman Manajemen Pelanggan sedang dalam pengembangan
        </p>
      </div>
    </div>
  );
};

// Promo Management placeholder
const PromoManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Manajemen Promo & Loyalty
        </h1>
        <p className="text-gray-600">
          Kelola promo code, loyalty points, dan program reward
        </p>
      </div>
      <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-500">
          Halaman Manajemen Promo sedang dalam pengembangan
        </p>
      </div>
    </div>
  );
};

// Analytics placeholder
const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Laporan & Analitik</h1>
        <p className="text-gray-600">
          Analisis performa bisnis dan laporan keuangan
        </p>
      </div>
      <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-500">
          Halaman Laporan & Analitik sedang dalam pengembangan
        </p>
      </div>
    </div>
  );
};

// Settings placeholder
const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
        <p className="text-gray-600">
          Konfigurasi sistem dan pengaturan aplikasi
        </p>
      </div>
      <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-500">
          Halaman Pengaturan sedang dalam pengembangan
        </p>
      </div>
    </div>
  );
};

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="stylists" element={<StylistManagement />} />
            <Route path="services" element={<ServiceManagement />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="payments" element={<PaymentManagement />} />
            <Route path="reviews" element={<ReviewManagement />} />
            <Route path="customers" element={<CustomerManagement />} />
            <Route path="promos" element={<PromoManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-4">Halaman tidak ditemukan</p>
                  <a href="/dashboard" className="btn btn-primary">
                    Kembali ke Dashboard
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
