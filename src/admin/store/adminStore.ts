import { vehicles as seedVehicles, locations as regionLocations } from '../../data/vehicles';
import type { Vehicle } from '../../data/vehicles';
import { formatPickupLocation } from '../../data/vehicles';
import { locations } from '../../data/vehicles';
import type {
  AdminActivity,
  AdminCustomerDraft,
  AdminReservationDraft,
  AdminRole,
  AdminUser,
  AdminVehicleDraft,
  Customer,
  Driver,
  Payment,
  PermissionKey,
  PickupLocation,
  Provider,
  RentalModuleKey,
  RentalTerm,
  Reservation,
  RolePermissions,
} from '../types';

const KEYS = {
  vehicles: 'aad_admin_vehicles', // synced with getFleetVehicles() on public site
  rentalTerms: 'aad_admin_rental_terms',
  pickupLocations: 'aad_admin_pickup_locations',
  admins: 'aad_admin_users',
  activity: 'aad_admin_activity',
  drivers: 'aad_admin_drivers',
  reservations: 'aad_admin_reservations',
  payments: 'aad_admin_payments',
  customers: 'aad_admin_customers',
  providers: 'aad_admin_providers',
  rolePermissions: 'aad_admin_role_permissions',
} as const;

const read = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const defaultRentalTerms = (): RentalTerm[] => [
  {
    key: 'self_drive',
    title: 'Self Drive',
    content:
      'Valid driver\'s license and ID required. Full-to-full fuel policy. 300km/day included. Security deposit refundable on return.',
    updatedAt: new Date().toISOString(),
  },
  {
    key: 'chauffeur',
    title: 'Chauffeur',
    content:
      'Professional driver included. Overtime charges may apply after 10 hours. Client provides itinerary in advance.',
    updatedAt: new Date().toISOString(),
  },
  {
    key: 'airport_pickup',
    title: 'Airport Pickup & Drop-off',
    content:
      'Flight details required 24 hours before pickup. Driver meets at arrivals with name board. Waiting time included up to 60 minutes.',
    updatedAt: new Date().toISOString(),
  },
];

const defaultPickupLocations = (): PickupLocation[] => [
  {
    id: 'accra-main',
    name: 'Accra Fleet Hub',
    city: 'Accra',
    isActive: true,
    note: 'All vehicles are picked up in Accra and delivered to destinations across Ghana.',
  },
];

const defaultAdmins = (): AdminUser[] => [
  {
    id: 'admin-1',
    name: 'Admin',
    email: 'nyamej19@gmail.com',
    phone: '+233 24 000 0000',
    role: 'super_admin',
    status: 'active',
    onDuty: true,
  },
];

const defaultDrivers = (): Driver[] => [
  { id: 'drv-1', name: 'Kwame Mensah', phone: '+233 24 111 2233', licenseNumber: 'GH-DRV-8841', status: 'available', rating: 4.9, tripsCompleted: 142 },
  { id: 'drv-2', name: 'Ama Osei', phone: '+233 55 222 3344', licenseNumber: 'GH-DRV-7720', status: 'on_trip', rating: 4.8, tripsCompleted: 98 },
  { id: 'drv-3', name: 'Kofi Asante', phone: '+233 20 333 4455', licenseNumber: 'GH-DRV-6612', status: 'off_duty', rating: 4.7, tripsCompleted: 76 },
];

const defaultProviders = (): Provider[] => [
  { id: 'prv-1', companyName: 'Golden Fleet Ghana', contactName: 'Nana Boateng', email: 'ops@goldenfleet.gh', phone: '+233 30 200 1100', vehicleCount: 8, status: 'active', city: 'Accra' },
  { id: 'prv-2', companyName: 'Ashanti Mobility Co.', contactName: 'Yaa Adjei', email: 'fleet@ashantimobility.gh', phone: '+233 32 400 2200', vehicleCount: 5, status: 'active', city: 'Kumasi' },
];

const defaultCustomers = (): Customer[] => [
  { id: 'cus-1', name: 'David Okoro', email: 'david.okoro@email.com', phone: '+233 24 900 1122', address: 'East Legon, Accra', licenseNumber: 'GH-DL-882910', documentType: 'drivers_license', totalBookings: 3, totalSpent: 8400, lastBookingAt: '2026-05-28T10:00:00.000Z', createdAt: '2026-01-15T10:00:00.000Z', status: 'active' },
  { id: 'cus-2', name: 'Grace Mensah', email: 'grace.m@email.com', phone: '+233 55 800 3344', address: 'Kumasi, Ashanti Region', licenseNumber: 'GH-DL-771204', documentType: 'national_id', totalBookings: 1, totalSpent: 2500, lastBookingAt: '2026-06-01T14:30:00.000Z', createdAt: '2026-02-20T14:30:00.000Z', status: 'active' },
  { id: 'cus-3', name: 'Samuel Tetteh', email: 'sam.tetteh@email.com', phone: '+233 20 700 5566', address: 'Tema, Greater Accra', licenseNumber: 'GH-DL-660318', documentType: 'passport', totalBookings: 2, totalSpent: 5200, lastBookingAt: '2026-05-15T09:00:00.000Z', createdAt: '2026-03-10T09:00:00.000Z', status: 'active' },
];

