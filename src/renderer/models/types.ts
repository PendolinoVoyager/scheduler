export enum ShiftType {
  Morning = 1,
  Afternoon = 2,
  None = 3,
  Vacation = 4,
  Training = 5,
  Custom = 6,
}
export enum EmploymentType {
  FULL_TIME = 'IDK REALLY',
  PART_TIME = 'Umowa zlecenie',
}
interface Shift {
  type: ShiftType;
  startTime?: string;
  endTime?: string;
  hours?: number;
}

export type GroupedPreference = {
  year: number;
  month: number;
  defaultPreference: number;
  customPreferences: { day: number; preference: ShiftType }[];
  preferences: ShiftType[];
};
