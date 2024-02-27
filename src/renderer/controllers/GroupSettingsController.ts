import ModalService from '../services/ModalService.js';
import { AbstractController } from './AbstractController.js';
import { renderDialog } from '../helpers/yesNoDialog.js';
import GroupSettingsView from '../views/groupSettingsViews/GroupSettingsView.js';
import EmployeeView from '../views/groupSettingsViews/EmployeeView.js';
import Employee from '../models/Employee.js';
import Group from '../models/Group.js';
import state from '../state.js';
import {
  renderEmployeeForm,
  addPositionDropdownHandlers,
} from '../helpers/renderEmployeeForm.js';
import { CONFIG } from '../config.js';
import CalendarPreviewView from '../views/groupSettingsViews/CalendarPreviewView.js';

export default class GroupSettingsController extends AbstractController {
  public modalService: ModalService;
  public btnManageGroup: HTMLElement =
    document.getElementById('btn-manage-group')!;
  public groupSettingsView: GroupSettingsView;
  public employeeView: EmployeeView | undefined;
  public CalendarPreviewView: CalendarPreviewView | undefined;
  public employeeForm: HTMLFormElement | undefined;
  public group: Group = state.group;
  public selectedEmployee: Employee | null = this.group.getEmployees()[0];
  public employeeList: HTMLElement | undefined;
  public selectedItem: HTMLElement | undefined;

  public currentMonth: number = state.month;
  public currentYear: number = state.year;

  isModifying: boolean = false;
  waitingfForDialog: boolean = false;
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

      this.#renderEmployee();
    });
  }

  async #handleSelectedEmployee(e: MouseEvent) {
    const target =
      (e.target as HTMLElement)?.closest('.employee-item') ??
      (e.target as any).closest('#employee-list-add');

    if (!target) return;

    if (target.getAttribute('id') === 'employee-list-add') {
      this.#renderEmptyForm();
      return;
    }

    const employee = this.group.findEmployee(+(target.dataset as any).id);
    if (!employee) return;
    if (this.isModifying) {
      if (this.waitingfForDialog) return false;
      this.waitingfForDialog = true;
      const res = await renderDialog('Wyjść bez zapisu?');
      this.waitingfForDialog = false;
      if (!res) return;
      this.isModifying = false;
      this.modalService.setImportant(this, false);
      this.selectedItem?.classList.remove('modified');
    }

    this.selectedEmployee = employee;

    this.#updateListItems();
    this.#renderEmployee(employee);
  }
  #renderEmployee(employee?: Employee) {
    this.employeeView = new EmployeeView(
      document.getElementById('employee-stats')!
    );
    this.employeeView.render(employee);
    (this.employeeForm as any) = document.getElementById('employee-info')!;

    if (!employee) return;

    this.#addEmployeeViewHandlers();
    this.#renderCalendarPreview();
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
    addPositionDropdownHandlers();
  }

  #handleFormInput(e: Event) {
    this.isModifying = true;
    this.modalService.setImportant(this, true);
    if (!this.employeeForm?.getAttribute('id') && e.target)
      (e.target as HTMLElement).classList.add('modified');
    this.selectedItem?.classList.add('modified');
  }
  #handleFormSubmit(e: SubmitEvent) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this.employeeForm));
    try {
      if (!this.group.getEmployees().some((emp) => emp.getId() === +data.id)) {
        this.#addAndSelectEmployee(data);
      } else this.group.findEmployee(+data.id)?.updateFromFormData(data);
    } catch (err) {
      this.#handleFormError(err as Error);
      return;
    }
    this.modalService.setImportant(this, false);
    this.isModifying = false;
    this.selectedItem?.classList.remove('modified');
    this.#renderEmployee(
      this.group.findEmployee(+this.selectedItem!.dataset.id!)
    );
  }
  #cleanup() {
    this.isModifying = false;
    this.selectedEmployee = this.group.getEmployees()[0];
    // Redundand? Maybe
    this.groupSettingsView.clear();
    this.modalService.clear();
  }
  #renderEmptyForm() {
    // Should've made it into a view but whatever
    this.employeeView?.clear();
    document
      .getElementById('employee-stats')!
      .insertAdjacentHTML('afterbegin', renderEmployeeForm());

    addPositionDropdownHandlers();

    (this.employeeForm as any) = document.getElementById('employee-info')!;
    this.selectedEmployee = null;
    this.selectedItem = undefined;
    this.#updateListItems();
    this.#addEmployeeViewHandlers();
  }
  #renderCalendarPreview() {
    const parent = document.getElementById('calendar-preview');
    if (!parent) return;
    this.CalendarPreviewView = new CalendarPreviewView(parent);
    this.CalendarPreviewView.renderSpinner();
    console.log(
      this.selectedEmployee?.getPreferencesForMonth(
        this.currentYear,
        this.currentMonth
      )
    );
    this.CalendarPreviewView.render(
      this.selectedEmployee?.getPreferencesForMonth(
        this.currentYear,
        this.currentMonth
      )
    );
  }

  #addAndSelectEmployee(data: { [k: string]: FormDataEntryValue }) {
    try {
      if (!data.name.toString().match(CONFIG.EMPLOYEE_NAME_VALIDATOR))
        throw new Error('Invalid name');

      const employee = new Employee(data.name.toString());
      (data as any).id = employee.getId();
      employee.updateFromFormData(data);
      state.group.addEmployee(employee);

      this.selectedEmployee = employee;
      this.#renderWindow();

      this.#updateListItems();

      this.#renderEmployee(employee);
    } catch (err) {
      throw err;
    }
  }
  #handleFormError(err: Error) {
    console.error(err);
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
  #updateListItems() {
    let targetedElement;
    if (this.employeeList)
      [...this.employeeList?.children].forEach((el) => {
        el.classList.remove('employee-selected');
        if (
          this.selectedEmployee &&
          +(el as any).dataset.id === this.selectedEmployee.getId()
        )
          targetedElement = el;
      });
    if (!targetedElement) return;

    (targetedElement as HTMLElement).classList.add('employee-selected');
    this.selectedItem = targetedElement as any;
  }
}
