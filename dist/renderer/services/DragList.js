var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CDragListService_instances, _CDragListService_addMouseDownListener, _CDragListService_checkIfExists, _CDragListService_startDrag;
class CDragListService {
    constructor() {
        _CDragListService_instances.add(this);
        this.lists = [];
        this.boundStartDrag = __classPrivateFieldGet(this, _CDragListService_instances, "m", _CDragListService_startDrag).bind(this);
    }
    /**
     *
     * @param list Any HTML list or list-like construct
     * @param selector used in query selector to detetrmine if the item inside the list should be draggable
     * @param onfinish callback that will take a selected element as argument
     */
    attach(list, selector, onfinish) {
        if (__classPrivateFieldGet(this, _CDragListService_instances, "m", _CDragListService_checkIfExists).call(this, list))
            throw new Error('List already draggable.');
        const dragList = {
            list,
            selector,
            isDragging: false,
            onfinish,
            selectedElement: null,
        };
        this.lists.push(dragList);
        __classPrivateFieldGet(this, _CDragListService_instances, "m", _CDragListService_addMouseDownListener).call(this, dragList);
    }
    remove(list) {
        const listIndex = this.lists.findIndex((drag) => drag.list === list);
        if (listIndex === -1)
            return;
        //Remove event listener
        this.lists.splice(listIndex, 1);
    }
}
_CDragListService_instances = new WeakSet(), _CDragListService_addMouseDownListener = function _CDragListService_addMouseDownListener(dragList) {
    dragList.list.addEventListener('mousedown', this.boundStartDrag.bind(this, dragList));
}, _CDragListService_checkIfExists = function _CDragListService_checkIfExists(list) {
    return this.lists.some((dl) => dl.list === list);
}, _CDragListService_startDrag = function _CDragListService_startDrag(dragList, e) {
    const target = e.target.closest(dragList.selector);
    dragList.selectedElement = null;
    if (!target)
        return;
    dragList.selectedElement = null;
};
export default new CDragListService();
