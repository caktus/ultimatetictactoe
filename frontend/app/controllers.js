angular.module('TicTacToe.controllers', ['TicTacToe.factories'])
    .controller('AttractModeController', ['$scope', function($scope) {

    }])
    .controller('CreateGameController',
    ['$scope', '$location', '$routeParams', 'gameService', 'player',
        function($scope, $location, $routeParams, gameService, player) {
            gameService.newGame($routeParams.mode)
                .success(function(game) {
                    if (game.pk !== null) {
                        $location.path('/games/'+game.pk).replace();
                    } else {
                        $location.path('/').replace();
                    }
                })
                .error(function() {
                    // TODO: Handle error
                    $location.path('/').replace();
                });
    }])
    .controller('GameController', ['$scope', '$routeParams', '$interval', '$http', 'tictactoe', 'gameState', 'api', 'player',
        function($scope, $routeParams, $interval, $http, tictactoe, gameState, api, player) {
            console.log('new ai game');
            $scope.gameID = parseInt($routeParams.id);
            $scope.endpoint = 'http://localhost:8000/api/games/' + $scope.gameID + '/';
            // get initial game state
            $http.get($scope.endpoint).success(function(data) {
                if (data) {
                    $scope.player = (data.p1 == 'local') ? 1: 2;
                } else {
                    // TODO: handle error correctly
                    $scope.player = 1;
                }
            });
            $scope.game = gameState.get();
            $scope.remote = true;

            // pull in new moves from the other player
            $interval(function() {
                // get move from server
                if ($scope.game.currentPlayer != $scope.player) {
                    $http.get($scope.endpoint).success(function(data, status, headers, config) {
                        var move = eval(data.last_play),
                            state = eval(data.state),
                            next_player = state[state.length - 1];
                        if ((next_player == $scope.player) && move) {
                            tictactoe.move(
                                    $scope.game,
                                    move[0],
                                    move[1],
                                    move[2],
                                    move[3]
                                );
                        }
                    });
                }
            }, 2000);
        }])
    .controller('LocalModeCtrl', ['$scope', '$location', '$http', 'tictactoe', 'gameState', 'api', 'player',
            function($scope, $location, $http, tictactoe, gameState, api, player) {
        $scope.endpoint = api.echoService;
        console.log(player);
        $scope.player = (player == 'caktus')? 1:2;
        $scope.homepage = function() {
            $location.path('/');
        };
        $scope.game = gameState.get();
        $scope.remote = false;
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
