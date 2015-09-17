/// <reference path="base.js" />
/// <reference path="../jQuery.js" />
/// <reference path="../iChart.js" />
var homeIntervalTime = 1000 * 60 * 5;
var intervalHot;
var intervalData;
var brand_name = "";//空字符串或者没有字段就是全部
var cricleHeight=80;
var todayHeight=181;
var newsCount=5;
var newsHeight=345;
$(function () {
    sLogin(function(result){//模拟登录
        var city= result.FullCustomerName;
     //console.log(result);
        $("#cityName").html(city);
        loadData()
    });


    $(".new-hidetype li").bind("click", function () {
        var oTtype=$(this).parent().parent().prev().children("span");
        var oIcon=$(this).parent().parent().prev().children("i")
        oTtype.text($(this).text());
        oIcon.removeClass("icon_arrup_gray").addClass("icon_arrdown_gray");
        $(this).parent().parent().hide();
    })


});
//新闻听滚动
var marqueeObjnews = new marqueeObj();
function scrollNews() {

    //$("#scrollnews").css("padding-top",$("#scrollnews").find("li").height());

    marqueeObjnews.append("scrollnews", 100,4*1000);
    $("#scrollnews").parent().hover(function () {
        marqueeObjnews.stop();
    }, function () {
        marqueeObjnews.start();
    });
    marqueeObjnews.start();
}
var marqueeObjWeibo = new marqueeObj();
function scrollweibo() {

    //$("#scrollnews").css("padding-top",$("#scrollnews").find("li").height());
    //$("#scrollweibo").find("li").height()
    marqueeObjWeibo.append("scrollweibo",100,4*1000);
    $("#scrollweibo").parent().hover(function () {
        marqueeObjWeibo.stop();
    }, function () {
        marqueeObjWeibo.start();
    });
    marqueeObjWeibo.start();
}
//if(marqueeObjnews===marqueeObjWeibo){
//    console.log('相等');
//}
function loadData(){
    var height=$(window).height();
    var width=$(window).width();
    if(height==0&&width==0){
        height=1080;
        width=1920;
        $('body').css('height',height);
        $('body').css('width',width);
        $('#head_topmap').css('height',100);

    }
    var  wH=width/height;
    var updateToDayWidth=width/6;
    var updateToDayHeight=updateToDayWidth/wH*1.2;
    cricleHeight=updateToDayHeight;
    todayHeight=cricleHeight*2+10;
    $(".indexPage_updateToday_container").css("height",updateToDayHeight+"px");
    $(".indexPage_updateToday_container_word").css("height",updateToDayHeight+"px")
    $("#negative-conbg-today").css("height",todayHeight+"px");
    $("#negative-conbg-week").css("height",todayHeight+"px");
    var newsWidth=$(".indexPage_levelfour_news_container").width();
    var theLeftHeight=height-$("#head_topmap").height()-$(".indexPage_brand_class").height()-$(".indexPage_levelthree").height()-40;
     newsHeight=theLeftHeight;//theLeftHeight<0?240:theLeftHeight;//newsWidth/wH;


    //$(".indexPage_levelfour_news_container").css("height",newsHeight+"px");
    newsCount=Math.floor((newsHeight)/80)+1;

    console.log("the height is:"+height+",the width is:"+width+",the wh is "+wH+", the updateToDayWidth is "+updateToDayWidth+",the today height is "+todayHeight+"the news height is "+newsHeight+"the news count is "+newsCount+", the left height is "+theLeftHeight);

    GetCategory();
    GetAllData();
    ClearDataTimer();
    intervalData = setInterval(function () {
//        GetAllData();
//        UpdateNewsAndWeiboDate();
        window.location.reload();
    }, homeIntervalTime);

    homeDataTimer.push(intervalData);

    NewsMonitor();
    WeiboMonitor();
    $(".index_title span a").click(function () {
        GoTargetPage($(this).attr("href"));
    });
    //点击大类
    $(".indePage_brand_container_inner a").live("click", function () {
        var curCategory = $(this).text();
        console.log(curCategory);
        $(".indePage_brand_container_inner span").removeClass("current_cate");
        $(this).parent(0).addClass("current_cate");
        brand_name = curCategory;
        if (brand_name == "全部") {
            brand_name = "";
        }
        GetAllData();
        UpdateNewsAndWeiboDate();

    });

    $("#newsFilterMore").bind("click",function(){
        var that = this;
        showMore(that);

    })
    $("#weoboFilterMore").bind("click",function(){
        var that = this;
        showMore(that);
    })
}
function SetNewsCate()
{
    if(brand_name=="")
    {
        $(".index-news-list-title-left").css({"margin-right":"0px","padding-right":"0px"});
        $(".index-news-list-title-right").css("width","0px");
    }
    else
    {
        $(".index-news-list-title-right").show().removeAttr("style");
        $(".index-news-list-title-right>.tag").text(brand_name);
    }

}
function GetAllData() {
    TodayUpdate();
    TodayDownSide();
    WeekDownSide();
    TodayHotWeibo();
}
function GetCategory() {
    $("#brand_Names").html("正在获取...")
    window.baseTools.GetBrands({}, function (results) {
        if (results.Result) {
            $("#brand_Names").html("").append("<span class='current_cate'><a href='javascript:void(0)'>全部</a></span>");
            $.each(results.Data, function (i, o) {
                if (o.category_name.indexOf("english") == -1) {
                    if(o.category_name.indexOf("其它")<0){
                        $("#brand_Names").append("<span><a href='javascript:void(0)'>" + o.category_name + "</a></span>");
                    }

                }
            });
            $("#brand_Names").append("<span><a href='javascript:void(0)'>其它</a></span>");
        }
    });
}
//今日更新
function TodayUpdate() {

    var today = new Date();
    var parameters = {
        query: {
            start_date: formatDateType(today, "hour"), //formatDate(today),
            end_date: formatDateType(today, "hour"),
            brand_name: brand_name
        }
    };

    $(".indexPage_updateToday span.circle-text").text("加载中");
    window.baseTools.GetSentimentDailyReport(parameters, function (result) {

        if (result && result.Result) {
            var sumCount= parseInt(result.Data[0].sumCount);
            var negCount = parseInt(result.Data[0].NegCount);
            var posCount = parseInt(result.Data[0].POSCount)

            var posPercent = ((posCount/ sumCount) * 100).toFixed(2);
            var negPercent = ((negCount/ sumCount) * 100).toFixed(2);
            var circlHtml = "<div data-dimension='"+Math.round(cricleHeight/1.1)+"' data-width='"+cricleHeight/6+"' data-fontsize='20' style='margin-left:15px'></div>";
            //console.log(posPercent+","+negPercent);
            var $todaynegative = $(circlHtml);
            $todaynegative.attr({ "class": "indexPage_negative", "data-text": negCount, "data-percent": negPercent, "data-fgcolor": "#ffffff", "data-bgcolor": "#f58060" });
            var todaynegativeHtml = $todaynegative.circliful();
            $("#today_negative").html(todaynegativeHtml)


            var $todayupdate = $(circlHtml);
            $todayupdate.attr({ "class": "indexPage_postive", "data-text": posCount, "data-percent": posPercent, "data-fgcolor": "#ffffff", "data-bgcolor": "#95cb5c" });
            var todayupdateHtml = $todayupdate.circliful();
            $("#today_update").html(todayupdateHtml);
        }
    });
}

