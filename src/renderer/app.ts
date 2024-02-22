import DarkModeController from './controllers/DarkModeController.js';

class App {
  public darkModeController: DarkModeController;
  constructor() {
    this.darkModeController = new DarkModeController();
    this.#addDefaultListeners();
  }
  #addDefaultListeners() {
    window.addEventListener('beforeunload', (e) => {
      // Handle exiting using electron api
    });
  }
}
const app = new App();
