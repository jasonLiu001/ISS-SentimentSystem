$(function(){
    var msgC=$('#msgCategory').val();
/**
window.cateObj={
    msgCategory:'ennews',//代表类别.. overseasmonitor.html中数据绑定也使用了：ennews： <tbody data-bind="foreach:ennews">
    msgCategoryFir:'EnNews',
      //eg：'edit'+EnNews，'get'+EnNews,组合成：eg:editEnNews、getEnNews、getWeibo、getWeixin、editWeiBo、editWeixin
    parame:{
        t1:'report_date',
        t2:'news_title'
    }
    t1、t2是getParameters方法内parametres对象的参数
}
 * **/
    switch(msgC){
        case 'weibo':
            window.cateObj={
                msgCategory:'weibo',
                msgCategoryFir:'Weibo',
                parame:{
                    t1:'created_date',
                    t2:'status_text'
                }
            }
            break;
        case 'weixin':
            window.msgCategory='weixin';
            window.msgCategoryFir='Weixin';
            window.cateObj={
                msgCategory:'weixin',
                msgCategoryFir:'Weixin',
                parame:{
                    t1:'post_date',
                    t2:'article_title'
                }
            }
            break;
        case 'EnNews':
            window.cateObj={
                msgCategory:'ennews',//代表类别
                msgCategoryFir:'EnNews',//'edit'+EnNews，'get'+EnNews,组合成：eg:editEnNews、getEnNews、getWeibo、getWeixin、editWeiBo、editWeixin
                parame:{
                    t1:'report_date',
                    t2:'news_title'
                }
            }
            break;
    }
})

var parameters;
var flag = 0;//高亮标识
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
        window.baseTools['get'+window.cateObj.msgCategoryFir](parameters, function (result) {//eg:getWeibo、getWeixin
            options.dataSource(result.rows);
            computeTotalCount(result);
            //initSwitch();
            calcuTitleWidth();
        });
    }
};

//定义knockout绑定的viewmodel
var viewModel = function (data) {
    var self = this;
    self[window.cateObj.msgCategory] = ko.observableArray(data);//eg:weibo、weixin、ennews
    options.dataSource = self[window.cateObj.msgCategory];
    //设置是否敏感
    //self['edit'+window.cateObj.msgCategory+'Sens']= function (n) {
    //    var t = this;
    //    var newObject = jQuery.extend({}, this);
    //    newObject.is_sensitive = this.is_sensitive == false ? true : false;
    //    var postData = {
    //        query: {
    //            b_id: this.b_id,
    //            is_sensitive: newObject.is_sensitive ? 1 : 0,
    //            status: this.status
    //        }
    //    }
    //    window.baseTools['edit'+window.cateObj.msgCategoryFir](postData, function (result) {
    //        self[window.cateObj.msgCategory].replace(t, newObject);
    //    });
    //};
    ////设置是否处理
    //self.['edit'+window.cateObj.msgCategory+'Status']= function (n) {
    //    if (!confirm("确定是否修改舆情状态？")) {
    //        return;
    //    }
    //    var t = this;
    //    var newObject = jQuery.extend({}, this);
    //    newObject.status = this.status == false ? true : false;
    //    var postData = {
    //        query: {
    //            b_id: n.b_id,
    //            status: newObject.status ? 1 : 0,
    //            handle_type: newObject.status ? 4 : 0
    //        }
    //    };
    //    window.baseTools['edit'+window.cateObj.msgCategory](postData, function (data) {
    //        self[window.cateObj.msgCategory].replace(t, newObject);
    //    });
    //};
    //初始化应急处理弹出层
    self.showEmerModal = function (m) {
        //修改弹出层
        editTreeTemp(m);
        //m为当前操作的实体对象；
        curStept = 0;
        changeBtnState();
        newobj = m.b_id == null ? viewm[window.cateObj.msgCategory]()[this.value] : m;
        emerid = 0;
        $('#emergencyList li:eq(0) a').tab('show');
        $("#myModalEmer").modal("show");
        $("#emRadios1").attr("checked", "checked");
        $("#area").hide();
        $("#area").val("");
        $("#qTitleem").val("");
        $("#qPolarityem").val(-2);
        $("#qClassifyem").val(-2);
    }
    //初始化一键追踪弹出层
    self.showTraceModal = function (m) {
        //m为当前操作的实体对象;
        $('#trackHtml li:eq(0) a').tab('show');
        $("#traceDialog").modal("show");
    }
};
$(function () {
    initPage();
    var flag = true;

    calcuTitleWidth();
    $(window).resize(function () {
        calcuTitleWidth();
    })


    $(".left_arr").click(function () {
        var $With = $(window).width();
        var otherWith = 670;//其它列宽度
        if(window.cateObj.msgCategory=='weibo'){otherWith=660;}

        if ($With < 980) {
            $With = 980;
        }

        var titleW = $With - otherWith,
            titleWw = titleW + 180;
        if (!flag) {
            $(".news_newslist .textover>a").css("width", titleW);
            flag = true;
        }
        else {
            setTimeout(function () {
                $(".news_newslist .textover>a").css("width", titleWw);
            }, 150)
            flag = false;
        }
    })
});

