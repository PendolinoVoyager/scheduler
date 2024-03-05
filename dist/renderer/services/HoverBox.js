var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CHoverBoxService_instances, _CHoverBoxService_showHoverBox, _CHoverBoxService_hideHoverBox, _CHoverBoxService_cleanupOprhans;
class CHoverBoxService {
    constructor() {
        _CHoverBoxService_instances.add(this);
        this.offsetFromBorder = 15;
        this.hoverBox = null;
        this.subscribers = [];
    }
    attach(alias, element, content, options) {
        const subscriber = {
            alias,
            element,
            content,
            options: {
                onshow: options?.onshow ?? undefined,
                onhide: options?.onhide ?? undefined,
                eventType: options?.eventType ?? 'mouseenter',
                namespace: options?.namespace ?? undefined,
            },
            callbacks: {
                show: (e) => {
                    __classPrivateFieldGet(this, _CHoverBoxService_instances, "m", _CHoverBoxService_showHoverBox).call(this, subscriber, e);
                    subscriber.options.onshow && subscriber.options.onshow(e);
                },
                hide: (e) => {
                    __classPrivateFieldGet(this, _CHoverBoxService_instances, "m", _CHoverBoxService_hideHoverBox).call(this);
                    subscriber.options.onhide && subscriber.options.onhide(e);
                },
            },
        };
        subscriber.element.addEventListener(subscriber.options.eventType, subscriber.callbacks.show);
        subscriber.element.addEventListener('mouseleave', subscriber.callbacks.hide);
        this.subscribers.push(subscriber);
    }
    remove(alias) {
        const subscriber = this.subscribers.find((sub) => sub.alias === alias);
        if (!subscriber)
            return;
        __classPrivateFieldGet(this, _CHoverBoxService_instances, "m", _CHoverBoxService_hideHoverBox).call(this);
        const index = this.subscribers.indexOf(subscriber);
        subscriber.element.removeEventListener(subscriber.options.eventType, subscriber.callbacks.show);
        subscriber.element.removeEventListener('mouseleave', subscriber.callbacks.hide);
        const lastElement = this.subscribers.at(-1);
        this.subscribers[index] = lastElement;
        this.subscribers.pop();
    }
    removeMany(namespace) {
        const subsToCleanup = this.subscribers.filter((sub) => sub.options?.namespace !== namespace);
        subsToCleanup.forEach((sub) => this.remove(sub.alias));
    }
    update(alias, content) {
        const subscriber = this.subscribers.find((sub) => sub.alias === alias);
        if (!subscriber)
            return;
        subscriber.content = content;
    }
}
_CHoverBoxService_instances = new WeakSet(), _CHoverBoxService_showHoverBox = function _CHoverBoxService_showHoverBox(subscriber, e) {
    __classPrivateFieldGet(this, _CHoverBoxService_instances, "m", _CHoverBoxService_hideHoverBox).call(this);
    this.hoverBox = document.createElement('div');
    this.hoverBox.innerHTML = subscriber.content;
    this.hoverBox.classList.add('hover-box');
    this.hoverBox.getBoundingClientRect;
    const { top } = e.target.getBoundingClientRect();
    const direction = e.clientX > window.innerWidth * 0.5 ? '-' : '';
    this.hoverBox.style.left =
        e.clientX + this.offsetFromBorder * (direction ? -1 : 1) + 'px';
    this.hoverBox.style.top = top + 'px';
    this.hoverBox.style.transform = `translateX(${direction ? '-100%' : '0'})`;
    if (subscriber.element.tagName === 'DIV')
        subscriber.element.appendChild(this.hoverBox);
    else
        subscriber.element.insertAdjacentElement('afterend', this.hoverBox);
}, _CHoverBoxService_hideHoverBox = function _CHoverBoxService_hideHoverBox() {
    this.hoverBox?.remove();
    this.hoverBox = null;
}, _CHoverBoxService_cleanupOprhans = function _CHoverBoxService_cleanupOprhans() {
    this.subscribers = this.subscribers.filter((sub) => sub.element.isConnected);
};
export default new CHoverBoxService();
