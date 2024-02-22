import DarkModeController from './controllers/DarkModeController.js';
import Calendar from './models/Calendar.js';
import View from './views/View.js';
// import Employee from './models/employee.js';
class App {
  public darkModeController: DarkModeController;
  constructor() {
    this.darkModeController = new DarkModeController();
    const randomView = new View(document.getElementById('calendar')!);
    randomView.renderSpinner();
    this.#addDefaultListeners();
  }
  #addDefaultListeners() {
    window.addEventListener('beforeunload', (e) => {
      // Handle exiting using electron api
    });
  }
}
const app = new App();
