import Employee from '../../models/Employee.js';
import View from '../View.js';

export default class GroupSettingsView extends View {
  public data: Employee[] = [];
  constructor(parentElement: HTMLElement) {
    super(parentElement);
  }
  generateMarkup(): string {
    return `
    <h1 class="text-gradient">Zarządzaj grupą pracowników</h1>

    <div id="employee-container">
        <ul id="employee-list">

            ${this.data.map(this.#generateEmployeeItem).join('<br>')}

            <li id="employee-list-add" class="box-sharp">
                <i class="fas fa-plus"></i>
            </li>
        </ul>
      <div id="employee-stats-container">
        <form id="employee-stats">


        </form>
      </div>
        
    </div>
    `;
  }
  #generateEmployeeItem(employee: Employee): string {
    return `
    <li class="employee-item" data-id=${employee.getId()}>
                <p class="employee-name">${employee.getName()}</p>
                <p class="employee-position">${
                  employee.getPosition() || 'Brak stanowiska'
                }</p>
      </li>
    
    `;
  }
}
