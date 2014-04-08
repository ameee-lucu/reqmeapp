/**
 * Created by fahmi on 3/31/14.
 */
angular.module('reqmeApp')
    .controller('RequestReportCtrl', function ($scope,$location,localStorageService,$http,ServiceFactory,firebaseRef,$modal) {
        $scope.user=localStorageService.get('userData');
        $scope.listTrans=null;
        $scope.waitingMsg="Mohon Tunggu, Mengambil Data..";
        $scope.param=null;
        $scope.detailButton="Detail";
        $scope.detailDisabled=false;
        $scope.updateButton="Update Status";
        $scope.updateDisabled=false;
        $scope.transactions=null;
        $scope.customer=null;
        $scope.tenor=null;


        firebaseRef('transactions')
            .on('value', function(snap) {
                $scope.listTrans = snap.val();
                $scope.waitingMsg=null;
                if(!$scope.$$phase) {
                    $scope.$apply();
                    //$digest or $apply
                }
            });


        $scope.doUpdateStatus=function(transId){
            $scope.waitingMsg="Mohon Tunggu, Mengambil Data..";
            $scope.updateDisabled=true;
            firebaseRef('transactions/'+transId)
                .once('value', function(snap) {
                    $scope.transactions=snap.val();
                    var modalInstance = $modal.open({
                        templateUrl: 'updateStatusContent.html',
                        controller: UpdateStatusInstanceCtrl,
                        resolve: {
                            transactions : function () {
                                return $scope.transactions;
                            }
                        }
                    });
                    modalInstance.result.then(function (result) {
                        if(result=="Ok" || result=="Cancel"){
                            //$location.path("/");
                        }
                    }, function () {
                        //$log.info('Modal dismissed at: ' + new Date());
                    });
                    $scope.waitingMsg=null;
                    $scope.updateDisabled=false;
                    //$scope.$apply();
                });



        }

        $scope.doAction = function(transId){
            $scope.waitingMsg="Mohon Tunggu, Mengambil Data..";
            $scope.detailDisabled=true;
            firebaseRef('transactions/'+transId)
                .once('value', function(snap) {
                    $scope.transactions=snap.val();
                    firebaseRef('customer/'+$scope.transactions.customer)
                        .once('value', function(snap) {
                            $scope.customer=snap.val();
                            firebaseRef('tenor/'+$scope.transactions.tenor)
                                .once('value', function(snap) {
                                    $scope.tenor=snap.val();
                                    var modalInstance = $modal.open({
                                        templateUrl: 'detailContent.html',
                                        controller: ModalInstanceCtrl,
                                        resolve: {
                                            transactions : function () {
                                                return $scope.transactions;
                                            },
                                            customer : function () {
                                                return $scope.customer;
                                            },tenor : function () {
                                                return $scope.tenor;
                                            }
                                        }
                                    });
                                    modalInstance.result.then(function (result) {
                                        if(result=="Ok" || result=="Cancel"){
                                            //$location.path("/");
                                        }
                                    }, function () {
                                        //$log.info('Modal dismissed at: ' + new Date());
                                    });
                                    $scope.waitingMsg=null;
                                    $scope.detailDisabled=false;
                                    $scope.$apply();
                        });
                });
        });
        }

        /*$http.post(ServiceFactory.url("report/request"),$scope.user)
            .success(function(response){
                $scope.waitingMsg=null;
                var data=response;
                console.log("data==>"+response);
                if(data.message=="Success"){
                    $scope.listTrans=data.data;
                }
                //console.log("response ==>"+JSON.stringify(response, null, 2));
            }).error(function(err){
                console.log("response error ==>"+JSON.stringify(err, null, 2));
            });*/
    });


