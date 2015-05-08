angular.module('TicTacToe.controllers', ['TicTacToe.factories'])
    .controller('AttractModeController', ['$scope', function($scope) {

    }])
    .controller('CreateGameController',
    ['$scope', '$location', '$routeParams', 'gameService', 'player',
        function($scope, $location, $routeParams, gameService, player) {
            gameService.newGame($routeParams.mode)
                .success(function(game) {
                    $location.path(gameService.newGameURL(game)).replace();
                })
                .error(function() {
                    // TODO: Handle error
                    $location.path('/').replace();
                });
    }])
    .controller('AIController', ['$scope', '$routeParams', '$interval', 'tictactoe', 'gameState', 'gameService',
        function($scope, $routeParams, $interval, tictactoe, gameState, gameService) {
            $scope.gameID = parseInt($routeParams.id);
            $scope.endpoint = gameService.gameEndpoint($scope.gameID);
            // get initial game state
            gameService.fetchState($scope.gameID).success(function(data) {
                $scope.player = gameService.localPlayer(data);
            });
            $scope.game = gameState.get();
            $scope.remote = true;
            // pull in new moves from the other player
            $interval(function() {
                // get move from server
                if ($scope.game.currentPlayer != $scope.player) {
                    gameService.fetchState($scope.gameID).success(function(newState) {
                        gameService.applyMove($scope.player, $scope.game, newState);
                    });
                }
            }, 2000);
        }])
    .controller('LocalModeCtrl', ['$scope', '$location', '$http', 'tictactoe', 'gameState', 'player',
            function($scope, $location, $http, tictactoe, gameState, player) {
        $scope.endpoint = api.echoService;
        $scope.player = (player == 'caktus')? 1:2;
        $scope.game = gameState.get();
        $scope.remote = false;
    }]);
