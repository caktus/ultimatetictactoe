angular.module('TicTacToe.directives', [])
    .directive('board', ['$rootScope', function($rootScope) {
        var linker = function(scope, element, attrs) {
            scope.updateState = function(slot, rowIndex, index) {
                if ((slot.state == null) && (scope.boardState.status == 'available')) {
                    // only squares that have not been played can be played.
                    slot.state = $rootScope.currentPlayer;
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

            var checkPosition = function(board) {
                var winner,
                    available;
                // check state for winning position.
                winner = winning_combinations.some(function(combination) {
                    return combination.every(function(element) {
                        var state = board.slots[element[0]][element[1]].state;
                        return state == $rootScope.currentPlayer;
                    });
                });
                if (winner) {
                    board.winner = $rootScope.currentPlayer;
                    board.status = 'unavailable';
                } else {
                    // check for legal moves
                    available = board.slots.some(function(row) {
                        return row.some(function(slot) {
                            return slot.state == null;
                        });
                    });
                    if (available) {
                        board.status = 'available';
                        return false;  // to break the loop
                    } else {
                        // otherwise is a tie
                        board.winner = 'tie';
                        board.status = 'unavailable';
                    }
                }
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
