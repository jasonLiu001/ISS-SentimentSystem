var parameters;
var flag = 0;//搜索
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
        window.baseTools.getNews(parameters, function (result) {
            options.dataSource(result.rows);
            computeTotalCount(result);
            showSummary();
            calcuTitleWidth();
            endLoad();
        });
    }
};
//定义knockout绑定的viewmodel
var viewModel = function (data) {
    var self = this;
    self.news = ko.observableArray(data);
    options.dataSource = self.news;
    //设置是否敏感
    //self.editNewsSens = function (n) {
    //    var t = this;
    //    var newObject = jQuery.extend({}, this);
    //    newObject.is_sensitive = this.is_sensitive == false ? true : false;
    //    var postData = {
    //        query: {
    //            b_id: this.b_id,
    //            is_sensitive: newObject.is_sensitive ? 1 : 0
    //        }
    //    };
    //    window.baseTools.editNews(postData, function (result) {
    //        self.news.replace(t, newObject);
    //    });
    //};
    //设置是否处理
    //self.editNewsStatus = function (n) {
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
    //            handle_type:  newObject.status ? 4:0
    //        }
    //    };
    //    window.baseTools.editNews(postData, function (data) {
    //        self.news.replace(t, newObject);
    //    });
    //};
    //初始化应急处理弹出层
    self.showEmerModal = function (m) {
        var params = {query: {sentiment_type:'news',b_id: m.b_id} };
        window.baseTools.GetHandleStatus(params,function(result){
            if(result.Data.length>0){
                    m = result.Data[0];
            }
        //修改弹出层
        editTreeTemp(m);
        //m为当前操作的实体对象；
        curStept = 0;
        changeBtnState();
        newobj = m.b_id == null ? viewm.news()[this.value] : m;
        emerid = 0;
        $('#emergencyList li:eq(0) a').tab('show');
        $("#myModalEmer").modal("show");
        $("#emRadios1").attr("checked", "checked");
        $("#area").hide();
        $("#area").val("");
        $("#qTitleem").val("");
        $("#qPolarityem").val(-2);
        $("#qClassifyem").val(-2);
        getNewsLog(m.b_id);
        });
    }
    //初始化一键追踪弹出层
    self.showTraceModal = function (m) {
        //m为当前操作的实体对象;
        $('#trackHtml li:eq(0) a').tab('show');
        $("#traceDialog").modal("show");
    }
};
var hword = "";
$(function () {
    initPage();//页面初始化
    winLay();//改变窗口使用。
});
function winLay() {
    var flagWin = true;//改变窗口使用。
    calcuTitleWidth();
    $(window).resize(function () {
        calcuTitleWidth();
    })
    $(".left_arr").click(function () {
        var $With = $(window).width();
        var otherWith = 640;//其它列宽度
        if ($With < 980) {
            $With = 980;
        }
        var titleW = $With - otherWith,
            titleWw = titleW + 180;
        if (!flagWin) {
            $(".news_newslist .textover>a").css("width", titleW);
            $(".news_newslist .textover>.news-ummary").css("width", titleW);
            flagWin = true;
        }
        else {
            setTimeout(function () {
                $(".news_newslist .textover>a").css("width", titleWw);
                $(".news_newslist .textover>.news-ummary").css("width", titleWw);
            }, 150)
            flagWin = false;
        }
    })
    //$("body").click(function (e) {//tip使用。
    //    var sumary = $(this).hasClass('news-ummary');
    //    if (!sumary) {
    //        $("#tooltip").remove();	 //移除
    //    }
    //})
}
function initPage() {//页面初始化
    searchType = 0;
    //var cityName=window.global.UserInfo.CustomerName;  //搜索框默认当前值为当前城市
    //var lqTitle=$("#lqTitle");
    //lqTitle.val(cityName).css("color", "#999").bind("focusin", function () {
    //    $(this).val("").removeAttr("style");
    //})//input(search near)

    //todo:初始化控件
    $("#search").bind("click", function (event) {//高级搜索里的search
        flag = 2;
        var startstr = $("#qDateStart").val();
        var endstr = $("#qDateEnd").val();

        if (!compareDate(startstr, endstr)) {//暂时放到common.js
            return false;
        }

        parameters = getParameters();//获取查询参数
        beforeLoad();
        window.baseTools.getNews(parameters, function (result) {//base.js //获取新闻舆情
            $("#totalcount").text("总量：" + result.totalcount);
            options.dataSource(result.rows);
            initPagination(options, result.totalcount);//初始化分页
            //initSwitch();
            if (result.rows.length == 0) {
                $("#list1 tbody").empty().append("<tr class='kong'><td colspan='7'>很抱歉，目前你搜索的内容为空！</td></tr>");
            } else {
                $("#list1 .kong").remove();
            }
            showSummary();//显示新闻summary
            endLoad();
        });
    });
    bindserchclick();//搜索全部\今日\本周\本月\关键字\展开高级搜索\关闭高级搜索

    //初始化列表

    startSearch();//开始查询
}
//获取新闻处理日志
function getNewsLog(id){
 var parameters={query:{b_id:id}};
window.baseTools.GetNewsHandleLog(parameters,function(result){
    if(result.Result){
        optionlog.dataSource(result.Data);
    }
});
}
//开始查询
function startSearch() {
    beforeLoad();
    parameters = getParameters();//获取查询参数
    //todo:初始化查询参数
    window.baseTools.getNews(parameters, function (result) {//base.js //获取新闻舆情
        $("#totalcount").text("总量：" + result.totalcount);
        initGridList(result);
        initPagination(options, result.totalcount);//初始化分页
        //initSwitch();
        showSummary();//显示新闻summary
        endLoad();
    });
}
//是否为高级搜索
var isAdvancedSearch = false;
var searchType = 0;
//搜索全部\今日\本周\本月\关键字\展开高级搜索\关闭高级搜索
function bindserchclick() {
    $("#lqAll").bind("click", function (event) { //搜索全部
        flag = 1;
        searchType = 0;
        $(this).addClass("currentredBtn").siblings().removeClass("currentredBtn");
        parameters = getParameters();
        ;
        searchObjs(parameters);
    });
    $("#lqToday").bind("click", function (event) {//搜索今日
        flag = 1;
        searchType = 1;
        $(this).addClass("currentredBtn").siblings().removeClass("currentredBtn");
        parameters = getParameters();
        searchObjs(parameters);
    });
    $("#lqWeek").bind("click", function (event) {//搜索本周
        flag = 1;
        searchType = 2;

        $(this).addClass("currentredBtn").siblings().removeClass("currentredBtn");
        parameters = getParameters();
        console.log(parameters);
        searchObjs(parameters);//ajax 查询
    });
    $("#lqMonth").bind("click", function (event) { //搜索本月
        flag = 1;
        searchType = 3;
        $(this).addClass("currentredBtn").siblings().removeClass("currentredBtn");
        parameters = getParameters();

        searchObjs(parameters);//ajax 查询
    });
    //搜索关键字
    $("#lqsearch").bind("click", function (event) {
        //$("#lqAll").addClass("currentredBtn").siblings().removeClass("currentredBtn");
        flag = 1;
        parameters = getParameters();
        searchObjs(parameters);//ajax 查询
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

//设置要高亮的文字
function SetHighWord() {
    var customerName = window.global.UserInfo.CustomerName;
    if (flag == 0) {
        hword = customerName;
    } else if (flag == 1) {
        if ($("#lqTitle").val() != "") {
            hword = $("#lqTitle").val();
        } else {
            hword = window.global.UserInfo.CustomerName;
        }

    } else if (flag == 2) {
        if ($("#qTitle").val() != "") {
            hword = $("#qTitle").val();
        } else {
            hword = window.global.UserInfo.CustomerName;
        }
    }
}
//高亮文字
function initalHighWords(listid, word) {
    $("#" + listid + " a").highlight(word);
    $("#" + listid + " .news-ummary span").highlight(word);
}

//获取查询参数
function getParameters() {
    var startDate = $("#qDateStart").val();
    var endDate = $("#qDateEnd").val();
    var alarmClass = $("#PosAndNegRating").val();
    var state = $("#qState").val();
    var dimValue = $("#qTitle").val();
    //todo:格式验证
    var parame = { orderby: { report_date: "desc" }, query: {}, pagination: { pagesize: options.pageSize, pageindex: options.pageIndex } };

    if (isAdvancedSearch) {//高级搜索
        if (startDate != "") {
            parame.query.start_date = startDate;
        }
        if (endDate != "") {
            parame.query.end_date = endDate;
        }
        if (dimValue != "") {
            parame.query.news_title = dimValue;
        }
        if (alarmClass != "" && alarmClass != "-2") {
            parame.query.level = alarmClass;
        }
        if (state != "" && state != "-2") {
            parame.query.status = state;
        }
    }
    else {//简单搜索
        if (searchType == 1) {//Day
            var today = formatDatebyDay(new Date());
            parame.query.start_date = today;
            parame.query.end_date = today;
        }
        if (searchType == 2) {//Week
            var today = new Date(),
                todayF = new Date();
            /*var Y = today.getFullYear(),
             M = today.getMonth() + 1,
             D = today.getDate() - today.getDay() + 1;

             M = M < 10 ? ("0" + M) : M;
             D = D < 10 ? ("0" + D) : D;

             var startDate = Y + "-" + M + "-" + D;
             var endDate = formatDatebyDay(new Date());
             parame.query.start_date = startDate;
             parame.query.end_date = endDate;*/
            var todyDay = today.getDay();
            var startDate, endDate;
            if (todyDay == 0) {// 如果是星期天 本周的开始时间就是星期一即当前日期往前推6天 结束日期为当天
                startDate = new Date(today.setDate(today.getDate() - 6));
                endDate = todayF;
            } else if (todyDay == 1) {// 如果是星期一 本周的开始时间就是当天 结束日期为当前日期往后推6天
                startDate = today;
                endDate = new Date(todayF.setDate(todayF.getDate() + 6));
            } else if (todyDay == 2) {// 如果是星期二 本周的开始时间就是当天日期往前推1天 结束日期为当前日期往后推5天
                startDate = new Date(today.setDate(today.getDate() - 1));
                endDate = new Date(todayF.setDate(todayF.getDate() + 5));
            } else if (todyDay == 3) {// 如果是星期三 本周的开始时间就是当天日期往前推2天 结束日期为当前日期往后推4天
                startDate = new Date(today.setDate(today.getDate() - 2));
                endDate = new Date(todayF.setDate(todayF.getDate() + 4));
            } else if (todyDay == 4) {// 如果是星期四 本周的开始时间就是当天日期往前推3天 结束日期为当前日期往后推3天
                startDate = new Date(today.setDate(today.getDate() - 3));
                endDate = new Date(todayF.setDate(todayF.getDate() + 3));
            } else if (todyDay == 5) {// 如果是星期五 本周的开始时间就是当天日期往前推4天 结束日期为当前日期往后推2天
                startDate = new Date(today.setDate(today.getDate() - 4));
                endDate = new Date(todayF.setDate(todayF.getDate() + 2));
            } else {// 如果是星期六 本周的开始时间就是当天日期往前推5天 结束日期为当前日期往后推1天
                startDate = new Date(today.setDate(today.getDate() - 5));
                endDate = new Date(todayF.setDate(todayF.getDate() + 1));
            }
            parame.query.start_date = formatDatebyDay(startDate);
            parame.query.end_date = formatDatebyDay(endDate);
        }
        if (searchType == 3) {//Month
            var startDate = fromDateByMonth(new Date()) + "-01";
            var endDate = formatDatebyDay(new Date());
            parame.query.start_date = startDate;
            parame.query.end_date = endDate;
        }
        var dimValue = $("#lqTitle").val();
        if (dimValue != "") {
            parame.query.news_title = dimValue;
        }

    }
    //添加结束时间
//    if (parame.query.end_date == undefined) {
//        parame.query.end_date = formatDate(new Date());
//    }
    return parame;
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
//显示新闻summary
function showSummary() {
    ///
//    var x = -50;
//    var y = 15;
//    $(".news-ummary").mouseover(function (e) {
//        this.text = $(this).text();
//        //this.href = $(this).prev().attr("href");
//        var $tooltip = $("<div id='tooltip'><div class='tooltip-relative'><div class='arrtopimg'></div><div class='toop-content'><div class='toop-con'>" + this.text + "<\/div>" + "</div></div></div>"); //创建 div 元素
//        $("#tooltip").remove();//如果有先清掉
//        $tooltip.highlight(hword);
//
//        $("body").append($tooltip);	//把它追加到文档中
//        $("#tooltip")
//            .css({
//                "top": (e.pageY + y) + "px",
//                "left": (e.pageX + x) + "px"
//            }).show("fast");	  //设置x坐标和y坐标，并且显示
//
//    }).mouseout(function () {
//        $("#tooltip").remove();
//    }).mousemove(function (e) {
//        $("#tooltip")
//            .css({
//                "top": (e.pageY + y) + "px",
//                "left": (e.pageX + x) + "px"
//            });
//    });
}
//算标题的宽度
function calcuTitleWidth() {
    var $With = $(window).width();
    var otherWith = 640;//其它列宽度

    if ($With < 980) {
        $With = 980;
    }

    var titleW = $With - otherWith,
        titleWw = titleW + 180;
    if ($(".left_menu_yq").width() < 160) {
        $(".news_newslist .textover>a").css("width", titleWw);
        $(".news_newslist .textover>.news-ummary").css("width", titleWw);
    } else {
        $(".news_newslist .textover>a").css("width", titleW);
        $(".news_newslist .textover>.news-ummary").css("width", titleW);
    }
}

function initGridList(result) {
    viewm = new viewModel(result.rows);
    ko.applyBindings(viewm, document.getElementById("list1"));
    if (result.rows.length == 0) {
        $("#list1 tbody").empty().append("<tr><td colspan='7'>很抱歉，没有相关数据！</td></tr>");
    }

    $("#list1 tfoot td").removeClass("loadingdata");
    $("#list1 tbody").fadeIn(300);
    //初始化一键追踪和应急处理
    $("#emer").load("template/emerTreatTemp.html");
    $("#track").load("template/trackTemp.html");
}

function beforeLoad() {
    $("#newsMonitor .loadindex").empty().addClass("loadingdata").show();
    $("#totalcount").hide();
    $("#newsMonitor .newsweibo").hide();
}
function endLoad() {
    $("#newsMonitor .loadindex").empty().removeClass("loadingdata").hide();
    $("#newsMonitor .newsweibo").fadeIn(300);
    $("#totalcount").fadeIn(300);
    SetHighWord();
    initalHighWords("list1", hword);
}

function searchObjs(params) {//ajax 查询
    beforeLoad();
    // var loadDiv="<div style='height: 100%; background-color: gray; position: absolute; width: 100%;left: 0px;top:0px;'>加载中...</div>";
    //  $("#list1").parent("div.table-responsive").append(loadDiv);
    window.baseTools.getNews(params, function (result) {
        $("#totalcount").text("总量：" + result.totalcount);
        options.dataSource(result.rows);
        initPagination(options, result.totalcount);
        //initSwitch();
        if (result.rows.length == 0) {
            $("#list1 tbody").empty().append("<tr class='kong'><td colspan='7'>很抱歉，目前你搜索的内容为空！</td></tr>");
        } else {
            $("#list1 .kong").remove();
        }
        showSummary();
        //  $("#list1").parent("div.table-responsive").find("div").remove();
        endLoad();
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
                is_sensitive: m.is_sensitive ? 0 : 1
            }
        };
        window.baseTools.editNews(postData, function (result) {
            parameters = getParameters();
            m.is_sensitive = postData.query.is_sensitive;
            //window.baseTools.getNews(parameters, function (result) {
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
    //     var postData = {
    //        query: {
    //            b_id: m.b_id,
    //            status: m.status ? 0 :1,
    //            handle_type:  m.status ? 4:0//处理类型
    //        }
    //    };
    //    window.baseTools.editNews(postData, function (data) {
    //        parameters = getParameters();
    //        window.baseTools.getNews(parameters, function (result) {
    //            $("#totalcount").text(result.totalcount);
    //            options.dataSource(result.rows);
    //            initPagination(options, result.totalcount);
    //            //initSwitch();
    //            if (result.rows.length == 0) {
    //                $("#list1 tbody").empty().append("<tr class='kong'><td colspan='7'>很抱歉，目前你搜索的内容为空！</td></tr>");
    //            } else {
    //                $("#list1 .kong").remove();
    //            }
    //        });
    //    });
    //});
}
function showEmerOps() {
    $("#emerHeader").show();
    $("#emerBody").show();
    $(".modal-footer").show();
    $(".log").hide();
}
function hideEmerOps() {
    $("#emerHeader").hide();
    $("#emerBody").hide();
    $(".modal-footer").hide();
    $(".log").show();
}

function computeTotalCount(data) {
    $("#totalcount").text("总量：" + data.totalcount);
}

/***下面的暂时不用了。。。html已注释掉。**/
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
    window.baseTools.editNews(postData, function (result) {
        if (result.Result) {
            if (newobj.status == 0) {//不刷新列表，只修改状态
                newobj.status = 1;
            }
        } else {
            alert(result.Message)
        }

        //不刷列表
        //parameters = getParameters();
//        window.baseTools.getNews(parameters, function (result) {
//            $("#totalcount").text(result.totalcount);
//            options.dataSource(result.rows);
//            initPagination(options, result.totalcount);
//            //initSwitch();
//            if (result.rows.length == 0) {
//                $("#list1 tbody").empty().append("<tr class='kong'><td colspan='7'>很抱歉，目前你搜索的内容为空！</td></tr>");
//            } else {
//                $("#list1 .kong").remove();
//            }
//            showSummary();
//        });
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
        window.baseTools.editNews(postData, function (result) {
        });
    });
    $('input[name="sta"]').bootstrapSwitch();
    $('input[name="sta"]').bind('switchChange.bootstrapSwitch', function (event, state) {
        var i = this.value;
        var t = viewm.news()[this.value];
        var postData = {
            query: {
                b_id: t.b_id,
                status: state ? 1 : 0,
                handle_type: state ? 4 : 0
            }
        };
        window.baseTools.editNews(postData, function (data) {
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
