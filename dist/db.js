"use strict";
const loki = require('lokijs');
//@ts-ignore
const db = new loki(`${__dirname}/scheduler.db`, {
    autoload: true,
    autoloadCallback: dbInit,
    autosave: true,
    autosaveInterval: 4000,
});
const collections = ['groups', 'employees', 'schedules', 'previous'];
// implement the autoloadback referenced in loki constructor
//@ts-ignore
function dbInit() {
    //Init collections
    collections.forEach((collection) => {
        if (!db.getCollection(collection)) {
            db.addCollection(collection);
        }
    });
}
module.exports.dbInit = dbInit;
module.exports.db = db;
module.exports = {
    db,
    dbInit,
    getAll: async function (collection) {
        try {
            return await db.getCollection(collection).find({});
        }
        catch (err) {
            console.error(err);
            return null;
        }
    },
    getOne: async function (collection, id) {
        try {
            const doc = await db.getCollection(collection).findOne({ id });
            return doc;
        }
        catch (err) {
            return null;
        }
    },
    find: async function (collection, query) {
        try {
            const doc = (await db.getCollection(collection)?.find(query)) ?? [];
            return doc;
        }
        catch (err) {
            console.error(err);
            return null;
        }
    },
    delete: async function (collection, id) {
        try {
            await db.getCollection(collection).findAndRemove({ id });
        }
        catch (err) {
            console.error(err);
        }
    },
    update: async function (collection, id, data) {
        try {
            db.getCollection(collection).findAndUpdate({ id }, (doc) => {
                Object.assign(doc, data);
            });
        }
        catch (err) {
            console.error(err);
        }
    },
    insert: async function (collection, data) {
        try {
            db.getCollection(collection).insert(data);
        }
        catch (err) {
            console.error(err);
        }
    },
};
