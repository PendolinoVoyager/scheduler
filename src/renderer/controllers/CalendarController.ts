import Calendar from '../services/CalendarService.js';
import { AbstractController } from './AbstractController.js';

export default class CalendarController extends AbstractController {
  public calendarElement: HTMLElement;
  public calendar: Calendar;
  constructor() {
    super();
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
