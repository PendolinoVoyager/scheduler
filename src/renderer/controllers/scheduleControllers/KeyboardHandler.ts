import { CONFIG } from '../../config.js';
import { AbstractController } from '../AbstractController.js';
import ScheduleController from './ScheduleController.js';

export default class KeyboardScheduleController extends AbstractController {
  constructor(private mainController: ScheduleController) {
    super();
  }
  private boundHandlers = {
    handleKeyDown: this.#handleKeyDown.bind(this),
    handleSelectChange: this.#handleSelectChange.bind(this),
  };
  bind() {
    this.addEventListener(
      'select-change',
      this.boundHandlers.handleSelectChange
    );
    document.addEventListener('keydown', this.boundHandlers.handleKeyDown);
  }
  #handleSelectChange() {
    return;
  }
  #handleKeyDown(e: KeyboardEvent) {
    if (
      document.activeElement !== document.body &&
      document.activeElement !== this.mainController.cellsView.parentElement
    )
      return;
    if (
      Object.values(CONFIG.SHIFT_TYPES)
        .map((c) => c.shortcut)
        .includes(e.key)
    )
      this.#handleShiftChange(e);
    else this.#handleArrowMovement(e);
  }
  #handleArrowMovement(e: KeyboardEvent) {
    e.preventDefault();
    const direction = { x: 0, y: 0 };

    switch (e.key) {
      case 'ArrowUp':
        direction.y -= 1;
        break;
      case 'ArrowDown':
        direction.y += 1;
        break;
      case 'ArrowRight':
        direction.x += 1;
        break;
      case 'ArrowLeft':
        direction.x -= 1;
        break;
      case 'Tab':
        direction.x += 1;
        break;
    }
    let targetRow = this.mainController.selectedElement?.dataset.row ?? 0;
    let targetDay = this.mainController.selectedElement?.dataset.day ?? 1;
    //Move in direction
    targetDay = +targetDay + direction.x;
    targetRow = +targetRow + direction.y;

    //Wrap
    if (targetDay > this.mainController.scheduleData!.length) targetDay = 1;
    if (targetDay < 1) targetDay = this.mainController.scheduleData!.length;
    //Leap disabled
    while (
      this.mainController.scheduleData!.disabledDays.includes(+targetDay)
    ) {
      targetDay = +targetDay + direction.x;
      if (targetDay > this.mainController.scheduleData!.length || targetDay < 0)
        break;
    }

    //Wrap
    if (targetDay > this.mainController.scheduleData!.length) targetDay = 1;
    if (targetDay < 1) targetDay = this.mainController.scheduleData!.length;
    try {
      this.mainController.select(+targetRow, +targetDay);
    } catch (err) {
      //ignore :)
    }
  }
  #handleShiftChange(e: KeyboardEvent) {
    if (!this.mainController.selected) return;
    Object.entries(CONFIG.SHIFT_TYPES).forEach(([shiftName, shiftInfo]) => {
      if (shiftInfo.shortcut === e.key) {
        const startTime =
          this.mainController.headerUtilsController.customTime.startTime;
        const endTime =
          this.mainController.headerUtilsController.customTime.endTime;
        this.mainController.updateSelected({
          shiftType: shiftName,
          startTime,
          endTime,
        });
        return;
      }
    });
  }
  unbind() {
    this.removeEventListener(
      'select-change',
      this.boundHandlers.handleSelectChange
    );
    document.removeEventListener('keydown', this.boundHandlers.handleKeyDown);
  }
}
