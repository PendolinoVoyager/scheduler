import View from '../View.js';

export default class SelectMonthView extends View {
  data: undefined;
  constructor(parentElement: HTMLElement) {
    super(parentElement);
  }

  generateMarkup(): string {
    return `<h1>HAHAHA</h1>`;
  }
}
