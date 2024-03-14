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
import { EntityManager } from './services/EntityManager.js';
import Entity from './models/Entity.js';

interface State {
  group: Group;
  year: number;
  month: number;
  workingSchedule: Schedule | null;
  unsavedChanges: boolean;
}
export class App extends EventTarget {
  private navbarControllers: ModalController<any>[] = [];
  public state: State = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    group: new Group(),
    workingSchedule: null,
    unsavedChanges: false,
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
    this.#init();

    this.#assignTestGroup();
    this.state.year = new Date().getFullYear();

    this.createNewSchedule();
  }

  async selectDate(year: number, month: number) {
    this.state.year = year;
    this.state.month = month;

    this.saveAndCreateSchedule();
  }
  async saveAndCreateSchedule() {
    await EntityManager.persist<Schedule>(
      'schedules',
      this.state.workingSchedule!
    );
    this.createNewSchedule();
  }
  async createNewSchedule() {
    console.log(await this.recoverSchedule());
    this.state.workingSchedule = new Schedule(
      this.state.group,
      this.state.year,
      this.state.month
    );
    this.state.workingSchedule.disableFreeDaysInPoland();
    this.scheduleController.createLiveSchedule(this.state.workingSchedule!);
  }
  async recoverSchedule() {
    const schedule = await EntityManager.find('schedules', {
      year: { $eq: this.state.year },
      month: { $eq: this.state.month },
    });
    return schedule;
  }
  async recoverGroup(id: Entity['id']) {
    const group = await EntityManager.getOne('groups', id);
    return group;
  }
  #init() {
    this.#addNavbarControllers();
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
      if (!this.state.workingSchedule) return;
      this.state.workingSchedule.fillRowfromPreference(
        this.state.group.getEmployees().at(-1)!.getId()
      );
      this.scheduleController.createLiveSchedule(this.state.workingSchedule);
    });
  }
  #addNavbarControllers() {
    navbarHandlers.forEach(({ itemId, ctorData }) => {
      const controller = new ModalController(
        ctorData.viewClass,
        ctorData.handlers,
        ctorData.onClose
      );
      this.navbarControllers.push(controller);
      const navItem = document.getElementById(itemId);
      if (!navItem) return;
      navItem.addEventListener('click', controller.show.bind(controller, this));
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
