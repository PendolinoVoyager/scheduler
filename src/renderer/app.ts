import './config.js';
import DarkModeController from './controllers/DarkModeController.js';
import ModalService from './services/ModalService.js';
import HoverBoxService from './services/HoverBox.js';
import GroupSettingsController from './controllers/GroupSettingsController.js';
import ScheduleController from './controllers/scheduleControllers/ScheduleController.js';
import { Schedule } from './models/Schedule.js';
import { CONFIG } from './config.js';
import Employee from './models/Employee.js';
import Group from './models/Group.js';
import navbarHandlers from './controllers/modalController/NavbarData.js';
import { ModalController } from './controllers/modalController/ModalController.js';

interface State {
  group: Group;
  year: number;
  month: number;
  workingSchedule: Schedule | null;
}
export class App extends EventTarget {
  private navbarControllers: ModalController<any>[] = [];
  public state: State = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    group: this.#assignTestGroup(),
    workingSchedule: null,
  };
  //Services
  public ModalService = ModalService;
  public HoverBoxService = HoverBoxService;
  //Controllers
  public darkModeController = new DarkModeController();
  public groupSettingsController = new GroupSettingsController(this);
  public scheduleController = new ScheduleController();

  constructor() {
    super();

    navbarHandlers.forEach(({ itemId, ctorData }) => {
      const controller = new ModalController(
        ctorData.viewClass,
        ctorData.handlers,
        ctorData.onClose
      );
      this.navbarControllers.push(controller);
      const navItem = document.getElementById(itemId);
      if (!navItem) return;
      navItem.addEventListener('click', controller.show.bind(controller));
    });
    this.#addDefaultListeners();
    this.#assignTestGroup();
    this.state.year = new Date().getFullYear();

    this.state.workingSchedule = new Schedule(
      this.state.group,
      this.state.year,
      this.state.month
    );
    this.state.workingSchedule.disableFreeDaysInPoland();
    this.scheduleController.createLiveSchedule(this.state.workingSchedule);
  }

  #addDefaultListeners() {
    //Settings controller
    this.addEventListener('settings-update', () => {
      if (!this.state.workingSchedule) return;
      this.scheduleController.renderRawCellData(
        this.state.workingSchedule.exportJSON()
      );
    });
    this.addEventListener('remove-employee', () => {
      if (!this.state.workingSchedule) return;
      const copyCells = this.state.workingSchedule.exportJSON().data;
      this.state.workingSchedule = new Schedule(
        this.state.group,
        this.state.workingSchedule.year,
        this.state.workingSchedule.month
      );
      Schedule.assignCellData(this.state.workingSchedule, copyCells);
      this.state.workingSchedule.disableFreeDaysInPoland();
      this.scheduleController.createLiveSchedule(this.state.workingSchedule);
    });

    this.addEventListener('add-employee', () => {
      console.log('ee');
      if (!this.state.workingSchedule) return;
      this.state.workingSchedule.fillRowfromPreference(
        this.state.group.getEmployees().at(-1)!.getId()
      );
      this.scheduleController.createLiveSchedule(this.state.workingSchedule);
    });

    //Change month

    window.addEventListener('beforeunload', (e) => {
      // Handle exiting using electron api
    });
  }

  #assignTestGroup() {
    const testGroup = new Group();
    testGroup.addEmployee(
      new Employee('Anna Nowa', {
        shiftPreference: Object.keys(CONFIG.SHIFT_TYPES)[1],
        position: 'Kierownik',
        disabled: true,
      })
    );
    testGroup.getEmployees()[0].addCustomPreference(2024, 3, 1, 'Afternoon');
    testGroup.getEmployees()[0].addCustomPreference(2024, 3, 2, 'None');
    testGroup.getEmployees()[0].addCustomPreference(2024, 3, 3, 'Vacation');

    testGroup.addEmployee(new Employee('Jan Dupa'));
    testGroup.addEmployee(new Employee('Tadeusz Kościuszko'));
    testGroup.addEmployee(new Employee('Jacek Bawełna'));
    testGroup.addEmployee(new Employee('Pan Kierownik'));
    return testGroup;
  }
}
const app = new App();
