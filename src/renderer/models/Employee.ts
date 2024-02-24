import type { ShiftPreference, GroupedPreference } from './types.js';

export default class Employee {
  protected id: number;
  protected name: string;
  protected position: string = '';
  protected shiftPreference: ShiftPreference;
  protected shiftPreferencesGrouped: GroupedPreference[] = [];
  constructor(name: string, shiftPreference: ShiftPreference) {
    this.id = Math.floor(Math.random() * 100000000);
    this.name = name;
    this.shiftPreference = shiftPreference;
  }
  addCustomPreference(
    year: number,
    month: number,
    day: number,
    shiftPreference: ShiftPreference
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

  getPreferencesForMonth(year: number, month: number): ShiftPreference[] {
    const groupedPreference = this.shiftPreferencesGrouped.find(
      (p) => p.year === year && p.month === month
    );
    if (!groupedPreference)
      return this.#createGroupedPreference(year, month).preferences;

    if (groupedPreference.defaultPreference !== this.shiftPreference)
      this.#updateGroupedPreference(groupedPreference);

    return groupedPreference.preferences;
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
  ): ShiftPreference | undefined {
    const monthPreference = this.getPreferencesForMonth(year, month);

    return monthPreference[day - 1];
  }
  #createGroupedPreference(year: number, month: number): GroupedPreference {
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
  #updateGroupedPreference(groupedPreference: GroupedPreference) {
    groupedPreference.defaultPreference = this.shiftPreference;
    groupedPreference.preferences.fill(this.shiftPreference);
    groupedPreference.customPreferences.forEach((cp) => {
      groupedPreference.preferences[cp.day - 1] = cp.preference;
    });
  }
  #addCustomPreferenceToGroup(
    groupedPreference: GroupedPreference,
    day: number,
    preference: ShiftPreference
  ) {
    const customPreference = groupedPreference.customPreferences.find(
      (cp) => cp.day === day
    );
    if (customPreference) customPreference.preference = preference;
    else
      groupedPreference.customPreferences.push({ day, preference: preference });

    groupedPreference.preferences[day - 1] = preference;
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
  setName(newName: string) {
    if (newName.length < 2) throw new Error('Name too short');
    this.name = newName;
  }
  setPosition(newPosition: string) {
    this.position = newPosition;
  }
  setShiftPreference(newPreference: ShiftPreference) {
    this.shiftPreference = newPreference;
  }
}
