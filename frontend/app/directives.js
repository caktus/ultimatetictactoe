angular.module('TicTacToe.directives', [])
    .directive('ultimateBoard', ['tictactoe', function(tictactoe) {
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'app/templates/ultimateBoard.html',
            controller: function($scope) {
                this.player = function() {
                    return $scope.player;
                };
                this.getCurrentPlayer = function() {
                    return $scope.game.currentPlayer;
                };
                this.getEndPoint = function() {
                    return $scope.endpoint;
                };
                this.move = function(boardRowIndex, boardColumnIndex, slotRowIndex, slotColumnIndex) {
                    tictactoe.move($scope.game, boardRowIndex, boardColumnIndex, slotRowIndex, slotColumnIndex);
                }
            }
        }
    }])
    .directive('singleBoard', ['$http', function($http) {
        var linker = function(scope, element, attrs, ultimateBoard) {
            scope.move = function(boardRowIndex, boardColumnIndex, slotRowIndex, slotColumnIndex) {
                var endpoint = ultimateBoard.getEndPoint(),
                    player = ultimateBoard.player(),
                    data,
                    currentPlayer = ultimateBoard.getCurrentPlayer();
                console.log("This is the current player: " + currentPlayer);
                console.log("Player on board: " + player);
                console.log("This is a remote game: " + scope.remote);
                if (scope.remote ) {
                    if (player == currentPlayer) {
                        data = {
                            play: boardRowIndex + ' ' + boardColumnIndex + ' ' + slotRowIndex + ' ' + slotColumnIndex
                        };
                        $http.put(endpoint, data).success(function(data) {
                            ultimateBoard.move(boardRowIndex, boardColumnIndex, slotRowIndex, slotColumnIndex);
                        })
                    }
                } else {
                    // both players are playing locally.
                    ultimateBoard.move(boardRowIndex, boardColumnIndex, slotRowIndex, slotColumnIndex);
                }
            };
        };
        return {
            restrict: 'AE',
            require: '^ultimateBoard',
            link: linker,
            replace: true,
            templateUrl: 'app/templates/singleBoard.html'
        }
    }])
    .directive('winnerModal', ['$location', 'api', function($location, api) {
        var linker = function(scope, element, attrs) {
            element.bind('click', function() {
                scope.$apply(function(){
                    $location.path('/');
                });
            });
        };
        return {
            restrict: 'AE',
            link: linker,
            templateUrl: 'app/templates/winnerModal.html'
        }
    }])
    .directive('gameStats', [function() {
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'app/templates/gameStats.html'
        }
    }]);
