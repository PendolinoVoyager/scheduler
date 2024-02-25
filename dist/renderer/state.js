import Employee from './models/Employee.js';
import Group from './models/Group.js';
import { ShiftType } from './models/types.js';
const testGroup = new Group();
testGroup.addEmployee(new Employee('Anna Nowa', {
    shiftPreference: ShiftType.Afternoon,
    position: 'Kierownik',
}));
testGroup.addEmployee(new Employee('Jan Dupa'));
testGroup.addEmployee(new Employee('Tadeusz Kościuszko'));
testGroup.addEmployee(new Employee('Jacek Bawełna'));
testGroup.addEmployee(new Employee('Pan Kierownik'));
const state = {
    group: testGroup,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
};
export default state;