function getElemByTime(sArr, curTime) {
    var curElem;
    for (var i = 0; i < sArr.length; i++) {
        if (sArr[i][0] == curTime) {
            curElem = sArr[i];
            break;
        }
    }
    return curElem;
}
//今日负面趋势
function TodayDownSide() {
    //今天的0秒和 最后一秒
    var curDate = new Date();

    var _curYear = curDate.getFullYear();
    var _curMonth = curDate.getMonth();
    var _curDate = curDate.getDate();
    var _curHour = curDate.getHours();

    var newDate = new Date(_curYear, _curMonth, _curDate, _curHour);


    var start_date = new Date(newDate.setHours(newDate.getHours() - 11));

    var end_date = new Date(_curYear, _curMonth, _curDate, _curHour);

    //  console.log(start_date+"000000"+end_date);
    // var start_date = mDate
    window.baseTools.GetSentiment({
        query: {
            start_date: formatDateType(start_date, "hour"),// start_date,
            end_date: formatDateType(end_date, "hour"),
            timeType: 'hour',
            level: -1,
            brand_name: brand_name
        }
    }, function (result) {
        if (result && result.success) {
            var sDate = [];// result.data;

            var cDate = start_date;

            var _start = start_date;
            var _end = end_date;

            var h = new Date(_start).getHours();

            while (_start <= _end) {

                var resCur = getElemByTime(result.data, +_start);
                if (resCur) {
                    sDate.push(resCur);
                }
                else {
                    sDate.push([+_start, 0]);
                }
                //sDate.push([+_start, 0]);
                if (h < 24) {
                    h += 1;
                }
                else {
                    h = 1
                }
                _start = new Date(cDate.setHours(h));
            }

            for (var i = 0; i < sDate.length; i++) {
                var utc = new Date(sDate[i][0]);
                sDate[i][0] = Date.UTC(utc.getFullYear(), utc.getMonth(), utc.getDate(), utc.getHours());
            }

            var chartSubTitle = "截止到" + (_curMonth + 1) + "月" + _curDate + "日" + _curHour + "时";

            $("#negative-conbg-today").indexPageChart({ subTitle: chartSubTitle, data: sDate,height:todayHeight });
            //resizeChart();
        }
    });

}

