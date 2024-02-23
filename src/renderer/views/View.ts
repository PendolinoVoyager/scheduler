export default abstract class View {
  public parentElement: HTMLElement;
  abstract data: any;
  constructor(parentElement: HTMLElement) {
    this.parentElement = parentElement;
  }
  render<T>(data: T) {
    this.data = data;
    this.clear();
    const markup = this.generateMarkup();
    this.parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update<T>(data: T) {
    this.data = data;
    const newMarkup = this.generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this.parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue !== '') {
        curEl.textContent = newEl.textContent;
      }
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  clear() {
    this.parentElement.innerHTML = '';
  }

  renderSpinner(width?: number) {
    const markup = `
          <img width="${width || 30}" class="spinner" src="spinner.svg"></img>
        `;
    this.clear();
    this.parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  generateMarkup(): string {
    throw new Error('Not implemented!');
  }
}
