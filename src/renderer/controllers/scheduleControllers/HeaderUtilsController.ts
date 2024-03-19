import { CONFIG } from '../../config.js';
import { hourToNumber } from '../../helpers/numberToHour.js';
import { ScheduleValidator } from '../../services/ScheduleValidator.js';
import ShiftButtonsView from '../../views/scheduleViews/ShiftButtonsView.js';
import ValidatorUtilsView from '../../views/scheduleViews/ValidatorUtilsView.js';
import { AbstractController } from '../AbstractController.js';
import ScheduleController from './ScheduleController.js';

export default class HeaderUtilsController extends AbstractController {
  public isDisabled: boolean = true;
  public headerElement: HTMLElement =
    document.getElementById('calendar-header')!;
  public shiftSelectElement: HTMLElement =
    document.getElementById('shift-select')!;
  public startTimeInput: HTMLInputElement | null = null;
  public endTimeInput: HTMLInputElement | null = null;
  public shiftButtonsView: ShiftButtonsView = new ShiftButtonsView(
    this.shiftSelectElement
  );
  public validatorUtilsElement: HTMLElement =
    document.getElementById('validator-utils')!;
  public validatorUtilsView: ValidatorUtilsView = new ValidatorUtilsView(
    this.validatorUtilsElement
  );
  public selectedShiftElement: HTMLElement | null = null;
  public selectedShift: string | null = null;
  public customTime: { startTime: number; endTime: number } = {
    startTime: 0,
    endTime: 0,
  };
  private boundHandlers = {
    updateSelected: () => {
      this.selectedShift &&
        this.mainController.selected &&
        this.mainController.updateSelected({
          shiftType: this.selectedShift,
          startTime: this.customTime.startTime,
          endTime: this.customTime.endTime,
        });
    },
    shiftSelectClick: this.#shiftSelectClick.bind(this),
    calculateTimeInput: this.#calculateTimeInput.bind(this),
  };
  constructor(private mainController: ScheduleController) {
    super();
  }
  bind() {
    this.shiftSelectElement.classList.remove('hidden');
    this.shiftButtonsView.render(undefined);
    this.validatorUtilsElement.classList.remove('hidden');
    this.validatorUtilsView.render(
      this.mainController.workingSchedule!.getStats()
    );

    this.startTimeInput = this.shiftSelectElement.querySelector(
      'input[name="start"]'
    );
    this.endTimeInput =
      this.shiftSelectElement.querySelector('input[name="end"]');
    [this.startTimeInput, this.endTimeInput].forEach((el) =>
      el?.addEventListener('change', this.boundHandlers.calculateTimeInput)
    );

    this.#addShiftButtonsHandlers();
    this.#addValidatorUtilsHandlers();
  }
  #addValidatorUtilsHandlers() {
    const onValidation = () => {
      CONFIG.RUN_VALIDATORS = (
        this.validatorUtilsElement.querySelector(
          'input[name="validate"]'
        )! as HTMLInputElement
      ).checked;
      CONFIG.SHOW_VALIDATION_ERRORS = (
        this.validatorUtilsElement.querySelector(
          'input[name="show-errors"]'
        )! as HTMLInputElement
      )?.checked;
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
  }
  #addShiftButtonsHandlers() {
    this.shiftSelectElement.addEventListener(
      'click',
      this.boundHandlers.shiftSelectClick
    );
    this.addEventListener('select-change', this.boundHandlers.updateSelected);
  }
  #shiftSelectClick(e: MouseEvent) {
    const target = (e.target as HTMLElement).closest('button');
    if (!target) return;
    if (!target.dataset.shift) return;

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
  }
  #calculateTimeInput() {
    this.customTime.startTime = hourToNumber(
      this.startTimeInput?.value || '00:00'
    );
    this.customTime.endTime = hourToNumber(this.endTimeInput?.value || '00:00');
  }
  unbind() {
    this.shiftButtonsView.clear();
    this.shiftSelectElement.classList.add('hidden');
    this.validatorUtilsElement.classList.add('hidden');
    this.validatorUtilsView.clear();
    this.removeEventListener(
      'select-change',
      this.boundHandlers.updateSelected
    );
  }
}
