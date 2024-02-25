var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GroupSettingsController_instances, _GroupSettingsController_addHandlers, _GroupSettingsController_handleSelectedEmployee, _GroupSettingsController_renderEmployee, _GroupSettingsController_onChangeEmployee, _GroupSettingsController_onClose, _GroupSettingsController_onInput, _GroupSettingsController_onSubmit;
import { AbstractController } from './AbstractController.js';
import GroupSettingsView from '../views/groupSettingsViews/GroupSettingsView.js';
import EmployeeView from '../views/groupSettingsViews/EmployeeView.js';
import state from '../state.js';
class GroupSettingsController extends AbstractController {
    constructor(modalService) {
        super();
        _GroupSettingsController_instances.add(this);
        this.btnManageGroup = document.getElementById('btn-manage-group');
        this.group = state.group;
        this.boundHandlers = {
            handleSelectedEmployee: __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_handleSelectedEmployee).bind(this),
        };
        this.modalService = modalService;
        this.groupSettingsView = new GroupSettingsView(modalService.getWriteableElement());
        __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_addHandlers).call(this);
    }
}
_GroupSettingsController_instances = new WeakSet(), _GroupSettingsController_addHandlers = function _GroupSettingsController_addHandlers() {
    this.btnManageGroup.addEventListener('click', (e) => {
        this.modalService.open(this, false);
        this.groupSettingsView.render(this.group.getEmployees());
        this.employeeItems = document.getElementById('employee-list');
        document
            .getElementById('employee-list')
            .addEventListener('click', this.boundHandlers.handleSelectedEmployee);
        __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderEmployee).call(this);
    });
}, _GroupSettingsController_handleSelectedEmployee = function _GroupSettingsController_handleSelectedEmployee(e) {
    const target = e.target?.closest('.employee-item');
    if (!target)
        return;
    if (!('dataset' in target))
        return; // Check if dataset exists
    // for the love of god I need to rtfm on typescript
    const employee = this.group.findEmployee(+target.dataset.id);
    if (this.employeeItems)
        [...this.employeeItems?.children].forEach((el) => el.classList.remove('employee-selected'));
    target.classList.add('employee-selected');
    __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderEmployee).call(this, employee);
}, _GroupSettingsController_renderEmployee = function _GroupSettingsController_renderEmployee(employee) {
    this.employeeForm = document.getElementById('employee-stats');
    this.employeeView = new EmployeeView(this.employeeForm);
    this.employeeView.render(employee);
}, _GroupSettingsController_onChangeEmployee = function _GroupSettingsController_onChangeEmployee() { }, _GroupSettingsController_onClose = function _GroupSettingsController_onClose() { }, _GroupSettingsController_onInput = function _GroupSettingsController_onInput() { }, _GroupSettingsController_onSubmit = function _GroupSettingsController_onSubmit() { };
export default GroupSettingsController;
