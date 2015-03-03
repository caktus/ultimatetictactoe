angular.module('TicTacToe.controllers', [])
    .controller('AttractModeCtrl', ['$scope', function($scope) {

    }])
    .controller('VersusModeCtrl', ['$scope', function($scope) {
        $scope.game = {
            currentPlayer: 1,
            winner: null,
            players: {
                one: {
                    name: 'Player 1',
                    score: 0
                },
                two: {
                    name: 'Player 2',
                    score: 0
                }
            },
            boards: [
                {
                    status: 'available',
                    winner: null,
                    slots: [
                        [{state: null}, {state: null}, {state: null}],
                        [{state: null}, {state: null}, {state: null}],
                        [{state: null}, {state: null}, {state: null}]
                    ]
                },
                {
                    status: 'available',
                    winner: null,
                    slots: [
                        [{state: null}, {state: null}, {state: null}],
                        [{state: null}, {state: null}, {state: null}],
                        [{state: null}, {state: null}, {state: null}]
                    ]
                },
                {
                    status: 'available',
                    winner: null,
                    slots: [
                        [{state: null}, {state: null}, {state: null}],
                        [{state: null}, {state: null}, {state: null}],
                        [{state: null}, {state: null}, {state: null}]
                    ]
                },
                {
                    status: 'available',
                    winner: null,
                    slots: [
                        [{state: null}, {state: null}, {state: null}],
                        [{state: null}, {state: null}, {state: null}],
                        [{state: null}, {state: null}, {state: null}]
                    ]
                },
                {
                    status: 'available',
                    winner: null,
                    slots: [
                        [{state: null}, {state: null}, {state: null}],
                        [{state: null}, {state: null}, {state: null}],
                        [{state: null}, {state: null}, {state: null}]
                    ]
                },
                {
                    status: 'available',
                    winner: null,
                    slots: [
                        [{state: null}, {state: null}, {state: null}],
                        [{state: null}, {state: null}, {state: null}],
                        [{state: null}, {state: null}, {state: null}]
                    ]
                },
                {
                    status: 'available',
                    winner: null,
                    slots: [
                        [{state: null}, {state: null}, {state: null}],
                        [{state: null}, {state: null}, {state: null}],
                        [{state: null}, {state: null}, {state: null}]
                    ]
                },
                {
                    status: 'available',
                    winner: null,
                    slots: [
                        [{state: null}, {state: null}, {state: null}],
                        [{state: null}, {state: null}, {state: null}],
                        [{state: null}, {state: null}, {state: null}]
                    ]
                },
                {
                    status: 'available',
                    winner: null,
                    slots: [
                        [{state: null}, {state: null}, {state: null}],
                        [{state: null}, {state: null}, {state: null}],
                        [{state: null}, {state: null}, {state: null}]
                    ]
                }
            ]
        };
    }]);
