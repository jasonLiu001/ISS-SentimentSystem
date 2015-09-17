/// <reference path="../knockout.js" />
/// <reference path="../business/base.js" />
var parameters;
var hasLoad;
//分页
var options = {
    pagerCount: 5,
    pageSize: 12,
    dataCount: 0,
    dataSource: ko.observableArray([]),
    pageIndex: 0,
    isSkip: true,
    callback: function (pageIndex, element) {
        //var parameters = getParameters();
        parameters.pagination.pageindex = pageIndex - 1;
        //todo:获取查询参数
        // beforeLoad();
        window.baseTools.GetManagerWeixin(parameters, function (result) {
            options.dataSource(result.rows);
            computeTotalCount(result);
            $("#selAll").removeAttr("checked");
            endLoad();
        });
    }
};
//定义knockout绑定的viewmodel
var viewModel = function (data) {
    var self = this;
    self.objData = ko.observableArray(data);
    options.dataSource = self.objData;
    self.selectedItems = ko.observableArray();
    self.DeleteBat = function (obj) {

        var objs = [];
        if (obj.b_id) {
            objs.push(obj.b_id);
        }
        else {//批量
            $("input.edit:checked").each(function () {
                var bid = $(this).attr("bid");
                objs.push(bid);
            });
        }
        //调用API
        if (objs.length > 0) {
            window.baseTools.DeleteWeixinBat({
                query: { ids: objs }
            }, function (result) {
                if (result.Result) {
                    self.objData.remove(obj);
                    alert("删除成功！");
                }
            });
        }
        else {
            alert("请选择要删除的记录！");
        }
    }
    self.UpdateBat = function (obj) {
        var objs = [];
        if (obj.b_id) {
            var nid = obj.b_id;
            var newtitle = $("#weixinList tr td textarea[bid='" + nid + "']").val();
            obj.title = newtitle;
            var ntitle = newtitle;
            var nscore = obj.score;
            objs.push({ id: nid, title: ntitle, score: nscore });
        }
        else {//批量
            $("input.edit:checked").each(function () {
                var bid = $(this).attr("bid");
                var ntitle = $("#weixinList tr td textarea[bid='" + bid + "']").val();
                var nscore = $("#weixinList tr td input.score[bid='" + bid + "']").val();
                objs.push({ id: bid, title: ntitle, score: nscore });
            });
        }
        //调用API
        if (objs.length > 0) {
            window.baseTools.EditWeixinBat({
                query: objs
            }, function (result) {
                if (result.Result) {
                    alert("更新成功！");
                }
            });
        }
        else {
            alert("请选择要更新的记录！");
        }
    }
};
//初始化页面
$(function () {
    InitialCheckbox();
    hasLoad = false;
    $("#s_btn").bind("click", function (event) {//高级搜索里的search
        startSearch();
    });
    startSearch();
});

//开始查询
function startSearch() {
    setParameters()
    beforeLoad();
    //todo:初始化查询参数
    window.baseTools.GetManagerWeixin(parameters, function (result) {//base.js //获取新闻舆情 

        options.dataSource(result.rows);
        computeTotalCount(result);
        if (!hasLoad) {
            initGridList(result);
            hasLoad = true;
        }
        initPagination(options, result.totalcount);//初始化分页
        endLoad();
    });
}
//获取查询参数
function setParameters() {
    var searchKeys = $("#s_weixin_title").val();
    parameters = { orderby: { b_id: "desc" }, query: {}, pagination: { pagesize: options.pageSize, pageindex: options.pageIndex } };

    if (searchKeys != "") {
        parameters.query.article_title = searchKeys;
    }
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
//绑定数据到页面
function initGridList(result) {
    viewm = new viewModel(result.rows);
    ko.applyBindings(viewm, document.getElementById("weixinList"));
    if (result.rows.length == 0) {
        $("#weixinList tbody").empty().append("<tr><td colspan='7'>很抱歉，没有相关数据！</td></tr>");
    }

    $("#weixinList tfoot td").removeClass("loadingdata");
    $("#weixinList tbody").fadeIn(300);
}
//加载样式
function beforeLoad() {
    $("#weixinList tfoot td").addClass("loadingdata");
    $("#weixinList tbody").hide();
}
function endLoad() {
    $("#weixinList tfoot td").removeClass("loadingdata");
    $("#weixinList tbody").fadeIn(300);
}
//绑定总页数
function computeTotalCount(data) {
    $("#totalcount").text(data.totalcount);
}
//选择事件
function InitialCheckbox() {
    $("#selAll").click(function () {
        if ($(this).attr("checked")) {
            $("input.edit").attr("checked", true);
        }
        else {
            $("input.edit").removeAttr("checked");
        }
    });
    $("input.edit").live("click", function () {

        if ($("input.edit").not("input:checked").length > 0) {
            $("#selAll").removeAttr("checked");
        }
        else {
            $("#selAll").attr("checked", true);
        }
    });
}