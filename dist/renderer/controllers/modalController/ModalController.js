import ModalService from '../../services/ModalService.js';
import { AbstractController } from '../AbstractController.js';
export class ModalController extends AbstractController {
    constructor(viewClass, handlers, onclose) {
        super();
        this.viewClass = viewClass;
        this.handlers = handlers;
        this.onclose = onclose;
        this.view = new viewClass(ModalService.getWriteableElement());
    }
    show(callBackThis, data) {
        ModalService.open(this, false);
        this.onclose && ModalService.setOnClose(this, this.onclose);
        this.view.render(data);
        this.handlers.forEach((handler) => {
            document
                .querySelector(handler.target)
                ?.addEventListener(handler.eventType, handler.cb.bind(callBackThis));
        });
    }
    hide() {
        ModalService.requestClose(this);
        ModalService.clear();
    }
}
