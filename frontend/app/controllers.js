angular.module('TicTacToe.controllers', [])
    .controller('AttractModeCtrl', ['$scope', function($scope, $routeParams) {

    }])
    .controller('LocalModeCtrl', ['$scope', '$http', 'tictactoe', 'initialState', 'api', 'player',
            function($scope, $http, tictactoe, initialState, api, player) {
        $scope.endpoint = api.echoService;
        $scope.player = player;
        $scope.game = initialState;
        $scope.remote = false;
    }])
    .controller('ComputerModeCtrl', ['$scope', '$interval', '$http', 'tictactoe', 'initialState', 'api', 'player',
            function($scope, $interval, $http, tictactoe, initialState, api, player) {
        $scope.endpoint = api.aiService;
        $scope.player = player;
        $scope.game = initialState;
        $scope.remote = true;
        $scope.ai = true;
        $interval(function() {
            // get move from server
            if ($scope.game.currentPlayer != 1) {
                $http.get($scope.endpoint).success(function(data, status, headers, config) {
                    if (data.type == 'move') {
                        console.log(data);
                        tictactoe.move(
                            $scope.game,
                            parseInt(data.boardIndex),
                            parseInt(data.rowIndex),
                            parseInt(data.columnIndex)
                        );
                    } else {
                        console.log(data);
                    }
                });
            }
        }, 1000);
    }])
    .controller('RemoteModeCtrl', ['$scope', '$interval', '$http', 'tictactoe', 'initialState', 'api', 'player',
            function($scope, $interval, $http, tictactoe, initialState, api, player) {
        $scope.endpoint = api.echoService;
        $scope.player = player;
        $scope.game = initialState;
        $scope.remote = true;
        $interval(function() {
            // get move from server
            if ($scope.game.currentPlayer != $scope.player) {
                $http.get($scope.endpoint).success(function(data, status, headers, config) {
                    if (data.type == 'move') {
                        console.log(data);
                        tictactoe.move(
                            $scope.game,
                            parseInt(data.boardIndex),
                            parseInt(data.rowIndex),
                            parseInt(data.columnIndex)
                        );
                    } else {
                        console.log(data);
                    }
                });
            }
        }, 1000);
    }]);
