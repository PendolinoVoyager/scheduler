import './config.js';
import './state.js';
import DarkModeController from './controllers/DarkModeController.js';
import ModalService from './services/ModalService.js';
import GroupSettingsController from './controllers/GroupSettingsController.js';
class App {
  public modalService = new ModalService();

  public darkModeController = new DarkModeController();
  public groupSettingsController = new GroupSettingsController(
    this.modalService
  );

  constructor() {
    this.#addDefaultListeners();
  }
  #addDefaultListeners() {
    window.addEventListener('beforeunload', (e) => {
      // Handle exiting using electron api
    });
  }
}
const app = new App();
