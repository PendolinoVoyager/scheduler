import { AbstractController } from '../AbstractController.js';
export default class MouseScheduleController extends AbstractController {
    constructor(mainController) {
        super();
        this.mainController = mainController;
        this.boundHandlers = {
            handleClick: this.handleClick.bind(this),
            onSelectChange: this.onSelectChange.bind(this),
        };
    }
    bind() {
        this.mainController.cellsView.parentElement.addEventListener('click', this.boundHandlers.handleClick);
        this.addEventListener('select-change', this.boundHandlers.onSelectChange);
    }
    handleClick(e) {
        //@ts-ignore
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
    }
    /**
     * Handles select change from source other than itself
     */
    onSelectChange(e) {
        console.log('e');
        if (e.detail.src === this)
            console.log('yipee');
    }
}
