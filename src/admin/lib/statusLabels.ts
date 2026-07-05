import type { PaymentStatus, ReservationStatus } from '../types';

export const reservationStatusLabel: Record<ReservationStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const paymentStatusLabel: Record<PaymentStatus, string> = {
  unpaid: 'Unpaid',
  invoiced: 'Invoice Sent',
  paid: 'Paid',
  not_required: 'No Payment Required',
};
