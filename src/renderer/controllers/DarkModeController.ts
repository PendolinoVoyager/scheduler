export default class DarkModeController {
  public toggleElement: HTMLElement;
  constructor() {
    this.toggleElement = document.getElementById('toggle-dark-mode')!;
    this.#addListeners();
  }
  #addListeners() {
    this.toggleElement.addEventListener('click', async () => {
      const isDarkMode = await window.darkMode.toggle();
      this.toggleElement.classList.toggle('dark');
    });
  }
  async #fetchPreviousTheme() {
    throw new Error('Not implemented yet');
  }
}
