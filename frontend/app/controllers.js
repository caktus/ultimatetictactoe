angular.module('TicTacToe.controllers', [])
    .controller('AttractModeCtrl', ['$scope', function($scope) {

    }])
    .controller('VersusModeCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
        $rootScope.gameState = [
            [
                [{state: null}, {state: null}, {state: null}],
                [{state: null}, {state: null}, {state: null}],
                [{state: null}, {state: null}, {state: null}]
            ],
            [
                [{state: null}, {state: null}, {state: null}],
                [{state: null}, {state: null}, {state: null}],
                [{state: null}, {state: null}, {state: null}]
            ],
            [
                [{state: null}, {state: null}, {state: null}],
                [{state: null}, {state: null}, {state: null}],
                [{state: null}, {state: null}, {state: null}]
            ],
            [
                [{state: null}, {state: null}, {state: null}],
                [{state: null}, {state: null}, {state: null}],
                [{state: null}, {state: null}, {state: null}]
            ],
            [
                [{state: null}, {state: null}, {state: null}],
                [{state: null}, {state: null}, {state: null}],
                [{state: null}, {state: null}, {state: null}]
            ],
            [
                [{state: null}, {state: null}, {state: null}],
                [{state: null}, {state: null}, {state: null}],
                [{state: null}, {state: null}, {state: null}]
            ],
            [
                [{state: null}, {state: null}, {state: null}],
                [{state: null}, {state: null}, {state: null}],
                [{state: null}, {state: null}, {state: null}]
            ],
            [
                [{state: null}, {state: null}, {state: null}],
                [{state: null}, {state: null}, {state: null}],
                [{state: null}, {state: null}, {state: null}]
            ],
            [
                [{state: null}, {state: null}, {state: null}],
                [{state: null}, {state: null}, {state: null}],
                [{state: null}, {state: null}, {state: null}]
            ],
        ];
        $rootScope.currentPlayer = 0;
        $rootScope.currentBoard = 0;

        $scope.$watch("gameState", function(newValue, oldValue) {
            // check if the current position is a winning position
//            console.log(newValue);
        });
    }]);
