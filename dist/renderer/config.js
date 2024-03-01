import { EmploymentType } from './models/EmployeeTypes.js';
export const DEFAULT_CONFIG = {
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
    FREE_DAYS: [6, 7],
    SHIFT_TYPES: {
        Morning: {
            translation: 'Poranek',
            startTime: 5.5,
            endTime: 14.5,
            customHours: [],
        },
        Afternoon: {
            translation: 'Popołudnie',
            startTime: 14,
            endTime: 23,
            customHours: [],
        },
    },
};
export const CONFIG = Object.assign(DEFAULT_CONFIG, {});
