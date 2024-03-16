import calcShiftHours from '../helpers/calcShiftHours';
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
  public validators: Validator[] = validators;
  constructor() {}
  validate(schedule: Schedule) {
    return [];
  }
  getStats(schedule: Schedule) {
    const hours = schedule
      .getCells()
      .flat()
      .reduce((total, cell) => total + calcShiftHours(cell), 0);
    const workingDays = schedule.length - schedule.getDisabledDays().length;

    return { hours, workingDays };
  }
}
export default new ScheduleValidatorC();
//11h day rest
//35h week rest
//7h niepelnosprawny i nie wiecej niz 7 * 5 w tygodniu
// dni pracujace * 8 - nie moze wiecej pracowac w miesiacu
export const validators: Validator[] = [
  {
    name: '11h rest',
    timespan: 'two-day',
    validator: (cells: CellData[]) => {
      if (cells.length !== 2)
        throw new Error('TypeError: expected 2 cells, got ' + cells.length);
      if (!cells[1].startTime || !cells[0].endTime) return null;
      const time = 24 - cells[0].endTime! + cells[1].startTime;
      console.log(time);
      if (time < 11)
        return {
          type: 'warning',
          employee: cells[0].id,
          description: `Pracownik ${cells[0].id} przed dniem ${cells[1].day} nie odpoczywał co najmniej 11 godzin.`,
          timespan: 'two-day',
          cell: { employeeId: cells[0].id, day: cells[1].day },
        };
      return null;
    },
  },
];
