import { Schedule } from '../../models/Schedule.js';
import { AbstractController } from '../AbstractController.js';
import type { ScheduleJSON } from '../../models/ScheduleTypes.js';
import CellsView from '../../views/scheduleViews/CellsView.js';
import View from '../../views/View.js';

export default class ScheduleController extends AbstractController {
  public schedule: Schedule | null = null;
  cellsView: View;
  //GOALS
  //1. render the raw CellData
  //2. render Employee headers
  //3. add visual handlers
  //4. seperate key handlers
  //5. make sure to DRY
  //6. figure our recovering form data and employee data from storage
  //7. seperate the raw render of archived data from complete recovery;
  // The recovery should proceed when a group is found and date is before cutoff.
  constructor() {
    super();
    this.cellsView = new CellsView(document.getElementById('calendar-body')!);
  }
  createLiveSchedule(Schedule: Schedule) {
    document.getElementById('main-info')!.innerText = 'TESTE';
    this.renderRawCellData(Schedule.exportJSON());
  }
  renderRawCellData(scheduleJSON: ScheduleJSON) {
    if (scheduleJSON == null)
      throw new Error('Invalid data, got: ' + scheduleJSON);
    this.cellsView.render(scheduleJSON);
  }
  createArchivedSchedule(ScheduleJSON: ScheduleJSON) {}
}
