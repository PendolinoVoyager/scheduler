# Employee Scheduling App

Welcome to our Employee Scheduling App! This application is designed to simplify the process of scheduling employees for shifts.
## Initial release - only supports pre-defined shifts. If for some reason you want to use this app change shifts in config.ts in src/renderer/ directory. 

## Features

- **Shift Management:** Easily create, edit, and assign shifts to employees.
- **Manage Employees:** Add, remove and change info about employees.
- **Automatic Validation:** The app validates if the shifts are compliant with Polish work law.
- **Analytics:** Simple calculations on total, individual, working hours for quick preview.

## Installation
**Requirements** node.js, npm and other dependencies needed for building the app. I'm not providing executables.

To install the  Scheduler App, follow these steps:
1. Clone the repository to your local machine:
  git clone https://github.com/PendolinoVoyager/scheduler.git
2. Install dependencies:
  npm install
3. Start
  npm start

##  Building
Uses electron-forge and electron-packager. Simply use the script: npm run make and search in 'out' directory.

## License
Feel free to use, distribute and modify, just keep the license.
