var parameters;
//分页
var options = {
    pagerCount: 5,
    pageSize: 5,
    dataCount: 0,
    dataSource: ko.observableArray([]),
    pageIndex: 0,
    callback: function (pageIndex, element) {
        //var parameters = getParameters();
        parameters.pagination.pageindex = pageIndex - 1;
        options.pageIndex = pageIndex - 1;
        //todo:获取查询参数
        window.baseTools.getEmergency(parameters, function (result) {
            options.dataSource(result.rows);
        });
    }
};
//定义knockout绑定的viewmodel
var viewModel = function (data) {
    var self = this;
    self.emergencys = ko.observableArray(data);
    options.dataSource = self.emergencys;
    self.removeEmergency = function (emergency) {
        deleteEmergency(emergency.id);
    };
    //编辑弹出层
    self.showEdieEmerModal = function (m) {
        $("#saveEmergency").removeClass("disabled");
        //m为当前操作的实体对象；
        $("#emer-edit").modal("show");
        $("#inputTitle").val(m.title);
        $("#inputClass").val(m.classify);
        $("#inputUrl").val(m.url);
        $("#inputName").val(m.contacts);
        $("#inputPhone").val(m.work_phone);
        $("#inputPolarity").val(m.polarity);
        $("#inputContent").val(m.content);
        $("#saveEmergency").unbind("click").bind("click", function (event) {
            editEmergency(m.id);
        });
    };
    self.index = function (i) {
        return i + options.pageIndex * options.pageSize;
    }
};
$(function () {
    initPage();
});
function initPage() {
    //todo:初始化控件
    //var parameters = getParameters();
    //绑定控件事件
    $("#search").bind("click", function (event) {
        options.pageIndex = 0;
        parameters = getParameters();
        window.baseTools.getEmergency(parameters, function (result) {
            options.dataSource(result.rows);
            initPagination(options, result.totalcount);
            if (result.rows.length == 0) {
                $("#list1 tbody").empty().append("<tr class='kong'><td colspan='7'>很抱歉，目前你搜索的内容为空！</td></tr>");
            } else {
                $("#list1 .kong").remove();
            }
        });
    });
    $("#addEmergency").bind("click", function (event) {
        $("#saveEmergency").removeClass("disabled");
        $("#emer-edit").modal("show");
        //清空
        $("#modal-em").find("input").each(function (index, value) {
            $(value).val("");
        });
        $("#modal-em").find("select").each(function (index, value) {
            $(value).val("-2");
        });
        $("#inputContent").val("");
        $("#myModalLabel").text("应急预案添加");
        var canClick = true;
        $("#saveEmergency").unbind("click").bind("click", function (event) {
            if (canClick == true) {
                canClick = false;
                setTimeout(function () {
                    canClick = true;
                }, 3000);
                addEmergency(event);
            }
        });

    });
    //初始化列表
    parameters = getParameters();
    //todo:初始化查询参数
    window.baseTools.getEmergency(parameters, function (result) {
        initGridList(result);
        ;
        initPagination(options, result.totalcount);

    });

}
function initGridList(result) {
    ko.applyBindings(new viewModel(result.rows), document.getElementById("list1"));
    if (result.rows.length == 0) {
        $("#list1 tbody").empty().append("<tr class='kong'><td colspan='7'>很抱歉，没有相关数据！</td></tr>");
    }
}

//获取查询参数
function getParameters() {
    var polarity = $("#qPolarity").val();
    var title = $("#qTitle").val();
    var classify = $("#qClassify").val();
    //todo:格式验证
    var parametres = { orderby: { createDt: "desc" }, query: {}, pagination: { pagesize: options.pageSize, pageindex: options.pageIndex } };
    if (polarity != "" && polarity != "-2") {
        parametres.query.polarity = polarity;
    }
    if (classify != "" && classify != "-2") {
        parametres.query.classify = classify;
    }
    if (title != "") {
        parametres.query.title = title;
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
function addEmergency() {
    if (checkvalue()) {
        $("#saveEmergency").addClass("disabled");
        var title = $("#inputTitle").val().trim();
        var type = $("#inputClass").val();
        var url = $("#inputUrl").val();
        var contactName = $("#inputName").val().trim();
        var phone = $("#inputPhone").val().trim();
        var polarity = $("#inputPolarity").val();
        var content = $("#inputContent").val();
        if (title == "") {
            alert('标题不能为空');
            event.stopPropagation();
        }
        result = { title: title, phone: phone, content: content, contacts: contactName, classify: type, polarity: polarity, url: url };
        saveData("add", result, function (data) {
            if (data.Result) {
                //初始化列表
                $("#list1 .kong").remove();
                //parameters = getParameters();
                //todo:初始化查询参数
                window.baseTools.getEmergency(parameters, function (result) {
                    options.dataSource(result.rows);
                    initPagination(options, result.totalcount);
                    $("#emer-edit").modal("hide");
                });
            } else {
                alert(data.Message);
                $("#saveEmergency").removeClass("disabled");
                event.stopPropagation();

            }
        });
    }
}
//删除应急预案
function deleteEmergency(id) {
    var result = { id: id };
    if (!confirm("确定是否删除？")) {
        return;
    }
    saveData("delete", result, function (data) {
        //初始化列表
        //parameters = getParameters();
        //todo:初始化查询参数
        window.baseTools.getEmergency(parameters, function (result) {
            options.dataSource(result.rows);
            initPagination(options, result.totalcount);
            if (result.rows.length == 0) {
                $("#list1 tbody").empty().append("<tr class='kong'><td colspan='7'>很抱歉，没有相关数据！</td></tr>");
            }
        });
    });
}
//编辑应急预案
function editEmergency(id) {
    if (checkvalue()) {
        $("#saveEmergency").addClass("disabled");
        var title = $("#inputTitle").val().trim();
        var type = $("#inputClass").val();
        var url = $("#inputUrl").val();
        var contactName = $("#inputName").val().trim();
        var phone = $("#inputPhone").val().trim();
        var polarity = $("#inputPolarity").val();
        var content = $("#inputContent").val();
        result = { id: id, title: title, phone: phone, content: content, contacts: contactName, classify: type, polarity: polarity, url: url };
        saveData("edit", result, function (data) {
            if (data.Result) {
                //初始化列表
                //parameters = getParameters();
                //todo:初始化查询参数
                window.baseTools.getEmergency(parameters, function (result) {
                    options.dataSource(result.rows);
                    initPagination(options, result.totalcount);

                    $("#emer-edit").modal("hide");
                });
            } else {
                    alert(data.Message);
                $("#saveEmergency").removeClass("disabled");
                event.stopPropagation();
            }
        });
    }
}
function saveData(type, settings, callback) {
    switch (type) {
        case "add":
            window.baseTools.addEmergency(settings, callback);
            break;
        case "delete":
            window.baseTools.deleteEmergency(settings, callback);
            break;
        case "edit":
            window.baseTools.editEmergency(settings, callback);
            break;
    }
}

//检查数据有效性
function checkvalue() {
    var result = true;
    $(".required").each(function (index, value) {
        if ($(value).val().trim() == "" || $(value).val() == "-2") {
            alert("您有必填项未填！");
            result = false;
            return result;
        }
    });
    return result;
}