import calcShiftHours from '../helpers/calcShiftHours';
export class ScheduleValidatorC {
    constructor() {
        this.validators = validators;
    }
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
//7h niepelnosprawny i nie wiecej niz 7 * 5 w tygodniu
// dni pracujace * 8 - nie moze wiecej pracowac w miesiacu
export const validators = [
    {
        name: '11h rest',
        timespan: 'two-day',
        validator: (cells) => {
            if (cells.length !== 2)
                throw new Error('TypeError: expected 2 cells, got ' + cells.length);
            if (!cells[1].startTime || !cells[0].endTime)
                return null;
            const time = 24 - cells[0].endTime + cells[1].startTime;
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
