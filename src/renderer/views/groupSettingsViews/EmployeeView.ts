import Employee from '../../models/Employee.js';
import View from '../View.js';
import { renderEmployeeForm } from '../../helpers/renderEmployeeForm.js';
import { CONFIG } from '../../config.js';
export default class EmployeeView extends View {
  public data: Employee | null = null;
  constructor(parentElement: HTMLElement) {
    super(parentElement);
  }
  generateMarkup(): string {
    if (!this.data) return '<h2>Wybierz lub dodaj pracownika</h2>';

    return `
      <div class="container-card" id="employee-manage">
        ${renderEmployeeForm(this.data)}
  

        <div id="calendar-preview">

        </div>
    </div>

    `;
  }
}
