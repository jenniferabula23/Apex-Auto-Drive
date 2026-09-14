import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Car,
  MapPin,
  FileText,
  Users,
  Plus,
  ArrowRight,
  Sparkles,
  Calendar,
  CreditCard,
  UserCircle,
} from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import { adminStore } from '../store/adminStore';
import { adminCard } from '../components/adminUi';

export default function AdminDashboardPage() {
  const vehicles = adminStore.getVehicles();
  const locations = adminStore.getPickupLocations();
  const admins = adminStore.getAdmins();
  const drivers = adminStore.getDrivers();
  const reservations = adminStore.getReservations();
  const payments = adminStore.getPayments();
  const pendingReservations = reservations.filter(
    r => r.status === 'pending',
  ).length;
  const outstandingPayments = payments.filter(
    p => p.status !== 'paid',
  ).length;
  const logs = adminStore.getActivityLogs().slice(0, 5);

  return (
    <div className="space-y-10">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200 shadow-sm p-8 lg:p-12"
      >
        <div className="absolute inset-0 grid-lines opacity-10" />

        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-brand-red" />

            <span className="font-mono text-xs text-brand-red tracking-[0.4em] uppercase">
              Admin Hub
            </span>
          </div>

          <h1 className="font-heading font-black text-4xl lg:text-5xl text-gray-900 leading-tight mb-4">
            Fleet &{' '}
            <span className="text-brand-red">
              Operations
            </span>
          </h1>

          <p className="text-gray-500 text-lg">
            Manage vehicles, pricing, rental terms, and pickup locations.
          </p>

          <Link
            to="/admin/vehicles/new"
            className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-light text-white px-6 py-3 text-sm mt-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(174,33,25,0.25)]"
          >
            <Plus className="w-4 h-4" />
            Add vehicle
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.section>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <Link to="/admin/vehicles">
          <StatsCard
            icon={Car}
            label="Fleet vehicles"
            value={String(vehicles.length)}
            delay={0}
          />
        </Link>

        <Link to="/admin/reservations">
          <StatsCard
            icon={Calendar}
            label="Pending bookings"
            value={String(pendingReservations)}
            delay={0.05}
          />
        </Link>

        <Link to="/admin/payments">
          <StatsCard
            icon={CreditCard}
            label="Outstanding payments"
            value={String(outstandingPayments)}
            delay={0.1}
          />
        </Link>

        <Link to="/admin/drivers">
          <StatsCard
            icon={UserCircle}
            label="Drivers"
            value={String(drivers.length)}
            delay={0.15}
          />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <Link to="/admin/locations">
          <StatsCard
            icon={MapPin}
            label="Pickup locations"
            value={String(locations.length)}
            delay={0}
          />
        </Link>

        <Link to="/admin/rental-terms">
          <StatsCard
            icon={FileText}
            label="Rental modules"
            value="3"
            delay={0.05}
          />
        </Link>

        <Link to="/admin/admins">
          <StatsCard
            icon={Users}
            label="Administrators"
            value={String(admins.length)}
            delay={0.1}
          />
        </Link>

        <Link to="/admin/users">
          <StatsCard
            icon={Users}
            label="Customers"
            value={String(adminStore.getCustomers().length)}
            delay={0.15}
          />
        </Link>
      </div>

      <div>
        <DashboardHeader
          eyebrow="Activity"
          title="Recent Logs"
          description="Latest admin actions stored locally until API sync."
        />

        <div className={`${adminCard} p-6`}>
          {logs.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No activity yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {logs.map(log => (
                <li
                  key={log.id}
                  className="flex justify-between gap-4 text-sm border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-gray-900">
                    {log.action}
                  </span>

                  <span className="text-gray-500 text-xs whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}