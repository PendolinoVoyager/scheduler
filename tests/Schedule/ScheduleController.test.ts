/**
 * @jest-environment jsdom
 */

import ScheduleController from '../../src/renderer/controllers/scheduleControllers/ScheduleController';
import { MockView, arrangeTestSchedule } from '../testHelpers';

describe('scheduleController', () => {
  describe('renderRawCellData', () => {
    it('should render data correctly', () => {
      const schedule = arrangeTestSchedule(2024, 2);
      const sut = new ScheduleController();
      const expected = schedule.exportJSON();

      sut.renderRawCellData(expected);

      expect(sut.cellsView.data).toEqual(expected);
    });
    it('throws on undefined', () => {
      const sut = new ScheduleController();
      //@ts-ignore
      const actual = sut.renderRawCellData.bind(sut, undefined);
      expect(actual).toThrow();
    });
  });
});
