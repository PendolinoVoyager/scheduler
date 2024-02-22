class State {
    constructor() {
        this.month = NaN;
        this.year = NaN;
    }
    setTime(month = this.month, year = this.year) {
        this.month = month;
        this.year = year;
    }
}
const state = new State();
export default state;
