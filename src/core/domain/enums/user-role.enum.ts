export const USER_ROLE = {
  ADMIN: 'ADMIN',
  BARBER: 'BARBER',
  COMPANY_ADMIN: 'COMPANY_ADMIN',
  CUSTOMER: 'CUSTOMER'
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
