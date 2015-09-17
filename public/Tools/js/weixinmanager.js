/// <reference path="apihelper.js" />
/// <reference path="../../js/business/base.js" />


//----------------------------以下是扩展方法可以放到要被load 的js中
//获取列表
//globalModel.prototype.GetList = function (parameters) {
//    //调用api
//    var params = parameters == null ? this.params : parameters;

//    window.baseTools.getNews(params, function (rdata) {
//        //rdata为返回的json


//        globalModel.self.objData(rdata.rows);

//        var v = $("#s_news_title").val();
//        if (v.length > 0) {
//            $("#newsList td a").textSearch(v);
//        }
//    });
//};
////添加一条
//globalModel.prototype.AddData = function (obj) {

//    //先调用添加api

//    // var selfData = this.Data;

//    //  selfData.push({newsId:123123});
//    //然后push
//    if (obj.b_id) {
//        globalModel.self.objData.push(obj);
//    }
//};
//编辑一条
globalModel.prototype.EditData = function (obj) {

    //先调用添加api

    var newsobjs = [];
    var nid = obj.b_id;
    var newtitle = $("#newsList tr td textarea[bid='" + nid + "']").val();
    var ntitle = newtitle;
    var nscore = obj.score;

    alert(nid + "" + ntitle + "" + nscore);
    newsobjs.push({ id: nid, title: ntitle, score: nscore });


    if (newsobjs.length > 0) {
        window.apiTools.EditWeixinBat({
            query: newsobjs
        }, function (result) {
            if (result.Result) {
                alert("批量更新成功！");
                model.GetList();
            }
            else {
                alert("更新失败！");
            }
        });
    }
};
//删除一条
globalModel.prototype.DelData = function (obj) {
    //先调用删除API
    var newsids = [];
    newsids.push(obj.b_id);
    window.apiTools.DeleteWeixinBat({
        query: { ids: newsids }
    }, function (result) {

        if (result.Result) {
            alert("批量删除成功！");
            model.GetList();
            globalModel.self.objData.remove(obj);
        }
        else {
            alert("批量删除失败！");
        }
    });
};





//全局model对象
var model;
//页面加载执行
$(function () {
    //实例化会调用GetList方法
    model = new globalModel();
    model.GetList = function () {
        window.apiTools.GetWeixinList(model.params, function (rdata) {
            model.datasource = rdata.rows;
            model.params.pagination.totalCount = rdata.totalcount;
            model.BindData();
            $("#pageContent").PageInitial({ objectModel: model, callback: model.GetList });
        });
    }

    model.GetList();
    ko.applyBindings(model, document.getElementById("newsList"));

    //按钮执行搜索
    $("#s_btn").click(function () {
        var title = $("#s_weixin_title").val();
        model.params.query = { "article_title": title };
        model.params.pagination.pageindex = 0;
        model.GetList();
    });

    $("#selAll").click(function () {
        if ($(this).attr("checked")) {
            $("input.edit").attr("checked", true);
        }
        else {
            $("input.edit").removeAttr("checked");
        }

    });
    $("#btnDelBat").click(function () {
        DelBat();
    });
    $("#btnEditBat").click(function () {
        EditBat();
    });

});
//批量删除
function DelBat() {
    var newsids = [];
    $("input.edit:checked").each(function () {
        newsids.push($(this).attr("bid"));
    });
    if (newsids.length > 0) {
        if (confirm("Delete Batch?")) {

            window.apiTools.DeleteWeixinBat({
                query: { ids: newsids }
            }, function (result) {
                if (result.Result) {
                    alert("删除成功！");
                    model.GetList();
                }
                else {
                    alert("删除失败！");
                }
            });
        }
    }
    else {
        alert("请选择要更新的记录！");
    }
}
//批量更新
function EditBat() {
    var newsobjs = [];
    $("input.edit:checked").each(function () {
        var nid = $(this).attr("bid");
        var ntitle = $(this).parent().siblings().find("textarea").text();
        var nscore = $(this).parent().siblings().find("input").val();
        newsobjs.push({ id: nid, title: ntitle, score: nscore });
    });
    if (newsobjs.length > 0) {
        if (confirm("Edit Batch?")) {
            window.apiTools.EditWeixinBat({
                query: newsobjs
            }, function (result) {
                if (result.Result) {
                    alert("更新成功！");
                    model.GetList();
                }
                else {
                    alert("删除失败！");
                }
            });
        }
    }
    else {
        alert("请选择要删除的记录！");
    }
}