function findWeek(sArr, currElem) {
    for (var m = 0; m < sArr.length; m++) {
        if (currElem == sArr[m][0]) {
            return true;
        }
    }
    return false;
}
//一周负面趋势
function WeekDownSide() {
    //var dataday = [[Date.UTC(2014, 08, 04), 210], [Date.UTC(2014, 08, 05), 326], [Date.UTC(2014, 08, 06), 310], [Date.UTC(2014, 08, 07), 290], [Date.UTC(2014, 08, 08), 150], [Date.UTC(2014, 08, 09), 230], [Date.UTC(2014, 08, 10), 110]];
    var curdate = new Date();
    var _startDay = new Date();
    var _endDay = new Date();


    //周一到周五
    var startdate = new Date(curdate.setDate(curdate.getDate() - 6));
    var enddate = new Date();
    //var startdate = _startDay.setDate(curdate.getDate()-curdate.getDay()+1);
    //var enddate = _endDay.setDate(curdate.getDay() + 6);

    //console.log(new Date(startdate) + "----" +new Date(enddate));
    window.baseTools.GetSentimentDay({
        query: {
            start_date: formatDateType(startdate, "day"),//startdate,
            end_date: formatDateType(enddate, "day"),//enddate,
            level: -1,
            brand_name: brand_name
        }
    }, function (result) {
        if (result && result.success) {
            var cDate = new Date(), sDate = [];
            var H = 8;
            if (result.data.length) {
                H = new Date(result.data[0][0]).getHours();
            }
            for (var i = 0; i < 7; i++) { //7天
                var res = findWeek(result.data, +new Date(cDate.getFullYear(), cDate.getMonth(), cDate.getDate() - i, H));//i代表这个小时
                // console.log('hss',res);
                if (!res) {
                    var n = new Date(cDate.getFullYear(), cDate.getMonth(), cDate.getDate() - i, H);//若是周几则使用day几号+时分秒。。。(i,时，分，秒)
                    sDate.push([+n, 0, n]);
                }
            }

            for (var m = 0; m < result.data.length; m++) {
                result.data[m].push('old', new Date(result.data[m][0]))
                sDate.push(result.data[m]);
            }
            sDate.sort(function (a, b) {
                return a[0] - b[0];
            })
            //console.log('sDate:', sDate);//sDate是最终结果。

            $("#negative-conbg-week").indexPageChart({
                chartType: 'column', data: sDate,height:todayHeight
            });
            //resizeChart();
        }
    });


}
//热点播报
function TodayHotWeibo() {

    var curDate = new Date();

    var startDate = new Date(curDate.setDate(curDate.getDate() - 7));
    window.baseTools.GetWeiBoHot({
        query: {
            start_date: formatDateType(startDate, 'day'),
            //end_date: enddate,
            //level: -1,
            topn: 30
        }
    }, function (result) {
        if (result && result.success) {
            $("#content-news ul").empty();
            $.each(result.data, function (i, o) {
                var reportCount = 0;
                reportCount = o.reposts_count == null ? 0 : o.reposts_count;
                $("#content-news ul").append("<li><a target='_blank' href='" + o.news_url + "' title='" + o.news_title + "'><span class='fl-contenthot'>" + o.news_title + "</span></a></li>");
            });
            MoveLi();
        }
    });

}
//清除移动Timer
function ClearULTimer() {
    for (var i = 0; i < homeULTimer.length; i++) {
        clearInterval(homeULTimer[i]);
    }
    homeULTimer = [];
}

