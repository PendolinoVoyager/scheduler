import View from './View.js';

export default class CalendarView extends View {
  public data: any;
  constructor() {
    super(document.getElementById('calendar')!);
  }
}
