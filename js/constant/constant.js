angular.module("constantApp", [

]).constant("keyManConstant", {
    "loginName": "KeyMan-name",
    "currentStorage": '{"accountType": "normal"}',
    // 全局存储变量
    "localStorage": {
        hideSelectFileView: true,
        // true, false
        showSelectedView: false,
        // true, false
        hideDataView: true,
        // main, login, register
        actType: "main",
        // 当前用户数据
        currentUser: {
            // 登录名
            name: ""
        },
        exportOptions: {
            fileName: "keyManData",
            splitter: "_",
            prefix: ".csv"
        },
        importOptions: {
            fileType: "application/vnd.ms-excel",
            startPrefix: "keyManData"
        },
        // dataGrid操作的数据
        gridOptions: {
            enableGridMenu: true,
            // 每页显示条数的选项
            paginationPageSizes: [9, 20, 50],
            // 默认每页显示的条数
            paginationPageSize: 9,
            columnDefs: [
                {name: 'id', enableCellEdit: false, width: '10%', minWidth: 53},
                {name: 'accountType', displayName: '账号类型', width: '15%', editableCellTemplate: 'ui-grid/dropdownEditor',
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
                {name: 'remark', displayName: '备注', width: '15%', cellTooltip: true, minWidth: 79}
            ],
            data: []
        },
        // 用户选中的列数据，用以弹窗查看
        showDataList: [],
        // 用户选中的列，保存所有数据的uuid，用以删除
        selectedList: [],
        currentData: {
            accountType: "normal",
            name: "",
            password: "",
            url: "",
            remark: ""
        }
    }
});