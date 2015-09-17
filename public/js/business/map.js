/// <reference path="../../js/common/tools.js" />
/// <reference path="jquery.cookie.js" />
$(function () {
    $("body").niceScroll();
    var winH = $(window).height();
    $(".left_arr").css("margin-top", (winH - 140) / 2);
    $(".pull-left").css("min-height", (winH - 140));
    $(".pull-left").next().css("min-height", (winH - 140));
    $("#map_content").css("min-height", (winH - 177))
    $(".left_arr").click(function () {
        $icon = $(this).children("i");
        if ($icon.hasClass("icon_arrleft")) {
            $(this).prev().animate({ width: "0px" }, 200);
            $icon.removeClass("icon_arrleft").addClass("icon_arrright");
            $(".media-container>.pull-left").animate({ width: "12px" }, 200)
        } else {
            $(this).prev().animate({ width: "180px" }, 200);
            $icon.removeClass("icon_arrright").addClass("icon_arrleft");
            $(".media-container>.pull-left").animate({ width: "190px" }, 200)
        }
    })
    $(".left_menu_yq").addClass("loadingdata");
    getSentiment();
    bindCityInfo();
    $(".map_content").find("a").click(function (obj) {
        //之前要通过service绑定tid(现在是hardcode)
        //要设置的tid
        var acname = $(this).attr("cname");//地图上的值
        //登录后的tid
        var cname = $.cookie(cookieInfo.ccname);
        var loginingCname=$.cookie(cookieInfo.cname);//取登录租户登录的值
        if (loginingCname&&acname.indexOf(loginingCname)<0){//不存在该acname登录的用户
            if (confirm("您已经登录其他城市的账号，是否要退出？")) {//取消退出
                clearCookieAll();
                $.cookie(cookieInfo.ccname, acname);//设置当前租户
                ajax(loginOut);
            }
            else{//取消
                //window.open('/index.html#index');
            }
        }
        else {//该租户下有用户登录，直接进入
            if (cname && acname.indexOf(cname)>=0&&acname.indexOf(loginingCname)>=0) {//已有用户登录
                window.open('/index.html#index');
            }
            else{
                clearCookieAll();
                $.cookie(cookieInfo.ccname, acname);
                window.open(domain);
            }
        }

    });
   
    window.onload = function () {
        var littH = $(".mapimg").height() + 36;
        if (littH < winH - 140) {
            littH = winH - 140;
        }
        $(".left_menu_yq ").css("height", littH);
    }
    $("#main_menu li a").live("click", function () {
        var littH = $(".mapimg").height() + 36;
        if (littH < winH - 140) {
            littH = winH - 140;
        }
        $(".left_menu_yq ").css("height", littH);
    });
    $(".left_menu_yq").niceScroll(); //滚动条
    $("#foot").load("/common/footer.html");
})
var domain = "/login.html";
var api = "/api/middleware/GetCityInfoSummary";
var loginOut = "/api/authentication/logout";

function ajax(url) {
    url = loginOut;
    //var options ={ params: JSON.stringify({ query: { customer_name: customername, start_date: "2014-07-31" } }) };
    try {
        //$(document).queue(function () { 
        var jqXhr = $.ajax({
            url: url,
            async: true,
            cache: false,
            type: 'get',
            success: function (result) {
                window.open(domain,"_blank");
               // location.href=domain;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error:' + textStatus + ',' + errorThrown);
            }
        });
        if (jqXhr) {
            //jqXhr.abort();
        }
        //$(this).dequeue();
        // });
    } catch (e) {
        alert(e.message);
    }
}
function getSentiment() {
    var url = api;
    //var options ={ params: JSON.stringify({ query: { customer_name: customername, start_date: "2014-07-31" } }) };
    try {
        //$(document).queue(function () { 
        var jqXhr = $.ajax({
            url: url,
            dataType: "json",
            async: true,
            cache: false,
            data: "",
            type: 'get',
            success: function (result) {
                if (result) {
                    bindData(result.data);// callback(result);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //alert('error:' + textStatus + ',' + errorThrown);
            }
        });
        if (jqXhr) {
            //jqXhr.abort();
        }
        //$(this).dequeue();
        // });
    } catch (e) {
        alert(e.message);
    }
}
function bindData(result) {
    var html = "";
    var pro = "";
    var proid;
    var proids = [];
    var proname;
    //添加省
    for (var i = 0; i < result.length; i++) {
        proid = result[i].PROID + "a";
        proname = result[i].PRO;

        if (pro.indexOf(proid) < 0) {
            pro += proid;
            proids.push('pro_' + proid);
            html += "<li class='dropdownli'>";
            html += "<a href='javascript:void(0)'><i class='icon icon_circleadd'></i><span class='level'>" + proname + "</span></a>";
            html += "<ul class='dropdown_menu' id='pro_" + proid + "'></ul>";
            html += "</li>";
        }
    }
    $("#main_menu").html(html);


    //添加县市
    for (var i = 0; i < result.length; i++) {
        html = "";
        //if (result[i].TotalCount > 0) {
        proid = result[i].PROID + "a";
        html += "<li><div class='name_map'><i class='icon icon_heng'></i><span>" + result[i].City + "</span></div>";
        html += "<div class='zs_mp'><span>今日舆情总量：</span><span class='bhei'>" + result[i].TotalCount + "</span></div>";
        html += "<div class='zs_zm'><span>今日正面：</span><span class='green'>" + result[i].POSCount + "</span></div>";
        html += "<div class='zs_fm'><span>今日负面：</span><span class='hong'>" + result[i].NegCount + "</span></div>";
        html += "<div class='zs_fm'><span>今日中性：</span><span class='green'>" + result[i].MinCount + "</span></div></li>";
        $("#pro_" + proid).append(html);
        //}
    }

    $(".left_menu_yq").removeClass("loadingdata");

    $(".dropdownli>a").click(function (e) {
        //e.preventDefault();
        var nexUL = $(this).next();
        var otherUL = $(this).parent().siblings().find(".dropdown_menu");
        if (nexUL.is(":hidden")) {
            nexUL.slideDown(300);
            //otherUL.slideUp(300);
            $(this).children("i").removeClass("icon_circleadd").addClass("icon_circledel");
            $(this).parent().addClass("currentli");
            //$(this).parent().siblings().removeClass("currentli");
            //$(this).parent().siblings().find("i").removeClass("icon_circledel").addClass("icon_circleadd");
        } else {
            nexUL.slideUp(300);
            $(this).parent().removeClass("currentli");
            $(this).children("i").removeClass("icon_circledel").addClass("icon_circleadd");
        }

    });
}
//绑定城市信息
function bindCityInfo()
{
    var i = 1;
    for (var item in currentCity) {
        $("#map_content a[cid='" + i + "']").attr("cname", currentCity[i]);
        i += 1;
    }
}