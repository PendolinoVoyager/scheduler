import { AbstractController } from '../AbstractController.js';
export default class MouseScheduleController extends AbstractController {
    constructor(mainController) {
        super();
        this.mainController = mainController;
    }
}
