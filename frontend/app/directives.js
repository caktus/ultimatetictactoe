angular.module('TicTacToe.directives', [])
    .directive('board', ['$rootScope', function($rootScope) {
        var linker = function(scope, element, attrs) {
            var boardId = scope['$index'],
                isBusy = false;
            scope.boardId = boardId;
            console.log(boardId);
            scope.updateState = function(square, rowIndex, index) {
                if ((square.state == null) && (boardId == $rootScope.currentBoard) && !isBusy) {
                    // only squares that have not been played can be played.
                    isBusy = true;
                    square.state = $rootScope.currentPlayer;
                    $rootScope.currentPlayer = ($rootScope.currentPlayer == 0) ? 1 : 0;
                    $rootScope.currentBoard = (rowIndex * 3) + index;
                    scope.isCurrentBoard = false;
                    isBusy = false;
                } else {
                    console.log("this board can't be played");
                }
            };
        };
        return {
            restrict: 'AE',
            link: linker,
            replace: true,
            templateUrl: 'app/templates/smallBoard.html'
        }
    }]);
