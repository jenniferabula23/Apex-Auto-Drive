import {
  LayoutDashboard,
  Car,
  UserCircle,
  MapPin,
  Calendar,
  CreditCard,
  Users,
  Shield,
  KeyRound,
  Truck,
  FileText,
  Activity,
  Tags,
  Image,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

export type AdminNavLink = {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
};

export const adminNavLinks: AdminNavLink[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/vehicles', label: 'Vehicles', icon: Car },
  { to: '/admin/categories', label: 'Vehicle Categories', icon: Tags },
  { to: '/admin/hero', label: 'Hero Images', icon: Image },
  { to: '/admin/drivers', label: 'Drivers', icon: UserCircle },
  { to: '/admin/locations', label: 'Locations', icon: MapPin },
  { to: '/admin/rental-terms', label: 'Rental Terms', icon: FileText },
  { to: '/admin/reservations', label: 'Reservations', icon: Calendar },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/admins', label: 'Admins', icon: Shield },
  { to: '/admin/roles', label: 'Roles & Permissions', icon: KeyRound },
  { to: '/admin/providers', label: 'Providers', icon: Truck },
  { to: '/admin/activity', label: 'Activity Logs', icon: Activity },
];