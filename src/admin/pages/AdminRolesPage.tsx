import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { adminStore } from '../store/adminStore';
import type { AdminRole, PermissionKey } from '../types';
import { adminAlert, adminCard } from '../components/adminUi';

const roles: AdminRole[] = ['super_admin', 'admin', 'manager'];

const permissions: { key: PermissionKey; label: string }[] = [
  { key: 'vehicles', label: 'Vehicles' },
  { key: 'drivers', label: 'Drivers' },
  { key: 'reservations', label: 'Reservations' },
  { key: 'payments', label: 'Payments' },
  { key: 'users', label: 'Users' },
  { key: 'admins', label: 'Admins' },
  { key: 'settings', label: 'Settings & Terms' },
];

const roleLabel = (role: AdminRole) =>
  role === 'super_admin' ? 'Super Admin' : role === 'admin' ? 'Admin' : 'Manager';

export default function AdminRolesPage() {
  const [matrix, setMatrix] = useState(() => adminStore.getRolePermissions());

  const refresh = () => setMatrix(adminStore.getRolePermissions());

  const toggle = (role: AdminRole, key: PermissionKey) => {
    if (role === 'super_admin') return;
    const next = adminStore.updateRolePermission(role, key, !matrix[role][key]);
    setMatrix(next);
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        eyebrow="Access"
        title="Roles & Permissions"
        description="Configure what each admin role can access. Super Admin always has full access."
      />

      <div className={adminAlert}>
        <p className="text-gray-900 text-sm font-semibold mb-1">Frontend-only permissions</p>
        <p className="text-brand-gray text-xs">
          Changes are stored locally. API enforcement will mirror this matrix when connected.
        </p>
      </div>

      <button type="button" onClick={refresh} className="btn-outline inline-flex items-center gap-2">
        <RefreshCw className="w-4 h-4" />
        Refresh
      </button>

      <div className={`${adminCard} overflow-x-auto`}>
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-200 text-brand-gray text-xs uppercase tracking-widest">
              <th className="text-left p-4">Permission</th>
              {roles.map(role => (
                <th key={role} className="text-center p-4">{roleLabel(role)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map(({ key, label }) => (
              <tr key={key} className="border-b border-gray-100">
                <td className="p-4 text-gray-900">{label}</td>
                {roles.map(role => (
                  <td key={role} className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={matrix[role][key]}
                      disabled={role === 'super_admin'}
                      onChange={() => toggle(role, key)}
                      className="w-4 h-4 accent-brand-red cursor-pointer disabled:opacity-60"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
