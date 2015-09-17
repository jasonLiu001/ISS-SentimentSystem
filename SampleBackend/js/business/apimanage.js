/**
 * Created by QingWang on 2014/8/25.
 */

//var tenant = -1;
//分页
var options = {
    pagerCount: 5,
    pageSize: 10,
    dataCount: 0,
    dataSource: ko.observableArray([]),
    pageIndex: 0,
    callback: function (pageIndex, element) {
        var parameters = getParameters();
        parameters.pagination.pageindex = pageIndex - 1;
        //todo:获取查询参数
        window.baseTools.getApiList(parameters, function (result) {
            options.dataSource(result.Data);
        });
    }
};
//定义knockout绑定的viewmodel
var viewModel = function (data) {
    var self = this;
    self.apis = ko.observableArray(data);
    options.dataSource = self.apis;
    self.removeApi = function (m) {
        deleteApi(m.id);
    };
    //编辑弹出层
    self.showEditApiModal = function (m) {
        //m为当前操作的实体对象；
        $("#myModalApi").modal("show");
        $("#myModalLabel").text("编辑信息");
        $("#eRouter").val(m.router);
        $("#eValue").val(m.value);
        $("#eNotes").val(m.notes);

        $("#saveApi").unbind("click").bind("click", function (event) {
            editApi(m.id);
        });
    };

    self.index = function (i) {
        return options.pageIndex * options.pageSize + i;
    }
};
$(function () {
    initPage();
});
function initPage() {
    //todo:初始化控件
    var parameters = getParameters();
    //绑定控件事件
    $("#search").bind("click", function (event) {
        parameters = getParameters();
        window.baseTools.getApiList(parameters, function (result) {
            options.dataSource(result.Data);
            initPagination(options, result.TotalCount);
        });
    });
    $("#addApi").bind("click", function (event) {
        $("#myModalApi").modal("show");
        $("#myModalLabel").text("用户添加");
        $("#eRouter").val("");
        $("#eValue").val("");
        $("#eNotes").val("");
        $("#saveApi").unbind("click").bind("click", function (event) {
            addApi();
        });

    });
    //初始化列表
    parameters = getParameters();
    //todo:初始化查询参数
    window.baseTools.getApiList(parameters, function (result) {
        initGridList(result);;
        initPagination(options, result.TotalCount);

    });

}
function initGridList(result) {
    ko.applyBindings(new viewModel(result.Data), document.getElementById("list1"));
}

//获取查询参数
function getParameters() {
    var name = $("#aName").val();
    //todo:格式验证
    var parametres = { orderby: { last_modified: "desc" }, query: {}, pagination: { pagesize: options.pageSize, pageindex: options.pageIndex } };

    if (name != "") {
        parametres.query.router = name;
    }
    return parametres;
}
//初始化分页
function initPagination(options, count) {
    $("#pagination").html("");
    if (options) {
        if (count != undefined) {
            options.dataCount = count;
        }
        $("#pagination").pagination(options);
    }
}
//增加应急预案
function addApi() {
    var m = {};
    m.router = $("#eRouter").val();
    m.value = $("#eValue").val();
    m.notes = $("#eNotes").val();


    saveData("add", m, function (data) {
        //初始化列表
        parameters = getParameters();
        //todo:初始化查询参数
        window.baseTools.getApiList(parameters, function (result) {
            options.dataSource(result.Data);
            initPagination(options, result.TotalCount);
        });
    });
}
//删除应急预案
function deleteApi(id) {
    var parameters = { id: id };
    if (!confirm("确定是否删除？")) {
        return;
    }
    saveData("delete", parameters, function (data) {
        //初始化列表
        parameters = getParameters();
        //todo:初始化查询参数
        window.baseTools.getApiList(parameters, function (result) {
            options.dataSource(result.Data);
            initPagination(options, result.TotalCount);
        });
    });
}
//编辑应急预案
function editApi(id) {

    var m = {};
    m.id = id;
    m.router = $("#eRouter").val();
    m.value = $("#eValue").val();
    m.notes = $("#eNotes").val();

    saveData("edit", m, function (data) {
        //初始化列表
        parameters = getParameters();
        //todo:初始化查询参数
        window.baseTools.getApiList(parameters, function (result) {
            options.dataSource(result.Data);
            initPagination(options, result.TotalCount);
        });
    });
}
function saveData(type, settings, callback) {
    switch (type) {
        case "add":
            window.baseTools.addApi(settings, callback);
            break;
        case "delete":
            window.baseTools.deleteApi(settings, callback);
            break;
        case "edit":
            window.baseTools.editApi(settings, callback);
            break;
    }
}

