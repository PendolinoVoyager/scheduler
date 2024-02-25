import Employee from './Employee';

export default class Group {
  id: number;
  private employees: Employee[] = [];
  constructor() {
    //TODO: Change ID generation
    this.id = Math.floor(Math.random() * 1000000);
  }
  addEmployee(employee: Employee) {
    this.employees.push(employee);
  }
  removeEmployee(id: number) {
    const index = this.findEmployeeIndex(id);
    if (index === undefined) return;
    this.employees.splice(index, 1);
  }
  findEmployee(id: number): Employee | undefined {
    return this.employees.find((emp) => emp.getId() === id);
  }
  findEmployeeIndex(id: number): number | undefined {
    return this.employees.findIndex((emp) => emp.getId() === id);
  }
  setEmployeeIndex(id: number, index: number) {
    if (index < 0) return;
  }
  getEmployees() {
    return this.employees;
  }
}
