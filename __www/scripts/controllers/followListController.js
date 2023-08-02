'use strict';

/**
 * @ngdoc function
 * @name 2BanonymousApp.controller:FollowListCtrl
 * @description
 * # FollowListCtrl
 * Controller of the 2BanonymousApp
 */
angular.module('2BanonymousApp')
    .controller('FollowListCtrl', ['$scope', '$q', '$http', '$rootScope', '$location', 'AuthenticationService', 'DatabaseService', '$uibModal', function ($scope, $q, $http, $rootScope, $location, AuthenticationService, DatabaseService, $uibModal) {

        $scope.facebookFollowResults = null;

        $scope.saveFollowFacebookUser = function () {
            console.log('submitting data');
            var deferred = $q.defer();
            $scope.loading = true;
            $http.post($rootScope.serverEndpoint, [{
                method: 'saveFollowFacebookUser',
                sender: $rootScope.user,
                facebookFollow: $scope.facebookFollow
            }]).success(function (data) {
                $scope.clearFields();
                $scope.loading = false;
                $scope.facebookFollowResults = data;
                console.log('success');
            }).error(function (data) {
                $scope.loading = false;
                $scope.openModal('sm', 'error', $scope.textMessageResults);
                console.log('Error: ' + data);
            });
            return deferred.promise;
        };

    }]);
