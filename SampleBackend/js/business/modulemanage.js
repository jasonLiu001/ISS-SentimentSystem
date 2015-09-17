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
        window.baseTools.getModuleList(parameters, function (result) {
            options.dataSource(result.Data);
        });
    }
};
//定义knockout绑定的viewmodel
var viewModel = function (data) {
    var self = this;
    self.module = ko.observableArray(data);
    options.dataSource = self.module;
    self.removeModule = function (m) {
        deleteModule(m.id);
    };
    //编辑弹出层
    self.showEditModuleModal = function (m) {
        //m为当前操作的实体对象；
        $("#myModalModule").modal("show");
        $("#myModalLabel").text("编辑信息");
        initModule(m.parentid);
        $("#eName").val(m.name);
        $("#eUri").val(m.uri);
        $("#eValue").val(m.value);
        $("#eNotes").val(m.notes);
        $("#saveModule").unbind("click").bind("click", function (event) {
            editModule(m.id);
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
        window.baseTools.getModuleList(parameters, function (result) {
            options.dataSource(result.Data);
            initPagination(options, result.TotalCount);
        });
    });
    $("#addModule").bind("click", function (event) {
        $("#myModalModule").modal("show");
        $("#myModalLabel").text("用户添加");
        initModule(null);
        $("#eName").val("");
        $("#eUri").val("");
        $("#eValue").val("");
        $("#eNotes").val("");
        $("#saveModule").unbind("click").bind("click", function (event) {
            addModule();
        });

    });
    //初始化列表
    parameters = getParameters();
    //todo:初始化查询参数
    window.baseTools.getModuleList(parameters, function (result) {
        initGridList(result);;
        initPagination(options, result.TotalCount);

    });

}
function initGridList(result) {
    ko.applyBindings(new viewModel(result.Data), document.getElementById("list1"));
}

//获取查询参数
function getParameters() {
    var name = $("#mName").val();
    //todo:格式验证
    var parametres = { orderby: { last_modified: "desc" }, query: {}, pagination: { pagesize: options.pageSize, pageindex: options.pageIndex } };

    if (name != "") {
        parametres.query.name = name;
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
function addModule() {
        var m = {};
        m.parentid = $("#parentid").val();
        m.name = $("#eName").val();
        m.uri = $("#eUri").val();
        m.value = $("#eValue").val();
        m.notes = $("#eNotes").val();

        saveData("add", m, function (data) {
            //初始化列表
            parameters = getParameters();
            //todo:初始化查询参数
            window.baseTools.getModuleList(parameters, function (result) {
                options.dataSource(result.Data);
                initPagination(options, result.TotalCount);
            });
        });
}
//删除应急预案
function deleteModule(id) {
    var parameters = { id: id };
    if (!confirm("确定是否删除？")) {
        return;
    }
    saveData("delete", parameters, function (data) {
        //初始化列表
        parameters = getParameters();
        //todo:初始化查询参数
        window.baseTools.getModuleList(parameters, function (result) {
            options.dataSource(result.Data);
            initPagination(options, result.TotalCount);
        });
    });
}
//编辑应急预案
function editModule(id) {

        var m = {};
        m.parentid = $("#parentid").val();
        m.name = $("#eName").val();
        m.uri = $("#eUri").val();
        m.value = $("#eValue").val();
        m.notes = $("#eNotes").val();
        m.id = id;

        saveData("edit", m, function (data) {
            //初始化列表
            parameters = getParameters();
            //todo:初始化查询参数
            window.baseTools.getModuleList(parameters, function (result) {
                options.dataSource(result.Data);
                initPagination(options, result.TotalCount);
            });
        });
}
function saveData(type, settings, callback) {
    switch (type) {
        case "add":
            window.baseTools.addModule(settings, callback);
            break;
        case "delete":
            window.baseTools.deleteModule(settings, callback);
            break;
        case "edit":
            window.baseTools.editModule(settings, callback);
            break;
    }
}
//初始化用户组下拉列表
function initModule(parentid){

    $("#parentid").empty();
    $("#parentid").append("<option value='0'>顶级分组</option>");
    var postData = {
        query: {
        }
    };
    window.baseTools.getModuleList(postData, function (data) {
        if (data && data.Result) {
            var options = data.Data;
            for(var item in options)
            {
                var opValue = options[item].id,
                    opText  = options[item].name;
                $("#parentid").append("<option value='"+opValue+"'>"+opText+"</option>");  //添加一项option
            }

            if (parentid != null) {
                $("#parentid").val(parentid);
            }
        }
    });

}

