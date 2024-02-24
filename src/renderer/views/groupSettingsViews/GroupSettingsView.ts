import Employee from '../../models/Employee.js';
import View from '../View.js';

export default class GroupSettingsView extends View {
  public data: Employee[] = [];
  constructor(parentElement: HTMLElement) {
    super(parentElement);
  }
  generateMarkup(): string {
    const employee = { name: 'dasd', position: 'dads', id: 'dsd' };
    return `
    <h1 class="text-gradient">Zarządzaj grupą pracowników</h1>
    <div id="employee-container">
        <ul id="employee-list">
            <li class="employee-item employee-selected">
                <p class="employee-name">${employee.name}</p>
                <p class="employee-position">${employee.position}</p>
            </li>

            <li id="employee-list-add" class="box-sharp">
                <i class="fas fa-plus"></i>
            </li>
        </ul>
        <form id="employee-stats">


        </form>
    </div>
    `;
  }
}
