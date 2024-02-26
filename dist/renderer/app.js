var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _App_instances, _App_addDefaultListeners;
import './config.js';
import DarkModeController from './controllers/DarkModeController.js';
import ModalService from './services/ModalService.js';
import GroupSettingsController from './controllers/GroupSettingsController.js';
class App {
    constructor() {
        _App_instances.add(this);
        this.modalService = new ModalService();
        this.darkModeController = new DarkModeController();
        this.groupSettingsController = new GroupSettingsController(this.modalService);
        __classPrivateFieldGet(this, _App_instances, "m", _App_addDefaultListeners).call(this);
    }
}
_App_instances = new WeakSet(), _App_addDefaultListeners = function _App_addDefaultListeners() {
    window.addEventListener('beforeunload', (e) => {
        // Handle exiting using electron api
    });
};
const app = new App();
