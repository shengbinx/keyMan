angular.module("mainApp", [
    "constantApp",
    "directiveApp",
    "factoryApp",
    "filterApp",
    "serviceApp",
    "controllerApp",
    "ui.grid",
    "ui.grid.edit",
    "ui.grid.exporter",
    "ui.grid.selection",
    "ui.grid.pagination",
    "ui.grid.resizeColumns",
    "ui.grid.moveColumns",
    "w5c.validator"
]).run(["$rootScope", "userService", "keyManConstant", function ($rootScope, userService, keyManConstant){
    $rootScope.localStorage = angular.copy(keyManConstant.localStorage);
    $rootScope.localStorage.gridOptions.onRegisterApi = function (gridApi){
        //set gridApi on scope
        $rootScope.gridApi = gridApi;
        // 编辑列数据回调
        gridApi.edit.on.afterCellEdit($rootScope, function (rowEntity){
            userService.edit($rootScope.localStorage.currentUserData.loginName, rowEntity, function (data){
                $rootScope.localStorage.gridOptions.data = data;
                $rootScope.localStorage.currentUserData.selectedUUIDList = [];
            });
        });
        // 选中列回调
        gridApi.selection.on.rowSelectionChanged($rootScope, function(row){
            var data = row.entity,
                uuid = data.uuid,
                isSelected = row.isSelected;
            if (isSelected){
                userService.addSelectedData(uuid);
            } else {
                userService.removeSelectedData(uuid);
            }
            userService.resetShowDataList();
        });
    };
    userService.isLogin(function (data){
        if (data.isLogin){
            $rootScope.localStorage.currentUserData.loginName = data.loginUser;
            $rootScope.localStorage.gridOptions.data = data.list;
            $rootScope.localStorage.viewStatus.viewActType = "main";
        } else {
            $rootScope.localStorage.viewStatus.viewActType = "login";
        }
    });
}]).config(["w5cValidatorProvider", function (w5cValidatorProvider){
    // w5c.validator表单验证配置开始
    // 全局配置
    w5cValidatorProvider.config({
        // 光标移除元素后是否验证并显示错误提示信息
        blurTrig: true,
        // 可以是bool和function，每个元素验证不通
        // 过后调用该方法显示错误信息，默认true，显示错误信息在元素的后面
        showError: function (elem, msg){
            var input = $(elem[0]),
                parent = input.parents(".form-group");
            parent.find(".msg").text(msg.toString());
            parent.find(".invalid").show();
        },
        // 可以是bool和function，每个元素验证通过后调用该方法移除错误信息，默认true，验证通过后在元素的后面移除错误信息
        removeError: function (elem){
            var input = $(elem[0]),
                parent = input.parents(".form-group");
            parent.find(".msg").text("");
            parent.find(".invalid").hide();
        }
    });3
    w5cValidatorProvider.setRules({
        name: {
            required: "用户名不能为空"
        },
        password: {
            required : "密码不能为空"
        },
        repeatPassword: {
            required: "重复密码不能为空",
            repeat: "两次密码输入不一致"
        },
        url: {
            url: "网址格式输入有误"
        }
    });
    // w5c.validator表单验证配置结束
}]);