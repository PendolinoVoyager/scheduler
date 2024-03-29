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

        
  
        </div>
          
    </div>
    `;
  }
  #generateEmployeeItem(employee: Employee): string {
    return `
    <li class="employee-item" data-id=${employee.getId()}>
                <div class="flex-row space-between">
                  <div class="flex-column">
                    <p class="employee-name">${employee.getName()}</p>
                    <p class="employee-position">${
                      employee.getPosition() || 'Brak stanowiska'
                    }</p>
                  </div>
                    <button class="box-sharp" id="btn-remove-employee" data-id="${employee.getId()}">
                    <i class="fas fa-trash"></i>
                    </button>
                </div>

      </li>
    
    `;
  }
}
