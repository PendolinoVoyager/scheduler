import ModalService from '../services/ModalService.js';
import { AbstractController } from './AbstractController.js';
import GroupSettingsView from '../views/groupSettingsViews/GroupSettingsView.js';
import EmployeeView from '../views/groupSettingsViews/EmployeeView.js';
import Employee from '../models/Employee.js';
import Group from '../models/Group.js';
import state from '../state.js';

export default class GroupSettingsController extends AbstractController {
  public modalService: ModalService;
  public btnManageGroup: HTMLElement =
    document.getElementById('btn-manage-group')!;
  public groupSettingsView: GroupSettingsView;
  public employeeView: EmployeeView | undefined;
  public employeeForm: HTMLElement | undefined;
  public group: Group = state.group;
  employeeItems: HTMLElement | undefined;

  constructor(modalService: ModalService) {
    super();
    this.modalService = modalService;
    this.groupSettingsView = new GroupSettingsView(
      modalService.getWriteableElement()
    );

    this.#addHandlers();
  }

  #addHandlers() {
    this.btnManageGroup.addEventListener('click', (e) => {
      this.modalService.open(this, false);
      this.groupSettingsView.render(this.group.getEmployees());
      this.employeeItems = document.getElementById('employee-list')!;
      document
        .getElementById('employee-list')!
        .addEventListener('click', this.boundHandlers.handleSelectedEmployee);
      this.#renderEmployee();
    });
  }
  boundHandlers = {
    handleSelectedEmployee: this.#handleSelectedEmployee.bind(this),
  };
  #handleSelectedEmployee(e: MouseEvent) {
    const target = (e.target as HTMLElement)?.closest('.employee-item');
    if (!target) return;
    if (!('dataset' in target)) return; // Check if dataset exists
    // for the love of god I need to rtfm on typescript
    const employee = this.group.findEmployee(+(target.dataset as any).id);
    if (this.employeeItems)
      [...this.employeeItems?.children].forEach((el) =>
        el.classList.remove('employee-selected')
      );

    target.classList.add('employee-selected');

    this.#renderEmployee(employee);
  }
  #renderEmployee(employee?: Employee) {
    this.employeeForm = document.getElementById('employee-stats')!;
    this.employeeView = new EmployeeView(this.employeeForm);
    this.employeeView.render(employee);
  }
  #onChangeEmployee() {}

  #onClose() {}
  #onInput() {}
  #onSubmit() {}
}
