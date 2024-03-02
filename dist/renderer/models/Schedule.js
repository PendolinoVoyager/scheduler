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
                this.fillRowfromPreference(emp);
            });
        }
        console.log(this.cells);
    }
    fillRowfromPreference(employee) {
        for (let i = 0; i < this.length; i++)
            this.fillCellFromPreference(employee, i + 1);
    }
    fillFromCellData(cellData) {
        this.cells = cellData;
    }
    fillCellFromPreference(employee, day) {
        const preference = employee.getPreferenceForDay(this.year, this.month, day);
        this.fillFromShiftType(employee, day, preference);
    }
    get length() {
        return CalendarService.getNumOfDays();
    }
    get startingDay() {
        return CalendarService.getStartingDay();
    }
    fillFromShiftType(employee, day, shiftType) {
        if (!this.validateColRow(employee, day))
            throw new Error('Out of range');
        const employeeIndex = this.group.findEmployeeIndex(employee.getId());
        const dayOfWeek = new Date(this.year, this.month - 1, day).getDay();
        const customHours = CONFIG.SHIFT_TYPES[shiftType].customHours.find((ch) => ch.day === dayOfWeek);
        const cellData = {
            shiftType,
            startTime: customHours?.startTime ?? CONFIG.SHIFT_TYPES[shiftType].startTime,
            endTime: customHours?.endTime ?? CONFIG.SHIFT_TYPES[shiftType].endTime,
            employee,
        };
        this.cells[employeeIndex][day - 1] = cellData;
    }
    updateCell(employee, day, data) {
        if (!this.validateColRow(employee, day))
            throw new Error('Out of range');
        const employeeIndex = this.group.findEmployeeIndex(employee.getId());
        this.cells[employeeIndex][day - 1] = data;
    }
    getCellData(employee, day) {
        this.validateColRow(employee, day);
        return this.cells[this.group.findEmployeeIndex(employee.getId())][day - 1];
    }
    validateColRow(employee, day) {
        const employeeIndex = this.group.findEmployeeIndex(employee.getId());
        if (employeeIndex === undefined || day > this.length)
            return false;
        return true;
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
