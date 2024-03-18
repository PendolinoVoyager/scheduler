import { CONFIG } from '../config.js';
export function getShiftHours(shift, dayOfWeek, disabled = false) {
    const startTime = ((disabled && CONFIG.SHIFT_TYPES[shift].disabled?.startTime) ||
        undefined) ??
        CONFIG.SHIFT_TYPES[shift].customHours?.find((ch) => ch.day === dayOfWeek)?.startTime ??
        CONFIG.SHIFT_TYPES[shift].startTime;
    const endTime = ((disabled && CONFIG.SHIFT_TYPES[shift].disabled?.endTime) || undefined) ??
        CONFIG.SHIFT_TYPES[shift].customHours?.find((ch) => ch.day === dayOfWeek)?.endTime ??
        CONFIG.SHIFT_TYPES[shift].endTime;
    console.log(startTime);
    return { startTime, endTime };
}
