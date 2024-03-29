import { CONFIG } from '../src/renderer/config';
import { Schedule } from '../src/renderer/models/Schedule';
import { ScheduleValidatorC } from '../src/renderer/services/ScheduleValidator';
import { createGroup } from './testHelpers';
describe('ScheduleValidator', () => {
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
    describe('35h rest', () => {
      test.each([
        {
          shifts: [
            { startTime: 5, endTime: 14 },
            { startTime: 5, endTime: 14 },
            { startTime: 5, endTime: 14 },
            { startTime: 5, endTime: 14 },
            { startTime: 5, endTime: 14 },
            { startTime: 5, endTime: 14 },
            { startTime: 5, endTime: 14 },
          ],
          expected: CONFIG.WORK_LAWS.MIN_WEEK_REST < 15 ? null : 'truthy',
        },
        {
          shifts: [
            { startTime: undefined, endTime: undefined },
            { startTime: 5, endTime: 14 },
            { startTime: 5, endTime: 14 },
            { startTime: 5, endTime: 14 },
            { startTime: 5, endTime: 14 },
            { startTime: 5, endTime: 14 },
            { startTime: 5, endTime: 14 },
          ],
          expected: CONFIG.WORK_LAWS.MIN_WEEK_REST < 29 ? null : 'truthy',
        },
        {
          shifts: [
            { startTime: 14, endTime: 23 },
            { startTime: undefined, endTime: undefined },
            { startTime: 5, endTime: 24 },
            { startTime: 5, endTime: 14 },
            { startTime: 5, endTime: 14 },
            { startTime: 5, endTime: 14 },
            { startTime: 5, endTime: 14 },
          ],
          expected: CONFIG.WORK_LAWS.MIN_WEEK_REST < 30 ? null : 'truthy',
        },
        {
          shifts: [
            { startTime: 5, endTime: 14 },
            { startTime: undefined, endTime: undefined },
            { startTime: 5, endTime: 14 },
            { startTime: 5, endTime: 14 },
            { startTime: 5, endTime: 14 },
            { startTime: 5, endTime: 14 },
            { startTime: 5, endTime: 14 },
          ],
          expected: CONFIG.WORK_LAWS.MIN_WEEK_REST < 39 ? null : 'truthy',
        },
      ])('7 shifts return $expected', ({ shifts, expected }) => {
        const group = createGroup(1);
        const schedule = new Schedule(group, 2024, 2);
        const sut = new ScheduleValidatorC();
        shifts.forEach(({ startTime, endTime }, i) => {
          schedule.getCells()[0][i].startTime = startTime;
          schedule.getCells()[0][i].endTime = endTime;
        });
        if (expected) {
          expect(
            sut.validators
              .find((val) => val.name === '35h rest')
              ?.validator(schedule.getCells()[0].slice(0, 7))
          ).toBeTruthy();
        } else {
          expect(
            sut.validators
              .find((val) => val.name === '35h rest')
              ?.validator(schedule.getCells()[0].slice(0, 7))
          ).toBeNull();
        }
      });
    });
    describe('7h disabled', () => {
      test.each([
        { startTime: 5, endTime: 14, expected: 'truthy' },
        { startTime: 5, endTime: 12, expected: null },
        { startTime: undefined, endTime: undefined, expected: null },
      ])(
        'shift $startTime to $endTime returns $expected',
        ({ startTime, endTime, expected }) => {
          const group = createGroup(1);
          const schedule = new Schedule(group, 2024, 2);
          const sut = new ScheduleValidatorC();
          const cells = schedule.getCells()[0][0];
          cells.startTime = startTime;
          cells.endTime = endTime;

          if (expected) {
            expect(
              sut.validators
                .find((val) => val.name === '7h disabled')
                ?.validator([cells])
            ).toBeTruthy();
          } else {
            expect(
              sut.validators
                .find((val) => val.name === '7h disabled')
                ?.validator([cells])
            ).toBeNull();
          }
        }
      );
    });

    describe('35h disabled', () => {
      test.each([
        {
          shifts: [
            { startTime: 5, endTime: 14 },
            { startTime: 5, endTime: 14 },
            { startTime: 5, endTime: 14 },
            { startTime: 5, endTime: 14 },
            { startTime: 5, endTime: 14 },
            { startTime: 5, endTime: 14 },
            { startTime: 5, endTime: 14 },
          ],
          expected: 'truthy',
        },
        {
          shifts: [
            { startTime: 5, endTime: 12 },
            { startTime: 5, endTime: 12 },
            { startTime: 5, endTime: 12 },
            { startTime: 5, endTime: 12 },
            { startTime: 5, endTime: 12 },
            { startTime: undefined, endTime: undefined },
            { startTime: undefined, endTime: undefined },
          ],
          expected: null,
        },
        {
          shifts: [
            { startTime: 5, endTime: 12 },
            { startTime: 5, endTime: 12 },
            { startTime: 5, endTime: 12 },
            { startTime: 5, endTime: 12 },
            { startTime: 5, endTime: 13 },
            { startTime: undefined, endTime: undefined },
            { startTime: undefined, endTime: undefined },
          ],
          expected: 'truthy',
        },
      ])('7 shifts return $expected', ({ shifts, expected }) => {
        const group = createGroup(1);
        const schedule = new Schedule(group, 2024, 2);
        const sut = new ScheduleValidatorC();
        shifts.forEach(({ startTime, endTime }, i) => {
          schedule.getCells()[0][i].startTime = startTime;
          schedule.getCells()[0][i].endTime = endTime;
        });
        if (expected) {
          expect(
            sut.validators
              .find((val) => val.name === '35h disabled')
              ?.validator(schedule.getCells()[0].slice(0, 7))
          ).toBeTruthy();
        } else {
          expect(
            sut.validators
              .find((val) => val.name === '35h disabled')
              ?.validator(schedule.getCells()[0].slice(0, 7))
          ).toBeNull();
        }
      });
    });
    describe('month summary', () => {
      test.each([
        { startTime: 5, endTime: 13, expected: null },
        { startTime: 5, endTime: 14, expected: 'truthy' },
      ])(
        '$startTime to $endTime returns $expected',
        ({ startTime, endTime, expected }) => {
          const group = createGroup(1);
          const schedule = new Schedule(group, 2024, 2);
          const sut = new ScheduleValidatorC();

          schedule.getCells()[0].forEach((cell) => {
            cell.startTime = startTime;
            cell.endTime = endTime;
          });
          if (expected) {
            expect(
              sut.validators
                .find((val) => val.name === 'month summary')
                ?.validator(schedule.getCells()[0])
            ).toBeTruthy();
          } else {
            expect(
              sut.validators
                .find((val) => val.name === 'month summary')
                ?.validator(schedule.getCells()[0])
            ).toBeNull();
          }
        }
      );
    });
  });
});
