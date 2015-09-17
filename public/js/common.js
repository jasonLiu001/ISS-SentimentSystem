/// <reference path="business/base.js" />
/// <reference path="jQuery.js" />
/// <reference path="jquery.cookie.js" />
function resetConsole() {
    var arr = ['log', 'debug', 'error', 'info'];
    for (var j = 0; j < arr.length; j++) {
        console[arr[j]] = function () { return; }
    }
}
//resetConsole();//调试时，注释掉此句。

var htmlName = "";
var PageMapping = [];

var homeULTimer = [];
var homeDataTimer = [];
var flag=true;
//設置超時
setInterval(function(){
    flag=true;
},1000);
$(function () {
    $("body").niceScroll(); //滚动条
    $("#head_top").load("../common/topadmin.html", function () {
        $("#loginout").click(function () {//登出
            if (confirm('你确认要退出')) {
                window.baseTools.loginOut();
            }

        });
        //设置标题登录用户信息
        SetTitleUserInfo();
        //修改当前用户信息
        //$("#currentUserName").bind("click", function () {
        //    $('#teuser li:eq(0) a').tab('show');
        //    $("#tModalUser").modal("show");
        //    window.baseTools.getUserById({ id: window.global.UserInfo.UserID }, function (data) {
        //        if (data && data.Data && data.Data[0]) {
        //            $("#tePhoneNum").val(data.Data[0].phone);
        //            $("#teEmail").val(data.Data[0].email);
        //        }
        //    });
        //});
        //var logoPath = window.global.CustormerLogo[custormerName];
        //$("#logoImg").attr("src", logoPath);

        editUserInfo();//绑定top用户修改信息和密码事件
    });
    $("#head_menu").load("../common/header.html", function () {

        //$(".left_menu_yq").css("min-height", winH - 140);

        $(".left_arr").css("margin-top", (winH - 140) / 2 - 30);//可伸缩小箭头定位
        $(".navbar-inverse").css("min-height", winH - 420)
        //二级下拉菜单
        $(".im_nav>ul>li.dropdownli>a").click(function (e) {
            var dropmenu = $(this).next();
            if (dropmenu.is(":hidden")) {
                dropmenu.slideDown(300);
                $(this).parent().siblings().find(".dropdown_menu").slideUp(300);
                $(this).parent().addClass("currentli");
                $(this).parent().siblings().removeClass("currentli");
            } else {
                dropmenu.slideUp(300);
                $(this).parent().removeClass("currentli");
            }
        });
        if (location.href.indexOf('#') == -1) {
            setTimeout(function () {
                $('#main_menu li:first a').click();
            }, 500)
        }//默认载入第一项
        $(".im_nav>ul>li.home-index>a").click(function (e) {

            if (!$(this).hasClass("disabled")) {
                $(this).parent().addClass("currentli");
                $(this).parent().siblings().find(".dropdown_menu").slideUp(300);
                $(this).parent().siblings().removeClass("currentli");
                //var htmlName = $(this).attr("href").split("#")[1];
                //$("#content").load(htmlName + ".html?"+Math.random());
                CheckCookies();
                htmlName = $(this).attr("href").split("#")[1];
                SetMenuClass();
                SetTitleUserInfo();
                LoadHtml();

            } else {
                e.preventDefault();
            }

        });

        $(".im_nav>ul>li ul.dropdown_menu li a").click(function (e) {
            if (!$(this).hasClass("disabled")) {
                //var htmlName = $(this).attr("href").split("#")[1];
                //$("#content").load(htmlName + ".html?"+Math.random());
                CheckCookies();
                htmlName = $(this).attr("href").split("#")[1];
                SetMenuClass();
                SetTitleUserInfo();
                LoadHtml();

            } else {
                e.preventDefault();
            }

        });

        //$(".im_nav>ul>li ul.dropdown_menu li a[class='disabled']").click(function (e) {
        //    e.stopPropagation();
        //});


        //选中高亮菜单
        //$(".im_nav li:not('.dropdownli')").click(function () {
        //    $(this).addClass("current");
        //})

        //var menuid = $("body").attr("mid")
        //var $li = $("#main_menu a[mid='" + menuid + "']").parent("li");
        //var $ul = $li.parent();
        //$ul.parent().addClass("display");
        //$li.addClass("current");
        //$ul.css("display", "block");


        //
        //$(".navbar-toggle").click(function () {
        //    var siblings = $(this).parent().siblings();
        //    if (siblings.is(":hidden")) {
        //        siblings.slideDown(300);
        //    } else {
        //        siblings.slideUp(300);
        //    }
        //});
        LoadPage();
        $(".left_arr").click(function () {
            $icon = $(this).children("i");
            if ($icon.hasClass("icon_arrleft")) {
                $(this).prev().animate({ width: "0px" }, 200, "linear", function () {
                    $("#main_container>.media ").addClass("lebg")
                    resizeChart();
                });
                $icon.removeClass("icon_arrleft").addClass("icon_arrright");
                $(".media-container>.pull-left").animate({ width: "12px" }, 200)
                $("#main_container>.media ").addClass("lebg");

            } else {
                $(this).prev().animate({ width: "180px" }, 200, "linear", function () {
                    resizeChart();
                });

                $icon.removeClass("icon_arrright").addClass("icon_arrleft");
                $(".media-container>.pull-left").animate({ width: "190px" }, 200);
                $("#main_container>.media ").removeClass("lebg");
            }
        })
    });
    $("#foot").load("../common/footer.html");

    $(".skin_btn").click(function () {
        var skinName = $(this).attr("skin");
        changeSkin(skinName);
    });
    //加载用户权限
    //var permission;
    //window.baseTools.getPermission("123", function (result) {
    //    if (result) {
    //        permission = result;
    //        $(".dropdown_menu li a").addClass("disabled");
    //        if (permission.Data.length > 0) {
    //            for (var item in permission.Data) {
    //                $(".dropdown_menu li a[value='" + permission.Data[item].value + "']").removeClass("disabled");
    //            }
    //        }
    //    }
    //});
    var winH = $(window).height();
    var winW = $(window).width();
    $("#content").css("min-height", winH - 140);
    $("#head_menu").css("min-height", winH - 140);
    $(".media-container").css("min-height", winH - 140)
    var backData = [
        { aName: "index", aUrl: "/template/index.html" },
        { aName: "newslist", aUrl: "/template/newsmonitor.html" },//新闻信息
        { aName: "weibo", aUrl: "/template/weibomonitor.html" },//微博信息
        { aName: "overseas", aUrl: "/template/overseasmonitor.html" },//海外信息
        { aName: "weixin", aUrl: "/template/weixinmonitor.html" },//微信信息

        { aName: "attention", aUrl: "/template/sentimentattention.html" },//趋势分析
        { aName: "collectreport", aUrl: "/template/collectreport.html" },//汇总报告
        { aName: "public", aUrl: "/template/public.html" },//指数分析

        { aName: "groupmanage", aUrl: "/template/manage/groupmanage.html" },//用户组管理
        { aName: "usermanage", aUrl: "/template/manage/usermanage.html" },//用户管理
        { aName: "datasource", aUrl: "/template/datasource.html" },//数据源管理 
        { aName: "searchKeys", aUrl: "/template/searchKeys.html" },//搜索关键字管理
        { aName: "module", aUrl: "/template/manage/module.html" },//模块管理
      
        { aName: "categoryreport", aUrl: "/template/categoryreport.html" },//舆情分类报告
        { aName: "collectreport", aUrl: "/template/collectreport.html" },//舆情汇总报告
        { aName: "emergencyplan", aUrl: "/template/emergencyplan.html" },//应急预案定制
       
        { aName: "projectmanage", aUrl: "/template/projectmanage.html" },//专题管理
        //管理功能 
        { aName: "keyword", aUrl: "/template/manage/searchkeysManager.html" },//关键字管理
        { aName: "sixteen", aUrl: "/template/manage/sixteenManager.html" },//分词管理
        { aName: "mnews", aUrl: "/template/manage/newsManager.html" },//新闻管理
        { aName: "mweibo", aUrl: "/template/manage/weiboManager.html" },//微博管理
        { aName: "mweixin", aUrl: "/template/manage/weixinManager.html" }//微信管理

    ];
    $.each(backData, function (i, o) {
        PageMapping[o.aName] = o.aUrl;
    });


    $(window).resize(function () {
        resizeChart();
    })

    //给点击过的链接加颜色
    $(".textover>a").live("click", function () {
        $(this).css("color", "#881280");
        return false;
    })
    $(".tabel-overflow>a").live("click", function () {
        $(this).css("color", "#881280");
        return false;
    })
});

