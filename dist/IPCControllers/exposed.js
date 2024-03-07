"use strict";
//TODO: Refactor somehow
const EXPOSED = [
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
