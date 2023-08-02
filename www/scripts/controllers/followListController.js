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
                facebookUsername: $rootScope.currentUser.fb_username,
                facebookPassword: $rootScope.currentUser.fb_password,
                sender: $rootScope.user,
                facebookFollow: $scope.facebookFollow
            }]).success(function (data) {
                $scope.loading = false;
                console.log('save success', JSON.parse(data.fb_follow));
                $scope.followedUsers = JSON.parse(data.fb_follow);
                console.log('success');
            }).error(function (data) {
                $scope.loading = false;
                $scope.openModal('sm', 'error', $scope.textMessageResults);
                console.log('Error: ' + data);
            });
            return deferred.promise;
        };

        $scope.getFollowedUsers = function () {
            var deferred = $q.defer();
            $scope.loading = true;
            $http.post($rootScope.serverEndpoint, [{
                method: 'getUser',
                user: $rootScope.user
            }]).success(function (data) {
                $scope.loading = false;
                console.log('received it', data);
                $scope.followedUsers = JSON.parse(data.fb_follow);
                console.log('success', $scope.followedUsers);
            }).error(function (data) {
                $scope.loading = false;
                $scope.openModal('sm', 'error', 'Failed to find followed users');
                console.log('Error: ' + data);
            });
            return deferred.promise;
        };

        $scope.getFollowedUsers();

        $scope.deleteUser = function (index) {
            var deferred = $q.defer();
            $scope.loading = true;
            $http.post($rootScope.serverEndpoint, [{
                method: 'deleteFollowedUser',
                user: $rootScope.user,
                index: index
            }]).success(function (data) {
                $scope.loading = false;
                console.log('received it', data);
                $scope.followedUsers.splice(index, 1);
                console.log('success');
            }).error(function (data) {
                $scope.loading = false;
                $scope.openModal('sm', 'error', 'Failed to delete followed user');
                console.log('Error: ' + data);
            });
            return deferred.promise;
        }

    }]);
