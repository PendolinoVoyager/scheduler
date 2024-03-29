import Entity from './Entity.js';
export default class Group extends Entity {
    constructor() {
        super();
        this.collection = 'groups';
        this.employees = [];
    }
    addEmployee(employee) {
        this.employees.push(employee);
    }
    removeEmployee(id) {
        const index = this.findEmployeeIndex(id);
        if (index == null)
            return;
        this.employees.splice(index, 1);
    }
    sort(order = 'ascending') {
        const modifier = order === 'ascending' ? 1 : -1;
        this.employees.sort((emp1, emp2) => {
            if (emp1.getName() < emp2.getName()) {
                return -1 * modifier;
            }
            if (emp1.getName() > emp2.getName()) {
                return 1 * modifier;
            }
            return 0;
        });
    }
    moveEmployee(employee, index) {
        const targetIndex = Math.max(Math.min(this.employees.length, index), 0);
        const employeeIndex = this.findEmployeeIndex(employee.getId());
        if (employeeIndex == null)
            return;
        const newArray = this.employees.filter((emp) => emp !== employee);
        const adjustedTargetIndex = targetIndex > employeeIndex ? targetIndex - 1 : targetIndex;
        this.employees = [
            ...newArray.slice(0, adjustedTargetIndex),
            employee,
            ...newArray.slice(adjustedTargetIndex),
        ];
    }
    findEmployee(id) {
        return this.employees.find((emp) => emp.getId() === id);
    }
    findEmployeeIndex(id) {
        return this.employees.findIndex((emp) => emp.getId() === id);
    }
    setEmployeeIndex(id, index) {
        if (index < 0)
            return;
    }
    exportJSON() {
        return {
            id: this.id,
            employees: this.employees.map((e) => e.getId()),
        };
    }
    getEmployees() {
        return this.employees;
    }
}
