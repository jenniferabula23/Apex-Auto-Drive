import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, RefreshCw, UserX, UserCheck } from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { adminStore } from '../store/adminStore';
import { adminCard } from '../components/adminUi';
import AdminStatusBadge from '../components/AdminStatusBadge';
import { formatCurrency } from '../../utils/currency';

export default function AdminUsersPage() {
  const location = useLocation();
  const createdName = (location.state as { createdName?: string } | null)?.createdName;
  const [customers, setCustomers] = useState(() => adminStore.getCustomers());

  const refresh = () => setCustomers(adminStore.getCustomers());

  const toggleBlock = (id: string) => {
    const customer = customers.find(c => c.id === id);
    if (!customer) return;
    adminStore.updateCustomer(id, {
      status: customer.status === 'active' ? 'blocked' : 'active',
    });
    refresh();
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        eyebrow="Customers"
        title="Users"
        description="Customer accounts for online and admin-created bookings."
        action={
          <Link to="/admin/users/new" className="btn-primary inline-flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" />
            Add user
          </Link>
        }
      />

      {createdName && (
        <p className="text-sm text-green-400 bg-green-400/10 border border-green-400/20 px-4 py-3">
          User <span className="font-semibold">{createdName}</span> added successfully.
        </p>
      )}

      <button type="button" onClick={refresh} className="btn-outline inline-flex items-center gap-2">
        <RefreshCw className="w-4 h-4" />
        Refresh
      </button>

      <div className="space-y-4">
        {customers.map((customer, i) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`${adminCard} p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-gray-900 font-semibold">{customer.name}</h3>
                <AdminStatusBadge label={customer.status} tone={customer.status === 'active' ? 'green' : 'red'} />
                {customer.documentUrl && (
                  <AdminStatusBadge label="ID on file" tone="purple" />
                )}
              </div>
              <p className="text-brand-gray text-sm">{customer.email}</p>
              <p className="text-brand-gray text-sm">{customer.phone}</p>
              {customer.address && (
                <p className="text-brand-gray text-xs mt-1">{customer.address}</p>
              )}
              {customer.licenseNumber && (
                <p className="text-brand-gray text-xs">License: {customer.licenseNumber}</p>
              )}
              <p className="text-brand-gray text-xs mt-2">
                {customer.totalBookings} bookings · {formatCurrency(customer.totalSpent)} spent · Last {new Date(customer.lastBookingAt).toLocaleDateString()}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleBlock(customer.id)}
              className="btn-outline inline-flex items-center gap-2 text-xs"
            >
              {customer.status === 'active' ? (
                <>
                  <UserX className="w-4 h-4" />
                  Block user
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  Unblock user
                </>
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
