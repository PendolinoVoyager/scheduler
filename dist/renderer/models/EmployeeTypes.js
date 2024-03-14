import { CONFIG } from '../config.js';
import Entity from './Entity.js';
export class EmployeeFormError extends Error {
    constructor(property, value) {
        super();
        this.property = property;
        this.value = value;
    }
}
export class AbstractEmployee extends Entity {
    constructor(name) {
        super();
        this.collection = 'employees';
        this.defaultOptions = {
            shiftPreference: CONFIG.DEFAULT_SHIFT,
            position: '',
            disabled: false,
            employmentType: CONFIG.DEFAULT_EMPLOYMENT_TYPE,
        };
        this.name = name;
        Object.entries(this.defaultOptions).forEach(([key, val]) => {
            this[key] = val;
        });
    }
}
export var EmploymentType;
(function (EmploymentType) {
    EmploymentType["FULL_TIME"] = "Umowa o prac\u0119";
    EmploymentType["PART_TIME"] = "Umowa zlecenie";
})(EmploymentType || (EmploymentType = {}));