const defaultReservations = (): Reservation[] => {
  const prado = seedVehicles.find(v => v.id === 'toyota-prado') ?? seedVehicles[0];
  const elantra = seedVehicles.find(v => v.id === 'elantra-2019') ?? seedVehicles[1];
  const tahoe = seedVehicles.find(v => v.id === 'chevrolet-tahoe') ?? seedVehicles[2];
  return [
    {
      id: 'res-1',
      bookingRef: 'AAD-2026-1042',
      customerName: 'David Okoro',
      customerEmail: 'david.okoro@email.com',
      customerPhone: '+233 24 900 1122',
      vehicleId: prado.id,
      vehicleName: prado.name,
      vehicleImage: prado.image,
      pickupLocation: 'Accra — Kotoka Airport',
      pickupDate: '2026-06-10',
      pickupTime: '14:30',
      returnDate: '2026-06-13',
      returnTime: '10:00',
      days: 3,
      pricePerDay: prado.pricePerDay.accra,
      totalAmount: prado.pricePerDay.accra * 3,
      status: 'confirmed',
      paymentStatus: 'paid',
      rentalModule: 'airport_pickup',
      notes: 'Flight EK 787, arrival 14:30',
      createdAt: '2026-06-02T08:15:00.000Z',
    },
    {
      id: 'res-2',
      bookingRef: 'AAD-2026-1043',
      customerName: 'Grace Mensah',
      customerEmail: 'grace.m@email.com',
      customerPhone: '+233 55 800 3344',
      vehicleId: elantra.id,
      vehicleName: elantra.name,
      vehicleImage: elantra.image,
      pickupLocation: 'Ashanti — Kumasi Central',
      pickupDate: '2026-06-12',
      pickupTime: '09:00',
      returnDate: '2026-06-13',
      returnTime: '18:00',
      days: 1,
      pricePerDay: elantra.pricePerDay.ashanti ?? 2500,
      totalAmount: elantra.pricePerDay.ashanti ?? 2500,
      status: 'pending',
      paymentStatus: 'invoiced',
      rentalModule: 'self_drive',
      notes: 'Destination: Adum business district',
      createdAt: '2026-06-03T11:40:00.000Z',
    },
    {
      id: 'res-3',
      bookingRef: 'AAD-2026-1038',
      customerName: 'Samuel Tetteh',
      customerEmail: 'sam.tetteh@email.com',
      customerPhone: '+233 20 700 5566',
      vehicleId: tahoe.id,
      vehicleName: tahoe.name,
      vehicleImage: tahoe.image,
      pickupLocation: 'Accra — East Legon',
      pickupDate: '2026-05-20',
      pickupTime: '08:00',
      returnDate: '2026-05-22',
      returnTime: '17:00',
      days: 2,
      pricePerDay: tahoe.pricePerDay.accra,
      totalAmount: tahoe.pricePerDay.accra * 2,
      status: 'completed',
      paymentStatus: 'paid',
      rentalModule: 'chauffeur',
      notes: 'Corporate event shuttle',
      createdAt: '2026-05-18T16:20:00.000Z',
    },
  ];
};

const defaultPayments = (): Payment[] => [
  {
    id: 'pay-1',
    reservationId: 'res-1',
    bookingRef: 'AAD-2026-1042',
    customerName: 'David Okoro',
    amount: defaultReservations()[0].totalAmount,
    method: 'mobile_money',
    status: 'paid',
    reference: 'MM-8849201',
    paidAt: '2026-06-02T09:00:00.000Z',
    createdAt: '2026-06-02T08:30:00.000Z',
  },
  {
    id: 'pay-2',
    reservationId: 'res-2',
    bookingRef: 'AAD-2026-1043',
    customerName: 'Grace Mensah',
    amount: defaultReservations()[1].totalAmount,
    method: 'bank_transfer',
    status: 'invoiced',
    reference: 'INV-2026-044',
    createdAt: '2026-06-03T12:00:00.000Z',
  },
  {
    id: 'pay-3',
    reservationId: 'res-3',
    bookingRef: 'AAD-2026-1038',
    customerName: 'Samuel Tetteh',
    amount: defaultReservations()[2].totalAmount,
    method: 'cash',
    status: 'paid',
    reference: 'CASH-038',
    paidAt: '2026-05-20T10:00:00.000Z',
    createdAt: '2026-05-18T17:00:00.000Z',
  },
];

