import { AbstractController } from '../AbstractController.js';
export default class KeyboardScheduleController extends AbstractController {
    constructor(mainController) {
        super();
        this.mainController = mainController;
        this.addEventListener('select-change', (e) => console.log(e));
    }
    bind() {
        this.addEventListener('select-change', (e) => console.log(e));
    }
}
