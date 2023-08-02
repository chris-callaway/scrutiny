'use strict';

/**
 * @ngdoc function
 * @name 2BanonymousApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the 2BanonymousApp
 */
angular.module('2BanonymousApp')
    .controller('MainCtrl', ['$scope', '$q', '$http', '$rootScope', 'DatabaseService', 'Upload', '$uibModal', function ($scope, $q, $http, $rootScope, DatabaseService, Upload, $uibModal) {

        function init() {
            if (localStorage.getItem('facebookUsername')) {
                $scope.facebookUsername = localStorage.getItem('facebookUsername');
            }
            if (localStorage.getItem('facebookPassword')) {
                $scope.facebookPassword = localStorage.getItem('facebookPassword');
            }

            //TODO: use for ads
            //var admobid = {};
            //if (/(android)/i.test(navigator.userAgent)) {
            //    admobid = { // for Android
            //        banner: 'ca-app-pub-6869992474017983/9375997553',
            //        interstitial: 'ca-app-pub-6869992474017983/1657046752'
            //    };
            //} else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
            //    admobid = { // for iOS
            //        banner: 'ca-app-pub-7749824076932324/3163066894',
            //        interstitial: 'ca-app-pub-7749824076932324/3163066894'
            //    };
            //} else {
            //    admobid = { // for Windows Phone
            //        banner: 'ca-app-pub-6869992474017983/8878394753',
            //        interstitial: 'ca-app-pub-6869992474017983/1355127956'
            //    };
            //}
            //
            if (( /(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent) )) {
                document.addEventListener('deviceready', initApp, false);
            } else {
                initApp();
            }

            function initApp() {
                cordova.plugins.notification.local.registerPermission(function (granted) {
                });

                function sendNotification(title, text, time, repeat) {
                    cordova.plugins.notification.local.hasPermission(function (granted) {
                        console.log('granted', granted);
                        cordova.plugins.notification.local.schedule({
                            title: title,
                            text: text,
                            at: new Date(),
                            sound: null
                        });
                    });
                }

                function checkForNotifications() {
                    var deferred = $q.defer();
                    $http.post($rootScope.serverEndpoint, [{
                        method: 'checkForNotifications',
                        user: $rootScope.user
                    }]).success(function (data) {
                        $scope.loading = false;
                        console.log('checkForNotifications success', data);
                        var notifications = data;
                        var string = "";
                        for (var i in notifications) {
                            console.log('i', notifications[i]);
                            if (!notifications[i].notified) {
                                string += "User " + notifications[i].scrutUser + ' ';
                            }
                        }
                        if (string.length > 0) sendNotification("SCRUTINIZED!!", string);
                        closeAllNotifications();
                        deferred.resolve();
                    }).error(function (data) {
                        $scope.loading = false;
                        $scope.openModal('sm', 'error', 'Failed to checkForNotifications');
                        console.log('Error: ' + data);
                        deferred.reject();
                    });
                    return deferred.promise;
                }

                function closeAllNotifications() {
                    $http.post($rootScope.serverEndpoint, [{
                        method: 'closeAllNotifications',
                        user: $rootScope.user
                    }]).success(function (data) {
                        console.log('closed all notifications');
                    }).error(function (data) {
                        console.log('Error closing notifications: ' + data);
                    });
                }

                // Android customization
                cordova.plugins.backgroundMode.setDefaults({text: 'Doing heavy tasks.'});
                // Enable background mode
                cordova.plugins.backgroundMode.enable();

                // Called when background mode has been activated
                cordova.plugins.backgroundMode.onactivate = function () {
                    setTimeout(function () {
                        // Modify the currently displayed notification
                        console.log('in background now');
                        cordova.plugins.backgroundMode.configure({
                            text: 'Running in background for more than 5s now.'
                        });
                    }, 300000);

                    setInterval(function () {
                        console.log('hit interval');
                        checkForNotifications();
                        //sendNotification('My title', 'some text');
                    }, 20000);
                };
            }
        }

        $scope.submitSocialAccount = function (type) {
            var deferred = $q.defer();
            $scope.loading = true;
            $http.post($rootScope.serverEndpoint, [{
                method: 'submitSocialAccount',
                type: type,
                username: $scope[type + 'Username'],
                password: $scope[type + 'Password'],
                sender: $rootScope.user
            }]).success(function (data) {
                $scope.loading = false;
                localStorage.setItem((type + 'Username'), $scope[type + 'Username']);
                localStorage.setItem((type + 'Password'), $scope[type + 'Password']);
                $scope[type + 'Saved'] = true;
                console.log('Success');
            }).error(function (data) {
                $scope.loading = false;
                $scope.openModal('sm', 'error', $scope.textMessageResults);
                console.log('Error: ' + data);
            });
            return deferred.promise;
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
            }, function () {
                console.log('modal cancel');
            });
        };

        init();

    }]);
