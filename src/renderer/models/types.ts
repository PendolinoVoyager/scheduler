export enum ShiftType {
  Morning = 1,
  Afternoon = 2,
  None = 3,
  Vacation = 4,
  Training = 5,
  Custom = 6,
}

export interface Shift {
  type: ShiftType;
  startTime?: string;
  endTime?: string;
  hours?: number;
}
export type CalendarData = {
  month: number;
  year: number;
  dateString: string;
  startingDay: number;
  numberOfDays: number;
};
