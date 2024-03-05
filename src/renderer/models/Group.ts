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
    if (index == null) return;
    this.employees.splice(index, 1);
  }
  sort(order: 'ascending' | 'descending' = 'ascending') {
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
  moveEmployee(employee: Employee, index: number) {
    const targetIndex = Math.max(Math.min(this.employees.length, index), 0);
    const employeeIndex = this.findEmployeeIndex(employee.getId());
    if (employeeIndex == null) return;
    const newArray = this.employees.filter((emp) => emp !== employee);
    const adjustedTargetIndex =
      targetIndex > employeeIndex ? targetIndex - 1 : targetIndex;
    this.employees = [
      ...newArray.slice(0, adjustedTargetIndex),
      employee,
      ...newArray.slice(adjustedTargetIndex),
    ];
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
