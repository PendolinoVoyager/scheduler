import { CellData } from '../models/types';

export default function calcShiftHours(cellData: CellData): number {
  if (!cellData.endTime || !cellData.startTime) return 0;
  if (cellData.endTime < cellData.startTime) {
    return 24 - cellData.startTime + cellData.endTime;
  }
  return cellData.endTime - cellData.startTime;
}
