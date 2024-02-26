import Employee from './models/Employee.js';
import Group from './models/Group.js';
import { ShiftType } from './models/types.js';
interface State {
  group: Group;
  year: number;
  month: number;
}

const testGroup = new Group();
testGroup.addEmployee(
  new Employee('Anna Nowa', {
    shiftPreference: ShiftType.Afternoon,
    position: 'Kierownik',
    disabled: true,
  })
);
testGroup.addEmployee(new Employee('Jan Dupa'));
testGroup.addEmployee(new Employee('Tadeusz Kościuszko'));
testGroup.addEmployee(new Employee('Jacek Bawełna'));
testGroup.addEmployee(new Employee('Pan Kierownik'));
window.group = testGroup;
const state: State = {
  group: testGroup,
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
};
export default state;
