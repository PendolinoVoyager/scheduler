var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GroupSettingsController_instances, _GroupSettingsController_init, _GroupSettingsController_handleSelectedEmployee, _GroupSettingsController_handleEmployeeRemove, _GroupSettingsController_renderEmployee, _GroupSettingsController_addEmployeeViewHandlers, _GroupSettingsController_handleFormInput, _GroupSettingsController_handleFormSubmit, _GroupSettingsController_cleanup, _GroupSettingsController_renderEmptyForm, _GroupSettingsController_renderCalendarPreview, _GroupSettingsController_addAndSelectEmployee, _GroupSettingsController_renderWindow, _GroupSettingsController_updateListItems, _GroupSettingsController_handlePlanSubmit;
import ModalService from '../services/ModalService.js';
import { AbstractController } from './AbstractController.js';
import { renderDialog } from '../helpers/yesNoDialog.js';
import GroupSettingsView from '../views/groupSettingsViews/GroupSettingsView.js';
import EmployeeView from '../views/groupSettingsViews/EmployeeView.js';
import Employee from '../models/Employee.js';
import state from '../state.js';
import { renderEmployeeForm, addPositionDropdownHandlers, } from '../helpers/renderEmployeeForm.js';
import CalendarPreviewView from '../views/groupSettingsViews/CalendarPreviewView.js';
import CalendarService from '../services/CalendarService.js';
import { daySpanFromForm } from '../helpers/daySpanFromForm.js';
import FormError from '../errors/FormError.js';
import HoverBoxService from '../services/HoverBoxService.js';
import { CONFIG } from '../config.js';
class GroupSettingsController extends AbstractController {
    constructor() {
        super();
        _GroupSettingsController_instances.add(this);
        this.btnManageGroup = document.getElementById('btn-manage-group');
        this.group = state.group;
        this.selectedEmployee = this.group.getEmployees()[0];
        this.isModifying = false;
        this.waitingfForDialog = false;
        this.boundHandlers = {
            handleSelectedEmployee: __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_handleSelectedEmployee).bind(this),
            handleFormInput: __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_handleFormInput).bind(this),
            handleFormSubmit: __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_handleFormSubmit).bind(this),
            renderEmptyForm: __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderEmptyForm).bind(this),
            handlePlanSubmit: __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_handlePlanSubmit).bind(this),
            renderWindow: __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderWindow).bind(this),
            cleanup: __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_cleanup).bind(this),
        };
        this.modalService = ModalService;
        this.hoverBoxService = HoverBoxService;
        this.groupSettingsView = new GroupSettingsView(this.modalService.getWriteableElement());
        __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_init).call(this);
    }
}
_GroupSettingsController_instances = new WeakSet(), _GroupSettingsController_init = function _GroupSettingsController_init() {
    this.btnManageGroup.addEventListener('click', (e) => {
        this.modalService.open(this, false);
        this.modalService.setOnClose(this, this.boundHandlers.cleanup);
        __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderWindow).call(this);
        __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderEmployee).call(this);
    });
}, _GroupSettingsController_handleSelectedEmployee = async function _GroupSettingsController_handleSelectedEmployee(e) {
    const target = e.target.closest('#btn-remove-employee') ??
        e.target?.closest('.employee-item') ??
        e.target.closest('#employee-list-add');
    if (!target)
        return;
    if (target.getAttribute('id') === 'btn-remove-employee') {
        __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_handleEmployeeRemove).call(this, target);
        return;
    }
    if (this.isModifying) {
        if (this.waitingfForDialog)
            return false;
        this.waitingfForDialog = true;
        const res = await renderDialog('Wyjść bez zapisu?');
        this.waitingfForDialog = false;
        if (!res)
            return;
        this.isModifying = false;
        this.modalService.setImportant(this, false);
        this.selectedItem?.classList.remove('modified');
    }
    this.hoverBoxService.removeMany('form-error');
    if (target.getAttribute('id') === 'employee-list-add') {
        __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderEmptyForm).call(this);
        return;
    }
    const employee = this.group.findEmployee(+target.dataset.id);
    if (!employee)
        return;
    this.selectedEmployee = employee;
    __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderEmployee).call(this, employee);
}, _GroupSettingsController_handleEmployeeRemove = async function _GroupSettingsController_handleEmployeeRemove(target) {
    const targetEmployee = this.group.findEmployee(+target.dataset.id);
    if (!targetEmployee)
        throw new Error('Something went wrong!');
    let res = await renderDialog(`Na pewno usunąć pracownika ${targetEmployee.getName()}?`);
    if (!res)
        return;
    res = await renderDialog(`🟥 Na pewno usunąć pracownika ${targetEmployee.getName()}? 🟥`);
    if (!res)
        return;
    this.group.removeEmployee(+target.dataset.id);
    this.modalService.clear();
    this.groupSettingsView.render(this.group.getEmployees());
    __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderWindow).call(this);
    __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderEmployee).call(this);
}, _GroupSettingsController_renderEmployee = function _GroupSettingsController_renderEmployee(employee) {
    this.employeeView = new EmployeeView(document.getElementById('employee-stats-container'));
    this.employeeView.render(employee);
    this.employeeForm = document.getElementById('employee-info');
    if (!employee)
        return;
    __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_updateListItems).call(this);
    __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_addEmployeeViewHandlers).call(this);
    __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderCalendarPreview).call(this);
}, _GroupSettingsController_addEmployeeViewHandlers = function _GroupSettingsController_addEmployeeViewHandlers() {
    this.employeeForm?.addEventListener('input', this.boundHandlers.handleFormInput);
    this.employeeForm?.addEventListener('submit', this.boundHandlers.handleFormSubmit);
    document
        .getElementById('plan-shifts')
        ?.addEventListener('submit', this.boundHandlers.handlePlanSubmit);
    // Add Planning input
    addPositionDropdownHandlers();
}, _GroupSettingsController_handleFormInput = function _GroupSettingsController_handleFormInput(e) {
    this.isModifying = true;
    this.modalService.setImportant(this, true);
    if (!this.employeeForm?.getAttribute('id') && e.target)
        e.target.classList.add('modified');
    this.selectedItem?.classList.add('modified');
}, _GroupSettingsController_handleFormSubmit = function _GroupSettingsController_handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(this.employeeForm);
    try {
        if (!this.employeeForm)
            throw new Error('Form tampered');
        const targetEmployee = this.group.findEmployee(+formData.get('id'));
        if (targetEmployee)
            targetEmployee.updateFromFormData(this.employeeForm);
        else {
            __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_addAndSelectEmployee).call(this);
        }
    }
    catch (err) {
        if (err instanceof FormError)
            return;
        else
            throw err;
    }
    this.modalService.setImportant(this, false);
    this.isModifying = false;
    this.selectedItem?.classList.remove('modified');
    __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderWindow).call(this);
    __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_updateListItems).call(this);
    __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderEmployee).call(this, this.group.findEmployee(this.selectedEmployee.getId()));
}, _GroupSettingsController_cleanup = function _GroupSettingsController_cleanup() {
    this.isModifying = false;
    this.selectedEmployee = this.group.getEmployees()[0];
    this.hoverBoxService.removeMany('form-error');
    // Redundand? Maybe
    this.groupSettingsView.clear();
    this.modalService.clear();
}, _GroupSettingsController_renderEmptyForm = function _GroupSettingsController_renderEmptyForm() {
    // Should've made it into a view but whatever
    this.employeeView?.clear();
    document
        .getElementById('employee-stats-container')
        .insertAdjacentHTML('afterbegin', renderEmployeeForm());
    addPositionDropdownHandlers();
    this.employeeForm = document.getElementById('employee-info');
    this.selectedEmployee = null;
    this.selectedItem = undefined;
    __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_updateListItems).call(this);
    __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_addEmployeeViewHandlers).call(this);
}, _GroupSettingsController_renderCalendarPreview = function _GroupSettingsController_renderCalendarPreview() {
    const parent = document.getElementById('calendar-preview');
    if (!parent)
        throw new Error('Something went wrong!');
    this.CalendarPreviewView = new CalendarPreviewView(parent);
    this.CalendarPreviewView.renderSpinner();
    const calendarData = this.selectedEmployee.getPreferencesForMonth(state.year, state.month);
    this.CalendarPreviewView.render(calendarData);
    const btnPrev = this.modalService
        .getWriteableElement()
        .querySelector('#btn-month-prev');
    const btnNext = this.modalService
        .getWriteableElement()
        .querySelector('#btn-month-next');
    if (!btnPrev || !btnNext)
        throw new Error('Something went wrong!');
    btnPrev.addEventListener('click', () => {
        CalendarService.prevMonth();
        __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderCalendarPreview).call(this);
    });
    btnNext.addEventListener('click', () => {
        CalendarService.nextMonth();
        __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderCalendarPreview).call(this);
    });
}, _GroupSettingsController_addAndSelectEmployee = function _GroupSettingsController_addAndSelectEmployee() {
    try {
        const employee = new Employee();
        if (!this.employeeForm)
            throw new Error('Stop doing this, please.');
        const idElement = this.employeeForm.querySelector('[name="id"]');
        if (!idElement)
            return;
        idElement.value = employee.getId().toString();
        employee.updateFromFormData(this.employeeForm);
        state.group.addEmployee(employee);
        this.selectedEmployee = employee;
    }
    catch (err) {
        throw err;
    }
}, _GroupSettingsController_renderWindow = function _GroupSettingsController_renderWindow() {
    this.groupSettingsView.render(this.group.getEmployees());
    this.employeeList = document.getElementById('employee-list');
    this.employeeList.addEventListener('click', this.boundHandlers.handleSelectedEmployee);
}, _GroupSettingsController_updateListItems = function _GroupSettingsController_updateListItems() {
    let targetedElement;
    if (this.employeeList)
        [...this.employeeList?.children].forEach((el) => {
            el.classList.remove('employee-selected');
            if (this.selectedEmployee &&
                +el.dataset.id === this.selectedEmployee.getId())
                targetedElement = el;
        });
    if (!targetedElement)
        return;
    targetedElement.classList.add('employee-selected');
    this.selectedItem = targetedElement;
}, _GroupSettingsController_handlePlanSubmit = async function _GroupSettingsController_handlePlanSubmit(e) {
    e.preventDefault();
    const form = e.target;
    if (!form)
        return;
    try {
        const data = new FormData(form);
        const parsedData = {
            shiftType: data.get('plannedShift')?.toString(),
            start: data.get('begin').toString(),
            end: data.get('end').toString(),
        };
        const dayspan = daySpanFromForm(parsedData.start, parsedData.end);
        const res = await renderDialog(`Zatwierdzić ${CONFIG.SHIFT_TYPES[parsedData.shiftType].translation} w okresie ${parsedData.start} - ${parsedData.end} dla ${this.selectedEmployee?.getName()}?`);
        if (!res)
            return;
        dayspan.forEach((d) => {
            this.selectedEmployee?.addCustomPreference(d.year, d.month, d.day, parsedData.shiftType);
        });
        __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderCalendarPreview).call(this);
    }
    catch (err) {
        return;
    }
};
export default GroupSettingsController;
