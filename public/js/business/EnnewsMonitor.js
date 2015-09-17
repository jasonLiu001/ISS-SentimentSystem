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
        window.baseTools.getEnNews(parameters, function (result) {
            options.dataSource(result.rows);
            computeTotalCount(result);
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
        window.baseTools.GetHandleStatus(params,function(result) {
            if (result.Data.length > 0) {
                m = result.Data[0];
            }
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
    initPage();

});
//是否为高级搜索
var isAdvancedSearch = false;
var searchType = 0;
function initPage() {

    searchType = 0;
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
        beforeLoad();
        parameters = getParameters();
        window.baseTools.getEnNews(parameters, function (result) {

            $("#totalcount").text("总量：" + result.totalcount);
            options.dataSource(result.rows);
            initPagination(options, result.totalcount);
            //initSwitch();
            if (result.rows.length == 0) {
                $(".tabel-newscont").empty().append("<div class='no-news'>很抱歉，目前你搜索的内容为空！</div>");
            } else {
                $(".tabel-newscont .no-news").remove();
            }
            endLoad();
        });
    });
    bindserchclick();

    //初始化列表
    parameters = getParameters();
    beforeLoad();
    //todo:初始化查询参数
    window.baseTools.getEnNews(parameters, function (result) {
        $("#totalcount").text("总量：" + result.totalcount);
        initGridList(result);
        initPagination(options, result.totalcount);
        endLoad();
    });

}
function initGridList(result) {

    viewm = new viewModel(result.rows);
    ko.applyBindings(viewm, document.getElementById("list1"));

    if (result.rows.length == 0) {
        $(".tabel-newscont").empty().append("<div class='no-news'>很抱歉，没有相关数据！</div>");
    }
    endLoad();
    //初始化一键追踪和应急处理
    $("#emer").load("template/emerTreatTemp.html");
    $("#track").load("template/trackTemp.html");
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
            hword = customerName;
        }

    } else if (flag == 2) {
        if ($("#qTitle").val() != "") {
            hword = $("#qTitle").val();
        } else {
            hword = customerName;
        }
    }
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
//获取查询参数
function getParameters() {
    SetHighWord();
    var startDate = $("#qDateStart").val();
    var endDate = $("#qDateEnd").val();
    var alarmClass = $("#PosAndNegRating").val();
    var state = $("#qState").val();
    var dimValue = $("#qTitle").val();
    //todo:格式验证
    var parametres = { orderby: { report_date: "desc" }, query: {}, pagination: { pagesize: options.pageSize, pageindex: options.pageIndex } };

    if (isAdvancedSearch) {//高级搜索
        if (startDate != "") {
            parametres.query.start_date = startDate;
        }
        if (endDate != "") {
            parametres.query.end_date = endDate;
        }
        if (dimValue != "") {
            parametres.query.news_title = dimValue;
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
            /*var today = new Date();
            var Y = today.getFullYear(),
                M = today.getMonth() + 1,
                D = today.getDate() - today.getDay() + 1;

            M = M < 10 ? ("0" + M) : M;
            D = D < 10 ? ("0" + D) : D;

            var startDate = Y + "-" + M + "-" + D;
            var endDate = formatDatebyDay(new Date());
            parametres.query.start_date = startDate;
            parametres.query.end_date = endDate;*/
            var today = new Date(),
                todayF = new Date();
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
            parametres.query.start_date = formatDatebyDay(startDate);
            parametres.query.end_date = formatDatebyDay(endDate);
        }
        if (searchType == 3) {//Month
            var startDate = fromDateByMonth(new Date()) + "-01";
            var endDate = formatDatebyDay(new Date());
            parametres.query.start_date = startDate;
            parametres.query.end_date = endDate;
        }
        var dimValue = $("#lqTitle").val();
        if (dimValue != "") {
            parametres.query.news_title = dimValue;
        }
    }
    //添加结束时间
    if (parametres.query.end_date == undefined) {
        parametres.query.end_date = formatDate(new Date(), "sec");
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
    window.baseTools.editNews(postData, function (result) {
        if (result.Result) {
            if (newobj.status == 0) {//不刷新列表，只修改状态
                newobj.status = 1;
            }
        } else {
            alert(result.Message)
        }
        //        parameters = getParameters();
        //        window.baseTools.getEnNews(parameters, function (result) {
        //            $("#totalcount").text(result.totalcount);
        //            options.dataSource(result.rows);
        //            initPagination(options, result.totalcount);
        //            //initSwitch();
        //            if (result.rows.length == 0) {
        //                $(".tabel-newscont").empty().append("<div class='no-news'>很抱歉，目前你搜索的内容为空！</div>");
        //            } else {
        //                $(".tabel-newscont .no-news").remove();
        //            }
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


function beforeLoad() {
    $("#overseasMonitor .loadindex").empty().addClass("loadingdata").show();
    $("#totalcount").hide();
    $("#overseasMonitor .newsweibo").hide();
}
function endLoad() {
    $("#overseasMonitor .loadindex").empty().removeClass("loadingdata").hide();
    $("#overseasMonitor .newsweibo").fadeIn(300);
    $("#totalcount").fadeIn(300);
    initalHighWords("list1", hword);
}

function bindserchclick() {

    //搜索全部
    $("#lqAll").bind("click", function (event) {
        flag = 1;
        searchType = 0;
        $(this).addClass("currentredBtn").siblings().removeClass("currentredBtn");
        parameters = getParameters();
        searchObjs(parameters);
    });
    //搜索今日
    $("#lqToday").bind("click", function (event) {
        flag = 1;
        searchType = 1;
        $(this).addClass("currentredBtn").siblings().removeClass("currentredBtn");
        parameters = getParameters();
        searchObjs(parameters);
    });
    //搜索本周
    $("#lqWeek").bind("click", function (event) {
        flag = 1;
        searchType = 2;
        $(this).addClass("currentredBtn").siblings().removeClass("currentredBtn");
        parameters = getParameters();
        searchObjs(parameters);
    });
    //搜索本月
    $("#lqMonth").bind("click", function (event) {
        flag = 1;
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
    beforeLoad();
    window.baseTools.getEnNews(params, function (result) {
        $("#totalcount").text("总量：" + result.totalcount);
        options.dataSource(result.rows);
        initPagination(options, result.totalcount);
        //initSwitch();
        if (result.rows.length == 0) {
            $(".tabel-newscont").empty().append("<div class='no-news'>很抱歉，目前你搜索的内容为空！</div>");
        } else {
            $(".tabel-newscont .no-news").remove();
        }
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
            //window.baseTools.getEnNews(parameters, function (result) {
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
    //        query: {
    //            b_id: m.b_id,
    //            status: m.status ? 0 : 1,
    //            handle_type: m.status ? 4 : 0//处理类型
    //        }
    //    };
    //    window.baseTools.editNews(postData, function (data) {
    //        //self.news.replace(t, newObject);
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

function initalHighWords(listid, word) {
    $("#" + listid + " a").highlight(word);
}

function computeTotalCount(data) {
    $("#totalcount").text("总量：" + data.totalcount);

}