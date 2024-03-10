/**
 * @jest-environment jsdom
 */
import CellsView from '../../src/renderer/views/scheduleViews/CellsView';
import { arrangeTestSchedule, createMockView } from '../testHelpers';
import { createScheduleController } from '../testHelpers';

describe('scheduleMouseController', () => {
  test('click on cell selects cell in main controller', () => {
    const schedule = arrangeTestSchedule(2024, 2);
    const scheduleController = createScheduleController();
    scheduleController.cellsView = createMockView(CellsView);

    scheduleController.createLiveSchedule(schedule);

    //Employee [1]; day [2]
    const targetElement = [
      ...scheduleController.cellsView.parentElement.children,
    ][(schedule.length + 1) * 2 + 2];
    targetElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(scheduleController.selected).toBe(
      scheduleController.scheduleData!.data[1][1]
    );
  });
  test('click on header skips select', () => {
    const schedule = arrangeTestSchedule(2024, 2);
    const scheduleController = createScheduleController();
    scheduleController.cellsView = createMockView(CellsView);

    scheduleController.mouseController.boundHandlers.handleClick = jest.fn(
      () => {}
    );
    scheduleController.createLiveSchedule(schedule);

    const targetElement = [
      ...scheduleController.cellsView.parentElement.children,
    ][schedule.length - 2];
    targetElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(
      scheduleController.mouseController.boundHandlers.handleClick
    ).toHaveBeenCalled();
    expect(scheduleController.selected).toBeFalsy();
  });
  test('click on employee skips select', () => {
    const schedule = arrangeTestSchedule(2024, 2);
    const scheduleController = createScheduleController();
    scheduleController.cellsView = createMockView(CellsView);

    scheduleController.mouseController.boundHandlers.handleClick = jest.fn(
      () => {}
    );
    scheduleController.createLiveSchedule(schedule);

    //Employee [1]; day [2]
    const targetElement = [
      ...scheduleController.cellsView.parentElement.children,
    ][(schedule.length + 1) * 2];
    targetElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(
      scheduleController.mouseController.boundHandlers.handleClick
    ).toHaveBeenCalled();
    expect(scheduleController.selected).toBeFalsy();
  });
});
