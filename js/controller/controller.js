angular.module("controllerApp", [
    "constantApp",
    "filterApp",
    "serviceApp"
]).controller("dataCtrl", ["$scope", "$rootScope", "userService", function ($scope, $rootScope, userService){
    $scope.entity = {};
    $scope.hideDataView = function (){
        $rootScope.localStorage.hideDataView = true;
    };
    $scope.dataMan = function (){
        userService.add($rootScope.localStorage.currentUser.name, $rootScope.localStorage.currentData, function (data){
            $rootScope.localStorage.gridOptions.data = data;
            $rootScope.localStorage.selectedList = [];
            $rootScope.localStorage.hideDataView = true;
            alert("添加成功！");
        });
    };
}]).controller("showDataCtrl", ["$scope", "$rootScope", function ($scope, $rootScope){
    $scope.hideShowDataView = function (){
        $rootScope.localStorage.showSelectedView = false;
    };
}]).controller("mainCtrl", ["$scope", "$rootScope", "userService", "keyManConstant", function ($scope, $rootScope, userService, keyManConstant){
    $scope.quit = function (){
        userService.quit(function (){
            $rootScope.localStorage = angular.copy(keyManConstant.localStorage);
            $rootScope.localStorage.actType = "login";
            alert("注销成功！");
        });
    };
    $scope.showAddView = function (){
        $rootScope.localStorage.currentData = JSON.parse(keyManConstant.currentStorage);
        $rootScope.localStorage.hideDataView = false;
    };
    $scope.deleteSelected = function (){
        if (!$rootScope.localStorage.selectedList.length){
            alert("请先选择要删除的数据！");
            return;
        }
        userService.deleteSelected($rootScope.localStorage.currentUser.name, function (data){
            $rootScope.localStorage.gridOptions.data = data;
            userService.resetShowDataList();
        });
    };
    $scope.showSelected = function (){
        if (!$rootScope.localStorage.showDataList.length){
            alert("请先选择要查看的数据！");
            return;
        }
        $rootScope.localStorage.showSelectedView = true;
    };
    $scope.exportAllData = function (){
        userService.exportAllData(function (fileName){
            alert("文件已成功导出，请到路径C:\\Users\\CurrentUser\\Downloads\\" + fileName + "中进行查看。");
        });
    };
}]).controller("loginCtrl", ["$scope", "$rootScope", "userService", function ($scope, $rootScope, userService){
    $scope.entity = {};
    $scope.toRegister = function (){
        $scope.entity = {};
        $rootScope.localStorage.actType = "register";
    };
    $scope.login = function (){
        var name = $scope.entity.name,
            password = $scope.entity.password;
        userService.login(name, password, function (data){
            $scope.entity = {};
            $rootScope.localStorage.currentUser.name = name;
            $rootScope.localStorage.gridOptions.data = data.list;
            $rootScope.localStorage.actType = "main";
        }, function (msg){
            alert(msg);
        });
    };
    $scope.importData = function (){
        $rootScope.localStorage.hideSelectFileView = false;
    };
    $scope.hideSelectFileViewFn = function (){
        $rootScope.localStorage.hideSelectFileView = true;
    };
}]).controller("registerCtrl", ["$scope", "$rootScope", "userService", function ($scope, $rootScope, userService){
    $scope.entity = {};
    $scope.toLogin = function (){
        $scope.entity = {};
        $rootScope.localStorage.actType = "login";
    };
    $scope.register = function (){
        var name = $scope.entity.name,
            password = $scope.entity.password;
        userService.register(name, password, function (){
            $scope.entity = {};
            $rootScope.localStorage.currentUser.name = name;
            $rootScope.localStorage.actType = "main";

            alert("注册成功！");
        }, function (msg){
            alert(msg);
        });
    };
}]);