function LoadPage() {
    if (location.href.indexOf("#") > -1) {
        htmlName = location.href.split("#")[1];
    }
    else {
        // htmlName = "index";
    }
    $.each($(".im_nav>ul>li.dropdownli>ul a"), function (i, a) {

        var thisA = $(a);
        if (thisA.attr("href").split("#")[1] != "" && thisA.attr("href").split("#")[1] == htmlName) {
            thisA.parent().parent().slideDown(300);
        }
    });
    SetMenuClass();
    LoadHtml();
}
function LoadHtml(callback) {
    //需要添加页面和Name的Mapping数据
if(flag) {
    $("#content").load(PageMapping[htmlName], function () {
        if (callback) {
            callback();
        }
        flag=false;
    });
}
}
function SetMenuClass() {
    $(".im_nav>ul>li.dropdownli ul.dropdown_menu li").removeClass("current");
    $(".im_nav>ul>li.dropdownli a[href='/index.html#" + htmlName + "']").parent().addClass("currentli");
    $(".im_nav>ul>li.dropdownli ul.dropdown_menu li a[href='/index.html#" + htmlName + "']").parent().addClass("current");
    $(".im_nav>ul>li.dropdownli ul.dropdown_menu li a[href='/index.html#" + htmlName + "']").parent().slideDown(300);
    $(".im_nav>ul>li.dropdownli ul.dropdown_menu li a[href='/index.html#" + htmlName + "']").parent().parent().parent().addClass("currentli");
}

