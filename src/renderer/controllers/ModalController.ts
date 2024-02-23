export default class ModalController {
  overlay = document.getElementById('overlay')!;
  modal = document.getElementById('modal')!;
  btnCloseModal = document.getElementById('btn-close-modal')!;
  constructor() {
    this.#addCloseListeners();
  }
  #addCloseListeners() {
    this.btnCloseModal.addEventListener('click', this.close.bind(this));
  }

  open() {
    console.log('opening');
    this.overlay.classList.remove('hidden');
    this.modal.classList.remove('hidden');
  }
  close() {
    this.overlay.classList.add('hidden');
    this.modal.classList.add('hidden');
  }
  clear() {
    this.modal.innerHTML = '';
  }
}
