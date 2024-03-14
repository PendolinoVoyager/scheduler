class EntityManagerC {
    constructor() { }
    async persist(collection, entity) {
        if (!window.db.getOne(collection, entity.getId()))
            await window.db.insert(collection, entity.exportJSON());
        else
            await window.db.update(collection, entity.getId(), entity.exportJSON());
    }
    async getOne(collection, id) {
        return await window.db.getOne(collection, id);
    }
    async find(collection, query) {
        return await window.db.find(collection, query);
    }
    async getAll(collection) {
        return await window.db.getAll(collection);
    }
}
export const EntityManager = new EntityManagerC();
