'use strict';

/**
 * @ngdoc function
 * @name 2BanonymousApp.controller:ForgotPasswordController
 * @description
 * # ForgotPasswordController
 * Controller of the 2BanonymousApp
 */
angular.module('2BanonymousApp')
    .controller('ForgotPasswordController', ['$scope', '$q', '$http', '$rootScope', 'DatabaseService', 'Upload', '$uibModalInstance', '$uibModal', function ($scope, $q, $http, $rootScope, DatabaseService, Upload, $uibModalInstance, $uibModal) {

        $scope.forgotPassword = function () {
            $scope.loading = true;
            $http.post('http://2banonymous-production.us-west-2.elasticbeanstalk.com/', [{
                method: 'forgotPassword',
                email: $scope.forgotPasswordEmail
            }]).success(function () {
                $scope.loading = false;
                $scope.messageSent = true;

            }).error(function (err) {
                $scope.loading = false;
                $scope.messageFailed = true;
            });

        };

        $scope.ok = function () {
            $uibModalInstance.close(); // pass in item to catch in resolve
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]);
