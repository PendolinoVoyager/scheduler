import { CONFIG } from '../../src/renderer/config';
import Employee from '../../src/renderer/models/Employee';
import Group from '../../src/renderer/models/Group';
import { Schedule } from '../../src/renderer/models/Schedule';
import { ScheduleJSON } from '../../src/renderer/models/ScheduleTypes';

describe('Schedule', () => {
  describe('cells', () => {
    test('should fill properly on init', () => {
      const group = createGroup(10);
      const year = 2024;
      const month = 2;
      const sut = createSchedule(group, year, month);

      expect(sut.cells.length).toBe(10);
      sut.cells.forEach((cellArray) => {
        expect(cellArray.length).toBe(29);
      });
    });
    test('on negative month should throw', () => {
      const group = createGroup(10);
      const year = 2024;
      const month = -4;

      const sut = createSchedule.bind(null, group, year, month);
      expect(sut).toThrow();
    });
    test('fills properly from preference', () => {
      const newShift = Object.keys(CONFIG.SHIFT_TYPES)[0];
      const sut = arrangeTestSchedule();

      sut.group
        .getEmployees()[0]
        .addCustomPreference(sut.year, sut.month, 2, newShift);

      expect(
        sut.group.getEmployees()[0].getPreferenceForDay(sut.year, sut.month, 2)
      ).toBe(newShift);
      expect(
        sut.getCellData(sut.group.getEmployees()[0].getId(), 2).shiftType
      ).toBe(newShift);
    });
  });
  describe('validateColRow', () => {
    test('invalid employeeId throws', () => {
      const sut = arrangeTestSchedule();
      const actual = sut.validateColRow.bind(sut, -10, 2);
      expect(actual).toThrow();
    });
    test('invalid day throws', () => {
      const sut = arrangeTestSchedule();
      const id = sut.group.getEmployees()[0].getId();
      const actual1 = sut.validateColRow.bind(sut, id, 0);
      const actual2 = sut.validateColRow.bind(sut, id, 32);
      expect(actual1).toThrow();
      expect(actual2).toThrow();
    });
    test('invalid day and employeeId throws', () => {
      const sut = arrangeTestSchedule();
      const actual = sut.validateColRow.bind(sut, -10, -2);
      expect(actual).toThrow();
    });
    test("valid day and employeeId don't throw", () => {
      const sut = arrangeTestSchedule();
      const id = sut.group.getEmployees()[0].getId();
      const actual = sut.validateColRow.bind(sut, id, 10);
      expect(actual()).toBeUndefined();
    });
  });
  describe('updateCell', () => {
    test('updates shiftType', () => {
      const sut = arrangeTestSchedule();
      const employee = sut.group.getEmployees()[0];
      const newShift = Object.keys(CONFIG.SHIFT_TYPES)[0];

      sut.updateCell(employee.getId(), 2, { shiftType: newShift });

      expect(sut.getCellData(employee.getId(), 2).shiftType).toBe(newShift);
    });
    test('updates startTime and endTime', () => {
      const sut = arrangeTestSchedule();

      const employee = sut.group.getEmployees()[0];
      sut.updateCell(employee.getId(), 3, {
        startTime: 16,
        endTime: 22,
      });

      expect(sut.getCellData(employee.getId(), 3).startTime).toBe(16);
      expect(sut.getCellData(employee.getId(), 3).endTime).toBe(22);
    });
    test('throws on id update attempt', () => {
      const sut = arrangeTestSchedule();
      const employee = sut.group.getEmployees()[0];
      const actual = sut.updateCell.bind(sut, employee.getId(), 3, {
        // @ts-ignore
        id: 100,
      });
      expect(actual).toThrow();
    });
    test('throws on employee not found', () => {
      const sut = arrangeTestSchedule();
      const actual = sut.updateCell.bind(sut, -1, 2, {});
      expect(actual).toThrow();
    });
  });
  describe('disabling/enabling', () => {
    test('disables day', () => {
      const sut = arrangeTestSchedule();
      sut.disableDay(10);
      expect(sut.disabledDays.has(10)).toBeTruthy();
      expect(sut.getDisabledDays()[0]).toBe(10);
    });
    test('enables day', () => {
      const sut = arrangeTestSchedule();
      sut.disableDay(10);
      sut.enableDay(10);
      expect(sut.disabledDays.has(10)).toBeFalsy();
    });
  });
  describe('exporting', () => {
    test('exportJSON', () => {
      const group = createGroup(2);
      const emp1 = group.getEmployees()[0];
      const emp2 = group.getEmployees()[1];
      const sut = new Schedule(group, 2024, 2);
      const expected: ScheduleJSON = {
        archived: false,
        groupId: group.id,
        employees: [
          {
            id: emp1.getId(),
            name: emp1.getName(),
            position: emp1.getPosition(),
          },
          {
            id: emp2.getId(),
            name: emp2.getName(),
            position: emp2.getPosition(),
          },
        ],
        year: 2024,
        month: 2,
        length: 29,
        disabledDays: [],
        data: sut.cells,
      };
      const actual = sut.exportJSON();
      expect(actual).toStrictEqual(expected);
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
function arrangeTestSchedule(year: number = 2024, month: number = 2) {
  const group = createGroup(10);
  return new Schedule(group, year, month);
}
