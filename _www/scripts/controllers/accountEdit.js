'use strict';

/**
 * @ngdoc function
 * @name 2BanonymousApp.controller:AccountCreateCtrl
 * @description
 * # AccountEditCtrl
 * Controller of the 2BanonymousApp
 */
angular.module('2BanonymousApp')
    .controller('AccountEditCtrl', ['$scope', '$q', '$http', '$rootScope', '$location', 'DatabaseService', '$uibModal', function ($scope, $q, $http, $rootScope, $location, DatabaseService, $uibModal) {

        $scope.getUser = function () {
            $scope.loading = true;
            var deferred = $q.defer();
            console.log('checking for user', $rootScope.globals.currentUser.email);
            DatabaseService.getUser($rootScope.globals.currentUser.email).then(function (user) {
                $scope.userFetched = true;
                console.log('fetched user', user);
                deferred.resolve(user);
            }, function (err) {
                console.log('failed to get user', err);
            });
            return deferred.promise;
        };

        $scope.getUser().then(function (user) {
            $scope.loading = false;
            $scope.message = null;
            console.log('have user', user);
            $scope.ready = [];
            $scope.firstname = user.firstname;
            $scope.lastname = user.lastname;
            $scope.city = user.city;
            $scope.state = user.state;
            $scope.email = user.email.toLowerCase();
            $scope.facebook = user.facebook;
            $scope.phone = user.phone;
            $scope.subscribe = user.subscribed;
            $scope.checkReady('firstname');
            $scope.checkReady('lastname');
            $scope.checkReady('city');
            $scope.checkReady('email');
            $scope.checkReady('password');
            $scope.checkReady('phone');
            $scope.checkReady('all');
        }, function (err) {
            $scope.loading = false;
            console.log(err);
        });

        $scope.updateAccount = function () {

            console.log('updating');
            if ($scope.editAccountReady) {
                validateForm().then(function (err) {
                    if (err) {
                        console.log('not validated', err);
                        $scope.openModal('sm', 'error', err);
                        //$scope.errorMessage = err;
                    } else {
                        $scope.loading = true;
                        $scope.errorMessage = "";
                        var account = {};
                        account.firstname = $scope.firstname;
                        account.lastname = $scope.lastname;
                        account.city = $scope.city;
                        account.state = $scope.state;
                        account.subscribed = $scope.subscribe;
                        account.carrier = 0;
                        account.phone = $scope.phone;
                        account.joinDate = new Date();
                        DatabaseService.updateAccount($rootScope.globals.currentUser.email, account).then(function (response) {
                            $scope.loading = false;
                            $scope.openModal('sm', 'success', 'Updated account successfully.');
                            //$scope.confirmMessage = "Updated account successfully";
                            console.log(response);
                        }, function (err) {
                            console.log(err);
                            $scope.openModal('sm', 'error', err);
                        });
                    }
                });
            }
        };

        $scope.checkIfEmailExists = function (email) {
            var deferred = $q.defer();
            DatabaseService.checkIfEmailExists(email).then(function (exists) {
                if (!exists) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            }, function (err) {
                console.log('failed to check if email exists', err);
                deferred.reject();
            });
            return deferred.promise;
        };

        $scope.changingEmail = false;
        $scope.changingPassword = false;

        $scope.changeEmail = function () {
            $scope.loading = true;
            $scope.message = null;
            $scope.checkIfEmailExists($scope.newEmail).then(function () {
                var account = {};
                account.email = $scope.changeEmailCurrentEmail.toLowerCase();
                account.password = $scope.changeEmailCurrentPassword;
                account.newEmail = $scope.newEmail.toLowerCase();

                DatabaseService.changeEmail($rootScope.globals.currentUser.email.toLowerCase(), account).then(function (response) {
                    $scope.loading = false;
                    $scope.openModal('sm', 'success', 'Email confirmation sent.');
                    //$scope.confirmMessage = "Email confirmation sent.";
                    console.log(response);
                }, function (err) {
                    console.log(err);
                    $scope.loading = false;
                    $scope.openModal('sm', 'error', 'Change email failed.  Please ensure your password is correct.');
                    //$scope.confirmMessage = "Change email failed.  Please ensure your password is correct.";
                });
            }, function (err) {
                $scope.loading = false;
                $scope.openModal('sm', 'error', 'Change email failed.  Email is already in use.');
                //$scope.confirmMessage = "Change email failed.  Email is already in use.";
            });
        };

        $scope.changePassword = function () {
            $scope.loading = true;
            var account = {};
            account.email = $rootScope.globals.currentUser.email;
            account.password = $scope.changePasswordCurrentPassword;
            account.newPassword = $scope.changePasswordNewPasswordConfirm;

            DatabaseService.changePassword($rootScope.globals.currentUser.email, account).then(function (response) {
                $scope.loading = false;
                $scope.openModal('sm', 'success', 'Changed password successfully.');
                //$scope.confirmMessage = "Changed password successfully";
                console.log(response);
            }, function (err) {
                console.log(err);
                $scope.loading = false;
                $scope.openModal('sm', 'error', 'Change password failed.  Please ensure your current password is correct.');
                //$scope.confirmMessage = "Change password failed.  Please ensure your current password is correct.";
            });
        };

        $scope.checkReady = function (type) {
            switch (type) {
                case 'firstname':
                    if ($scope.firstname && $scope.firstname.length > 2) {
                        console.log('settings ready to true', $scope.ready);
                        $scope.ready['firstname'] = true;
                    } else {
                        $scope.editAccountReady = false;
                    }
                    break;
                case 'lastname':
                    if ($scope.lastname && $scope.lastname.length > 2) {
                        $scope.ready['lastname'] = true;
                    } else {
                        $scope.editAccountReady = false;
                    }
                    break;
                case 'city':
                    if ($scope.city && $scope.city.length > 3) {
                        $scope.ready['city'] = true;
                    } else {
                        $scope.editAccountReady = false;
                    }
                    break;
                case 'email':
                    if ($scope.email && validateEmail($scope.email)) {
                        $scope.ready['email'] = true;
                    } else {
                        $scope.editAccountReady = false;
                    }
                    break;
                case 'password':
                    if ($scope.password && $scope.password.length > 3 && verifyPassword($scope.password)) {
                        $scope.ready['password'] = true;
                    } else {
                        $scope.editAccountReady = false;
                    }
                    break;
                case 'passwordConfirm':
                    if ($scope.password && $scope.passwordConfirm.length > 3 && verifyPassword($scope.passwordConfirm) && $scope.passwordConfirm == $scope.password) {
                        $scope.ready['passwordConfirm'] = true;
                    } else {
                        $scope.editAccountReady = false;
                    }
                    break;
                case 'phone':
                    if ($scope.phone && $scope.phone.length > 0 && $scope.phone.match(/\d/g).length === 10 && $scope.verifyPhone(null, $scope.phone)) {
                        $scope.ready['phone'] = true;
                    } else {
                        $scope.editAccountReady = false;
                    }
                    break;
                case 'changePasswordCurrentPassword':
                    if ($scope.changePasswordCurrentPassword && $scope.changePasswordCurrentPassword.length > 3 && verifyPassword($scope.changePasswordCurrentPassword)) {
                        $scope.ready['changePasswordCurrentPassword'] = true;
                    } else {
                        $scope.editAccountReady = false;
                    }
                    break;
                case 'changePasswordNewPassword':
                    if ($scope.changePasswordNewPassword && $scope.changePasswordNewPassword.length > 3 && verifyPassword($scope.changePasswordNewPassword)) {
                        $scope.ready['changePasswordNewPassword'] = true;
                    } else {
                        $scope.editAccountReady = false;
                    }
                    break;
                case 'changePasswordNewPasswordConfirm':
                    if ($scope.changePasswordNewPasswordConfirm && $scope.changePasswordNewPasswordConfirm.length > 3 && verifyPassword($scope.changePasswordNewPasswordConfirm) && $scope.changePasswordNewPasswordConfirm == $scope.changePasswordNewPassword) {
                        $scope.ready['changePasswordNewPasswordConfirm'] = true;
                    } else {
                        $scope.editAccountReady = false;
                    }
                    break;
                case 'changeEmailCurrentEmail':
                    if ($scope.changeEmailCurrentEmail && validateEmail($scope.changeEmailCurrentEmail)) {
                        $scope.ready['changeEmailCurrentEmail'] = true;
                    } else {
                        $scope.changeEmailReady = false;
                    }
                    break;
                case 'changeEmailCurrentPassword':
                    if ($scope.changeEmailCurrentPassword && validateEmail($scope.changeEmailCurrentPassword)) {
                        $scope.ready['changeEmailCurrentPassword'] = true;
                    } else {
                        $scope.changeEmailReady = false;
                    }
                    break;
                case 'changeEmailNewEmail':
                    if ($scope.changeEmailCurrentPassword && validateEmail($scope.changeEmailCurrentPassword)) {
                        $scope.ready['changeEmailNewEmail'] = true;
                    } else {
                        $scope.changeEmailReady = false;
                    }
                    break;
                case 'all':
                    // edit account
                    if ($scope.ready['firstname'] && $scope.ready['lastname'] && $scope.ready['city'] && $scope.ready['email'] && $scope.ready['phone'] && $scope.state) {
                        $scope.editAccountReady = true;
                    } else {
                        $scope.editAccountReady = false;
                    }
                    // change password
                    if ($scope.ready['changePasswordCurrentPassword'] && $scope.ready['changePasswordNewPassword'] && $scope.ready['changePasswordNewPasswordConfirm']) {
                        $scope.changePasswordReady = true;
                    } else {
                        $scope.changePasswordReady = false;
                    }
                    // change email
                    if ($scope.ready['changeEmailCurrentEmail'] && $scope.ready['changeEmailCurrentPassword'] && $scope.ready['changeEmailNewEmail']) {
                        $scope.changeEmailReady = true;
                    } else {
                        $scope.changeEmailReady = false;
                    }
                    break;
            }
        };

        function validateForm() {
            var deferred = $q.defer();
            var error = [];
            if (!$scope.firstname) {
                error.push("Please enter a first name.");
            }
            if (!$scope.lastname) {
                error.push("Please enter a last name.");
            }
            if (!$scope.city) {
                error.push("Please enter a city.");
            }
            if (!$scope.state) {
                error.push("Please enter a state.");
            }
            if (!$scope.subscribe) {
                error.push("Please select a subscribe option.");
            }
            if ($scope.phone && $scope.phone.length > 0 && $scope.phone.match(/\d/g).length !== 10) {
                error.push("Please enter a valid phone number.");
            }
            if (error && error.length > 0) {
                deferred.resolve(error);
            } else {
                deferred.resolve();
            }
            return deferred.promise;
        }

        function verifyPassword(password) {
            return true;
        }

        function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (email.indexOf('.html') == -1 && email.indexOf('/') == -1) {
                return re.test(email);
            }
        }

        $scope.verifyPhone = function (type, phone) {
            if (phone.match(/\d/g).length === 10) {
                return true;
            } else {
                return false;
            }
        };

        $scope.openModal = function (size, type, dialog, showButtons) {

            if (type == 'success') {
                $scope.messageType = type;
            } else if (type == 'error') {
                $scope.messageType = type;
            }

            if (showButtons) {
                $scope.showBothButtons = true;
            }
            $scope.method = 'accountEdit';

            $scope.modalDialog = dialog;
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
                if (type == 'success') {
                    $location.path('/');
                }
                console.log('modal cancel');
            });
        };

    }]);
