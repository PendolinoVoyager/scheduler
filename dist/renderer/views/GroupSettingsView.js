import View from './View.js';
export default class GroupSettingsView extends View {
    constructor(parentElement) {
        super(parentElement);
        this.data = [];
    }
    generateMarkup() {
        const employee = { name: 'dasd', position: 'dads', id: 'dsd' };
        return `
    <h1 class="text-gradient">Zarządzaj grupą pracowników</h1>
    <div id="employee-container">
        <ul id="employee-list">
            <li class="employee-item employee-selected">
                <p class="employee-name">${employee.name}</p>
                <p class="employee-position">${employee.position}</p>
            </li>

            <li id="employee-list-add" class="box-sharp">
                <i class="fas fa-plus"></i>
            </li>
        </ul>
        <form id="employee-stats">
          <input type="hidden" name="id" value="${employee.id}">
          <div class="container-card flex-row">

            <div class="container-card2 flex-column">
                <input type="text" name="name" placeholder="Imię i nazwisko">
                <input type="text" name="position" placeholder="Stanowisko">
                <select name="preferredShift">
                  <option>Dupa</option>
                  <option>DSADS</option>
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
        </form>

    </div>
    `;
    }
}
