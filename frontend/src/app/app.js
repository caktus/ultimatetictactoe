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
            templateUrl: 'app/templates/attractMode.html'
        })
        .when('/new/:mode', {
            controller: 'CreateGameController',
            templateUrl: 'app/templates/versusMode.html'
        })
        .when('/games/:id', {
            controller: 'AIController',
            templateUrl: 'app/templates/versusMode.html'
        })
        .when('/localMode', {
            controller: 'LocalModeCtrl',
            templateUrl: 'app/templates/versusMode.html'
        })
}]);
