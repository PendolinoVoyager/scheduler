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
  describe('validators', () => {});
});
