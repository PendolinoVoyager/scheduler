import { CalendarData } from '../models/types.js';

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
  }
  getCalendarData(): CalendarData {
    return {
      month: this.month,
      year: this.year,
      dateString: this.getDateString(),
      startingDay: this.getStartingDay(),
      numberOfDays: this.getNumOfDays(),
    };
  }
  getDateString(): string {
    const timestamp = new Date(`${this.year}-${this.month}-01`).getTime();
    return Intl.DateTimeFormat('pl-PL', {
      month: 'long',
      year: 'numeric',
    }).format(timestamp);
  }
  getStartingDay(): number {
    return new Date(`${this.year}-${this.month}-01`).getDay();
  }
  getNumOfDays(): number {
    return new Date(this.year, this.month, 0).getDate();
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
  isFreeDayInPoland(year: number, month: number, day: number): boolean {
    const date = new Date(year, month - 1, day);
    if (date.getDay() === 7) return true;
    return false;
  }
}
export default new CalendarService();