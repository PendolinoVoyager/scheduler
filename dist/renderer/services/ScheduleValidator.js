import calcShiftHours from '../helpers/calcShiftHours';
export class ScheduleValidatorC {
    constructor() { }
    validate(schedule) {
        return [];
    }
    getStats(schedule) {
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
export const validators = [];
