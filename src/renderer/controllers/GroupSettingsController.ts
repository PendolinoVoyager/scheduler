import ModalService from '../services/ModalService.js';
import { AbstractController } from './AbstractController.js';
import GroupSettingsView from '../views/groupSettingsViews/GroupSettingsView.js';
import EmployeeView from '../views/groupSettingsViews/EmployeeView.js';
import Employee from '../models/Employee.js';
export default class GroupSettingsController extends AbstractController {
  public modalService: ModalService;
  public btnManageGroup: HTMLElement =
    document.getElementById('btn-manage-group')!;
  public groupSettingsView: GroupSettingsView;
  public employeeView: EmployeeView | undefined;
  public employeeForm: HTMLElement | undefined;
  constructor(modalService: ModalService) {
    super();
    this.modalService = modalService;
    this.groupSettingsView = new GroupSettingsView(
      modalService.getWriteableElement()
    );

    this.#addHandlers();
  }
  #addHandlers() {
    this.btnManageGroup.addEventListener('click', (e) => {
      this.modalService.open(this, false);
      this.groupSettingsView.render(null);
      this.#renderEmployeeStats();
    });
  }
  #renderEmployeeStats(employee?: Employee) {
    this.employeeForm = document.getElementById('employee-stats')!;
    this.employeeView = new EmployeeView(this.employeeForm);
    this.employeeView.render(null);
  }
  #onClose() {}
}
