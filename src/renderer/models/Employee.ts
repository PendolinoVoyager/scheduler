import { CONFIG } from '../config.js';
import FormError, { Issue } from '../errors/FormError.js';
import {
  EmploymentType,
  AbstractEmployee,
  EmployeeFields,
  MonthlyShiftTypes,
} from './EmployeeTypes.js';
import { ShiftTypes } from './types.js';

export default class Employee extends AbstractEmployee {
  protected id!: number;
  protected name!: string;
  protected position!: string;
  protected disabled!: boolean;
  protected shiftPreference!: keyof ShiftTypes;
  protected employmentType!: EmploymentType;
  protected shiftPreferencesGrouped: MonthlyShiftTypes[] = [];
  constructor(name?: string, options: EmployeeFields = {}) {
    super(name);
    Object.entries(options).forEach(([key, value]) => {
      (this as any)[key] = value;
    });
  }
  addCustomPreference(
    year: number,
    month: number,
    day: number,
    shiftPreference: keyof ShiftTypes
  ): void {
    const groupedPreference = this.shiftPreferencesGrouped.find(
      (p) => p.year === year && p.month === month
    );
    if (!groupedPreference) {
      const newPreferenceMonth = this.#createGroupedPreference(year, month);
      this.#addCustomPreferenceToGroup(
        newPreferenceMonth,
        day,
        shiftPreference
      );
      return;
    }
    this.#addCustomPreferenceToGroup(groupedPreference, day, shiftPreference);
  }

  getPreferencesForMonth(year: number, month: number): MonthlyShiftTypes {
    const groupedPreference = this.shiftPreferencesGrouped.find(
      (p) => p.year === year && p.month === month
    );
    if (!groupedPreference) return this.#createGroupedPreference(year, month);

    if (groupedPreference.defaultPreference !== this.shiftPreference)
      this.#updateGroupedPreference(groupedPreference);
    return groupedPreference;
  }

  removePreference(year: number, month: number, day: number) {
    const groupedPreference = this.shiftPreferencesGrouped.find(
      (p) => p.year === year && p.month === month
    );
    if (!groupedPreference) return;

    const i = groupedPreference.customPreferences.findIndex(
      (cp) => cp.day === day
    );
    if (i === -1) return;
    groupedPreference.customPreferences.splice(i, 1);
    this.#updateGroupedPreference(groupedPreference);
  }
  removePreferences(year: number, month: number) {
    const groupedPreference = this.shiftPreferencesGrouped.find(
      (p) => p.year === year && p.month === month
    );
    if (!groupedPreference) return;
    // Splice the whole thang
    groupedPreference.customPreferences.splice(
      0,
      groupedPreference.customPreferences.length
    );
  }
  getPreferenceForDay(
    year: number,
    month: number,
    day: number
  ): keyof ShiftTypes {
    const monthPreference = this.getPreferencesForMonth(
      year,
      month
    ).preferences;

    return monthPreference[day - 1];
  }
  #createGroupedPreference(year: number, month: number): MonthlyShiftTypes {
    const newPreferenceMonth = {
      year,
      month,
      defaultPreference: this.shiftPreference,
      customPreferences: [],
      preferences: new Array(new Date(year, month, 0).getDate()).fill(
        this.shiftPreference
      ),
    };

    this.shiftPreferencesGrouped.push(newPreferenceMonth);
    return newPreferenceMonth;
  }
  #updateGroupedPreference(groupedPreference: MonthlyShiftTypes) {
    groupedPreference.defaultPreference = this.shiftPreference;
    groupedPreference.preferences.fill(this.shiftPreference);
    groupedPreference.customPreferences.forEach((cp) => {
      groupedPreference.preferences[cp.day - 1] = cp.preference;
    });
  }
  #addCustomPreferenceToGroup(
    groupedPreference: MonthlyShiftTypes,
    day: number,
    preference: keyof ShiftTypes
  ) {
    const customPreference = groupedPreference.customPreferences.find(
      (cp) => cp.day === day
    );
    if (customPreference) customPreference.preference = preference;
    else
      groupedPreference.customPreferences.push({ day, preference: preference });

    groupedPreference.preferences[day - 1] = preference;
  }
  updateFromFormData(form: HTMLFormElement) {
    function getFormElement(form: HTMLFormElement, name: string) {
      return form.querySelector(`[name="${name}"]`) as HTMLElement;
    }
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const parsedData = {
      id: +data.id,
      name: data.name.toString(),
      shiftPreference: data.shiftPreference.toString(),
      disabled: Boolean(data.disabled),
      position:
        data.position === 'other'
          ? data['custom-position'].toString()
          : CONFIG.POSITIONS[+data.position],
      employmentType: data['employmentType'].toString(),
    };
    const issues: Issue[] = [];
    if (!parsedData.name.match(CONFIG.EMPLOYEE_NAME_VALIDATOR))
      issues.push({
        element: getFormElement(form, 'name'),
        description: CONFIG.EMPLOYEE_NAME_ERROR_DESCRIPTION,
      });

    if (parsedData.id !== this.getId()) throw new Error('Invalid ID.');

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
    if (issues.length > 0) throw new FormError(true, ...issues);

    this.name = parsedData.name;
    this.shiftPreference = parsedData.shiftPreference;
    this.disabled = parsedData.disabled;
    this.position = parsedData.position;
    this.employmentType = (EmploymentType as any)[parsedData.employmentType];
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
  setDisabled(disabled: boolean) {
    this.disabled = disabled;
  }
  setName(newName: string) {
    if (!CONFIG.EMPLOYEE_NAME_VALIDATOR.test(newName))
      throw new Error(CONFIG.EMPLOYEE_NAME_ERROR_DESCRIPTION);
    this.name = newName;
  }
  setPosition(newPosition: string) {
    this.position = newPosition;
  }
  setShiftPreference(newPreference: keyof ShiftTypes) {
    this.shiftPreference = newPreference;
  }
  setEmploymentType(newType: EmploymentType) {
    this.employmentType = newType;
  }
}
