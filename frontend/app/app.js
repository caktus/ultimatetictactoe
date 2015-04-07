var app = angular.module("TicTacToe", [
    'ngRoute',
    'TicTacToe.controllers',
    'TicTacToe.directives',
    'TicTacToe.factories',
    'TicTacToe.constants'
]);

app.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    $routeProvider
        .when('/', {
            controller: 'AttractModeController',
            templateUrl: 'app/templates/attractMode.html'
        })
        .when('/new/:mode', {
            controller: 'CreateGameController',
            templateUrl: 'app/templates/versusMode.html'
        })
        .when('/games/:id', {
            controller: 'GameController',
            templateUrl: 'app/templates/versusMode.html'
        })
        .when('/localMode', {
            controller: 'LocalModeCtrl',
            templateUrl: 'app/templates/versusMode.html'
        })
        .when('/remoteMode', {
            controller: 'RemoteModeCtrl',
            templateUrl: 'app/templates/versusMode.html'
        });
}]);
