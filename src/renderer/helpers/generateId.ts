export function generateId(): number {
  const random = Math.floor(Math.random() * 100_000_000).toString();
  const timestamp = Date.now().toString().slice(8, 16);
  const id = +`${random}${timestamp}`.padEnd(16, '0');
  return id;
}
