'use strict';

/**
 * @ngdoc function
 * @name 2BanonymousApp.controller:ReplyCtrl
 * @description
 * # ReplyCtrl
 * Controller of the 2BanonymousApp
 */
angular.module('2BanonymousApp')
    .controller('ReplyCtrl', ['$scope', '$q', '$http', '$rootScope', '$location', 'DatabaseService', function ($scope, $q, $http, $rootScope, $location, DatabaseService) {

        var query_vars = $location.search();
        var messageId = query_vars.id;
        var to = query_vars.to;
        console.log(messageId);

        $scope.sendReplyMessage = function () {
            $scope.loading = true;
            var deferred = $q.defer();

            $http.post('http://2banonymous-production.us-west-2.elasticbeanstalk.com/', [{
                method: 'sendReply',
                msg: $scope.replyMessageBody,
                messageId: messageId
            }]).success(function (data) {
                $scope.loading = false;
                if (data == "Message has already been replied to") {
                    $scope.replyMessageError = true;
                    $scope.replyMessageResults = data;
                    console.log('Error: ' + data);
                } else {
                    $scope.replyMessageError = false;
                    $scope.replyMessageResults = "Reply message sent";
                }
                console.log('success');
            }).error(function (data) {
                $scope.loading = false;
                $scope.replyMessageError = true;
                $scope.replyMessageResults = data;
                console.log('Error: ' + data);
            });

            return deferred.promise;
        };

    }]);
