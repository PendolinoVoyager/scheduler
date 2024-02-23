export default class GroupSettingsController {
  public btnManageGroup: HTMLElement =
    document.getElementById('btn-manage-group')!;
  constructor() {
    this.#addHandlers();
  }
  #addHandlers() {
    this.btnManageGroup.addEventListener('click', (e) => {});
  }
}
