import View from '../View.js';
import CalendarService from '../../services/CalendarService.js';
export default class CalendarPreviewView extends View {
    constructor(parentElement) {
        super(parentElement);
        this.calendarService = CalendarService;
    }
    generateMarkup() {
        console.log(this.data);
        return `
    <div class="container-card2 flex-column">
    <div class="flex-column"">
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
       ${this.data
            .map((key, i) => `<div class="calendar-preview-day ${this.selectShiftClass(key)}">${i + 1}</div>`)
            .join('')}
    </div>
    </div>
    `;
    }
    selectShiftClass(shift) {
        let CSSClassName;
        switch (shift) {
            case 'Morning':
                CSSClassName = 'morning';
                break;
            case 'Afternoon':
                CSSClassName = 'afternoon';
                break;
            case 'None':
                CSSClassName = 'none';
                break;
            case 'Vacation':
                CSSClassName = 'vacation';
                break;
            case 'Training':
                CSSClassName = 'training';
                break;
            case 'Custom':
                CSSClassName = 'custom';
                break;
            default:
                CSSClassName = 'custom';
        }
        return CSSClassName;
    }
}
