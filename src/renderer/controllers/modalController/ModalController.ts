import ModalService from '../../services/ModalService.js';
import View from '../../views/View.js';
import { AbstractController } from '../AbstractController.js';

export interface Handler {
  target: HTMLElement;
  eventType: string;
  cb: (e: Event) => void;
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

  show() {
    ModalService.open(this, false);
    this.onclose && ModalService.setOnClose(this, this.onclose);
    this.view.render(undefined);
    this.handlers.forEach((handler) => {
      handler.target.addEventListener(handler.eventType, handler.cb);
    });
  }
  hide() {
    ModalService.requestClose(this);
    ModalService.clear();
  }
}
