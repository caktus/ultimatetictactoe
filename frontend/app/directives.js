angular.module('TicTacToe.directives', [])
    .directive('ultimateBoard', ['tictactoe', function(tictactoe) {
        // this directory allows the state to be shared across all the individual boards.
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
                this.playerIsLocal = function() {
                    return $scope.player == 'local';
                };
                this.gameID = function() {
                    return $scope.gameID;
                };
                this.move = function(boardRowIndex, boardColumnIndex, slotRowIndex, slotColumnIndex) {
                    tictactoe.move($scope.game, boardRowIndex, boardColumnIndex, slotRowIndex, slotColumnIndex);
                }
            }
        }
    }])
    .directive('boardHighlight', ['tictactoe', function(tictactoe) {
        function linker(scope, element, attrs) {
            var highlight = function(board) {
                console.log(arguments);
                var $el = $(element);
                $el.animate({
                    top: 300,
                    left: 300,
                });
            }
            scope.highlight = highlight;
            if (typeof tictactoe.setHighlight === "undefined") {
                tictactoe.setHighlight = function(board) {
                    highlight(board);
                }
            } else {
                throw "Only a single <board-highlight> is supposed at a single time."
            }
        }
        return {
            link: linker,
            restrict: 'AE',
            replace: true,
            templateUrl: 'app/templates/boardHighlight.html'
        }
    }])
    .directive('singleBoard', ['$http', 'gameService', function($http, gameService) {
        var linker = function(scope, element, attrs, ultimateBoard) {
            scope.move = function(boardRowIndex, boardColumnIndex, slotRowIndex, slotColumnIndex) {
                var gameID = ultimateBoard.gameID(),
                    data;

                if (ultimateBoard.playerIsLocal()) {
                    data = {
                        play: boardRowIndex + ' ' + boardColumnIndex + ' ' + slotRowIndex + ' ' + slotColumnIndex
                    };
                    gameService.submitMove(gameID, data).success(function() {
                        ultimateBoard.move(boardRowIndex, boardColumnIndex, slotRowIndex, slotColumnIndex);
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
    .directive('winnerModal', ['$location', function($location) {
        var linker = function(scope, element) {
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
