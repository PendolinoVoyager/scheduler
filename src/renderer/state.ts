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
testGroup.getEmployees()[0].addCustomPreference(2024, 2, 1, ShiftType.None);
testGroup.getEmployees()[0].addCustomPreference(2024, 2, 2, ShiftType.Training);
testGroup.getEmployees()[0].addCustomPreference(2024, 2, 3, ShiftType.Vacation);
testGroup.getEmployees()[0].addCustomPreference(2024, 2, 4, ShiftType.Custom);
testGroup.getEmployees()[0].addCustomPreference(2024, 2, 5, ShiftType.Morning);

testGroup.addEmployee(new Employee('Jan Dupa'));
testGroup.addEmployee(new Employee('Tadeusz Kościuszko'));
testGroup.addEmployee(new Employee('Jacek Bawełna'));
testGroup.addEmployee(new Employee('Pan Kierownik'));

const state: State = {
  group: testGroup,
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
};
export default state;
