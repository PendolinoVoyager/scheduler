import { AbstractController } from '../AbstractController.js';
import ScheduleController from './ScheduleController.js';

export default class MouseScheduleController extends AbstractController {
  constructor(private mainController: ScheduleController) {
    super();
  }
}
