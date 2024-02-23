var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GroupSettingsController_instances, _GroupSettingsController_addHandlers;
class GroupSettingsController {
    constructor() {
        _GroupSettingsController_instances.add(this);
        this.btnManageGroup = document.getElementById('btn-manage-group');
        __classPrivateFieldGet(this, _GroupSettingsController_instances, "m", _GroupSettingsController_addHandlers).call(this);
    }
}
_GroupSettingsController_instances = new WeakSet(), _GroupSettingsController_addHandlers = function _GroupSettingsController_addHandlers() {
    this.btnManageGroup.addEventListener('click', (e) => { });
};
export default GroupSettingsController;
