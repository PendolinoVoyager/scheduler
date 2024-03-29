var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CalendarService_instances, _CalendarService_generateWeekDays;
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
    getDateString(year = this.year, month = this.month) {
        const timestamp = new Date(`${year}-${month}-01`).getTime();
        return Intl.DateTimeFormat('pl-PL', {
            month: 'long',
            year: 'numeric',
        }).format(timestamp);
    }
    getStartingDay(year = this.year, month = this.month) {
        return new Date(`${year}-${month}-01`).getDay();
    }
    getNumOfDays(year = this.year, month = this.month) {
        return new Date(year, month, 0).getDate();
    }
    isFreeDayInPoland(day, year = this.year, month = this.month) {
        const date = new Date(year, month - 1, day);
        return date.getDay() === 0;
    }
    getDOFName(year = this.year, month = this.month, day) {
        return Intl.DateTimeFormat(navigator.language, {
            weekday: 'short',
        }).format(new Date(year, month - 1, day));
    }
    getDOW(year = this.year, month = this.month, day) {
        return new Date(year, month - 1, day).getDay();
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
