import { CONFIG } from '../config.js';
import CalendarService from '../services/CalendarService.js';
import Employee from './Employee.js';
import Group from './Group.js';
import { AbstractSchedule, CellData } from './ScheduleTypes.js';
import { ShiftTypes } from './types.js';
export class Schedule extends AbstractSchedule {
  constructor(
    group: Group,
    year: number,
    month: number,
    cellData?: CellData[][]
  ) {
    super(group, year, month);
    if (cellData) this.fillFromCellData(cellData);
    else {
      this.group.getEmployees().forEach((emp) => {
        this.fillRowfromPreference(emp);
      });
    }
    console.log(this.cells);
  }
  fillRowfromPreference(employee: Employee): void {
    for (let i = 0; i < this.length; i++)
      this.fillCellFromPreference(employee, i + 1);
  }
  fillFromCellData(cellData: CellData[][]): void {
    this.cells = cellData;
  }
  fillCellFromPreference(employee: Employee, day: number): void {
    const preference = employee.getPreferenceForDay(this.year, this.month, day);
    this.fillFromShiftType(employee, day, preference);
  }
  get length() {
    return CalendarService.getNumOfDays();
  }
  get startingDay() {
    return CalendarService.getStartingDay();
  }
  fillFromShiftType(
    employee: Employee,
    day: number,
    shiftType: keyof ShiftTypes
  ) {
    if (!this.validateColRow(employee, day)) throw new Error('Out of range');
    const employeeIndex = this.group.findEmployeeIndex(employee.getId())!;

    const dayOfWeek = new Date(this.year, this.month - 1, day).getDay();
    const customHours = CONFIG.SHIFT_TYPES[shiftType].customHours!.find(
      (ch) => ch.day === dayOfWeek
    );
    const cellData: CellData = {
      shiftType,
      startTime:
        customHours?.startTime ?? CONFIG.SHIFT_TYPES[shiftType].startTime,
      endTime: customHours?.endTime ?? CONFIG.SHIFT_TYPES[shiftType].endTime,
      employee,
    };
    this.cells[employeeIndex!][day - 1] = cellData;
  }
  updateCell(employee: Employee, day: number, data: CellData): void {
    if (!this.validateColRow(employee, day)) throw new Error('Out of range');
    const employeeIndex = this.group.findEmployeeIndex(employee.getId())!;
    this.cells[employeeIndex][day - 1] = data;
  }
  getCellData(employee: Employee, day: number): CellData {
    this.validateColRow(employee, day);
    return this.cells[this.group.findEmployeeIndex(employee.getId())!][day - 1];
  }
  validateColRow(employee: Employee, day: number): boolean {
    const employeeIndex = this.group.findEmployeeIndex(employee.getId());
    if (employeeIndex === undefined || day > this.length) return false;
    return true;
  }
  exportJSON(): string {
    throw new Error('Method not implemented.');
  }
  exportCSV(): string {
    throw new Error('Method not implemented.');
  }
  importJSON(): void {
    throw new Error('Method not implemented.');
  }
}
