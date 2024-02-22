interface DarkMode extends Window {
  // Define your custom properties or methods here
  toggle: () => boolean;
  system: () => void;
}
interface FS extends Window {
  read: (name: string) => unknown;
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
