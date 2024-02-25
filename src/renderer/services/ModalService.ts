import { AbstractController } from '../controllers/AbstractController.js';
import { renderDialog } from '../helpers/yesNoDialog.js';
/**
 *  Will be used in dependency injection for
 *  controllers requiring modal access.
 *
 */
export default class ModalService {
  owner: AbstractController | null = null;
  overlay = document.getElementById('overlay')!;
  modal = document.getElementById('modal-box')!;
  btnCloseModal = document.getElementById('btn-close-modal')!;
  writeableElement = document.getElementById('modal')!;
  onclose: Function | undefined;
  isOpen: boolean = false;
  closing: boolean = false;
  dialog: Promise<any> | null = null;
  private important: boolean = false;
  constructor() {
    this.#addCloseListeners();
  }
  #addCloseListeners() {
    this.btnCloseModal.addEventListener('click', this.#close.bind(this));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && e.target === document.body)
        if (!this.closing) this.#close();
    });
    this.overlay.addEventListener('click', this.#close.bind(this));
  }
  /**
   * Returns if opening is successfull or not
   * @owner Owner of the modal window.
   * @important Specifies the behavior of modal. If important, the modal can't be closed by other controllers and asks for confirmation upon exit.
   */
  open(owner: AbstractController | null = null, important: boolean = false) {
    if (this.isOpen) return false;
    // If new owner is other than the previous owner the modal is cleared.
    if (owner !== this.owner) this.clear();
    this.owner = owner;
    this.important = important;
    this.isOpen = true;
    this.overlay.classList.remove('hidden');
    this.modal.classList.remove('hidden');
    return true;
  }
  async requestClose(sender: AbstractController | null = null) {
    if (!this.isOpen) return false;
    if (this.important && sender !== this.owner) return false;
    return await this.#close();
  }
  clear() {
    this.writeableElement.innerHTML = '';
  }
  getWriteableElement() {
    return this.writeableElement;
  }
  async #close() {
    if (this.closing) return false;
    this.closing = true;
    if (this.important) {
      const res = await renderDialog('Zamknąć bez zapisu?');
      this.closing = false;
      if (!res) return false;
    }

    this.onclose && this.onclose();

    this.isOpen = false;
    this.important = false;
    this.overlay.classList.add('hidden');
    this.modal.classList.add('hidden');
    this.closing = false;
    this.dialog = null;
    this.onclose = undefined;
    return true;
  }
  setImportant(sender: AbstractController | null, important: boolean) {
    if (this.owner && this.owner !== sender) return false;
    this.important = important;
    return true;
  }
  setOnClose(sender: AbstractController | null, cb: Function) {
    if (this.important && sender !== this.owner) return false;
    this.onclose = cb;
    return true;
  }
  removeOnClose(sender: AbstractController | null) {
    if (this.important && sender !== this.owner) return false;
    this.onclose = undefined;
    return;
  }
}
