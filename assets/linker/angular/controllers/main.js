/**
 * Created by fahmi on 3/28/14.
 */
'use strict';

angular.module('reqmeApp')
    .controller('MainCtrl', function ($scope,$rootScope,$location,localStorageService,$http,ServiceFactory,firebaseRef) {
        $scope.user=localStorageService.get('adminData')==null||localStorageService.get('adminData')==undefined?null:localStorageService.get('adminData');
        $scope.button="Login";
        $scope.buttonStatus=false;
        $scope.err=null;

        $scope.login=function(){
            $scope.button="Submitting Login";
            $scope.buttonStatus=true;
            console.log("prepare to login");
            $http.post(ServiceFactory.url("auth/login"),$scope.user)
                .success(function(response){
                    $scope.button="Login";
                    $scope.buttonStatus=false;
                    $scope.user=response;
                    $scope.err=response.message;
                    console.log("response ==>"+JSON.stringify(response, null, 2));
                    console.log("error==>"+$scope.err);
                    if($scope.user.response!=null && $scope.user.response!=undefined && $scope.user.response=="Success"){

                        console.log("now auth user in firebase");
                        var dataRef = new Firebase("https://reqmeapp.firebaseio.com/");
                        $rootScope.auth=dataRef.auth($scope.user.token, function(error) {
                            if(error) {
                                console.log("Login Failed!", error);
                                $scope.err="Error Authenticate to Server";
                            } else {
                                $scope.user.isAuthenticated=true;
                                localStorageService.clearAll();
                                localStorageService.add('adminData',$scope.user);
                                console.log("Sukses Login");
                                $location.path("/dashboard");
                            }
                            $scope.$apply();
                        });
                    }else{
                        console.log("error Login");
                    }
                    //console.log("response ==>"+JSON.stringify(response, null, 2));
                }).error(function(err){
                    //console.log("response error ==>"+JSON.stringify(err, null, 2));
                    console.log("error Login");
                });
        }
    });

