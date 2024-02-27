import { CONFIG } from '../config.js';
import {
  EmploymentType,
  AbstractEmployee,
  EmployeeFields,
  MonthlyShiftTypes,
} from './EmployeeTypes.js';

import { ShiftType } from './types.js';

export default class Employee extends AbstractEmployee {
  protected id!: number;
  protected name!: string;
  protected position!: string;
  protected disabled!: boolean;
  protected shiftPreference!: ShiftType;
  protected employmentType!: EmploymentType;
  protected shiftPreferencesGrouped: MonthlyShiftTypes[] = [];
  constructor(name: string, options: EmployeeFields = {}) {
    super(name);
    Object.entries(options).forEach(([key, value]) => {
      (this as any)[key] = value;
    });
  }
  addCustomPreference(
    year: number,
    month: number,
    day: number,
    shiftPreference: ShiftType
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
  ): ShiftType | undefined {
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
    preference: ShiftType
  ) {
    const customPreference = groupedPreference.customPreferences.find(
      (cp) => cp.day === day
    );
    if (customPreference) customPreference.preference = preference;
    else
      groupedPreference.customPreferences.push({ day, preference: preference });

    groupedPreference.preferences[day - 1] = preference;
  }
  updateFromFormData(data: { [k: string]: FormDataEntryValue }) {
    const parsedOptions = {
      id: +data.id,
      shiftPreference: +data.preferredShift,
      disabled: Boolean(data.disability),
      position:
        data.position === 'other'
          ? data['custom-position'].toString()
          : CONFIG.POSITIONS[+data.position],
      employmentType: data['employment-type'].toString(),
    };
    console.log(data);
    // Would make a Validation Error but I'm not making a database
    if (parsedOptions.id !== this.getId()) throw new Error('Invalid ID.');
    if (!Object.values(ShiftType).includes(parsedOptions.shiftPreference))
      throw new Error('Invalid ShiftType');
    if (data.position === 'other' && !parsedOptions.position)
      throw new Error('Invalid position.');
    if (!Object.keys(EmploymentType).includes(parsedOptions.employmentType))
      throw new Error('Invalid employment type.');

    this.shiftPreference = parsedOptions.shiftPreference;
    this.disabled = parsedOptions.disabled;
    this.position = parsedOptions.position;
    this.employmentType = (EmploymentType as any)[parsedOptions.employmentType];
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
    if (newName.length < 2) throw new Error('Name too short');
    this.name = newName;
  }
  setPosition(newPosition: string) {
    this.position = newPosition;
  }
  setShiftPreference(newPreference: ShiftType) {
    this.shiftPreference = newPreference;
  }
  setEmploymentType(newType: EmploymentType) {
    this.employmentType = newType;
  }
}
