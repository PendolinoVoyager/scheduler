import state from '../state.js';

class CalendarService {
  public month: number = new Date().getMonth() + 1;
  public year: number = new Date().getFullYear();
  weekDays!: string[];

  constructor(month?: number, year?: number) {
    this.setDate(month, year);
    this.#generateWeekDays();
  }

  setDate(month?: number, year?: number) {
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
  getDateString(year: number = this.year, month: number = this.month): string {
    const timestamp = new Date(`${this.year}-${this.month}-01`).getTime();
    return Intl.DateTimeFormat('pl-PL', {
      month: 'long',
      year: 'numeric',
    }).format(timestamp);
  }
  getStartingDay(year: number = this.year, month: number = this.month): number {
    return new Date(`${year}-${month}-01`).getDay();
  }
  getNumOfDays(year: number = this.year, month: number = this.month): number {
    return new Date(year, month, 0).getDate();
  }
  #generateWeekDays() {
    const weekday = new Intl.DateTimeFormat('en', { weekday: 'short' });
    const shortWeekdays = [];

    for (let i = 1; i <= 7; i++) {
      const date = new Date(2024, 0, i); // February 2024
      const shortWeekday = weekday.format(date);
      shortWeekdays.push(shortWeekday);
    }
    this.weekDays = shortWeekdays;
  }
  isFreeDayInPoland(
    day: number,
    year: number = this.year,
    month: number = this.month
  ): boolean {
    const date = new Date(year, month - 1, day);
    return date.getDay() === 0;
  }
  getDOFName(
    year: number = this.year,
    month: number = this.month,
    day: number
  ) {
    return Intl.DateTimeFormat(navigator.language, {
      weekday: 'short',
    }).format(new Date(year, month - 1, day));
  }
  getDOW(year: number = this.year, month: number = this.month, day: number) {
    return new Date(year, month - 1, day).getDay();
  }
  nextMonth() {
    if (this.month === 12) {
      this.setDate(1, this.year + 1);
    } else {
      this.setDate(this.month + 1);
    }
  }
  prevMonth() {
    if (this.month === 1) {
      this.setDate(12, this.year - 1);
    } else {
      this.setDate(this.month - 1);
    }
  }
}
export default new CalendarService();
