var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MouseScheduleController_instances, _MouseScheduleController_hasClickedAway;
import { AbstractController } from '../AbstractController.js';
import MouseBoxController from './MouseBoxController.js';
class MouseScheduleController extends AbstractController {
    constructor(mainController) {
        super();
        _MouseScheduleController_instances.add(this);
        this.mainController = mainController;
        this.boundHandlers = {
            handleClick: this.handleClick.bind(this),
            onSelectChange: this.onSelectChange.bind(this),
            hasClickedAway: __classPrivateFieldGet(this, _MouseScheduleController_instances, "m", _MouseScheduleController_hasClickedAway).bind(this),
        };
        this.mouseBoxController = new MouseBoxController(this);
    }
    bind() {
        this.mainController.cellsView.parentElement.addEventListener('click', this.boundHandlers.handleClick);
        this.addEventListener('select-change', this.boundHandlers.onSelectChange);
        document.addEventListener('click', this.boundHandlers.hasClickedAway);
    }
    handleClick(e) {
        const targetCell = e.target.closest('.cell');
        if (!targetCell)
            return;
        if (!targetCell.dataset.day || !targetCell.dataset.row)
            return;
        this.mainController.select(+targetCell.dataset.row, +targetCell.dataset.day);
        const event = new CustomEvent('select-change', {
            detail: { src: this },
            bubbles: true,
            cancelable: false,
        });
        this.mainController.dispatchEvent(event);
        this.mouseBoxController.show(targetCell);
    }
    /**
     * Handles select change from source other than itself
     */
    unbind() {
        this.removeEventListener('select-change', this.boundHandlers.onSelectChange);
        this.mainController.cellsView.parentElement.removeEventListener('click', this.boundHandlers.handleClick);
    }
    onSelectChange(e) {
        this.mouseBoxController.hide();
    }
}
_MouseScheduleController_instances = new WeakSet(), _MouseScheduleController_hasClickedAway = function _MouseScheduleController_hasClickedAway(e) {
    const eTarget = e.target;
    let target = eTarget.closest('#schedule-mouse-controller-box') ??
        eTarget.closest('.cell');
    if (!target || target?.classList.contains('disabled'))
        this.mouseBoxController.hide();
};
export default MouseScheduleController;