function editUserInfo() {
    //绑定用户修改信息事件
    $("#infosave").bind("click", function (event) {
        var user = {};
        user.email = $("#teEmail").val();
        user.phone = $("#tePhoneNum").val();
        user.id = window.global.UserInfo.UserID;
        window.baseTools.updateUserInformation(user, function (data) {
            $("#tModalUser").modal("hide");
        });
    });
    //绑定用户修改密码事件
    $("#pwdsave").bind("click", function (event) {
        var pwd01 = $("#tePwdnew").val();
        var pwd02 = $("#tePwdNew2").val();
        if ($("#tePwdOld").val() == "") {
            alert("请输入原密码！");
            return;
        }
        if (pwd01 == "") {
            alert("请输入新密码！");
            return;
        }
        if (pwd02 == "") {
            alert("两次输入的密码不一致！");
            return;
        }
        if (pwd01 == pwd02) {
            var pwd = {};
            pwd.password = $("#tePwdOld").val();
            pwd.repassword = $("#tePwdnew").val();
            window.baseTools.updatePassword(pwd, function (result) {
                if (result.Result) {
                    alert("修改密码成功。");
                    $("#tModalUser").modal("hide");
                } else {
                    alert(result.Message);
                }
            });
        } else {
            alert("两次输入的密码不一致");
        }
    });
}
//设置标题登录用户信息
function SetTitleUserInfo() {

    var userName = $.cookie(cookieInfo.uname);// getCookie("username");
    var custormerName = $.cookie(cookieInfo.cname);// getCookie("customername");
    //var cityName = window.global.CustormerLogo[custormerName];
    var cityName=$.cookie(cookieInfo.fcname);
    //$("#cityName").html(cityName);
    //$("#teUserName,#currentUserName").val(userName);
    $("#cityName").html(cityName);
    $("#currentUserName").html(userName);
    $("#teUserName").val(userName);//topadmin.html(修改用户信息)
    document.title = cityName + '舆情管理系统';
}

function GoTargetPage(url) {

    if ($(".im_nav>ul>li ul.dropdown_menu li a[href='" + url + "']").parent().parent().is(":hidden")) {
        $(".im_nav>ul>li ul.dropdown_menu li a[href='" + url + "']").parent().parent().siblings("a").click();
    }

    $(".im_nav>ul>li ul.dropdown_menu li a[href='" + url + "']").click();

    //CheckCookies();
    //htmlName = url.split("#")[1];
    //SetMenuClass();
    //SetTitleUserInfo();
    //LoadHtml();
}
$(function () {//高级搜索，日期修改。
    $('body').delegate('#qDateStart,#qDateEnd', 'focus', function () {
        $(this).blur();
    })
})


