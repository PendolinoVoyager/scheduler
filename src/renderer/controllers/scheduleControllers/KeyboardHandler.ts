import { AbstractController } from '../AbstractController.js';
import ScheduleController from './ScheduleController.js';

export default class KeyboardScheduleController extends AbstractController {
  constructor(private mainController: ScheduleController) {
    super();
  }
  bind() {
    this.addEventListener('select-change', (e: any) => console.log(e));
  }
}
