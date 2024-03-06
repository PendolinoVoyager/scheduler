/**
 * Zero-indexed! Schedule is independent of column and row headers.
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
        const numEmployees = this.group.getEmployees().length;
        this.cells = new Array(numEmployees);
        for (let i = 0; i < numEmployees; i++) {
            this.cells[i] = new Array(this.length);
        }
    }
}
