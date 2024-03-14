import { CONFIG } from '../config.js';
import { getShiftHours } from '../helpers/getShiftHours.js';
import CalendarService from '../services/CalendarService.js';
import { AbstractSchedule } from './ScheduleTypes.js';
export class Schedule extends AbstractSchedule {
    constructor(group, year, month) {
        super(group, year, month);
        if (this.month > 12 || this.month < 1)
            throw new Error('Invalid month: ' + month);
        else {
            this.group.getEmployees().forEach((emp) => {
                this.fillRowfromPreference(emp.getId());
            });
        }
    }
    fillRowfromPreference(id) {
        for (let i = 0; i < this.length; i++)
            this.fillCellFromPreference(id, i + 1);
    }
    fillCellFromPreference(id, day) {
        const employee = this.group.findEmployee(id);
        if (!employee)
            throw new Error('Employee not found');
        const preference = employee.getPreferenceForDay(this.year, this.month, day);
        this.fillFromShiftType(id, day, preference);
    }
    get length() {
        return CalendarService.getNumOfDays(this.year, this.month);
    }
    fillFromShiftType(id, day, shiftType) {
        this.validateColRow(id, day);
        const employeeIndex = this.group.findEmployeeIndex(id);
        const dayOfWeek = new Date(this.year, this.month - 1, day).getDay();
        const customHours = CONFIG.SHIFT_TYPES[shiftType]?.customHours?.find((ch) => ch.day === dayOfWeek);
        const cellData = {
            shiftType,
            day,
            startTime: customHours?.startTime ?? CONFIG.SHIFT_TYPES[shiftType].startTime,
            endTime: customHours?.endTime ?? CONFIG.SHIFT_TYPES[shiftType].endTime,
            id,
        };
        if (employeeIndex >= this.cells.length) {
            this.cells.push(new Array(this.length));
        }
        this.cells[employeeIndex][day - 1] = cellData;
    }
    updateCell(id, day, data) {
        this.validateColRow(id, day);
        const employeeIndex = this.group.findEmployeeIndex(id);
        if (Object.keys(data).includes('id'))
            throw new Error("Can't change to id " + id);
        if (data.startTime || data.endTime)
            this.cells[employeeIndex][day - 1].shiftType = 'Custom';
        Object.assign(this.cells[employeeIndex][day - 1], data);
        if (data.shiftType && data.shiftType !== 'Custom') {
            const { startTime, endTime } = getShiftHours(data.shiftType, CalendarService.getDOW(this.year, this.month, day));
            this.cells[employeeIndex][day - 1].startTime = startTime;
            this.cells[employeeIndex][day - 1].endTime = endTime;
        }
    }
    getCell(id, day) {
        this.validateColRow(id, day);
        return this.cells[this.group.findEmployeeIndex(id)][day - 1];
    }
    validateColRow(id, day) {
        const employeeIndex = this.group.findEmployeeIndex(id);
        if (employeeIndex === -1 || day > this.length || day < 1)
            throw new Error(`Invalid column or row: row(${employeeIndex}, day ${day})`);
    }
    disableDay(day) {
        if (day > this.length || day <= 0)
            throw new Error(`Out of range: day ${day}.`);
        this.disabledDays.add(day);
    }
    enableDay(day) {
        this.disabledDays.delete(day);
    }
    deleteRow(row) {
        this.cells.splice(row, 1);
    }
    /**
     * Note: returned ScheduleJSON.data is a reference to Schedule.cells.
     *
     */
    exportJSON() {
        return {
            groupId: this.group.getId(),
            employees: this.group.getEmployees().map((emp) => {
                return {
                    id: emp.getId(),
                    name: emp.getName(),
                    position: emp.getPosition(),
                };
            }),
            year: this.year,
            month: this.month,
            length: this.length,
            disabledDays: this.getDisabledDays(),
            data: this.cells,
        };
    }
    disableFreeDaysInPoland() {
        for (let i = 1; i <= this.length; i++) {
            if (CalendarService.isFreeDayInPoland(i, this.year, this.month))
                this.disableDay(i);
        }
    }
    exportCSV() {
        throw new Error('Method not implemented.');
    }
    static assignCellData(schedule, cellData) {
        cellData.forEach((cellRow) => {
            const employee = schedule.getGroup().findEmployee(cellRow[0].id);
            if (!employee)
                return;
            let tip = [];
            if (schedule.length > cellRow.length) {
                tip = schedule.cells[schedule.group.findEmployeeIndex(employee.getId())].slice(cellRow.length);
            }
            schedule.cells[schedule.group.findEmployeeIndex(employee.getId())] = [
                ...cellRow.slice(0, schedule.length),
                ...tip,
            ];
        });
    }
}
