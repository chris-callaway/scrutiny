'use strict';

/**
 * @ngdoc function
 * @name 2BanonymousApp.controller:PrivacyCtrl
 * @description
 * # ConfirmationCtrl
 * Controller of the 2BanonymousApp
 */
angular.module('2BanonymousApp')
    .controller('PrivacyCtrl', ['$scope', '$q', '$http', '$rootScope', '$location', 'DatabaseService', function ($scope, $q, $http, $rootScope, $location, DatabaseService) {
        $rootScope.navigationActive = true;

    }]);
