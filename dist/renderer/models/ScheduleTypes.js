/**
 * Zero-indexed! Schedule is independent of column and row headers.
 *
 */
export class AbstractSchedule {
    constructor(group, year, month) {
        this.group = group;
        this.year = year;
        this.month = month;
        this.disabledDays = new Set();
        this.initCellArray();
    }
    initCellArray() {
        this.cells = new Array(this.group.getEmployees().length).fill(new Array(this.length));
    }
}