//是否为高级搜索
var isAdvancedSearch = false;
var searchType = 0;
function initPage() {
    //搜索框默认当前值为当前城市
    //var cityName = window.global.UserInfo.CustomerName
    //$("#lqTitle").val(cityName).css("color", "#999");
    //$("#lqTitle").bind("focusin", function () {
    //    $(this).val("").removeAttr("style");
    //})
    //todo:初始化控件
    //var parameters = getParameters();
    //绑定控件事件
    $("#search").bind("click", function (event) {
        flag = 2;
        var startstr = $("#qDateStart").val();
        var endstr = $("#qDateEnd").val();

        if (!compareDate(startstr, endstr)) {
            return false;
        }

        parameters = getParameters();
        window.baseTools['get'+window.cateObj.msgCategoryFir](parameters, function (result) {
            $("#totalcount").text(result.totalcount);
            options.dataSource(result.rows);
            initPagination(options, result.totalcount);
            //initSwitch();
            if (result.rows.length == 0) {
                $("#list1 tbody").empty().append("<tr class='kong'><td colspan='7'>很抱歉，目前你搜索的内容为空！</td></tr>");
            } else {
                $("#list1 .kong").remove();
            }
        });
    });
    bindserchclick();

    //初始化列表
    parameters = getParameters();
    BeforeLoad();
    //todo:初始化查询参数
    window.baseTools['get'+window.cateObj.msgCategoryFir](parameters, function (result) {
        $("#totalcount").text(result.totalcount);
        initGridList(result);;
        initPagination(options, result.totalcount);
        //initSwitch();
    });
}
function initGridList(result) {

    viewm = new viewModel(result.rows);
    ko.applyBindings(viewm, document.getElementById("list1"));
    if (result.rows.length == 0) {
        $("#list1 tbody").empty().append("<tr><td colspan='7'>很抱歉，没有相关数据！</td></tr>");
    }
    endLoad();
    //初始化一键追踪和应急处理
    $("#emer").load("template/emerTreatTemp.html");
    $("#track").load("template/trackTemp.html");
}
//算标题的宽度
function calcuTitleWidth() {
    var $With = $(window).width();
    var otherWith = 660;//其它列宽度
    if(window.cateObj.msgCategory=='weixin'){otherWith=670;}

    if ($With < 980) {
        $With = 980;
    }

    var titleW = $With - otherWith,
        titleWw = titleW + 180;
    if ($(".left_menu_yq").width() < 160) {
        $(".news_newslist .textover>a").css("width", titleWw);
    } else {
        $(".news_newslist .textover>a").css("width", titleW);
    }
}

