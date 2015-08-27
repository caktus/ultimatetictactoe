angular.module('TicTacToe.directives', [])
    .directive('ultimateBoard', ['tictactoe', 'gameService', function(tictactoe, gameService) {
        // this directive allows the state to be shared across all the individual boards.
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: '/static/app/templates/ultimateBoard.html',
            controller: function($scope) {
                this.player = function() {
                    return $scope.player;
                };
                this.getCurrentPlayer = function() {
                    return $scope.game.currentPlayer;
                };
                this.playerIsLocal = function() {
                    return gameService.playerType == 'local';
                };
                this.gameID = function() {
                    return $scope.gameID;
                };
                this.move = function(boardRowIndex, boardColumnIndex, slotRowIndex, slotColumnIndex) {
                    return tictactoe.move($scope.game, boardRowIndex, boardColumnIndex, slotRowIndex, slotColumnIndex);
                }
            }
        }
    }])
    .directive('boardHighlight', ['tictactoe', '$q', function(tictactoe, $q) {
        function linker(scope, element, attrs) {
            var $el = $(element);
            scope.curHighlightRow = undefined;
            scope.curHighlightCol = undefined;

            var setHighlight = function(boardRow, boardCol, cellRow, cellCol) {
                var pos = $el.position();

                scope.curHighlightRow = boardRow;
                scope.curHighlightCol = boardCol;
                console.log(boardRow, boardCol, cellRow, cellCol);

                return $q(function(resolve, reject) {
                    var $board = $(".small-board.row-$ROW.column-$COL".replace("$ROW", boardRow+1).replace("$COL", boardCol+1));
                    if (typeof cellRow === "undefined" || typeof cellCol === "undefined") {
                        console.log("Highlight Board:", boardRow, boardCol);


                        var afterAnimation = function() {
                            var isClosed = $board.hasClass('playerOne') || $board.hasClass('playerTwo');
                            console.log("closed board?", isClosed);
                            if (isClosed) {
                                var ultimateBoard = $('.ultimate-board');
                                tictactoe.highlightPulse().animate({
                                    top: 0,
                                    left: 0,
                                    width: ultimateBoard.width(),
                                    height: ultimateBoard.height(),
                                }, 700, resolve);
                            } else {
                                resolve();
                            }
                        };
                        $el.animate({
                            top: 312 * boardRow,
                            left: 312 * boardCol,
                            width: $board.outerWidth(),
                            height: $board.outerWidth(),
                            borderRadius: 15,
                        }, 500, "swing", afterAnimation);
                    } else {
                        console.log("Highlight Cell:", cellRow, cellCol);
                        var firstTop = 7 + 312 * boardRow + 98 * cellRow;
                        var firstLeft = 7 + 312 * boardCol + 98 * cellCol;
                        $el.animate({
                            top: firstTop,
                            left: firstLeft,
                            width: 99, height: 99,
                            borderRadius: 50,
                        }, 500, "swing", resolve);
                    }
                })
            }
            tictactoe.setHighlight = setHighlight;
            tictactoe.highlightCell = function(boardRow, boardCol, cellRow, cellCol) {
                return setHighlight(boardRow, boardCol, cellRow, cellCol);
            };
            tictactoe.highlightBoard = function(boardRow, boardCol) {
                $("body").toggleClass("turnOne turnTwo");
                return setHighlight(boardRow, boardCol);
            };
            var pulsingFrom = null;
            tictactoe.highlightPulse = function() {
                var $el = $('.board-highlight');
                if (pulsingFrom === null) {
                    pulsingFrom = {
                        pos: {top: $el.css('top'), left: $el.css('left')},
                        width: $el.width(),
                        height: $el.height(),
                    };

                    return $el.animate({
                        top: $el.position().top - 15,
                        left: $el.position().left - 15,
                        width: pulsingFrom.width + 40,
                        height: pulsingFrom.height + 40,
                    }, 200, "swing").animate({
                        top: pulsingFrom.pos.top,
                        left: pulsingFrom.pos.left,
                        width: pulsingFrom.width,
                        height: pulsingFrom.height,
                    }, 200, "swing", function() {
                        pulsingFrom = null;
                    });
                }
            };
        }
        return {
            link: linker,
            restrict: 'AE',
            replace: true,
            templateUrl: '/static/app/templates/boardHighlight.html'
        }
    }])
    .directive('singleBoard', ['$http', 'gameService', 'tictactoe', function($http, gameService, tictactoe) {
        var linker = function(scope, element, attrs, ultimateBoard) {
            scope.move = function(boardRowIndex, boardColumnIndex, slotRowIndex, slotColumnIndex) {
                var gameID = ultimateBoard.gameID()
                ,   data
                ,   $board = $(".small-board.row-$ROW.column-$COL".replace("$ROW", boardRowIndex+1).replace("$COL", boardColumnIndex+1))
                ,   localTurn = ultimateBoard.playerIsLocal()
                ;

                if (!localTurn) {
                    // Do not move, because it is the AI turn
                } else if (!$board.hasClass('available')) {
                    tictactoe.highlightPulse();
                } else {
                    tictactoe.highlightCell(boardRowIndex, boardColumnIndex, slotRowIndex, slotColumnIndex).then(function(){
                        if (ultimateBoard.playerIsLocal()) {
                            data = {
                                play: boardRowIndex + ' ' + boardColumnIndex + ' ' + slotRowIndex + ' ' + slotColumnIndex
                            };
                            gameService.submitMove(gameID, data).success(function() {
                                ultimateBoard.move(boardRowIndex, boardColumnIndex, slotRowIndex, slotColumnIndex);
                            })
                        }
                    });
                }
            };
        };
        return {
            restrict: 'AE',
            require: '^ultimateBoard',
            link: linker,
            replace: true,
            templateUrl: '/static/app/templates/singleBoard.html'
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
            templateUrl: '/static/app/templates/winnerModal.html'
        }
    }])
    .directive('gameStats', [function() {
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: '/static/app/templates/gameStats.html'
        }
    }]);
