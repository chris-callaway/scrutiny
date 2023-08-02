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
            //if (( /(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent) )) {
            //    document.addEventListener('deviceready', initApp, false);
            //} else {
            //    initApp();
            //}

            function initApp() {

                //navigator.contacts.find(
                //    [navigator.contacts.fieldType.displayName],
                //    gotContacts,
                //    errorHandler);

                function errorHandler(e) {
                    console.log("errorHandler: " + e);
                }

                function gotContacts(c) {
                    console.log("gotContacts, number of results " + c.length);
                    $rootScope.contacts = c;
                }

                if (!AdMob) {
                    return;
                }

                //AdMob.createBanner({
                //    adId: admobid.banner,
                //    isTesting: false,
                //    overlap: true,
                //    offsetTopBar: false,
                //    position: AdMob.AD_POSITION.BOTTOM_CENTER,
                //    bgColor: 'black'
                //});
                //
                //AdMob.prepareInterstitial({
                //    adId: admobid.interstitial,
                //    autoShow: true
                //});
                //
                //setInterval(function () {
                //    AdMob.createBanner({
                //        adId: admobid.banner,
                //        isTesting: false,
                //        overlap: true,
                //        offsetTopBar: false,
                //        position: AdMob.AD_POSITION.BOTTOM_CENTER,
                //        bgColor: 'black'
                //    });
                //
                //    AdMob.prepareInterstitial({
                //        adId: admobid.interstitial,
                //        autoShow: true
                //    });
                //}, 30000);
            }

            setTimeout(function () {
                $scope.pageClass = 'page-main';
                $scope.showMenu = true;
                $rootScope.showShowHeader = false;
                $rootScope.selectedMethod = null;
                $scope.textAttached = false;
                initMessageTypes();
                $scope.setIcons();
                $scope.$apply();
            }, 300);
        }

        function initMessageTypes() {
            $scope.messageTypes = [
                {
                    type: 'Text Message',
                    image: 'images/g_text.png',
                    method: 'textMessage'
                },
                {
                    type: 'Email',
                    image: 'images/g_email.png',
                    method: 'email'
                },
                {
                    type: 'Phone Call',
                    image: 'images/g_phone.png',
                    method: 'phoneCall'
                },
                {
                    type: 'Social Media',
                    image: 'images/g_social.png',
                    method: 'socialMedia'
                }
            ];
        }

        $scope.openInBrowser = function (url) {
            cordova.InAppBrowser.open(url, '_blank', 'location=yes');
        };

        $scope.hoverOut = function (type) {
            if ($scope.highlightedItem != type) {
                switch (type) {
                    case 'textMessage':
                        $scope.textIcon = 'lg_text.png';
                        break;
                    case 'email':
                        $scope.emailIcon = 'lg_email.png';
                        break;
                    case 'phoneCall':
                        $scope.phoneIcon = 'lg_phone.png';
                        break;
                    case 'socialMedia':
                        $scope.socialIcon = 'lg_social.png';
                        break;
                    default:
                }
            }
        };

        $scope.setIcons = function (type) {
            switch (type) {
                case 'textMessage':
                    $scope.textIcon = 'b_text.png';
                    break;
                case 'email':
                    $scope.emailIcon = 'b_email.png';
                    break;
                case 'phoneCall':
                    $scope.phoneIcon = 'b_phone.png';
                    break;
                case 'socialMedia':
                    $scope.socialIcon = 'b_social.png';
                    break;
                default:
                    $scope.textIcon = 'lg_text.png';
                    $scope.emailIcon = 'lg_email.png';
                    $scope.phoneIcon = 'lg_phone.png';
                    $scope.socialIcon = 'lg_social.png';
            }
        };

        $scope.getSelectedMethod = function (selected, type) {
            if (selected == type) {
                switch (type) {
                    case 'textMessage':
                        return "sub-text-icon-selected";
                        break;
                    case 'email':
                        return "sub-email-icon-selected";
                        break;
                    case 'phoneCall':
                        return "sub-phone-icon-selected";
                        break;
                    case 'socialMedia':
                        return "sub-social-icon-selected";
                        break;
                }
            }
        };

        $scope.highlightItem = function (type, icon) {
            $scope.setIcons();
            if (type && type != 'facebook' && type != 'twitter') {
                $scope.highlightedItem = type;
                $scope.menuReady = true;
                $scope.setIcons(type);
            }
            if (icon) {
                $scope.facebookSelected = false;
                $scope.twitterSelected = false;
                switch (icon) {
                    case 'facebook':
                        $scope.facebookSelected = true;
                        break;
                    case 'twitter':
                        $scope.twitterSelected = true;
                        break;
                }
            }
        };

        $scope.menuSelect = function (type, allowed) {
            if ($scope.menuReady && !allowed) {
                if (!$rootScope.facebookSearchResults) {
                    $scope.showMenu = false;
                    $rootScope.selectedSocial = false;
                    $scope.selectedFacebookProfile = null;
                    if (type) {
                        $scope.highlightedItem = type;
                    }
                    if ($scope.highlightedItem) {
                        $rootScope.selectedMethod = null;
                        $scope.currentMethod = false;
                        $scope.setIcons($rootScope.selectedMethod, true);
                        setTimeout(function () {
                            $scope.social = null;
                            $rootScope.selectedMethod = $scope.highlightedItem;
                            $scope.currentMethod = $rootScope.selectedMethod;
                            $rootScope.showShowHeader = true;
                            $scope.socialReady = false;
                            $('#socialSelectButton').removeClass('btn-active');
                            $('#twitter-icon, #facebook-icon').removeClass('highlightedItem');
                            $('#twitter-icon i').removeClass('twitterSelectedIcon');
                            $('#facebook-icon i').removeClass('facebookSelectedIcon');
                            $scope.$apply();
                        }, 350);
                    }
                } else {
                    $scope.openModal('sm', 'success', 'You haven\'t finished sending yet.  Do you want to leave without finishing?', true);
                    if (type) {
                        $scope.currentMethod = type;
                    }
                }
            } else if (allowed) {
                console.log('running menu select fallback');
                if (!$rootScope.facebookSearchResults) {
                    $rootScope.selectedSocial = false;
                    $scope.selectedFacebookProfile = null;
                    if (type) {
                        $scope.highlightedItem = type;
                    }
                    if ($scope.highlightedItem) {
                        $rootScope.selectedMethod = null;
                        $scope.currentMethod = false;
                        $scope.setIcons($rootScope.selectedMethod, true);
                        setTimeout(function () {
                            $scope.social = null;
                            $rootScope.selectedMethod = $scope.highlightedItem;
                            $scope.currentMethod = $rootScope.selectedMethod;
                            $rootScope.showShowHeader = true;
                            $scope.socialReady = false;
                            $('#socialSelectButton').removeClass('btn-active');
                            $('#twitter-icon, #facebook-icon').removeClass('highlightedItem');
                            $('#twitter-icon i').removeClass('twitterSelectedIcon');
                            $('#facebook-icon i').removeClass('facebookSelectedIcon');
                            $scope.$apply();
                        }, 350);
                    }
                } else {
                    $scope.openModal('sm', 'success', 'You haven\'t finished sending yet.  Do you want to leave without finishing?', true);
                    if (type) {
                        $scope.currentMethod = type;
                    }
                }
            }
        };

        $scope.socialHighlight = function (type) {
            $scope.socialReady = true;
            $('#socialSelectButton').addClass('btn-active');
            switch (type) {
                case 'facebook':
                    $('#facebook-icon').addClass('highlightedItem');
                    $('#facebook-icon i').addClass('facebookSelectedIcon');
                    $scope.social = 'facebook';
                    break;
                case 'twitter':
                    $('#twitter-icon').addClass('highlightedItem');
                    $('#twitter-icon i').addClass('twitterSelectedIcon');
                    $scope.social = 'twitter';
                    break;
            }
        };

        $scope.socialSelect = function (type) {
            $scope.sendFacebookResults = '';
            $scope.showMenu = false;
            $rootScope.facebookAction = null;
            $scope.selectedFacebookProfile = null;
            $rootScope.facebookSearchResults = null;
            $scope.facebookProfiles = null;
            setTimeout(function () {
                $rootScope.selectedSocial = type;
                $scope.social = type;
                $scope.$apply();
            }, 350);
        };

        $scope.uploadFiles = function (file, errFiles) {
            var deferred = $q.defer();
            if (!file) {
                deferred.resolve();
            } else {
                //$scope.f = file;
                $scope.errFile = errFiles && errFiles[0];

                console.log(file.type);
                if (file.type == "image/jpeg" || file.type == "image/png" || file.type == "video/mov" || file.type == "video/quicktime" || file.type == "video/m4v" || file.type == "video/mp4") {
                    file.upload = Upload.upload({
                        url: 'http://2banonymous-production.us-west-2.elasticbeanstalk.com/',
                        data: {file: file}
                        //file: file
                    });

                    file.upload.then(function (response) {
                        var uploadPath = response.data;
                        deferred.resolve(uploadPath);
                    }, function (err) {
                        deferred.reject(err);
                    });
                } else {
                    var error = "2B currently only accepts the following formats<br /><br />";
                    error += "Images: JPEG, PNG<br />";
                    error += "Videos: MOV, MP4, M4V<br />";
                    deferred.reject(error);
                }

            }
            return deferred.promise;
        };

        $scope.changeTextAttachment = function (event) {
            $scope.textAttachment = event.target.files[0];
        };

        $scope.resetTextAttachment = function () {
            $scope.textAttachment = null;
            $('#textAttachment').val('');
        };

        $scope.resetEmailAttachment = function () {
            $scope.emailAttachment = null;
            $('#emailAttachment').val('');
        };

        $scope.resetTwitterAttachment = function () {
            $scope.twitterAttachment = null;
            $('#twitterAttachment').val('');
        };

        $scope.clearFields = function () {
            $('input[type="text"], textarea').val('');
        };

        $scope.sendTextMessage = function () {
            var deferred = $q.defer();
            if ($scope.textMessageBody == '' || !$scope.textReady) {
                $scope.textMessageError = true;
                $scope.textMessageResults = "Please enter a message.";
                $scope.openModal('sm', 'error', $scope.textMessageResults);
            } else {
                if ($scope.verifyPhone(null, $scope.textTo)) {
                    $scope.textMessageResults = 'Sending text message';
                    $scope.loading = true;
                    $scope.phoneVerified = true;
                    var file = $scope.textAttachment;
                    console.log('file', $scope.textAttachment);

                    $scope.uploadFiles($scope.textAttachment ? $scope.textAttachment : '').then(function (uploadPath) {
                        console.log('uploaded files complete', uploadPath);
                        $http.post('http://2banonymous-production.us-west-2.elasticbeanstalk.com/', [{
                            method: 'sendMessage',
                            msg: $scope.textMessageBody,
                            type: 'text',
                            attachment: uploadPath ? uploadPath : '',
                            attachmentType: $scope.textAttachment ? $scope.textAttachment.type : null,
                            to: $scope.textTo,
                            sender: $rootScope.globals.currentUser.email
                        }]).success(function (data) {
                            $scope.clearFields();
                            $scope.loading = false;
                            $scope.textMessageError = false;
                            $scope.textMessageResults = "Text message sent";
                            $scope.textAttached = false;
                            $scope.openModal('sm', 'success', $scope.textMessageResults);
                            console.log('success');
                        }).error(function (data) {
                            $scope.loading = false;
                            $scope.textMessageError = true;
                            $scope.textMessageResults = "Text message failed to send, please try again later.";
                            $scope.textAttached = false;
                            $scope.openModal('sm', 'error', $scope.textMessageResults);
                            console.log('Error: ' + data);
                        });
                    }, function (err) {
                        $scope.loading = false;
                        $scope.textMessageError = true;
                        $scope.textMessageResults = err;
                        $scope.textAttached = false;
                        $scope.openModal('sm', 'error', $scope.textMessageResults);
                    });

                } else {
                    $scope.phoneFocused = true;
                    $scope.phoneVerified = false;
                    $scope.textMessageError = true;
                    $scope.textMessageResults = "Please enter a valid phone number.";
                    $scope.openModal('sm', 'error', $scope.textMessageResults);
                }
            }
            return deferred.promise;
        };

        $scope.highlightAttachmentIcon = function ($event) {
            angular.element('.btn-file-input').removeClass('highlightedItem');
            angular.element($event.target).find('.btn-file-input').addClass('highlightedItem');
            setTimeout(function () {
                angular.element('.btn-file-input').removeClass('highlightedItem');
            }, 1000);
        };

        $scope.attachmentThumbnail = function (method, type, file) {
            $scope.textAttached = false;
            $scope.emailAttached = false;
            $scope.twitterAttached = false;
            $scope.textVideoAttached = false;
            $scope.emailVideoAttached = false;
            $scope.twitterVideoAttached = false;
            $scope.imageAttached = false;
            $scope.videoNotSupported = false;
            $scope.image_source = '';
            $scope.textAttachment = null;
            $scope.emailAttachment = null;
            $scope.imageAttached = [];
            $scope.image_source = [];
            var reader = new FileReader();

            reader.onload = function (event) {
                switch (method) {
                    case 'text':
                        $scope.textAttached = true;
                        $scope.textAttachment = file[0];
                        angular.element('#textVideo').attr('src', '');
                        switch (type) {
                            case 'photo':
                                $scope.imageAttached['text'] = true;
                                $scope.image_source['text'] = event.target.result;
                                break;
                            case 'video':
                                if (file[0].type != "video/mp4" && file[0].type != "video/quicktime") {
                                    $scope.videoNotSupported = true;
                                } else {
                                    angular.element('#textVideo').attr('src', event.target.result);
                                }
                                $scope.textVideoAttached = true;
                                break;
                        }
                        break;
                    case 'email':
                        $scope.emailAttached = true;
                        $scope.emailAttachment = file[0];
                        angular.element('#emailVideo').attr('src', '');
                        switch (type) {
                            case 'photo':
                                $scope.imageAttached['email'] = true;
                                $scope.image_source['email'] = event.target.result;
                                break;
                            case 'video':
                                angular.element('#emailVideo').attr('src', event.target.result);
                                $scope.emailVideoAttached = true;
                                break;
                        }
                        break;
                    case 'twitter':
                        $scope.twitterAttached = true;
                        $scope.twitterAttachment = file[0];
                        angular.element('#twitterVideo').attr('src', '');
                        switch (type) {
                            case 'photo':
                                $scope.imageAttached['twitter'] = true;
                                $scope.image_source['twitter'] = event.target.result;
                                break;
                            case 'video':
                                angular.element('#twitterVideo').attr('src', event.target.result);
                                $scope.twitterVideoAttached = true;
                                break;
                        }
                        break;
                }
                $scope.$apply()

            }
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(file[0]);
        };

        $scope.removeAttachment = function () {
            $scope.imageAttached = false;
            $scope.emailAttached = false;
            $scope.textAttached = false;
            $scope.twitterAttached = false;
            $scope.image_source = '';
            $scope.textVideoAttached = false;
            $scope.emailVideoAttached = false;
            $scope.twitterVideoAttached = false;
            $scope.videoNotSupported = false;
            $scope.textAttachment = null;
            $scope.emailAttachment = null;
            $scope.$apply();
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
                case 'call':
                    $scope.callTo = formatPhoneNumber($scope.callTo, $event);
                    if ($scope.callTo.length > 0 && $scope.verifyPhone(null, $scope.callTo)) {
                        $scope.callVerified = true;
                    } else {
                        $scope.callVerified = false;
                    }
                    if ($scope.callTo && $scope.phoneVoice && $scope.callBody && $scope.verifyPhone(null, $scope.callTo)) {
                        $scope.phoneReady = true;
                    } else {
                        $scope.phoneReady = false;
                    }
                    break;
                case 'text':
                    $scope.textTo = formatPhoneNumber($scope.textTo, $event);
                    if ($scope.textTo.length > 0 && $scope.verifyPhone(null, $scope.textTo)) {
                        $scope.phoneVerified = true;
                    } else {
                        $scope.phoneVerified = false;
                    }
                    if ($scope.textMessageBody && $scope.textMessageBody.length && $scope.textMessageBody.length > 0 && $scope.textTo.length > 0 && $scope.verifyPhone(null, $scope.textTo)) {
                        $scope.textReady = true;
                    } else {
                        $scope.textReady = false;
                    }
                    break;
                case 'email':
                    if ($scope.emailBody.length > 0 && $scope.emailTo.length > 0 && $scope.verifyEmail($scope.emailTo)) {
                        $scope.emailReady = true;
                        $scope.emailVerified = true;
                    } else {
                        $scope.emailReady = false;
                        $scope.emailVerified = false;
                    }
                    break;
                case 'facebookSearch':
                    if ($scope.facebookSearch.length > 3) {
                        $scope.facebookSearchReady = true;
                    } else {
                        $scope.facebookSearchReady = false;
                    }
                    break;
                case 'facebookWall':
                    if ($scope.facebookPostToWall.length > 0) {
                        $scope.facebookWallReady = true;
                    } else {
                        $scope.facebookWallReady = false;
                    }
                    break;
                case 'facebookMessage':
                    if ($scope.facebookMsg.length > 0) {
                        $scope.facebookMessageReady = true;
                    } else {
                        $scope.facebookMessageReady = false;
                    }
                    break;
                case 'twitter':
                    if ($scope.twitterMsg.length > 1) {
                        $scope.twitterReady = true;
                    } else {
                        $scope.twitterReady = false;
                    }
                    break;
            }
        };

        $scope.makePhoneCall = function () {

            var deferred = $q.defer();
            if ($scope.callBody == '' || !$scope.phoneReady) {
                $scope.phoneCallError = true;
                $scope.makePhoneCallResults = "Please enter a message.";
            } else {
                if ($scope.verifyPhone(null, $scope.callTo)) {
                    if (!$scope.phoneVoice) {
                        $scope.phoneCallError = true;
                        $scope.makePhoneCallResults = "Please select a voice type.";
                    } else {
                        $scope.phoneCallError = false;
                        $scope.makePhoneCallResults = "Making phone call.";
                        $scope.loading = true;

                        $http.post('http://2banonymous-production.us-west-2.elasticbeanstalk.com/', [{
                            method: 'sendMessage',
                            msg: $scope.callBody,
                            type: 'call',
                            to: $scope.callTo,
                            voiceType: $scope.phoneVoice,
                            sender: $rootScope.globals.currentUser.email
                        }]).success(function (data) {
                            $scope.loading = false;
                            $scope.phoneCallError = false;
                            $scope.makePhoneCallResults = "Phone call made successfully";
                            $scope.openModal('sm', 'success', $scope.makePhoneCallResults, false, 'showDialog');
                            console.log('success');
                        }).error(function (data) {
                            $scope.loading = false;
                            $scope.phoneCallError = true;
                            $scope.makePhoneCallResults = "Phone call failed, please try again later.";
                            $scope.openModal('sm', 'error', $scope.makePhoneCallResults);
                            console.log('Error: ' + data);
                        });
                    }
                } else {
                    $scope.callFocused = true;
                    $scope.callVerified = false;
                    $scope.phoneCallError = true;
                    $scope.makePhoneCallResults = "Please enter a valid phone number.";
                    $scope.openModal('sm', 'error', $scope.makePhoneCallResults);
                }
            }

            return deferred.promise;
        };

        $scope.sendEmail = function () {
            var deferred = $q.defer();

            if ($scope.emailBody == '' || !$scope.emailReady) {
                $scope.sendEmailError = true;
                $scope.sendEmailResults = "Please enter a message.";
            } else {
                if ($scope.verifyEmail($scope.emailTo)) {
                    $scope.emailReady = true;
                    $scope.loading = true;
                    $scope.sendEmailResults = "Sending email";

                    $scope.uploadFiles($scope.emailAttachment).then(function (uploadPath) {
                        $http.post('http://2banonymous-production.us-west-2.elasticbeanstalk.com/', [{
                            method: 'sendMessage',
                            msg: $scope.emailBody,
                            type: 'email',
                            to: $scope.emailTo.toLowerCase(),
                            attachment: uploadPath,
                            sender: $rootScope.globals.currentUser.email
                        }]).success(function (data) {
                            console.log('success', JSON.stringify(data));
                            if (data.code == 2) {
                                $scope.loading = false;
                                $scope.sendEmailError = true;
                                $scope.sendEmailResults = "Email failed to send, please try again later.";
                                $scope.emailAttached = false;
                                $scope.openModal('sm', 'error', $scope.sendEmailResults);
                                console.log('Error', data);
                            } else if (data.code == 4 & !data.smtp) {
                                $scope.loading = false;
                                $scope.sendEmailError = true;
                                $scope.sendEmailResults = "Email failed to send, please try again later.";
                                $scope.emailAttached = false;
                                $scope.openModal('sm', 'error', $scope.sendEmailResults);
                                console.log('Error: ' + data);
                            } else {
                                $scope.loading = false;
                                $scope.sendEmailError = false;
                                $scope.sendEmailResults = "Email sent successfully";
                                $scope.emailAttached = false;
                                $scope.openModal('sm', 'success', $scope.sendEmailResults);
                                console.log('success');
                            }
                        }).error(function (data) {
                            $scope.loading = false;
                            $scope.sendEmailError = true;
                            $scope.sendEmailResults = "Email failed to send, please try again later.";
                            $scope.emailAttached = false;
                            $scope.openModal('sm', 'error', $scope.sendEmailResults);
                            console.log('Error: ' + data);
                        });
                    }, function (err) {
                        $scope.loading = false;
                        $scope.sendEmailError = true;
                        $scope.sendEmailResults = err;
                        $scope.emailAttached = false;
                        $scope.openModal('sm', 'error', $scope.sendEmailResults);
                    });
                } else {
                    $scope.emailReady = false;
                    $scope.emailFocused = true;
                    $scope.emailVerified = false;
                    $scope.sendEmailError = true;
                    $scope.sendEmailResults = "Please enter a valid email address.";
                    $scope.openModal('sm', 'error', $scope.sendEmailResults);
                }
            }

            return deferred.promise;
        };

        $scope.sendTweet = function () {
            var deferred = $q.defer();

            if ($scope.twitterMsg == '') {
                $scope.sendTweetError = true;
                $scope.sendTweetResults = "Please enter a message.";
            } else {
                $scope.loading = true;

                $scope.uploadFiles($scope.twitterAttachment ? $scope.twitterAttachment : '').then(function (uploadPath) {
                    console.log('uploaded files complete', uploadPath);
                    $http.post('http://2banonymous-production.us-west-2.elasticbeanstalk.com/', [{
                        method: 'sendMessage',
                        msg: $scope.twitterMsg,
                        type: 'twitter',
                        to: 'twitter',
                        attachment: uploadPath ? uploadPath : '',
                        sender: $rootScope.globals.currentUser.email
                    }]).success(function (authUrl) {
                        $scope.loading = false;
                        $scope.twitterAttached = false;
                        $scope.sendTweetError = false;
                        $scope.sendTweetResults = "Tweet sent";
                        $scope.openModal('sm', 'success', $scope.sendTweetResults);
                        console.log('success', authUrl);
                    }).error(function (data) {
                        $scope.loading = false;
                        $scope.twitterAttached = false;
                        $scope.sendTweetError = true;
                        $scope.sendTweetResults = "Tweet failed to send, please try again later.";
                        $scope.openModal('sm', 'error', $scope.sendTweetResults);
                        console.log('Error: ' + data);
                    });
                }, function (err) {
                    $scope.loading = false;
                    $scope.sendTweetError = true;
                    $scope.sendTweetResults = err;
                    $scope.openModal('sm', 'error', $scope.sendEmailResults);
                });
            }

            return deferred.promise;
        };

        $scope.getFacebookProfiles = function () {
            //if ($scope.facebookSearch == $scope.currentSearch) {
            //    alert('dont need to send request');
            //    TODO: make sure bools allow this
            //    showFacebookSearchResults();
            //} else
            if ($scope.facebookSearchReady) {
                $scope.loading = true;
                $scope.selectedFacebookProfile = null;
                $rootScope.facebookSearchResults = null;
                $scope.currentSearch = $scope.facebookSearch;
                //$scope.sendFacebookResults = "Searching profiles";
                var deferred = $q.defer();

                $http.post('http://2banonymous-production.us-west-2.elasticbeanstalk.com/', [{
                    method: 'getFacebookProfiles',
                    profile: $scope.facebookSearch,
                    sender: $rootScope.globals.currentUser.email
                }]).success(function (data) {
                    if (data.code == 2) {
                        $scope.loading = false;
                        $scope.sendFacebookError = true;
                        $scope.sendFacebookResults = "Search failed, please try again later.";
                        $scope.openModal('sm', 'error', $scope.sendEmailResults);
                        console.log('Error', data);
                    } else {
                        $scope.loading = false;
                        $scope.sendFacebookError = false;
                        //$scope.sendFacebookResults = "Search finished successfully";
                        console.log('success', data);
                        $rootScope.transition('slide', 'up');
                        $rootScope.headline = $scope.facebookSearch;
                        $rootScope.navigationActive = true;
                        $rootScope.facebookProfileSearchResultsActive = true;
                        $scope.facebookProfiles = data;
                    }
                }).error(function (data) {
                    $scope.loading = false;
                    $scope.sendFacebookError = true;
                    $scope.sendFacebookResults = "Search failed, please try again later.";
                    $scope.openModal('sm', 'error', $scope.sendEmailResults);
                    console.log('Error: ' + data);
                });
            }

            return deferred.promise;
        };

        function disableButtons() {
            angular.element('ul.highlight-options li, .col-container').css("pointer-events", "none");
            setTimeout(function () {
                angular.element('ul.highlight-options li, .col-container').css("pointer-events", "all");
            }, 500);
        }

        $scope.selectFacebookProfile = function (index) {
            disableButtons();
            $scope.selectedFacebookProfile = [$scope.facebookProfiles[index]];
            $rootScope.facebookSearchResults = true;
            $rootScope.headline = "2B anonymous";
            $rootScope.transition('slide', 'down');
            $rootScope.navigationActive = false;
            $rootScope.headline = "2B anonymous";
            $rootScope.facebookProfileSearchResultsActive = false;
            $scope.facebookMessageType = "personal";
        };

        $scope.showFacebookSearchResults = function () {
            if ($scope.facebookProfiles) {
                $rootScope.transition('slide', 'up');
                $rootScope.headline = $scope.facebookSearch;
                $rootScope.navigationActive = true;
                $rootScope.facebookProfileSearchResultsActive = true;
            } else {
                $scope.getFacebookProfiles();
            }
        };

        $scope.facebookSubmit = function () {
            $scope.facebookProfiles = null;
            $scope.loading = true;
            $scope.sendFacebookResults = "Determining is user is friends with 2BAnonymous";

            $scope.determineFacebookFriend().then(function (isFriend) {
                console.log('user is friend', isFriend);
                $scope.loading = false;
                $scope.isFacebookFriend = isFriend;
                if (isFriend) {
                    //$scope.sendFacebookResults = "User is friends with 2BAnonymous";
                } else {
                    //$scope.sendFacebookResults = "User is not friends with 2BAnonymous";
                }
            });
        };

        $scope.determineFacebookFriend = function () {
            var deferred = $q.defer();

            $http.post('http://2banonymous-production.us-west-2.elasticbeanstalk.com/', [{
                method: 'determineFacebookFriend',
                type: 'facebook',
                to: $scope.selectedFacebookProfile[0].path,
                sender: $rootScope.globals.currentUser.email
            }]).success(function (data) {
                if (data.code == 2) {
                    deferred.reject("Facebook message failed, please try again later.");
                } else {
                    deferred.resolve(data);
                    console.log('success', data);
                }
            }).error(function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        };

        $scope.sendFacebook = function (action) {
            var deferred = $q.defer();
            $rootScope.facebookAction = $scope.facebookAction;
            switch ($rootScope.facebookAction) {
                case 'postToWall':
                    if ($scope.facebookPostToWall == '' || !$scope.facebookWallReady) {
                        $scope.sendFacebookError = true;
                        $scope.sendFacebookResults = "Please enter a message.";
                        $scope.openModal('sm', 'error', $scope.sendFacebookResults);
                    } else {
                        request();
                    }
                    break;
                case 'sendMessage':
                    if ($scope.facebookMsg == '' || !$scope.facebookMessageReady) {
                        $scope.sendFacebookError = true;
                        $scope.sendFacebookResults = "Please enter a message.";
                        $scope.openModal('sm', 'error', $scope.sendFacebookResults);
                    } else {
                        console.log('making request');
                        request();
                    }
                    break;
            }

            function toTitleCase(str) {
                return str.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
            }

            function request() {
                $scope.sendFacebookResults = '';
                $scope.loading = true;
                $scope.uploadFiles($scope.facebookAttachment ? $scope.facebookAttachment : '').then(function (uploadPath) {
                    console.log('uploaded files complete', uploadPath);
                    if (action == "sendMessage") {
                        $http.post('http://2banonymous-production.us-west-2.elasticbeanstalk.com/', [{
                            method: 'sendMessage',
                            msg: $scope.facebookMsg,
                            msgType: $scope.facebookMessageType,
                            type: 'facebook',
                            attachment: uploadPath ? uploadPath : '',
                            to: $scope.selectedFacebookProfile[0].uid,
                            profileName: toTitleCase($scope.facebookSearch),
                            profileUrl: $scope.selectedFacebookProfile[0].path ? $scope.selectedFacebookProfile[0].path : 'http://facebook.com/2BAnonymous-656831264420470',
                            sender: $rootScope.globals.currentUser.email
                        }]).success(function (data) {
                            $scope.loading = false;
                            $scope.sendFacebookError = false;
                            $scope.sendFacebookResults = "Facebook message sent";
                            $scope.openModal('sm', 'success', $scope.sendFacebookResults);
                            console.log('success', data);
                        }).error(function (data) {
                            $scope.loading = false;
                            $scope.sendFacebookError = true;
                            $scope.sendFacebookResults = "Facebook message failed to send, please try again later.";
                            $scope.openModal('sm', 'error', $scope.sendFacebookResults);
                            console.log('Error: ' + data);
                        });
                    } else if (action == "postToWall") {
                        $http.post('http://2banonymous-production.us-west-2.elasticbeanstalk.com/', [{
                            method: 'sendMessage',
                            msg: $scope.facebookPostToWall,
                            msgType: "postToWall",
                            type: 'facebook',
                            to: 'facebook',
                            attachment: uploadPath ? uploadPath : '',
                            sender: $rootScope.globals.currentUser.email
                        }]).success(function (data) {
                            $scope.loading = false;
                            $scope.sendFacebookError = false;
                            $scope.sendFacebookResults = "Facebook message sent";
                            $scope.openModal('sm', 'success', $scope.sendFacebookResults);
                            console.log('success', data);
                        }).error(function (data) {
                            $scope.loading = false;
                            $scope.sendFacebookError = true;
                            $scope.sendFacebookResults = "Facebook message failed to send, please try again later.";
                            $scope.openModal('sm', 'error', $scope.sendFacebookResults);
                            console.log('Error: ' + data);
                        });
                    } else {
                        $scope.loading = false;
                        $scope.sendFacebookError = true;
                        $scope.sendFacebookResults = "Facebook message failed to send, no Facebook action selected.";
                        $scope.openModal('sm', 'error', $scope.sendFacebookResults);
                        deferred.reject("No Facebook action selected");
                    }
                }, function (err) {
                    $scope.loading = false;
                    $scope.sendFacebookError = true;
                    $scope.sendFacebookResults = err;
                    $scope.openModal('sm', 'error', err);
                });
            }

            return deferred.promise;
        };

        $scope.setFacebookAction = function (action) {
            var deferred = $q.defer();
            $rootScope.facebookAction = action;
            deferred.resolve();
            return deferred.promise;
        };

        $scope.hashtags = [];
        $scope.showAddHashtags = true;
        $scope.showRemoveHashtags = false;

        $scope.addNewHashtag = function () {
            $scope.showRemoveHashtags = true;
            if ($scope.hashtags.length < 3) {
                var newItemNo = $scope.hashtags.length + 1;
                $scope.hashtags.push({'id': 'hashtag' + newItemNo});
            }
        };

        $scope.removeHashtag = function ($index) {
            $scope.hashtags.splice($index, 1);
        };

        $scope.selectVoice = function (type) {
            $scope.phoneVoice = type;
            $scope.checkReady('call');
        };

        $scope.checkHashtag = function ($event, blur) {
            if ($scope.hashtags.length < 3) {
                if ($event.keyCode == 32 || blur) {
                    var hashtag = angular.element($event.target).val();
                    if (hashtag != '' && hashtag[0] == '#') {
                        $scope.hashtags.push({
                            id: hashtag
                        });
                        angular.element($event.target).val('');
                    }
                }
            }
        };

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

        $scope.verifyEmail = function (email) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            if (email) {
                return re.test(email);
            } else {
                if ($scope.emailTo) {
                    if (re.test($scope.emailTo)) {
                        if ($scope.sendEmailResults == 'Please enter a valid email address.') {
                            $scope.sendEmailResults = '';
                        }
                        $scope.emailVerified = true;
                    } else {
                        if ($scope.emailTo.length > 0) {
                            $scope.emailVerified = false;
                        }
                    }
                } else {
                    if ($scope.emailTo.length > 0) {
                        $scope.emailVerified = false;
                    }
                }
            }
        };

        $scope.showContactsModal = function () {
            if ($rootScope.contacts) {
                $rootScope.transition('slide', 'up');
                $rootScope.headline = 'Contacts';
                $rootScope.navigationActive = true;
                $rootScope.showContactsActive = true;
            } else {
                $scope.openModal('sm', 'error', 'No contacts to show');
            }
        };

        $scope.selectContact = function (number) {
            switch ($rootScope.selectedMethod) {
                case 'textMessage':
                    $scope.textTo = number.replace(/\+1/g, '').replace(/\(/g, '').replace(/\)/g, '').replace(/\s/g, '').replace(/-/g, '');
                    break;
                case 'phoneCall':
                    $scope.callTo = number.replace(/\+1/g, '').replace(/\(/g, '').replace(/\)/g, '').replace(/\s/g, '').replace(/-/g, '');
                    break;
            }
            $rootScope.transition('slide', 'down');
            $rootScope.navigationActive = false;
            $rootScope.showContactsActive = false;
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
                if ($scope.currentMethod) {
                    $scope.menuSelect($scope.currentMethod, true);
                }
            }, function () {
                console.log('modal cancel');
            });
        };

        $scope.facebookFollowResults = null;

        $scope.submitFacebookFollow = function () {
            console.log('submitting data');
            var deferred = $q.defer();
            $scope.loading = true;
            $http.post($rootScope.serverEndpoint, [{
                method: 'followFacebookUser',
                facebookUsername: $scope.facebookUsername,
                facebookPassword: $scope.facebookPassword,
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

        init();

    }]);
