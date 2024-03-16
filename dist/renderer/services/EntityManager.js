import Employee from '../models/Employee.js';
import Group from '../models/Group.js';
import { Schedule } from '../models/Schedule.js';
class EntityManagerC {
    constructor() { }
    async persist(collection, entity) {
        const doc = await window.db.getOne(collection, entity.getId());
        if (!doc)
            await window.db.insert(collection, entity.exportJSON());
        else
            await window.db.update(collection, entity.getId(), entity.exportJSON());
    }
    async getOne(collection, id) {
        return await window.db.getOne(collection, id);
    }
    async find(collection, query) {
        return await window.db.find(collection, query);
    }
    async getAll(collection) {
        return await window.db.getAll(collection);
    }
    async recoverWhole(year, month) {
        const scheduleData = (await this.find('schedules', { year, month }));
        if (!scheduleData || !scheduleData[0])
            return { status: 'fail', scheduleJSON: null };
        const groupData = (await this.getOne('groups', scheduleData[0].groupId));
        if (!groupData)
            return {
                status: 'partial',
                scheduleJSON: scheduleData[0],
            };
        const group = new Group();
        group.setId(groupData.id);
        try {
            for (const empId of groupData.employees) {
                const emp = (await this.getOne('employees', empId));
                if (!emp)
                    throw new Error('No employee');
                group.addEmployee(Employee.recover(emp));
            }
        }
        catch (err) {
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
