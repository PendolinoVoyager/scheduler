var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CellsView_instances, _CellsView_generateRow, _CellsView_generateCell, _CellsView_generateEmployee, _CellsView_generateHeader;
import { CONFIG } from '../../config.js';
import CalendarService from '../../services/CalendarService.js';
import { numberToHour } from '../../helpers/numberToHour.js';
import View from '../View.js';
class CellsView extends View {
    constructor(parentElement) {
        super(parentElement);
        _CellsView_instances.add(this);
    }
    generateMarkup() {
        this.parentElement.style.gridTemplateColumns = `2fr repeat(${this.data.length}, 1fr)`;
        return (__classPrivateFieldGet(this, _CellsView_instances, "m", _CellsView_generateHeader).call(this) +
            this.data.employees.map((_, i) => __classPrivateFieldGet(this, _CellsView_instances, "m", _CellsView_generateRow).call(this, i)).join(''));
    }
}
_CellsView_instances = new WeakSet(), _CellsView_generateRow = function _CellsView_generateRow(row) {
    return (__classPrivateFieldGet(this, _CellsView_instances, "m", _CellsView_generateEmployee).call(this, row) +
        this.data.data[row]
            .map((cell) => __classPrivateFieldGet(this, _CellsView_instances, "m", _CellsView_generateCell).call(this, cell, row + 1))
            .join(''));
}, _CellsView_generateCell = function _CellsView_generateCell(cellData, row) {
    const altText = cellData.shiftType === 'None'
        ? 'W'
        : CONFIG.SHIFT_TYPES[cellData.shiftType].translation;
    return `<div class="cell ${cellData.shiftType.toLowerCase()} flex-column" data-day="${cellData.day}" data-row="${row - 1}">${numberToHour(cellData.startTime) || altText}<br>${numberToHour(cellData.endTime)}</div>`;
}, _CellsView_generateEmployee = function _CellsView_generateEmployee(row) {
    return `<div class="cell-employee flex-column"><p class="schedule-employee-name">${this.data.employees[row].name}</p>
    <p class="schedule-employee-position">${this.data.employees[row].position || 'Brak'}</p>
    </div>`;
}, _CellsView_generateHeader = function _CellsView_generateHeader() {
    const divs = [];
    for (let i = 1; i < 1 + this.data.length; i++) {
        divs.push(`<div class="cell-header">${i}<br>${CalendarService.getDOFName(this.data.year, this.data.month, i)}</div>`);
    }
    return '<div></div>' + divs.join('');
};
export default CellsView;
