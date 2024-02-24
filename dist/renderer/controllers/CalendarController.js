var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CalendarController_instances, _CalendarController_addListeners, _CalendarController_fetchPreviousTheme;
import Calendar from '../services/Calendar.js';
import { AbstractController } from './AbstractController.js';
class CalendarController extends AbstractController {
    constructor() {
        super();
        _CalendarController_instances.add(this);
        this.calendarElement = document.getElementById('calendar');
        this.calendar = new Calendar();
        __classPrivateFieldGet(this, _CalendarController_instances, "m", _CalendarController_addListeners).call(this);
    }
}
_CalendarController_instances = new WeakSet(), _CalendarController_addListeners = function _CalendarController_addListeners() {
    return;
}, _CalendarController_fetchPreviousTheme = async function _CalendarController_fetchPreviousTheme() {
    throw new Error('Not implemented yet');
};
export default CalendarController;
