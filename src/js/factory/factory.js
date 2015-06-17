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
            var i = 0, l = data.length;
            while (i < l){
                data[i].id = i + 1;
                i++;
            }
        }
    };
}]).factory("passwordFactory", [function (){
    return {
        generateStars: function (password){
            var stars = "", i = 0, l = password.length;
            while (i < l){
                stars += "*";
                i++;
            }
            return stars;
        }
    };
}]).factory("userFactory", [
    "uuidFactory",
    "passwordFactory",
    "encryptFactory",
    function (uuidFactory, passwordFactory, encryptFactory){
        return {
            create: function (data){
                var user = {
                    uuid: uuidFactory.generate(),
                    accountType: data.accountType || "normal",
                    name: data.name,
                    password: encryptFactory.encrypt(data.password),
                    passwordStars: passwordFactory.generateStars(data.password),
                    url: data.url || "",
                    remark: data.remark || ""
                };
                return user;
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
            if (pStr.substr(0, str.length) != str){
                return false;
            }
            return true;
        },
        isEndWith: function (pStr, str){
            if (str == null || str == "" || pStr.length == 0 || str.length > pStr.length){
                return false;
            }
            if (pStr.substring(pStr.length - str.length) != str){
                return false;
            }
            return true;
        }
    };
}]).factory("encryptFactory", ["passwordFactory", function (passwordFactory){
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var base64DecodeChars = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1,
        63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1,
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31,
        32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
        50, 51, -1, -1, -1, -1, -1];
    function base64encode(str){
        var c1, c2, c3;
        var out = "", i = 0, len = str.length;
        while (i < len){
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len){
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len){
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4)
                    | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    }
    function base64decode(str){
        var c1, c2, c3, c4;
        var i = 0, len = str.length, out = "";
        while (i < len){
            /* c1 */
            do {
                c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c1 == -1);
            if (c1 == -1)
                break;
            /* c2 */
            do {
                c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c2 == -1);
            if (c2 == -1)
                break;
            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
            /* c3 */
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61)
                    return out;
                c3 = base64DecodeChars[c3];
            } while (i < len && c3 == -1);
            if (c3 == -1)
                break;
            out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
            /* c4 */
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 == 61)
                    return out;
                c4 = base64DecodeChars[c4];
            } while (i < len && c4 == -1);
            if (c4 == -1)
                break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return out;
    }
    function decryptionList(data){
        var decryptionList = [], i = 0, l = data.length;
        while (i < l){
            var item = data[i];
            item.password = base64decode(item.password);
            item.passwordStars = passwordFactory.generateStars(item.password);
            decryptionList.push(item);
            i++;
        }
        return decryptionList;
    }
    return {
        encrypt: base64encode,
        decryption: base64decode,
        decryptionList: decryptionList
    };
}]);