import Employee from './Employee.js';
import Group from './Group.js';
import { ShiftTypes } from './types.js';

export type CellData = {
  shiftType: keyof ShiftTypes;
  id: Employee['id'];
  day: number;
  startTime?: number;
  endTime?: number;
};
export type ExcludeId<T> = {
  [K in keyof T as Exclude<K, 'id'>]: T[K];
};

/**
 * Zero-indexed! Schedule is independent of column and row headers.
 */
export abstract class AbstractSchedule {
  public group: Group;
  public year: number;
  public month: number;
  public cells!: CellData[][];
  public disabledDays: Set<number>;
  constructor(group: Group, year: number, month: number) {
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
  abstract get startingDay(): number;
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
  abstract getCellData(id: Employee['id'], day: number): CellData;
  abstract validateColRow(id: Employee['id'], day: number): void | never;
  abstract disableDay(day: number): void;
  abstract enableDay(day: number): void;
  abstract exportJSON(): ScheduleJSON;
  abstract exportCSV(): string;
}

export type ScheduleJSON = {
  archived: boolean;
  groupId: number;
  employees: { id?: Employee['id']; name: string; position: string }[];
  year: number;
  month: number;
  length: number;
  disabledDays: number[];
  data: CellData[][];
};
