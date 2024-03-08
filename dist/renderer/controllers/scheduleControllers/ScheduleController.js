import { AbstractController } from '../AbstractController.js';
import CellsView from '../../views/scheduleViews/CellsView.js';
import CalendarService from '../../services/CalendarService.js';
import MouseScheduleController from './MouseHandler.js';
import KeyboardScheduleController from './KeyboardHandler.js';
export default class ScheduleController extends AbstractController {
    constructor() {
        super();
        this.archived = false;
        this.scheduleData = null;
        this.selected = null;
        this.workingSchedule = null;
        this.cellsView = new CellsView(document.getElementById('calendar-body'));
        this.mouseController = new MouseScheduleController(this);
        this.keyboardController = new KeyboardScheduleController(this);
    }
    /**
     * Entrypoint to init schedule
     * @param Schedule
     */
    createLiveSchedule(schedule) {
        this.workingSchedule = schedule;
        document.getElementById('main-info').innerText =
            'Grafik: ' + CalendarService.getDateString(schedule.year, schedule.month);
        this.renderRawCellData(schedule.exportJSON());
    }
    /**
     * Should only be used alone to render archived schedules.
     * Otherwise, use 'createLiveSchedule'
     * @param scheduleJSON
     */
    renderRawCellData(scheduleJSON) {
        this.scheduleData = scheduleJSON;
        this.archived = scheduleJSON.archived;
        this.cellsView.renderSpinner();
        if (scheduleJSON == null)
            throw new Error('Invalid data, got: ' + scheduleJSON);
        this.cellsView.render(scheduleJSON);
    }
    select(row, day) {
        if (!this.scheduleData)
            throw new Error('No schedule to work with.');
        this.selected = this.scheduleData.data[row][day - 1];
        return this.selected;
    }
    updateSelected(newData) {
        if (this.archived)
            throw new Error('Cannot update archived schedule.');
        if (!this.workingSchedule)
            throw new Error('No schedule to work with.');
        if (!this.selected)
            throw new Error('No cell selected.');
        this.workingSchedule.updateCell(this.selected.id, this.selected.day, newData);
        this.cellsView.update(this.scheduleData);
    }
    teardown() {
        //@ts-ignore
        this.cellsView = null;
        this.scheduleData = null;
        this.selected = null;
        this.workingSchedule = null;
    }
}
