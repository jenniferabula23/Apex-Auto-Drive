import type { Vehicle } from '../data/vehicles';

export type RentalModuleKey = 'self_drive' | 'chauffeur' | 'airport_pickup';

export type AdminVehicleDraft = Omit<Vehicle, 'id' | 'rating' | 'reviews'> & {
  id?: string;
};

export type RegionalPricing = Vehicle['pricePerDay'];

export type RentalTerm = {
  key: RentalModuleKey;
  title: string;
  content: string;
  updatedAt: string;
};

export type PickupLocation = {
  id: string;
  name: string;
  city: string;
  isActive: boolean;
  note: string;
};

export type AdminRole = 'super_admin' | 'admin' | 'manager';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AdminRole;
  status: 'active' | 'blocked';
  onDuty: boolean;
};

export type AdminActivity = {
  id: string;
  action: string;
  actor: string;
  createdAt: string;
};

export type DriverStatus = 'available' | 'on_trip' | 'off_duty';

export type Driver = {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  status: DriverStatus;
  rating: number;
  tripsCompleted: number;
};

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'unpaid' | 'invoiced' | 'paid' | 'not_required';

export type DocumentType = 'national_id' | 'passport' | 'drivers_license' | 'other';

export type Reservation = {
  id: string;
  bookingRef: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  days: number;
  pricePerDay: number;
  totalAmount: number;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  rentalModule: RentalModuleKey;
  notes: string;
  createdAt: string;
  supabaseBookingId?: string;
};

export type AdminReservationDraft = {
  customerId: string;
  vehicleId: string;
  locationKey: string;
  destinationDetails: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  pricePerDay: number;
  rentalModule: RentalModuleKey;
  notes: string;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
};

export type Payment = {
  id: string;
  reservationId: string;
  bookingRef: string;
  customerName: string;
  amount: number;
  method: 'bank_transfer' | 'mobile_money' | 'cash';
  status: PaymentStatus;
  reference: string;
  paidAt?: string;
  createdAt: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
  documentType?: DocumentType;
  documentUrl?: string;
  totalBookings: number;
  totalSpent: number;
  lastBookingAt: string;
  createdAt: string;
  status: 'active' | 'blocked';
  linkedUserId?: string;
};

export type AdminCustomerDraft = {
  name: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
  documentType: DocumentType;
  documentUrl: string;
};

export type Provider = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  vehicleCount: number;
  status: 'active' | 'inactive';
  city: string;
};

export type PermissionKey =
  | 'vehicles'
  | 'drivers'
  | 'reservations'
  | 'payments'
  | 'users'
  | 'admins'
  | 'settings';

export type RolePermissions = Record<AdminRole, Record<PermissionKey, boolean>>;

export type AdminSession = {
  email: string;
  name: string;
  role: AdminRole;
  loggedInAt: string;
};
