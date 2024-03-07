import { CONFIG } from '../../config.js';
import { CellData, ScheduleJSON } from '../../models/ScheduleTypes.js';
import View from '../View.js';

export default class CellsView extends View {
  public data!: ScheduleJSON;
  constructor(parentElement: HTMLElement) {
    super(parentElement);
  }
  generateMarkup(): string {
    this.parentElement.style.gridTemplateColumns = `2fr repeat(${this.data.length}, 1fr)`;
    return (
      this.#generateHeader() +
      this.data.employees.map((_, i) => this.#generateRow(i)).join('')
    );
  }
  #generateRow(row: number): string {
    return (
      this.#generateEmployee(row) +
      this.data.data[row]
        .map((cell) => this.#generateCell(cell, row + 1))
        .join('')
    );
  }
  #generateCell(cellData: CellData, row: number): string {
    return `<div class="cell ${cellData.shiftType.toLowerCase()}" data-day="${
      cellData.day
    }" data-row="${row}">${cellData.startTime}<br>${cellData.endTime}</div>`;
  }
  #generateEmployee(row: number): string {
    return `<div class="cell-employee"><p class="schedule-employee-name">${
      this.data.employees[row].name
    }</p>
    <p class="schedule-employee-position">${
      this.data.employees[row].position || 'Brak'
    }</p>
    </div>`;
  }
  #generateHeader(): string {
    const divs: string[] = [];
    for (let i = 0; i < 1 + this.data.length; i++) {
      divs.push(`<div class="cell-header">${i || ''}</div>`);
    }
    return divs.join('');
  }
}
