"use strict";
const loki = require('lokijs');
//@ts-ignore
const db = new loki(`${__dirname}/scheduler.db`, {
    autoload: true,
    autoloadCallback: dbInit,
    autosave: true,
    autosaveInterval: 4000,
});
const collections = ['groups', 'employees', 'schedules'];
// implement the autoloadback referenced in loki constructor
//@ts-ignore
function dbInit() {
    //Init collections
    collections.forEach((collection) => {
        let entries = db.getCollection('entries');
        if (entries === null) {
            entries = db.addCollection('entries');
        }
    });
}
module.exports.dbInit = dbInit;
module.exports.db = db;
