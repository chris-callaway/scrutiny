'use strict';

/**
 * @ngdoc function
 * @name 2BanonymousApp.controller:ModalController
 * @description
 * # ModalController
 * Controller of the 2BanonymousApp
 */
angular.module('2BanonymousApp')
    .controller('ModalController', ['$scope', '$q', '$http', '$rootScope', 'DatabaseService', 'Upload', '$uibModalInstance', function ($scope, $q, $http, $rootScope, DatabaseService, Upload, $uibModalInstance) {

        $scope.ok = function () {
            $rootScope.facebookSearchResults = null;
            $uibModalInstance.close(); // pass in item to catch in resolve
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]);
