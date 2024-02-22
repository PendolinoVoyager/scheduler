class State {
  public month: number = NaN;
  public year: number = NaN;
  constructor() {}
  setTime(month: number = this.month, year: number = this.year) {
    this.month = month;
    this.year = year;
  }
}

const state = new State();

export default state;
