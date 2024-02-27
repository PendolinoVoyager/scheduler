import { CONFIG } from '../config.js';
import { ShiftType } from './types.js';

export class EmployeeFormError extends Error {
  public property;
  public value;
  constructor(property: string, value: any) {
    super();
    this.property = property;
    this.value = value;
  }
}
export type EmployeeFields = {
  name?: string;
  position?: string;
  disabled?: boolean;
  shiftPreference?: ShiftType;
  employmentType?: EmploymentType;
  shiftPreferencesGrouped?: MonthlyShiftTypes[];
};

export class AbstractEmployee {
  protected id: number;
  protected name: string;
  protected position!: string;
  protected disabled!: boolean;
  protected shiftPreference!: ShiftType;
  protected employmentType!: EmploymentType;
  constructor(name: string) {
    this.id = Math.floor(Math.random() * 100000000);
    this.name = name;
    Object.entries(this.defaultOptions).forEach(([key, val]) => {
      (this as any)[key] = val;
    });
  }
  private defaultOptions: EmployeeFields = {
    shiftPreference: CONFIG.DEFAULT_SHIFT,
    position: '',
    disabled: false,
    employmentType: CONFIG.DEFAULT_EMPLOYMENT_TYPE,
  };
}

export type MonthlyShiftTypes = {
  year: number;
  month: number;
  defaultPreference: number;
  customPreferences: { day: number; preference: ShiftType }[];
  preferences: ShiftType[];
};

export enum EmploymentType {
  FULL_TIME = 'Umowa o pracę',
  PART_TIME = 'Umowa zlecenie',
}