function checkDate(dataStr) {//eg:2014-05-09
    var re = /^(\d{4})\-(\d{2})\-(\d{2})$/g;
    if (re.test(dataStr)) {
        return true;
    }
    return false;
}
function compareDate(startstr, endstr) {//eg:2014-05-09
    var s1, e1, start, end;
    var mDate = new Date();
    var cDate = +new Date(mDate.getFullYear(), mDate.getMonth(), mDate.getDate());
    if (!startstr && !endstr) {//00
        console.log('00')
        return true;
    }
    if (!startstr && endstr) {//01
        console.log('01');
        e1 = endstr.split('-');
        end = +new Date(e1[0], e1[1] - 1, e1[2]);
        if (!checkDate(endstr)) {
            alert('结束时间的格式为：0000-00-00');
            return false;
        }
        if (end > cDate) {
            alert('终止时间需要小于当前时间！');
            return false;
        }
        return true;
    }
    if (startstr && !endstr) {//10
        console.log('10');
        s1 = startstr.split('-');
        start = +new Date(s1[0], s1[1] - 1, s1[2])
        if (!checkDate(startstr)) {
            alert('起始时间的格式为：0000-00-00');
            return false;
        }
        console.log(start, cDate)
        if (start > cDate) {
            alert('起始时间需要小于当前时间！');
            return false;
        }
        return true;
    }
    else {//11
        console.log('11')
        if (!checkDate(startstr)) {
            alert('起始时间的格式为：0000-00-00');
            return false;
        }
        s1 = startstr.split('-');
        if (!checkDate(endstr)) {
            alert('结束时间的格式为：0000-00-00');
            return false;
        }
        e1 = endstr.split('-');
        start = +new Date(s1[0], s1[1] - 1, s1[2]);
        end = +new Date(e1[0], e1[1] - 1, e1[2]);
        if (start > cDate || end > cDate) {
            alert('起始时间和终止时间都需要小于当前时间！');
            return false;
        }
        if (start > end) {
            alert("起始日期必须小于结束日期！");
            return false;
        }
    }
    return true;
}

//重置图表
function resizeChart() {
    var chartDay = $("#negative-conbg-today").highcharts();
    var chartWeek = $("#negative-conbg-week").highcharts();
    var changedDayW = $("#negative-conbg-today").width();//计算后的
    var changedweekW = $("#negative-conbg-today").width();//计算后的
    var changedH = $("#negative-conbg-week").height();


    //舆情分析页面 舆情关注趋势
    var sAttention = $("#sentimentAttention");
    var chartSentiment = sAttention.highcharts(),
        chartSentimentW = sAttention.width(),
        chartSentimentH = sAttention.height();


    //指数分析页面
    var chartYq = $("#yq").highcharts(),
        chartYqW = $("#yq").width(),
        chartYqH = $("#yq").height();

    var cityChar = $("#CityInformation .resizeChart"),
        chartCityInformation = cityChar.highcharts(),
        chartCityInformationW = cityChar.width(),
        chartCityInformationH = cityChar.height();

    var peopleInfo = $("#PeopleInformation .resizeChart"),
        chartPeopleInformation = peopleInfo.highcharts(),
        chartPeopleInformationW = peopleInfo.width(),
        chartPeopleInformationH = peopleInfo.height();

    var economicInfo = $("#EconomicInformation .resizeChart"),
        chartEconomicInformation = economicInfo.highcharts(),
        chartEconomicInformationW = economicInfo.width(),
        chartEconomicInformationH = economicInfo.height();
    if (chartDay && chartWeek) {
        chartDay.setSize(changedDayW, changedH);
        chartWeek.setSize(changedweekW, changedH);
    } else if (chartSentiment) {
        //console.log("存在a");
        chartSentiment.setSize(chartSentimentW, chartSentimentH);
    } else if (chartYq && chartCityInformation && chartPeopleInformation && chartEconomicInformation) {
        //console.log("存在");
        chartYq.setSize(chartYqW, chartYqH);
        chartCityInformation.setSize(chartCityInformationW, chartCityInformationH);
        chartPeopleInformation.setSize(chartPeopleInformationW, chartPeopleInformationH);
        chartEconomicInformation.setSize(chartEconomicInformationW, chartEconomicInformationH);
    }
}
