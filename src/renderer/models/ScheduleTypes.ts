import Employee from './Employee.js';
import Group from './Group.js';
import { ShiftTypes } from './types.js';

export type CellData = {
  shiftType: keyof ShiftTypes;
  employee: Employee;
  startTime?: number;
  endTime?: number;
};

/**
 * Zero-indexed! Schedule is independent of column and row headers.
 *
 */
export abstract class AbstractSchedule {
  public group: Group;
  public year: number;
  public month: number;
  public cells!: CellData[][];
  constructor(group: Group, year: number, month: number) {
    this.group = group;
    this.year = year;
    this.month = month;
    this.initCellArray();
  }
  initCellArray() {
    this.cells = new Array<CellData[]>(this.group.getEmployees().length).fill(
      new Array<CellData>(this.length)
    );
  }
  abstract get length(): number;
  abstract get startingDay(): number;
  abstract fillRowfromPreference(employee: Employee): void;
  abstract fillFromCellData(cellData: CellData[][]): void;
  abstract fillCellFromPreference(employee: Employee, day: number): void;
  abstract fillFromShiftType(
    employee: Employee,
    day: number,
    shiftType: keyof ShiftTypes
  ): void;
  abstract updateCell(employee: Employee, day: number, data: CellData): void;
  abstract getCellData(employee: Employee, day: number): CellData;
  abstract validateColRow(employee: Employee, day: number): boolean;
  abstract exportJSON(): string;
  abstract exportCSV(): string;
  abstract importJSON(): void;
}
