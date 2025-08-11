import { EARLY_REMINDER, PRIORITY, REPEAT } from "@/types/enum";

export const SCHEMA_LINK = 'reminderapp'

//screens
export const SCREENS = {
  HOME: 'Home',
  REMINDERS: 'Reminders',
  NEW_REMINDER_SHEET: 'NewReminderSheet',
  DETAILS_REMINDER_SHEET: 'DetailsReminderSheet',
  COMPLETED_REMINDER: 'CompletedReminder',
  EXAMPLE: 'Example',
  LIST_REMINDER_OVERVIEW: 'ListReminderOverview',
};

//colors new list
export const COLORS_NEW_LIST = [
  '#f44336',
  '#ff9800',
  '#ffeb3b',
  '#4caf50',
  '#03C5FA',
  '#3f51b5',
  '#673ab7',
  '#e91e63',
  '#795548',
  '#607d8b',
];

//icons new list
export const ICONS_NEW_LIST = [
  'directions-run',
  'bookmark',
  'key',
  'redeem',
  'notifications',
  'work',
  'book',
  'calendar-today',
  'star',
  'flag',
  'music-note',
  'tv'
];

//menuPriority
export const MENU_PRIORITY = [
  PRIORITY.NOTHING,
  PRIORITY.LOW,
  PRIORITY.MEDIUM,
  PRIORITY.HIGH,
];

export const MENU_REPEAT = [
  REPEAT.NOTHING,
  REPEAT.FIVE_MINUTES,
  REPEAT.THIRTY_MINUTES,
  REPEAT.ONE_HOUR,
  REPEAT.DAILY,
  REPEAT.WEEKLY,
  REPEAT.MONTHLY,
  // REPEAT.CUSTOM
]

export const MENU_EARLY_REMINDER = [
  EARLY_REMINDER.NOTHING,
  EARLY_REMINDER.BEFORE_FIVE_MINUTES,
  EARLY_REMINDER.BEFORE_FIFTEEN_MINUTES,
  EARLY_REMINDER.BEFORE_THIRTY_MINUTES,
  EARLY_REMINDER.BEFORE_ONE_DAY,
  EARLY_REMINDER.BEFORE_ONE_WEEK,
  EARLY_REMINDER.BEFORE_ONE_MONTH,
  // EARLY_REMINDER.CUSTOM
]

export const EARLY_REMINDER_OFFSET_MINUTES: Record<EARLY_REMINDER, number> = {
  [EARLY_REMINDER.NOTHING]: 0,
  [EARLY_REMINDER.BEFORE_FIVE_MINUTES]: 5,
  [EARLY_REMINDER.BEFORE_FIFTEEN_MINUTES]: 15,
  [EARLY_REMINDER.BEFORE_THIRTY_MINUTES]: 30,
  [EARLY_REMINDER.BEFORE_ONE_HOUR]: 60,
  [EARLY_REMINDER.BEFORE_ONE_DAY]: 60 * 24,
  [EARLY_REMINDER.BEFORE_ONE_WEEK]: 60 * 24 * 7,
  [EARLY_REMINDER.BEFORE_ONE_MONTH]: 60 * 24 * 30, // 30 ngày
  // [EARLY_REMINDER.CUSTOM]: 0,
};

export const REPEAT_OFFSET_MINUTES: Record<REPEAT, number> = {
  [REPEAT.NOTHING]: 0,
  [REPEAT.FIVE_MINUTES]: 5,
  [REPEAT.THIRTY_MINUTES]: 30,
  [REPEAT.ONE_HOUR]: 60,
  [REPEAT.DAILY]: 60 * 24,
  [REPEAT.WEEKLY]: 60 * 24 * 7,
  [REPEAT.MONTHLY]: 60 * 24 * 30, // 30 ngày
  // [REPEAT.CUSTOM]: 0,
};