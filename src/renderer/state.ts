import { CONFIG } from './config.js';
import Employee from './models/Employee.js';
import Group from './models/Group.js';
import { Schedule } from './models/Schedule.js';

interface State {
  group: Group;
  year: number;
  month: number;
  workingSchedule: Schedule | null;
}

const testGroup = new Group();
testGroup.addEmployee(
  new Employee('Anna Nowa', {
    shiftPreference: Object.keys(CONFIG.SHIFT_TYPES)[0],
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

const state: State = {
  group: testGroup,
  year: 0,
  month: 0,
  workingSchedule: null,
};

export default state;
