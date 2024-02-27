import View from '../View.js';
import CalendarService from '../../services/CalendarService.js';
export default class CalendarPreviewView extends View {
    constructor(parentElement) {
        super(parentElement);
        this.calendarService = CalendarService;
    }
    generateMarkup() {
        return `
    <div class="shift-preview-calendar" style="color: red">
        ${this.calendarService.getDateString()}
    </div>
    `;
    }
}
