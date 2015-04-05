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
                    player = scope.ai? 1 : ultimateBoard.player(),
                    data,
                    currentPlayer = ultimateBoard.getCurrentPlayer();
                if (scope.remote && (player == currentPlayer)) {
                    data = {
                        play: boardRowIndex + ' ' + boardColumnIndex + ' ' + slotRowIndex + ' ' + slotColumnIndex
                    };
                    $http.put(endpoint, data).success(function(data) {
                        ultimateBoard.move(boardRowIndex, boardColumnIndex, slotRowIndex, slotColumnIndex);
                    })
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
    .directive('winnerModal', ['$route', 'api', function($route, api) {
        var linker = function(scope, element, attrs) {
            element.bind('click', function() {
                var data = $.param({type: 'forfeit'}),
                    url = scope.endpoint;
                $http.post(url, data).success(function(data) {
                    console.log(data);
                    scope.$apply(function(){
                        $route.reload();
                    });
                });
            });
        };
        return {
            restrict: 'AE',
            link: linker,
            replace: true,
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
