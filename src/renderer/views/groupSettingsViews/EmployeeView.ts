import Employee from '../../models/Employee.js';
import View from '../View.js';
import { ShiftPreference } from '../../models/types.js';
export default class EmployeeView extends View {
  public data: Employee | null = null;
  //id: employee-view
  constructor(parentElement: HTMLElement) {
    super(parentElement);
  }
  generateMarkup(): string {
    if (!this.data) return 'rando text';
    return `
          <input type="hidden" name="id" value="${this.data.getId()}">
          <div class="container-card flex-row">

            <div class="container-card2 flex-column">
                <input type="text" value="${this.data.getName()}" name="name" placeholder="Imię i nazwisko">
                <input type="text" value="${this.data.getPosition()} name="position" placeholder="Stanowisko">
                <select name="preferredShift">
                  <option>${ShiftPreference.Afternoon}</option>
                  
                </select>
            </div>
            <div class="container-card2 flex-column">
              <div class="flex-row">
                <input type="date">
                <input type="date">
              </div>
              <button class="box-sharp">Dodaj planowany urlop</button>
            </div> 

          </div>
          <div class="container-card flex-row">

            <button type="submit" class="box-sharp" value="Zapisz">Zapisz</button>
            <button class="box-sharp" id="btn-remove-employee">
              Usuń pracownika
            </button>

          </div>
          <div class="container-card flex-column">
            <div id="btns-month">
              <div id="btn-month-prev">
                  <i class="fas fa-chevron-left"></i>
              </div>
              <div id="btn-month-next">
                  <i class="fas fa-chevron-right"></i>
              </div>
              <div id="calendar-preview">

              </div>
            </div>
          </div>
    `;
  }
}
