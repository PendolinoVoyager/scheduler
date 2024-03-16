import Employee from '../models/Employee.js';
import { EmployeeJSON } from '../models/EmployeeTypes.js';
import Entity from '../models/Entity.js';
import Group from '../models/Group.js';
import { Schedule } from '../models/Schedule.js';
import { ScheduleJSON } from '../models/ScheduleTypes.js';
type Status = 'fail' | 'partial' | 'success';
type RecoveryMessage = {
  status: Status;
  scheduleJSON: null | ScheduleJSON;
  recovered?: { schedule: Schedule; group: Group };
};
class EntityManagerC {
  constructor() {}
  async persist<T extends Entity>(collection: string, entity: T) {
    const doc = await window.db.getOne(collection, entity.getId());
    if (!doc) await window.db.insert(collection, entity.exportJSON());
    else
      await window.db.update(collection, entity.getId(), entity.exportJSON());
  }
  async getOne(collection: string, id: number) {
    return await window.db.getOne(collection, id);
  }
  async find(collection: string, query: any) {
    return await window.db.find(collection, query);
  }
  async getAll(collection: string) {
    return await window.db.getAll(collection);
  }
  async recoverWhole(year: number, month: number): Promise<RecoveryMessage> {
    const scheduleData = (await this.find('schedules', { year, month })) as
      | ScheduleJSON[]
      | null;
    if (!scheduleData || !scheduleData[0])
      return { status: 'fail', scheduleJSON: null };
    const groupData = (await this.getOne(
      'groups',
      scheduleData[0].groupId
    )) as {
      id: Entity['id'];
      employees: Entity['id'][];
    } | null;
    if (!groupData)
      return {
        status: 'partial',
        scheduleJSON: scheduleData[0],
      };
    const group = new Group();
    group.setId(groupData.id);
    try {
      for (const empId of groupData.employees) {
        const emp = (await this.getOne(
          'employees',
          empId
        )) as EmployeeJSON | null;
        if (!emp) throw new Error('No employee');
        group.addEmployee(Employee.recover(emp));
      }
    } catch (err) {
      return {
        status: 'partial',
        scheduleJSON: scheduleData[0],
      };
    }
    const schedule = new Schedule(group, year, month);
    schedule.recover(scheduleData[0]);
    return {
      status: 'success',
      scheduleJSON: scheduleData[0],
      recovered: { schedule, group },
    };
  }
}
export const EntityManager = new EntityManagerC();
