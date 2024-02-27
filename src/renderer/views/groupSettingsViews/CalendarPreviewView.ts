import View from '../View.js';
import { MonthlyShiftTypes } from '../../models/EmployeeTypes.js';
import CalendarService from '../../services/CalendarService.js';
export default class CalendarPreviewView extends View {
  data!: MonthlyShiftTypes;
  calendarService = CalendarService;
  constructor(parentElement: HTMLElement) {
    super(parentElement);
  }
  generateMarkup(): string {
    return `
    <div class="shift-preview-calendar" style="color: red">
        ${this.calendarService.getDateString()}
    </div>
    `;
  }
}
