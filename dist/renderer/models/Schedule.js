import { CONFIG } from '../config.js';
import CalendarService from '../services/CalendarService.js';
import { AbstractSchedule } from './ScheduleTypes.js';
export class Schedule extends AbstractSchedule {
    constructor(group, year, month, cellData) {
        super(group, year, month);
        if (cellData)
            this.fillFromCellData(cellData);
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
    fillFromCellData(cellData) {
        this.cells = cellData;
    }
    fillCellFromPreference(id, day) {
        const employee = this.group.findEmployee(id);
        if (!employee)
            throw new Error('Employee not found');
        const preference = employee.getPreferenceForDay(this.year, this.month, day);
        this.fillFromShiftType(id, day, preference);
    }
    get length() {
        return CalendarService.getNumOfDays();
    }
    get startingDay() {
        return CalendarService.getStartingDay();
    }
    fillFromShiftType(id, day, shiftType) {
        if (!this.validateColRow(id, day))
            throw new Error('Out of range');
        const employeeIndex = this.group.findEmployeeIndex(id);
        const dayOfWeek = new Date(this.year, this.month - 1, day).getDay();
        const customHours = CONFIG.SHIFT_TYPES[shiftType].customHours.find((ch) => ch.day === dayOfWeek);
        const cellData = {
            shiftType,
            day,
            startTime: customHours?.startTime ?? CONFIG.SHIFT_TYPES[shiftType].startTime,
            endTime: customHours?.endTime ?? CONFIG.SHIFT_TYPES[shiftType].endTime,
            id,
        };
        this.cells[employeeIndex][day - 1] = cellData;
    }
    updateCell(id, day, data) {
        if (!this.validateColRow(id, day))
            throw new Error('Out of range');
        const employeeIndex = this.group.findEmployeeIndex(id);
        this.cells[employeeIndex][day - 1] = data;
    }
    getCellData(id, day) {
        this.validateColRow(id, day);
        return this.cells[this.group.findEmployeeIndex(id)][day - 1];
    }
    validateColRow(id, day) {
        const employeeIndex = this.group.findEmployeeIndex(id);
        if (employeeIndex == null || day > this.length)
            return false;
        return true;
    }
    disableDay(day) {
        if (day > this.length || day <= 0)
            throw new Error(`Out of range: day ${day}.`);
        this.disabledDays.add(day);
    }
    enableDay(day) {
        this.disabledDays.delete(day);
        //Update existing cells
    }
    getDisabledDays() {
        return [...this.disabledDays];
    }
    exportJSON() {
        throw new Error('Method not implemented.');
    }
    exportCSV() {
        throw new Error('Method not implemented.');
    }
    importJSON() {
        throw new Error('Method not implemented.');
    }
}