//清除数据更新Timer
function ClearDataTimer() {
    for (var i = 0; i < homeDataTimer.length; i++) {
        clearInterval(homeDataTimer[i]);
    }
    homeDataTimer = [];
}


function MoveLi() {
    var allwidth = 0;
    $("#content-news ul li").each(function () {
        allwidth += $(this).width() + 150;
    });

    $("#content-news").width(allwidth);
    $("#content-news ul").width(allwidth);

    ClearULTimer();
    intervalHot = setInterval(autoMove, 30);
    homeULTimer.push(intervalHot);

    function autoMove() {
        var firstWidth = $("#content-news ul li:first").width() + 30;

        if (parseInt($("#content-news ul").css("left")) <= -firstWidth) {

            var firstLi = $("#content-news ul li:first").html();
            if (firstLi) {
                $("#content-news ul li:first").remove();
                $("#content-news ul").append("<li>" + firstLi + "</li>");
                $("#content-news ul").css("left", 0);
            }
        }
        else {
            $("#content-news ul").css("left", "-=1");
        }
    }
    $("#content-news").unbind('mouseover').mouseover(function () {
        ClearULTimer();
    })
    $("#content-news").unbind('mouseout').mouseout(function () {
        homeULTimer.push(setInterval(autoMove, 30));
    })
}
//新闻监听
function NewsMonitor() {
    var newsViewModel = function () {
        var self = this;
        self.news = ko.observableArray([]);
        self.lastInterest = ko.observable();
        self.filterFun = function (plevel) {
            marqueeObjnews.stop();
            $("#newsFilter button").removeClass("currentlevel");
            $("#newsFilter button[level='" + plevel + "']").addClass("currentlevel");
            BeforeLoad("newsMonitor");
            window.baseTools.GetNewsSentimentMonitor({
                query: {
                    level: plevel,
                    topn:10,
                    brand_name: brand_name
                }
            }, function (result) {
                if (result && result.success) {
                    marqueeObjnews.stop();
                    self.news(result.data);
                    SetNewsCate();
                    endLoad("newsMonitor");
                    if (result.data.length == 0) {
                        //console.log("result.data.length " + result.data.length);
                        alertInformation("newsMonitor");
                        marqueeObjnews.stop();
                    }
                    $("#news").css("height",newsHeight);
                    $("#news").css("overflow","hidden");
                    //$("#news").css("margin-bottom",5);
                    $("#scrollnews").empty();
                    var html="";
                    var itemCount=result.data.length;
                    console.log('the news count is '+itemCount);
                    $('#scrollnews').hover(function(){
                        $("#scrollnews").css("-webkit-animation-play-state","paused");
                    },function(){
                        $("#scrollnews").css("-webkit-animation-play-state","running");
                    });
                    if(itemCount<=2){
                        $("#scrollnews").attr({'class':"animation_none"});
                    }else if(itemCount<10){
                        $("#scrollnews").attr({"class":"animation_5"});
                    }else{
                        $("#scrollnews").attr({'class':"animation_10"});
                    }
                    for(var i=0;i<itemCount;i++){
                        var rows=result.data[i];
                        //console.log(rows);
                        html+="<div class='index-news-list' style='height: 100px'>";
                        html+="<div class='index-left-icon'>";
                        if(rows.score>3){
                            html+="<i title='正面' class='icon icon_zheng'></i>";
                        }else if(rows.score<=3&&rows.score>-3){
                            html+="<i title='中性' class='icon icon_zhong'></i>";
                        }else{
                            html+="<i title='负面' class='icon icon_fu'></i>";
                        }
                        html+="</div><div class='index-right-listcon'>";
                        html+="<div class='indexPage_news_list_title'>";
                        html+="<div class='index-news-list-title-left'><span class='title'><a class='black' href='"+rows.news_url+"' target='_blank' title="+rows.news_title+">"+rows.news_title+"</a></a></span></div>";
                        html+="<div class='index-news-list-title-right'><span class='tag' style='color:#ffffff'>"+brand_name+"</span></div></div>";
                        html+="<div class='indexPage_news_list_summary' title="+rows.summary+">"+rows.summary+"</div>";
                        html+="<div class='source-date'>";
                        if(isToday(rows.report_date)){
                            html+="<span class='date' style='color: rgba(206, 51, 28, 1)'>"+formatDate(rows.report_date).substr(11,8)+"</span>";
                        }else{
                            html+="<span class='date' style='color: #ffffff'>"+formatDate(rows.report_date).substr(0,10)+"</span>";
                        }
                        html+="<span class='source' style='color:#ffffff;opacity: 0.6'><span title="+rows.source+">"+rows.source+"</span></span>";
                        html+="</div></div></div>";
                    }
                    $("#scrollnews").html(html);
                    //scrollNews();


                }
            });
        };
        self.filterFun(-1);
    }

    var newsVModel = new newsViewModel();
    //console.log('ko',ko);
    ko.applyBindings(newsVModel, document.getElementById("newsMonitorContainer"));

}
//处理文字 如新闻summary返回的结果中末尾带- 该方法去掉空格和-
function handleWords(text) {
    var result = text.replace(new RegExp("-", 'g'), "");
    result = $.trim(result);
    return result;


}
//微博监听
function WeiboMonitor() {

    var weiboViewModel = function () {
        var self = this;
        self.weibo = ko.observableArray([]);

        self.filterFun = function (plevel) {
            marqueeObjWeibo.stop();
            $("#weiboFilter button").removeClass("currentlevel");
            $("#weiboFilter button[level='" + plevel + "']").addClass("currentlevel");

            BeforeLoad("weiboMonitor");
            window.baseTools.GetWeiBoSentimentMonitor({
                query: {
                    level: plevel,
                    topn: 10,
                    brand_name: brand_name
                }
            }, function (result) {
                if (result && result.success) {
                    marqueeObjWeibo.stop();
                    //self.weibo(result.data);
                    endLoad("weiboMonitor");
                    SetNewsCate();
                    if (result.data.length == 0) {
                        marqueeObjWeibo.stop();
                        alertInformation("weiboMonitor");
                    }
//                    if($("#news").height()>$("#news1").height()){
//                        $("#news1").css("height",$("#news").height());
//                    }else{
//                        $("#news").css("height",$("#news1").height());
//                    }
                    $("#weibo").css("height",newsHeight);
                    $("#weibo").css("overflow","hidden");
                   // $("#weibo").css("margin-bottom",5);
                    //scrollweibo();
                    $("#scrollweibo").empty();
                    var html="";
                    var itemCount=result.data.length;
                    console.log('the weibo count is '+itemCount);
                    $('#scrollweibo').hover(function(){
                        $("#scrollweibo").css("-webkit-animation-play-state","paused");
                    },function(){
                        $("#scrollweibo").css("-webkit-animation-play-state","running");
                    });
                    if(itemCount<=2){
                        $("#scrollweibo").attr({'class':"animation_none"});
                    }else if(itemCount<10){
                        $("#scrollweibo").attr({"class":"animation_5"});
                    }else{
                        $("#scrollweibo").attr({'class':"animation_10"});
                    }
                    for(var i=0;i<itemCount;i++){
                        var rows=result.data[i];
                        //console.log(rows);
                        html+="<div class='index-news-list' style='height: 100px'>";
                        html+="<div class='index-left-icon'>";
                        if(rows.score>3){
                            html+="<i title='正面' class='icon icon_zheng'></i>";
                        }else if(rows.score<=3&&rows.score>-3){
                            html+="<i title='中性' class='icon icon_zhong'></i>";
                        }else{
                            html+="<i title='负面' class='icon icon_fu'></i>";
                        }
                        html+="</div><div class='index-right-listcon'>";
                        html+="<div class='indexPage_news_list_title'>";
                        html+="<div class='index-news-list-title-left'><span class='title'><a class='black' href='"+rows.news_url+"' target='_blank' title="+rows.source+">"+rows.source+"</a></a></span></div>";
                        html+="<div class='index-news-list-title-right'><span class='tag' style='color:#ffffff'>"+brand_name+"</span></div></div>";
                        html+="<div class='indexPage_news_list_summary' title="+rows.news_title+">"+rows.news_title+"</div>";
                        html+="<div class='source-date'>";
                        if(isToday(rows.report_date)){
                            html+="<span class='date' style='color: rgba(206, 51, 28, 1)'>"+formatDate(rows.report_date).substr(11,8)+"</span>";
                        }else{
                            html+="<span class='date' style='color: #ffffff'>"+formatDate(rows.report_date).substr(0,10)+"</span>";
                        }
                        html+="<span class='source' style='color:#ffffff;opacity: 0.6'><span title="+window.baseTools.translateWeiBoSourceI(rows.search_engine)+">"+window.baseTools.translateWeiBoSourceI(rows.search_engine)+"</span></span>";
                        html+="</div></div></div>";
                    }
                    $("#scrollweibo").html(html);
                    //scrollweibo();
                }
            });

        };
        self.filterFun(-1);
    }
    ko.applyBindings(new weiboViewModel(), document.getElementById("weiboMonitorContainer"));

}