const defaultRolePermissions = (): RolePermissions => ({
  super_admin: {
    vehicles: true,
    drivers: true,
    reservations: true,
    payments: true,
    users: true,
    admins: true,
    settings: true,
  },
  admin: {
    vehicles: true,
    drivers: true,
    reservations: true,
    payments: true,
    users: true,
    admins: false,
    settings: true,
  },
  manager: {
    vehicles: false,
    drivers: true,
    reservations: true,
    payments: false,
    users: true,
    admins: false,
    settings: false,
  },
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const logActivity = (action: string, actor = 'Admin') => {
  const entry: AdminActivity = {
    id: `act-${Date.now()}`,
    action,
    actor,
    createdAt: new Date().toISOString(),
  };
  const logs = [entry, ...read<AdminActivity[]>(KEYS.activity, [])].slice(0, 100);
  write(KEYS.activity, logs);
};

export const adminStore = {
  init: () => {
    if (!localStorage.getItem(KEYS.vehicles)) {
      write(KEYS.vehicles, seedVehicles);
    }
    if (!localStorage.getItem(KEYS.rentalTerms)) {
      write(KEYS.rentalTerms, defaultRentalTerms());
    }
    if (!localStorage.getItem(KEYS.pickupLocations)) {
      write(KEYS.pickupLocations, defaultPickupLocations());
    }
    if (!localStorage.getItem(KEYS.admins)) {
      write(KEYS.admins, defaultAdmins());
    }
    if (!localStorage.getItem(KEYS.drivers)) {
      write(KEYS.drivers, defaultDrivers());
    }
    if (!localStorage.getItem(KEYS.reservations)) {
      write(KEYS.reservations, defaultReservations());
    }
    if (!localStorage.getItem(KEYS.payments)) {
      write(KEYS.payments, defaultPayments());
    }
    if (!localStorage.getItem(KEYS.customers)) {
      write(KEYS.customers, defaultCustomers());
    }
    if (!localStorage.getItem(KEYS.providers)) {
      write(KEYS.providers, defaultProviders());
    }
    if (!localStorage.getItem(KEYS.rolePermissions)) {
      write(KEYS.rolePermissions, defaultRolePermissions());
    }
  },

  getVehicles: (): Vehicle[] => read(KEYS.vehicles, seedVehicles),

  saveVehicle: (draft: AdminVehicleDraft): Vehicle => {
    const list = adminStore.getVehicles();
    const id = draft.id ?? slugify(`${draft.brand}-${draft.model}-${draft.year}`);
    const vehicle: Vehicle = {
      ...draft,
      id,
      rating: list.find(v => v.id === id)?.rating ?? 4.5,
      reviews: list.find(v => v.id === id)?.reviews ?? 0,
    };
    const next = list.some(v => v.id === id)
      ? list.map(v => (v.id === id ? vehicle : v))
      : [...list, vehicle];
    write(KEYS.vehicles, next);
    logActivity(`Vehicle ${list.some(v => v.id === id) ? 'updated' : 'added'}: ${vehicle.name}`);
    return vehicle;
  },

  deleteVehicle: (id: string) => {
    const next = adminStore.getVehicles().filter(v => v.id !== id);
    write(KEYS.vehicles, next);
    logActivity(`Vehicle removed: ${id}`);
  },

  getRentalTerms: (): RentalTerm[] => read(KEYS.rentalTerms, defaultRentalTerms()),

  updateRentalTerm: (key: RentalModuleKey, content: string) => {
    const terms = adminStore.getRentalTerms().map(term =>
      term.key === key ? { ...term, content, updatedAt: new Date().toISOString() } : term,
    );
    write(KEYS.rentalTerms, terms);
    logActivity(`Rental terms updated: ${key}`);
  },

  getPickupLocations: (): PickupLocation[] =>
    read(KEYS.pickupLocations, defaultPickupLocations()),

  savePickupLocation: (location: PickupLocation) => {
    const list = adminStore.getPickupLocations();
    const next = list.some(l => l.id === location.id)
      ? list.map(l => (l.id === location.id ? location : l))
      : [...list, location];
    write(KEYS.pickupLocations, next);
    logActivity(`Pickup location saved: ${location.name}`);
  },

  getAdmins: (): AdminUser[] => read(KEYS.admins, defaultAdmins()),

  inviteAdmin: (admin: Omit<AdminUser, 'id' | 'status' | 'onDuty'>) => {
    const entry: AdminUser = {
      ...admin,
      id: `admin-${Date.now()}`,
      status: 'active',
      onDuty: false,
    };
    write(KEYS.admins, [...adminStore.getAdmins(), entry]);
    logActivity(`Admin invited: ${entry.email}`);
    return entry;
  },

  updateAdmin: (id: string, patch: Partial<AdminUser>) => {
    const next = adminStore.getAdmins().map(a => (a.id === id ? { ...a, ...patch } : a));
    write(KEYS.admins, next);
    logActivity(`Admin updated: ${id}`);
  },

  getActivityLogs: (): AdminActivity[] => read(KEYS.activity, []),

  getDrivers: (): Driver[] => read(KEYS.drivers, defaultDrivers()),

  saveDriver: (driver: Driver) => {
    const list = adminStore.getDrivers();
    const next = list.some(d => d.id === driver.id)
      ? list.map(d => (d.id === driver.id ? driver : d))
      : [...list, driver];
    write(KEYS.drivers, next);
    logActivity(`Driver saved: ${driver.name}`);
    return driver;
  },

  addDriver: (draft: Omit<Driver, 'id' | 'rating' | 'tripsCompleted'>) => {
    const driver: Driver = {
      ...draft,
      id: `drv-${Date.now()}`,
      rating: 5,
      tripsCompleted: 0,
    };
    write(KEYS.drivers, [...adminStore.getDrivers(), driver]);
    logActivity(`Driver added: ${driver.name}`);
    return driver;
  },

  deleteDriver: (id: string) => {
    write(KEYS.drivers, adminStore.getDrivers().filter(d => d.id !== id));
    logActivity(`Driver removed: ${id}`);
  },

  getReservations: (): Reservation[] => read(KEYS.reservations, defaultReservations()),

  updateReservation: (id: string, patch: Partial<Reservation>) => {
    const next = adminStore.getReservations().map(r => (r.id === id ? { ...r, ...patch } : r));
    write(KEYS.reservations, next);
    logActivity(`Reservation updated: ${id}`);
  },

  updateReservationPaymentStatus: (reservationId: string, paymentStatus: Reservation['paymentStatus']) => {
    adminStore.updateReservation(reservationId, { paymentStatus });
    const payment = adminStore.getPayments().find(p => p.reservationId === reservationId);
    if (payment) {
      adminStore.updatePayment(payment.id, {
        status: paymentStatus === 'not_required' ? 'unpaid' : paymentStatus,
        ...(paymentStatus === 'paid' ? { paidAt: new Date().toISOString() } : {}),
      });
    }
  },

  createReservation: (draft: AdminReservationDraft): Reservation => {
    const customer = adminStore.getCustomers().find(c => c.id === draft.customerId);
    const vehicle = adminStore.getVehicles().find(v => v.id === draft.vehicleId);
    if (!customer || !vehicle) {
      throw new Error('Customer or vehicle not found');
    }

    const regionLabel =
      locations.find(loc => loc.key === draft.locationKey)?.label ?? draft.locationKey;
    const pickupLocation = formatPickupLocation(regionLabel, draft.destinationDetails);

    const pickup = new Date(`${draft.pickupDate}T00:00:00`);
    const returnDay = new Date(`${draft.returnDate}T00:00:00`);
    const days = Math.max(
      1,
      Math.ceil((returnDay.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)) || 1,
    );
    const totalAmount = draft.pricePerDay * days;
    const bookingRef = `AAD-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

    const reservation: Reservation = {
      id: `res-${Date.now()}`,
      bookingRef,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      vehicleImage: vehicle.image,
      pickupLocation,
      pickupDate: draft.pickupDate,
      pickupTime: draft.pickupTime,
      returnDate: draft.returnDate,
      returnTime: draft.returnTime,
      days,
      pricePerDay: draft.pricePerDay,
      totalAmount,
      status: draft.status,
      paymentStatus: draft.paymentStatus,
      rentalModule: draft.rentalModule,
      notes: draft.notes,
      createdAt: new Date().toISOString(),
    };

    write(KEYS.reservations, [reservation, ...adminStore.getReservations()]);

    const payment: Payment = {
      id: `pay-${Date.now()}`,
      reservationId: reservation.id,
      bookingRef: reservation.bookingRef,
      customerName: customer.name,
      amount: totalAmount,
      method: 'bank_transfer',
      status: draft.paymentStatus === 'not_required' ? 'unpaid' : draft.paymentStatus,
      reference: draft.paymentStatus === 'invoiced' ? `INV-${bookingRef}` : `REF-${bookingRef}`,
      createdAt: new Date().toISOString(),
    };
    if (draft.paymentStatus !== 'not_required') {
      write(KEYS.payments, [payment, ...adminStore.getPayments()]);
    }

    const nextCustomers = adminStore.getCustomers().map(c =>
      c.id === customer.id
        ? {
            ...c,
            totalBookings: c.totalBookings + 1,
            totalSpent: c.totalSpent + totalAmount,
            lastBookingAt: reservation.createdAt,
          }
        : c,
    );
    write(KEYS.customers, nextCustomers);

    logActivity(`Reservation created: ${bookingRef} for ${customer.name}`);
    return reservation;
  },

  getPayments: (): Payment[] => read(KEYS.payments, defaultPayments()),

  updatePayment: (id: string, patch: Partial<Payment>) => {
    const next = adminStore.getPayments().map(p => (p.id === id ? { ...p, ...patch } : p));
    write(KEYS.payments, next);
    logActivity(`Payment updated: ${id}`);
  },

  getCustomers: (): Customer[] => read(KEYS.customers, defaultCustomers()),

  addCustomer: (draft: AdminCustomerDraft): Customer => {
    const customer: Customer = {
      id: `cus-${Date.now()}`,
      name: draft.name,
      email: draft.email,
      phone: draft.phone,
      address: draft.address,
      licenseNumber: draft.licenseNumber,
      documentType: draft.documentType,
      documentUrl: draft.documentUrl || undefined,
      totalBookings: 0,
      totalSpent: 0,
      lastBookingAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    write(KEYS.customers, [customer, ...adminStore.getCustomers()]);
    logActivity(`Customer added: ${customer.name}`);
    return customer;
  },

  updateCustomer: (id: string, patch: Partial<Customer>) => {
    const next = adminStore.getCustomers().map(c => (c.id === id ? { ...c, ...patch } : c));
    write(KEYS.customers, next);
    logActivity(`Customer updated: ${id}`);
  },

  linkCustomerByEmail: (userId: string, email: string) => {
    const normalized = email.trim().toLowerCase();
    const match = adminStore.getCustomers().find(c => c.email.trim().toLowerCase() === normalized);
    if (match && match.linkedUserId !== userId) {
      adminStore.updateCustomer(match.id, { linkedUserId: userId });
    }
    return match;
  },

  getCustomerById: (id: string) => adminStore.getCustomers().find(c => c.id === id),

  getProviders: (): Provider[] => read(KEYS.providers, defaultProviders()),

  saveProvider: (provider: Provider) => {
    const list = adminStore.getProviders();
    const next = list.some(p => p.id === provider.id)
      ? list.map(p => (p.id === provider.id ? provider : p))
      : [...list, provider];
    write(KEYS.providers, next);
    logActivity(`Provider saved: ${provider.companyName}`);
    return provider;
  },

  addProvider: (draft: Omit<Provider, 'id'>) => {
    const provider: Provider = { ...draft, id: `prv-${Date.now()}` };
    write(KEYS.providers, [...adminStore.getProviders(), provider]);
    logActivity(`Provider added: ${provider.companyName}`);
    return provider;
  },

  deleteProvider: (id: string) => {
    write(KEYS.providers, adminStore.getProviders().filter(p => p.id !== id));
    logActivity(`Provider removed: ${id}`);
  },

  getRolePermissions: (): RolePermissions =>
    read(KEYS.rolePermissions, defaultRolePermissions()),

  updateRolePermission: (role: AdminRole, key: PermissionKey, allowed: boolean) => {
    const current = adminStore.getRolePermissions();
    const next: RolePermissions = {
      ...current,
      [role]: { ...current[role], [key]: allowed },
    };
    write(KEYS.rolePermissions, next);
    logActivity(`Permission updated: ${role} → ${key}`);
    return next;
  },

  getRegionOptions: () => regionLocations,
};

export const emptyVehicleDraft = (): AdminVehicleDraft => ({
  name: '',
  model: '',
  brand: '',
  year: new Date().getFullYear(),
  category: 'SUV',
  image: '',
  gallery: [],
  pricePerDay: { accra: 0 },
  seats: 5,
  transmission: 'Automatic',
  fuelType: 'Petrol',
  doors: 4,
  glowColor: '#AE2119',
  description: '',
  features: [],
});
