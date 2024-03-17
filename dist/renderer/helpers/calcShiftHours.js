export function calcShiftHours(cellData) {
    if (!cellData.endTime || !cellData.startTime)
        return 0;
    if (cellData.endTime < cellData.startTime) {
        return 24 - cellData.startTime + cellData.endTime;
    }
    return cellData.endTime - cellData.startTime;
}
export function calcRestTime(cells) {
    if (!cells[1].startTime && !cells[0].endTime)
        return 48;
    if (!cells[1].startTime)
        return 48 - cells[0].endTime;
    if (!cells[0].startTime && cells[1].startTime)
        return 24 + cells[1].startTime;
    const restTime = (cells[1].startTime - cells[0].endTime) % 24;
    return restTime >= 0 ? restTime : restTime + 24;
}
