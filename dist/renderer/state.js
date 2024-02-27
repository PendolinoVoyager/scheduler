import Employee from './models/Employee.js';
import Group from './models/Group.js';
import { ShiftType } from './models/types.js';
const testGroup = new Group();
testGroup.addEmployee(new Employee('Anna Nowa', {
    shiftPreference: ShiftType.Afternoon,
    position: 'Kierownik',
    disabled: true,
}));
testGroup.getEmployees()[0].addCustomPreference(2024, 2, 1, ShiftType.None);
testGroup.getEmployees()[0].addCustomPreference(2024, 2, 2, ShiftType.Training);
testGroup.getEmployees()[0].addCustomPreference(2024, 2, 3, ShiftType.Vacation);
testGroup.getEmployees()[0].addCustomPreference(2024, 2, 4, ShiftType.Custom);
testGroup.getEmployees()[0].addCustomPreference(2024, 2, 5, ShiftType.Morning);
testGroup.addEmployee(new Employee('Jan Dupa'));
testGroup.addEmployee(new Employee('Tadeusz Kościuszko'));
testGroup.addEmployee(new Employee('Jacek Bawełna'));
testGroup.addEmployee(new Employee('Pan Kierownik'));
const state = {
    group: testGroup,
    year: 0,
    month: 0,
};
export default state;
