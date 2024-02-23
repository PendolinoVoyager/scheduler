import DarkModeController from './controllers/DarkModeController.js';
import GroupController from './controllers/GroupController.js';
import ModalController from './controllers/ModalController.js';
import GroupSettingsController from './controllers/GroupSettingController.js';
class App {
  public darkModeController = new DarkModeController();
  public groupController = new GroupController();
  public modalController = new ModalController();
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
