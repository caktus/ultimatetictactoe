var app = angular.module("TicTacToe", [
    'ngRoute',
    'TicTacToe.controllers',
    'TicTacToe.directives',
    'TicTacToe.factories',
]);

app.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    $routeProvider
        .when('/', {
            controller: 'AttractModeController',
            templateUrl: 'static/app/templates/attractMode.html'
        })
        .when('/new/:mode', {
            controller: 'CreateGameController',
            templateUrl: 'static/app/templates/versusMode.html'
        })
        .when('/games/:id', {
            controller: 'GameController',
            templateUrl: 'static/app/templates/versusMode.html'
        })
}]);
