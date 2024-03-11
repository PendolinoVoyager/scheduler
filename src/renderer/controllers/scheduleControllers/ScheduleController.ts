import { Schedule } from '../../models/Schedule.js';
import { AbstractController } from '../AbstractController.js';
import type { ScheduleJSON } from '../../models/ScheduleTypes.js';
import CellsView from '../../views/scheduleViews/CellsView.js';
import CalendarService from '../../services/CalendarService.js';
import { CellData, ExcludeId } from '../../models/types.js';
import MouseScheduleController from './MouseHandler.js';
import KeyboardScheduleController from './KeyboardHandler.js';
import HeaderUtilsController from './HeaderUtilsController.js';
import View from '../../views/View.js';

export default class ScheduleController extends AbstractController {
  archived: boolean = false;
  cellsView: View;
  scheduleData: ScheduleJSON | null = null;
  selected: CellData | null = null;
  selectedElement: HTMLElement | null = null;
  previousSelectedElement: HTMLElement | null = null;
  workingSchedule: Schedule | null = null;
  titleElement: HTMLElement = document.getElementById('main-info')!;
  mouseController: MouseScheduleController;
  keyboardController: KeyboardScheduleController;
  headerUtilsController: HeaderUtilsController;
  constructor() {
    super();
    this.cellsView = new CellsView(document.getElementById('calendar-body')!);
    this.mouseController = new MouseScheduleController(this);
    this.keyboardController = new KeyboardScheduleController(this);
    this.headerUtilsController = new HeaderUtilsController(this);
  }
  /**
   * Entrypoint to init schedule
   * @param Schedule
   */
  createLiveSchedule(schedule: Schedule) {
    this.teardown();
    this.workingSchedule = schedule;
    this.titleElement.innerText =
      'Grafik: ' + CalendarService.getDateString(schedule.year, schedule.month);
    this.mouseController.bind();
    this.renderRawCellData(schedule.exportJSON());
    this.headerUtilsController.bind();
    this.keyboardController.bind();

    this.addEventListener('select-change', (e: any) => {
      const newEvent = new CustomEvent('select-change');
      if (e.detail.src !== this.keyboardController)
        this.keyboardController.dispatchEvent(newEvent);
      if (e.detail.src !== this.mouseController)
        this.mouseController.dispatchEvent(newEvent);
      if (e.detail.src !== this.headerUtilsController)
        this.headerUtilsController.dispatchEvent(newEvent);
    });
  }
  /**
   * Should only be used alone to render archived schedules.
   * Otherwise, use 'createLiveSchedule'
   * @param scheduleJSON
   */
  renderRawCellData(scheduleJSON: ScheduleJSON) {
    this.scheduleData = scheduleJSON;
    this.archived = scheduleJSON.archived;
    if (this.archived) this.titleElement.innerText += ' (archiwizowane}';
    this.cellsView.renderSpinner();
    if (scheduleJSON == null)
      throw new Error('Invalid data, got: ' + scheduleJSON);
    this.cellsView.render(scheduleJSON);
  }

  select(row: number, day: number): CellData {
    if (!this.scheduleData) throw new Error('No schedule to work with.');
    if (this.scheduleData.disabledDays.includes(day))
      throw new Error('Cannot select disabled day: ' + day);
    this.selected = this.scheduleData.data[row][day - 1];
    this.#updateSelectedClass();
    return this.selected;
  }
  unselect() {
    this.selected = null;
    this.#updateSelectedClass();
  }
  updateSelected(newData: Partial<ExcludeId<CellData>>): void {
    if (this.archived) throw new Error('Cannot update archived schedule.');
    if (!this.workingSchedule) throw new Error('No schedule to work with.');
    if (!this.selected) throw new Error('No cell selected.');
    this.workingSchedule.updateCell(
      this.selected.id,
      this.selected.day,
      newData
    );

    const markdown = (this.cellsView as CellsView).generateCell(
      this.selected,
      this.workingSchedule.getGroup().findEmployeeIndex(this.selected.id) + 1
    );
    this.selectedElement!.outerHTML = markdown;
    this.#updateSelectedClass();
  }
  toggleDisabledColumn(day: number) {
    if (!this.workingSchedule) throw new Error('No schedule to work with.');
    if (this.scheduleData!.disabledDays.includes(day))
      this.workingSchedule.enableDay(day);
    else this.workingSchedule.disableDay(day);
    this.renderRawCellData(this.workingSchedule.exportJSON());
  }
  teardown() {
    this.scheduleData = null;
    this.selected = null;
    this.workingSchedule = null;
    this.cellsView.parentElement.style.gridTemplateColumns = '1fr';
    this.cellsView.renderSpinner();
    this.mouseController.unbind();
    this.headerUtilsController.unbind();
    this.keyboardController.unbind();
  }
  #updateSelectedClass() {
    this.selectedElement?.classList.remove('selected');
    this.previousSelectedElement?.classList.remove('selected');
    this.previousSelectedElement = this.selectedElement;
    //@ts-ignore
    this.selectedElement = [...this.cellsView.parentElement.children].find(
      (child) =>
        (child as HTMLElement)?.dataset?.day === `${this.selected?.day}` &&
        (child as HTMLElement)?.dataset?.row ===
          `${this.workingSchedule!.getGroup().findEmployeeIndex(
            this.selected!.id
          )}`
    );
    this.selectedElement?.classList.add('selected');
  }
}
