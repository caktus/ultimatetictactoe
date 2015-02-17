angular.module('TicTacToe.directives', [])
    .directive('board', ['$rootScope', function($rootScope) {
        var linker = function(scope, element, attrs) {
            var isBusy = false;
            scope.updateState = function(square, rowIndex, index) {
                if ((square.state == null) && (scope.boardState.status == 'available') && !isBusy) {
                    // only squares that have not been played can be played.
                    square.state = $rootScope.currentPlayer;
                    checkPosition(scope.boardState);
                    updateBoardStatus((rowIndex * 3) + index);
                } else {
                    console.log("this board can't be played");
                }
            };

            var winning_combinations = [
                [[0, 0], [0, 1], [0, 2]], // player took over the first row
                [[1, 0], [1, 1], [1, 2]], // player took over the second row
                [[2, 0], [2, 1], [2, 2]], // player took over the third row

                [[0, 0], [1, 0], [2, 0]], // player took over the first column
                [[0, 1], [1, 1], [2, 1]], // player took over the second column
                [[0, 2], [1, 2], [2, 2]], // player took over the third column

                [[0, 0], [1, 1], [2, 2]], // player took over diagonal
                [[0, 2], [1, 1], [2, 0]], // player took over diagonal
            ];

            var checkPosition = function(boardState) {
                // check state for winning position or no moves left.
                var winner;
                angular.forEach(winning_combinations, function(combination) {
                    winner = combination.every(function(element) {
                        return boardState.state[element[0]][element[1]].state == $rootScope.currentPlayer;
                    });
                    if (winner) {
                        boardState.winner = $rootScope.currentPlayer;
                        boardState.status = 'unavailable';
                    }
                });
            };

            var updateBoardStatus = function(nextBoardIndex) {
                var nextBoard = $rootScope.gameState[nextBoardIndex];
                $rootScope.currentPlayer = ($rootScope.currentPlayer == 1) ? 2 : 1;
                if (!nextBoard.winner) {
                    // a winner for board has not been defined
                    angular.forEach($rootScope.gameState, function(board, index) {
                        if (index == nextBoardIndex) {
                            board.status = 'available';
                        } else {
                            board.status = 'unavailable';
                        }
                    });
                } else {
                    // someone has won this board or no other moves can be made
                    angular.forEach($rootScope.gameState, function(board, index) {
                        if (!board.winner) {
                            board.status = 'available';
                        } else {
                            board.status = 'unavailable';
                        }
                    });
                }
            }
        };
        return {
            restrict: 'AE',
            link: linker,
            replace: true,
            templateUrl: 'app/templates/smallBoard.html'
        }
    }]);
