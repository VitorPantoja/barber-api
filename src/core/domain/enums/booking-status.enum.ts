export const BOOKING_STATUS = {
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  CONFIRMED: 'CONFIRMED',
  NO_SHOW: 'NO_SHOW'
} as const;

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];
