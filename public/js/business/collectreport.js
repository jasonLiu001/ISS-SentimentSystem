
$(function () {
    var city = '无锡';
    GetNews(city, CallBack,null);

    $("#search").bind("click", function (event) {
        $("#month").empty();
        var source = $("#qSource").val();
        var year = $("#qYear").val();
        var level = $("#qLevel").val();
        if (source == 1) {
            $("#month").css("background-color", "rgba(99, 152, 1, 1)");
            GetNews(city, CallBack,year,level);
        } else if (source == 2) {
            $("#month").css("background-color", "rgba(5, 133, 153, 1)");
            GetWeibo(city, CallBack, year, level);
        }
    });
});
//News
function GetNews(city, callback,year,level) {
    var chartHeight = $("#month").parent().height() - 100;
    var config = [
        {
            title: '',
            containerCSS: 'top-right-news',
            titleTop: false,
            contentCSS: 'four-content',
            titleCSS: 'right-news-title',
            iconCSS: 'nt_icon ntilist',
            columnbg: "#78ba00",
            chartType: 4,
            data: []
        }
    ];

    var startDate;
    var end_date;

    if (year) {
        startDate = new Date(year + "-01-01");
        end_date = new Date(year + "-12-31");
    } else {
        //初始化查询日期为当前日期
        var queryDate = new Date();
        startDate = new Date(queryDate.getFullYear() + "-01-01");
        end_date = new Date(queryDate.getFullYear() + "-12-31");
    }
    var query = {
        customer_name: city,
        start_date: startDate,
        end_date: end_date
    };
    if (level != "" && level != "-2") {
        query.level = level;
    }
    window.baseTools.GetNewsSentimentMonth({
        query: query
    }, function (result1) {

        if (result1 && result1.success) {
            config[0].data = result1.data;
            $("#month").turnChart({ height: chartHeight, data: config });
        }
    });
}
//Weibo
function GetWeibo(city, callback, year, level) {
    var chartHeight = $("#month").parent().height() - 100;
    var config = [
        {
            title: '',
            containerCSS: 'top-right-four',
            titleTop: false,
            contentCSS: 'four-content',
            titleCSS: 'four-title',
            iconCSS: 'nt_icon ntilist',
            columnbg: "#a0f1fe",
            chartType: 4,
            data: []
        }
    ];
    var startDate;
    var end_date;

    if (year) {
        startDate = new Date(year + "-01-01");
        end_date = new Date(year + "-12-31");
    } else {
        //初始化查询日期为当前日期
        var queryDate = new Date();
        startDate = new Date(queryDate.getFullYear() + "-01-01");
        end_date = new Date(queryDate.getFullYear() + "-12-31");
    }
    var query = {
        customer_name: city,
        start_date: startDate,
        end_date: end_date
    };
    if (level != "" && level != "-2") {
        query.level = level;
    }
    window.baseTools.GetWeiBoSentimentMonth({
        query:query
    }, function (result1) {
        if (result1 && result1.success) {
            config[0].data = result1.data;
            $("#month").turnChart({ height: chartHeight, data: config });
        }
    });
}

function CallBack() {
        TurnFun("month");
}
function TurnFun(id) {
    animationMgr.register(id).active(id);
}