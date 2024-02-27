import View from '../View.js';
import { MonthlyShiftTypes } from '../../models/EmployeeTypes.js';
import CalendarService from '../../services/CalendarService.js';
import { ShiftType } from '../../models/types.js';
export default class CalendarPreviewView extends View {
  data!: MonthlyShiftTypes;
  calendarService = CalendarService;
  constructor(parentElement: HTMLElement) {
    super(parentElement);
  }
  generateMarkup(): string {
    return `
    <div class="container-card flex-column">
    <div class="flex-row"">
     <div id="btns-month-preview">
         <div id="btn-month-prev">
             <i class="fas fa-chevron-left"></i>
         </div>
         <div id="btn-month-next">
             <i class="fas fa-chevron-right"></i>
         </div>
     </div>
     <h2>Podgląd - 
     ${this.calendarService.getDateString()}</h2>
     </div>
    <div class="shift-preview-calendar">
      ${this.calendarService.weekDays
        .map((wd) => `<div style="text-align: center">${wd}</div>`)
        .join('')}
      ${new Array(this.calendarService.getStartingDay())
        .fill('<div></div>')
        .join('')}
       ${this.data.preferences
         .map(
           (num, i) =>
             `<div class="calendar-preview-day ${this.selectShiftClass(num)}">${
               i + 1
             }</div>`
         )
         .join('')}
    </div>
    </div>
    `;
  }

  selectShiftClass(shift: ShiftType): string {
    let CSSClassName;
    switch (shift) {
      case ShiftType.Morning:
        CSSClassName = 'morning';
        break;
      case ShiftType.Afternoon:
        CSSClassName = 'afternoon';
        break;
      case ShiftType.None:
        CSSClassName = 'none';
        break;
      case ShiftType.Vacation:
        CSSClassName = 'vacation';
        break;
      case ShiftType.Training:
        CSSClassName = 'training';
        break;
      case ShiftType.Custom:
        CSSClassName = 'custom';
        break;
    }
    return CSSClassName;
  }
}
