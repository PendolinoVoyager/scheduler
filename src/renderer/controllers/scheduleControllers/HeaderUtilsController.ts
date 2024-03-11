import { hourToNumber } from '../../helpers/numberToHour.js';
import ShiftButtonsView from '../../views/scheduleViews/ShiftButtonsView.js';
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
    this.shiftButtonsView.render(undefined);
    this.startTimeInput = this.shiftSelectElement.querySelector(
      'input[name="start"]'
    );
    this.endTimeInput =
      this.shiftSelectElement.querySelector('input[name="end"]');
    [this.startTimeInput, this.endTimeInput].forEach((el) =>
      el?.addEventListener('change', this.boundHandlers.calculateTimeInput)
    );
    this.#addShiftButtonsHandlers();
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
    if (this.selectedShift === 'Custom')
      this.boundHandlers.calculateTimeInput();
  }
  #calculateTimeInput() {
    this.customTime.startTime = hourToNumber(
      this.startTimeInput?.value ?? '00:00'
    );
    this.customTime.endTime = hourToNumber(this.endTimeInput?.value ?? '00:00');
  }
  unbind() {
    this.shiftButtonsView.clear();
    this.removeEventListener(
      'select-change',
      this.boundHandlers.updateSelected
    );
  }
}
