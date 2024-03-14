import { CONFIG } from '../../src/renderer/config';
import { getShiftHours } from '../../src/renderer/helpers/getShiftHours';
import Employee from '../../src/renderer/models/Employee';
import Group from '../../src/renderer/models/Group';
import { Schedule } from '../../src/renderer/models/Schedule';
import { ScheduleJSON } from '../../src/renderer/models/ScheduleTypes';
import { CellData } from '../../src/renderer/models/types';
import CalendarService from '../../src/renderer/services/CalendarService';
import {
  createGroup,
  createSchedule,
  arrangeTestSchedule,
} from '../testHelpers';

describe('Schedule', () => {
  describe('cells', () => {
    test('should fill properly on init', () => {
      const group = createGroup(10);
      const year = 2024;
      const month = 2;
      const sut = createSchedule(group, year, month);

      expect(sut.getCells().length).toBe(10);
      sut.getCells().forEach((cellArray) => {
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

      sut
        .getGroup()
        .getEmployees()[0]
        .addCustomPreference(sut.year, sut.month, 2, newShift);

      expect(
        sut
          .getGroup()
          .getEmployees()[0]
          .getPreferenceForDay(sut.year, sut.month, 2)
      ).toBe(newShift);
      expect(
        sut.getCell(sut.getGroup().getEmployees()[0].getId(), 2).shiftType
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
      const id = sut.getGroup().getEmployees()[0].getId();
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
      const id = sut.getGroup().getEmployees()[0].getId();
      const actual = sut.validateColRow.bind(sut, id, 10);
      expect(actual()).toBeUndefined();
    });
  });
  describe('updateCell', () => {
    test('updates shiftType', () => {
      const sut = arrangeTestSchedule();
      const employee = sut.getGroup().getEmployees()[0];
      const newShift = Object.keys(CONFIG.SHIFT_TYPES)[0];

      sut.updateCell(employee.getId(), 2, { shiftType: newShift });

      expect(sut.getCell(employee.getId(), 2).shiftType).toBe(newShift);
    });
    test('updates startTime and endTime', () => {
      const sut = arrangeTestSchedule();

      const employee = sut.getGroup().getEmployees()[0];
      sut.updateCell(employee.getId(), 3, {
        startTime: 16,
        endTime: 22,
      });

      expect(sut.getCell(employee.getId(), 3).startTime).toBe(16);
      expect(sut.getCell(employee.getId(), 3).endTime).toBe(22);
    });
    test('throws on id update attempt', () => {
      const sut = arrangeTestSchedule();
      const employee = sut.getGroup().getEmployees()[0];
      const actual = sut.updateCell.bind(sut, employee.getId(), 3, {
        // @ts-ignore
        id: -100,
      });
      expect(actual).toThrow();
    });
    test('throws on employee not found', () => {
      const sut = arrangeTestSchedule();
      const actual = sut.updateCell.bind(sut, -1, 2, {});
      expect(actual).toThrow();
    });
    test('calculates hours on non-custom shiftType', () => {
      const sut = arrangeTestSchedule();
      const employee = sut.getGroup().getEmployees()[0];
      const shift = Object.keys(CONFIG.SHIFT_TYPES)[1];
      const newCell: Partial<CellData> = {
        shiftType: shift,
      };
      const dow = CalendarService.getDOW(sut.year, sut.month, 1);
      sut.updateCell(employee.getId(), 1, newCell);
      const cell = sut.getCell(employee.getId(), 1);
      const { startTime: expectedStartTime, endTime: expectedEndTime } =
        getShiftHours(shift, dow);
      expect(cell.startTime).toBe(expectedStartTime);
      expect(cell.endTime).toBe(expectedEndTime);
      expect(cell.shiftType).toBe(shift);
    });
  });
  describe('disabling/enabling', () => {
    test('disables day', () => {
      const sut = arrangeTestSchedule();
      sut.disableDay(10);

      expect(sut.getDisabledDays()[0]).toBe(10);
    });
    test('enables day', () => {
      const sut = arrangeTestSchedule();
      sut.disableDay(10);
      sut.enableDay(10);
      expect(sut.getDisabledDays().includes(10)).toBeFalsy();
    });
    test('disalbeFreeDaysInPoland disables sundays', () => {
      const sut = arrangeTestSchedule();

      sut.disableFreeDaysInPoland();
      expect(sut.getDisabledDays().length).toBe(4);
      expect(sut.getDisabledDays()).toStrictEqual([4, 11, 18, 25]);
    });
  });
  describe('add/delete employee', () => {
    test('adding an employee adds cells row', () => {
      const sut = arrangeTestSchedule();
      sut.getGroup().addEmployee(new Employee('TEST'));
      sut.fillRowfromPreference(sut.getGroup().getEmployees().at(-1)!.getId());
      expect(sut.getCells().length).toBe(sut.getGroup().getEmployees().length);
    });
    test('deleting an employee deletes celldata from schedule', () => {
      const group = createGroup(10);
      const sut = new Schedule(group, 2024, 3);
      const row = 1;
      group.removeEmployee(group.getEmployees()[row].getId());
      sut.deleteRow(row);

      expect(sut.getCells().length).toBe(sut.getGroup().getEmployees().length);
      expect(sut.exportJSON().data.length).toBe(
        sut.getGroup().getEmployees().length
      );
    });

    test('updating an employee updates celldata', () => {
      const sut = arrangeTestSchedule();
      sut.getGroup().getEmployees()[0].setName('TEST TEST');
      expect(sut.exportJSON().employees[0].name).toBe('TEST TEST');
    });
    describe('assignCellData', () => {
      test('mismatch cells length gets trimmed', () => {
        const group = createGroup(10);
        let sut = new Schedule(group, 2024, 3);
        const oldCellData = sut.exportJSON().data;

        sut = new Schedule(group, 2024, 2);
        Schedule.assignCellData(sut, oldCellData);

        expect(sut.getCells()[0].length).toBe(29);
      });
      test('mismatch cells length gets filled from preference', () => {
        const group = createGroup(10);
        let sut = new Schedule(group, 2024, 2);
        const oldCellData = sut.exportJSON().data;

        sut = new Schedule(group, 2024, 3);
        Schedule.assignCellData(sut, oldCellData);

        expect(sut.getCells()[0].length).toBe(31);
        expect(sut.getCells()[0].at(-1)).toBeDefined();
      });
    });
  });
  describe('exporting', () => {
    test('exportJSON', () => {
      const group = createGroup(2);
      const emp1 = group.getEmployees()[0];
      const emp2 = group.getEmployees()[1];
      const sut = new Schedule(group, 2024, 2);
      sut.disableDay(1);
      const expected: ScheduleJSON = {
        groupId: group.getId(),
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
        disabledDays: [1],
        data: sut.getCells(),
      };
      const actual = sut.exportJSON();
      expect(actual).toStrictEqual(expected);
    });
  });
});
