import { CONFIG } from '../config.js';
import { ShiftTypes } from '../models/types.js';

export function getShiftHours(
  shift: keyof ShiftTypes,
  dayOfWeek?: number,
  disabled: boolean = false
) {
  const startTime =
    ((disabled && CONFIG.SHIFT_TYPES[shift].disabled?.startTime) ||
      undefined) ??
    CONFIG.SHIFT_TYPES[shift].customHours?.find(
      (ch: { day: number }) => ch.day === dayOfWeek
    )?.startTime ??
    CONFIG.SHIFT_TYPES[shift].startTime;
  const endTime =
    ((disabled && CONFIG.SHIFT_TYPES[shift].disabled?.endTime) || undefined) ??
    CONFIG.SHIFT_TYPES[shift].customHours?.find(
      (ch: { day: number }) => ch.day === dayOfWeek
    )?.endTime ??
    CONFIG.SHIFT_TYPES[shift].endTime;
  return { startTime, endTime };
}
