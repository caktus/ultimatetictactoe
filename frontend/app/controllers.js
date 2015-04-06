angular.module('TicTacToe.controllers', ['TicTacToe.factories'])
    .controller('AttractModeController', ['$scope', function($scope) {

    }])
    .controller('CreateGameController',
		['$scope', '$location', '$routeParams', 'gameService',
		 function($scope, $location, $routeParams, gameService) {
	console.log($routeParams);

        gameService.newGame($routeParams.mode)
            .then(function(game) {
                if (game.pk !== null) {
                    $location.path('/game/'+game.pk).replace();
                } else {
                    $location.path('/').replace();
                }
	    });
    }])
    .controller('GameController',
		['$scope', '$routeParams', 'gameService',
		 function($scope, $routeParams, gameService) {
	console.log($routeParams);
    }])
    .controller('LocalModeCtrl', ['$scope', '$location', '$http', 'tictactoe', 'initialState', 'api', 'player',
            function($scope, $location, $http, tictactoe, initialState, api, player) {
        $scope.endpoint = api.echoService;
        $scope.player = player;
        $scope.homepage = function() {
            $location.path('/');
        };

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
        };
        $scope.remote = false;
    }])
    .controller('ComputerModeCtrl', ['$scope', '$interval', '$http', 'tictactoe', 'initialState', 'api', 'player',
            function($scope, $interval, $http, tictactoe, initialState, api, player) {
        $scope.endpoint = api.aiService;
        $scope.player = player;
        $scope.game = initialState;
        $scope.remote = true;
        $scope.ai = true;
        $interval(function() {
            // get move from server
            if ($scope.game.currentPlayer != 1) {
                $http.get($scope.endpoint).success(function(data, status, headers, config) {
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
    }])
    .controller('RemoteModeCtrl', ['$scope', '$interval', '$http', 'tictactoe', 'initialState', 'api', 'player',
            function($scope, $interval, $http, tictactoe, initialState, api, player) {
        $scope.endpoint = api.echoService;
        $scope.player = player;
        $scope.game = initialState;
        $scope.remote = true;
        $interval(function() {
            // get move from server
            if ($scope.game.currentPlayer != $scope.player) {
                $http.get($scope.endpoint).success(function(data, status, headers, config) {
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
