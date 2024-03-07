import { generateId } from '../helpers/generateId.js';
export default class Entity {
    constructor() {
        this.id = generateId();
    }
    getId() {
        return this.id;
    }
}
