import Employee from './Employee.js';
import Entity from './Entity.js';
import Group from './Group.js';
import { CellData, ExcludeId, ShiftTypes } from './types.js';

/**
 * Zero-indexed! Schedule is independent of column and row headers.
 */
export abstract class AbstractSchedule extends Entity {
  protected group: Group;
  public readonly year: number;
  public readonly month: number;
  protected cells!: CellData[][];
  protected disabledDays: Set<number>;
  collection = 'schedules';

  constructor(group: Group, year: number, month: number) {
    super();
    this.group = group;
    this.year = year;
    this.month = month;

    this.disabledDays = new Set<number>();
    this.initCellArray();
  }
  initCellArray() {
    const numEmployees = this.group.getEmployees().length;
    this.cells = new Array<CellData[]>(numEmployees);
    for (let i = 0; i < numEmployees; i++) {
      this.cells[i] = new Array<CellData>(this.length);
    }
  }
  abstract get length(): number;
  abstract fillRowfromPreference(id: Employee['id']): void;
  abstract fillCellFromPreference(id: Employee['id'], day: number): void;
  abstract fillFromShiftType(
    id: Employee['id'],
    day: number,
    shiftType: keyof ShiftTypes
  ): void;
  abstract updateCell(
    id: Employee['id'],
    day: number,
    data: Partial<ExcludeId<CellData>>
  ): void;
  abstract getCell(id: Employee['id'], day: number): CellData;
  abstract validateColRow(id: Employee['id'], day: number): void | never;
  abstract disableDay(day: number): void;
  abstract enableDay(day: number): void;

  abstract exportJSON(): ScheduleJSON;
  abstract exportCSV(): string;
  getGroup() {
    return this.group;
  }
  getCells() {
    return this.cells;
  }
  getDisabledDays(): Array<number> {
    return [...this.disabledDays];
  }
}

export type ScheduleJSON = {
  id: Entity['id'];
  groupId: Entity['id'];
  employees: {
    id: Employee['id'];
    name: string;
    position: string;
    hours: number;
  }[];
  year: number;
  month: number;
  length: number;
  totalHours: number;
  disabledDays: number[];
  data: CellData[][];
};
