import Employee from '../../models/Employee.js';
import { ValidatorNotice } from '../../services/ScheduleValidator.js';
import View from '../View.js';

export default class ValidatorUtilsView extends View {
  data!: { notices: ValidatorNotice[]; employees: Employee[] };
  constructor(parentElement: HTMLElement) {
    super(parentElement);
  }

  generateMarkup(): string {
    return `
    <ul class="flex-row">
        ${this.data.notices.map(this.#generateNotice.bind(this)).join('')}
    </ul>
    `;
  }
  #generateNotice(notice: ValidatorNotice) {
    return `
    <li class="validator-notice">
        ${notice.description.replace(
          notice.employee.toString(),
          `<span class="employee-position">${this.data.employees
            .find((emp) => emp.getId() === notice.employee)!
            .getName()}</span>`
        )}
    </li>

    `;
  }
}
