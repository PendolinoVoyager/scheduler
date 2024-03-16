import { App } from '../../app.js';
import { renderDialog } from '../../helpers/yesNoDialog.js';
import ModalService from '../../services/ModalService.js';
import SelectMonthView from '../../views/navbarViews/SelectMonthView.js';
const navbarHandlers = [
    {
        itemId: 'select-month',
        ctorData: {
            viewClass: SelectMonthView,
            handlers: [
                {
                    target: `form[name="change-month"]`,
                    eventType: 'submit',
                    cb: async function (e) {
                        if (!(this instanceof App))
                            throw new Error('Something went wrong!');
                        e.preventDefault();
                        const form = document.querySelector('form[name="change-month"]');
                        const formData = new FormData(form);
                        const [year, month] = Object.fromEntries(formData.entries())
                            .date.toString()
                            .split('-');
                        if (month == null || year == null)
                            return;
                        const res = await renderDialog('Zmienić grafik? Pamiętaj o zapisaniu swojej pracy.');
                        if (!res)
                            return;
                        this.selectDate(+year, +month);
                        await ModalService.requestClose();
                    },
                },
            ],
        },
    },
];
export default navbarHandlers;
