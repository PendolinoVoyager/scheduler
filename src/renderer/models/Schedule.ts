import { CONFIG } from '../config.js';
import { getShiftHours } from '../helpers/getShiftHours.js';
import CalendarService from '../services/CalendarService.js';
import Employee from './Employee.js';
import Group from './Group.js';
import { AbstractSchedule, ScheduleJSON } from './ScheduleTypes.js';
import { CellData, ExcludeId, ShiftTypes } from './types.js';
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
    const employee = this.group.findEmployee(id)!;
    const dayOfWeek = new Date(this.year, this.month - 1, day).getDay();
    const { startTime, endTime } = getShiftHours(
      shiftType,
      dayOfWeek,
      employee.isDisabled()
    );
    const cellData: CellData = {
      shiftType,
      day,
      startTime,
      endTime,
      id,
    };
    if (employeeIndex >= this.cells.length) {
      this.cells.push(new Array<CellData>(this.length));
    }
    this.cells[employeeIndex][day - 1] = cellData;
  }
  updateCell(
    id: Employee['id'],
    day: number,
    data: Partial<ExcludeId<CellData>>
  ): void {
    this.validateColRow(id, day);
    const employeeIndex = this.group.findEmployeeIndex(id)!;
    const employee = this.group.getEmployees()[employeeIndex];
    if (Object.keys(data).includes('id'))
      throw new Error("Can't change to id " + id);
    if (data.startTime || data.endTime)
      this.cells[employeeIndex][day - 1].shiftType = 'Custom';
    Object.assign(this.cells[employeeIndex][day - 1], data);

    if (data.shiftType && data.shiftType !== 'Custom') {
      const { startTime, endTime } = getShiftHours(
        data.shiftType,
        CalendarService.getDOW(this.year, this.month, day),
        employee.isDisabled()
      );
      this.cells[employeeIndex][day - 1].startTime = startTime;
      this.cells[employeeIndex][day - 1].endTime = endTime;
    }
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
  deleteRow(row: number) {
    this.cells.splice(row, 1);
  }
  /**
   * Note: returned ScheduleJSON.data is a reference to Schedule.cells.
   *
   */
  exportJSON(): ScheduleJSON {
    return {
      id: this.id,
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
  static assignCellData(schedule: Schedule, cellData: CellData[][]): void {
    cellData.forEach((cellRow) => {
      const employee = schedule.getGroup().findEmployee(cellRow[0].id);
      if (!employee) return;
      let tip: any[] = [];
      if (schedule.length > cellRow.length) {
        tip = schedule.cells[
          schedule.group.findEmployeeIndex(employee.getId())
        ].slice(cellRow.length);
      }

      schedule.cells[schedule.group.findEmployeeIndex(employee.getId())] = [
        ...cellRow.slice(0, schedule.length),
        ...tip,
      ];
    });
  }
  recover(scheduleJSON: ScheduleJSON) {
    Schedule.assignCellData(this, scheduleJSON.data);
    this.disabledDays = new Set(scheduleJSON.disabledDays);
    this.setId(scheduleJSON.id);
  }
}
