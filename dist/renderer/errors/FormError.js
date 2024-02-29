var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FormError_instances, _FormError_addListeners, _FormError_removeIssueHighlight;
class FormError extends Error {
    constructor(displayError = true, ...issues) {
        super();
        _FormError_instances.add(this);
        this.boundRemoveIssueHighlight = __classPrivateFieldGet(this, _FormError_instances, "m", _FormError_removeIssueHighlight).bind(this);
        this.issues = issues ?? [];
        if (!displayError)
            return;
        this.issues.forEach((issue) => {
            if (!issue.element)
                return;
            issue.element.classList.add('error');
        });
        __classPrivateFieldGet(this, _FormError_instances, "m", _FormError_addListeners).call(this);
    }
}
_FormError_instances = new WeakSet(), _FormError_addListeners = function _FormError_addListeners() {
    this.issues.forEach((issue) => {
        if (!issue.element)
            return;
        issue.element.addEventListener('input', this.boundRemoveIssueHighlight);
    });
}, _FormError_removeIssueHighlight = function _FormError_removeIssueHighlight(e) {
    if (!e.target)
        return;
    e.target.classList.remove('error');
    e.target.removeEventListener('input', this.boundRemoveIssueHighlight);
};
export default FormError;
