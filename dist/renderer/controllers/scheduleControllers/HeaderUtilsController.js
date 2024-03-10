import { AbstractController } from '../AbstractController';
export default class HeaderUtilsController extends AbstractController {
    constructor(mainController) {
        super();
        this.mainController = mainController;
    }
}
