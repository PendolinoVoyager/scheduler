import { App } from '../../app.js';
import { renderDialog } from '../../helpers/yesNoDialog.js';
import ModalService from '../../services/ModalService.js';
import View from '../../views/View.js';
import SelectMonthView from '../../views/navbarViews/SelectMonthView.js';
import { Handler, ModalControllerConstructorData } from './ModalController.js';

const navbarHandlers: {
  itemId: string;
  ctorData: ModalControllerConstructorData<any>;
}[] = [
  {
    itemId: 'select-month',
    ctorData: {
      viewClass: SelectMonthView,
      handlers: [
        {
          target: `form[name="change-month"]`,
          eventType: 'submit',
          cb: async function (e: SubmitEvent) {
            if (!(this instanceof App))
              throw new Error('Something went wrong!');
            e.preventDefault();
            const form = document.querySelector(
              'form[name="change-month"]'
            )! as HTMLFormElement;
            const formData = new FormData(form);
            const [year, month] = Object.fromEntries(formData.entries())
              .date.toString()
              .split('-');
            if (month == null || year == null) return;

            await this.selectDate(+year, +month);
            await ModalService.requestClose();
          },
        },
      ],
    },
  },
];

export default navbarHandlers;
