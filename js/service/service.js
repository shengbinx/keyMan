angular.module("serviceApp", [
    "constantApp",
    "factoryApp"
]).service("userService", ["$rootScope", "uuidFactory", "storageFactory", "cookieFactory", "idFactory", "passwordFactory", "keyManConstant", "downloadFactory", "stringFactory",
    function ($rootScope, uuidFactory, storageFactory, cookieFactory, idFactory, passwordFactory, keyManConstant, downloadFactory, stringFactory){
        var service = {
            isLogin: function (success){
                var loginUser = cookieFactory.get(keyManConstant.loginName),
                    user = storageFactory.get(loginUser),
                    isLogin = (loginUser !== "null" && loginUser !== undefined),
                    data = {
                        isLogin: isLogin,
                        loginUser: loginUser,
                        list: (user ? user.list : [])
                    };
                (typeof success === "function") && success.call(null, data);
            },
            getItemByUuid: function (uuid){
                var user = $rootScope.localStorage.currentUser.name,
                    items = storageFactory.get(user).list;
                for (var i=0,l=items.length; i<l; i++){
                    var item = items[i];
                    if (uuid === item.uuid){
                        return item;
                    }
                }
                return null;
            },
            add: function (loginUser, currentData, success){
                var user = storageFactory.get(loginUser);
                user.list.push({
                    uuid: uuidFactory.generate(),
                    accountType: currentData.accountType || "normal",
                    name: currentData.name,
                    password: currentData.password,
                    passwordStars: passwordFactory.generateStars(currentData.password),
                    url: currentData.url || "",
                    remark: currentData.remark || ""
                });
                idFactory.sorted(user.list);
                storageFactory.save(loginUser, user);
                (typeof success === "function") && success.call(null, user.list);
            },
            edit: function (loginUser, currentData, success){
                var user = storageFactory.get(loginUser),
                    list = user.list,
                    uuid = currentData.uuid;

                for (var i=list.length-1,l=0; i>=l; i--){
                    var item = list[i];
                    if (uuid === item.uuid){
                        item.accountType = currentData.accountType || "normal",
                        item.name = currentData.name;
                        item.password = currentData.password;
                        item.passwordStars = passwordFactory.generateStars(currentData.password);
                        item.url = currentData.url || "";
                        item.remark = currentData.remark || "";

                        idFactory.sorted(user.list);
                        storageFactory.save(loginUser, user);
                        (typeof success === "function") && success.call(null, list);
                        break;
                    }
                }
            },
            delete: function (loginUser, uuid, success){
                var user = storageFactory.get(loginUser),
                    list = user.list;

                for (var i=list.length-1,l=0; i>=l; i--){
                    var item = list[i];
                    if (uuid === item.uuid){
                        list.splice(i, 1);
                        idFactory.sorted(user.list);
                        storageFactory.save(loginUser, user);
                        (typeof success === "function") && success.call(null, list);
                        break;
                    }
                }
            },
            deleteSelected: function (loginUser, success){
                var uuids = $rootScope.localStorage.selectedList;
                for (var i= 0,l=uuids.length;i<l;i++){
                    var uuid = uuids[i];
                    service.delete(loginUser, uuid);
                    service.removeSelectedData(uuid);
                }
                (typeof success === "function") && success.call(null, storageFactory.get(loginUser).list);
            },
            quit: function (success){
                cookieFactory.save(keyManConstant.loginName, null);
                (typeof success === "function") && success.call();
            },
            login: function (name, password, success, error){
                var msg = "";
                if (service.isExists(name)){
                    var user = storageFactory.get(name);
                    if (password === user.password){
                        cookieFactory.save(keyManConstant.loginName, name);
                        (typeof success === "function") && success.call(null, user);
                    } else {
                        msg = "密码错误，请重新输入！";
                        (typeof error === "function") && error.call(null, msg);
                    }
                } else {
                    msg = "用户名不存在，请重新输入！";
                    (typeof error === "function") && error.call(null, msg);
                }
            },
            isExists: function (name){
                return !!storageFactory.get(name);
            },
            register: function (name, password, success, error){
                var msg = "";
                if (service.isExists(name)){
                    msg = "用户名已存在，请重新输入！";
                    (typeof error === "function") && error.call(null, msg);
                } else {
                    storageFactory.save(name, {
                        user: name,
                        password: password,
                        list: []
                    });
                    cookieFactory.save(keyManConstant.loginName, name);
                    (typeof success === "function") && success.call();
                }
            },
            isExistSelectedData: function (uuid){
                var uuids = $rootScope.localStorage.selectedList;
                for (var i = 0,l=uuids.length; i<l; i++){
                    if (uuid === uuids[i]){
                        return {isExists: true, index: i};
                    }
                }
                return {isExists: false};
            },
            addSelectedData: function (uuid){
                var uuids = $rootScope.localStorage.selectedList,
                    result = service.isExistSelectedData(uuid);
                if (!result.isExists){
                    uuids.push(uuid);
                }
            },
            removeSelectedData: function (uuid){
                var uuids = $rootScope.localStorage.selectedList,
                    result = service.isExistSelectedData(uuid);
                if (result.isExists &&
                    typeof result.index !== "undefined"){
                    uuids.splice(result.index, 1);
                }
            },
            resetShowDataList: function (){
                var uuids = $rootScope.localStorage.selectedList,
                    showDataList = $rootScope.localStorage.showDataList = [];

                for (var i= 0,l=uuids.length; i<l; i++){
                    var item = service.getItemByUuid(uuids[i]);
                    item && showDataList.push(item);
                }
            },
            exportAllData: function (success){
                var options = $rootScope.localStorage.exportOptions,
                    user = $rootScope.localStorage.currentUser.name,
                    fileName = options.fileName + options.splitter + user + options.prefix,
                    items = storageFactory.get(user);

                downloadFactory.exportAllData(fileName, items, function (){
                    (typeof success === "function") && success.call(null, fileName);
                });
            },
            importData: function (fileObject, success, error){
                var reader = new FileReader(),
                    options = $rootScope.localStorage.importOptions,
                    csvType = options.fileType,
                    prefix = options.startPrefix,
                    fileName = fileObject.name;
                // 引入错误的文件
                if (csvType !== fileObject.type && !stringFactory.isStartWith(fileName, prefix)){
                    msg = "请选择正确的以keyManData开头的csv数据文件!";
                    (typeof error === "function") && (error.call(null, msg));
                    return;
                }
                reader.onload = function (file){
                    var content = file.currentTarget.result;
                    if (!content){
                        msg = "数据文件内容为空!";
                        (typeof error === "function") && (error.call(null, msg));
                        return;
                    }
                    try {
                        content = JSON.parse(content);
                    } catch(e) {
                        msg = "数据文件已损坏!";
                        (typeof error === "function") && (error.call(null, msg));
                    }
                    storageFactory.save(content.user, content);
                    (typeof success === "function") && (success.call());
                };
                reader.readAsText(fileObject);
            }
        };
        return service;
}]);