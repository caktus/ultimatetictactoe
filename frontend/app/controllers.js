angular.module('TicTacToe.controllers', [])
    .controller('AttractModeCtrl', ['$scope', function($scope, $routeParams) {

    }])
    .controller('VersusModeCtrl', ['$scope', '$routeParams', '$interval', '$http', 'tictactoe',
            function($scope, $routeParams, $interval, $http, tictactoe) {
        $scope.player = $routeParams.player || 1;
        $scope.game = {
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
        };
        $interval(function() {
            // get move from server
            if ($scope.game.currentPlayer != $scope.player) {
                var url = 'http://172.20.0.117:9000/api/move/?player=' + $scope.player;
                $http.get(url).success(function(data, status, headers, config) {
                    if (data.type == 'move') {
                        console.log(data);
                        tictactoe.move(
                            $scope.game,
                            parseInt(data.boardIndex),
                            parseInt(data.rowIndex),
                            parseInt(data.columnIndex)
                        );
                    } else {
                        console.log(data);
                    }
                });
            }
        }, 1000);
    }]);
