import ModalService from '../../services/ModalService.js';
import View from '../../views/View.js';
import { AbstractController } from '../AbstractController.js';

export interface Handler {
  target: string;
  eventType: string;
  cb: (e?: any) => void;
}
export interface ModalControllerConstructorData<T extends View> {
  viewClass: new (parentElement: HTMLElement) => T;
  handlers: Handler[];
  onClose?: Function;
}

export class ModalController<T extends View> extends AbstractController {
  private view: T;

  constructor(
    private viewClass: new (parentElement: HTMLElement) => T,
    private handlers: Handler[],
    private onclose?: Function
  ) {
    super();
    this.view = new viewClass(ModalService.getWriteableElement());
  }

  show(callBackThis?: any, data?: any) {
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
