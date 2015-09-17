var parameters;
//var tenant = -1;
//分页
var options = {
    pagerCount: 5,
    pageSize: 10,
    dataCount: 0,
    dataSource: ko.observableArray([]),
    pageIndex: 0,
    callback: function (pageIndex, element) {
        //var parameters = getParameters();
        parameters.pagination.pageindex = pageIndex - 1;
        //todo:获取查询参数
        window.baseTools.getUserList(parameters, function (result) {
            options.dataSource(result.Data);
        });
    }
};
//定义knockout绑定的viewmodel
var viewModel = function (data) {
    var self = this;
    self.users = ko.observableArray(data);
    options.dataSource = self.users;
    self.removeUser = function (user) {
        deleteUser(user.id);
    };
    //编辑弹出层
    self.showEdieUserModal = function (m) {
        $("#saveUser").removeClass("disabled");
        //m为当前操作的实体对象；
        $("#myModalUser").modal("show");
        $("#myModalLabel").text("编辑用户信息");
        $(".lab").css("display", "none");
        $(".inp").css("display", "inline");
        initGroup(m.groupid);
        $("#eUserName").val(m.username);
        $("#eStatus").val(m.status);
        $("#eEmail").val(m.email);
        $("#ePhone").val(m.phone);
        $(".pwd").css("display", "none");
        $("#saveUser").unbind("click").bind("click", function (event) {
            editUser(m.id);
        });
        $("#resetPwd").unbind("click").bind("click", function (event) {
            var pwd = {};
            pwd.password = "123456";
            pwd.userId = m.id;
            window.baseTools.resetPassword(pwd, function (result) {
                if (result.Result) {
                    alert("重置密码成功，新密码为“123456”。");
                    $("#myModalUser").modal("hide");
                } else {
                    alert(result.Message);
                }
            });
        });
    };
    self.showUser = function (m) {
        $("#myModalUser").modal("show");
        $("#myModalLabel").text("查看用户信息");
        $(".lab").css("display", "block");
        $(".inp").css("display", "none");
        $(".pwd").css("display", "none");
        $("#lUserName").text(m.username);
        $("#lEmail").text(m.email);
        $("#lPhone").text(m.phone);
        $("#lGroup").text(m.groupname);
        $("#lStatus").text(m.status == 1 ? "启用" : "未启用");

    };
    self.getNum = function (p, i) {
        return (p - 1) * 10 + i + 1;
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
        parameters = getParameters();
        window.baseTools.getUserList(parameters, function (result) {
            options.dataSource(result.Data);
            initPagination(options, result.TotalCount);
            if (result.Data.length == 0) {
                $("#list1 tbody").empty().append("<tr class='kong'><td colspan='5'>很抱歉，目前你搜索的内容为空！</td></tr>");
            } else {
                $("#list1 .kong").remove();
            }
        });
    });

    $("#upApp").bind("click", function (event) {
        $.ajax({
            type: "post",
            url: "/api/middleware/GetLastAppFile",
            data:{"versionCode": "1.0.0"},
            success:function(data){

            }
        });
    });


    $("#addUser").bind("click", function (event) {
        $("#saveUser").removeClass("disabled");
        $("#myModalUser").modal("show");
        //清空
        $("#useredit").find("input").each(function (index, value) {
            $(value).val("");
        });
        $("#useredit").find("select").each(function (index, value) {
            $(value).val("-1");
        });
        $("#myModalLabel").text("用户添加");
        $(".lab").css("display", "none");
        $(".inp").css("display", "inline");
        initGroup(null);
        $(".pwd").css("display", "block");
        $("#ePwd").val("12345");
        var canClick = true;
        $("#saveUser").unbind("click").bind("click", function (event) {
            if (canClick == true) {
                canClick = false;
                setTimeout(function () { canClick = true; }, 3000);
                addUser();
            }
        });

    });



    //初始化列表
    parameters = getParameters();
    //todo:初始化查询参数
    window.baseTools.getUserList(parameters, function (result) {
        initGridList(result);;
        initPagination(options, result.TotalCount);

    });

}
function initGridList(result) {

    ko.applyBindings(new viewModel(result.Data), document.getElementById("list1"));
    if (result.Data.length == 0) {
        $("#list1 tbody").empty().append("<tr class='kong'><td colspan='5'>很抱歉，没有相关数据！</td></tr>");
    }
}

