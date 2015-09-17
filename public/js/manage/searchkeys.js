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
        window.baseTools.GetSearchKeywordsList(parameters, function (result) {
            options.dataSource(result.Data);
            computeTotalCount(result);
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

        //调用API
        if (obj && confirm("确认要删除吗？")) {
            window.baseTools.DeleteSearchKeywords({
                query: { id: obj.id }
            }, function (result) {
                if (result.Result) {
                    self.objData.remove(obj);
                    alert("删除成功！");
                    endLoad();
                }
            });
        }


    }
    self.UpdateBat = function (obj) {
        var objs = {};
        if (obj.id) {
            var nid = obj.id;

            var fname = obj.field_name;
            var bname = obj.brand_name;
            var dic = obj.dict_category;
            var issearch = obj.is_search;
            var lang = obj.language;

            var nkeyword = obj.keyword;
            var nsearch_engine = obj.search_engine;
            var nis_search = obj.is_search;
            var nmanner = obj.manner;
            objs = { id: nid, field_name: fname, brand_name: bname, dict_category: dic, keyword: nkeyword, search_engine: nsearch_engine, is_search: nis_search, manner: nmanner, language: lang };
        }
        //调用API
        if (objs) {
            window.baseTools.UpdateSearchKeywords({
                query: objs
            }, function (result) {
                if (result.Result) {
                    alert("更新成功！");
                    startSearch();
                    endLoad();
                }
            });
        }

    }
    self.AddData = function () {
        var fname = $("#inputfname").val();
        var bname = $("#inputbname").val();
        var dic = $("#inputdict").val();
        var keyword = $("#inputKeyword").val();
        var searchengine = $("#inputEngine").val();
        var manner = $("#inputManner").val();
        var lang = $("#inputlang").val();

        if (keyword.length==0) {
            alert("请输入关键字名称！");
            return;
        }


        var obj = { field_name: fname, brand_name: bname, dict_category: dic, keyword: keyword, search_engine: searchengine, manner: manner, language: lang };
        if (obj) {
            window.baseTools.AddSearchKeywords({
                query: obj
            }, function (result) {
                if (result.Result) {
                    alert("添加成功！");
                    startSearch();
                    endLoad();
                }
            });
        }
    }
};
//初始化页面
$(function () {
    InitialCheckbox();
    hasLoad = false;
    startSearch();
});

//开始查询
function startSearch() {
    setParameters()
    beforeLoad();
    //todo:初始化查询参数
    window.baseTools.GetSearchKeywordsList(parameters, function (result) {//base.js //获取新闻舆情 

        options.dataSource(result.Data);
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
    var searchKeys = $("#s_news_title").val();
    parameters = { orderby: { report_date: "desc" }, query: {}, pagination: { pagesize: options.pageSize, pageindex: options.pageIndex } };
    //可以设置查询条件
    //if (searchKeys != "") {
    //    parameters.query.keyword = searchKeys;
    //}
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
    viewm = new viewModel(result.Data);
    ko.applyBindings(viewm, document.getElementById("keysList"));

}
//加载样式
function beforeLoad() {
    $("#keysList>tfoot tr:first td").html("").addClass("loadingdata");
    $("#keysList>tbody").hide();
}
function endLoad() {
    var trCount = $("#keysList>tbody tr ").length;

    if (trCount == 0) {
        $("#keysList>tfoot tr:first td").html("").removeClass("loadingdata");
        $("#keysList>tfoot tr:first").find("td").text("很抱歉，没有相关数据！").show();
    }
    else {
   
        $("#keysList>tfoot tr:first").find("td").hide();
    }



    $("#keysList>tbody").fadeIn(300);
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