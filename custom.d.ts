interface DarkMode extends Window {
  // Define your custom properties or methods here
  toggle: () => boolean;
  system: () => void;
}
interface FS extends Window {
  getAll: (collection: string) => unknown;
  getOne: (collection: string, id: number) => unknown;
  insert: (collection: string, data: Object) => void;
  update: (collection: string, id: number, data: Object) => void;
  delete: (collection: string, id: number) => void;
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
  fs: FS;
  versions: Versions;
}
