const loki = require('lokijs');
//@ts-ignore
const db = new loki(`${__dirname}/scheduler.db`, {
  autoload: true,
  autoloadCallback: dbInit,
  autosave: true,
  autosaveInterval: 4000,
});
const collections = ['groups', 'employees', 'schedules'] as const;
type CollectionName = (typeof collections)[number];
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
  getAll: async function (collection: CollectionName) {
    try {
      return await db.getCollection(collection).find({});
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  getOne: async function (collection: CollectionName, id: number) {
    try {
      const doc = await db.getCollection(collection).findOne({ id });
      if (doc == null) throw new Error('404');
      return doc;
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  remove: async function (collection: CollectionName, id: number) {
    try {
      await db.getCollection(collection).findAndRemove({ id });
    } catch (err) {
      console.error(err);
    }
  },
  update: async function (
    collection: CollectionName,
    id: number,
    data: Object
  ) {
    try {
      db.getCollection(collection).findAndUpdate({ id }, data);
    } catch (err) {
      console.error(err);
    }
  },
  insert: async function (collection: CollectionName, data: Object) {
    try {
      db.getCollection(collection).insert(data);
    } catch (err) {
      console.error(err);
    }
  },
};
