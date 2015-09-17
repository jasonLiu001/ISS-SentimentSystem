/// <reference path="business/base.js" />
/// <reference path="jQuery.js" />
var htmlName = "";
var PageMapping=[];



$(document).ready(function () {
    $("body").niceScroll(); //滚动条
    $("#head_top").load("../common/topadmin.html", function () {
        $("#loginout").click(function () {//登出
            if (confirm('你确认要退出')) {
                
                window.baseTools.loginOut();

            }
          
        });
        var userName = window.global.UserInfo.UserName;
        var custormerName = window.global.UserInfo.CustomerName;
        $("#currentUserName").html(userName);
        var cityName = window.global.CustormerLogo[custormerName];
        $("#cityName").html(cityName);
        //var logoPath = window.global.CustormerLogo[custormerName];
        //$("#logoImg").attr("src", logoPath);

    });
    $("#head_menu").load("../common/header.html", function () {

        //$(".left_menu_yq").css("min-height", winH - 140);
    
        $(".left_arr").css("margin-top", (winH - 140) / 2 - 30);//可伸缩小箭头定位
        $(".navbar-inverse").css("min-height", winH - 320)
        //二级下拉菜单
        $(".im_nav>ul>li.dropdownli>a").click(function (e) {
            e.preventDefault();
            //var I_icon = $(this).children("a").children("i.iconarrow");
            var dropmenu = $(this).next();
            if (dropmenu.is(":hidden")) {
                dropmenu.slideDown(300);
                $(this).parent().siblings().find(".dropdown_menu").slideUp(300);
                $(this).parent().addClass("currentli");
                $(this).parent().siblings().removeClass("currentli");
                //I_icon.removeClass("icon_menuright").addClass("icon_menudown");
                //$(this).siblings().find(".iconarrow").removeClass("icon_menudown").addClass("icon_menuright");
            } else {
                dropmenu.slideUp(300);
                $(this).parent().removeClass("currentli");
                //I_icon.removeClass("icon_menudown").addClass("icon_menuright");
            }

            //var Hleft = $("#head_menu").height();
            //var Hright = $("#content").height();
            //var Heig = (Hleft > Hright) ? Hleft : Hright;
            //$(".media-container").height(Heig);
            //$("body").height(Heig + 140);
        });

        $(".im_nav>ul>li ul.dropdown_menu li a").click(function (e) {
            if (!$(this).hasClass("disabled")) {
                //var htmlName = $(this).attr("href").split("#")[1];
                //$("#content").load(htmlName + ".html?"+Math.random());
                htmlName = $(this).attr("href").split("#")[1];
                SetMenuClass();
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
                $(this).prev().animate({ width: "0px" }, 300);
                $icon.removeClass("icon_arrleft").addClass("icon_arrright");
                $(".media-container>.pull-left").animate({ width: "12px" }, 300)
            } else {
                $(this).prev().animate({ width: "210px" }, 300);
                $icon.removeClass("icon_arrright").addClass("icon_arrleft");
                $(".media-container>.pull-left").animate({ width: "220px" }, 300)
            }
        })
    });
    $("#foot").load("../common/footer.html");
  
    $(".skin_btn").click(function () {
        var skinName = $(this).attr("skin");
        changeSkin(skinName);
    });

    var winH = $(window).height();
    $("#content").css("min-height", winH - 140);
    $("#head_menu").css("min-height", winH - 140);
    $(".media-container").css("min-height", winH - 140)
    var backData = [
        { aName: "index", aUrl: "/template/index.html" },
        { aName: "news", aUrl: "/template/newsmonitor.html" },
{ aName: "weibo", aUrl: "/template/weibomonitor.html" },
{ aName: "overseas", aUrl: "/template/overseasmonitor.html" },
{ aName: "attention", aUrl: "/template/sentimentattention.html" },
{ aName: "collectreport", aUrl: "/template/collectreport.html" },
{ aName: "groupmanage", aUrl: "/template/manage/groupmanage.html" },//用户组管理
{ aName: "manage", aUrl: "/template/manage/manage.html" },//用户管理
{ aName: "modulemanage", aUrl: "/template/manage/modulemanage.html" },//用户组管理
        { aName: "apimanage", aUrl: "/template/manage/apimanage.html" },//用户组管理
        { aName: "permissionmanage", aUrl: "/template/manage/permissionmanage.html" },//用户组管理
        { aName: "tenantmanage", aUrl: "/template/manage/tenantmanage.html" },//用户组管理


{ aName: "datasource", aUrl: "/template/datasource.html" },//数据源管理
{ aName: "twenty-three", aUrl: "/template/sixteenManager.html" },//二三级舆情管理
{ aName: "categoryreport", aUrl: "/template/categoryreport.html" },//舆情分类报告
{ aName: "collectreport", aUrl: "/template/collectreport.html" },//舆情汇总报告
{ aName: "emergencyplan", aUrl: "/template/emergencyplan.html" },//应急预案定制
{ aName: "public", aUrl: "/template/public.html" }
    ];
    $.each(backData, function (i, o) {
        PageMapping[o.aName] = o.aUrl;
    });

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

    $("#content").load(PageMapping[htmlName], function () {
        callback;
    });

}
function SetMenuClass() {
    $(".im_nav>ul>li.dropdownli ul.dropdown_menu li").removeClass("current");

    $(".im_nav>ul>li.dropdownli ul.dropdown_menu li a[href='/index.html#" + htmlName + "']").parent().addClass("current");
    $(".im_nav>ul>li.dropdownli ul.dropdown_menu li a[href='/index.html#" + htmlName + "']").parent().parent().parent().addClass("currentli");
}