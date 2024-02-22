export default class Calendar {
    constructor(month, year) {
        this.month = new Date().getMonth() + 1;
        this.year = new Date().getFullYear();
        this.setDate(month, year);
        this.year = year ?? new Date().getFullYear();
    }
    setDate(month, year) {
        if (month && month > 0 && month < 13) {
            this.month = month;
        }
        this.year = year ?? this.year;
    }
    getGridData() {
        return {
            month: this.month,
            year: this.year,
            dateString: this.getDateString(),
            startingDay: this.getStartingDay(),
            numberOfDays: this.getNumOfDays(),
        };
    }
    getDateString() {
        const timestamp = new Date(`${this.year}-${this.month}-01`).getTime();
        return Intl.DateTimeFormat('pl-PL', {
            month: 'long',
            year: 'numeric',
        }).format(timestamp);
    }
    getStartingDay() {
        console.log(new Date(`${this.year}-${this.month}-01`));
        return new Date(`${this.year}-${this.month}-01`).getDay();
    }
    getNumOfDays() {
        return new Date(this.year, this.month, 0).getDate();
    }
}
