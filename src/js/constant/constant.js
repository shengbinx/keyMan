angular.module("constantApp", [

]).constant("keyManConstant", {
    "CONSTANTS":{
        // 存储cookie中判断当前登录用户的key
        "LOGIN_KEY": "KeyManUser",
        // 数据导出选项
        "EXPORT_OPTIONS": {
            // 导出文件名前缀
            "FILENAME_START": "keyManData",
            // 导出文件名分隔符
            "SPLITTER": "_",
            // 导出文件名后缀
            "END_PREFIX": ".csv"
        },
        // 数据导入选项
        "IMPORT_OPTIONS": {
            // 导入文件类型
            "FILE_TYPE": "application/vnd.ms-excel",
            // 导入文件名前缀
            "FILENAME_START": "keyManData"
        },
        // 全局提示信息
        "TIPS": {
            // 文件导入导出
            "FILE": {
                "IMPORT": {
                    "ERROR_TYPE_FILE": "请选择正确的以keyManData开头的csv数据文件!",
                    "EMPTY_CONTENT_FILE": "文件内容为空!",
                    "ERROR_CONTENT_FILE": "文件已损坏!",
                    "IMPORT_SUCCESS": "数据导入成功，请登录!"
                },
                "EXPORT": {
                    "EXPORT_SUCCESS": "文件已成功导出，请到路径C:\\Users\\CurrentUser\\Downloads\\中查看."
                }
            },
            // 用户登录注册
            "ACCOUNT": {
                "REGISTER": {
                    "EXIST_USERNAME": "用户名已存在，请重新输入!",
                    "REGISTER_SUCCESS": "注册成功!"
                },
                "LOGIN": {
                    "ERROR_PASSWORD": "密码错误，请重新输入!",
                    "NO_USERNAME": "用户名不存在，请重新输入!"
                },
                "QUIT": {
                    "QUIT_SUCCESS": "注销成功!"
                }
            },
            // 数据操作
            "DATA": {
                "ADD": {
                    "ADD_DATA_SUCCESS": "数据添加成功!"
                },
                "DELETE": {
                    "NO_SELECTED_DATA": "请先选择要删除的数据!"
                },
                "SHOW": {
                    "NO_SELECTED_DATA": "请先选择要查看的数据!"
                }
            }
        }
    },
    // 应用全局存储变量
    "localStorage": {
        // 视图切换状态
        viewStatus: {
            // 注册、登录和主界面视图的切换状态
            // @options login、register、main
            viewActType: "main",
            // 是否隐藏导入数据视图
            hideImportFileView: true,
            // 是否隐藏查看选中数据视图
            hideSelectedDataView: true,
            // 是否隐藏添加数据视图
            hideAddDataView: true
        },
        // 当前登录用户数据
        currentUserData: {
            // 登录名
            loginName: "",
            // 用户选中的数据，用以弹窗查看
            selectedDataList: [],
            // 用户选中的列，保存所有数据的uuid，用以删除
            selectedUUIDList: [],
            // 添加数据界面操作数据
            currentAddData: {
                accountType: "normal",
                name: "",
                password: "",
                url: "",
                remark: ""
            }
        },
        // dataGrid操作的数据
        gridOptions: {
            // 是否显示过滤列选项
            enableGridMenu: true,
            // 每页显示条数的选项
            paginationPageSizes: [9, 20, 50],
            // 默认每页显示的条数
            paginationPageSize: 9,
            // 列定义
            columnDefs: [
                {name: 'id', enableCellEdit: false, width: '8%', minWidth: 53},
                {name: 'accountType', displayName: '账号类型', width: '20%', editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'accountTypeFilter', editDropdownValueLabel: 'accountType', editDropdownOptionsArray: [
                        {id: 'normal', accountType: '常规登录'},
                        {id: 'email', accountType: '电子邮箱'}
                    ], minWidth: 79
                },
                {name: 'name', displayName: '账号', width: '20%', cellTooltip: true, minWidth: 106},
                {name: 'password', displayName: '密码', width: '20%', cellTooltip: true,
                    editableCellTemplate: '<div><form name="inputForm"><input type="text" ui-grid-editor ng-model="row.entity.password"></form></div>',
                    field: "passwordStars",
                    minWidth: 106
                },
                {name: 'url', displayName: '网址', width: '20%', cellTooltip: true, minWidth: 106},
                {name: 'remark', displayName: '备注', width: '20%', cellTooltip: true, minWidth: 79}
            ],
            // 显示的数据列表
            data: []
        }
    }
});