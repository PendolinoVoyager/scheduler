type CustomHours = {
  day: number;
  startTime: number;
  endTime: number;
};

interface ShiftInfo {
  translation: string;
  startTime?: number;
  endTime?: number;
  customHours?: CustomHours[];
}

export type ShiftTypes = Record<string, ShiftInfo>;
