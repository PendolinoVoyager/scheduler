import { CONFIG } from '../config.js';
import { generateId } from '../helpers/generateId.js';
import Entity from './Entity.js';
import { ShiftTypes } from './types.js';

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
  shiftPreference?: keyof ShiftTypes;
  employmentType?: EmploymentType;
  shiftPreferencesGrouped?: MonthlyShiftTypes[];
};

export class AbstractEmployee extends Entity {
  collection = 'employees';
  protected name: string | undefined;
  protected position!: string;
  protected disabled!: boolean;
  protected shiftPreference!: keyof ShiftTypes;
  protected employmentType!: EmploymentType;
  constructor(name?: string) {
    super();

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
export type EmployeeJSON = {
  id: Entity['id'];
  name: string;
  position: string;
  disabled: boolean;
  shiftPreference: keyof ShiftTypes;
  employmentType: EmploymentType;
};
export type MonthlyShiftTypes = {
  year: number;
  month: number;
  defaultPreference: keyof ShiftTypes;
  customPreferences: { day: number; preference: keyof ShiftTypes }[];
  preferences: (keyof ShiftTypes)[];
};

export enum EmploymentType {
  FULL_TIME = 'Umowa o pracę',
  PART_TIME = 'Umowa zlecenie',
}
