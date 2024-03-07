interface IPCHandler {
  namespace: string;
  handlers: {
    action: string;
    cb: <T>(e: Event, data: T) => void;
  }[];
}
//TODO: Refactor somehow
const EXPOSED: IPCHandler[] = [
  {
    namespace: 'fs',
    handlers: [
      {
        action: 'writeEmployee',
        cb: () => {
          return;
        },
      },
      {
        action: 'writeGroup',
        cb: () => {
          return;
        },
      },
      {
        action: 'writeSchedule',
        cb: () => {
          return;
        },
      },
    ],
  },
];

module.exports = EXPOSED;
