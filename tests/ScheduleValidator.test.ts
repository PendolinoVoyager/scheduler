import { Schedule } from '../src/renderer/models/Schedule';
import { ScheduleValidatorC } from '../src/renderer/services/ScheduleValidator';
import { arrangeTestSchedule, createGroup } from './testHelpers';
describe('ScheduleValidator', () => {
  describe('getStats', () => {
    test('should calculate workingDays', () => {
      const schedule = arrangeTestSchedule(2024, 2);
      const sut = new ScheduleValidatorC();
      const expected = 25;

      schedule.disableFreeDaysInPoland();
      const { workingDays: actual } = sut.getStats(schedule);

      expect(actual).toBe(expected);
    });
    describe('calculates worked hours', () => {
      test.each([
        { startTime: 2, endTime: 3, expected: 29 },
        { startTime: undefined, endTime: undefined, expected: 0 },
        { startTime: 1, endTime: undefined, expected: 0 },
        { startTime: 3, endTime: 2, expected: 29 * 23 },
      ])(
        '$startTime to $endTime for 29 days returns $expected',
        ({ startTime, endTime, expected }) => {
          const group = createGroup(1);
          const schedule = new Schedule(group, 2024, 2);
          const sut = new ScheduleValidatorC();

          schedule.getCells()[0].forEach((cell) => {
            schedule.updateCell(cell.id, cell.day, {
              shiftType: 'Custom',
              startTime,
              endTime,
            });
          });
          schedule.disableFreeDaysInPoland();
          const { hours: actual } = sut.getStats(schedule);

          expect(actual).toBe(expected);
        }
      );
    });
  });
  describe('validators', () => {
    describe('11h rest', () => {
      test.each([
        { endTime: 23, startTime: 10, expected: null },
        { endTime: 23, startTime: 14, expected: null },
        { endTime: 20, startTime: 5, expected: 'truthy' },
        { endTime: undefined, startTime: undefined, expected: null },
        { endTime: undefined, startTime: 5, expected: null },
        { endTime: 23, startTime: undefined, expected: null },
      ])(
        'ending shift $endTime and start $startTime returns $expected',
        ({ startTime, endTime, expected }) => {
          const group = createGroup(1);
          const employee = group.getEmployees()[0];
          const schedule = new Schedule(group, 2024, 2);
          const sut = new ScheduleValidatorC();

          schedule.getCell(employee.getId(), 1).endTime = endTime;
          schedule.getCell(employee.getId(), 2).startTime = startTime;
          const cells = [
            schedule.getCell(employee.getId(), 1),
            schedule.getCell(employee.getId(), 2),
          ];
          if (expected) {
            expect(
              sut.validators
                .find((val) => val.name === '11h rest')
                ?.validator(cells)
            ).toBeTruthy();
          } else {
            expect(
              sut.validators
                .find((val) => val.name === '11h rest')
                ?.validator(cells)
            ).toBeNull();
          }
        }
      );
    });
  });
});
