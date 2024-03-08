/**
 * @jest-environment jsdom
 */

import ScheduleController from '../../src/renderer/controllers/scheduleControllers/ScheduleController';
import CellsView from '../../src/renderer/views/scheduleViews/CellsView';
import { createMockView, arrangeTestSchedule } from '../testHelpers';

describe('scheduleController', () => {
  describe('renderRawCellData', () => {
    test('renders rawcelldata ', () => {
      const schedule = arrangeTestSchedule(2024, 2);
      const sut = new ScheduleController();
      const expected = schedule.exportJSON();

      substituteViews(sut);
      sut.renderRawCellData(expected);

      expect(sut.cellsView.data).toEqual(expected);
    });
    test('throws on undefined', () => {
      const sut = new ScheduleController();

      //@ts-ignore
      const actual = sut.renderRawCellData.bind(sut, undefined);
      expect(actual).toThrow();
    });
  });
  describe('selection', () => {
    test('day-row dataset points to correct CellData', () => {
      const schedule = arrangeTestSchedule(2024, 2);
      const sut = new ScheduleController();
      const row = 1;
      const day = 2;
      substituteViews(sut);
      sut.renderRawCellData(schedule.exportJSON());
      sut.select(row, day);

      expect(sut.selected?.id).toBe(
        schedule.getGroup().getEmployees()[row].getId()
      );
      expect(sut.selected?.day).toBe(day);
    });
  });
});

function substituteViews(controller: ScheduleController) {
  controller.cellsView = createMockView(CellsView);
}