function UpdateNewsAndWeiboDate() {
    var spanNewsText=$("#newsFilter .type").text();
    var spanWeiboText=$("#weiboFilter .type").text();
    $("#newsFilter .new-hidetype li").each(function(){
        if($(this).text()==spanNewsText)
        {
            $(this).click();
        }
    });
    $("#weiboFilter .new-hidetype li").each(function(){
        if($(this).text()==spanWeiboText)
        {
            $(this).click();
        }
    });
}
//加载样式
function BeforeLoad(tbid) {
    $("#" + tbid + " .loadindex").empty().addClass("loadingdata").show();
    $("#" + tbid + " .newsweibo-index").hide();
}
function endLoad(tbid) {
    $("#" + tbid + " .loadindex").empty().removeClass("loadingdata").hide();
    $("#" + tbid + " .newsweibo-index").fadeIn(300)
}
function alertInformation(tbid) {
    $("#" + tbid + " .loadindex").show().empty().html("很抱歉，没有相关数据！");
    $("#" + tbid + " .newsweibo-index").hide();
}

/*
 function ResizeChart()
 {
 var changedDayW = $("#negative-conbg-today").width();//计算后的
 var changedweekW = $("#negative-conbg-today").width();//计算后的
 var chartDay = $("#negative-conbg-today").highcharts();
 var chartWeek = $("#negative-conbg-week").highcharts();

 if (chartDay && chartWeek) {
 chartDay.setSize(changedDayW, 180);
 chartWeek.setSize(changedweekW, 180);
 }
 }*/

//显示负面 正面 全部
function showMore(that){
    var levelTwo=$(that).parent().next();
    if(levelTwo.is(":visible")){
        levelTwo.hide();
        $(that).removeClass("icon_arrup_gray").addClass("icon_arrdown_gray");
    }else{
        levelTwo.show();
        $(that).removeClass("icon_arrdown_gray").addClass("icon_arrup_gray");
    }
}