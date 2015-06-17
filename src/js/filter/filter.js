angular.module("filterApp", [

]).filter("accountTypeFilter", [function (){
    var accountTypes = {
        "normal": '常规登录',
        "email": '电子邮箱'
    };
    return function (type){
        if (type){
            return accountTypes[type];
        }
        return "";
    };
}]);