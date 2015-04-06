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
            service = {'id': null,
                   'state': null,
                   'player': null};

        service.newGame = function(mode) {
            return $http.post(url, {"gametype": mode})
        };

        service.getChallenges = function() {
            return $http.get(challenge_url)
        };

	service.fetchState = function() {
	    var data = null;
	    service.unboxData(data);
	};

	service.applyMove = function(row, col, innerrow, innercol) {
	};

	service.submitMove = function(row, col, innerrow, innercol) {
	};

	service.unboxData = function(data) {
	    var bitfield = null;

	    service.player = data[22];
	    service.state = [];
	    for (var row = 0; row < 3; row++) {
		service.state.push([]);
		for (var col = 0; col < 3; col++) {
		    bitfield = 1 << (3*row+col);

		    service.state[row].push({player: null,
					     available: false,
					     boards: []});
		    if (data[18] & ~data[19] & bitfield) {
			service.data[row][col].player = 'x';
		    } else if (data[19] & ~data[18] & bitfield) {
			service.data[row][col].player = 'o';
		    } else if (data[18] & data[19] & bitfield) {
			service.data[row][col].player = 'tie';
		    }

		    if (data[20] === null || (data[20] == row && data[21] == col)) {
			service.data[row][col].available = true;
		    }

		    for (var irow = 0; irow < 3; irow++) {
			service.state[row][col].boards[irow].push([]);
			for (var icol = 0; icol < 3; icol++) {
			    bitfield = 1 << (3*irow+icol);
			    service.state[row][col].boards[irow][icol].push({
				player: null
			    });

			    if (data[2*(3*row+col)] & bitfield) {
				service.state[row][col].boards[irow][icol].player = 'x';
			    } else if (data[2*(3*row+col)+1] & bitfield) {
				service.state[row][col].boards[irow][icol].player = 'o';
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
    }]);
