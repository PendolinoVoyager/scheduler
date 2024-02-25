export default class Group {
    constructor() {
        this.employees = [];
        //TODO: Change ID generation
        this.id = Math.floor(Math.random() * 1000000);
    }
    addEmployee(employee) {
        this.employees.push(employee);
    }
    removeEmployee(id) {
        const index = this.findEmployeeIndex(id);
        if (index === undefined)
            return;
        this.employees.splice(index, 1);
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
    getEmployees() {
        return this.employees;
    }
}
