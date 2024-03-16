var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _App_instances, _App_init, _App_addNavbarControllers;
import './config.js';
import DarkModeController from './controllers/DarkModeController.js';
import GroupSettingsController from './controllers/GroupSettingsController.js';
import ScheduleController from './controllers/scheduleControllers/ScheduleController.js';
import { Schedule } from './models/Schedule.js';
import Group from './models/Group.js';
import navbarHandlers from './controllers/modalController/NavbarData.js';
import { ModalController } from './controllers/modalController/ModalController.js';
import { EntityManager } from './services/EntityManager.js';
import { renderDialog } from './helpers/yesNoDialog.js';
export class App extends EventTarget {
    constructor() {
        super();
        _App_instances.add(this);
        this.navbarControllers = [];
        this.state = {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1 + (new Date().getDate() > 15 ? 1 : 0),
            group: new Group(),
            workingSchedule: null,
        };
        //Controllers
        this.darkModeController = new DarkModeController();
        this.groupSettingsController = new GroupSettingsController(this);
        this.scheduleController = new ScheduleController();
        __classPrivateFieldGet(this, _App_instances, "m", _App_init).call(this);
        this.createNewSchedule();
    }
    async selectDate(year, month) {
        this.state.year = year;
        this.state.month = month;
        let res = await renderDialog('Wyjść z obecnego grafiku?');
        if (!res)
            return;
        res = await renderDialog('Zapisać obecny grafik?');
        if (res)
            await this.saveAll();
        await this.createNewSchedule();
    }
    async saveAll() {
        if (this.state.group.getEmployees().length === 0)
            return;
        await EntityManager.persist('groups', this.state.group);
        for (const emp of this.state.group.getEmployees()) {
            await EntityManager.persist('employees', emp);
        }
        await EntityManager.persist('schedules', this.state.workingSchedule);
    }
    async createNewSchedule() {
        const data = await EntityManager.recoverWhole(this.state.year, this.state.month);
        if (data.status === 'fail') {
            this.resetSchedule();
        }
        if (data.status === 'partial') {
            this.resetSchedule();
            this.state.workingSchedule.setId(data.scheduleJSON.id);
            try {
                Schedule.assignCellData(this.state.workingSchedule, data.scheduleJSON.data);
            }
            catch (err) {
                this.resetSchedule();
                this.state.workingSchedule.setId(data.scheduleJSON.id);
            }
        }
        if (data.status === 'success') {
            this.state.group = data.recovered.group;
            this.state.workingSchedule = data.recovered.schedule;
        }
        this.groupSettingsController.group = this.state.group;
        this.scheduleController.createLiveSchedule(this.state.workingSchedule);
    }
    resetSchedule() {
        const id = this.state.workingSchedule?.getId();
        this.state.workingSchedule = new Schedule(this.state.group, this.state.year, this.state.month);
        id && this.state.workingSchedule.setId(id);
        this.state.workingSchedule.disableFreeDaysInPoland();
    }
}
_App_instances = new WeakSet(), _App_init = function _App_init() {
    __classPrivateFieldGet(this, _App_instances, "m", _App_addNavbarControllers).call(this);
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
        if (!this.state.workingSchedule)
            return;
        this.state.workingSchedule.fillRowfromPreference(this.state.group.getEmployees().at(-1).getId());
        this.scheduleController.createLiveSchedule(this.state.workingSchedule);
    });
    window.addEventListener('beforeunload', async (e) => {
        await this.saveAll();
        e.returnValue = false;
    });
}, _App_addNavbarControllers = function _App_addNavbarControllers() {
    navbarHandlers.forEach(({ itemId, ctorData }) => {
        const controller = new ModalController(ctorData.viewClass, ctorData.handlers, ctorData.onClose);
        this.navbarControllers.push(controller);
        const navItem = document.getElementById(itemId);
        if (!navItem)
            return;
        navItem.addEventListener('click', controller.show.bind(controller, this, {
            year: this.state.year,
            month: this.state.month,
        }));
    });
    document.getElementById('save').addEventListener('click', () => {
        console.log('?E');
        renderDialog('Zapisać zmiany?').then((res) => {
            if (!res)
                return;
            this.saveAll();
        });
    });
    document.getElementById('reset').addEventListener('click', () => {
        renderDialog('Reset spowoduje utratę obecnego grafiku przy kolejnym zapisie. Kontynuować?').then((res) => {
            if (!res)
                return;
            this.resetSchedule();
            this.scheduleController.createLiveSchedule(this.state.workingSchedule);
        });
    });
};
const app = new App();
