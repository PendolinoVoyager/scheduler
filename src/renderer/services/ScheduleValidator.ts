import calcShiftHours from '../helpers/calcShiftHours';
import Entity from '../models/Entity';
import { Schedule } from '../models/Schedule.js';
import { CellData } from '../models/types';
//
type ValidatorNotice = {
  type: 'warning' | 'critical';
  description: string;
  timespan: 'day' | 'two-day' | 'week' | 'month';
  cell?: { employeeId: Entity['id']; day: number };
};
interface ScheduleValidatorI {
  validate: (schedule: Schedule) => ValidatorNotice[];
  getStats: (schedule: Schedule) => { hours: number; workingDays: number };
}
type Validator = {
  name: string;
  validator: (...cells: CellData[]) => ValidatorNotice | null;
};
export class ScheduleValidatorC implements ScheduleValidatorI {
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
export const validators: Validator[] = [];
