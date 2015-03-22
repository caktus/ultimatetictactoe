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
                this.move = function(boardIndex, rowIndex, columnIndex) {
                    tictactoe.move($scope.game, boardIndex, rowIndex, columnIndex);
                }
            }
        }
    }])
    .directive('singleBoard', ['$http', function($http) {
        var linker = function(scope, element, attrs, ultimateBoard) {
            scope.move = function(boardIndex, rowIndex, columnIndex) {
                var player = ultimateBoard.player(),
                    data,
                    currentPlayer = ultimateBoard.getCurrentPlayer();
                if (player == currentPlayer) {
                    data = $.param({
                        type: 'move',
                        boardIndex: boardIndex - 1,
                        rowIndex: rowIndex,
                        columnIndex: columnIndex
                    });
                    console.log(data);
                    var url = 'http://172.20.0.117:9000/api/move/?player=' + player;
                    $http.post(url, data).success(function(data) {
                        ultimateBoard.move(boardIndex - 1, rowIndex, columnIndex);
                    })
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
    .directive('winnerModal', ['$route', function($route) {
        var linker = function(scope, element, attrs) {
            element.bind('click', function() {
                var data = $.param({type: 'forfeit'});
                var player = ultimateBoard.player();
                var url = 'http://localhost:9000/api/move/?player=' + player;
                $http.post(url, data).success(function(data) {
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
