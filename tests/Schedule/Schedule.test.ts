import Employee from '../../src/renderer/models/Employee';
import Group from '../../src/renderer/models/Group';
import { Schedule } from '../../src/renderer/models/Schedule';
import { CellData } from '../../src/renderer/models/ScheduleTypes';

describe('Schedule', () => {
  describe('cells', () => {
    // test('should fill properly on init', () => {
    //   const group = createGroup(10);
    //   const year = 2024;
    //   const month = 2;
    //   const sut = createSchedule(group, year, month);

    //   expect(sut.cells.length).toBe(10);
    //   sut.cells.forEach((cellArray) => {
    //     expect(cellArray.length).toBe(29);
    //   });
    // });
    // test('on negative month should throw', () => {
    //   const group = createGroup(10);
    //   const year = 2024;
    //   const month = -4;

    //   const sut = createSchedule.bind(null, group, year, month);
    //   expect(sut).toThrow();
    // });
    test('fills properly from preference', () => {
      const group = createGroup(10);
      const year = 2024;
      const month = 2;
      //
      group.getEmployees()[0].addCustomPreference(year, month, 2, 'Afternoon');
      const sut = createSchedule(group, year, month);

      expect(group.getEmployees()[0].getPreferenceForDay(year, month, 2)).toBe(
        'Afternoon'
      );
      expect(
        sut.getCellData(group.getEmployees()[0].getId(), 2).shiftType
      ).toBe('Afternoon');
    });
  });
});

function createGroup(numEmployees: number) {
  const group = new Group();
  for (let i = 0; i < numEmployees; i++) {
    group.addEmployee(createEmployee());
  }
  return group;
}
function createEmployee() {
  return new Employee('Random Random' + Math.floor(Math.random() * 1000));
}
function createSchedule(group: Group, year: number, month: number) {
  return new Schedule(group, year, month);
}
