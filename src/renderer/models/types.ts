import Employee from './Employee';

type CustomHours = {
  day: number;
  startTime: number;
  endTime: number;
};

export interface ShiftInfo {
  translation: string;
  startTime?: number;
  endTime?: number;
  customHours?: CustomHours[];
  shortcut?: string;
}
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

export type ShiftTypes = Record<string, ShiftInfo>;
