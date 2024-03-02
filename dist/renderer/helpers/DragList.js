var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DragList_instances, _DragList_createFilling, _DragList_startDragHandler, _DragList_mouseMoveHandler, _DragList_mouseUpHandler, _DragList_cleanUpHandlers;
class DragList {
    constructor(list, selector, onfinish) {
        _DragList_instances.add(this);
        this.selectedElement = null;
        this.isDragging = false;
        this.filling = null;
        this.boundHandlers = {
            startDragHandler: __classPrivateFieldGet(this, _DragList_instances, "m", _DragList_startDragHandler).bind(this),
            mouseMoveHandler: __classPrivateFieldGet(this, _DragList_instances, "m", _DragList_mouseMoveHandler).bind(this),
            mouseUpHandler: __classPrivateFieldGet(this, _DragList_instances, "m", _DragList_mouseUpHandler).bind(this),
            cleanup: __classPrivateFieldGet(this, _DragList_instances, "m", _DragList_cleanUpHandlers).bind(this),
        };
        this.list = list;
        this.selector = selector;
        this.onfinish = onfinish;
        this.setChildren();
        this.list.addEventListener('mousedown', this.boundHandlers.startDragHandler);
    }
    setChildren() {
        this.children = [...this.list.querySelectorAll(this.selector)];
    }
    dispose() {
        this.list.removeEventListener('mousedown', this.boundHandlers.startDragHandler);
        __classPrivateFieldGet(this, _DragList_instances, "m", _DragList_cleanUpHandlers).call(this);
    }
}
_DragList_instances = new WeakSet(), _DragList_createFilling = function _DragList_createFilling(element) {
    const filling = document.createElement('div');
    filling.style.width = element.clientWidth + 'px';
    filling.style.height = element.clientHeight + 'px';
    filling.style.visibility = 'none';
    return filling;
}, _DragList_startDragHandler = function _DragList_startDragHandler(e) {
    this.selectedElement = null;
    const target = e.target.closest(this.selector);
    if (!target)
        return;
    this.selectedElement = target;
    this.filling = __classPrivateFieldGet(this, _DragList_instances, "m", _DragList_createFilling).call(this, this.selectedElement);
    this.selectedElement.insertAdjacentElement('beforebegin', this.filling);
    this.selectedElement.style.position = 'sticky';
    document.addEventListener('mousemove', this.boundHandlers.mouseMoveHandler);
    document.addEventListener('mouseup', this.boundHandlers.mouseUpHandler);
    document.addEventListener('mouseleave', this.boundHandlers.cleanup);
}, _DragList_mouseMoveHandler = function _DragList_mouseMoveHandler(e) {
    this.selectedElement.style.left =
        e.clientX - this.selectedElement.clientWidth * 0.5 + 'px';
    this.selectedElement.style.top =
        e.clientY - this.selectedElement.clientHeight * 0.5 + 'px';
}, _DragList_mouseUpHandler = function _DragList_mouseUpHandler(e) {
    __classPrivateFieldGet(this, _DragList_instances, "m", _DragList_cleanUpHandlers).call(this);
}, _DragList_cleanUpHandlers = function _DragList_cleanUpHandlers() {
    this.filling?.remove();
    this.filling = null;
    this.selectedElement.style.position = 'static';
    document.removeEventListener('mousemove', this.boundHandlers.mouseMoveHandler);
    document.removeEventListener('mouseup', this.boundHandlers.mouseUpHandler);
    document.removeEventListener('mouseleave', this.boundHandlers.cleanup);
};
export default DragList;
