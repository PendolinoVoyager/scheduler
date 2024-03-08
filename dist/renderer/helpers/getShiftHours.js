import { CONFIG } from '../config.js';
export function getShiftHours(shift, dayOfWeek) {
    const startTime = CONFIG.SHIFT_TYPES[shift].customHours?.find((ch) => ch.day === dayOfWeek)?.startTime ?? CONFIG.SHIFT_TYPES[shift].startTime;
    const endTime = CONFIG.SHIFT_TYPES[shift].customHours?.find((ch) => ch.day === dayOfWeek)?.endTime ?? CONFIG.SHIFT_TYPES[shift].endTime;
    return { startTime, endTime };
}
