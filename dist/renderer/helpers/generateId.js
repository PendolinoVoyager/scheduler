export function generateId() {
    const random = Math.floor(Math.random() * 100000000).toString();
    const timestamp = Date.now().toString().slice(8, 16);
    const id = +`${random}${timestamp}`.padEnd(16, '0');
    return id;
}
