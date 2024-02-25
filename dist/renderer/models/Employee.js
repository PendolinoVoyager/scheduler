var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Employee_instances, _Employee_createGroupedPreference, _Employee_updateGroupedPreference, _Employee_addCustomPreferenceToGroup;
import { CONFIG } from '../config.js';
const defaultOptions = {
    shiftPreference: CONFIG.DEFAULT_SHIFT,
    position: '',
    disabled: false,
    employmentType: CONFIG.DEFAULT_EMPLOYMENT_TYPE,
};
class Employee {
    constructor(name, options = {}) {
        _Employee_instances.add(this);
        this.position = '';
        this.disabled = false;
        this.shiftPreferencesGrouped = [];
        this.id = Math.floor(Math.random() * 100000000);
        this.name = name;
        const combinedOptions = { ...defaultOptions, ...options };
        Object.entries(combinedOptions).forEach(([key, value]) => {
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
            return __classPrivateFieldGet(this, _Employee_instances, "m", _Employee_createGroupedPreference).call(this, year, month).preferences;
        if (groupedPreference.defaultPreference !== this.shiftPreference)
            __classPrivateFieldGet(this, _Employee_instances, "m", _Employee_updateGroupedPreference).call(this, groupedPreference);
        return groupedPreference.preferences;
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
        const monthPreference = this.getPreferencesForMonth(year, month);
        return monthPreference[day - 1];
    }
    updateFromFormData(data) {
        // shiftPreference: +data.preferredShift,
        // disabled: Boolean(data.disability),
        // position:
        //   data.position === 'other'
        //     ? data['custom-position'].toString()
        //     : data.position.toString(),
    }
    getInitials() {
        const split = this.name.split(' ');
        return split[0] + split[1][0];
    }
    getId() {
        return this.id;
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
    isDisabled() {
        return this.disabled;
    }
    setDisabled(disabled) {
        this.disabled = disabled;
    }
    setName(newName) {
        if (newName.length < 2)
            throw new Error('Name too short');
        this.name = newName;
    }
    setPosition(newPosition) {
        this.position = newPosition;
    }
    setShiftPreference(newPreference) {
        this.shiftPreference = newPreference;
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
