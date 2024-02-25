import { CONFIG } from '../config.js';
import Employee from '../models/Employee.js';
import { ShiftType } from '../models/types.js';

export function renderEmployeeForm(employee?: Employee) {
  return `<form name="employee-info" id="employee-info">
<input type="hidden" name="id" value="${employee?.getId() ?? undefined}">
<div class="container-card flex-row space-evenly">

  <div class="container-card2 flex-column">

      <div class="flex-row space-between">
          <label for="name">Imię i nazwisko:&nbsp;</label>
          <input type="text" value="${
            employee?.getName() ?? ''
          }" name="name" placeholder="Imię i nazwisko">
      </div>
     
      <div class="flex-row space-between">
        <label for="position" >Stanowisko:&nbsp;</label>
        <select name="position" id="employee-position">
          ${CONFIG.POSITIONS.map(
            (p, i) =>
              `<option value="${i}" ${
                employee?.getPosition() === p ? 'selected' : ''
              }>${p}</option>`
          ).join('')}
          <option value="other" ${
            !CONFIG.POSITIONS.includes(employee ? employee.getPosition() : '')
              ? 'selected'
              : ''
          }>Inne</option>
        </select>
      </div>

      <input type="text" name="custom-position" id="employee-custom-position" placeholder="Stanowisko">

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

      <div class="flex-row">
      <label for="disability">Niepełnosprawność</label>
      <input name="disability" type="checkbox" ${
        employee?.isDisabled() ? 'checked' : ''
      }> 
      </div>
      <button type="submit" class="box-sharp" value="Zapisz">Zapisz</button>

  </div>

</form>`;
}