//获取查询参数
function getParameters() {
    var startDate = $("#qDateStart").val();
    var endDate = $("#qDateEnd").val();
    var alarmClass = $("#PosAndNegRating").val();
    var state = $("#qState").val();
    var dimValue = $("#qTitle").val();
    //todo:格式验证
    var parametres = {
        query: {},
        pagination: { pagesize: options.pageSize, pageindex: options.pageIndex }
    };
    var t1=window.cateObj.parame.t1;
    parametres.orderby={};
    parametres.orderby[t1]= "desc";


    if (isAdvancedSearch) {//高级搜索
        if (startDate != "") {
            parametres.query.start_date = startDate;
        }
        if (endDate != "") {
            parametres.query.end_date = endDate;
        }
        if (dimValue != "") {
            parametres.query[window.cateObj.parame.t2] = dimValue;
        }
        if (alarmClass != "" && alarmClass != "-2") {
            parametres.query.level = alarmClass;
        }
        if (state != "" && state != "-2") {
            parametres.query.status = state;
        }
    }
    else {//简单搜索
        if (searchType == 1) {//Day
            var today = formatDatebyDay(new Date());
            parametres.query.start_date = today;
            parametres.query.end_date = today;
        }
        if (searchType == 2) {//Week
            var today = new Date();
            var Y = today.getFullYear(),
                M = today.getMonth() + 1,
                D = today.getDate() - today.getDay() + 1;

            M = M < 10 ? ("0" + M) : M;
            D = D < 10 ? ("0" + D) : D;

            var startDate = Y + "-" + M + "-" + D;
            var endDate = formatDatebyDay(new Date());
            parametres.query.start_date = startDate;
            parametres.query.end_date = endDate;
        }
        if (searchType == 3) {//Month
            var startDate = fromDateByMonth(new Date()) + "-01";
            var endDate = formatDatebyDay(new Date());
            parametres.query.start_date = startDate;
            parametres.query.end_date = endDate;
        }
        var dimValue = $("#lqTitle").val();
        if (dimValue != "") {
            parametres.query[window.cateObj.parame.t2] = dimValue;

        }
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

//应急处理
function emerHandle(t, emerid, typeid, remark, newObject) {
    var postData = {
        query: {
            b_id: newobj.b_id,
            status: 1,
            handle_id: emerid,
            handle_type: typeid,
            handle_remark: remark
        }
    };
    window.baseTools['edit'+window.cateObj.msgCategoryFir](postData, function (result) {//editWeiBo
        parameters = getParameters();
        window.baseTools['get'+window.cateObj.msgCategoryFir](parameters, function (result) {//getWeibo
            $("#totalcount").text(result.totalcount);
            options.dataSource(result.rows);
            initPagination(options, result.totalcount);
            //initSwitch();
            if (result.rows.length == 0) {
                $("#list1 tbody").empty().append("<tr class='kong'><td colspan='7'>很抱歉，目前你搜索的内容为空！</td></tr>");
            } else {
                $("#list1 .kong").remove();
            }
        });
    });
}

//初始化switch
function initSwitch() {
    $('input[name="sen"]').bootstrapSwitch();
    $('input[name="sen"]').bind('switchChange.bootstrapSwitch', function (event, state) {
        var postData = {
            query: {
                b_id: this.value,
                is_sensitive: state ? 1 : 0
            }
        };
        window.baseTools['edit'+window.cateObj.msgCategoryFir](postData, function (result) {
        });
    });
    $('input[name="sta"]').bootstrapSwitch();
    $('input[name="sta"]').bind('switchChange.bootstrapSwitch', function (event, state) {
        var i = this.value;
        var t = viewm[window.cateObj.msgCategory]()[this.value];
        var postData = {
            query: {
                b_id: t.b_id,
                status: state ? 1 : 0,
                handle_type: state ? 4 : 0
            }
        };
        window.baseTools['edit'+window.cateObj.msgCategoryFir](postData, function (data) {//editWeiBo
            var ic = $("#list1 tr:eq(" + ++i + ")>td:last-child>i:last-child")
            if (state) {
                ic.removeClass("icon_emhand").addClass("icon_emhanddisable");
                ic.unbind("click");
            } else {
                ic.removeClass("icon_emhanddisable").addClass("icon_emhand");
                ic.bind("click", viewm.showEmerModal);

            }
        });
    });
}

function BeforeLoad() {
    $("#list1 tfoot td").addClass("loadingdata");
    $("#list1 tbody").hide();
}
function endLoad() {
    $("#list1 tfoot td").removeClass("loadingdata");
    $("#list1 tbody").fadeIn(300)
}

function bindserchclick() {

    //搜索全部
    $("#lqAll").bind("click", function (event) {
        flag = 0;
        searchType = 0;
        $(this).addClass("currentredBtn").siblings().removeClass("currentredBtn");
        parameters = getParameters();
        searchObjs(parameters);
    });
    //搜索今日
    $("#lqToday").bind("click", function (event) {
        flag = 0;
        searchType = 1;
        $(this).addClass("currentredBtn").siblings().removeClass("currentredBtn");
        parameters = getParameters();
        searchObjs(parameters);
    });
    //搜索本周
    $("#lqWeek").bind("click", function (event) {
        flag = 0;
        searchType = 2;
        $(this).addClass("currentredBtn").siblings().removeClass("currentredBtn");
        parameters = getParameters();
        searchObjs(parameters);
    });
    //搜索本月
    $("#lqMonth").bind("click", function (event) {
        flag = 0;
        searchType = 3;
        $(this).addClass("currentredBtn").siblings().removeClass("currentredBtn");
        parameters = getParameters();
        searchObjs(parameters);
    });
    //搜索关键字
    $("#lqsearch").bind("click", function (event) {
        //$("#lqAll").addClass("currentredBtn").siblings().removeClass("currentredBtn");
        flag = 1;
        parameters = getParameters();
        searchObjs(parameters);
    });
    //展开高级搜索
    $("#hqsearch").bind("click", function (event) {
        isAdvancedSearch = true;
        $(this).parent().hide();
        $(this).parent().next().slideDown(200);
    });

    //关闭高级搜索
    $("#back").bind("click", function (event) {
        isAdvancedSearch = false;
        $(this).parent().hide();
        $(this).parent().prev().slideDown(200);
    })
}
function searchObjs(params) {
    window.baseTools['get'+ window.cateObj.msgCategoryFir](params, function (result) {//getWeibo、getEnNews
        $("#totalcount").text(result.totalcount);
        console.log('options',options,'rows:',result.rows)
        options.dataSource(result.rows);
        initPagination(options, result.totalcount);
        //initSwitch();
        if (result.rows.length == 0) {
            $("#list1 tbody").empty().append("<tr class='kong'><td colspan='7'>很抱歉，目前你搜索的内容为空！</td></tr>");
        } else {
            $("#list1 .kong").remove();
        }
    });
}
function editTreeTemp(m) {
    //设置铭感程度，和状态
    if (m.is_sensitive) {
        $("#sensitive").css("left", "48px");
        $("#sensitive").parent().addClass("yes");
    } else {
        $("#sensitive").css("left", "0px");
        $("#sensitive").parent().removeClass("yes");
    }
    if (m.status) {
        $("#state").css("left", "48px");
        $("#state").parent().addClass("yes");
        hideEmerOps()
    } else {
        $("#state").css("left", "0px");
        $("#state").parent().removeClass("yes");
        showEmerOps();
    }
    $("#sensitive").unbind().bind("click", function () {
        var oleft = parseInt($(this).css("left"))
        if (oleft == 48) {  //敏感
            $(this).animate({ "left": "0px" }, 50, "linear", function () {
                $(this).parent().removeClass("yes");
            });
        } else if (oleft == 0) {
            $(this).animate({ "left": "48px" }, 50, "linear", function () {
                $(this).parent().addClass("yes");
            })
        }
        //修改铭感状态
        var postData = {
            query: {
                b_id: m.b_id,
                is_sensitive: m.is_sensitive ? 0 : 1,
                status: m.status
            }
        }
        window.baseTools['edit'+window.cateObj.msgCategoryFir](postData, function (result) {//editWeiBo
            parameters = getParameters();
            m.is_sensitive = postData.query.is_sensitive;
            //window.baseTools['get'+window.cateObj.msgCategoryFir](parameters, function (result) {
            //    $("#totalcount").text(result.totalcount);
            //    options.dataSource(result.rows);
            //    initPagination(options, result.totalcount);
            //    //initSwitch();
            //    if (result.rows.length == 0) {
            //        $("#list1 tbody").empty().append("<tr class='kong'><td colspan='7'>很抱歉，目前你搜索的内容为空！</td></tr>");
            //    } else {
            //        $("#list1 .kong").remove();
            //    }
            //});
        });
    })
    //$("#state").bind("click", function () {
    //    var obj = $(this);
    //    if (obj.text() == state) {
    //        obj.text(noSate);
    //        showEmerOps()

    //    } else if (obj.text() == noSate) {
    //        obj.text(state);
    //        hideEmerOps()
    //    }
    //    var postData = {
    //                query: {
    //                    b_id: m.b_id,
    //                    status: m.status ? 0 : 1,
    //                    handle_type: m.status ? 4 : 0//处理类型
    //                }
    //            };
    //            window.baseTools['edit'+window.cateObj.msgCategoryFir](postData, function (data) {//editWeiBo
    //                //self[window.cateObj.msgCategory].replace(t, newObject);//weibo\ennews
    //            });
    //});
}
function showEmerOps() {
    $("#emerHeader").show();
    $("#emerBody").show();
    $(".modal-footer").show();
}
function hideEmerOps() {
    $("#emerHeader").hide();
    $("#emerBody").hide();
    $(".modal-footer").hide();
}
function highWords(text, words) {//页面中使用 eg:weibomoitor.html
    console.log('flag',flag,text, words)
    if (flag == 0) {
        words = window.global.UserInfo.CustomerName;
    } else if (flag == 1) {//普通搜索
        if ($("#lqTitle").val() != "") {
           if(window.cateObj.msgCategory=='ennews'){
                words = $("#lqTitle").val().toLowerCase();
           }
           else{
                words = $("#lqTitle").val();
           }
        }
        else {
            words = window.global.UserInfo.CustomerName;
        }
    } else if (flag == 2) {//高级搜索
        if ($("#qTitle").val() != "") {
            if (window.cateObj.msgCategory == 'ennews') {
                words = $("#qTitle").val().toLowerCase();
            }
            else {
                words = $("#qTitle").val();
            }
        }
        else {
            words = window.global.UserInfo.CustomerName;
        }
    }
      if(window.cateObj.msgCategory=='ennews'){
       	  return text.replace(new RegExp(words, 'g'), "<span class='redbold'>" + words + "</span>").replace(new RegExp(words.toUpperCase(), 'g'), "<span class='redbold'>" + words.toUpperCase() + "</span>");
      }

      return text.replace(new RegExp(words, 'g'), "<span class='redbold'>" + words + "</span>");
}
function computeTotalCount(data) {
    $("#totalcount").text(data.totalcount);
}