import { AbstractController } from '../AbstractController.js';
import CellsView from '../../views/scheduleViews/CellsView.js';
import CalendarService from '../../services/CalendarService.js';
export default class ScheduleController extends AbstractController {
    //GOALS
    //3. add visual handlers
    //4. seperate key handlers
    //5. make sure to DRY
    //6. figure our recovering form data and employee data from storage
    //7. seperate the raw render of archived data from complete recovery;
    // The recovery should proceed when a group is found and date is before cutoff.
    constructor() {
        super();
        this.schedule = null;
        this.cellsView = new CellsView(document.getElementById('calendar-body'));
    }
    createLiveSchedule(Schedule) {
        document.getElementById('main-info').innerText =
            'Grafik: ' + CalendarService.getDateString(Schedule.year, Schedule.month);
        this.renderRawCellData(Schedule.exportJSON());
    }
    renderRawCellData(scheduleJSON) {
        this.cellsView.renderSpinner();
        if (scheduleJSON == null)
            throw new Error('Invalid data, got: ' + scheduleJSON);
        this.cellsView.render(scheduleJSON);
    }
}
