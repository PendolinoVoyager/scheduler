import Entity from './Entity.js';
/**
 * Zero-indexed! Schedule is independent of column and row headers.
 */
export class AbstractSchedule extends Entity {
    constructor(group, year, month) {
        super();
        this.collection = 'schedules';
        this.group = group;
        this.year = year;
        this.month = month;
        this.disabledDays = new Set();
        this.initCellArray();
    }
    initCellArray() {
        const numEmployees = this.group.getEmployees().length;
        this.cells = new Array(numEmployees);
        for (let i = 0; i < numEmployees; i++) {
            this.cells[i] = new Array(this.length);
        }
    }
    getGroup() {
        return this.group;
    }
    getCells() {
        return this.cells;
    }
    getDisabledDays() {
        return [...this.disabledDays];
    }
}
