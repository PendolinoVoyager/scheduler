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
import { ScheduleValidator } from '../../services/ScheduleValidator.js';
import { CONFIG } from '../../config.js';
import ValidatorNoticesView from '../../views/scheduleViews/ValidatorNoticesView.js';
class ScheduleController extends AbstractController {
    constructor() {
        super();
        _ScheduleController_instances.add(this);
        this.scheduleData = null;
        this.selected = null;
        this.selectedElement = null;
        this.selectedEmployeeCell = null;
        this.previousSelectedElement = null;
        this.workingSchedule = null;
        this.titleElement = document.getElementById('main-info');
        this.cellsView = new CellsView(document.getElementById('calendar-body'));
        this.validatorNoticesView = new ValidatorNoticesView(document.getElementById('calendar-notices'));
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
        if (schedule.getGroup().getEmployees().length !== 0) {
            this.mouseController.bind();
            this.headerUtilsController.bind();
            this.keyboardController.bind();
        }
        this.renderRawCellData(schedule.exportJSON());
        this.addEventListener('select-change', (e) => {
            const newEvent = new CustomEvent('select-change');
            if (e.detail.src !== this.keyboardController)
                this.keyboardController.dispatchEvent(newEvent);
            if (e.detail.src !== this.mouseController)
                this.mouseController.dispatchEvent(newEvent);
            if (e.detail.src !== this.headerUtilsController)
                this.headerUtilsController.dispatchEvent(newEvent);
        });
        CONFIG.RUN_VALIDATORS && this.handleValidation();
    }
    /**
     * Should only be used alone to render archived schedules.
     * Otherwise, use 'createLiveSchedule'
     * @param scheduleJSON
     */
    renderRawCellData(scheduleJSON) {
        this.scheduleData = scheduleJSON;
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
        __classPrivateFieldGet(this, _ScheduleController_instances, "m", _ScheduleController_updateSelectedClass).call(this, row, day);
        return this.selected;
    }
    unselect() {
        this.selected = null;
        __classPrivateFieldGet(this, _ScheduleController_instances, "m", _ScheduleController_updateSelectedClass).call(this, -1, -1);
    }
    updateSelected(newData) {
        if (!this.workingSchedule)
            throw new Error('No schedule to work with.');
        if (!this.selected)
            throw new Error('No cell selected.');
        this.workingSchedule.updateCell(this.selected.id, this.selected.day, newData);
        const row = this.workingSchedule
            .getGroup()
            .findEmployeeIndex(this.selected.id);
        const markdown = this.cellsView.generateCell(this.selected, row + 1);
        this.selectedElement.outerHTML = markdown;
        __classPrivateFieldGet(this, _ScheduleController_instances, "m", _ScheduleController_updateSelectedClass).call(this, row, this.selected.day);
        CONFIG.RUN_VALIDATORS && this.handleValidation();
    }
    toggleDisabledColumn(day) {
        if (!this.workingSchedule)
            throw new Error('No schedule to work with.');
        if (this.scheduleData.disabledDays.includes(day))
            this.workingSchedule.enableDay(day);
        else
            this.workingSchedule.disableDay(day);
        this.renderRawCellData(this.workingSchedule.exportJSON());
        CONFIG.RUN_VALIDATORS && this.handleValidation();
    }
    teardown() {
        this.mouseController.unbind();
        this.headerUtilsController.unbind();
        this.keyboardController.unbind();
        this.scheduleData = null;
        this.selected = null;
        this.workingSchedule = null;
        this.cellsView.parentElement.style.gridTemplateColumns = '1fr';
        this.cellsView.renderSpinner();
    }
    handleValidation() {
        const notices = ScheduleValidator.validate(this.workingSchedule);
        const stats = this.workingSchedule.getStats();
        const totalHoursElement = document.getElementById('total-hours');
        if (totalHoursElement)
            totalHoursElement.innerText = 'Godziny łącznie: ' + stats.hours;
        const workingDaysElement = document.getElementById('working-days');
        if (workingDaysElement)
            workingDaysElement.innerText = 'Dni pracujące: ' + stats.workingDays;
        this.validatorNoticesView.render({
            notices,
            employees: this.workingSchedule.getGroup().getEmployees(),
        });
        //calc hours for employees and display it
        //highlight cells (add class warning) NEED TO REFACTOR ASAP SLOW AS HELL
        [...this.cellsView.parentElement.children].forEach((child) => {
            child.classList.remove('warning');
            if (!CONFIG.SHOW_VALIDATION_ERRORS)
                return;
            const day = child.dataset.day;
            const row = child.dataset.row;
            if (!day || !row)
                return;
            const id = this.workingSchedule
                ?.getGroup()
                ?.getEmployees()[+row].getId();
            const notice = notices.find((notice) => notice.cell?.day === +day && notice.cell.employeeId === id);
            if (!notice)
                return;
            child.classList.add('warning');
        });
    }
}
_ScheduleController_instances = new WeakSet(), _ScheduleController_updateSelectedClass = function _ScheduleController_updateSelectedClass(row, day) {
    this.selectedElement?.classList.remove('selected');
    this.previousSelectedElement?.classList.remove('selected');
    this.previousSelectedElement = this.selectedElement;
    //@ts-ignore
    this.selectedElement = [...this.cellsView.parentElement.children].find((child) => {
        //@ts-ignore
        if (+child.dataset.row !== row)
            return;
        //Means it's employee
        if (!child.dataset.day) {
            if (child.classList.contains('cell-employee'))
                //@ts-ignore
                child.lastElementChild.textContent =
                    this.workingSchedule
                        ?.getStats() //@ts-ignore
                        ?.hours?.at(row);
        }
        //@ts-ignore
        return +child?.dataset?.day === day;
    });
    this.selectedElement?.classList.add('selected');
};
export default ScheduleController;
