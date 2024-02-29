type Subscriber = {
  alias: string;
  element: HTMLElement;
  content: string;
  options?: {
    onshow?: (e: MouseEvent) => void;
    onhide?: (e: MouseEvent) => void;
    eventType: 'click' | 'mouseenter';
  };
  callbacks: { show: (e: MouseEvent) => void; hide: (e: MouseEvent) => void };
};
class CHoverBoxService {
  offsetFromBorder: number = 15;
  private hoverBox: HTMLDivElement | null = null;
  private subscribers: Subscriber[] = [];
  constructor() {}
  attach(
    alias: string,
    element: HTMLElement,
    content: string,
    options: Subscriber['options']
  ) {
    const subscriber: Subscriber = {
      alias,
      element,
      content,
      options: {
        onshow: options?.onshow ?? undefined,
        onhide: options?.onhide ?? undefined,
        eventType: options?.eventType ?? 'click',
      },
      callbacks: {
        show: (e: MouseEvent) => {
          this.#showHoverBox(subscriber, e);
          subscriber.options!.onshow && subscriber.options!.onshow(e);
        },
        hide: (e: MouseEvent) => {
          this.#hideHoverBox(subscriber, e);
          subscriber.options!.onhide && subscriber.options!.onhide(e);
        },
      },
    };

    subscriber.element.addEventListener(
      subscriber.options!.eventType,
      subscriber.callbacks.show
    );
    subscriber.element.addEventListener(
      'mouseleave',
      subscriber.callbacks.hide
    );

    this.subscribers.push(subscriber);
  }
  remove(alias: string) {
    const subscriber = this.subscribers.find((sub) => sub.alias === alias);
    if (!subscriber) return;
    const index = this.subscribers.indexOf(subscriber);

    subscriber.element.removeEventListener(
      subscriber.options!.eventType,
      subscriber.callbacks.show
    );
    subscriber.element.removeEventListener(
      'mouseleave',
      subscriber.callbacks.hide
    );
    const lastElement = this.subscribers.at(-1)!;
    this.subscribers[index] = lastElement;
    this.subscribers.pop();
  }
  update(alias: string, content: string) {
    const subscriber = this.subscribers.find((sub) => sub.alias === alias);
    if (!subscriber) return;
    subscriber.content = content;
  }
  #showHoverBox(subscriber: Subscriber, e: MouseEvent) {
    this.#hideHoverBox(subscriber, e);
    this.hoverBox = document.createElement('div');
    this.hoverBox.innerHTML = subscriber.content;
    this.hoverBox.classList.add('hover-box');

    this.hoverBox.getBoundingClientRect;
    const { top } = (e.target as HTMLElement).getBoundingClientRect();
    const direction = e.clientX > window.innerWidth * 0.5 ? '-' : '';
    this.hoverBox.style.left =
      e.clientX + this.offsetFromBorder * (direction ? -1 : 1) + 'px';
    this.hoverBox.style.top = top + 'px';
    this.hoverBox.style.transform = `translateX(${direction ? '-100%' : '0'})`;

    subscriber.element.appendChild(this.hoverBox);
  }
  #hideHoverBox(subscriber: Subscriber, e: MouseEvent) {
    this.hoverBox?.remove();
    this.hoverBox = null;
  }
}
export default new CHoverBoxService();
