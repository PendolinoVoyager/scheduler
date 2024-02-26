import { CONFIG } from '../config.js';
export class EmployeeFormError extends Error {
    constructor(property, value) {
        super();
        this.property = property;
        this.value = value;
    }
}
export class AbstractEmployee {
    constructor(name, options = {}) {
        this.defaultOptions = {
            shiftPreference: CONFIG.DEFAULT_SHIFT,
            position: '',
            disabled: false,
            employmentType: CONFIG.DEFAULT_EMPLOYMENT_TYPE,
        };
        this.id = Math.floor(Math.random() * 100000000);
        this.name = name;
        const combinedOptions = { ...this.defaultOptions, ...options };
        Object.entries(combinedOptions).forEach(([key, value]) => {
            this[key] = value;
        });
    }
}
export var EmploymentType;
(function (EmploymentType) {
    EmploymentType["FULL_TIME"] = "IDK REALLY";
    EmploymentType["PART_TIME"] = "Umowa zlecenie";
})(EmploymentType || (EmploymentType = {}));
