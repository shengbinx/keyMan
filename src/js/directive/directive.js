angular.module("directiveApp", [

]).directive("uploadFileInput", [function (){
    return {
        restrict: "A",
        replace: true,
        template: "<input type='file' name='selectFiles[]' id='selectFiles' />",
        controller: "loginCtrl",
        link: function ($scope){
            $("#selectFiles").change(function (event){
                $scope.uploadFileChanged(event);
            });
        }
    };
}]);