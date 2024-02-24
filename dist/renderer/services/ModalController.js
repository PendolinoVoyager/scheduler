var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ModalService_instances, _ModalService_addCloseListeners;
class ModalService {
    constructor() {
        _ModalService_instances.add(this);
        this.overlay = document.getElementById('overlay');
        this.modal = document.getElementById('modal');
        this.btnCloseModal = document.getElementById('btn-close-modal');
        __classPrivateFieldGet(this, _ModalService_instances, "m", _ModalService_addCloseListeners).call(this);
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
_ModalService_instances = new WeakSet(), _ModalService_addCloseListeners = function _ModalService_addCloseListeners() {
    this.btnCloseModal.addEventListener('click', this.close.bind(this));
    this.overlay.addEventListener('keydown', (e) => {
        if (e.key === 'Escape')
            this.close();
    });
};
export default ModalService;
