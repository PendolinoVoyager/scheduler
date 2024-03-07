import { generateId } from '../helpers/generateId.js';

export default class Entity {
  protected id: number;
  constructor() {
    this.id = generateId();
  }
  getId() {
    return this.id;
  }
}
