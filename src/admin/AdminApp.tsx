import { Routes, Route } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminAuthGuard from './components/AdminAuthGuard';
import AdminLayout from './components/AdminLayout';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminVehiclesPage from './pages/AdminVehiclesPage';
import AdminAddVehiclePage from './pages/AdminAddVehiclePage';
import AdminRentalTermsPage from './pages/AdminRentalTermsPage';
import AdminLocationsPage from './pages/AdminLocationsPage';
import AdminAdminsPage from './pages/AdminAdminsPage';
import AdminDriversPage from './pages/AdminDriversPage';
import AdminReservationsPage from './pages/AdminReservationsPage';
import AdminCreateReservationPage from './pages/AdminCreateReservationPage';
import AdminPaymentsPage from './pages/AdminPaymentsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminAddCustomerPage from './pages/AdminAddCustomerPage';
import AdminRolesPage from './pages/AdminRolesPage';
import AdminProvidersPage from './pages/AdminProvidersPage';
import { adminStore } from './store/adminStore';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { adminCard } from './components/adminUi';

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<AdminLoginPage />} />
        <Route element={<AdminAuthGuard />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="vehicles" element={<AdminVehiclesPage />} />
            <Route path="vehicles/new" element={<AdminAddVehiclePage />} />
            <Route path="vehicles/:id/edit" element={<AdminAddVehiclePage />} />
            <Route path="rental-terms" element={<AdminRentalTermsPage />} />
            <Route path="locations" element={<AdminLocationsPage />} />
            <Route path="admins" element={<AdminAdminsPage />} />
            <Route path="drivers" element={<AdminDriversPage />} />
            <Route path="reservations" element={<AdminReservationsPage />} />
            <Route path="reservations/new" element={<AdminCreateReservationPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="users/new" element={<AdminAddCustomerPage />} />
            <Route path="roles" element={<AdminRolesPage />} />
            <Route path="providers" element={<AdminProvidersPage />} />
            <Route path="activity" element={<AdminActivityPage />} />
          </Route>
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}

function AdminActivityPage() {
  const logs = adminStore.getActivityLogs();
  return (
    <div className="space-y-8">
      <DashboardHeader
        eyebrow="Audit"
        title="Activity Logs"
        description="Recent admin actions stored locally until API sync."
      />
      <div className={`${adminCard} divide-y divide-white/5`}>
        {logs.length === 0 ? (
          <p className="p-6 text-brand-gray text-sm">No logs yet.</p>
        ) : (
          logs.map(log => (
            <div key={log.id} className="px-5 py-4 flex justify-between gap-4 text-sm">
              <div>
                <p className="text-white">{log.action}</p>
                <p className="text-brand-gray text-xs">{log.actor}</p>
              </div>
              <span className="text-brand-gray text-xs">{new Date(log.createdAt).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
