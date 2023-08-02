'use strict';

/**
 * @ngdoc function
 * @name 2BanonymousApp.controller:LoginCtrl
 * @description
 * # MainCtrl
 * Controller of the 2BanonymousApp
 */
angular.module('2BanonymousApp')
    .controller('LoginCtrl', ['$scope', '$q', '$http', '$rootScope', '$location', 'AuthenticationService', 'DatabaseService', '$uibModal', function ($scope, $q, $http, $rootScope, $location, AuthenticationService, DatabaseService, $uibModal) {

        // reset login status
        AuthenticationService.ClearCredentials();

        $scope.verifyLogin = function () {
            if ($scope.email && $scope.password) {
                $scope.loginReady = true;
            }
        };

        $scope.login = function () {
            if ($scope.email && $scope.password) {
                $scope.loading = true;
                AuthenticationService.Login($scope.email.toLowerCase(), $scope.password, function (response) {
                    if (response == "Login success") {
                        $scope.loading = false;
                        $scope.userFetched = true;
                        $location.path('/main');
                    } else {
                        $scope.openModal('sm', 'error', response);
                        $scope.loading = false;
                    }
                });
            }
        };

        $scope.openModal = function (size, type, dialog, showButtons, method) {

            if (type == 'success') {
                $scope.messageType = type;
            } else if (type == 'error') {
                $scope.messageType = type;
            }

            if (showButtons) {
                $scope.showBothButtons = true;
            }
            $scope.modalDialog = dialog;
            $scope.method = method;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modal.html',
                controller: 'ModalController',
                size: size,
                scope: $scope,
                resolve: {}
            });

            modalInstance.result.then(function () {
                console.log('modal ok');
                if ($scope.currentMethod) {
                    $scope.menuSelect($scope.currentMethod, true);
                }
            }, function () {
                console.log('modal cancel');
            });
        };

        $scope.forgotPassword = function (size) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/forgot-password.html',
                controller: 'ForgotPasswordController',
                size: size,
                resolve: {}
            });

            modalInstance.result.then(function () {
                //console.log('modal ok');
            }, function () {
                //console.log('modal cancel');
            });
        };

        $scope.changePage = function (url) {
            window.location.href = url;
        };

        function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (email.indexOf('.html') == -1 && email.indexOf('/') == -1) {
                return re.test(email);
            }
        }

        $scope.checkReady = function (type, $event) {
            switch (type) {
                case 'login':
                    if ($scope.email && $scope.password && validateEmail($scope.email)) {
                        $scope.loginReady = true;
                    } else {
                        $scope.loginReady = false;
                    }
                    break;
            }
        };

    }]);
