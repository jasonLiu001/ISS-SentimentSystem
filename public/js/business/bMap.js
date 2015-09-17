var domain = "/login.html";
var api = "/api/middleware/GetCityInfoSummary";
var loginOut = "/api/authentication/logout";
var dataSource;
//创建和初始化地图函数：
function initMap() {
    createMap();//创建地图
    setMapEvent();//设置地图事件
    addMapControl();//向地图添加控件
    //getBoundary();//标注边界
    //setCenterOfCity();//标注城市
    //hideLink();
}
//创建地图函数：
function createMap() {
    var map = new BMap.Map("bmap_content");//在百度地图容器中创建一个地图
    var point = new BMap.Point(115.145544, 31.857247);//定义一个中心点坐标
    map.centerAndZoom(point, 5);//设定地图的中心点和坐标并将地图显示在地图容器中
    window.map = map;//将map变量存储在全局
}

//地图事件设置函数：
function setMapEvent() {
    map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
    map.enableScrollWheelZoom();//启用地图滚轮放大缩小
    map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
    map.enableKeyboard();//启用键盘上下左右键移动地图
}

//地图控件添加函数：
function addMapControl() {
    //向地图中添加缩放控件
    var ctrl_nav = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_LARGE });
    map.addControl(ctrl_nav);
    //向地图中添加缩略图控件
    var ctrl_ove = new BMap.OverviewMapControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT, isOpen: 0 });
    map.addControl(ctrl_ove);
    //向地图中添加比例尺控件
    var ctrl_sca = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
    map.addControl(ctrl_sca);
}
//添加标注点
function addMarker(point, city) {
    var marker = new BMap.Marker(point);
    marker.setTitle(city);
    map.addOverlay(marker);
    marker.addEventListener("click", function (e) {
        skipIndex(e);
    });
    marker.addEventListener("mouseover", function (e) {
        showToolTip(e);
    });
    marker.addEventListener("mouseout", function (e) {
        $("#tooltip").remove();
    });

}