var ModalInstanceCtrl = function ($scope, $modalInstance,transactions,customer,tenor,$sce,$http,ServiceFactory) {
    $scope.transactions=transactions;
    $scope.user=customer;
    $scope.tenor=tenor;
    $scope.krdit=false;


    $scope.doDownload=function(file){
        var image = $sce.trustAsResourceUrl(file);
        return image;
    }

    $scope.printDocument=function(type){
        $scope.krdit=true;

        if(type==="hitungan"){
            $scope.transactions.tenor=$scope.tenor.tenor;
            location.href=ServiceFactory.url("report/print?type="+type+"&param="+JSON.stringify($scope.transactions));
        }else if(type==="profile"){
            var user=$scope.user;
            user.id_card_file="";
            user.family_id_file="";
            user.default_general_file="";
            user.income_certificate_file="";
            user.business_place_file="";
            location.href=ServiceFactory.url("report/print?type="+type+"&param="+JSON.stringify(user));
        }else if(type==="all"){
            var user=$scope.user;
            user.id_card_file="";
            user.family_id_file="";
            user.default_general_file="";
            user.income_certificate_file="";
            user.business_place_file="";
            $scope.transactions.tenor=$scope.tenor.tenor;
            location.href=ServiceFactory.url("report/print?type="+type+"&user="+JSON.stringify(user)+"&trans="+JSON.stringify($scope.transactions));

        }
        $scope.krdit=false;
    }

    $scope.testPdf=function(){
        $scope.krdit=true;
        location.href=ServiceFactory.url("report/print");
        $scope.krdit=false;
    }

    $scope.ok = function () {
        $modalInstance.close('Ok');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('Cancel');
    };
};

var UpdateStatusInstanceCtrl = function ($scope, $modalInstance,transactions,firebaseRef,$sce,$http,ServiceFactory) {
    $scope.transactions=transactions;
    $scope.unitMsg=null;
    $scope.dataMsg=null;
    $scope.surveyMsg=null;
    $scope.approvalMsg=null;



    $scope.onSetUnitStatus=function(unitStatus){
        console.log("unit Status==>"+unitStatus);
        console.log("uid==>"+$scope.transactions.uid);
        $scope.unitMsg="Updating Data..";
        firebaseRef('transactions/'+$scope.transactions.uid+"/unit_status")
            .set(unitStatus, function(error) {
                if (error) {
                    console.log("Error when update",error);
                    $scope.unitMsg="Error Saat Mengupdate Data..";
                } else {
                    console.log("Sukses When Update");
                    $scope.unitMsg="Sukses Mengupdate Data..";
                }
                $scope.$apply();
            });
    }

    $scope.unitStatus=function(labelStatus){

        if($scope.transactions.unit_status===labelStatus){
            return true;
        }else{
            return false;
        }

    }


    $scope.onSetDataStatus=function(dataStatus){
        $scope.dataMsg="Updating Data..";
        firebaseRef('transactions/'+$scope.transactions.uid+"/data_status")
            .set(dataStatus, function(error) {
                if (error) {
                    $scope.dataMsg="Error Saat Mengupdate Data..";
                } else {
                    $scope.dataMsg="Sukses Mengupdate Data..";
                }
                $scope.$apply();
            });
    }

    $scope.dataStatus=function(labelStatus){

        if($scope.transactions.data_status===labelStatus){
            return true;
        }else{
            return false;
        }

    }


    $scope.onSetSurveyStatus=function(surveyStatus){
        $scope.surveyMsg="Updating Data..";
        firebaseRef('transactions/'+$scope.transactions.uid+"/survey_status")
            .set(surveyStatus, function(error) {
                if (error) {
                    $scope.surveyMsg="Error Saat Mengupdate Data..";
                } else {
                    $scope.surveyMsg="Sukses Mengupdate Data..";
                }
                $scope.$apply();
            });
    }

    $scope.surveyStatus=function(labelStatus){

        if($scope.transactions.survey_status===labelStatus){
            return true;
        }else{
            return false;
        }

    }


    $scope.onSetApprovalStatus=function(approvalStatus){
        $scope.approvalMsg="Updating Data..";
        firebaseRef('transactions/'+$scope.transactions.uid+"/approval_status")
            .set(approvalStatus, function(error) {
                if (error) {
                    $scope.approvalMsg="Error Saat Mengupdate Data..";
                } else {
                    $scope.approvalMsg="Sukses Mengupdate Data..";
                }
                $scope.$apply();
            });
    }

    $scope.approvalStatus=function(labelStatus){
        if($scope.transactions.approval_status===labelStatus){
            return true;
        }else{
            return false;
        }

    }








    $scope.ok = function () {
        $modalInstance.close('Ok');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('Cancel');
    };
};