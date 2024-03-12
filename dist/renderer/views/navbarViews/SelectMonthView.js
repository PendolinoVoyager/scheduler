import View from '../View.js';
export default class SelectMonthView extends View {
    constructor(parentElement) {
        super(parentElement);
    }
    generateMarkup() {
        return `<h1 class="text-gradient">Wybierz miesiąc i rok</h1>
    <form class="container-card flex-row space-evenly" name="change-month">
      <input type="month" name="date" value="${this.data.year ?? new Date().getFullYear()}-${this.data.month ?? (new Date().getMonth() + 1).toString().padStart(2, '0')}"></input>
      <button class="box-sharp" type="submit">Wybierz</button>
      </form>
      <h2>Pamiętaj o zapisaniu swojej poprzedniej pracy.</h2>
    
    `;
    }
}
