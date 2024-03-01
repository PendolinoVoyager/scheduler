import View from '../View.js';
import { renderEmployeeForm } from '../../helpers/renderEmployeeForm.js';
import { CONFIG } from '../../config.js';
export default class EmployeeView extends View {
    constructor(parentElement) {
        super(parentElement);
        this.data = null;
    }
    generateMarkup() {
        if (!this.data)
            return '<h2>Wybierz lub dodaj pracownika</h2>';
        return `
      <div class="container-card flex-row space-evenly" id="employee-manage">
        ${renderEmployeeForm(this.data)}
        <form id="plan-shifts" class="container-card2 flex-column space-evenly">
            <div class="flex-row space-between">
                <label for=plannedShift>Zaplanuj zmiany w okresie: </label>
                <select name="plannedShift">
                ${Object.entries(CONFIG.SHIFT_TYPES)
            .map(([key, value]) => {
            return `<option value="${key}">${key}</option>`;
        })
            .join('')}
                
                </select>
            </div>
       
            <div class="flex-row space-around">
                <input type="date" name="begin" value="${new Date()
            .toISOString()
            .slice(0, 10)}">
                    <i class="fas fa-arrow-right"></i>
                <input type="date" name="end" value="${new Date()
            .toISOString()
            .slice(0, 10)}">
            </div>

            <button type="submit" class="box-sharp">Dodaj</button>
          </div>
        </form>

        <div id="calendar-preview">

        </div>
    

    `;
    }
}
