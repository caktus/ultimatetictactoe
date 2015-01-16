var app = angular.module("TicTacToe", [
    'ngRoute',
    'TicTacToe.controllers',
    'TicTacToe.directives'
]);

app.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    $routeProvider
        .when('/', {
            controller: 'AttractModeCtrl',
            templateUrl: 'app/templates/attractMode.html'
            })
        .when('/OneVSOne', {
            controller: 'VersusModeCtrl',
            templateUrl: 'app/templates/versusMode.html'
            })
}]);
