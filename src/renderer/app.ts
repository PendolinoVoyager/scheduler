import './config.js';
import DarkModeController from './controllers/DarkModeController.js';
import ModalService from './services/ModalService.js';
import HoverBoxService from './services/HoverBoxService.js';
import GroupSettingsController from './controllers/GroupSettingsController.js';
class App {
  //Services
  public ModalService = ModalService;
  public HoverBoxService = HoverBoxService;
  //Controllers
  public darkModeController = new DarkModeController();
  public groupSettingsController = new GroupSettingsController();
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
