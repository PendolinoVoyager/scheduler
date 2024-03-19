import { EmploymentType } from './models/EmployeeTypes.js';
import { ShiftTypes } from './models/types.js';

type Config = {
  DEFAULT_SHIFT: keyof ShiftTypes;
  RUN_VALIDATORS: boolean;
  SHOW_VALIDATION_ERRORS: boolean;
  POSITIONS: string[];
  WORK_LAWS: {
    MIN_DAY_REST: number;
    MIN_WEEK_REST: number;
    MAX_DISABLED_WORKDAY: number;
    MAX_DISABLED_WORKWEEK: number;
    AVERAGE_SHIFT_HOURS: number;
  };
  DEFAULT_EMPLOYMENT_TYPE: EmploymentType;
  EMPLOYMENT_TYPE_HOURS: { TYPE: EmploymentType; HOURS: number }[];
  EMPLOYEE_NAME_VALIDATOR: RegExp;
  EMPLOYEE_NAME_ERROR_DESCRIPTION: string;
  FREE_DAYS: number[];
  SHIFT_TYPES: ShiftTypes;
  //Schedule
  MOUSE_BOX: Boolean;
};
export const DEFAULT_CONFIG: Config = {
  DEFAULT_SHIFT: 'Morning',
  RUN_VALIDATORS: true,
  SHOW_VALIDATION_ERRORS: true,
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
  FREE_DAYS: [0, 1],
  SHIFT_TYPES: {
    Morning: {
      translation: 'Poranek',
      startTime: 5,
      endTime: 14,
      shortcut: '1',
      disabled: { startTime: 7.25, endTime: 14.25 },
      // customHours: /*[{ day: 1, startTime: 5, endTime: 14.5 }]*/
    },
    Afternoon: {
      translation: 'Popołudnie',
      startTime: 14.5,
      endTime: 22.5,
      shortcut: '2',
      disabled: { startTime: 14, endTime: 21 },
    },
    None: {
      translation: 'Wolne',
      shortcut: 'w',
    },
    Vacation: {
      translation: 'Urlop',
      shortcut: 'u',
    },
    Training: {
      translation: 'Szkolenie',
      shortcut: 's',
    },
    Custom: {
      translation: 'Inne',
      shortcut: '3',
    },
  },
  MOUSE_BOX: false,
  WORK_LAWS: {
    MIN_DAY_REST: 11,
    MIN_WEEK_REST: 25,
    MAX_DISABLED_WORKDAY: 7,
    MAX_DISABLED_WORKWEEK: 35,
    AVERAGE_SHIFT_HOURS: 8,
  },
};
export const CONFIG = Object.assign({}, DEFAULT_CONFIG);
