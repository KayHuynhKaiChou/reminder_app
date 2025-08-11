import dayjs from 'dayjs';
import uuid from 'react-native-uuid';
import 'dayjs/locale/vi';
import { EARLY_REMINDER, REPEAT } from '@/types/enum';
import { EARLY_REMINDER_OFFSET_MINUTES, REPEAT_OFFSET_MINUTES } from '@/constants';
dayjs.locale('vi');

export const generateUuid = () => {
  const id = uuid.v4().replace(/-/g, '')
  return id
}

export const getRoundedTime = () => {
  const now = new Date();
  const minutes = now.getMinutes();
  const remainder = minutes % 5;
  const roundedMinutes = remainder === 0 ? minutes : minutes + (5 - remainder);

  // nếu roundedMinutes >= 60 thì tăng giờ
  if (roundedMinutes >= 60) {
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
  } else {
    now.setMinutes(roundedMinutes);
  }

  now.setSeconds(0);
  now.setMilliseconds(0);

  return now;
};

export const getDateLabel = (date: Date | string) => {
  const today = dayjs().startOf('day');
  const selected = dayjs(date).startOf('day');

  const diff = selected.diff(today, 'day');

  switch (diff) {
    case -2:
      return 'The day before yesterday';
    case -1:
      return 'Yesterday';
    case 0:
      return 'Today';
    case 1:
      return 'Tomorrow';
    case 2:
      return 'The day after tomorrow';
    default:
      return selected.format('DD/MM/YYYY');
  }
};

export const formatTime = (time: Date) => {
  return time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // hoặc true nếu bạn muốn hiển thị AM/PM
  })
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase();
}

export function combineDateAndTime(date: string, time: string) {
  const dateObj = new Date(date);
  const timeObj = new Date(time); // chỉ dùng giờ & phút

  const combinedDateTime = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate(),
    timeObj.getHours(),
    timeObj.getMinutes(),
    timeObj.getSeconds()
  );

  return combinedDateTime
}

/**
 * Tính thời điểm lặp tiếp theo dựa trên thời điểm gốc và kiểu lặp.
 * @param baseTimestamp - Thời điểm gốc (milliseconds)
 * @param repeat - Kiểu lặp lại
 * @param fromTimestamp - Thời điểm hiện tại hoặc thời điểm bấm "completed" (default là Date.now())
 * @returns timestamp mới (milliseconds)
 */
export function getNextRepeatTimeWhenCompleted(
  baseTimestamp: number,
  repeat: REPEAT,
  fromTimestamp: number = Date.now()
): string | null {
  if (repeat === REPEAT.NOTHING) return null;

  let intervalMs = 0;
  switch (repeat) {
    case REPEAT.FIVE_MINUTES:
      intervalMs = 5 * 60 * 1000;
      break;
    case REPEAT.THIRTY_MINUTES:
      intervalMs = 30 * 60 * 1000;
      break;
    case REPEAT.ONE_HOUR:
      intervalMs = 60 * 60 * 1000;
      break;
    case REPEAT.DAILY:
      intervalMs = 24 * 60 * 60 * 1000;
      break;
    case REPEAT.WEEKLY:
      intervalMs = 7 * 24 * 60 * 60 * 1000;
      break;
    case REPEAT.MONTHLY:
      const nextMonth = computeNextMonthly(baseTimestamp, fromTimestamp)
      return new Date(nextMonth).toISOString();
  }

  const elapsed = fromTimestamp - baseTimestamp;
  const n = Math.ceil(elapsed / intervalMs);
  return new Date(baseTimestamp + n * intervalMs).toISOString();
}

/**
 * Tính thời điểm lặp tiếp theo theo tháng.
 * Lấy ngày/tháng của base, tạo bản mới ở tháng tiếp theo hoặc xa hơn nếu cần.
 */
function computeNextMonthly(baseTimestamp: number, fromTimestamp: number): number {
  const baseDate = new Date(baseTimestamp);

  let year = baseDate.getFullYear();
  let month = baseDate.getMonth();
  const day = baseDate.getDate();
  const hour = baseDate.getHours();
  const minute = baseDate.getMinutes();
  const second = baseDate.getSeconds();

  // Tăng tháng cho đến khi date > fromDate
  let candidateDate = new Date(year, month, day, hour, minute, second);
  while (candidateDate.getTime() <= fromTimestamp) {
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
    candidateDate = new Date(year, month, day, hour, minute, second);
  }

  return candidateDate.getTime();
}

export function getNextRepeatTime(
  originalTime: string | Date | dayjs.Dayjs,
  currentTime: string | Date | dayjs.Dayjs,
  repeat: REPEAT
): dayjs.Dayjs {
  const start = dayjs(originalTime);
  const now = dayjs(currentTime);
  
  const intervalMinutes = REPEAT_OFFSET_MINUTES[repeat];

  if (now.isBefore(start)) {
    return start; // chưa đến giờ gốc thì trả lại giờ gốc
  }

  const diff = now.diff(start, 'minute');
  const missedCount = Math.floor(diff / intervalMinutes);
  const nextTime = start.add((missedCount + 1) * intervalMinutes, 'minute');

  return nextTime;
}

export function checkShowEarlyReminderWarning(
  now: string | Date,
  reminderTime: string | Date,
  earlyReminder: EARLY_REMINDER
): boolean {
  if (earlyReminder === EARLY_REMINDER.NOTHING) return false;

  const current = dayjs(now);
  const target = dayjs(reminderTime);

  const offsetMinutes = EARLY_REMINDER_OFFSET_MINUTES[earlyReminder];
  const earlyReminderTime = target.subtract(offsetMinutes, 'minute');

  return earlyReminderTime.isBefore(current);
}

