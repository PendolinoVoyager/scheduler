export default class DragList {
  public list: HTMLElement;
  selector: string;
  onfinish: ((selectedElement: HTMLElement) => void) | undefined;
  selectedElement: HTMLElement | null = null;
  isDragging: boolean = false;
  filling: HTMLElement | null = null;
  children!: Element[];
  constructor(
    list: HTMLElement,
    selector: string,
    onfinish?: (selectedElement: HTMLElement) => void
  ) {
    this.list = list;
    this.selector = selector;
    this.onfinish = onfinish;
    this.setChildren();
    this.list.addEventListener(
      'mousedown',
      this.boundHandlers.startDragHandler
    );
  }
  #createFilling(element: HTMLElement) {
    const filling = document.createElement('div');
    filling.style.width = element.clientWidth + 'px';
    filling.style.height = element.clientHeight + 'px';
    filling.style.visibility = 'none';
    return filling;
  }
  setChildren() {
    this.children = [...this.list.querySelectorAll(this.selector)] as Element[];
  }

  dispose() {
    this.list.removeEventListener(
      'mousedown',
      this.boundHandlers.startDragHandler
    );

    this.#cleanUpHandlers();
  }

  #startDragHandler(e: MouseEvent) {
    this.selectedElement = null;
    const target = (e.target as Element).closest(this.selector);
    if (!target) return;

    this.selectedElement = target as HTMLElement;
    this.filling = this.#createFilling(this.selectedElement);

    this.selectedElement.insertAdjacentElement('beforebegin', this.filling);
    this.selectedElement.style.position = 'sticky';
    document.addEventListener('mousemove', this.boundHandlers.mouseMoveHandler);
    document.addEventListener('mouseup', this.boundHandlers.mouseUpHandler);
    document.addEventListener('mouseleave', this.boundHandlers.cleanup);
  }
  #mouseMoveHandler(e: MouseEvent) {
    this.selectedElement!.style.left =
      e.clientX - this.selectedElement!.clientWidth * 0.5 + 'px';
    this.selectedElement!.style.top =
      e.clientY - this.selectedElement!.clientHeight * 0.5 + 'px';
  }

  #mouseUpHandler(e: MouseEvent) {
    this.#cleanUpHandlers();
  }

  #cleanUpHandlers() {
    this.filling?.remove();
    this.filling = null;
    this.selectedElement!.style.position = 'static';
    document.removeEventListener(
      'mousemove',
      this.boundHandlers.mouseMoveHandler
    );
    document.removeEventListener('mouseup', this.boundHandlers.mouseUpHandler);
    document.removeEventListener('mouseleave', this.boundHandlers.cleanup);
  }
  boundHandlers = {
    startDragHandler: this.#startDragHandler.bind(this),
    mouseMoveHandler: this.#mouseMoveHandler.bind(this),
    mouseUpHandler: this.#mouseUpHandler.bind(this),
    cleanup: this.#cleanUpHandlers.bind(this),
  };
}
