angular.module("filterApp", [

]).filter("accountTypeFilter", [function (){
    var accountTypeHash = {
        "normal": '常规登录',
        "email": '电子邮箱'
    };
    return function(type) {
        if (!type){
            return '';
        } else {
            return accountTypeHash[type];
        }
    };
}]);