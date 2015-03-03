angular.module('TicTacToe.directives', [])
    .directive('ultimateBoard', [function() {
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'app/templates/ultimateBoard.html',
            controller: function($scope) {
                var available = 'available',
                    unavailable = 'unavailable',
                    winning_combinations = [
                        [0, 1, 2], // player took over the first row
                        [3, 4, 5], // player took over the second row
                        [6, 7, 8], // player took over the third row
                        [0, 3, 6], // player took over the first column
                        [1, 4, 7], // player took over the second column
                        [2, 5, 8], // player took over the third column
                        [0, 4, 8], // player took over diagonal
                        [2, 4, 6]  // player took over diagonal
                    ];


                this.getCurrentPlayer = function() {
                    return $scope.game.currentPlayer;
                };

                this.addScore = function(currentPlayer, points) {
                    if (currentPlayer == 1) {
                        $scope.game.players.one.score += points;
                    } else {
                        $scope.game.players.two.score += points;
                    }

                };

                this.updateGameState = function(nextBoardIndex) {
                    var boards = $scope.game.boards,
                        nextBoard = boards[nextBoardIndex],
                        currentPlayer = $scope.game.currentPlayer,
                        winner = isWinnerState(boards, currentPlayer);
                    if (winner) {
                        // game over, we have a winner!!
                        $scope.game.winner = currentPlayer;
                        // TODO: change number of points
                        this.addScore(currentPlayer, 100);
                        // make sure that all the boards are unavailable
                        angular.forEach(boards, function(board) {
                            board.status = unavailable;
                        });
                    } else {
                        // continue playing
                        $scope.game.currentPlayer = (currentPlayer == 1) ? 2 : 1;
                        if (!nextBoard.winner) {
                            // a winner for board has not been defined
                            angular.forEach(boards, function(board, index) {
                                if (index == nextBoardIndex) {
                                    board.status = available;
                                } else {
                                    board.status = unavailable;
                                }
                            });
                        } else {
                            // someone has won this board or no other moves can be made
                            angular.forEach(boards, function(board) {
                                if (!board.winner) {
                                    board.status = available;
                                } else {
                                    board.status = unavailable;
                                }
                            });
                        }
                    }
                };

                var isWinnerState = function(boards, currentPlayer) {
                    // checks all boards for a winning pattern
                    return winning_combinations.some(function(combination) {
                        return (boards[combination[0]].winner == currentPlayer) &&
                            (boards[combination[1]].winner == currentPlayer) &&
                            (boards[combination[2]].winner == currentPlayer);
                    });
                }
            }
        }
    }])
    .directive('singleBoard', [function() {
        var linker = function(scope, element, attrs, ultimateBoard) {
            var available = 'available',
                unavailable = 'unavailable',
                winning_combinations = [
                    [[0, 0], [0, 1], [0, 2]], // player took over the first row
                    [[1, 0], [1, 1], [1, 2]], // player took over the second row
                    [[2, 0], [2, 1], [2, 2]], // player took over the third row

                    [[0, 0], [1, 0], [2, 0]], // player took over the first column
                    [[0, 1], [1, 1], [2, 1]], // player took over the second column
                    [[0, 2], [1, 2], [2, 2]], // player took over the third column

                    [[0, 0], [1, 1], [2, 2]], // player took over diagonal
                    [[0, 2], [1, 1], [2, 0]]  // player took over diagonal
                ];

            scope.move = function(slot, rowIndex, index) {
                if ((scope.board.status == available) && (slot.state == null)) {
                    // only squares that have not been played can be played.
                    slot.state = ultimateBoard.getCurrentPlayer();
                    updateBoardState(scope.board);
                    ultimateBoard.updateGameState((rowIndex * 3) + index);
                }
            };

            var updateBoardState = function(board) {
                var available,
                    currentPlayer = ultimateBoard.getCurrentPlayer(),
                    winner = isWinnerPosition(board, currentPlayer);
                if (winner) {
                    board.winner = currentPlayer;
                    board.status = unavailable;
                    // TODO: add correct number of points
                    ultimateBoard.addScore(currentPlayer, 20)
                } else {
                    // check for legal moves
                    available = isAvailable(board);
                    if (available) {
                        board.status = available;
                        return false;  // to break the loop
                    } else {
                        // otherwise is a tie
                        board.winner = 3;
                        board.status = unavailable;
                    }
                }
            };

            var isWinnerPosition = function(board, currentPlayer) {
                return winning_combinations.some(function(combination) {
                    return combination.every(function(element) {
                        var state = board.slots[element[0]][element[1]].state;
                        return state == currentPlayer;
                    });
                });
            };

            var isAvailable = function(board) {
                return board.slots.some(function(row) {
                        return row.some(function(slot) {
                            return slot.state == null;
                        });
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
    .directive('gameStats', [function() {
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'app/templates/gameStats.html'
        }
    }]);
