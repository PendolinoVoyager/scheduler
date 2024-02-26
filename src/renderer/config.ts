import { EmploymentType } from './models/EmployeeTypes.js';

type Config = {
  DEFAULT_SHIFT: 1 | 2;
  RUN_VALIDATORS: boolean;
  POSITIONS: string[];
  DEFAULT_EMPLOYMENT_TYPE: EmploymentType;
  EMPLOYMENT_TYPE_HOURS: { TYPE: EmploymentType; HOURS: number }[];
  EMPLOYEE_NAME_VALIDATOR: RegExp;
};
export const DEFAULT_CONFIG: Config = {
  DEFAULT_SHIFT: 1,
  RUN_VALIDATORS: true,
  POSITIONS: [
    'Kierownik',
    'Zastępca kierownika',
    'Kasjer / sprzedawca',
    'Sprzedawca',
    'Kasjer',
  ],
  DEFAULT_EMPLOYMENT_TYPE: EmploymentType.FULL_TIME,
  EMPLOYMENT_TYPE_HOURS: [
    { TYPE: EmploymentType.FULL_TIME, HOURS: 160 },
    { TYPE: EmploymentType.PART_TIME, HOURS: 160 },
  ],
  EMPLOYEE_NAME_VALIDATOR: /^(\w{3,}\s\w{3,})$/,
};
export const CONFIG = Object.assign(DEFAULT_CONFIG, {});
