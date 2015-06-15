/**
 * 常量定义类
 */
angular.module("constantApp", []).constant("keyManConstant", {
    // 存储cookie中判断当前登录用户的key
    "loginKey": "KeyManUser",
    // 应用全局存储变量
    "localStorage": {
        // 视图切换状态
        viewStatus: {
            // 注册、登录和主界面视图的切换状态
            // @options login、register、main
            viewActType: "main",
            // 是否隐藏导入数据视图
            // @options true、false
            hideImportFileView: true,
            // 是否隐藏查看选中数据视图
            // @options true、false
            hideSelectedDataView: true,
            // 是否隐藏添加数据视图
            // @options true、false
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
        // 数据导出选项
        exportOptions: {
            // 导出文件名前缀
            fileNameStart: "keyManData",
            // 导出文件名分隔符
            splitter: "_",
            // 导出文件名后缀
            endPrefix: ".csv"
        },
        // 数据导入选项
        importOptions: {
            // 导入文件类型
            fileType: "application/vnd.ms-excel",
            // 导入文件名前缀
            fileNameStart: "keyManData"
        },
        // dataGrid操作的数据
        gridOptions: {
            // 是否显示过滤列选项
            // @options true、false
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