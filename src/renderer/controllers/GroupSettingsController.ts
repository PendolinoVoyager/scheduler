import ModalService from '../services/ModalService.js';
import { AbstractController } from './AbstractController.js';
import { renderDialog } from '../helpers/yesNoDialog.js';
import GroupSettingsView from '../views/groupSettingsViews/GroupSettingsView.js';
import EmployeeView from '../views/groupSettingsViews/EmployeeView.js';
import Employee from '../models/Employee.js';
import Group from '../models/Group.js';
import {
  renderEmployeeForm,
  addPositionDropdownHandlers,
} from '../helpers/renderEmployeeForm.js';
import CalendarPreviewView from '../views/groupSettingsViews/CalendarPreviewView.js';
import CalendarService from '../services/CalendarService.js';
import { daySpanFromForm } from '../helpers/daySpanFromForm.js';
import FormError from '../errors/FormError.js';
import HoverBoxService from '../services/HoverBox.js';
import { CONFIG } from '../config.js';
import { App } from '../app.js';
import DragList from '../helpers/DragList.js';

export default class GroupSettingsController extends AbstractController {
  public modalService: typeof ModalService;
  public btnManageGroup: HTMLElement =
    document.getElementById('btn-manage-group')!;
  public groupSettingsView: GroupSettingsView;
  public employeeView: EmployeeView | undefined;
  public CalendarPreviewView: CalendarPreviewView | undefined;
  public employeeForm: HTMLFormElement | undefined;
  public group: Group = this.app.state.group;
  public selectedEmployee: Employee | null = this.group.getEmployees()[0];
  public employeeList: HTMLElement | undefined;
  public selectedItem: HTMLElement | undefined;
  isModifying: boolean = false;
  waitingfForDialog: boolean = false;
  hoverBoxService: typeof HoverBoxService;

  constructor(private app: App) {
    super();
    this.modalService = ModalService;
    this.hoverBoxService = HoverBoxService;
    this.groupSettingsView = new GroupSettingsView(
      this.modalService.getWriteableElement()
    );

    this.#init();
  }

