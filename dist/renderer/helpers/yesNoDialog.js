export async function renderDialog(prompt = 'Confirm?') {
    return new Promise((resolve, reject) => {
        document.body.insertAdjacentHTML('afterbegin', `
      <div class="overlayer"></div>
    <div class="dialog-container" id="dialog">
    <div id="message">${prompt}</div>
    <div class="dialog-buttons">
        <div role="button" id="yesButton" class="box-sharp">Tak</div>
        <div role="button" id="noButton" class="box-sharp">Nie</div>
    </div>
    </div>
    `);
        const dialogElement = document.querySelector('.dialog-container');
        const overlayer = document.querySelector('.overlayer');
        const yesButton = document.getElementById('yesButton');
        const noButton = document.getElementById('noButton');
        yesButton.addEventListener('click', () => {
            dialogElement.remove();
            overlayer.remove();
            resolve(true);
        });
        noButton.addEventListener('click', () => {
            dialogElement.remove();
            overlayer.remove();
            resolve(false);
        });
    });
}
