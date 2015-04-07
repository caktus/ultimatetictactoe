angular.module('TicTacToe.factories', [])
    .factory('player', ['$window', function($window) {
        return $window.location.search.match(/player=([^&]\w+)/)[1];
    }])
    .factory('api', ['$window', 'player', function($window, player) {
        return {
            echoService: 'http://0.0.0.0:8000/echo/?player=' + player,
            aiService: 'http://0.0.0.0:9006/echo/?player=' + player
        }
    }])
    .factory('gameService', ['$http', function($http) {
        var url = "http://localhost:8000/api/games/",
            challenge_url = 'http://localhost:8000/api/challenges/',
            service = {};

        service.initGame = function() {
            var game = {
                currentPlayer: 1,
                winner: null,
                boards: []
                p1: null,
                p2: null
            };

            for (var row = 0; row < 3; row++) {
                game.boards.push([]);

                for (var col = 0; col < 3; col++) {
                    game.boards[row].push({player: null,
                                           available: true,
                                           squares: []});

                    for (var irow = 0; irow < 3; irow++) {
                        game.boards[row][col].squares.push([]);

                        for (var icol = 0; icol < 3; icol++) {
                            game.boards[row][col].squares[irow].push({player: null});
                        }
                    }
                }
            }

            return game;
        };

        service.newGame = function(game) {
            return $http.post(url, game);
        };

        service.getGames = function() {
            return $http.get(url);
        };

        service.getGame = function(id) {
            return $http.get(url + id + '/');
        };

        service.getChallenges = function() {
            return $http.get(challenge_url);
        };

        service.submitMove = function(id, move) {
            return $http.post(url + id + '/', move);
        };

        service.updateGame = function(game, data) {
            // Refresh the game $scope object with a data structure as returned from the api
            var state = data.state,
                bitfield = null;

            game.currentPlayer = parseInt(state[22]);
            game.winner = parseInt(data.winner);
            game.p1 = data.p1;
            game.p2 = data.p2;

            for (var row = 0; row < 3; row++) {
                for (var col = 0; col < 3; col++) {
                    bitfield = 1 << (3*row+col);

                    // list item 18 and 19 hold the win/loss/tie state of the outer boards
                    if (state[18] & ~state[19] & bitfield) {
                        game.boards[row][col].player = 'x';
                    } else if (state[19] & ~state[18] & bitfield) {
                        game.boards[row][col].player = 'o';
                    } else if (state[18] & state[19] & bitfield) {
                        game.boards[row][col].player = 'tie';
                    } else {
                        game.boards[row][col].player = null;
                    }

                    // items 20 and 21 hold the row and column of the
                    // board the current player must move into
                    if (state[20] === null && game.boards[row][col].player === null) {
                        game.boards[row][col].available = true;
                    } else if (state[20] == row && state[21] == col) {
                        game.boards[row][col].available = true;
                    } else {
                        game.boards[row][col].available = false;
                    }

                    // each pair of items 0 through 17 hold the x and
                    // o positions of the squares in each subboard
                    for (var irow = 0; irow < 3; irow++) {
                        for (var icol = 0; icol < 3; icol++) {
                            bitfield = 1 << (3*irow+icol);

                            if (state[2*(3*row+col)] & bitfield) {
                                game.boards[row][col].squares[irow][icol].player = 'x';
                            } else if (state[2*(3*row+col)+1] & bitfield) {
                                game.boards[row][col].squares[irow][icol].player = 'o';
                            } else {
                                game.boards[row][col].squares[irow][icol].player = null;
                            }
                        }
                    }
                }
            }
        };

        return service;
    }])
    .factory('tictactoe', [function() {
        var tictactoe = {},
            available = 'available',
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

        tictactoe.move = function(game, boardRowIndex, boardColumnIndex, slotRowIndex, slotColumnIndex) {
            var board = game.boards[boardRowIndex][boardColumnIndex],
                slot = board.slots[slotRowIndex][slotColumnIndex];
            if ((board.status == available) && (slot.state == null)) {
                // only squares that have not been played can be played.
                slot.state = game.currentPlayer;
                tictactoe.singleBoard.update(board, game.currentPlayer);
                tictactoe.ultimateBoard.update(game, slotRowIndex, slotColumnIndex);
            }
        };

        tictactoe.singleBoard = {
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
                return winning_combinations.some(function(combination) {
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
            update: function(game, slotRowIndex, slotColumnIndex) {
                var boards = game.boards,
                    nextBoard = boards[slotRowIndex][slotColumnIndex],
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
                        angular.forEach(boards, function(row) {
                            angular.forEach(row, function(board) {
                                if ((board.rowIndex == slotRowIndex) && (board.columnIndex == slotColumnIndex)) {
                                    board.status = available;
                                } else {
                                    board.status = unavailable;
                                }
                            });
                        });
                    } else {
                        // someone has won this board or no other moves can be made
                        angular.forEach(boards, function(row) {
                            angular.forEach(row, function(board) {
                                if (!board.winner) {
                                    board.status = available;
                                } else {
                                    board.status = unavailable;
                                }
                            });
                        });
                    }
                }
            },
            isWinnerPosition: function(boards, currentPlayer) {
                // checks all boards for a winning pattern
                return winning_combinations.some(function(combination) {
                    return combination.every(function(element) {
                        var boardWinner = boards[element[0]][element[1]].winner;
                        return boardWinner == currentPlayer;
                    });
                });
            }
        };

        return tictactoe
    }])
    .factory('gameState', [function() {
        var state = {};
        state.get = function() {
            return {
                currentPlayer: 1,
                winner: null,
                players: {
                    one: {
                        name: 'Caktus',
                        score: 0
                    },
                    two: {
                        name: 'Astro',
                        score: 0
                    }
                },
                boards: [
                    [{
                        status: 'available',
                        winner: null,
                        rowIndex: 0,
                        columnIndex: 0,
                        slots: [
                            [{state: null}, {state: null}, {state: null}],
                            [{state: null}, {state: null}, {state: null}],
                            [{state: null}, {state: null}, {state: null}]
                        ]
                    },
                    {
                        status: 'available',
                        winner: null,
                        rowIndex: 0,
                        columnIndex: 1,
                        slots: [
                            [{state: null}, {state: null}, {state: null}],
                            [{state: null}, {state: null}, {state: null}],
                            [{state: null}, {state: null}, {state: null}]
                        ]
                    },
                    {
                        status: 'available',
                        winner: null,
                        rowIndex: 0,
                        columnIndex: 2,
                        slots: [
                            [{state: null}, {state: null}, {state: null}],
                            [{state: null}, {state: null}, {state: null}],
                            [{state: null}, {state: null}, {state: null}]
                        ]
                    }],
                    [{
                        status: 'available',
                        winner: null,
                        rowIndex: 1,
                        columnIndex: 0,
                        slots: [
                            [{state: null}, {state: null}, {state: null}],
                            [{state: null}, {state: null}, {state: null}],
                            [{state: null}, {state: null}, {state: null}]
                        ]
                    },
                    {
                        status: 'available',
                        winner: null,
                        rowIndex: 1,
                        columnIndex: 1,
                        slots: [
                            [{state: null}, {state: null}, {state: null}],
                            [{state: null}, {state: null}, {state: null}],
                            [{state: null}, {state: null}, {state: null}]
                        ]
                    },
                    {
                        status: 'available',
                        winner: null,
                        rowIndex: 1,
                        columnIndex: 2,
                        slots: [
                            [{state: null}, {state: null}, {state: null}],
                            [{state: null}, {state: null}, {state: null}],
                            [{state: null}, {state: null}, {state: null}]
                        ]
                    }],
                    [{
                        status: 'available',
                        winner: null,
                        rowIndex: 2,
                        columnIndex: 0,
                        slots: [
                            [{state: null}, {state: null}, {state: null}],
                            [{state: null}, {state: null}, {state: null}],
                            [{state: null}, {state: null}, {state: null}]
                        ]
                    },
                    {
                        status: 'available',
                        winner: null,
                        rowIndex: 2,
                        columnIndex: 1,
                        slots: [
                            [{state: null}, {state: null}, {state: null}],
                            [{state: null}, {state: null}, {state: null}],
                            [{state: null}, {state: null}, {state: null}]
                        ]
                    },
                    {
                        status: 'available',
                        winner: null,
                        rowIndex: 2,
                        columnIndex: 2,
                        slots: [
                            [{state: null}, {state: null}, {state: null}],
                            [{state: null}, {state: null}, {state: null}],
                            [{state: null}, {state: null}, {state: null}]
                        ]
                    }]
                ]
            };
        }
        return state
    }]);
