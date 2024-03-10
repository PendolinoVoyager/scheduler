var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _HeaderUtilsController_instances, _HeaderUtilsController_generateShiftButtons, _HeaderUtilsController_addShiftButtonsHandlers;
import ShiftButtonsView from '../../views/scheduleViews/ShiftButtonsView.js';
import { AbstractController } from '../AbstractController.js';
class HeaderUtilsController extends AbstractController {
    constructor(mainController) {
        super();
        _HeaderUtilsController_instances.add(this);
        this.mainController = mainController;
        this.isDisabled = true;
        this.headerElement = document.getElementById('calendar-header');
        this.shiftSelectElement = document.getElementById('shift-select');
        this.shiftButtonsView = new ShiftButtonsView(this.shiftSelectElement);
        __classPrivateFieldGet(this, _HeaderUtilsController_instances, "m", _HeaderUtilsController_generateShiftButtons).call(this);
        __classPrivateFieldGet(this, _HeaderUtilsController_instances, "m", _HeaderUtilsController_addShiftButtonsHandlers).call(this);
    }
}
_HeaderUtilsController_instances = new WeakSet(), _HeaderUtilsController_generateShiftButtons = function _HeaderUtilsController_generateShiftButtons() { }, _HeaderUtilsController_addShiftButtonsHandlers = function _HeaderUtilsController_addShiftButtonsHandlers() {
    // throw new Error('Method not implemented.');
};
export default HeaderUtilsController;
