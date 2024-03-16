import View from '../View.js';
import { renderEmployeeForm } from '../../helpers/renderEmployeeForm.js';
export default class EmployeeView extends View {
    constructor(parentElement) {
        super(parentElement);
        this.data = null;
    }
    generateMarkup() {
        if (!this.data)
            return '<h2>Wybierz lub dodaj pracownika</h2>';
        return `
      <div class="container-card" id="employee-manage">
        ${renderEmployeeForm(this.data)}
  

        <div id="calendar-preview" class="container-card">

        </div>
    </div>

    `;
    }
}
