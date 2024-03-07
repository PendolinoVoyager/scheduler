import { CONFIG } from '../config.js';
import CalendarService from '../services/CalendarService.js';
import Employee from './Employee.js';
import Group from './Group.js';
import {
  AbstractSchedule,
  CellData,
  ExcludeId,
  ScheduleJSON,
} from './ScheduleTypes.js';
import { ShiftTypes } from './types.js';
export class Schedule extends AbstractSchedule {
  constructor(group: Group, year: number, month: number) {
    super(group, year, month);

    if (this.month > 12 || this.month < 1)
      throw new Error('Invalid month: ' + month);
    else {
      this.group.getEmployees().forEach((emp) => {
        this.fillRowfromPreference(emp.getId());
      });
    }
  }
  fillRowfromPreference(id: Employee['id']): void {
    for (let i = 0; i < this.length; i++)
      this.fillCellFromPreference(id, i + 1);
  }
  fillCellFromPreference(id: Employee['id'], day: number): void {
    const employee = this.group.findEmployee(id);
    if (!employee) throw new Error('Employee not found');
    const preference = employee.getPreferenceForDay(this.year, this.month, day);
    this.fillFromShiftType(id, day, preference);
  }
  get length() {
    return CalendarService.getNumOfDays(this.year, this.month);
  }

  fillFromShiftType(
    id: Employee['id'],
    day: number,
    shiftType: keyof ShiftTypes
  ) {
    this.validateColRow(id, day);
    const employeeIndex = this.group.findEmployeeIndex(id)!;

    const dayOfWeek = new Date(this.year, this.month - 1, day).getDay();
    const customHours = CONFIG.SHIFT_TYPES[shiftType]?.customHours?.find(
      (ch) => ch.day === dayOfWeek
    );
    const cellData: CellData = {
      shiftType,
      day,
      startTime:
        customHours?.startTime ?? CONFIG.SHIFT_TYPES[shiftType].startTime,
      endTime: customHours?.endTime ?? CONFIG.SHIFT_TYPES[shiftType].endTime,
      id,
    };
    this.cells[employeeIndex][day - 1] = cellData;
  }
  updateCell(
    id: Employee['id'],
    day: number,
    data: Partial<ExcludeId<CellData>>
  ): void {
    this.validateColRow(id, day);
    const employeeIndex = this.group.findEmployeeIndex(id)!;
    const currentCell = this.cells[employeeIndex][day - 1];
    if (Object.keys(data).includes('id'))
      throw new Error("Can't change to id " + id);
    this.cells[employeeIndex][day - 1] = { ...currentCell, ...data };
  }
  getCell(id: Employee['id'], day: number): CellData {
    this.validateColRow(id, day);
    return this.cells[this.group.findEmployeeIndex(id)!][day - 1];
  }
  validateColRow(id: Employee['id'], day: number): void | never {
    const employeeIndex = this.group.findEmployeeIndex(id);

    if (employeeIndex === -1 || day > this.length || day < 1)
      throw new Error(
        `Invalid column or row: row(${employeeIndex}, day ${day})`
      );
  }
  disableDay(day: number): void {
    if (day > this.length || day <= 0)
      throw new Error(`Out of range: day ${day}.`);
    this.disabledDays.add(day);
  }
  enableDay(day: number): void {
    this.disabledDays.delete(day);
  }
  exportJSON(): ScheduleJSON {
    return {
      archived: false,
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
  exportCSV(): string {
    throw new Error('Method not implemented.');
  }
  static importJSON(scheduleJSON: ScheduleJSON): Schedule {
    throw new Error('Method not implemented.');
  }
}
