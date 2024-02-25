import View from '../View.js';
import { ShiftType } from '../../models/types.js';
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
          <input type="hidden" name="id" value="${this.data.getId()}">
          <div class="container-card flex-row space-evenly">

            <div class="container-card2 flex-column">
                <input type="text" value="${this.data.getName()}" name="name" placeholder="Imię i nazwisko">
                <select name="position">
                  ${CONFIG.POSITIONS.map((p) => `<option value="${p}" ${this.data?.getPosition() === p ? 'selected' : ''}>${p}</option>`).join('')}
                  <option value="other" ${!CONFIG.POSITIONS.includes(this.data?.getPosition())
            ? 'selected'
            : ''}>Inne</option>
                </select>
                <select name="preferredShift">
                  <option value="1" ${this.data.getShiftPreference() ? 'selected' : ''}>
                  Poranna
                  </option>
                  <option value="2" ${this.data.getShiftPreference() ? 'selected' : ''}>Popołudniowa</option>
                </select>
            </div>
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
          <div class="container-card flex-row space-evenly">

            <button type="submit" class="box-sharp" value="Zapisz">Zapisz</button>
            <button class="box-sharp" id="btn-remove-employee">
              Usuń pracownika
            </button>

          </div>
          <div class="container-card flex-column">
             <div class="flex-row"">
              <div id="btns-month">
                <div id="btn-month-prev">
                    <i class="fas fa-chevron-left"></i>
                </div>
                <div id="btn-month-next">
                    <i class="fas fa-chevron-right"></i>
                </div>
                </div>
                <h2>Podgląd</h2>
            <div id="calendar-preview">

            </div>
          </div>
    `;
    }
}
