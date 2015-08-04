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
            var $el = $(element);
            scope.curHighlightRow = undefined;
            scope.curHighlightCol = undefined;

            var setHighlight = function(boardRow, boardCol, cellRow, cellCol) {
                var pos = $el.position();

                scope.curHighlightRow = boardRow;
                scope.curHighlightCol = boardCol;
                console.log(boardRow, boardCol, cellRow, cellCol);

                return new Promise(function(resolve, reject) {
                    if (typeof cellRow === "undefined" || typeof cellCol === "undefined") {
                        console.log("Highlight Board:", boardRow, boardCol);
                        $board = $(".small-board.row-$ROW.column-$COL".replace("$ROW", boardRow+1).replace("$COL", boardCol+1));
                        $el.animate({
                            top: 312 * boardRow,
                            left: 312 * boardCol,
                            width: $board.outerWidth(),
                            height: $board.outerWidth(),
                        }, 500, "swing", resolve);
                    } else {
                        console.log("Highlight Cell:", cellRow, cellCol);
                        var firstTop = 312 * boardRow + 98 * cellRow;
                        var firstLeft = 312 * boardCol + 98 * cellCol;
                        $el.animate({
                            top: firstTop,
                            left: firstLeft,
                            width: 99, height: 99,
                        }, 500, "swing", resolve);
                    }
                })
            }
            tictactoe.setHighlight = setHighlight;
            tictactoe.highlightCell = function(boardRow, boardCol, cellRow, cellCol) {
                return setHighlight(boardRow, boardCol, cellRow, cellCol);
            };
            tictactoe.highlightBoard = function(boardRow, boardCol) {
                return setHighlight(boardRow, boardCol);
            };
        }
        return {
            link: linker,
            restrict: 'AE',
            replace: true,
            templateUrl: 'app/templates/boardHighlight.html'
        }
    }])
    .directive('singleBoard', ['$http', 'gameService', 'tictactoe', function($http, gameService, tictactoe) {
        var linker = function(scope, element, attrs, ultimateBoard) {
            scope.move = function(boardRowIndex, boardColumnIndex, slotRowIndex, slotColumnIndex) {
                var gameID = ultimateBoard.gameID(),
                    data;

                tictactoe.highlightCell(boardRowIndex, boardColumnIndex, slotRowIndex, slotColumnIndex).then(function(){
                    if (ultimateBoard.playerIsLocal()) {
                        data = {
                            play: boardRowIndex + ' ' + boardColumnIndex + ' ' + slotRowIndex + ' ' + slotColumnIndex
                        };
                        gameService.submitMove(gameID, data).success(function() {
                            ultimateBoard.move(boardRowIndex, boardColumnIndex, slotRowIndex, slotColumnIndex);
                            setTimeout(function() {
                                tictactoe.highlightBoard(slotRowIndex, slotColumnIndex).then(function(){

                                });
                            }, 500);
                        })
                    }
                });
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
