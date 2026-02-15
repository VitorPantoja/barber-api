export const DAY_OF_WEEK = {
  FRIDAY: 'FRIDAY',
  MONDAY: 'MONDAY',
  SATURDAY: 'SATURDAY',
  SUNDAY: 'SUNDAY',
  THURSDAY: 'THURSDAY',
  TUESDAY: 'TUESDAY',
  WEDNESDAY: 'WEDNESDAY'
} as const;

export type DayOfWeek = (typeof DAY_OF_WEEK)[keyof typeof DAY_OF_WEEK];
