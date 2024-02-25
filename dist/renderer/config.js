import { EmploymentType } from './models/types.js';
export const DEFAULT_CONFIG = {
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
};
export const CONFIG = Object.assign(DEFAULT_CONFIG, {});
