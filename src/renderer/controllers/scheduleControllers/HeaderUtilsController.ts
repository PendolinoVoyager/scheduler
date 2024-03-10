import ShiftButtonsView from '../../views/scheduleViews/ShiftButtonsView.js';
import { AbstractController } from '../AbstractController.js';
import ScheduleController from './ScheduleController.js';

export default class HeaderUtilsController extends AbstractController {
  public isDisabled: boolean = true;
  public headerElement: HTMLElement =
    document.getElementById('calendar-header')!;
  public shiftSelectElement: HTMLElement =
    document.getElementById('shift-select')!;
  public shiftButtonsView: ShiftButtonsView = new ShiftButtonsView(
    this.shiftSelectElement
  );
  constructor(private mainController: ScheduleController) {
    super();

    this.#generateShiftButtons();
    this.#addShiftButtonsHandlers();
  }
  #generateShiftButtons() {}
  #addShiftButtonsHandlers() {
    // throw new Error('Method not implemented.');
  }
}
