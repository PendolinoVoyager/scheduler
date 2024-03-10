import { AbstractController } from '../AbstractController';
import ScheduleController from './ScheduleController';

export default class HeaderUtilsController extends AbstractController {
  constructor(private mainController: ScheduleController) {
    super();
  }
}
