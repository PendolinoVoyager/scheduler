import { ScheduleJSON } from '../../models/ScheduleTypes';
import View from '../View';

export default class CellsView extends View {
  public data!: ScheduleJSON;
  constructor(parentElement: HTMLElement) {
    super(parentElement);
  }
  generateMarkup(): string {
    return 'Not implemented';
  }
}