  #init() {
    this.btnManageGroup.addEventListener('click', (e) => {
      this.modalService.open(this, false);
      this.modalService.setOnClose(this, this.boundHandlers.cleanup);

      this.#renderWindow();

      this.#renderEmployee();
    });
  }

  async #handleSelectedEmployee(e: MouseEvent) {
    const target =
      (e.target as any).closest('#btn-remove-employee') ??
      (e.target as HTMLElement)?.closest('.employee-item') ??
      (e.target as any).closest('#employee-list-add');
    if (!target) return;

    if (target.getAttribute('id') === 'btn-remove-employee') {
      this.#handleEmployeeRemove(target);
      return;
    }

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

    this.hoverBoxService.removeMany('form-error');
    if (target.getAttribute('id') === 'employee-list-add') {
      this.#renderEmptyForm();
      return;
    }

    const employee = this.group.findEmployee(+(target.dataset as any).id);
    if (!employee) return;
    this.selectedEmployee = employee;

    this.#renderEmployee(employee);
  }
  async #handleEmployeeRemove(target: HTMLElement) {
    const targetEmployee = this.group.findEmployee(+(target.dataset as any).id);
    if (!targetEmployee) throw new Error('Something went wrong!');

    let res = await renderDialog(
      `Na pewno usunąć pracownika ${targetEmployee.getName()}?`
    );
    if (!res) return;
    res = await renderDialog(
      `🟥 Na pewno usunąć pracownika ${targetEmployee.getName()}? 🟥`
    );
    if (!res) return;
    this.group.removeEmployee(+(target.dataset as any).id);
    this.app.dispatchEvent(new CustomEvent('remove-employee'));
    this.modalService.clear();

    this.groupSettingsView.render(this.group.getEmployees());

    this.#renderWindow();

    this.#renderEmployee();
  }
  #renderEmployee(employee?: Employee) {
    this.employeeView = new EmployeeView(
      document.getElementById('employee-stats-container')!
    );
    this.employeeView.render(employee);
    (this.employeeForm as any) = document.getElementById('employee-info')!;

    if (!employee) return;
    this.#updateListItems();

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
    document
      .getElementById('plan-shifts')
      ?.addEventListener('submit', this.boundHandlers.handlePlanSubmit);
    // Add Planning input

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
    const formData = new FormData(this.employeeForm);
    try {
      if (!this.employeeForm) throw new Error('Form tampered');
      const targetEmployee = this.group.findEmployee(+formData.get('id')!);
      if (targetEmployee) targetEmployee.updateFromFormData(this.employeeForm);
      else {
        this.#addAndSelectEmployee();
      }
    } catch (err) {
      if (err instanceof FormError) return;
      else throw err;
    }
    this.modalService.setImportant(this, false);
    this.isModifying = false;
    this.selectedItem?.classList.remove('modified');
    this.#renderWindow();
    this.#updateListItems();
    this.#renderEmployee(
      this.group.findEmployee(this.selectedEmployee!.getId())
    );
  }
  #cleanup() {
    this.isModifying = false;
    this.selectedEmployee = this.group.getEmployees()[0];
    this.hoverBoxService.removeMany('form-error');
    // Redundand? Maybe
    this.groupSettingsView.clear();
    this.modalService.clear();
    this.app.dispatchEvent(new CustomEvent('settings-update'));
  }
  #renderEmptyForm() {
    // Should've made it into a view but whatever
    this.employeeView?.clear();
    document
      .getElementById('employee-stats-container')!
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
    if (!parent) throw new Error('Something went wrong!');
    this.CalendarPreviewView = new CalendarPreviewView(parent);
    this.CalendarPreviewView.renderSpinner();

    const calendarData = this.selectedEmployee!.getPreferencesForMonth(
      this.app.state.year,
      this.app.state.month
    );

    this.CalendarPreviewView.render(calendarData);
    const btnPrev = this.modalService
      .getWriteableElement()
      .querySelector('#btn-month-prev');
    const btnNext = this.modalService
      .getWriteableElement()
      .querySelector('#btn-month-next');
    if (!btnPrev || !btnNext) throw new Error('Something went wrong!');

    btnPrev.addEventListener('click', () => {
      CalendarService.prevMonth();
      this.#renderCalendarPreview();
    });

    btnNext.addEventListener('click', () => {
      CalendarService.nextMonth();
      this.#renderCalendarPreview();
    });
  }

  #addAndSelectEmployee() {
    try {
      const employee = new Employee();
      if (!this.employeeForm) throw new Error('Stop doing this, please.');
      const idElement = this.employeeForm.querySelector(
        '[name="id"]'
      ) as HTMLInputElement;
      if (!idElement) return;
      idElement.value = employee.getId().toString();
      employee.updateFromFormData(this.employeeForm);
      this.app.state.group.addEmployee(employee);

      this.selectedEmployee = employee;
      this.app.dispatchEvent(new CustomEvent('add-employee'));
    } catch (err) {
      throw err;
    }
  }

  boundHandlers = {
    handleSelectedEmployee: this.#handleSelectedEmployee.bind(this),
    handleFormInput: this.#handleFormInput.bind(this),
    handleFormSubmit: this.#handleFormSubmit.bind(this),
    renderEmptyForm: this.#renderEmptyForm.bind(this),
    handlePlanSubmit: this.#handlePlanSubmit.bind(this),
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
  async #handlePlanSubmit(e: SubmitEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    if (!form) return;
    try {
      const data = new FormData(form);
      const parsedData = {
        shiftType: data.get('plannedShift')?.toString()!,
        start: data.get('begin')!.toString(),
        end: data.get('end')!.toString(),
      };
      const dayspan = daySpanFromForm(parsedData.start, parsedData.end);
      const res = await renderDialog(
        `Zatwierdzić ${
          CONFIG.SHIFT_TYPES[parsedData.shiftType].translation
        } w okresie ${parsedData.start} - ${
          parsedData.end
        } dla ${this.selectedEmployee?.getName()}?`
      );
      if (!res) return;
      dayspan.forEach((d) => {
        this.selectedEmployee?.addCustomPreference(
          d.year,
          d.month,
          d.day,
          parsedData.shiftType
        );
      });
      this.#renderCalendarPreview();
    } catch (err) {
      return;
    }
  }
}
