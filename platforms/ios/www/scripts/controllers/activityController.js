'use strict';

/**
 * @ngdoc function
 * @name 2BanonymousApp.controller:ActivityCtrl
 * @description
 * # ActivityCtrl
 * Controller of the 2BanonymousApp
 */
angular.module('2BanonymousApp')
    .controller('ActivityCtrl', ['$scope', '$q', '$http', '$rootScope', '$location', 'AuthenticationService', 'DatabaseService', '$uibModal', function ($scope, $q, $http, $rootScope, $location, AuthenticationService, DatabaseService, $uibModal) {

        $scope.getUsersFollowed = function (platform) {
            var deferred = $q.defer();
            $scope.loading = true;
            console.log('getting users followed');
            $http.post($rootScope.serverEndpoint, [{
                method: 'getUsersFollowed',
                sender: $rootScope.user,
                platform: platform
            }]).success(function (data) {
                $scope.loading = false;
                $scope.usersFollowed = data;
                console.log('success');
            }).error(function (data) {
                $scope.loading = false;
                $scope.openModal('sm', 'error', 'Failed to find followed users');
                console.log('Error: ' + data);
            });
            return deferred.promise;
        };

        $scope.updateUserFollowData = function (user) {
            var deferred = $q.defer();
            if ($rootScope.currentUser) {
                $scope.loading = true;
                console.log('updating users followed', $rootScope.currentUser);
                $http.post($rootScope.serverEndpoint, [{
                    method: 'updateUserFollowData',
                    user: $rootScope.user
                }]).success(function (data) {
                    $scope.loading = false;
                    if (data == 'Failed to communicate with server please try again') {
                        $scope.openModal('sm', 'error', data);
                    }
                    console.log('updated user follow data', data);
                    deferred.resolve();
                }).error(function (data) {
                    $scope.loading = false;
                    if (data == 'Failed to communicate with server please try again') {
                        $scope.openModal('sm', 'error', data);
                    }
                    $scope.openModal('sm', 'error', 'Failed to find followed users');
                    console.log('Error: ' + data);
                    deferred.reject();
                });
            }
            return deferred.promise;
        };

        //$scope.updateUserFollowData($rootScope.currentUser).then(function () {
        //    $scope.getUsersFollowed('fb');
        //});

        var ref = cordova.InAppBrowser.open('https://m.facebook.com', '_system', 'hidden=yes');
        ref.addEventListener('loadstart', function () {
            //ref.executeScript({file: "myscript.js"});
            console.log('load started');
        });

        cookieMaster.getCookieValue('https://m.facebook.com', 'datr', function (data) {
            console.log('cookie is', data);
        }, function (error) {
            if (error) {
                console.log('error: ' + error);
            }
        });


        //cookieMaster.getCookieValue('https://m.facebook.com', 'datr', function(data) {
        //    console.log('cookie is', data.cookieValue);
        //}, function(error) {
        //    if (error) {
        //        console.log('error: ' + error);
        //    }
        //});
    }]);
