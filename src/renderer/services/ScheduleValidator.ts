import { CONFIG } from '../config.js';
import { calcRestTime, calcShiftHours } from '../helpers/calcShiftHours.js';
import Entity from '../models/Entity.js';
import { Schedule } from '../models/Schedule.js';
import { CellData } from '../models/types.js';
import CalendarService from './CalendarService.js';
export type ValidatorNotice = {
  type: 'warning' | 'critical';
  description: string;
  employee: Entity['id'];
  timespan: 'day' | 'two-day' | 'week' | 'month';
  cell?: { employeeId: number; day: number };
};
interface ScheduleValidatorI {
  validate: (schedule: Schedule) => ValidatorNotice[];
  mockDisabledDays: (cells: CellData[], disabled: number[]) => CellData[];
}
type Validator = {
  name: string;
  timespan: 'day' | 'two-day' | 'week' | 'month';
  validator: (cells: CellData[]) => ValidatorNotice | null;
};

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

        if (!nextCell.startTime && i < cells.length - 2)
          restTime += cells[i + 2]?.startTime ?? 24;
        if (restTime > maxRest) maxRest = restTime;
        if (restTime >= CONFIG.WORK_LAWS.MIN_WEEK_REST) break;
      }
      if (maxRest < CONFIG.WORK_LAWS.MIN_WEEK_REST)
        return {
          type: 'warning',
          employee: cells[0].id,
          description: `Pracownik ${cells[0].id} w tygodniu ${cells[0].day} - ${
            cells[6].day
          } nie odpoczywał co najmniej ${
            CONFIG.WORK_LAWS.MIN_WEEK_REST
          } godzin (${maxRest.toPrecision(2)}h).`,
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
          description: `Niepełnosprawny pracownik ${cells[0].id} w tygodniu ${cells[0].day} - ${cells[6].day} pracuje więcej niż ${CONFIG.WORK_LAWS.MAX_DISABLED_WORKWEEK}h (${workingTime}h).`,
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
          description: `Pracownik ${
            cells[0].id
          } pracuje przeciętnie wiecęcej niż ${
            CONFIG.WORK_LAWS.AVERAGE_SHIFT_HOURS
          }h dziennie (${workingTime.toPrecision(2)}).`,
          timespan: 'month',
        };
      return null;
    },
  },
];

export class ScheduleValidatorC implements ScheduleValidatorI {
  validate(schedule: Schedule) {
    const scheduleJSON = schedule.exportJSON();
    const notices: ValidatorNotice[] = [];
    const monthValidators: Validator[] = validators.filter(
      (validator) => validator.timespan === 'month'
    );

    // Run all validators by timespan.
    scheduleJSON.data.forEach((cellRow, rowIndex) => {
      cellRow.forEach((cell, cellIndex) => {
        const relevantValidators = validators.filter(
          (validator) =>
            validator.timespan === 'day' ||
            (validator.timespan === 'two-day' && cellRow[cellIndex + 1]) ||
            (validator.timespan === 'week' &&
              CalendarService.getDOW(
                scheduleJSON.year,
                scheduleJSON.month,
                cell.day
              ) === 1 &&
              cellIndex < cellRow.length - 7)
        );

        relevantValidators.forEach((validator) => {
          let data;
          if (
            validator.name.includes('disabled') &&
            !schedule.getGroup().getEmployees()[rowIndex].isDisabled()
          )
            return;
          if (validator.timespan === 'day') data = [cell];
          if (validator.timespan === 'two-day')
            data = [cell, cellRow[cellIndex + 1]];
          if (validator.timespan === 'week')
            data = cellRow.slice(cellIndex, cellIndex + 7);
          data = this.mockDisabledDays(data!, scheduleJSON.disabledDays);
          const notice = validator.validator(data!);
          notice && notices.push(notice);
        });
      });

      // Run monthly validators only once per employee

      monthValidators.forEach((validator) => {
        const notice = validator.validator(
          scheduleJSON.data[rowIndex].filter(
            (cell) => !scheduleJSON.disabledDays.includes(cell.day)
          )
        );
        notice && notices.push(notice);
      });
    });
    return notices;
  }

  mockDisabledDays(cells: CellData[], disabled: number[]) {
    return cells.map((cell) =>
      disabled.includes(cell.day)
        ? { shiftType: 'None', id: cell.id, day: cell.day }
        : cell
    );
  }
  public validators: Validator[] = validators;
}
export const ScheduleValidator = new ScheduleValidatorC();
