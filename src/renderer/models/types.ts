export type Shift = {
  start: number;
  end: number;
};
export enum ShiftPreference {
  Morning = 1,
  Afternoon = 2,
  Night = 3,
  Vacation = 4,
  Custom = 5,
}
export type GroupedPreference = {
  year: number;
  month: number;
  defaultPreference: number;
  customPreferences: { day: number; preference: ShiftPreference }[];
  preferences: ShiftPreference[];
};
