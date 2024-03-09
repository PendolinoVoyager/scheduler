import { AbstractController } from '../AbstractController.js';
export default class KeyboardScheduleController extends AbstractController {
    constructor(mainController) {
        super();
        this.mainController = mainController;
    }
    bind() {
        this.addEventListener('select-change', (e) => console.log(e));
    }
}
