/**
 * Created by fahmi on 3/28/14.
 */
'use strict';

angular.module('reqmeApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'firebase',
        'angularfire.firebase',
        'angularfire.login',
        'simpleLoginTools',
        'angularFileUpload',
        'LocalStorageModule',
        'ui.bootstrap'
    ])
    .config(function($compileProvider){
        console.log("udah disanitize belom seehhh 2");
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data|image):/);
    })
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push(['$q','localStorageService','$location', function($q,localStorageService,$location) {
            return {
                /* All the following methods are optional */

                request: function(config) {
                    /*
                     Called before send a new XHR request.
                     This is a good place where manipulate the
                     request parameters.
                     */

                    //console.log("location==>"+$location.path());
                    var user=localStorageService.get('adminData');
                    if(!(user==null||user==undefined)){
                        if($location.path()=='/'){
                            //console.log("redirect to dashboard");
                            $location.path("/dashboard");
                        }
                    }else{
                        //console.log("belum login gan..");
                        $location.path("/");
                    }
                    //console.log("config===>"+config);
                    return config || $q.when(config);
                },

                requestError: function(rejection) {
                    // Called when another request fails.

                    // I am still searching a good use case for this.
                    // If you are aware of it, please write a comment

                    return $q.reject(rejection);
                },

                response: function(response) {
                    // Called before a promise is resolved.

                    return response || $q.when(response);
                },

                responseError: function(rejection) {
                    /*
                     Called when another XHR request returns with
                     an error status code.
                     */

                    return $q.reject(rejection);
                }

            }

        }]);

    }])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/login.html',
                controller: 'MainCtrl'
            })
            .when('/dashboard', {
                templateUrl: 'templates/dashboard.html',
                controller: 'MainCtrl'
            })
            .when('/reqreport', {
                templateUrl: 'templates/requestreport.html',
                controller: 'RequestReportCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

    });