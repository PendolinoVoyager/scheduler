import ModalService from '../services/ModalService';
import { AbstractController } from './AbstractController.js';
export class ModalController extends AbstractController {
    constructor(viewClass, handlers, onclose) {
        super();
        this.viewClass = viewClass;
        this.handlers = handlers;
        this.onclose = onclose;
        //@ts-ignore
        this.view = new viewClass(ModalService.getWriteableElement());
    }
    show() {
        ModalService.open(this, false);
        this.onclose && ModalService.setOnClose(this, this.onclose);
        this.view.render(undefined);
    }
}
