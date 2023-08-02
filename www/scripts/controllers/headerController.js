'use strict';

/**
 * @ngdoc function
 * @name 2BanonymousApp.controller:AccountCreateCtrl
 * @description
 * # AccountCreateCtrl
 * Controller of the 2BanonymousApp
 */
angular.module('2BanonymousApp')
    .controller('headerController', ['$scope', '$q', '$http', '$rootScope', '$location', 'AuthenticationService', '$route', function ($scope, $q, $http, $rootScope, $location, AuthenticationService, $route) {

        $scope.login = function () {
            console.log('logging in');
            $scope.loginText = "<i class='fa fa-sign-in'></i>";
            $location.path('/');
        };

        $scope.logout = function () {
            console.log('log out');
            AuthenticationService.ClearCredentials();
            localStorage.setItem('logged_in', false);
            localStorage.setItem('user', false);
            localStorage.setItem('currentUser', false);
            $location.path('/');
            $scope.loginText = "<i class='fa fa-sign-in'></i>";
        };

        $scope.loadMenu = function () {
            if ($rootScope.globals.currentUser) {
                $route.reload();
                $location.path('/main');
            }
        };

        $scope.changePage = function (url) {
            $location.path(url);
        };

    }]);
