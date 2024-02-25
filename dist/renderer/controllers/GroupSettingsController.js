var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GroupSettingsController_instances, _GroupSettingsController_addHandlers, _GroupSettingsController_handleSelectedEmployee, _GroupSettingsController_renderEmployee, _GroupSettingsController_addEmployeeViewHandlers, _GroupSettingsController_removeEmployeeViewHandlers, _GroupSettingsController_handleFormInput, _GroupSettingsController_handleFormSubmit, _GroupSettingsController_cleanup, _GroupSettingsController_renderEmptyForm, _GroupSettingsController_addAndSelectEmployee, _GroupSettingsController_renderWindow;
import { AbstractController } from './AbstractController.js';
import { renderDialog } from '../helpers/yesNoDialog.js';
import GroupSettingsView from '../views/groupSettingsViews/GroupSettingsView.js';
import EmployeeView from '../views/groupSettingsViews/EmployeeView.js';
import Employee from '../models/Employee.js';
import state from '../state.js';
import { renderEmployeeForm } from '../helpers/renderEmployeeForm.js';
class GroupSettingsController extends AbstractController {
    constructor(modalService) {
        super();
        _GroupSettingsController_instances.add(this);
        this.btnManageGroup = document.getElementById('btn-manage-group');
        this.group = state.group;
        this.selectedEmployee = this.group.getEmployees()[0];
        this.isModifying = false;
        this.waitinfForDialog = false;
        this.boundHandlers = {
            handleSelectedEmployee: __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_handleSelectedEmployee).bind(this),
            handleFormInput: __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_handleFormInput).bind(this),
            handleFormSubmit: __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_handleFormSubmit).bind(this),
            renderEmptyForm: __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderEmptyForm).bind(this),
            renderWindow: __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderWindow).bind(this),
            cleanup: __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_cleanup).bind(this),
        };
        this.modalService = modalService;
        this.groupSettingsView = new GroupSettingsView(modalService.getWriteableElement());
        __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_addHandlers).call(this);
    }
}
_GroupSettingsController_instances = new WeakSet(), _GroupSettingsController_addHandlers = function _GroupSettingsController_addHandlers() {
    this.btnManageGroup.addEventListener('click', (e) => {
        this.modalService.open(this, false);
        this.modalService.setOnClose(this, this.boundHandlers.cleanup);
        this.groupSettingsView.render(this.group.getEmployees());
        __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderWindow).call(this);
        document
            .getElementById('employee-list-add')
            .addEventListener('click', this.boundHandlers.renderEmptyForm);
        __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderEmployee).call(this);
    });
}, _GroupSettingsController_handleSelectedEmployee = async function _GroupSettingsController_handleSelectedEmployee(e) {
    const target = e.target?.closest('.employee-item');
    if (!target)
        return;
    if (!('dataset' in target))
        return; // Check if dataset exists
    const employee = this.group.findEmployee(+target.dataset.id);
    if (!employee)
        return;
    if (this.isModifying) {
        if (this.waitinfForDialog)
            return false;
        this.waitinfForDialog = true;
        const res = await renderDialog('Wyjść bez zapisu?');
        this.waitinfForDialog = false;
        if (!res)
            return;
        this.isModifying = false;
        this.modalService.setImportant(this, false);
        this.selectedItem?.classList.remove('modified');
    }
    if (this.employeeList)
        [...this.employeeList?.children].forEach((el) => el.classList.remove('employee-selected'));
    target.classList.add('employee-selected');
    this.selectedItem = target;
    __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderEmployee).call(this, employee);
}, _GroupSettingsController_renderEmployee = function _GroupSettingsController_renderEmployee(employee) {
    // Remove the event listener from previous render
    __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_removeEmployeeViewHandlers).call(this);
    this.employeeView = new EmployeeView(document.getElementById('employee-stats'));
    this.employeeView.render(employee);
    this.employeeForm = document.getElementById('employee-info');
    __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_addEmployeeViewHandlers).call(this);
}, _GroupSettingsController_addEmployeeViewHandlers = function _GroupSettingsController_addEmployeeViewHandlers() {
    this.employeeForm?.addEventListener('input', this.boundHandlers.handleFormInput);
    this.employeeForm?.addEventListener('submit', this.boundHandlers.handleFormSubmit);
}, _GroupSettingsController_removeEmployeeViewHandlers = function _GroupSettingsController_removeEmployeeViewHandlers() {
    this.employeeForm?.removeEventListener('input', this.boundHandlers.handleFormInput);
    this.employeeForm?.removeEventListener('submit', this.boundHandlers.handleFormSubmit);
}, _GroupSettingsController_handleFormInput = function _GroupSettingsController_handleFormInput(e) {
    this.isModifying = true;
    this.modalService.setImportant(this, true);
    e.target.classList.add('modified');
    this.selectedItem?.classList.add('modified');
}, _GroupSettingsController_handleFormSubmit = function _GroupSettingsController_handleFormSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this.employeeForm));
    if (isNaN(+data.id)) {
        __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_addAndSelectEmployee).call(this, data);
    }
    else
        this.group.findEmployee(+data.id)?.updateFromFormData(data);
    this.modalService.setImportant(this, false);
    this.isModifying = false;
    this.selectedItem?.classList.remove('modified');
    __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderEmployee).call(this, this.group.findEmployee(+this.selectedItem.dataset.id));
}, _GroupSettingsController_cleanup = function _GroupSettingsController_cleanup() {
    __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_removeEmployeeViewHandlers).call(this);
    this.employeeList?.removeEventListener('click', this.boundHandlers.handleSelectedEmployee);
    document
        .getElementById('employee-list-add')
        .removeEventListener('click', this.boundHandlers.renderEmptyForm);
    this.isModifying = false;
    this.modalService.clear();
}, _GroupSettingsController_renderEmptyForm = function _GroupSettingsController_renderEmptyForm() {
    __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_removeEmployeeViewHandlers).call(this);
    this.employeeView?.clear();
    document
        .getElementById('employee-stats')
        .insertAdjacentHTML('afterbegin', renderEmployeeForm());
    this.employeeForm = document.getElementById('employee-info');
    __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_addEmployeeViewHandlers).call(this);
}, _GroupSettingsController_addAndSelectEmployee = function _GroupSettingsController_addAndSelectEmployee(data) {
    const employee = new Employee(data.name.toString());
    employee.updateFromFormData(data);
    state.group.addEmployee(employee);
    __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderWindow).call(this);
    let targetedElement;
    if (this.employeeList)
        [...this.employeeList?.children].forEach((el) => {
            el.classList.remove('employee-selected');
            if (+el.dataset.id === employee.getId())
                targetedElement = el;
        });
    targetedElement.classList.add('employee-selected');
    this.selectedItem = targetedElement;
    __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderEmployee).call(this, employee);
}, _GroupSettingsController_renderWindow = function _GroupSettingsController_renderWindow() {
    this.groupSettingsView.render(this.group.getEmployees());
    this.employeeList = document.getElementById('employee-list');
    this.employeeList.addEventListener('click', this.boundHandlers.handleSelectedEmployee);
};
export default GroupSettingsController;
