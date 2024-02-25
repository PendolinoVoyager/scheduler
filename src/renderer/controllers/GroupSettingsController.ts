import ModalService from '../services/ModalService.js';
import { AbstractController } from './AbstractController.js';
import { renderDialog } from '../helpers/yesNoDialog.js';
import GroupSettingsView from '../views/groupSettingsViews/GroupSettingsView.js';
import EmployeeView from '../views/groupSettingsViews/EmployeeView.js';
import Employee from '../models/Employee.js';
import Group from '../models/Group.js';
import state from '../state.js';
import { renderEmployeeForm } from '../helpers/renderEmployeeForm.js';

export default class GroupSettingsController extends AbstractController {
  public modalService: ModalService;
  public btnManageGroup: HTMLElement =
    document.getElementById('btn-manage-group')!;
  public groupSettingsView: GroupSettingsView;
  public employeeView: EmployeeView | undefined;
  public employeeForm: HTMLFormElement | undefined;
  public group: Group = state.group;
  public selectedEmployee: Employee = this.group.getEmployees()[0];
  public employeeList: HTMLElement | undefined;
  public selectedItem: HTMLElement | undefined;
  isModifying: boolean = false;
  waitinfForDialog: boolean = false;
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
      this.modalService.setOnClose(this, this.boundHandlers.cleanup);

      this.groupSettingsView.render(this.group.getEmployees());

      this.#renderWindow();

      document
        .getElementById('employee-list-add')!
        .addEventListener('click', this.boundHandlers.renderEmptyForm);

      this.#renderEmployee();
    });
  }

  async #handleSelectedEmployee(e: MouseEvent) {
    const target = (e.target as HTMLElement)?.closest('.employee-item');
    if (!target) return;

    if (!('dataset' in target)) return; // Check if dataset exists
    const employee = this.group.findEmployee(+(target.dataset as any).id);
    if (!employee) return;

    if (this.isModifying) {
      if (this.waitinfForDialog) return false;
      this.waitinfForDialog = true;
      const res = await renderDialog('Wyjść bez zapisu?');
      this.waitinfForDialog = false;
      if (!res) return;
      this.isModifying = false;
      this.modalService.setImportant(this, false);
      this.selectedItem?.classList.remove('modified');
    }

    if (this.employeeList)
      [...this.employeeList?.children].forEach((el) =>
        el.classList.remove('employee-selected')
      );
    target.classList.add('employee-selected');
    this.selectedItem = target as HTMLElement;
    this.#renderEmployee(employee);
  }
  #renderEmployee(employee?: Employee) {
    // Remove the event listener from previous render
    this.#removeEmployeeViewHandlers();

    this.employeeView = new EmployeeView(
      document.getElementById('employee-stats')!
    );
    this.employeeView.render(employee);
    (this.employeeForm as any) = document.getElementById('employee-info')!;

    this.#addEmployeeViewHandlers();
  }
  #addEmployeeViewHandlers() {
    this.employeeForm?.addEventListener(
      'input',
      this.boundHandlers.handleFormInput
    );
    this.employeeForm?.addEventListener(
      'submit',
      this.boundHandlers.handleFormSubmit
    );
  }
  #removeEmployeeViewHandlers() {
    this.employeeForm?.removeEventListener(
      'input',
      this.boundHandlers.handleFormInput
    );
    this.employeeForm?.removeEventListener(
      'submit',
      this.boundHandlers.handleFormSubmit
    );
  }
  #handleFormInput(e: any) {
    this.isModifying = true;
    this.modalService.setImportant(this, true);
    e.target.classList.add('modified');
    this.selectedItem?.classList.add('modified');
  }
  #handleFormSubmit(e: SubmitEvent) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this.employeeForm));
    if (isNaN(+data.id)) {
      this.#addAndSelectEmployee(data);
    } else this.group.findEmployee(+data.id)?.updateFromFormData(data);
    this.modalService.setImportant(this, false);
    this.isModifying = false;
    this.selectedItem?.classList.remove('modified');
    this.#renderEmployee(
      this.group.findEmployee(+this.selectedItem!.dataset.id!)
    );
  }
  #cleanup() {
    this.#removeEmployeeViewHandlers();
    this.employeeList?.removeEventListener(
      'click',
      this.boundHandlers.handleSelectedEmployee
    );

    document
      .getElementById('employee-list-add')!
      .removeEventListener('click', this.boundHandlers.renderEmptyForm);

    this.isModifying = false;
    this.modalService.clear();
  }
  #renderEmptyForm() {
    this.#removeEmployeeViewHandlers();
    this.employeeView?.clear();
    document
      .getElementById('employee-stats')!
      .insertAdjacentHTML('afterbegin', renderEmployeeForm());

    (this.employeeForm as any) = document.getElementById('employee-info')!;

    this.#addEmployeeViewHandlers();
  }

  #addAndSelectEmployee(data: { [k: string]: FormDataEntryValue }) {
    const employee = new Employee(data.name.toString());
    employee.updateFromFormData(data);
    state.group.addEmployee(employee);

    this.#renderWindow();

    let targetedElement;
    if (this.employeeList)
      [...this.employeeList?.children].forEach((el) => {
        el.classList.remove('employee-selected');
        if (+(el as any).dataset.id === employee.getId()) targetedElement = el;
      });
    targetedElement!.classList.add('employee-selected');
    this.selectedItem = targetedElement as any;
    this.#renderEmployee(employee);
  }

  boundHandlers = {
    handleSelectedEmployee: this.#handleSelectedEmployee.bind(this),
    handleFormInput: this.#handleFormInput.bind(this),
    handleFormSubmit: this.#handleFormSubmit.bind(this),
    renderEmptyForm: this.#renderEmptyForm.bind(this),
    renderWindow: this.#renderWindow.bind(this),
    cleanup: this.#cleanup.bind(this),
  };
  #renderWindow() {
    this.groupSettingsView.render(this.group.getEmployees());
    this.employeeList = document.getElementById('employee-list')!;

    this.employeeList.addEventListener(
      'click',
      this.boundHandlers.handleSelectedEmployee
    );
  }
}
