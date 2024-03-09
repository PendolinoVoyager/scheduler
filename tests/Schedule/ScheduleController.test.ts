/**
 * @jest-environment jsdom
 */

import { CONFIG } from '../../src/renderer/config';
import ScheduleController from '../../src/renderer/controllers/scheduleControllers/ScheduleController';
import { CellData, ExcludeId } from '../../src/renderer/models/types';
import CellsView from '../../src/renderer/views/scheduleViews/CellsView';
import { createMockView, arrangeTestSchedule } from '../testHelpers';
import { getShiftHours } from '../../src/renderer/helpers/getShiftHours';

describe('scheduleController', () => {
  describe('renderRawCellData', () => {
    test('renders rawcelldata ', () => {
      const schedule = arrangeTestSchedule(2024, 2);
      const sut = createScheduleController();
      const expected = schedule.exportJSON();

      sut.renderRawCellData(expected);

      expect(sut.cellsView.data).toEqual(expected);
    });
    test('throws on undefined', () => {
      const sut = createScheduleController();

      //@ts-ignore
      const actual = sut.renderRawCellData.bind(sut, undefined);
      expect(actual).toThrow();
    });
  });
  describe('selection', () => {
    test('day-row dataset points to correct CellData', () => {
      const schedule = arrangeTestSchedule(2024, 2);
      const sut = createScheduleController();
      const row = 1;
      const day = 2;
      sut.renderRawCellData(schedule.exportJSON());
      sut.select(row, day);

      expect(sut.selected?.id).toBe(
        schedule.getGroup().getEmployees()[row].getId()
      );
      expect(sut.selected?.day).toBe(day);
    });
  });
  describe('updateSelected', () => {
    test('given other shiftType assigns proper hours', () => {
      const schedule = arrangeTestSchedule(2024, 2);
      const sut = createScheduleController();
      sut.workingSchedule = schedule;
      const row = 2;
      const day = 10;
      const dayOfWeek = new Date(2024, 1, day).getDay();
      const newShiftType = Object.keys(CONFIG.SHIFT_TYPES)[1];
      const { startTime: expectedStartTime, endTime: expectedEndTime } =
        getShiftHours(newShiftType, dayOfWeek);
      const newCell: Partial<ExcludeId<CellData>> = {
        shiftType: newShiftType,
      };

      sut.renderRawCellData(schedule.exportJSON());
      sut.select(row, day);
      sut.updateSelected(newCell);

      expect(sut.selected!.shiftType).toBe(newShiftType);
      expect(sut.selected!.startTime).toBe(expectedStartTime);
      expect(sut.selected!.endTime).toBe(expectedEndTime);
    });
    test('given customHours changes to custom shiftType', () => {
      const schedule = arrangeTestSchedule(2024, 2);
      const sut = createScheduleController();
      sut.workingSchedule = schedule;
      const row = 2;
      const day = 10;
      const newCell: Partial<ExcludeId<CellData>> = {
        startTime: 1,
        endTime: 2,
      };

      sut.renderRawCellData(schedule.exportJSON());
      sut.select(row, day);
      sut.updateSelected(newCell);
      expect(sut.selected?.shiftType).toBe('Custom');
    });

    test('given "None" shift type changes to no hours', () => {
      const schedule = arrangeTestSchedule(2024, 2);
      const sut = createScheduleController();
      sut.workingSchedule = schedule;
      const row = 2;
      const day = 10;
      const newCell: Partial<ExcludeId<CellData>> = {
        shiftType: 'None',
      };

      sut.renderRawCellData(schedule.exportJSON());
      sut.select(row, day);
      sut.updateSelected(newCell);
      expect(sut.selected?.shiftType).toBe('None');
      expect(sut.selected?.startTime).toBeUndefined();
    });
    test('updates view after updateSelected', () => {
      const schedule = arrangeTestSchedule(2024, 2);
      const sut = createScheduleController();
      const row = 2;
      const day = 10;
      const newCell: Partial<ExcludeId<CellData>> = {
        shiftType: 'None',
      };
      sut.createLiveSchedule(schedule);
      sut.select(row, day);
      sut.updateSelected(newCell);

      const element = [...sut.cellsView.parentElement.children].find(
        (child) =>
          //@ts-ignore
          +(child as HTMLElement).dataset.row === row &&
          //@ts-ignore
          +(child as HTMLElement).dataset.day === day
      );
      expect(element?.classList?.contains('none'));
    });
  });
  describe('disabled days', () => {
    test('select with disabled day throws', () => {
      const sut = createScheduleController();
      const schedule = arrangeTestSchedule(2024, 4);

      schedule.disableFreeDaysInPoland();
      sut.createLiveSchedule(schedule);
      const actual = sut.select.bind(sut, 0, schedule.getDisabledDays()[0]);

      expect(actual).toThrow();
    });
    test('disabled cells have disabled class', () => {
      const sut = createScheduleController();
      const schedule = arrangeTestSchedule(2024, 4);
      schedule.disableFreeDaysInPoland();
      sut.createLiveSchedule(schedule);
      const element = [...sut.cellsView.parentElement.children].find(
        //@ts-ignore
        (el) => +el.dataset.day === sut.scheduleData?.disabledDays[1]
      );
      expect(element?.classList.contains('disabled')).toBeTruthy();
    });
  });
});

export function createScheduleController() {
  const controller = new ScheduleController();
  controller.cellsView = createMockView(CellsView);
  controller.titleElement = document.createElement('h1');
  return controller;
}
