import Employee from '../../models/Employee.js';
import View from '../View.js';
import { ShiftType } from '../../models/types.js';
import { renderEmployeeForm } from '../../helpers/renderEmployeeForm.js';
export default class EmployeeView extends View {
  public data: Employee | null = null;
  constructor(parentElement: HTMLElement) {
    super(parentElement);
  }
  generateMarkup(): string {
    if (!this.data) return '<h2>Wybierz lub dodaj pracownika</h2>';

    return `
           ${renderEmployeeForm(this.data)}
        <div class="flex-column space-evenly">
             <div class="container-card2 flex-column">
                    <div class="flex-row space-between">
                    <label for=plannedShift>Zaplanuj zmiany w okresie: </label>
                      <select name="plannedShift">
                      ${Object.entries(ShiftType)
                        .filter(([key, val]) => isNaN(+key))
                        .map(([enumName, value]) => {
                          return `<option value="${value}">${enumName}</option>`;
                        })
                        .join('')}
                      
                      </select>
                      </div>

                  <div class="flex-row space-between">
                    <input type="date" name="begin" value="${new Date()
                      .toISOString()
                      .slice(0, 10)}">
                        <i class="fas fa-arrow-right"></i>
                    <input type="date" name="end" value="${new Date()
                      .toISOString()
                      .slice(0, 10)}">
                  </div>

                  <button class="box-sharp">Dodaj planowane zmiany w okresie</button>
              </div>
    
          </div>
            </div> 

          </div>
   
      
            <div id="calendar-preview">

            </div>
          </div>

    `;
  }
}
