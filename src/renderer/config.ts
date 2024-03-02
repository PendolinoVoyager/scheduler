import { EmploymentType } from './models/EmployeeTypes.js';
import { ShiftTypes } from './models/types.js';

type Config = {
  DEFAULT_SHIFT: keyof ShiftTypes;
  RUN_VALIDATORS: boolean;
  POSITIONS: string[];
  DEFAULT_EMPLOYMENT_TYPE: EmploymentType;
  EMPLOYMENT_TYPE_HOURS: { TYPE: EmploymentType; HOURS: number }[];
  EMPLOYEE_NAME_VALIDATOR: RegExp;
  EMPLOYEE_NAME_ERROR_DESCRIPTION: string;
  FREE_DAYS: number[];
  SHIFT_TYPES: ShiftTypes;
};
export const DEFAULT_CONFIG: Config = {
  DEFAULT_SHIFT: 'Morning',
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
  FREE_DAYS: [0],
  SHIFT_TYPES: {
    Morning: {
      translation: 'Poranek',
      startTime: 5.5,
      endTime: 14.5,
      customHours: [{ day: 1, startTime: 5, endTime: 14.5 }],
    },
    Afternoon: {
      translation: 'Popołudnie',
      startTime: 14,
      endTime: 23,
    },
    None: {
      translation: 'Wolne',
    },
    Vacation: {
      translation: 'Urlop',
    },
    Training: {
      translation: 'Szkolenie',
    },
    Custom: {
      translation: 'Inne',
    },
  },
};
export const CONFIG = Object.assign(DEFAULT_CONFIG, {});