//获取查询参数
function getParameters() {
    var username = $("#qUserName").val();
    var status = $("#qStatus").val();
    //todo:格式验证
    var parametres = { orderby: { last_modified: "desc" }, query: {}, pagination: { pagesize: options.pageSize, pageindex: options.pageIndex } };
    if (status != "" && status != "-1") {
        parametres.query.status = status;
    }
    if (username != "") {
        parametres.query.username = username;
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
function addUser() {
    if (checkvalue()) {
        $("#saveUser").addClass("disabled");
        var user = {};
        user.username = $("#eUserName").val().trim();
        user.status = $("#eStatus").val();
        user.email = $("#eEmail").val().trim();
        user.phone = $("#ePhone").val().trim();
        user.groupid = $("#eGroup").val();
        user.password = $("#ePwd").val().trim();
        //if (user.username == "") {
        //    alert('用户名不能为空');
        //    return;
        //}
        saveData("add", user, function (data) {
            //初始化列表
            $("#list1 .kong").remove();
            //parameters = getParameters();
            //todo:初始化查询参数
            window.baseTools.getUserList(parameters, function (result) {
                options.dataSource(result.Data);
                initPagination(options, result.TotalCount);
                $("#myModalUser").modal("hide");

            });
        });
    }
}
//删除应急预案
function deleteUser(id) {
    var user = { id: id };
    if (!confirm("确定是否删除？")) {
        return;
    }
    saveData("delete", user, function (data) {
        //初始化列表
        //parameters = getParameters();
        //todo:初始化查询参数
        window.baseTools.getUserList(parameters, function (result) {
            options.dataSource(result.Data);
            initPagination(options, result.TotalCount);
            if (result.Data.length == 0) {
                $("#list1 tbody").empty().append("<tr class='kong'><td colspan='5'>很抱歉，没有相关数据！</td></tr>");
            }
        });
    });
}
//编辑应急预案
function editUser(id) {
    if (checkvalue()) {
        $("#saveUser").addClass("disabled");
        var user = {};
        user.username = $("#eUserName").val().trim();
        user.status = $("#eStatus").val();
        user.email = $("#eEmail").val().trim();
        user.phone = $("#ePhone").val().trim();
        user.groupid = $("#eGroup").val();
        user.id = id;

        saveData("edit", user, function (data) {
            //初始化列表
            //parameters = getParameters();
            //todo:初始化查询参数
            window.baseTools.getUserList(parameters, function (result) {
                options.dataSource(result.Data);
                initPagination(options, result.TotalCount);

                $("#myModalUser").modal("hide");
            });
        });
    }
}
function saveData(type, settings, callback) {
    switch (type) {
        case "add":
            window.baseTools.addUser(settings, callback);
            break;
        case "delete":
            window.baseTools.deleteUser(settings, callback);
            break;
        case "edit":
            window.baseTools.editUser(settings, callback);
            break;
    }
}
//初始化用户组下拉列表
function initGroup(groupid) {
    $("#eGroup").empty();
    $("#eGroup").append("<option value='-1'>请选择</option>");
    var postData = {
        query: {
        }
    };
    window.baseTools.getGroupList(postData, function (data) {
        if (data && data.Result) {
            var options = data.Data;
            for (var item in options) {
                var opValue = options[item].id,
                        opText = options[item].name;
                $("#eGroup").append("<option value='" + opValue + "'>" + opText + "</option>");  //添加一项option

            }

            if (groupid != null) {
                $("#eGroup").val(groupid);
            }
        }
    });
}
//检查数据有效性
function checkvalue() {
    var result = true;
    $(".required").each(function (index, value) {
        if ($(value).val().trim() == "" || $(value).val() == "-1") {
            alert("您有必填项未填！");
            result = false;
            return result;
        }
    });
    return result;
}