function getBoundary() {//标注边界
    var bdary = new BMap.Boundary();
    for (var j = 0; j < cities.length; j++) {
        bdary.get(cities[j], function (rs) {
            //map.clearOverlays();  
            var count = rs.boundaries.length; //行政区域的点有多少个
            for (var i = 0; i < count; i++) {
                var ply = new BMap.Polygon(rs.boundaries[i], { strokeWeight: 2, strokeColor: "#ff0000" }); //建立多边形覆盖物
                map.addOverlay(ply);  //添加覆盖物
                //map.setViewport(ply.getPath());    //调整视野         
            }
        });
    }
}
function setCenterOfCity(citys) {//标注地图
    var localSearch = new BMap.LocalSearch(map);
    var myStyles = [
        {
            url: '/img/map_flag.png',
            size: new BMap.Size(50, 44),
            anchor: [10, 0],
            textColor: 'white',
            title: "beiing"
        }
    ];
    localSearch.setSearchCompleteCallback(function (searchResult) {
        if (searchResult) {
            // console.log(searchResult)
            var poi = searchResult.getPoi(0);
            //addMarker(new BMap.Point(poi.point.lng, poi.point.lat),searchResult.keyword.substring(0,2));
            addMarker(new BMap.Point(poi.point.lng, poi.point.lat), searchResult.keyword);
        }
    });
//    for (var i = 0; i < cities.length; i++) {
//        localSearch.search(cities[i]);
//    }
    for (var i = 0; i < citys.length; i++) {
        localSearch.search(citys[i].City);
    }
}
function hideLink() {
    $("#bmap_content").find("div span[_cid='1']").hide();
}
function showToolTip(e) {
    var title = e.currentTarget._config.title;
    var x = -50;
    var y = 15;
    var city, TotalCount, POSCount, NegCount, MinCount;
    console.log(e);


    for (var i = 0; i < dataSource.length; i++) {
        var cityObj = dataSource[i];
        if (cityObj.City.indexOf(title) >= 0) {
            city = cityObj.City;
            TotalCount = cityObj.TotalCount;
            POSCount = cityObj.POSCount;
            NegCount = cityObj.NegCount;
            MinCount = cityObj.MinCount;
        }
    }
    var $toolTip = $("<div id='tooltip' style='overflow: hidden;'><div class='tooltip-relative'><div class='toop-content'><div class='zs_mp zs_mpp'><strong>" + city + "</strong></div><div class='zs_mp'><span>今日舆情总量：</span><span class='bhei'>" + TotalCount + "</span></div><div class='zs_zm'><span>今日正面：</span><span class='green'>" + POSCount + "</span><span>今日负面：</span><span class='hong'>" + NegCount + "</span><span>今日中性：</span><span class='green'>" + MinCount + "</span></div></li></div></div></div>");
    $("#tooltip").remove();
    $("body").append($toolTip);
    $("#tooltip").css({
        "top": (e.clientY + y) + "px",
        "left": (e.clientX + x) + "px"
    }).show("fast");
}
function bindLeftMenu() {
    $("body").niceScroll();
    var winH = $(window).height();
    $(".left_arr").css("margin-top", (winH - 140) / 2);
    $(".pull-left").css("min-height", (winH - 140));
    $(".pull-left").next().css("min-height", (winH - 140));
    $("#bmap_content").css("min-height", (winH - 177))
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
    $(".map_content").find("a").click(function (obj) {
        //之前要通过service绑定tid(现在是hardcode)
        //要设置的tid
        var acname = $(this).attr("cname");
        /*old
        //登录后的tid
        var cname = $.cookie(cookieInfo.cname);
        if (cname && acname.indexOf(cname) < 0) {
            if (confirm("您已经登录其他城市的账号，是否要登出？")) {
                clearCookie();
                $.cookie(cookieInfo.ccname, acname);
                ajax(loginOut);
            }
        }
        else {
            $.cookie(cookieInfo.ccname, acname);
            //window.open(domain);
            window.location.href = domain;
        }*/
        //新逻辑
        var alias='';
        getTenantByAPI(function(result){
            if (result && result.success) {
                for (var i = 0; i < result.rows.length; i++) {
                    if (acname == result.rows[i].name) {
                        alias = result.rows[i].alias;
                    }
                }
            }
        });
        //window.location.href = domain+"?customer="+alias;
        //window.open(domain+"?customer="+alias,'_blank');
    });

    window.onload = function () {
        var littH = $(".mapimg").height() + 36;
        if (littH < winH - 140) {
            littH = winH - 140;
        }
        $(".left_menu_yq ").css("height", littH);
    }

    $(".left_menu_yq").niceScroll(); //滚动条
}
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
                // window.open(domain, "_blank");
                window.location.href = domain;
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
                    dataSource = result.data;
                    bindData(result.data);// callback(result);
                    setCenterOfCity(dataSource);
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
function subString(str) {
    var array = ["县", "市"];
    for (var i = 0; i < array.length; i++) {
        var index = str.indexOf(array[i]);
        if (index > 0) {
            return str.substring(0, index);
        }
    }
}
function skipIndex(e) {
    var acname = e.currentTarget._config.title;
    console.log(acname);
    /* old
    var cname = $.cookie(cookieInfo.ccname);//获取地图页登录租户
    var loginingCname = $.cookie(cookieInfo.cname);//取登录租户登录的值
    if (loginingCname && acname.indexOf(loginingCname) < 0) {//不存在该acname登录的用户
        if (confirm("您已经登录其他城市的账号，是否要退出？")) {//取消退出
            clearCookieAll();
            $.cookie(cookieInfo.ccname, acname);//设置当前租户
            ajax(loginOut);
        }
        else {//取消
            //window.open('/index.html#index');
        }
    }
    else {//该租户下有用户登录，直接进入
        if (cname && acname.indexOf(cname) >= 0 && acname.indexOf(loginingCname) >= 0) {//已有用户登录
            //window.open('/index.html#index');
            //window.location.href='/index.html#index';
            window.location.href = domain;
        }
        else {
            clearCookieAll();
            $.cookie(cookieInfo.ccname, acname);
            window.location.href = domain;
        }
    }*/
    //新逻辑
//    var alias='';
//    getTenantByAPI(function(result){
//        if (result && result.success) {
//            for (var i = 0; i < result.rows.length; i++) {
//                if (acname == result.rows[i].name) {
//                    alias = result.rows[i].alias;
//                }
//            }
//            //window.location.href = domain+"?customer="+alias;
//            //window.open(domain+"?customer="+alias,'_blank');
//            window.location.href = "simulateLogin.html?customer="+alias;
//            pLogin(alias,function(result){
//                //console.log(result);
//                //$.cookie(cookieInfo.ccname,result.FullCustomerName);
//                //window.open('/index.html','_blank');
//                window.location.href = "simulateLogin?customer="+alias;
//            });
//        }
//    });
    window.open("simulateLogin.html?customer="+escape(acname));
    //window.location.href = "simulateLogin.html?customer="+acname;
}
function setCss() {//动态设置大小

    var winH = $(window).height();
    $(".left_arr").css("margin-top", (winH - 140) / 2);
    $(".pull-left").css("min-height", (winH - $("#foot").height() + 35));
    $(".pull-left").next().css("min-height", (winH - $("#foot").height() + 35));
    $("#bmap_content").css("min-height", (winH - $("#foot").height() + 35));
    var littH = winH + 36;
    if (littH < winH - 140) {
        littH = winH - 140;
    }
    $(".left_menu_yq ").css("height", littH);
    //$(".left_menu_yq").niceScroll(); //滚动条
}
function getTenantByAPI(callback) {//获取租户信息
    var params = {params: {orderby: {}, query: {}, pagination: {}}};
    window.baseTools.getTenantList(params, callback);
}
$(function () {
    bindLeftMenu();
    initMap();
    $(window).resize(function () {
        setCss();
        initMap();
        setCenterOfCity(dataSource);
    });
    $("#foot").load("/common/footer.html");
});
