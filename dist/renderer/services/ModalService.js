var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ModalService_instances, _ModalService_addCloseListeners, _ModalService_close;
import { renderDialog } from '../helpers/yesNoDialog.js';
/**
 *  Will be used in dependency injection for
 *  controllers requiring modal access.
 *
 */
class ModalService {
    constructor() {
        _ModalService_instances.add(this);
        this.owner = null;
        this.overlay = document.getElementById('overlay');
        this.modal = document.getElementById('modal-box');
        this.btnCloseModal = document.getElementById('btn-close-modal');
        this.writeableElement = document.getElementById('modal');
        this.isOpen = false;
        this.closing = false;
        this.dialog = null;
        this.important = false;
        __classPrivateFieldGet(this, _ModalService_instances, "m", _ModalService_addCloseListeners).call(this);
    }
    /**
     * Returns if opening is successfull or not
     * @owner Owner of the modal window.
     * @important Specifies the behavior of modal. If important, the modal can't be closed by other controllers and asks for confirmation upon exit.
     */
    open(owner = null, important = false) {
        if (this.isOpen)
            return false;
        // If new owner is other than the previous owner the modal is cleared.
        if (owner !== this.owner)
            this.clear();
        this.owner = owner;
        this.important = important;
        this.isOpen = true;
        this.overlay.classList.remove('hidden');
        this.modal.classList.remove('hidden');
        return true;
    }
    async requestClose(sender = null) {
        if (!this.isOpen)
            return false;
        if (this.important && sender !== this.owner)
            return false;
        return await __classPrivateFieldGet(this, _ModalService_instances, "m", _ModalService_close).call(this);
    }
    clear() {
        this.writeableElement.innerHTML = '';
    }
    getWriteableElement() {
        return this.writeableElement;
    }
    setImportant(sender, important) {
        if (this.owner && this.owner !== sender)
            return false;
        this.important = important;
        return true;
    }
    setOnClose(sender, cb) {
        if (this.important && sender !== this.owner)
            return false;
        this.onclose = cb;
        return true;
    }
    removeOnClose(sender) {
        if (this.important && sender !== this.owner)
            return false;
        this.onclose = undefined;
        return;
    }
}
_ModalService_instances = new WeakSet(), _ModalService_addCloseListeners = function _ModalService_addCloseListeners() {
    this.btnCloseModal.addEventListener('click', __classPrivateFieldGet(this, _ModalService_instances, "m", _ModalService_close).bind(this));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && e.target === document.body)
            if (!this.closing)
                __classPrivateFieldGet(this, _ModalService_instances, "m", _ModalService_close).call(this);
    });
    this.overlay.addEventListener('click', __classPrivateFieldGet(this, _ModalService_instances, "m", _ModalService_close).bind(this));
}, _ModalService_close = async function _ModalService_close() {
    if (this.closing)
        return false;
    this.closing = true;
    if (this.important) {
        const res = await renderDialog('Zamknąć bez zapisu?');
        this.closing = false;
        if (!res)
            return false;
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
};
export default ModalService;
