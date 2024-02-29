import { EmploymentType } from './models/EmployeeTypes.js';

type Config = {
  DEFAULT_SHIFT: 1 | 2;
  RUN_VALIDATORS: boolean;
  POSITIONS: string[];
  DEFAULT_EMPLOYMENT_TYPE: EmploymentType;
  EMPLOYMENT_TYPE_HOURS: { TYPE: EmploymentType; HOURS: number }[];
  EMPLOYEE_NAME_VALIDATOR: RegExp;
  EMPLOYEE_NAME_ERROR_DESCRIPTION: string;
  FREE_DAYS: number[];
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
  EMPLOYEE_NAME_VALIDATOR: /^([\p{L}\d\s]{3,}\s[\p{L}\d\s]{3,})$/u,
  EMPLOYEE_NAME_ERROR_DESCRIPTION: 'Minimum 2 wyrazy po 3 znaki wymagane.',
  FREE_DAYS: [6, 7],
};
export const CONFIG = Object.assign(DEFAULT_CONFIG, {});
