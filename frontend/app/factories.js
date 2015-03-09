angular.module('TicTacToe.factories', [])
    .factory('simpleAI', [function() {
         var ai = {},
             winningGameCombinations,
             winningBoardCombinations,
             availableBoards,
             availableMoves;

        winningGameCombinations = [
            [0, 1, 2], // player took over the first row
            [3, 4, 5], // player took over the second row
            [6, 7, 8], // player took over the third row
            [0, 3, 6], // player took over the first column
            [1, 4, 7], // player took over the second column
            [2, 5, 8], // player took over the third column
            [0, 4, 8], // player took over diagonal
            [2, 4, 6]  // player took over diagonal
        ];

        winningBoardCombinations = [
            [[0, 0], [0, 1], [0, 2]], // player took over the first row
            [[1, 0], [1, 1], [1, 2]], // player took over the second row
            [[2, 0], [2, 1], [2, 2]], // player took over the third row

            [[0, 0], [1, 0], [2, 0]], // player took over the first column
            [[0, 1], [1, 1], [2, 1]], // player took over the second column
            [[0, 2], [1, 2], [2, 2]], // player took over the third column

            [[0, 0], [1, 1], [2, 2]], // player took over diagonal
            [[0, 2], [1, 1], [2, 0]]  // player took over diagonal
        ];

        availableBoards = function(game) {
            var boards = [];
            angular.forEach(game.boards, function(board, index) {
                if (board.status == 'available') {
                    board.index = index + 1;
                    boards.push(board)
                }
            });
            return boards
        };

        var getAvailableMoves = function(board) {
            var available = [];
            angular.forEach(board.slots, function(row, rowIndex) {
                angular.forEach(row, function(slot, index) {
                    if (slot.state == null) {
                        slot.rowIndex = rowIndex + 1;
                        slot.index = index + 1;
                        available.push(slot);
                    }
                });
            });
            return available
        };

         var evaluateState = function(boardIndex) {

         };

        var findWinningMove = function(board) {
        };

        var findSecondInRow = function(board) {

        };

        var getRandomMove = function(board) {
            var availableMoves = getAvailableMoves(board);
            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        };

        var findBestMove = function(board) {
            // returns the best slot to move to
            if (board) {
                var winningMove = findWinningMove(board);
                if (winningMove) {
                    return winningMove;
                }
                var secondInRow = findSecondInRow(board);
                if (secondInRow) {
                    return secondInRow;
                }

                return getRandomMove(board);
            }
        };

        var findBestBoard = function(game) {
            var boards = availableBoards(game);
            if (boards) {
                return boards[0]
            }
        };

        ai.move = function(game) {
            var bestBoard,
                slot;
            bestBoard = findBestBoard(game);
            slot = findBestMove(bestBoard);
            angular.element(".small-board-" + bestBoard.index).find('.row-' + slot.rowIndex + '.column-' + slot.index).click();
        };
        return ai
    }]);
