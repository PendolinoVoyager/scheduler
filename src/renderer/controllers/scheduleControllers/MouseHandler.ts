import { CONFIG } from '../../config.js';
import { AbstractController } from '../AbstractController.js';
import MouseBoxController from './MouseBoxController.js';
import ScheduleController from './ScheduleController.js';

export default class MouseScheduleController extends AbstractController {
  mouseBoxController: MouseBoxController;
  constructor(readonly mainController: ScheduleController) {
    super();
    this.mouseBoxController = new MouseBoxController(this);
  }
  boundHandlers = {
    handleClick: this.handleClick.bind(this),
    onSelectChange: this.onSelectChange.bind(this),
    hasClickedAway: this.#hasClickedAway.bind(this),
  };
  bind() {
    this.mainController.cellsView.parentElement.addEventListener(
      'click',
      this.boundHandlers.handleClick
    );
    this.addEventListener('select-change', this.boundHandlers.onSelectChange);
    document.addEventListener('click', this.boundHandlers.hasClickedAway);
  }
  handleClick(e: MouseEvent) {
    const targetCell = (e.target as HTMLElement).closest(
      '.cell'
    ) as HTMLElement;
    if (!targetCell) return;
    if (!targetCell.dataset.day || !targetCell.dataset.row) return;
    this.mainController.select(
      +targetCell.dataset.row,
      +targetCell.dataset.day
    );
    const event = new CustomEvent('select-change', {
      detail: { src: this },
      bubbles: true,
      cancelable: false,
    });
    this.mainController.dispatchEvent(event);
    this.mouseBoxController.show(targetCell);
  }
  /**
   * Checks if click is outside cells and box
   */
  #hasClickedAway(e: MouseEvent) {
    const eTarget = e.target as HTMLElement;
    let target =
      eTarget.closest('#schedule-mouse-controller-box') ??
      eTarget.closest('.cell');
    if (!target || target?.classList.contains('disabled'))
      this.mouseBoxController.hide();
  }

  /**
   * Handles select change from source other than itself
   */
  unbind() {
    this.removeEventListener(
      'select-change',
      this.boundHandlers.onSelectChange
    );
    this.mainController.cellsView.parentElement.removeEventListener(
      'click',
      this.boundHandlers.handleClick
    );
  }
  onSelectChange(e: any) {
    this.mouseBoxController.hide();
  }
}
