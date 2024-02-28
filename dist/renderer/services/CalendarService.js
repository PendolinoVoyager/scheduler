var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CalendarService_instances, _CalendarService_generateWeekDays;
import state from '../state.js';
class CalendarService {
    constructor(month, year) {
        _CalendarService_instances.add(this);
        this.month = new Date().getMonth() + 1;
        this.year = new Date().getFullYear();
        this.setDate(month, year);
        __classPrivateFieldGet(this, _CalendarService_instances, "m", _CalendarService_generateWeekDays).call(this);
    }
    setDate(month, year) {
        if (month && month > 0 && month < 13) {
            this.month = month;
        }
        this.year = year ?? this.year;
        state.month = this.month;
        state.year = this.year;
    }
    getCalendarData() {
        return {
            month: this.month,
            year: this.year,
            dateString: this.getDateString(),
            startingDay: this.getStartingDay(),
            numberOfDays: this.getNumOfDays(),
        };
    }
    getDateString() {
        const timestamp = new Date(`${this.year}-${this.month}-01`).getTime();
        return Intl.DateTimeFormat('pl-PL', {
            month: 'long',
            year: 'numeric',
        }).format(timestamp);
    }
    getStartingDay() {
        return new Date(`${this.year}-${this.month}-01`).getDay();
    }
    getNumOfDays() {
        return new Date(this.year, this.month, 0).getDate();
    }
    isFreeDayInPoland(day, year = this.year, month = this.month) {
        const date = new Date(year, month - 1, day);
        if (date.getDay() === 6)
            return true;
        return false;
    }
    nextMonth() {
        if (this.month === 12) {
            this.setDate(1, this.year + 1);
        }
        else {
            this.setDate(this.month + 1);
        }
    }
    prevMonth() {
        if (this.month === 1) {
            this.setDate(12, this.year - 1);
        }
        else {
            this.setDate(this.month - 1);
        }
    }
}
_CalendarService_instances = new WeakSet(), _CalendarService_generateWeekDays = function _CalendarService_generateWeekDays() {
    const weekday = new Intl.DateTimeFormat('en', { weekday: 'short' });
    const shortWeekdays = [];
    for (let i = 1; i <= 7; i++) {
        const date = new Date(2024, 0, i); // February 2024
        const shortWeekday = weekday.format(date);
        shortWeekdays.push(shortWeekday);
    }
    this.weekDays = shortWeekdays;
};
export default new CalendarService();
