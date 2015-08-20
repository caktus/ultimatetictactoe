angular.module('TicTacToe.controllers', ['TicTacToe.factories'])
    .controller('AttractModeController', ['$scope', function($scope) {
        setTimeout(function(){
            $('.main-gallery').flickity({
                // options
                autoPlay: 5000,
                wrapAround: true,
                contain: true,
            });
        }, 1000);
    }])
    .controller('CreateGameController',
        ['$scope', '$location', '$routeParams', 'gameService',
        function($scope, $location, $routeParams, gameService) {
            // This controller is used to create new games server side.
            // Once the game is created, we are redirected to game URL.
            gameService.newGame($routeParams.mode)
                .success(function(game) {
                    $location.path(gameService.newGameURL(game)).replace();
                })
                .error(function() {
                    // In case of an error, redirect player to the homepage.
                    $location.path('/').replace();
                });
        }])
    .controller('GameController',
        ['$scope', '$routeParams', '$interval', 'tictactoe', 'gameState', 'gameService',
        function($scope, $routeParams, $interval, tictactoe, gameState, gameService) {
            // GameController: Fetches and submits moves to a remote
            // django service.

            var timer;

            $scope.startTimer = function() {
                console.log("Starting timer.");
                timer = $interval(function() {
                    // get move from server
                    gameService.fetchState($scope.gameID).success(function(newState) {
                        console.log(newState);
                        if (!!newState) {
                            gameService.applyMove($scope.game, newState);
                            gameService.updatePlayerType(newState);
                        }
                    });
                }, 2000);
            };

            $scope.endTimer = function() {
                console.log("Killing timer.");
                $interval.cancel(timer);
            };

            document.body.classList.add('turnOne');
            $scope.gameID = parseInt($routeParams.id);
            // get initial game state
            gameService.fetchState($scope.gameID).success(function(data) {
                gameService.updatePlayerType(data);
                $scope.startTimer();
            });
            $scope.game = gameState.get();

            $scope.$on('$destroy', function() {
                $scope.endTimer();
            });
        }]);
