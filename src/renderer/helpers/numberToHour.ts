export function numberToHour(time: number | undefined) {
  if (time == null) return '';
  const decimal = (time - Math.floor(time)) * 60;
  return Intl.DateTimeFormat(navigator.language, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(1, 0, 1, time, decimal));
}

export function hourToNumber(time: string) {
  const res = time.split(':').map(Number);

  return res[0] + res[1] / 60;
}
