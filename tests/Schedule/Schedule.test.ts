import Employee from '../../src/renderer/models/Employee';
import Group from '../../src/renderer/models/Group';
import { Schedule } from '../../src/renderer/models/Schedule';
import { CellData } from '../../src/renderer/models/ScheduleTypes';

describe('Schedule', () => {
  test('Cells fill properly on init', () => {
    const group = createGroup(10);
    const year = 2024;
    const month = 12;
    const sut = createSchedule(group, year, month);

    expect(sut.cells.length).toBe(10);
    sut.cells.forEach((cellArray) => {
      expect(cellArray.length).toBe(31);
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
