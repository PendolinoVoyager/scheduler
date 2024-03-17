var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ValidatorUtilsView_instances, _ValidatorUtilsView_generateNotice;
import View from '../View.js';
class ValidatorUtilsView extends View {
    constructor(parentElement) {
        super(parentElement);
        _ValidatorUtilsView_instances.add(this);
    }
    generateMarkup() {
        return `
    <ul class="flex-row">
        ${this.data.notices.map(__classPrivateFieldGet(this, _ValidatorUtilsView_instances, "m", _ValidatorUtilsView_generateNotice).bind(this)).join('')}
    </ul>
    `;
    }
}
_ValidatorUtilsView_instances = new WeakSet(), _ValidatorUtilsView_generateNotice = function _ValidatorUtilsView_generateNotice(notice) {
    return `
    <li class="validator-notice">
        ${notice.description.replace(notice.employee.toString(), `<span class="employee-position">${this.data.employees
        .find((emp) => emp.getId() === notice.employee)
        .getName()}</span>`)}
    </li>

    `;
};
export default ValidatorUtilsView;
