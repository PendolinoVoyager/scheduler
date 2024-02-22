import { dupa } from './module.js';
console.log(dupa);
document
    .getElementById('toggle-dark-mode')
    .addEventListener('click', async () => {
    const isDarkMode = await window.darkMode.toggle();
});
