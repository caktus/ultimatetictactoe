angular.module('TicTacToe.constants', [])
    .constant('initialState', {
        currentPlayer: 1,
        winner: null,
        players: {
            one: {
                name: 'Caktus',
                score: 0
            },
            two: {
                name: 'Astro',
                score: 0
            }
        },
        boards: [
            {
                status: 'available',
                winner: null,
                index: 1,
                slots: [
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}]
                ]
            },
            {
                status: 'available',
                winner: null,
                index: 2,
                slots: [
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}]
                ]
            },
            {
                status: 'available',
                winner: null,
                index: 3,
                slots: [
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}]
                ]
            },
            {
                status: 'available',
                winner: null,
                index: 4,
                slots: [
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}]
                ]
            },
            {
                status: 'available',
                winner: null,
                index: 5,
                slots: [
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}]
                ]
            },
            {
                status: 'available',
                winner: null,
                index: 6,
                slots: [
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}]
                ]
            },
            {
                status: 'available',
                winner: null,
                index: 7,
                slots: [
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}]
                ]
            },
            {
                status: 'available',
                winner: null,
                index: 8,
                slots: [
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}]
                ]
            },
            {
                status: 'available',
                winner: null,
                index: 9,
                slots: [
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}]
                ]
            }
        ]
    });
