'use strict';

/**
 * @ngdoc function
 * @name 2BanonymousApp.controller:AccountCreateCtrl
 * @description
 * # AccountCreateCtrl
 * Controller of the 2BanonymousApp
 */
angular.module('2BanonymousApp')
    .controller('AccountCreateCtrl', ['$scope', '$q', '$http', '$rootScope', '$location', 'DatabaseService', '$uibModal', function ($scope, $q, $http, $rootScope, $location, DatabaseService, $uibModal) {

        $scope.ready = [];

        $scope.saveAccount = function () {
            if (!$scope.agreeToTerms) {
                alert("Please agree to terms and conditions");
            } else {
                if ($scope.createAccountReady) {
                    validateForm().then(function (err) {
                        if (err) {
                            $scope.openModal('sm', 'error', err);
                            //$scope.errorMessage = err;
                        } else {
                            $scope.loading = true;
                            $scope.errorMessage = "";

                            var account = {};
                            account.firstName = $scope.firstname;
                            account.lastName = $scope.lastname;
                            account.city = $scope.city;
                            account.state = $scope.state;
                            account.password = ($scope.password && $scope.password.length > 0) ? $scope.password : null;
                            account.email = $scope.email.toLowerCase();
                            account.facebook = $scope.facebook;
                            account.phone = $scope.phone;
                            account.subscribed = $scope.subscribe;
                            account.carrier = 0;
                            account.joinDate = new Date();
                            account.dob = $scope.dob;
                            DatabaseService.createAccount(account).then(function (response) {
                                console.log('saved account', response);
                                $scope.loading = false;
                                $scope.accountSubmit = true;
                                $scope.openModal('sm', 'success', 'Please confirm your email address to log in.');
                                //$scope.confirmMessage = "Please confirm your email address to log in.";
                            }, function (err) {
                                console.log(err);
                                $scope.loading = false;
                                switch (err) {
                                    case 'email already exists':
                                        $scope.openModal('sm', 'error', 'Email already exists.');
                                        break;
                                    case 'Phone number already exists.':
                                        $scope.openModal('sm', 'error', 'Phone number already exists.');
                                        break;
                                }
                            });
                        }
                    }, function (err) {
                        $scope.loading = false;
                    });
                }
            }
        };

        function formatPhoneNumber(number, $event) {
            if ($event.keyCode != 8 && number.length == 3 && number.split('-') && number.split('-').length != 2) {
                number = number + "-";
            }
            if ($event.keyCode != 8 && number.length == 4 && number.split('-') && number.split('-').length != 2) {
                number = number.substring(0, 3) + "-" + number.substring(3);
            }
            if ($event.keyCode != 8 && number.length == 7 && number.split('-') && number.split('-').length != 3) {
                number = number + "-";
            }
            if ($event.keyCode != 8 && number.length == 8 && number.split('-') && number.split('-').length != 3) {
                number = number.substring(0, 7) + "-" + number.substring(7);
            }
            return number;
        }

        $scope.checkReady = function (type, $event) {
            switch (type) {
                case 'firstname':
                    if ($scope.firstname && $scope.firstname.length > 2) {
                        $scope.ready['firstname'] = true;
                    } else {
                        $scope.createAccountReady = false;
                    }
                    break;
                case 'lastname':
                    if ($scope.lastname && $scope.lastname.length > 2) {
                        $scope.ready['lastname'] = true;
                    } else {
                        $scope.createAccountReady = false;
                    }
                    break;
                case 'city':
                    if ($scope.city && $scope.city.length > 3) {
                        $scope.ready['city'] = true;
                    } else {
                        $scope.createAccountReady = false;
                    }
                    break;
                case 'email':
                    if ($scope.email && validateEmail($scope.email)) {
                        $scope.ready['email'] = true;
                    } else {
                        $scope.createAccountReady = false;
                    }
                    break;
                case 'password':
                    if ($scope.password && $scope.password.length > 3 && verifyPassword($scope.password)) {
                        $scope.ready['password'] = true;
                    } else {
                        $scope.createAccountReady = false;
                    }
                    break;
                case 'passwordConfirm':
                    if ($scope.password && $scope.passwordConfirm.length > 3 && verifyPassword($scope.passwordConfirm) && $scope.passwordConfirm == $scope.password) {
                        $scope.ready['passwordConfirm'] = true;
                    } else {
                        $scope.createAccountReady = false;
                    }
                    break;
                case 'phone':
                    $scope.phone = formatPhoneNumber($scope.phone, $event);
                    if ($scope.phone && $scope.phone.length > 0 && $scope.phone.match(/\d/g).length === 10 && $scope.verifyPhone(null, $scope.phone)) {
                        $scope.ready['phone'] = true;
                    } else {
                        $scope.createAccountReady = false;
                    }
                    break;
                case 'dob':
                    if (moment($scope.dob).isValid()) {
                        $scope.ready['dob'] = true;
                    } else {
                        $scope.createAccountReady = false;
                    }
                    break;
                case 'all':
                    if ($scope.ready['firstname'] && $scope.ready['lastname'] && $scope.ready['city'] && $scope.ready['email'] && $scope.ready['password'] && $scope.ready['phone'] && $scope.ready['dob']) {
                        $scope.createAccountReady = true;
                    } else {
                        $scope.createAccountReady = false;
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
            if (!$scope.email || !validateEmail($scope.email)) {
                error.push("Please enter a valid email.");
            }
            if (!$scope.password) {
                error.push("Please enter a password.");
            }
            if ($scope.password && !verifyPassword($scope.password)) {
                error.push("Please enter a valid password.");
            }
            if ($scope.phone && $scope.phone.length > 0 && $scope.phone.match(/\d/g).length !== 10) {
                error.push("Please enter a valid phone number.");
            }
            //if (!$scope.subscribe) {
            //    error.push("Please select a subscribe option.");
            //}
            if (!$scope.dob || (moment().year() - moment($scope.dob).year()) < 13) {
                error.push("Please enter your date of birth. (Must be at least 13 years old)");
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
            if (type) {
                switch (type) {
                    case 'text':
                        if ($scope.textTo) {
                            if ($scope.textTo.match(/\d/g).length === 10) {
                                if ($scope.textMessageResults == 'Please enter a valid phone number.') {
                                    $scope.textMessageResults = '';
                                }
                                $scope.phoneVerified = true;
                            } else {
                                if ($scope.textTo.length > 0) {
                                    $scope.phoneVerified = false;
                                }
                            }
                        } else {
                            if ($scope.textTo.length > 0) {
                                $scope.phoneVerified = false;
                            }
                        }
                        break;
                    case 'call':
                        if ($scope.callTo) {
                            if ($scope.callTo.match(/\d/g).length === 10) {
                                if ($scope.textMessageResults == 'Please enter a valid phone number.') {
                                    $scope.textMessageResults = '';
                                }
                                $scope.callVerified = true;
                            } else {
                                if ($scope.callTo.length > 0) {
                                    $scope.callVerified = false;
                                }
                            }
                        } else {
                            if ($scope.callTo.length > 0) {
                                $scope.callVerified = false;
                            }
                        }
                        break;
                }
            } else {
                if (phone.match(/\d/g).length === 10) {
                    return true;
                } else {
                    return false;
                }
            }
        };

        $scope.sendConfirmationEmail = function () {
            var deferred = $q.defer();
            if ($scope.confirmationEmail && validateEmail($scope.confirmationEmail)) {
                $scope.loading = true;

                $http.post($rootScope.serverEndpoint, [{
                    method: 'resendEmailConfirmation',
                    email: $scope.confirmationEmail
                }]).success(function (data) {
                    $scope.loading = false;
                    $scope.openModal('sm', 'success', 'Email confirmation sent.');
                    deferred.resolve();
                    console.log('success');
                }).error(function (data) {
                    $scope.loading = false;
                    $scope.replyMessageError = true;
                    $scope.replyMessageResults = data;
                    console.log('Error: ' + data);
                });
            } else {
                $scope.openModal('sm', 'error', 'Please enter a valid email.');
                deferred.resolve();
            }
            return deferred.promise;
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
            $scope.method = 'signUp';

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
