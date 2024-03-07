var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Employee_instances, _Employee_createGroupedPreference, _Employee_updateGroupedPreference, _Employee_addCustomPreferenceToGroup;
import { CONFIG } from '../config.js';
import FormError from '../errors/FormError.js';
import { EmploymentType, AbstractEmployee, } from './EmployeeTypes.js';
class Employee extends AbstractEmployee {
    constructor(name, options = {}) {
        super(name);
        _Employee_instances.add(this);
        this.shiftPreferencesGrouped = [];
        Object.entries(options).forEach(([key, value]) => {
            this[key] = value;
        });
    }
    addCustomPreference(year, month, day, shiftPreference) {
        const groupedPreference = this.shiftPreferencesGrouped.find((p) => p.year === year && p.month === month);
        if (!groupedPreference) {
            const newPreferenceMonth = __classPrivateFieldGet(this, _Employee_instances, "m", _Employee_createGroupedPreference).call(this, year, month);
            __classPrivateFieldGet(this, _Employee_instances, "m", _Employee_addCustomPreferenceToGroup).call(this, newPreferenceMonth, day, shiftPreference);
            return;
        }
        __classPrivateFieldGet(this, _Employee_instances, "m", _Employee_addCustomPreferenceToGroup).call(this, groupedPreference, day, shiftPreference);
    }
    getPreferencesForMonth(year, month) {
        const groupedPreference = this.shiftPreferencesGrouped.find((p) => p.year === year && p.month === month);
        if (!groupedPreference)
            return __classPrivateFieldGet(this, _Employee_instances, "m", _Employee_createGroupedPreference).call(this, year, month);
        if (groupedPreference.defaultPreference !== this.shiftPreference)
            __classPrivateFieldGet(this, _Employee_instances, "m", _Employee_updateGroupedPreference).call(this, groupedPreference);
        return groupedPreference;
    }
    removePreference(year, month, day) {
        const groupedPreference = this.shiftPreferencesGrouped.find((p) => p.year === year && p.month === month);
        if (!groupedPreference)
            return;
        const i = groupedPreference.customPreferences.findIndex((cp) => cp.day === day);
        if (i === -1)
            return;
        groupedPreference.customPreferences.splice(i, 1);
        __classPrivateFieldGet(this, _Employee_instances, "m", _Employee_updateGroupedPreference).call(this, groupedPreference);
    }
    removePreferences(year, month) {
        const groupedPreference = this.shiftPreferencesGrouped.find((p) => p.year === year && p.month === month);
        if (!groupedPreference)
            return;
        // Splice the whole thang
        groupedPreference.customPreferences.splice(0, groupedPreference.customPreferences.length);
    }
    getPreferenceForDay(year, month, day) {
        const monthPreference = this.getPreferencesForMonth(year, month).preferences;
        return monthPreference[day - 1];
    }
    updateFromFormData(form) {
        function getFormElement(form, name) {
            return form.querySelector(`[name="${name}"]`);
        }
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const parsedData = {
            id: +data.id,
            name: data.name.toString(),
            shiftPreference: data.shiftPreference.toString(),
            disabled: Boolean(data.disabled),
            position: data.position === 'other'
                ? data['custom-position'].toString()
                : CONFIG.POSITIONS[+data.position],
            employmentType: data['employmentType'].toString(),
        };
        const issues = [];
        if (!parsedData.name.match(CONFIG.EMPLOYEE_NAME_VALIDATOR))
            issues.push({
                element: getFormElement(form, 'name'),
                description: CONFIG.EMPLOYEE_NAME_ERROR_DESCRIPTION,
            });
        if (parsedData.id !== this.getId())
            throw new Error('Invalid ID.');
        if (!Object.keys(CONFIG.SHIFT_TYPES).includes(parsedData.shiftPreference))
            issues.push({
                element: getFormElement(form, 'shiftPreference'),
                description: 'Invalid value.',
            });
        if (data.position === 'other' && !parsedData.position)
            issues.push({
                element: getFormElement(form, 'position'),
                description: 'Brak stanowiska.',
            });
        if (!Object.keys(EmploymentType).includes(parsedData.employmentType))
            issues.push({
                element: getFormElement(form, 'employmentType'),
                description: 'Invalid value.',
            });
        if (issues.length > 0)
            throw new FormError(true, ...issues);
        this.name = parsedData.name;
        this.shiftPreference = parsedData.shiftPreference;
        this.disabled = parsedData.disabled;
        this.position = parsedData.position;
        this.employmentType = EmploymentType[parsedData.employmentType];
    }
    getInitials() {
        const split = this.name.split(' ');
        return split[0] + split[1][0];
    }
    getName() {
        return this.name;
    }
    getPosition() {
        return this.position;
    }
    getShiftPreference() {
        return this.shiftPreference;
    }
    getEmploymentType() {
        return this.employmentType;
    }
    isDisabled() {
        return this.disabled;
    }
    setDisabled(disabled) {
        this.disabled = disabled;
    }
    setName(newName) {
        if (!CONFIG.EMPLOYEE_NAME_VALIDATOR.test(newName))
            throw new Error(CONFIG.EMPLOYEE_NAME_ERROR_DESCRIPTION);
        this.name = newName;
    }
    setPosition(newPosition) {
        this.position = newPosition;
    }
    setShiftPreference(newPreference) {
        this.shiftPreference = newPreference;
    }
    setEmploymentType(newType) {
        this.employmentType = newType;
    }
}
_Employee_instances = new WeakSet(), _Employee_createGroupedPreference = function _Employee_createGroupedPreference(year, month) {
    const newPreferenceMonth = {
        year,
        month,
        defaultPreference: this.shiftPreference,
        customPreferences: [],
        preferences: new Array(new Date(year, month, 0).getDate()).fill(this.shiftPreference),
    };
    this.shiftPreferencesGrouped.push(newPreferenceMonth);
    return newPreferenceMonth;
}, _Employee_updateGroupedPreference = function _Employee_updateGroupedPreference(groupedPreference) {
    groupedPreference.defaultPreference = this.shiftPreference;
    groupedPreference.preferences.fill(this.shiftPreference);
    groupedPreference.customPreferences.forEach((cp) => {
        groupedPreference.preferences[cp.day - 1] = cp.preference;
    });
}, _Employee_addCustomPreferenceToGroup = function _Employee_addCustomPreferenceToGroup(groupedPreference, day, preference) {
    const customPreference = groupedPreference.customPreferences.find((cp) => cp.day === day);
    if (customPreference)
        customPreference.preference = preference;
    else
        groupedPreference.customPreferences.push({ day, preference: preference });
    groupedPreference.preferences[day - 1] = preference;
};
export default Employee;
