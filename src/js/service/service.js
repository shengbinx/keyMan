angular.module("serviceApp", [
    "constantApp",
    "factoryApp"
]).service("userService", [
    "$rootScope",
    "uuidFactory",
    "storageFactory",
    "cookieFactory",
    "idFactory",
    "passwordFactory",
    "keyManConstant",
    "downloadFactory",
    "stringFactory",
    "userFactory",
    "encryptFactory",
    function ($rootScope, uuidFactory, storageFactory, cookieFactory, idFactory, passwordFactory, keyManConstant, downloadFactory, stringFactory, userFactory, encryptFactory){
        var service = {
            isLogin: function (success){
                var loginUser = cookieFactory.get(keyManConstant["CONSTANTS"]["LOGIN_KEY"]),
                    userData = storageFactory.get(loginUser),
                    userList = encryptFactory.decryptionList(userData ? userData.list : []),
                    isLogin = (loginUser != undefined && loginUser != "null"),
                    data = {
                        isLogin: isLogin,
                        loginUser: loginUser,
                        list: userList
                    };
                (typeof success === "function") && success.call(null, data);
            },
            getItemByUuid: function (uuid){
                var items = $rootScope.localStorage.gridOptions.data, i = 0, l = items.length,
                    result = null;
                while (i < l){
                    var item = items[i];
                    if (uuid == item.uuid){
                        result = {
                            item: item,
                            index: i
                        };
                        return result;
                    }
                    i++;
                }
                return result;
            },
            add: function (loginUser, currentData, success){
                var userData = storageFactory.get(loginUser),
                    userList = userData.list;
                userList.push(userFactory.create(currentData));

                idFactory.sorted(userList);
                storageFactory.save(loginUser, userData);

                userList = encryptFactory.decryptionList(userList);
                (typeof success === "function") && success.call(null, userList);
            },
            edit: function (loginUser, currentData, success){
                var userData = storageFactory.get(loginUser),
                    userList = userData.list,
                    result = service.getItemByUuid(currentData.uuid);
                if (result){
                    userList.splice(result.index, 1, userFactory.create(currentData));
                    idFactory.sorted(userList);
                    storageFactory.save(loginUser, userData);

                    userList = encryptFactory.decryptionList(userList);
                    (typeof success === "function") && success.call(null, userList);
                }
            },
            delete: function (loginUser, uuid, success){
                var userData = storageFactory.get(loginUser),
                    userList = userData.list,
                    result = service.getItemByUuid(uuid);
                if (result){
                    userList.splice(result.index, 1);
                    idFactory.sorted(userList);
                    storageFactory.save(loginUser, userData);

                    userList = encryptFactory.decryptionList(userList);
                    (typeof success === "function") && success.call(null, userList);
                }
            },
            deleteSelected: function (loginUser, success){
                var uuids = $rootScope.localStorage.currentUserData.selectedUUIDList, i = uuids.length - 1;
                while (i >= 0){
                    var uuid = uuids[i];
                    service.delete(loginUser, uuid);
                    service.removeSelectedData(uuid);
                    i--;
                }
                (typeof success === "function") && success.call(null, storageFactory.get(loginUser).list);
            },
            quit: function (success){
                cookieFactory.save(keyManConstant["CONSTANTS"]["LOGIN_KEY"], null);
                (typeof success === "function") && success.call();
            },
            login: function (name, password, success, error){
                if (service.isExists(name)){
                    var userData = storageFactory.get(name),
                        realPassword = encryptFactory.decryption(userData.password);
                    if (password === realPassword){
                        cookieFactory.save(keyManConstant["CONSTANTS"]["LOGIN_KEY"], name);
                        userData.list = encryptFactory.decryptionList(userData.list);
                        (typeof success === "function") && success.call(null, userData);
                    } else {
                        (typeof error === "function") && error.call(null, keyManConstant["CONSTANTS"]["TIPS"]["ACCOUNT"]["LOGIN"]["ERROR_PASSWORD"]);
                    }
                } else {
                    (typeof error === "function") && error.call(null, keyManConstant["CONSTANTS"]["TIPS"]["ACCOUNT"]["LOGIN"]["NO_USERNAME"]);
                }
            },
            isExists: function (name){
                return !!storageFactory.get(name);
            },
            register: function (name, password, success, error){
                if (service.isExists(name)){
                    (typeof error === "function") && error.call(null, keyManConstant["CONSTANTS"]["TIPS"]["ACCOUNT"]["REGISTER"]["EXIST_USERNAME"]);
                } else {
                    storageFactory.save(name, {
                        user: name,
                        password: encryptFactory.encrypt(password),
                        list: []
                    });
                    cookieFactory.save(keyManConstant["CONSTANTS"]["LOGIN_KEY"], name);
                    (typeof success === "function") && success.call();
                }
            },
            isExistSelectedData: function (uuid){
                var uuids = $rootScope.localStorage.currentUserData.selectedUUIDList, i = 0, l = uuids.length;
                while (i < l){
                    if (uuid === uuids[i]){
                        return {isExists: true, index: i};
                    }
                    i++;
                }
                return {isExists: false};
            },
            addSelectedData: function (uuid){
                var uuids = $rootScope.localStorage.currentUserData.selectedUUIDList,
                    result = service.isExistSelectedData(uuid);
                if (!result.isExists){
                    uuids.push(uuid);
                }
            },
            removeSelectedData: function (uuid){
                var uuids = $rootScope.localStorage.currentUserData.selectedUUIDList,
                    result = service.isExistSelectedData(uuid);
                if (result.isExists && typeof result.index !== "undefined"){
                    uuids.splice(result.index, 1);
                }
            },
            resetShowDataList: function (){
                var uuids = $rootScope.localStorage.currentUserData.selectedUUIDList,
                    showDataList = $rootScope.localStorage.currentUserData.selectedDataList = [], i = 0, l = uuids.length;
                while (i < l){
                    var item = service.getItemByUuid(uuids[i]).item;
                    item && showDataList.push(item);
                    i++;
                }
            },
            exportAllData: function (success){
                var options = keyManConstant["CONSTANTS"]["EXPORT_OPTIONS"],
                    user = $rootScope.localStorage.currentUserData.loginName,
                    fileName = options["FILENAME_START"] + options["SPLITTER"] + user + options["END_PREFIX"],
                    items = storageFactory.get(user);
                downloadFactory.exportAllData(fileName, items, function (){
                    (typeof success === "function") && success.call(null, keyManConstant["CONSTANTS"]["TIPS"]["FILE"]["EXPORT"]["EXPORT_SUCCESS"]);
                });
            },
            importData: function (fileObject, success, error){
                var reader = new FileReader(),
                    options = keyManConstant["CONSTANTS"]["IMPORT_OPTIONS"],
                    csvType = options["FILE_TYPE"],
                    prefix = options["FILENAME_START"],
                    fileName = fileObject.name,
                    importTips = keyManConstant["CONSTANTS"]["TIPS"]["FILE"]["IMPORT"];
                // 引入错误的文件
                if (csvType !== fileObject.type && !stringFactory.isStartWith(fileName, prefix)){
                    (typeof error === "function") && (error.call(null, importTips["ERROR_TYPE_FILE"]));
                    return;
                }
                reader.onload = function (file){
                    var content = file.currentTarget.result;
                    if (!content){
                        (typeof error === "function") && (error.call(null, importTips["EMPTY_CONTENT_FILE"]));
                        return;
                    }
                    try {
                        content = JSON.parse(content);
                    } catch(e) {
                        (typeof error === "function") && (error.call(null, importTips["ERROR_CONTENT_FILE"]));
                    }
                    storageFactory.save(content.user, content);
                    (typeof success === "function") && (success.call());
                };
                reader.readAsText(fileObject);
            }
        };
        return service;
}]);