import { CONFIG } from '../config.js';
import Employee from '../models/Employee.js';
import { ShiftType } from '../models/types.js';
import { EmploymentType } from '../models/EmployeeTypes.js';

export function renderEmployeeForm(employee?: Employee) {
  return `
  <form name="employee-info" id="employee-info">
    <input type="hidden" name="id" value="${employee?.getId() ?? ''}">
        <div class="container-card2 flex-column">

          <div class="flex-row space-between">

            <label for="name">Imię i nazwisko:&nbsp;</label>
            <input type="text" value="${
              employee?.getName() ?? ''
            }" name="name" placeholder="Imię i nazwisko">

          </div>
     
          <div class="flex-row space-between">
            <label for="position">Stanowisko:&nbsp;</label>
            <div class=flex-column>
              <select name="position" id="employee-position">
              ${CONFIG.POSITIONS.map(
                (p, i) =>
                  `<option value="${i}" ${
                    employee?.getPosition() === p ? 'selected' : ''
                  }>${p}</option>`
              ).join('')}
              <option value="other" ${
                !CONFIG.POSITIONS.includes(
                  employee ? employee.getPosition() : CONFIG.POSITIONS[0]
                )
                  ? 'selected'
                  : ''
              }>Inne</option>
              </select>
              <input type="text" name="custom-position" id="employee-custom-position" placeholder="Stanowisko" value=${
                employee?.getPosition() ?? ''
              }>
            </div>
          </div>
      
          <div class="flex-row space-between">
            <label for="employment-type" >Umowa:&nbsp;</label>

            <select name="employment-type">

            ${Object.entries(EmploymentType)
              .filter(([key, val]) => isNaN(+key))
              .map(([enumName, value]) => {
                return `<option value="${enumName}" ${
                  employee?.getEmploymentType() === value ? 'selected' : ''
                }>${value}</option>`;
              })
              .join('')}
            </select>
         </div>
         <div class="flex-row space-between">
            <label for="preferredShift">Domyślna zmiana:&nbsp;</label>
            <select name="preferredShift">
            ${Object.entries(ShiftType)
              .filter(([key, val]) => isNaN(+key))
              .map(([enumName, value]) => {
                return `<option value="${value}" ${
                  employee?.getShiftPreference() === value ? 'selected' : ''
                }>${enumName}</option>`;
              })
              .join('')}
            </select>
          </div>

          <div class="flex-row space-between">
            <label for="disability">Niepełnosprawność</label>
            <input name="disability" type="checkbox" ${
              employee?.isDisabled() ? 'checked' : ''
            }> 
         </div>
      <button type="submit" class="box-sharp" value="Zapisz">Zapisz</button>

    </div>
</form>`;
}

export function addPositionDropdownHandlers() {
  const selectElement = document.getElementById(
    'employee-position'
  ) as HTMLSelectElement;

  const hiddenInput = document.getElementById('employee-custom-position');
  if (!selectElement) throw new Error('Form not rendered yet.');
  if (!hiddenInput) throw new Error('Form manipulated.');

  if (selectElement.value === 'other') hiddenInput.style.display = 'block';
  else hiddenInput.style.display = 'none';

  selectElement.addEventListener('change', () => {
    if (selectElement.value === 'other') hiddenInput.style.display = 'block';
    else hiddenInput.style.display = 'none';
  });
}
