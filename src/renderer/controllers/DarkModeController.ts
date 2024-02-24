import { AbstractController } from './AbstractController.js';

export default class DarkModeController extends AbstractController {
  public toggleElement: HTMLElement;
  constructor() {
    super();
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
