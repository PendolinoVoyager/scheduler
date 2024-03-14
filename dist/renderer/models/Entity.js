import { generateId } from '../helpers/generateId.js';
export default class Entity {
    constructor() {
        this.collection = 'entities';
        this.id = generateId();
    }
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
    exportJSON() {
        return { data: 'Not implemented' };
    }
}
