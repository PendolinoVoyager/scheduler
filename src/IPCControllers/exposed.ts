// interface IPCHandler {
//   namespace: string;
//   handlers: {
//     action: string;
//     cb: <T>(e: Event, data: T) => void;
//   }[];
// }
// //TODO: Refactor somehow
// const EXPOSED: IPCHandler[] = [
//   {
//     namespace: 'fs',
//     handlers: [
//       {
//         action: 'write',
//         cb: (e: Event, data: { collection: string; id: number }) => {
//           return;
//         },
//       },
//     ],
//   },
// ];

// module.exports = EXPOSED;
