export function daySpanFromForm(begin: string, end: string) {
  const arr = [];
  const currentDate = new Date(begin);
  const endDate = new Date(end);
  if (endDate < currentDate) throw new Error('Bad request.');
  while (currentDate <= endDate) {
    arr.push({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate(),
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return arr;
}
