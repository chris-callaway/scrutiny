'use strict';

/**
 * @ngdoc function
 * @name 2BanonymousApp.controller:MyMessagesCtrl
 * @description
 * # ReplyCtrl
 * Controller of the 2BanonymousApp
 */
angular.module('2BanonymousApp')
    .controller('MyMessagesCtrl', ['$scope', '$q', '$http', '$rootScope', '$location', 'DatabaseService', 'Pagination', '$timeout', function ($scope, $q, $http, $rootScope, $location, DatabaseService, Pagination, $timeout) {

        $scope.loading = true;
        $scope.pagination = Pagination.getNew(5);

        $scope.getMessages = function () {
            var deferred = $q.defer();
            $scope.loading = true;
            $http.post('http://2banonymous-production.us-west-2.elasticbeanstalk.com/', [{
                method: 'getMessages',
                sender: $rootScope.globals.currentUser.email
            }]).success(function (data) {
                $scope.loading = false;
                $scope.getMessagesError = false;
                $scope.getMessagesResults = "Messages fetched successfully";
                deferred.resolve(formatMessages(data, true));
                console.log('success');
            }).error(function (data) {
                $scope.loading = false;
                $scope.getMessagesError = true;
                $scope.getMessagesResults = "Failed to fetch messages, please try again later.";
                deferred.reject(data);
                console.log('Error: ' + data);
            });

            return deferred.promise;
        };

        function formatMessages(messages, gatherTypes) {
            var formatted = [];
            var output = [];
            if (gatherTypes) {
                $rootScope.messageTypes = ['All'];
            }
            angular.forEach(messages, function (v, i) {
                if (formatted.indexOf(v.to.toLowerCase()) === -1 && typeof v.to === "string" && v.to.length > 0) {
                    v.to = v.to.toLowerCase();
                    if (v.type == 'twitter') {
                        v.to = 'twitter';
                    }
                    formatted.push(v.to.toLowerCase());
                    if ($rootScope.messageTypes.indexOf(v.type.toLowerCase()) === -1 && gatherTypes) {
                        $rootScope.messageTypes.push(v.type.toLowerCase());
                    }
                }
            });
            angular.forEach(formatted, function (v, i) {
                output.push(v);
                output[i] = [];
                angular.forEach(messages, function (value, index) {
                    if (v == value.to.toLowerCase()) {
                        output[i].push(value);
                    }
                });
            });
            return output;
        }

        $scope.getMessages().then(function (messages) {
            //console.log(messages);
            $scope.messages = messages;
            $rootScope.currentList = $scope.messages;
            console.log('messages', messages);
            console.log('message types', $rootScope.messageTypes);
            $scope.inboxFilter = $rootScope.messageTypes[0];
        }, function (err) {
            $scope.getMessagesError = true;
            $scope.getMessagesResults = err;
        });

        $scope.setCurrentLog = function (item, $event) {
            var output = [];
            angular.forEach(item, function (v, i) {
                output.push(v);
            });
            $scope.currentLog = output;
            $scope.pagination.numPages = Math.ceil($scope.currentLog.length / $scope.pagination.perPage);
            $scope.pagination.page = 0;
            angular.element('#inbox-from li').css('background', 'white');
            angular.element($event.target).css('background', '#f4f4f6');
        };

        $scope.initMailFilter = function () {
            if ($rootScope.searchEnabled) {
                $rootScope.currentSearchResults = [];
                if ($scope.inboxFilter.toLowerCase() == 'all') {
                    $rootScope.currentSearchResults = $rootScope.searchResults;
                } else {
                    for (var i = 0; i < $rootScope.searchResults.length; i++) {
                        if ($rootScope.searchResults[i][0].type && $rootScope.searchResults[i][0].type.toLowerCase() == $scope.inboxFilter.toLowerCase()) {
                            $rootScope.currentSearchResults.push($rootScope.searchResults[i]);
                        }
                    }
                }
            } else {
                $rootScope.currentList = [];
                if ($scope.inboxFilter.toLowerCase() == 'all') {
                    $rootScope.currentList = $scope.messages;
                } else {
                    for (var i = 0; i < $scope.messages.length; i++) {
                        if ($scope.messages[i][0].type && $scope.messages[i][0].type.toLowerCase() == $scope.inboxFilter.toLowerCase()) {
                            $rootScope.currentList.push($scope.messages[i]);
                        }
                    }
                }
            }
        };

        $scope.initSearch = function () {
            $scope.searchMail().then(function (messages) {
                $rootScope.searchEnabled = true;
                $rootScope.searchResults = messages;
                $rootScope.currentSearchResults = messages;

            }, function (err) {
                $scope.getMessagesError = true;
                $scope.getMessagesResults = "Failed to fetch messages, please try again later.";
            });
        };

        $scope.searchMail = function () {
            console.log('term', $scope.mailSearchTerm);
            var deferred = $q.defer();
            $scope.loading = true;
            $http.post('http://2banonymous-production.us-west-2.elasticbeanstalk.com/', [{
                method: 'getMessages',
                searchTerm: $scope.mailSearchTerm,
                sender: $rootScope.globals.currentUser.email
            }]).success(function (data) {
                $scope.loading = false;
                $scope.getMessagesError = false;
                $scope.getMessagesResults = "Messages fetched successfully";
                deferred.resolve(formatMessages(data, true));
                console.log('success');
            }).error(function (data) {
                $scope.loading = false;
                $scope.getMessagesError = true;
                $scope.getMessagesResults = "Failed to fetch messages, please try again later.";
                deferred.reject(data);
                console.log('Error: ' + data);
            });

            return deferred.promise;
        };
    }]);
