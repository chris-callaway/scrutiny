'use strict';

/**
 * @ngdoc function
 * @name 2BanonymousApp.controller:ConfirmationCtrl
 * @description
 * # ConfirmationCtrl
 * Controller of the 2BanonymousApp
 */
angular.module('2BanonymousApp')
    .controller('ConfirmationCtrl', ['$scope', '$q', '$http', '$rootScope', '$location', 'DatabaseService', function ($scope, $q, $http, $rootScope, $location, DatabaseService) {

        $scope.verificationResults = "Verifying...";
        var query_vars = $location.search();
        var verificationCode = query_vars.verificationCode;
        var changingEmail = query_vars.changingEmail;
        var newEmail = query_vars.newEmail;
        var email = query_vars.from;

        console.log('from', email);

        $scope.getConfirmation = function () {
            $scope.loading = true;
            var deferred = $q.defer();

            $http.post('http://2banonymous-production.us-west-2.elasticbeanstalk.com/', [{
                method: 'emailConfirmation',
                code: verificationCode,
                email: email
            }]).success(function (data) {
                $scope.loading = false;
                $scope.verificationResults = data;
                console.log('success');
                deferred.resolve();
            }).error(function (data) {
                $scope.loading = false;
                $scope.verificationResults = data;
                console.log('Error: ' + data);
                deferred.reject(data);
            });

            return deferred.promise;
        };

        $scope.getConfirmation().then(function () {
            if (changingEmail) {
                $http.post('http://2banonymous-production.us-west-2.elasticbeanstalk.com/', [{
                    method: 'replaceEmail',
                    email: email,
                    newEmail: newEmail
                }]).success(function (data) {
                    $scope.loading = false;
                    $scope.verificationResults = data;
                    console.log('success');
                }).error(function (data) {
                    $scope.loading = false;
                    $scope.verificationResults = data;
                    console.log('Error: ' + data);
                });
            }
        });

    }]);
