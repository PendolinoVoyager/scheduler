import { Schedule } from '../../models/Schedule.js';
import { AbstractController } from '../AbstractController.js';
import type { CellData, ScheduleJSON } from '../../models/ScheduleTypes.js';
import CellsView from '../../views/scheduleViews/CellsView.js';
import View from '../../views/View.js';
import CalendarService from '../../services/CalendarService.js';

export default class ScheduleController extends AbstractController {
  public schedule: Schedule | null = null;
  archived: boolean = false;
  cellsView: View;
  scheduleData: ScheduleJSON | null = null;
  selected: CellData | null = null;
  constructor() {
    super();
    this.cellsView = new CellsView(document.getElementById('calendar-body')!);
  }
  createLiveSchedule(Schedule: Schedule) {
    document.getElementById('main-info')!.innerText =
      'Grafik: ' + CalendarService.getDateString(Schedule.year, Schedule.month);
    this.renderRawCellData(Schedule.exportJSON());
  }
  renderRawCellData(scheduleJSON: ScheduleJSON) {
    this.scheduleData = scheduleJSON;
    this.archived = scheduleJSON.archived;
    this.cellsView.renderSpinner();
    if (scheduleJSON == null)
      throw new Error('Invalid data, got: ' + scheduleJSON);
    this.cellsView.render(scheduleJSON);
  }
  select(row: number, day: number): CellData {
    if (!this.scheduleData) throw new Error('No schedule to select.');
    this.selected = this.scheduleData.data[row][day - 1];
    return this.selected;
  }
}
