import DarkModeController from './controllers/DarkModeController.js';
import Employee from './models/Employee.js';

// import Employee from './models/employee.js';
class App {
  public darkModeController: DarkModeController;
  constructor() {
    this.darkModeController = new DarkModeController();
    const employee = new Employee('Anna', 1);
    employee.addCustomPreference(2024, 12, 23, 2);
    console.log(employee.getPreferencesForMonth(2024, 12));
    employee.updatePreference(2);
    employee.addCustomPreference(2024, 12, 23, 1);
    console.log(employee.getPreferencesForMonth(2024, 12));

    this.#addDefaultListeners();
  }
  #addDefaultListeners() {
    window.addEventListener('beforeunload', (e) => {
      // Handle exiting using electron api
    });
  }
}
const app = new App();
