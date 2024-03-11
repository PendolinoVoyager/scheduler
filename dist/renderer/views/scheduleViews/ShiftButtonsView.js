import { CONFIG } from '../../config.js';
import View from '../View.js';
export default class ShiftButtonsView extends View {
    constructor(parentElement) {
        super(parentElement);
    }
    generateMarkup() {
        return `
    <div class="flex-row shift-form">
      ${Object.entries(CONFIG.SHIFT_TYPES)
            .map(([shift, info]) => {
            if (shift === 'Custom')
                return;
            return `<button type="submit" class="box-sharp ${shift.toLowerCase()}" data-shift="${shift}">${`(${info.shortcut}) ` + info.translation}</button>`;
        })
            .join('')}
       </div>
       <div class="flex-row space-between shift-form">
       <input type="time" name="start"></input>-
            <input type="time" name="end"></input>
            <button type="submit" class="box-sharp custom" data-shift="Custom">${`(${CONFIG.SHIFT_TYPES['Custom'].shortcut}) ` +
            CONFIG.SHIFT_TYPES['Custom'].translation}</button>
       </div>
    `;
    }
}
