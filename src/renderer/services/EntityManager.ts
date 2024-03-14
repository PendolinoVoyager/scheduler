import Entity from '../models/Entity.js';

class EntityManagerC {
  constructor() {}
  async persist<T extends Entity>(collection: string, entity: T) {
    if (!window.db.getOne(collection, entity.getId()))
      await window.db.insert(collection, entity.exportJSON());
    else
      await window.db.update(collection, entity.getId(), entity.exportJSON());
  }
  async getOne(collection: string, id: number) {
    return await window.db.getOne(collection, id);
  }
  async find(collection: string, query: any) {
    return await window.db.find(collection, query);
  }
  async getAll(collection: string) {
    return await window.db.getAll(collection);
  }
}
export const EntityManager = new EntityManagerC();
