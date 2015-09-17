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
        window.apiTools.EditNewsBat({
            query: newsobjs
        }, function (result) {
            model.GetList();
            alert("更新成功！");
        });
    }
};
//删除一条
globalModel.prototype.DelData = function (obj) {
    //先调用删除API
    var newsids = [];
    newsids.push(obj.b_id);
    window.apiTools.DeleteNewsBat({
        query: { ids: newsids }
    }, function (result) {
        globalModel.self.objData.remove(obj);
        model.GetList();
        alert("删除成功！");
    });
};

var model;
$(function () {
    model = new globalModel();
    model.GetList = function () {
        window.apiTools.GetNewsList(model.params, function (rdata) {

            model.datasource = rdata.rows;
            model.params.pagination.totalCount = rdata.totalcount;
            model.BindData();
            $("#pageContent").PageInitial({ objectModel: model, callback: model.GetList });
        });
    }
    model.GetList();

    ko.applyBindings(model, document.getElementById("newsList"));
    //
    $("#s_btn").click(function () {
        var title = $("#s_news_title").val();
        model.params.query = { "news_title": title };
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

    

})

var DelBat = function () {
    var newsids = [];
    $("input.edit:checked").each(function () {
        newsids.push($(this).attr("bid"));
    });
    if (newsids.length > 0) {
        if (confirm("确定要批量删除吗?")) {
            window.apiTools.DeleteNewsBat({
                query: { ids: newsids }
            }, function (result) {
                model.GetList();
                alert("批量删除成功！");
            });
        }
    }
    else {
        alert("请选择要删除的记录！");
    }
}
var EditBat = function () {
    var newsobjs = [];
    $("input.edit:checked").each(function () {
        var nid = $(this).attr("bid");
        var ntitle = $(this).parent().siblings().find("textarea").text();
        var nscore = $(this).parent().siblings().find("input").val();
        newsobjs.push({ id: nid, title: ntitle, score: nscore });
    });
    if (newsobjs.length > 0) {
        if (confirm("确定要批量更新吗?")) {
            window.apiTools.EditNewsBat({
                query: newsobjs
            }, function (result) {
                model.GetList();
                alert("批量更新成功！");
            });
        }
    }
    else {
        alert("请选择要删除的记录！");
    }
}