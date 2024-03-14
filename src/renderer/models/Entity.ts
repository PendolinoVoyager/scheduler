import { generateId } from '../helpers/generateId.js';

export default class Entity {
  protected id: number;
  public collection: string = 'entities';
  constructor() {
    this.id = generateId();
  }
  getId() {
    return this.id;
  }
  setId(id: number) {
    this.id = id;
  }
  exportJSON(): unknown {
    return { data: 'Not implemented' };
  }
}
