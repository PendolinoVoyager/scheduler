var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _HeaderUtilsController_instances, _HeaderUtilsController_addValidatorUtilsHandlers, _HeaderUtilsController_addShiftButtonsHandlers, _HeaderUtilsController_shiftSelectClick, _HeaderUtilsController_calculateTimeInput;
import { CONFIG } from '../../config.js';
import { hourToNumber } from '../../helpers/numberToHour.js';
import ShiftButtonsView from '../../views/scheduleViews/ShiftButtonsView.js';
import ValidatorUtilsView from '../../views/scheduleViews/ValidatorUtilsView.js';
import { AbstractController } from '../AbstractController.js';
class HeaderUtilsController extends AbstractController {
    constructor(mainController) {
        super();
        _HeaderUtilsController_instances.add(this);
        this.mainController = mainController;
        this.isDisabled = true;
        this.headerElement = document.getElementById('calendar-header');
        this.shiftSelectElement = document.getElementById('shift-select');
        this.startTimeInput = null;
        this.endTimeInput = null;
        this.shiftButtonsView = new ShiftButtonsView(this.shiftSelectElement);
        this.validatorUtilsElement = document.getElementById('validator-utils');
        this.validatorUtilsView = new ValidatorUtilsView(this.validatorUtilsElement);
        this.selectedShiftElement = null;
        this.selectedShift = null;
        this.customTime = {
            startTime: 0,
            endTime: 0,
        };
        this.boundHandlers = {
            updateSelected: () => {
                this.selectedShift &&
                    this.mainController.selected &&
                    this.mainController.updateSelected({
                        shiftType: this.selectedShift,
                        startTime: this.customTime.startTime,
                        endTime: this.customTime.endTime,
                    });
            },
            shiftSelectClick: __classPrivateFieldGet(this, _HeaderUtilsController_instances, "m", _HeaderUtilsController_shiftSelectClick).bind(this),
            calculateTimeInput: __classPrivateFieldGet(this, _HeaderUtilsController_instances, "m", _HeaderUtilsController_calculateTimeInput).bind(this),
        };
    }
    bind() {
        this.shiftSelectElement.classList.remove('hidden');
        this.shiftButtonsView.render(undefined);
        this.validatorUtilsElement.classList.remove('hidden');
        this.validatorUtilsView.render(this.mainController.workingSchedule.getStats());
        this.startTimeInput = this.shiftSelectElement.querySelector('input[name="start"]');
        this.endTimeInput =
            this.shiftSelectElement.querySelector('input[name="end"]');
        [this.startTimeInput, this.endTimeInput].forEach((el) => el?.addEventListener('change', this.boundHandlers.calculateTimeInput));
        __classPrivateFieldGet(this, _HeaderUtilsController_instances, "m", _HeaderUtilsController_addShiftButtonsHandlers).call(this);
        __classPrivateFieldGet(this, _HeaderUtilsController_instances, "m", _HeaderUtilsController_addValidatorUtilsHandlers).call(this);
    }
    unbind() {
        this.shiftButtonsView.clear();
        this.shiftSelectElement.classList.add('hidden');
        this.validatorUtilsElement.classList.add('hidden');
        this.validatorUtilsView.clear();
        this.removeEventListener('select-change', this.boundHandlers.updateSelected);
    }
}
_HeaderUtilsController_instances = new WeakSet(), _HeaderUtilsController_addValidatorUtilsHandlers = function _HeaderUtilsController_addValidatorUtilsHandlers() {
    const onValidation = () => {
        CONFIG.RUN_VALIDATORS = this.validatorUtilsElement.querySelector('input[name="validate"]').checked;
        CONFIG.SHOW_VALIDATION_ERRORS = this.validatorUtilsElement.querySelector('input[name="show-errors"]')?.checked;
        this.mainController.handleValidation();
    };
    this.validatorUtilsElement
        .querySelector('#btn-validate')
        ?.addEventListener('click', onValidation.bind(this));
    this.validatorUtilsElement
        .querySelector('input[name="validate"]')
        ?.addEventListener('change', onValidation.bind(this));
    this.validatorUtilsElement
        .querySelector('input[name="show-errors"]')
        ?.addEventListener('change', onValidation.bind(this));
}, _HeaderUtilsController_addShiftButtonsHandlers = function _HeaderUtilsController_addShiftButtonsHandlers() {
    this.shiftSelectElement.addEventListener('click', this.boundHandlers.shiftSelectClick);
    this.addEventListener('select-change', this.boundHandlers.updateSelected);
}, _HeaderUtilsController_shiftSelectClick = function _HeaderUtilsController_shiftSelectClick(e) {
    const target = e.target.closest('button');
    if (!target)
        return;
    if (!target.dataset.shift)
        return;
    if (target.dataset.shift === this.selectedShift) {
        this.selectedShift = null;
        target.classList.remove('selected');
        return;
    }
    this.selectedShiftElement &&
        this.selectedShiftElement.classList.remove('selected');
    target.classList.add('selected');
    this.selectedShiftElement = target;
    this.selectedShift = target.dataset.shift;
    if (this.mainController.selected) {
        this.boundHandlers.updateSelected();
    }
    if (this.selectedShift === 'Custom')
        this.boundHandlers.calculateTimeInput();
}, _HeaderUtilsController_calculateTimeInput = function _HeaderUtilsController_calculateTimeInput() {
    this.customTime.startTime = hourToNumber(this.startTimeInput?.value || '00:00');
    this.customTime.endTime = hourToNumber(this.endTimeInput?.value || '00:00');
};
export default HeaderUtilsController;
