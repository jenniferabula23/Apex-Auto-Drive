import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingBackground from './components/FloatingBackground';
import Preloader from './components/Preloader';
import HomePage from './pages/HomePage';
import VehiclesPage from './pages/VehiclesPage';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import MyRentals from './pages/dashboard/MyRentals';
import BookingHistory from './pages/dashboard/BookingHistory';
import Favorites from './pages/dashboard/Favorites';
import Payments from './pages/dashboard/Payments';
import SettingsPage from './pages/dashboard/SettingsPage';
import VerificationPage from './pages/dashboard/VerificationPage';
import Support from './pages/dashboard/Support';
import AdminApp from './admin/AdminApp';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import ScrollToTop from './components/ScrollToTop';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="rentals" element={<MyRentals />} />
            <Route path="history" element={<BookingHistory />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="payments" element={<Payments />} />
            <Route path="verification" element={<VerificationPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="support" element={<Support />} />
          </Route>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AppShell() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-black text-white">
        <AnimatedRoutes />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <Preloader />
      <FloatingBackground />
      <Navbar />
      <AnimatedRoutes />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="*" element={<AppShell />} />
          </Routes>
        </BrowserRouter>
      </CurrencyProvider>
    </AuthProvider>
  );
}
