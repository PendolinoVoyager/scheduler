var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MouseBoxController_instances, _MouseBoxController_initBox;
import { CONFIG } from '../../config.js';
import { AbstractController } from '../AbstractController.js';
class MouseBoxController extends AbstractController {
    constructor(mouseController) {
        super();
        _MouseBoxController_instances.add(this);
        this.mouseController = mouseController;
        this.boxElement = document.createElement('form');
        __classPrivateFieldGet(this, _MouseBoxController_instances, "m", _MouseBoxController_initBox).call(this);
    }
    show(cell) {
        this.boxElement.classList.remove('hidden');
        const rect = cell.getBoundingClientRect();
        this.boxElement.style.top = rect.top + 'px';
        this.boxElement.style.left = rect.left + 'px';
        if (rect.left < 200)
            this.boxElement.style.width = 150 + 'px';
        else
            this.boxElement.style.width = '';
        //Focus on custom hours
    }
    hide() {
        this.boxElement.classList.add('hidden');
    }
}
_MouseBoxController_instances = new WeakSet(), _MouseBoxController_initBox = function _MouseBoxController_initBox() {
    this.boxElement.classList.add('container-card', 'flex-row', 'space-evenly', 'hidden');
    this.boxElement.id = 'schedule-mouse-controller-box';
    document.body.appendChild(this.boxElement);
    Object.entries(CONFIG.SHIFT_TYPES).forEach(([shift, info]) => {
        if (shift === 'Custom')
            return;
        this.boxElement.insertAdjacentHTML('beforeend', `
        <button type="submit" class="box-sharp ${shift.toLowerCase()}" data-shift="${shift}">${info.translation}</button>
      `);
    });
    this.customInput = document.createElement('form');
    this.customInput.classList.add('flex-column', 'container-card2');
    this.boxElement.appendChild(this.customInput);
    this.customInput.insertAdjacentHTML('beforeend', `
        <input type="time" name="start"></input>
        <input type="time" name="end"></input>
        <button type="submit" class="box-sharp" data-shift="Custom">${CONFIG.SHIFT_TYPES['Custom'].translation}</button>
    `);
    // Add handlers for form
    this.boxElement.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!e.submitter)
            return;
        const shift = e.submitter.dataset.shift;
        if (!Object.keys(CONFIG.SHIFT_TYPES).includes(shift))
            throw new Error('Something went wrong! Invalid shift type.');
        this.mouseController.mainController.updateSelected({
            shiftType: shift,
        });
        this.hide();
    });
    this.customInput.addEventListener('submit', (e) => {
        e.preventDefault();
        let startTime, endTime;
        const formData = new FormData(this.customInput);
        startTime = formData.get('start')?.toString();
        endTime = formData.get('end')?.toString();
        if (!startTime || !endTime)
            return;
        startTime = startTime.split(':').map(Number);
        endTime = endTime.split(':').map(Number);
        startTime = startTime[0] + startTime[1] / 60;
        endTime = endTime[0] + endTime[1] / 60;
        this.mouseController.mainController.updateSelected({
            shiftType: 'Custom',
            startTime,
            endTime,
        });
        this.hide();
    });
};
export default MouseBoxController;
