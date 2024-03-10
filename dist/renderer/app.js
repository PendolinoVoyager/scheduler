var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _App_instances, _App_addDefaultListeners, _App_assignTestGroup;
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
export class App extends EventTarget {
    constructor() {
        super();
        _App_instances.add(this);
        this.state = {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            group: __classPrivateFieldGet(this, _App_instances, "m", _App_assignTestGroup).call(this),
            workingSchedule: null,
        };
        //Services
        this.ModalService = ModalService;
        this.HoverBoxService = HoverBoxService;
        //Controllers
        this.darkModeController = new DarkModeController();
        this.groupSettingsController = new GroupSettingsController(this);
        this.scheduleController = new ScheduleController();
        __classPrivateFieldGet(this, _App_instances, "m", _App_addDefaultListeners).call(this);
        __classPrivateFieldGet(this, _App_instances, "m", _App_assignTestGroup).call(this);
        this.state.year = new Date().getFullYear();
        this.state.workingSchedule = new Schedule(this.state.group, this.state.year, this.state.month);
        this.state.workingSchedule.disableFreeDaysInPoland();
        this.scheduleController.createLiveSchedule(this.state.workingSchedule);
    }
}
_App_instances = new WeakSet(), _App_addDefaultListeners = function _App_addDefaultListeners() {
    //Settings controller
    this.addEventListener('settings-update', () => {
        if (!this.state.workingSchedule)
            return;
        this.scheduleController.renderRawCellData(this.state.workingSchedule.exportJSON());
    });
    this.addEventListener('remove-employee', () => {
        if (!this.state.workingSchedule)
            return;
        const copyCells = this.state.workingSchedule.exportJSON().data;
        this.state.workingSchedule = new Schedule(this.state.group, this.state.workingSchedule.year, this.state.workingSchedule.month);
        Schedule.assignCellData(this.state.workingSchedule, copyCells);
        this.state.workingSchedule.disableFreeDaysInPoland();
        this.scheduleController.createLiveSchedule(this.state.workingSchedule);
    });
    this.addEventListener('add-employee', () => {
        console.log('ee');
        if (!this.state.workingSchedule)
            return;
        this.state.workingSchedule.fillRowfromPreference(this.state.group.getEmployees().at(-1).getId());
        this.scheduleController.createLiveSchedule(this.state.workingSchedule);
    });
    window.addEventListener('beforeunload', (e) => {
        // Handle exiting using electron api
    });
}, _App_assignTestGroup = function _App_assignTestGroup() {
    const testGroup = new Group();
    testGroup.addEmployee(new Employee('Anna Nowa', {
        shiftPreference: Object.keys(CONFIG.SHIFT_TYPES)[1],
        position: 'Kierownik',
        disabled: true,
    }));
    testGroup.getEmployees()[0].addCustomPreference(2024, 3, 1, 'Afternoon');
    testGroup.getEmployees()[0].addCustomPreference(2024, 3, 2, 'None');
    testGroup.getEmployees()[0].addCustomPreference(2024, 3, 3, 'Vacation');
    testGroup.addEmployee(new Employee('Jan Dupa'));
    testGroup.addEmployee(new Employee('Tadeusz Kościuszko'));
    testGroup.addEmployee(new Employee('Jacek Bawełna'));
    testGroup.addEmployee(new Employee('Pan Kierownik'));
    return testGroup;
};
const app = new App();
