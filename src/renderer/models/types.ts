export enum ShiftType {
  Morning = 1,
  Afternoon = 2,
  None = 3,
  Vacation = 4,
  Training = 5,
  Custom = 6,
}

interface Shift {
  type: ShiftType;
  startTime?: string;
  endTime?: string;
  hours?: number;
}
