var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GroupSettingsView_instances, _GroupSettingsView_generateEmployeeItem;
import View from '../View.js';
class GroupSettingsView extends View {
    constructor(parentElement) {
        super(parentElement);
        _GroupSettingsView_instances.add(this);
        this.data = [];
    }
    generateMarkup() {
        return `
    <h1 class="text-gradient">Zarządzaj grupą pracowników</h1>

    <div id="employee-container">
        <ul id="employee-list">

            ${this.data.map(__classPrivateFieldGet(this, _GroupSettingsView_instances, "m", _GroupSettingsView_generateEmployeeItem)).join('<br>')}

            <li id="employee-list-add" class="box-sharp">
                <i class="fas fa-plus"></i>
            </li>
        </ul>

        <div id="employee-stats-container">

        
  
        </div>
          
    </div>
    `;
    }
}
_GroupSettingsView_instances = new WeakSet(), _GroupSettingsView_generateEmployeeItem = function _GroupSettingsView_generateEmployeeItem(employee) {
    return `
    <li class="employee-item" data-id=${employee.getId()}>
                <div class="flex-row space-between">
                  <div class="flex-column">
                    <p class="employee-name">${employee.getName()}</p>
                    <p class="employee-position">${employee.getPosition() || 'Brak stanowiska'}</p>
                  </div>
                    <button class="box-sharp" id="btn-remove-employee" data-id="${employee.getId()}">
                    <i class="fas fa-trash"></i>
                    </button>
                </div>

      </li>
    
    `;
};
export default GroupSettingsView;
