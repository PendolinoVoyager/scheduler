import Employee from '../src/renderer/models/Employee';
import Group from '../src/renderer/models/Group';
import { Schedule } from '../src/renderer/models/Schedule';
import View from '../src/renderer/views/View';

export function createGroup(numEmployees: number) {
  const group = new Group();
  for (let i = 0; i < numEmployees; i++) {
    group.addEmployee(createEmployee());
  }
  return group;
}
export function createEmployee() {
  return new Employee('Random Random' + Math.floor(Math.random() * 1000));
}
export function createSchedule(group: Group, year: number, month: number) {
  return new Schedule(group, year, month);
}
export function arrangeTestSchedule(year: number = 2024, month: number = 2) {
  const group = createGroup(10);
  return new Schedule(group, year, month);
}

export function createMockView(view: any = View): View {
  const mockView = new view(document.createElement('div'));
  return mockView;
}
