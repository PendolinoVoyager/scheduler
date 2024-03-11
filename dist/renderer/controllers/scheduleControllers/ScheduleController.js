var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ScheduleController_instances, _ScheduleController_updateSelectedClass;
import { AbstractController } from '../AbstractController.js';
import CellsView from '../../views/scheduleViews/CellsView.js';
import CalendarService from '../../services/CalendarService.js';
import MouseScheduleController from './MouseHandler.js';
import KeyboardScheduleController from './KeyboardHandler.js';
import HeaderUtilsController from './HeaderUtilsController.js';
class ScheduleController extends AbstractController {
    constructor() {
        super();
        _ScheduleController_instances.add(this);
        this.archived = false;
        this.scheduleData = null;
        this.selected = null;
        this.selectedElement = null;
        this.previousSelectedElement = null;
        this.workingSchedule = null;
        this.titleElement = document.getElementById('main-info');
        this.cellsView = new CellsView(document.getElementById('calendar-body'));
        this.mouseController = new MouseScheduleController(this);
        this.keyboardController = new KeyboardScheduleController(this);
        this.headerUtilsController = new HeaderUtilsController(this);
    }
    /**
     * Entrypoint to init schedule
     * @param Schedule
     */
    createLiveSchedule(schedule) {
        this.teardown();
        this.workingSchedule = schedule;
        this.titleElement.innerText =
            'Grafik: ' + CalendarService.getDateString(schedule.year, schedule.month);
        this.mouseController.bind();
        this.renderRawCellData(schedule.exportJSON());
        this.headerUtilsController.bind();
        this.keyboardController.bind();
        this.addEventListener('select-change', (e) => {
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
    renderRawCellData(scheduleJSON) {
        this.scheduleData = scheduleJSON;
        this.archived = scheduleJSON.archived;
        if (this.archived)
            this.titleElement.innerText += ' (archiwizowane}';
        this.cellsView.renderSpinner();
        if (scheduleJSON == null)
            throw new Error('Invalid data, got: ' + scheduleJSON);
        this.cellsView.render(scheduleJSON);
    }
    select(row, day) {
        if (!this.scheduleData)
            throw new Error('No schedule to work with.');
        if (this.scheduleData.disabledDays.includes(day))
            throw new Error('Cannot select disabled day: ' + day);
        this.selected = this.scheduleData.data[row][day - 1];
        __classPrivateFieldGet(this, _ScheduleController_instances, "m", _ScheduleController_updateSelectedClass).call(this);
        return this.selected;
    }
    unselect() {
        this.selected = null;
        __classPrivateFieldGet(this, _ScheduleController_instances, "m", _ScheduleController_updateSelectedClass).call(this);
    }
    updateSelected(newData) {
        if (this.archived)
            throw new Error('Cannot update archived schedule.');
        if (!this.workingSchedule)
            throw new Error('No schedule to work with.');
        if (!this.selected)
            throw new Error('No cell selected.');
        this.workingSchedule.updateCell(this.selected.id, this.selected.day, newData);
        const markdown = this.cellsView.generateCell(this.selected, this.workingSchedule.getGroup().findEmployeeIndex(this.selected.id) + 1);
        this.selectedElement.outerHTML = markdown;
        __classPrivateFieldGet(this, _ScheduleController_instances, "m", _ScheduleController_updateSelectedClass).call(this);
    }
    toggleDisabledColumn(day) {
        if (!this.workingSchedule)
            throw new Error('No schedule to work with.');
        if (this.scheduleData.disabledDays.includes(day))
            this.workingSchedule.enableDay(day);
        else
            this.workingSchedule.disableDay(day);
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
}
_ScheduleController_instances = new WeakSet(), _ScheduleController_updateSelectedClass = function _ScheduleController_updateSelectedClass() {
    this.selectedElement?.classList.remove('selected');
    this.previousSelectedElement?.classList.remove('selected');
    this.previousSelectedElement = this.selectedElement;
    //@ts-ignore
    this.selectedElement = [...this.cellsView.parentElement.children].find((child) => child?.dataset?.day === `${this.selected?.day}` &&
        child?.dataset?.row ===
            `${this.workingSchedule.getGroup().findEmployeeIndex(this.selected.id)}`);
    this.selectedElement?.classList.add('selected');
};
export default ScheduleController;
