export type GridData = {
  month: number;
  year: number;
  dateString: string;
  startingDay: number;
  numberOfDays: number;
};

export default class Calendar {
  public month: number = new Date().getMonth() + 1;
  public year: number = new Date().getFullYear();

  constructor(month?: number, year?: number) {
    this.setDate(month, year);
    this.year = year ?? new Date().getFullYear();
  }

  setDate(month?: number, year?: number) {
    if (month && month > 0 && month < 13) {
      this.month = month;
    }
    this.year = year ?? this.year;
  }
  getGridData(): GridData {
    return {
      month: this.month,
      year: this.year,
      dateString: this.getDateString(),
      startingDay: this.getStartingDay(),
      numberOfDays: this.getNumOfDays(),
    };
  }
  getDateString(): string {
    const timestamp = new Date(`${this.year}-${this.month}-01`).getTime();
    return Intl.DateTimeFormat('pl-PL', {
      month: 'long',
      year: 'numeric',
    }).format(timestamp);
  }
  getStartingDay(): number {
    console.log(new Date(`${this.year}-${this.month}-01`));
    return new Date(`${this.year}-${this.month}-01`).getDay();
  }
  getNumOfDays(): number {
    return new Date(this.year, this.month, 0).getDate();
  }
}
