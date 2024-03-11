import View from '../../views/View.js';
import SelectMonthView from '../../views/navbarViews/SelectMonthView.js';
import { Handler, ModalControllerConstructorData } from './ModalController.js';

const navbarHandlers: {
  itemId: string;
  ctorData: ModalControllerConstructorData<any>;
}[] = [
  {
    itemId: 'select-month',
    ctorData: { viewClass: SelectMonthView, handlers: [] },
  },
];

export default navbarHandlers;
