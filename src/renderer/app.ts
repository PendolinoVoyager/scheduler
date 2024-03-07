import './config.js';
import DarkModeController from './controllers/DarkModeController.js';
import ModalService from './services/ModalService.js';
import HoverBoxService from './services/HoverBox.js';
import GroupSettingsController from './controllers/GroupSettingsController.js';
import ScheduleController from './controllers/scheduleControllers/ScheduleController.js';
import { Schedule } from './models/Schedule.js';
import state from './state.js';
import { CONFIG } from './config.js';
class App {
  //Services
  public ModalService = ModalService;
  public HoverBoxService = HoverBoxService;
  //Controllers
  public darkModeController = new DarkModeController();
  public groupSettingsController = new GroupSettingsController();
  public scheduleController = new ScheduleController();
  constructor() {
    this.#addDefaultListeners();
    const schedule = new Schedule(state.group, state.year, state.month);
    this.scheduleController.createLiveSchedule(schedule);
  }
  #addDefaultListeners() {
    window.addEventListener('beforeunload', (e) => {
      // Handle exiting using electron api
    });
  }
}
const app = new App();
