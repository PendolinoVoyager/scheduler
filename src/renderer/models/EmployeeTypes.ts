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
export interface iEmployee {
  id: number;
  name: string;
  position: string;
  disabled: boolean;
  shiftPreference: ShiftType;
  employmentType: EmploymentType;
  shiftPreferencesGrouped: GroupedPreference[];
}

export class AbstractEmployee {
  protected id: number;
  protected name: string;
  protected position!: string;
  protected disabled!: boolean;
  protected shiftPreference!: ShiftType;
  protected employmentType!: EmploymentType;
  constructor(name: string, options: EmployeeConstructorOptions = {}) {
    this.id = Math.floor(Math.random() * 100000000);
    this.name = name;
    const combinedOptions = { ...this.defaultOptions, ...options };
    Object.entries(combinedOptions).forEach(([key, value]) => {
      (this as any)[key] = value;
    });
  }
  defaultOptions: EmployeeConstructorOptions = {
    shiftPreference: CONFIG.DEFAULT_SHIFT,
    position: '',
    disabled: false,
    employmentType: CONFIG.DEFAULT_EMPLOYMENT_TYPE,
  };
}

export type GroupedPreference = {
  year: number;
  month: number;
  defaultPreference: number;
  customPreferences: { day: number; preference: ShiftType }[];
  preferences: ShiftType[];
};
export enum EmploymentType {
  FULL_TIME = 'IDK REALLY',
  PART_TIME = 'Umowa zlecenie',
}
export type EmployeeConstructorOptions = {
  shiftPreference?: ShiftType.Morning | ShiftType.Afternoon;
  position?: string;
  disabled?: boolean;
  employmentType?: EmploymentType;
};
