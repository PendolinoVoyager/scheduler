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
        this.fillRowfromPreference(emp.getId());
      });
    }
    console.log(this.cells);
  }
  fillRowfromPreference(id: Employee['id']): void {
    for (let i = 0; i < this.length; i++)
      this.fillCellFromPreference(id, i + 1);
  }
  fillFromCellData(cellData: CellData[][]): void {
    this.cells = cellData;
  }
  fillCellFromPreference(id: Employee['id'], day: number): void {
    const employee = this.group.findEmployee(id);
    if (!employee) throw new Error('Employee not found');
    const preference = employee.getPreferenceForDay(this.year, this.month, day);
    this.fillFromShiftType(id, day, preference);
  }
  get length() {
    return CalendarService.getNumOfDays();
  }
  get startingDay() {
    return CalendarService.getStartingDay();
  }
  fillFromShiftType(
    id: Employee['id'],
    day: number,
    shiftType: keyof ShiftTypes
  ) {
    if (!this.validateColRow(id, day)) throw new Error('Out of range');
    const employeeIndex = this.group.findEmployeeIndex(id)!;

    const dayOfWeek = new Date(this.year, this.month - 1, day).getDay();
    const customHours = CONFIG.SHIFT_TYPES[shiftType].customHours!.find(
      (ch) => ch.day === dayOfWeek
    );
    const cellData: CellData = {
      shiftType,
      startTime:
        customHours?.startTime ?? CONFIG.SHIFT_TYPES[shiftType].startTime,
      endTime: customHours?.endTime ?? CONFIG.SHIFT_TYPES[shiftType].endTime,
      id,
    };
    this.cells[employeeIndex!][day - 1] = cellData;
  }
  updateCell(id: Employee['id'], day: number, data: CellData): void {
    if (!this.validateColRow(id, day)) throw new Error('Out of range');
    const employeeIndex = this.group.findEmployeeIndex(id)!;
    this.cells[employeeIndex][day - 1] = data;
  }
  getCellData(id: Employee['id'], day: number): CellData {
    this.validateColRow(id, day);
    return this.cells[this.group.findEmployeeIndex(id)!][day - 1];
  }
  validateColRow(id: Employee['id'], day: number): boolean {
    const employeeIndex = this.group.findEmployeeIndex(id);
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
