import { CONFIG } from '../config';
import { calcRestTime, calcShiftHours } from '../helpers/calcShiftHours';
import Entity from '../models/Entity';
import { Schedule } from '../models/Schedule.js';
import { CellData } from '../models/types';
//
type ValidatorNotice = {
  type: 'warning' | 'critical';
  description: string;
  employee?: Entity['id'];
  timespan: 'day' | 'two-day' | 'week' | 'month';
  cell?: { employeeId: Entity['id']; day: number };
};
interface ScheduleValidatorI {
  validate: (schedule: Schedule) => ValidatorNotice[];
  getStats: (schedule: Schedule) => { hours: number; workingDays: number };
}
type Validator = {
  name: string;
  timespan: 'day' | 'two-day' | 'week' | 'month';
  validator: (cells: CellData[]) => ValidatorNotice | null;
};
export class ScheduleValidatorC implements ScheduleValidatorI {
  constructor() {}
  validate(schedule: Schedule) {
    const notices: ValidatorNotice[] = [];
    // Run all validators by timespan.
    // If day is disabled: mock undefined startTime/endTime cell
    return notices;
  }
  getStats(schedule: Schedule) {
    const hours = schedule
      .getCells()
      .flat()
      .reduce((total, cell) => total + calcShiftHours(cell), 0);
    const workingDays = schedule.length - schedule.getDisabledDays().length;

    return { hours, workingDays };
  }

  public validators: Validator[] = validators;
}
export const ScheduleValidator = new ScheduleValidatorC();

export const validators: Validator[] = [
  {
    name: '11h rest',
    timespan: 'two-day',
    validator: (cells: CellData[]) => {
      if (cells.length !== 2)
        throw new Error('TypeError: expected 2 cells, got ' + cells.length);
      if (!cells[1].startTime || !cells[0].endTime) return null;

      //First expression checks if 1st cell takes place overnight
      const time = calcRestTime(cells);
      if (time == null) return null;
      if (time < CONFIG.WORK_LAWS.MIN_DAY_REST)
        return {
          type: 'warning',
          employee: cells[0].id,
          description: `Pracownik ${cells[0].id} przed dniem ${cells[1].day} nie odpoczywał co najmniej ${CONFIG.WORK_LAWS.MIN_DAY_REST} godzin (${time}h).`,
          timespan: 'two-day',
          cell: { employeeId: cells[0].id, day: cells[1].day },
        };
      return null;
    },
  },
  {
    name: '35h rest',
    timespan: 'week',
    validator: (cells: CellData[]) => {
      if (cells.length !== 7)
        throw new Error('TypeError: expected 7 cells, got ' + cells.length);

      let maxRest = 0;
      for (let i = 0; i < cells.length - 1; i++) {
        const currentCell = cells[i];
        const nextCell = cells[i + 1];
        let restTime = calcRestTime([currentCell, nextCell]);
        // If the next day is free add the free time in the following day before shift start
        if (!nextCell.startTime && i < cells.length - 1)
          restTime += cells[i + 2].startTime ?? 24;
        if (restTime > maxRest) maxRest = restTime;
        if (restTime >= CONFIG.WORK_LAWS.MIN_WEEK_REST) break;
      }
      if (maxRest < CONFIG.WORK_LAWS.MIN_WEEK_REST)
        return {
          type: 'warning',
          employee: cells[0].id,
          description: `Pracownik ${cells[0].id} w tygodniu ${cells[0].day} - ${cells[6].day} nie odpoczywał co najmniej ${CONFIG.WORK_LAWS.MIN_WEEK_REST} godzin (${maxRest}h}).`,
          timespan: 'week',
        };
      return null;
    },
  },
  {
    name: '7h disabled',
    timespan: 'day',
    validator: (cells: CellData[]) => {
      if (cells.length !== 1)
        throw new Error('TypeError: expected 1 cell, got ' + cells.length);

      const workingTime = calcShiftHours(cells[0]);
      if (workingTime > CONFIG.WORK_LAWS.MAX_DISABLED_WORKDAY)
        return {
          type: 'warning',
          employee: cells[0].id,
          description: `Niepełnosprawny pracownik ${cells[0].id} w dniu ${cells[0].day} pracuje więcej niż ${CONFIG.WORK_LAWS.MAX_DISABLED_WORKDAY} godzin (${workingTime}h).`,
          timespan: 'day',
          cell: { employeeId: cells[0].id, day: cells[0].day },
        };
      return null;
    },
  },
  {
    name: '35h disabled',
    timespan: 'week',
    validator: (cells: CellData[]) => {
      if (cells.length !== 7)
        throw new Error('TypeError: expected 7 cells, got ' + cells.length);

      const workingTime = cells.reduce(
        (total, cell) => total + calcShiftHours(cell),
        0
      );
      if (workingTime > CONFIG.WORK_LAWS.MAX_DISABLED_WORKWEEK)
        return {
          type: 'warning',
          employee: cells[0].id,
          description: `Niepełnosprawny pracownik ${cells[0].id} w tygodniu ${cells[0].day} - ${cells[6].day} pracuje więcej niż ${CONFIG.WORK_LAWS.MAX_DISABLED_WORKWEEK}h (${workingTime}).`,
          timespan: 'week',
        };
      return null;
    },
  },
  {
    name: 'month summary',
    timespan: 'month',
    /**
     * Needs to exclude disabled days.
     */
    validator: (cells: CellData[]) => {
      const workingTime =
        cells.reduce((total, cell) => total + calcShiftHours(cell), 0) /
        cells.length;
      if (workingTime > CONFIG.WORK_LAWS.AVERAGE_SHIFT_HOURS)
        return {
          type: 'warning',
          employee: cells[0].id,
          description: `Pracownik ${cells[0].id} pracuje przeciętnie wiecęcej niż ${CONFIG.WORK_LAWS.AVERAGE_SHIFT_HOURS}h dziennie (${workingTime}).`,
          timespan: 'week',
        };
      return null;
    },
  },
];
