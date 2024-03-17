import { CONFIG } from '../../config.js';
import View from '../View.js';

export default class ValidatorUtilsView extends View {
  data!: { hours: number; workingDays: number };
  constructor(parentElement: HTMLElement) {
    super(parentElement);
  }

  generateMarkup(): string {
    return `
    <div class="flex-row">
        <div class="flex-column">
            <div class="flex-row">
                <label for="validate" >Walidacja w czasie rzeczywistym</label>
                <input type="checkbox"${
                  CONFIG.RUN_VALIDATORS ? 'checked' : ''
                } name="validate">
            </div>
            <button class="box-sharp" id="btn-validate">Waliduj</button>
        </div>
        <span class="vr"></span>
        <div class="flex-column">
        <span id="total-hours">Ilość godzin: ${this.data.hours}</span>
        <span id="working-days">Dni pracujące: ${this.data.workingDays}</span>
        </div>
    </div>
    `;
  }
}
