angular.module('TicTacToe.constants', [])
    .constant('initialState', {
        currentPlayer: 1,
        winner: null,
        players: {
            one: {
                name: 'Caktus Group',
                score: 0
            },
            two: {
                name: 'Astro Code School',
                score: 0
            }
        },
        boards: [
            [{
                status: 'available',
                winner: null,
                rowIndex: 0,
                columnIndex: 0,
                slots: [
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}]
                ]
            },
            {
                status: 'available',
                winner: null,
                rowIndex: 0,
                columnIndex: 1,
                slots: [
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}]
                ]
            },
            {
                status: 'available',
                winner: null,
                rowIndex: 0,
                columnIndex: 2,
                slots: [
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}]
                ]
            }],
            [{
                status: 'available',
                winner: null,
                rowIndex: 1,
                columnIndex: 0,
                slots: [
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}]
                ]
            },
            {
                status: 'available',
                winner: null,
                rowIndex: 1,
                columnIndex: 1,
                slots: [
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}]
                ]
            },
            {
                status: 'available',
                winner: null,
                rowIndex: 1,
                columnIndex: 2,
                slots: [
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}]
                ]
            }],
            [{
                status: 'available',
                winner: null,
                rowIndex: 2,
                columnIndex: 0,
                slots: [
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}]
                ]
            },
            {
                status: 'available',
                winner: null,
                rowIndex: 2,
                columnIndex: 1,
                slots: [
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}]
                ]
            },
            {
                status: 'available',
                winner: null,
                rowIndex: 2,
                columnIndex: 2,
                slots: [
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}],
                    [{state: null}, {state: null}, {state: null}]
                ]
            }]
        ]
    });
