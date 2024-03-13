var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _KeyboardScheduleController_instances, _KeyboardScheduleController_handleSelectChange, _KeyboardScheduleController_handleKeyDown, _KeyboardScheduleController_handleArrowMovement, _KeyboardScheduleController_handleShiftChange;
import { CONFIG } from '../../config.js';
import { AbstractController } from '../AbstractController.js';
class KeyboardScheduleController extends AbstractController {
    constructor(mainController) {
        super();
        _KeyboardScheduleController_instances.add(this);
        this.mainController = mainController;
        this.boundHandlers = {
            handleKeyDown: __classPrivateFieldGet(this, _KeyboardScheduleController_instances, "m", _KeyboardScheduleController_handleKeyDown).bind(this),
            handleSelectChange: __classPrivateFieldGet(this, _KeyboardScheduleController_instances, "m", _KeyboardScheduleController_handleSelectChange).bind(this),
        };
    }
    bind() {
        this.addEventListener('select-change', this.boundHandlers.handleSelectChange);
        document.addEventListener('keydown', this.boundHandlers.handleKeyDown);
    }
    unbind() {
        this.removeEventListener('select-change', this.boundHandlers.handleSelectChange);
        document.removeEventListener('keydown', this.boundHandlers.handleKeyDown);
    }
}
_KeyboardScheduleController_instances = new WeakSet(), _KeyboardScheduleController_handleSelectChange = function _KeyboardScheduleController_handleSelectChange() {
    return;
}, _KeyboardScheduleController_handleKeyDown = function _KeyboardScheduleController_handleKeyDown(e) {
    if (document.activeElement !== document.body &&
        document.activeElement !== this.mainController.cellsView.parentElement)
        return;
    if (Object.values(CONFIG.SHIFT_TYPES)
        .map((c) => c.shortcut)
        .includes(e.key))
        __classPrivateFieldGet(this, _KeyboardScheduleController_instances, "m", _KeyboardScheduleController_handleShiftChange).call(this, e);
    else
        __classPrivateFieldGet(this, _KeyboardScheduleController_instances, "m", _KeyboardScheduleController_handleArrowMovement).call(this, e);
}, _KeyboardScheduleController_handleArrowMovement = function _KeyboardScheduleController_handleArrowMovement(e) {
    e.preventDefault();
    const direction = { x: 0, y: 0 };
    switch (e.key) {
        case 'ArrowUp':
            direction.y -= 1;
            break;
        case 'ArrowDown':
            direction.y += 1;
            break;
        case 'ArrowRight':
            direction.x += 1;
            break;
        case 'ArrowLeft':
            direction.x -= 1;
            break;
        case 'Tab':
            direction.x += 1;
            break;
    }
    let targetRow = this.mainController.selectedElement?.dataset.row ?? 0;
    let targetDay = this.mainController.selectedElement?.dataset.day ?? 1;
    //Move in direction
    targetDay = +targetDay + direction.x;
    targetRow = +targetRow + direction.y;
    //Wrap
    if (targetDay > this.mainController.scheduleData.length)
        targetDay = 1;
    if (targetDay < 1)
        targetDay = this.mainController.scheduleData.length;
    //Leap disabled
    while (this.mainController.scheduleData.disabledDays.includes(+targetDay)) {
        targetDay = +targetDay + direction.x;
        if (targetDay > this.mainController.scheduleData.length || targetDay < 0)
            break;
    }
    //Wrap
    if (targetDay > this.mainController.scheduleData.length)
        targetDay = 1;
    if (targetDay < 1)
        targetDay = this.mainController.scheduleData.length;
    try {
        this.mainController.select(+targetRow, +targetDay);
    }
    catch (err) {
        //ignore :)
    }
}, _KeyboardScheduleController_handleShiftChange = function _KeyboardScheduleController_handleShiftChange(e) {
    if (!this.mainController.selected)
        return;
    Object.entries(CONFIG.SHIFT_TYPES).forEach(([shiftName, shiftInfo]) => {
        if (shiftInfo.shortcut === e.key) {
            const startTime = this.mainController.headerUtilsController.customTime.startTime;
            const endTime = this.mainController.headerUtilsController.customTime.endTime;
            this.mainController.updateSelected({
                shiftType: shiftName,
                startTime,
                endTime,
            });
            return;
        }
    });
};
export default KeyboardScheduleController;
