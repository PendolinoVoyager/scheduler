var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DarkModeController_instances, _DarkModeController_addListeners, _DarkModeController_fetchPreviousTheme;
import { AbstractController } from './AbstractController.js';
class DarkModeController extends AbstractController {
    constructor() {
        super();
        _DarkModeController_instances.add(this);
        this.toggleElement = document.getElementById('toggle-dark-mode');
        __classPrivateFieldGet(this, _DarkModeController_instances, "m", _DarkModeController_addListeners).call(this);
    }
}
_DarkModeController_instances = new WeakSet(), _DarkModeController_addListeners = function _DarkModeController_addListeners() {
    this.toggleElement.addEventListener('click', async () => {
        const isDarkMode = await window.darkMode.toggle();
        this.toggleElement.classList.toggle('dark');
    });
}, _DarkModeController_fetchPreviousTheme = async function _DarkModeController_fetchPreviousTheme() {
    throw new Error('Not implemented yet');
};
export default DarkModeController;
