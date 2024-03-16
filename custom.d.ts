interface DarkMode extends Window {
  // Define your custom properties or methods here
  toggle: () => boolean;
  system: () => void;
}
interface DB extends Window {
  getAll: (collection: string) => unknown;
  getOne: (collection: string, id: number) => unknown;
  find: (collection: string, query: any) => unknown[];
  insert: (collection: string, data: any) => void;
  update: (collection: string, id: number, data: any) => void;
  delete: (collection: string, id: number) => void;
  saveDatabase: () => void;
}
interface Versions extends Window {
  node: () => string;
  chrome: () => string;
  electron: () => string;
}
// Augment the global window object with the custom interface
interface Window {
  // Use the custom interface
  darkMode: DarkMode;
  db: DB;
  versions: Versions;
}
