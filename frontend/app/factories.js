angular.module('TicTacToe.factories', [])
    .factory('player', ['$window', function($window) {
        return $window.location.search.match(/\d+/g);
    }])
    .factory('api', ['$window', 'player', function($window, player) {
        return {
            echoService: 'http://0.0.0.0:9006/echo/?player=' + player,
            aiService: 'http://0.0.0.0:9006/echo/?player=' + player
        }
    }])
    .factory('tictactoe', [function() {
        var tictactoe = {},
            available = 'available',
            unavailable = 'unavailable';

        tictactoe.move = function(game, boardIndex, rowIndex, columnIndex) {
            var board = game.boards[boardIndex],
                slot = board.slots[rowIndex][columnIndex];
            if ((board.status == available) && (slot.state == null)) {
                // only squares that have not been played can be played.
                slot.state = game.currentPlayer;
                tictactoe.singleBoard.update(board, game.currentPlayer);
                tictactoe.ultimateBoard.update(game, (rowIndex * 3) + columnIndex);
            }
        };

        tictactoe.singleBoard = {
            winning_combinations: [
                [[0, 0], [0, 1], [0, 2]], // player took over the first row
                [[1, 0], [1, 1], [1, 2]], // player took over the second row
                [[2, 0], [2, 1], [2, 2]], // player took over the third row

                [[0, 0], [1, 0], [2, 0]], // player took over the first column
                [[0, 1], [1, 1], [2, 1]], // player took over the second column
                [[0, 2], [1, 2], [2, 2]], // player took over the third column

                [[0, 0], [1, 1], [2, 2]], // player took over diagonal
                [[0, 2], [1, 1], [2, 0]]  // player took over diagonal
            ],
            update: function(board, currentPlayer) {
                var available,
                    winner = this.isWinnerPosition(board, currentPlayer);
                if (winner) {
                    board.winner = currentPlayer;
                    board.status = unavailable;
                } else {
                    // check for legal moves
                    available = this.isAvailable(board);
                    if (available) {
                        board.status = available;
                        return false;  // to break the loop
                    } else {
                        // otherwise is a tie
                        board.winner = 3;
                        board.status = unavailable;
                    }
                }
            },
            isWinnerPosition: function(board, currentPlayer) {
                return this.winning_combinations.some(function(combination) {
                    return combination.every(function(element) {
                        var state = board.slots[element[0]][element[1]].state;
                        return state == currentPlayer;
                    });
                });
            },
            isAvailable: function(board) {
                return board.slots.some(function(row) {
                        return row.some(function(slot) {
                            return slot.state == null;
                        });
                    });
            }
        };

        tictactoe.ultimateBoard = {
            winning_combinations: [
                [0, 1, 2], // player took over the first row
                [3, 4, 5], // player took over the second row
                [6, 7, 8], // player took over the third row
                [0, 3, 6], // player took over the first column
                [1, 4, 7], // player took over the second column
                [2, 5, 8], // player took over the third column
                [0, 4, 8], // player took over diagonal
                [2, 4, 6]  // player took over diagonal
            ],
            update: function(game, nextBoardIndex) {
                var boards = game.boards,
                    nextBoard = boards[nextBoardIndex],
                    currentPlayer = game.currentPlayer,
                    winner = this.isWinnerPosition(boards, currentPlayer);
                if (winner) {
                    // game over, we have a winner!!
                    game.winner = currentPlayer;
                    // make sure that all the boards are unavailable
                    angular.forEach(boards, function(board) {
                        board.status = unavailable;
                    });
                } else {
                    // continue playing
                    game.currentPlayer = (currentPlayer == 1) ? 2 : 1;
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
            },
            isWinnerPosition: function(boards, currentPlayer) {
                // checks all boards for a winning pattern
                return this.winning_combinations.some(function(combination) {
                    return (boards[combination[0]].winner == currentPlayer) &&
                        (boards[combination[1]].winner == currentPlayer) &&
                        (boards[combination[2]].winner == currentPlayer);
                });
            }
        };

        return tictactoe
    }]);
