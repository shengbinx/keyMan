angular.module("controllerApp", [
    "constantApp",
    "filterApp",
    "serviceApp"
]).controller("dataCtrl", ["$scope", "$rootScope", "userService", "keyManConstant", function ($scope, $rootScope, userService, keyManConstant){
    $scope.entity = {};
    $scope.hideAddDataViewFn = function (){
        $rootScope.localStorage.viewStatus.hideAddDataView = true;
    };
    $scope.addDataFn = function (){
        userService.add($rootScope.localStorage.currentUserData.loginName, $rootScope.localStorage.currentUserData.currentAddData, function (data){
            $rootScope.localStorage.gridOptions.data = data;
            $rootScope.localStorage.currentUserData.selectedUUIDList = [];
            $rootScope.localStorage.viewStatus.hideAddDataView = true;
            alert(keyManConstant["CONSTANTS"]["TIPS"]["DATA"]["ADD"]["ADD_DATA_SUCCESS"]);
        });
    };
}]).controller("showDataCtrl", ["$scope", "$rootScope", function ($scope, $rootScope){
    $scope.hideSelectedDataViewFn = function (){
        $rootScope.localStorage.viewStatus.hideSelectedDataView = true;
    };
}]).controller("mainCtrl", ["$scope", "$rootScope", "userService", "keyManConstant", function ($scope, $rootScope, userService, keyManConstant){
    $scope.quitLogin = function (){
        userService.quit(function (){
            $rootScope.localStorage = angular.copy(keyManConstant.localStorage);
            $rootScope.localStorage.viewStatus.viewActType = "login";
            alert(keyManConstant["CONSTANTS"]["TIPS"]["ACCOUNT"]["QUIT"]["QUIT_SUCCESS"]);
        });
    };
    $scope.showAddView = function (){
        $rootScope.localStorage.currentUserData.currentAddData = angular.copy(keyManConstant.localStorage.currentUserData.currentAddData);
        $rootScope.localStorage.viewStatus.hideAddDataView = false;
    };
    $scope.deleteSelected = function (){
        if (!$rootScope.localStorage.currentUserData.selectedUUIDList.length){
            alert(keyManConstant["CONSTANTS"]["TIPS"]["DATA"]["DELETE"]["NO_SELECTED_DATA"]);
            return;
        }
        userService.deleteSelected($rootScope.localStorage.currentUserData.loginName, function (data){
            $rootScope.localStorage.gridOptions.data = data;
            userService.resetShowDataList();
        });
    };
    $scope.showSelected = function (){
        if (!$rootScope.localStorage.currentUserData.selectedDataList.length){
            alert(keyManConstant["CONSTANTS"]["TIPS"]["DATA"]["SHOW"]["NO_SELECTED_DATA"]);
            return;
        }
        $rootScope.localStorage.viewStatus.hideSelectedDataView = false;
    };
    $scope.exportAllData = function (){
        userService.exportAllData(function (msg){
            alert(msg);
        });
    };
}]).controller("loginCtrl", ["$scope", "$rootScope", "userService", "keyManConstant", function ($scope, $rootScope, userService, keyManConstant){
    $scope.entity = {};
    $scope.toRegisterViewFn = function (){
        $scope.entity = {};
        $rootScope.localStorage.viewStatus.viewActType = "register";
    };
    $scope.login = function (){
        var name = $scope.entity.name,
            password = $scope.entity.password;
        userService.login(name, password, function (data){
            $scope.entity = {};
            $rootScope.localStorage.currentUserData.loginName = name;
            $rootScope.localStorage.gridOptions.data = data.list;
            $rootScope.localStorage.viewStatus.viewActType = "main";
        }, function (msg){
            alert(msg);
        });
    };
    $scope.showImportDataViewFn = function (){
        $rootScope.localStorage.viewStatus.hideImportFileView = false;
    };
    $scope.hideImportFileViewFn = function (){
        $rootScope.localStorage.viewStatus.hideImportFileView = true;
    };
    $scope.uploadFileChanged = function (event){
        var target = event.srcElement || event.target;
        if (target && target.files && target.files.length === 1){
            var fileObject = target.files[0];
            userService.importData(fileObject, function (){
                alert(keyManConstant["CONSTANTS"]["TIPS"]["FILE"]["IMPORT"]["IMPORT_SUCCESS"]);
                setTimeout(function (){
                    $rootScope.$apply(function (){
                        $rootScope.localStorage.viewStatus.hideImportFileView = true;
                    });
                }, 100);
            }, function (msg){
                alert(msg);
            });
        }
        return false;
    };
}]).controller("registerCtrl", ["$scope", "$rootScope", "userService", "keyManConstant", function ($scope, $rootScope, userService, keyManConstant){
    $scope.entity = {};
    $scope.toLoginViewFn = function (){
        $scope.entity = {};
        $rootScope.localStorage.viewStatus.viewActType = "login";
    };
    $scope.register = function (){
        var name = $scope.entity.name,
            password = $scope.entity.password;
        userService.register(name, password, function (){
            $scope.entity = {};
            $rootScope.localStorage.currentUserData.loginName = name;
            $rootScope.localStorage.viewStatus.viewActType = "main";
            alert(keyManConstant["CONSTANTS"]["TIPS"]["ACCOUNT"]["REGISTER"]["REGISTER_SUCCESS"]);
        }, function (msg){
            alert(msg);
        });
    };
}]);