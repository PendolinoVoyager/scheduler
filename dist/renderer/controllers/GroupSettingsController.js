var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GroupSettingsController_instances, _GroupSettingsController_addHandlers, _GroupSettingsController_renderEmployeeStats, _GroupSettingsController_onClose;
import { AbstractController } from './AbstractController.js';
import GroupSettingsView from '../views/groupSettingsViews/GroupSettingsView.js';
import EmployeeView from '../views/groupSettingsViews/EmployeeView.js';
class GroupSettingsController extends AbstractController {
    constructor(modalService) {
        super();
        _GroupSettingsController_instances.add(this);
        this.btnManageGroup = document.getElementById('btn-manage-group');
        this.modalService = modalService;
        this.groupSettingsView = new GroupSettingsView(modalService.getWriteableElement());
        __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_addHandlers).call(this);
    }
}
_GroupSettingsController_instances = new WeakSet(), _GroupSettingsController_addHandlers = function _GroupSettingsController_addHandlers() {
    this.btnManageGroup.addEventListener('click', (e) => {
        this.modalService.open(this, false);
        this.groupSettingsView.render(null);
        __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_renderEmployeeStats).call(this);
    });
}, _GroupSettingsController_renderEmployeeStats = function _GroupSettingsController_renderEmployeeStats(employee) {
    this.employeeForm = document.getElementById('employee-stats');
    this.employeeView = new EmployeeView(this.employeeForm);
    this.employeeView.render(null);
}, _GroupSettingsController_onClose = function _GroupSettingsController_onClose() { };
export default GroupSettingsController;
