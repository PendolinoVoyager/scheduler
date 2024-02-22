import Calendar from '../models/Calendar.js';

export default class CalendarController {
  public calendarElement: HTMLElement;
  public calendar: Calendar;
  constructor() {
    this.calendarElement = document.getElementById('calendar')!;
    this.calendar = new Calendar();
    this.#addListeners();
  }
  #addListeners() {
    return;
  }
  async #fetchPreviousTheme() {
    throw new Error('Not implemented yet');
  }
}
