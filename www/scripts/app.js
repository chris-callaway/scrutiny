'use strict';

/**
 * @ngdoc overview
 * @name 2BanonymousApp
 * @description
 * # 2BanonymousApp
 *
 * Main module of the application.
 */

//angular.module('Authentication', []);

angular
    .module('2BanonymousApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ngFileUpload',
        'simplePagination',
        'ui.bootstrap',
        'ngTouch',
        //'mobile-angular-ui'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'LoginCtrl'
            })
            .when('/main', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'MainCtrl'
            })
            .when('/follow-list', {
                templateUrl: 'views/follow-list.html',
                controller: 'FollowListCtrl',
                controllerAs: 'FollowListCtrl'
            })
            .when('/activity', {
                templateUrl: 'views/activity.html',
                controller: 'ActivityCtrl',
                controllerAs: 'ActivityCtrl'
            })
            .when('/account-create', {
                templateUrl: 'views/account-create.html',
                controller: 'AccountCreateCtrl',
                controllerAs: 'AccountCreateCtrl'
            })
            .when('/account-edit', {
                templateUrl: 'views/account-edit.html',
                controller: 'AccountEditCtrl',
                controllerAs: 'AccountEditCtrl'
            })
            .when('/reply', {
                templateUrl: 'views/reply.html',
                controller: 'ReplyCtrl',
                controllerAs: 'ReplyCtrl'
            })
            .when('/my-messages', {
                templateUrl: 'views/my-messages.html',
                controller: 'MyMessagesCtrl',
                controllerAs: 'MyMessagesCtrl'
            })
            .when('/confirmation', {
                templateUrl: 'views/verification.html',
                controller: 'ConfirmationCtrl',
                controllerAs: 'ConfirmationCtrl'
            })
            .when('/privacy-policy', {
                templateUrl: 'views/privacy-policy.html',
                controller: 'PrivacyCtrl',
                controllerAs: 'PrivacyCtrl'
            })
            .when('/terms-of-use', {
                templateUrl: 'views/terms-of-use.html',
                controller: 'TermsCtrl',
                controllerAs: 'TermsCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }).config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        //Reset headers to avoid OPTIONS request (aka preflight)
        $httpProvider.defaults.headers.common = {};
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
        $httpProvider.defaults.headers.patch = {};
    }
    ]).config(['$resourceProvider', function ($resourceProvider) {
        // Don't strip trailing slashes from calculated URLs
        $resourceProvider.defaults.stripTrailingSlashes = false;
    }]).run(['$rootScope', '$location', '$cookieStore', '$http',
        function ($rootScope, $location, $cookieStore, $http) {
            // keep user logged in after page refresh
            $rootScope.globals = $cookieStore.get('globals') || {};
            //$rootScope.serverEndpoint = 'http://2banonymous-production.us-west-2.elasticbeanstalk.com/';
            $rootScope.serverEndpoint = "http://192.169.217.115:8081/~developer/Scrutiny/server";
            if ($rootScope.globals.currentUser) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
            }

            function sidebarToggle(type) {
                switch (type) {
                    case 'open':
                        $('#view').hide();
                        $('.sidebar.sidebar-left').animate({left: '0px'}, 500);
                        $('#app').animate({marginLeft: '300px'}, 500);
                        break;
                    case 'close':
                        $('.sidebar.sidebar-left').animate({left: '-300px'}, 500, function () {
                            //
                        });
                        $('#app').animate({marginLeft: '0px'}, 500, function () {
                            $('#view').show();
                        });
                        break;
                }
            }

            $rootScope.toggleSidebar = function () {
                if ($rootScope.user || $rootScope.accountCreate) {
                    if ($('.sidebar.sidebar-left').css('left') != '0px') {
                        sidebarToggle('open');
                    } else {
                        sidebarToggle('close');
                    }
                }
            };

            $rootScope.openSidebar = function () {
                if ($('.sidebar.sidebar-left').css('left') != '0px') {
                    sidebarToggle('open');
                }
            };

            $rootScope.closeSidebar = function () {
                if ($('.sidebar.sidebar-left').css('left') == '0px') {
                    sidebarToggle('close');
                }
            };

            $rootScope.swipeRight = function () {
                if ($rootScope.selectedMethod && $rootScope.mainActive && !showContactsActive) {
                    $('.page-main').removeClass('slideLeft');
                    $('.page-main').removeClass('slideRight');
                    switch ($rootScope.selectedMethod) {
                        case 'textMessage':
                            break;
                        case 'email':
                            $('.page-main').addClass('slideLeft');
                            $rootScope.selectedMethod = 'textMessage';
                            break;
                        case 'phoneCall':
                            $('.page-main').addClass('slideLeft');
                            $rootScope.selectedMethod = 'email';
                            break;
                        case 'socialMedia':
                            $('.page-main').addClass('slideLeft');
                            $rootScope.selectedMethod = 'phoneCall';
                            $rootScope.selectedSocial = null;
                            break;
                    }
                    setTimeout(function () {
                        $('.page-main').removeClass('slideLeft');
                    }, 350);
                }
            };

            $rootScope.swipeLeft = function () {
                if ($rootScope.selectedMethod && $rootScope.mainActive && !showContactsActive) {
                    switch ($rootScope.selectedMethod) {
                        case 'textMessage':
                            $('.page-main').addClass('slideRight');
                            $rootScope.selectedMethod = 'email';
                            break;
                        case 'email':
                            $('.page-main').addClass('slideRight');
                            $rootScope.selectedMethod = 'phoneCall';
                            break;
                        case 'phoneCall':
                            $('.page-main').addClass('slideRight');
                            $rootScope.selectedMethod = 'socialMedia';
                            break;
                        case 'socialMedia':
                            break;
                    }
                    setTimeout(function () {
                        $('.page-main').removeClass('slideRight');
                    }, 350);
                }
            };

            $rootScope.transition = function (type, direction, href, callback) {
                console.log('flipped page');
                var options = {
                    "href": href ? href : null,
                    "direction": direction, // 'left|right|up|down', default 'left' (which is like 'next')
                    "duration": 500, // in milliseconds (ms), default 400
                    "slowdownfactor": 4, // overlap views (higher number is more) or no overlap (1), default 3
                    "iosdelay": 100, // ms to wait for the iOS webview to update before animation kicks in, default 50
                    "androiddelay": 150  // same as above but for Android, default 50
                };

                switch (type) {
                    case 'slide':
                        window.plugins.nativepagetransitions.slide(
                            options,
                            function (msg) {
                                console.log("success: " + msg)
                            },
                            function (msg) {
                                alert("error: " + msg)
                            }
                        );
                        break;
                    case 'fade':
                        window.plugins.nativepagetransitions.fade(
                            options,
                            function (msg) {
                                console.log("success: " + msg)
                            },
                            function (msg) {
                                alert("error: " + msg)
                            }
                        );
                        break;
                }
            };

            $rootScope.goBack = function () {
                if ($rootScope.accountCreate) {
                    $rootScope.transition('fade', 'down', '#/');
                }
                if ($rootScope.facebookProfileSearchResultsActive) {
                    $rootScope.transition('slide', 'down');
                    $rootScope.facebookAction == 'sendMessage';
                    $rootScope.navigationActive = false;
                    $rootScope.facebookProfileSearchResultsActive = false;
                } else if ($rootScope.showContactsActive) {
                    $rootScope.transition('slide', 'down');
                    $rootScope.navigationActive = false;
                    $rootScope.showContactsActive = false;
                } else if (!$rootScope.accountCreate) {
                    $rootScope.transition('slide', 'left', '#/');
                }
            };

            $rootScope.$watch(function () {
                    return $location.path();
                },
                function (a) {

                    $rootScope.closeSidebar();
                    $rootScope.facebookProfileResults = false;
                    $rootScope.navigationActive = false;
                    $rootScope.messageLog = false;
                    $rootScope.accountCreate = false;
                    $rootScope.loginPage = false;
                    $rootScope.accountEdit = false;
                    $rootScope.mainActive = false;
                    $rootScope.followList = false;
                    $rootScope.activity = false;
                    $rootScope.facebookSearchResults = false;

                    // login page
                    if (a == '/') {
                        $rootScope.headline = "Scrutiny";
                        $rootScope.loginPage = true;
                    } // my messages
                    else if (a == '/my-messages') {
                        $rootScope.messageLog = true;
                    } // main
                    else if (a == '/main') {
                        $rootScope.headline = "Scrutiny Logins";
                        $rootScope.mainActive = true;

                    } // follow list
                    else if (a == '/follow-list') {
                        $rootScope.headline = "Scrutiny Follow List";
                        $rootScope.followList = true;
                    } // activity
                    else if (a == '/activity') {
                        $rootScope.headline = "Scrutiny Activity";
                        $rootScope.activity = true;
                    } // account create
                    else if (a == '/account-create') {
                        $rootScope.accountCreate = true;
                        $rootScope.navigationActive = true;
                        $rootScope.loginPage = false;
                        $rootScope.headline = "Sign Up";
                    } // account edit
                    else if (a == '/account-edit') {
                        $rootScope.accountEdit = true;
                    } // fallback
                    else {

                    }

                    if ($rootScope.globals.currentUser) {
                        $rootScope.globals.loginText = "Log Out";
                    } else {
                        $rootScope.globals.loginText = "Log In";
                    }
                });

            $rootScope.$on('$locationChangeStart', function (event, next, current) {
                // redirect to login page if not logged in
                if ($location.path() !== '/' && $location.path() !== '/account-create' && $location.path() !== '/reply' && $location.path() !== '/confirmation' && $location.path() !== '/privacy-policy' && $location.path() !== '/terms-of-use' && $location.path() !== '/follow-list' && $location.path() !== '/activity' && $location.path() !== '/main') {
                    $location.path('/');
                }
                if ($location.path().indexOf('/main') == -1) {
                    $rootScope.showShowHeader = false;
                }
            });

        }]).
    directive('myEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.myEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    }).directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);