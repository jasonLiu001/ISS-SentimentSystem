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
        options.pageIndex = pageIndex - 1;
        //todo:获取查询参数
        window.baseTools.getGroupList(parameters, function (result) {
            options.dataSource(result.Data);
        });
    }
};
//定义knockout绑定的viewmodel
var viewModel = function (data) {
    var self = this;
    self.groups = ko.observableArray(data);
    options.dataSource = self.groups;
    self.removegroup = function (group) {
        deleteGroup(group.id);
    };
    //编辑弹出层
    self.showEdieGroupModal = function (m) {
        //m为当前操作的实体对象；
        $("#myModalGroup").modal("show");
        $("#myModalLabel").text("编辑用户组信息");
        $("#permission").empty();
        $("#eName").val(m.name);
        $("#eRemoved").val(m.removed);
        //todo：获取权限
        var postData = { id: m.id };
        window.baseTools.getGrouptById(postData, function (data) {
            if (data && data.Result) {
                initPermission(data.Data[0]);
            }
        });
        $("#saveGroup").unbind("click").bind("click", function (event) {
            editGroup(m.id);
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
        options.pageIndex = 0;
        parameters = getParameters();
        window.baseTools.getGroupList(parameters, function (result) {
            options.dataSource(result.Data);
            initPagination(options, result.TotalCount);
        });
    });
    $("#addGroup").bind("click", function (event) {
        $("#myModalGroup").modal("show");
        //清空
        //$("#modal-em").find("input").each(function (index, value) {
        //    $(value).val("");
        //});
        $("#myModalLabel").text("用户组添加");
        $("#permission").empty();
        initPermission(null);
        $("#eName").val("");
        $("#eRemoved").val("-1");

        $("#saveGroup").unbind("click").bind("click", function (event) {
            addGroup();
        });

    });
    //初始化列表
    parameters = getParameters();
    //todo:初始化查询参数
    window.baseTools.getGroupList(parameters, function (result) {
        initGridList(result);;
        initPagination(options, result.TotalCount);

    });

}
function initGridList(result) {
    ko.applyBindings(new viewModel(result.Data), document.getElementById("list1"));
}

//获取查询参数
function getParameters() {
    var name = $("#qName").val();
    var removed = $("#qRemoved").val();
    //todo:格式验证
    var parametres = { orderby: { last_modified: "desc" }, query: {}, pagination: { pagesize: options.pageSize, pageindex: options.pageIndex } };
    if (removed != "" && removed != "-1") {
        parametres.query.removed = removed;
    }
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
function addGroup() {
    var name = $("#eName").val();
    var removed = $("#eRemoved").val();
    //todo：获取权限
    var permission = getPermission();
    if (name == "") {
        alert('用户组名不能为空');
        return;
    }
    result = { name: name, removed: removed, permission: permission};
    saveData("add", result, function (data) {
        //初始化列表
        parameters = getParameters();
        //todo:初始化查询参数
        window.baseTools.getGroupList(parameters, function (result) {
            options.dataSource(result.Data);
            initPagination(options, result.TotalCount);

        });
    });
}
//删除应急预案
function deleteGroup(id) {
    var parameters = { id: id };
    if (!confirm("确定是否删除？")) {
        return;
    }
    saveData("delete", parameters, function (data) {
        //初始化列表
        parameters = getParameters();
        //todo:初始化查询参数
        window.baseTools.getGroupList(parameters, function (result) {
            options.dataSource(result.Data);
            initPagination(options, result.TotalCount);

        });
    });
}
//编辑用户组信息
function editGroup(id) {
    var name = $("#eName").val();
    var removed = $("#eRemoved").val();
    //todo：获取权限
    var permission = getPermission();
    result = { id: id, name: name, removed: removed, permission: permission};
    saveData("edit", result, function (data) {
        //初始化列表
        parameters = getParameters();
        //todo:初始化查询参数
        window.baseTools.getGroupList(parameters, function (result) {
            options.dataSource(result.Data);
            initPagination(options, result.TotalCount);

        });
    });
}
function saveData(type, settings, callback) {
    switch (type) {
        case "add":
            window.baseTools.addGroup(settings, callback);
            break;
        case "delete":
            window.baseTools.deleteGroup(settings, callback);
            break;
        case "edit":
            window.baseTools.editGroup(settings, callback);
            break;
    }
}
//初始化权限模块
function initPermission(m) {
    $("#permission").append("<label class='col-sm-2 control-label'>权限：</label>");
    var postData = {};
    window.baseTools.getMoudlle(postData, function (data) {
        if (data && data.Result) {
            var options = data.Data.model;
            for (var item in options) {
                if (options[item].parentid == '0') {
                    var subOptions = $.grep(options, function (n, i) {
                        return n.parentid == options[item].id;
                    });
                    var d = $("<div></div>");
                    for (var sumItem in subOptions) {
                        d.append('<div class="checkbox"><label><input type="checkbox" name="pcheck" value =' + subOptions[sumItem].id + ' data-parentid=' + subOptions[sumItem].parentid + '>' + subOptions[sumItem].name + '</label></div>');
                    }
                    $("#permission").append('<div class="checkbox col-sm-4"><label><input type="checkbox" name="pcheck" value =' + options[item].id + '>' + options[item].name + d.html() + '</label></div>');
                }
            }
            if (m != null) {
                var permission = m.permission;
                for (var item in permission) {
                    $("[name = pcheck]:checkbox").each(function () {
                        if ($(this).val() == permission[item].id) {
                            $(this).attr("checked", true);
                        }
                    });
                }
            }
        }
    });
}

function getPermission(group) {
    var result = new Array();
    $("[name = pcheck]:checkbox").each(function () {
        if ($(this).is(":checked")) {
            result.push($(this).attr("value"));
        }
    });
    return result.join("#;");
}