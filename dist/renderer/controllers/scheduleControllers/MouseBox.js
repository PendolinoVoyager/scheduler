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
        this.boxElement = document.createElement('div');
        __classPrivateFieldGet(this, _MouseBoxController_instances, "m", _MouseBoxController_initBox).call(this);
    }
    show(cell) {
        this.boxElement.classList.remove('hidden');
        const rect = cell.getBoundingClientRect();
        this.boxElement.style.top = rect.top + 'px';
        this.boxElement.style.left = rect.left + 'px';
        //Focus on custom hours
    }
    hide() {
        this.boxElement.classList.add('hidden');
    }
}
_MouseBoxController_instances = new WeakSet(), _MouseBoxController_initBox = function _MouseBoxController_initBox() {
    this.boxElement.classList.add('container-card', 'flex-row', 'hidden');
    this.boxElement.id = 'schedule-mouse-controller-box';
    document.body.appendChild(this.boxElement);
    Object.entries(CONFIG.SHIFT_TYPES).forEach(([shift, info]) => {
        this.boxElement.insertAdjacentHTML('beforeend', `
        <div class="box-sharp ${shift.toLowerCase()}">${info.translation}</div>
      `);
    });
};
export default MouseBoxController;
