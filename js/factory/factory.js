angular.module("factoryApp", [

]).factory("uuidFactory", [function (){
    return {
        generate: function (){
            return UUID.generate();
        }
    };
}]).factory("idFactory", [function (){
    return {
        sorted: function (data){
            for (var i= 0,l=data.length;i<l;i++){
                data[i].id = i + 1;
            }
        }
    };
}]).factory("passwordFactory", [function (){
    return {
        generateStars: function (password){
            var stars = "";
            for (var i= 0,l=password.length; i<l; i++){
                stars += "*";
            }
            return stars;
        }
    };
}]).factory("storageFactory", [function (){
    return {
        save: function (key, value){
            localStorage.setItem(key, JSON.stringify(value));
        },
        get: function (key){
            return JSON.parse(localStorage.getItem(key));
        }
    };
}]).factory("cookieFactory", [function (){
    return {
        save: function (key, value){
            $.cookie(key, value);
        },
        get: function (key){
            return $.cookie(key);
        }
    };
}]).factory("downloadFactory", [function (){
    var mimeType = 'application/octet-stream;charset=utf-8';
    return {
        exportAllData: function (fileName, dataObj, success){
            var rawFile,
                a = document.createElement("a"),
                csvContent = JSON.stringify(dataObj);
            //html5 A[download]
            if ('download' in a) {
                var blob = new Blob(
                    [csvContent],
                    {type: mimeType}
                );
                rawFile = URL.createObjectURL(blob);
                a.setAttribute('download', fileName);
            } else {
                rawFile = 'data:' + mimeType + ',' + encodeURIComponent(csvContent);
                a.setAttribute('target', '_blank');
            }
            a.href = rawFile;
            a.setAttribute('style', 'display:none;');
            document.body.appendChild(a);
            setTimeout(function() {
                if (a.click) {
                    a.click();
                // Workaround for Safari 5
                } else if (document.createEvent) {
                    var eventObj = document.createEvent('MouseEvents');
                    eventObj.initEvent('click', true, true);
                    a.dispatchEvent(eventObj);
                }
                document.body.removeChild(a);
                (typeof success === "function") && (success.call());
            }, 100);
        }
    };
}]).factory("stringFactory", [function (){
    return {
        isStartWith: function (pStr, str){
            if (str == null || str == "" || pStr.length == 0 || str.length > pStr.length){
                return false;
            }
            if (pStr.substr(0, str.length) == str){
                return true;
            } else {
                return false;
            }
            return true;
        },
        isEndWith: function (pStr, str){
            if (str == null || str == "" || pStr.length == 0 || str.length > pStr.length){
                return false;
            }
            if (pStr.substring(pStr.length - str.length) == str){
                return true;
            } else {
                return false;
            }
            return true;
        }
    };
}]);