import Calendar from '../services/CalendarService.js';
import { AbstractController } from './AbstractController.js';

export default class CalendarController extends AbstractController {
  public calendarElement: HTMLElement;
  constructor() {
    super();
    this.calendarElement = document.getElementById('calendar')!;
    this.#addListeners();
  }
  #addListeners() {
    return;
  }
  async #fetchPreviousTheme() {
    throw new Error('Not implemented yet');
  }
}
