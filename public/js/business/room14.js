/// <reference path="base.js" />

//舆情指数
var n_granularity = 1440;
var n_startdate = new Date();
var n_enddate = new Date();
//热词区间
var w_startdate = new Date();
var w_enddate = new Date();


//综合舆情热词
var y_granularity = 1440;
var y_startdate = new Date();
var y_enddate = new Date();
var city="";
$(function () {

    sLogin(function(result){//模拟登录
        city= result.CustomerName;
        loadData()
    });
});
function loadData(){

    var winH = $(window).height();
    console.log(winH);
    if (winH < 600) {
        winH = 600;
    }
    var generalH = winH / 5;
    var yqH = winH * 3 / 5;
    $(".oneModel").height(generalH);
    $(".fourModel").height(yqH);
    var timeInterval = 10 * 60 * 1000;
    //setInterval(function () { safeBind(city, generalH) }, timeInterval);
    //setInterval(function () { trafficBind(city, generalH) }, timeInterval);
    //setInterval(function () { environmentBind(city, generalH) }, timeInterval);
    UpdateTime();
    safeBind(city, generalH, CallBack);
    trafficBind(city, generalH, CallBack);
    environmentBind(city, generalH, CallBack);
    cityBuildBind(city, generalH, CallBack);
    cityManage(city, generalH);
    newsBind(city, generalH);
    weiBoBind(city, generalH);
    peopleBind(city, generalH);
    economyBind(city, generalH);
    travelBind(city, generalH, CallBack);
    businessBind(city, generalH, CallBack);
    agricultureBind(city, generalH, CallBack);
    industryBind(city, generalH, CallBack);
    yqBind(city, yqH);

    // resizeChart();
    $(window).resize(function () {
        resizeChart();
    });
}
//更新全局变量
function UpdateTime()
{
    //热词（一周的热词？）
    var w_curDate = new Date();
    w_startdate = formatDateType(new Date(w_curDate.setDate(w_curDate.getDate() - 30)),'day');
    w_enddate = formatDateType(new Date(),'day');

    //其他指数(一周的指数)
    var n_curDate = new Date();
    n_startdate = formatDateType(new Date(n_curDate.setDate(n_curDate.getDate() - 6)),'day');
    n_enddate = formatDateType(new Date(),'day');

    //综合指数(一年的综合指数)
    var y_curDate = new Date();
    y_startdate = formatDateType(new Date(y_curDate.setYear(y_curDate.getFullYear() - 1)),'day');
    y_enddate = formatDateType(new Date(),'day');
}
//等待加载完毕后执行"转"事件
var room14AjaxCount = 0;
function safeBind(city, generalH,callback) {
    var config = [
        {
            title: '安全指数',
            containerCSS: 'kbh-content kbh-safe',
            contentCSS: '',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            lineColor: "#ffffff",
            columnColor: "#1abebe",
            chartType: 1,
            data: []
        },
        {
            title: '安全热词',
            containerCSS: 'kbh-content nt_hotword_safe',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: []
        }
    ];
    var city_filed = '城市管理';
    var city_brand = '安全';

    window.baseTools.getHotWords({
        query: {
            customer_name: city,
            field_name: city_filed,
            brand_name: city_brand,
            start_date: w_startdate,
            end_date: w_enddate,
            topn: 7
        }
    }, function (result) {
        if (result && result.success) {
            window.baseTools.getSentimentLinear({//指数
                query: {
                    customer_name: city,
                    field_name: city_filed,
                    brand_name: city_brand,
                    start_date: n_startdate,
                    end_date: n_enddate,
                    granulityMinute: n_granularity
                }
            }, function (resultLine) {
                if (resultLine && resultLine.success) {
                    config[1].data = result.data;
                    config[0].data = resultLine.data;
                    $("#safe").turnChart({ height: generalH, data: config });
                    if (callback) {
                        room14AjaxCount += 1;
                        callback();
                    }
                }
            });
        }
    })

}
function trafficBind(city, generalH,callback) {
    var config = [
        {
            title: '交通热词',
            containerCSS: 'kbh-content nt_hotword_tra',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: ""
        },
        {
            title: '交通指数',
            containerCSS: 'kbh-content kbh-traffic',
            contentCSS: '',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiline',
            lineColor: "#ffffff",
            columnColor: "#27a5e4",
            chartType: 1,
            data: ""
        }];
    var city_filed = '城市管理';
    var city_brand = '交通';
    window.baseTools.getHotWords({//热词
        query: {
            customer_name: city,
            field_name: city_filed,
            brand_name: city_brand,
            start_date: w_startdate,
            end_date: w_enddate,
            topn: 7
        }
    }, function (result) {
        if (result && result.success) {
            window.baseTools.getSentimentLinear({//指数
                query: {
                    customer_name: city,
                    field_name: city_filed,
                    brand_name: city_brand,
                    start_date: n_startdate,
                    end_date: n_enddate,
                    granulityMinute: n_granularity
                }
            }, function (resultLine) {
                if (resultLine && resultLine.success) {
                    config[0].data = result.data;
                    config[1].data = resultLine.data;
                    $("#traffic").turnChart({ height: generalH, data: config });
                    if (callback) {
                        room14AjaxCount += 1;
                        callback();
                    }
                }
            });
        }

    });

}
function environmentBind(city, generalH,callback) {
    var config = [
        {
            title: '环保指数',
            containerCSS: 'kbh-content kbh-hbzs',
            contentCSS: '',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiline',
            lineColor: "#ffffff",
            columnColor: "#38c7ff",
            chartType: 1,
            data: ''
        }, {
            title: '环保热词',
            containerCSS: 'kbh-content nt_hotword_hb',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: ''
        }];
    var city_filed = '城市管理';
    var city_brand = '环保';
    window.baseTools.getHotWords({//热词
        query: {
            customer_name: city,
            field_name: city_filed,
            brand_name: city_brand,
            start_date: w_startdate,
            end_date: w_enddate,
            topn: 7
        }
    }, function (result) {
        if (result && result.success) {
            window.baseTools.getSentimentLinear({//指数
                query: {
                    customer_name: city,
                    field_name: city_filed,
                    brand_name: city_brand,
                    start_date: n_startdate,
                    end_date: n_enddate,
                    granulityMinute: n_granularity
                }
            }, function (resultLine) {
                if (resultLine && resultLine.success) {
                    config[1].data = result.data;
                    config[0].data = resultLine.data;
                    $("#environment").turnChart({ height: generalH, data: config });
                    if (callback) {
                        room14AjaxCount += 1;
                        callback();
                    }
                }
            });
        }

    });
}
function cityBuildBind(city, generalH, callback) {
    var config = [ {
        title: '城建热词',
        containerCSS: 'kbh-content nt_hotword_cj',
        contentCSS: 'forum-hot',
        titleCSS: 'kbh-title',
        iconCSS: 'nt_icon ntiword',
        chartType: 2,
        data: ''
    },{
        title: '城建指数',
        containerCSS: 'kbh-content nt_cj',
        contentCSS: '',
        titleCSS: 'kbh-title',
        iconCSS: 'nt_icon ntiline',
        lineColor: "#ffffff",
        columnColor: "#2cb8ff",
        chartType: 1,
        data: ''
    }];
    var city_filed = '城市管理';
    var city_brand = '城建';
    window.baseTools.getHotWords({//热词
        query: {
            customer_name: city,
            field_name: city_filed,
            brand_name: city_brand,
            start_date: w_startdate,
            end_date: w_enddate,
            topn: 7
        }
    }, function (result) {
        if (result && result.success) {
            window.baseTools.getSentimentLinear({//指数
                query: {
                    customer_name: city,
                    field_name: city_filed,
                    brand_name: city_brand,
                    start_date: n_startdate,
                    end_date: n_enddate,
                    granulityMinute: n_granularity
                }
            }, function (resultLine) {
                if (resultLine && resultLine.success) {
                    config[0].data = result.data;
                    config[1].data = resultLine.data;
                    $("#cityBuild").turnChart({ height: generalH, data: config });
                    if (callback) {
                        room14AjaxCount += 1;
                        callback();
                    }
                }
            });
        }

    });
}
function cityManage(city, generalH) {
    var config = [
        {
            title: '城市管理综合指数图',
            containerCSS: 'kbh-content kbh-cityManage',
            contentCSS: '',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiline',
            lineColor: "#ffffff",
            chartType: "1a",
            data: []
        }];
    var city_filed = '城市管理';

    var currentDate = new Date();
    var startDate = new Date(currentDate.setHours(currentDate.getHours() - 5));
    window.baseTools.getSentimentLinear({//指数
        query: {
            customer_name: city,
            field_name: city_filed,
            start_date: n_startdate,
            end_date: n_enddate,
            granulityMinute: n_granularity
        }
    }, function (resultLine) {
        if (resultLine && resultLine.success) {
            config[0].data = resultLine.data;
            $("#cityManage").turnChart({ height: generalH, data: config });
        }
    });
}
function peopleBind(city, generalH) {
    var config = [
        {
            title: '民生综合指数',
            containerCSS: 'kbh-content kbh-people',
            contentCSS: '',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiline',
            lineColor: "#ffffff",
            columnColor: "#2572eb",
            chartType: 1,
            data: []
        }];
    var city_filed = '民生';

    var currentDate = new Date();
    var startDate = new Date(currentDate.setHours(currentDate.getHours() - 5));
    window.baseTools.getSentimentLinear({//指数
        query: {
            customer_name: city,
            field_name: city_filed,
            start_date: n_startdate,
            end_date: n_enddate,
            granulityMinute: n_granularity
        }
    }, function (resultLine) {
        if (resultLine && resultLine.success) {
            config[0].data = resultLine.data;

            $("#people").turnChart({ height: generalH, data: config });

        }
    });
}
function economyBind(city, generalH) {
    var config = [
        {
            title: '经济综合指数',
            containerCSS: 'kbh-content kbh-people',
            contentCSS: '',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiline',
            topColor: "#2f7ed8",
            bottomColor: "#1396bf",
            chartType: "1b",
            data: []
        }];
    var city_filed = '经济';

    var currentDate = new Date();
    var startDate = new Date(currentDate.setHours(currentDate.getHours() - 5));
    window.baseTools.getSentimentLinear({//指数
        query: {
            customer_name: city,
            field_name: city_filed,
            start_date: n_startdate,
            end_date: n_enddate,
            granulityMinute: n_granularity
        }
    }, function (resultLine) {
        if (resultLine && resultLine.success) {
            config[0].data = resultLine.data;
            $("#economy").turnChart({ height: generalH, data: config });
        }
    });
}
function travelBind(city, generalH, callback) {
    var config = [
        {
            title: '旅游指数',
            containerCSS: 'kbh-content nt_travel',
            contentCSS: '',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiline',
            topColor: "#518809",
            bottomColor: "#79ad13",
            chartType: "1b",
            data: []
        }, {
            title: '旅游热词',
            containerCSS: 'kbh-content nt_hotword_travel',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: []
        }
    ];
    var city_filed = '经济';
    var city_brand = '旅游';
    window.baseTools.getHotWords({//热词
        query: {
            customer_name: city,
            field_name: city_filed,
            brand_name: city_brand,
            start_date: w_startdate,
            end_date: w_enddate,
            topn: 7
        }
    }, function (result) {
        if (result && result.success) {
            window.baseTools.getSentimentLinear({//指数
                query: {
                    customer_name: city,
                    field_name: city_filed,
                    brand_name: city_brand,
                    start_date: n_startdate,
                    end_date: n_enddate,
                    granulityMinute: n_granularity
                }
            }, function (resultLine) {
                if (resultLine && resultLine.success) {
                    config[1].data = result.data;
                    config[0].data = resultLine.data;
                    $("#travel").turnChart({ height: generalH, data: config });
                    if (callback) {
                        room14AjaxCount += 1;
                        callback();
                    }
                }
            });
        }

    });
}
function businessBind(city, generalH, callback) {
    var config = [
        {
            title: '商业热词',
            containerCSS: 'kbh-content nt_hotword_bui',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: []
        },
        {
            title: '商业指数',
            containerCSS: 'kbh-content kbh-business',
            contentCSS: '',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiline',
            lineColor: "#ffffff",
            columnColor: "#7301ad",
            chartType: 1,
            data: []
        }
    ];
    var city_filed = '经济';
    var city_brand = '商业';
    window.baseTools.getHotWords({//热词
        query: {
            customer_name: city,
            field_name: city_filed,
            brand_name: city_brand,
            start_date: w_startdate,
            end_date: w_enddate,
            topn: 7
        }
    }, function (result) {
        if (result && result.success) {
            window.baseTools.getSentimentLinear({//指数
                query: {
                    customer_name: city,
                    field_name: city_filed,
                    brand_name: city_brand,
                    start_date: n_startdate,
                    end_date: n_enddate,
                    granulityMinute: n_granularity
                }
            }, function (resultLine) {
                if (resultLine && resultLine.success) {
                    config[0].data = result.data;
                    config[1].data = resultLine.data;
                    $("#business").turnChart({ height: generalH, data: config });
                    if (callback) {
                        room14AjaxCount += 1;
                        callback();
                    }
                }
            });
        }

    });
}
function agricultureBind(city, generalH, callback) {
    var config = [

        {
            title: '农业指数',
            containerCSS: 'kbh-content kbh-agriculture',
            contentCSS: '',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiline',
            lineColor: "#ffffff",
            columnColor: "#1faeff",
            chartType: 1,
            data: []
        }, {
            title: '农业热词',
            containerCSS: 'kbh-content nt_hotword_eco',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: []
        }
    ];
    var city_filed = '经济';
    var city_brand = '农业';
    window.baseTools.getHotWords({//热词
        query: {
            customer_name: city,
            field_name: city_filed,
            brand_name: city_brand,
            start_date: w_startdate,
            end_date: w_enddate,
            topn: 7
        }
    }, function (result) {
        if (result && result.success) {
            window.baseTools.getSentimentLinear({//指数
                query: {
                    customer_name: city,
                    field_name: city_filed,
                    brand_name: city_brand,
                    start_date: n_startdate,
                    end_date: n_enddate,
                    granulityMinute: n_granularity
                }
            }, function (resultLine) {
                if (resultLine && resultLine.success) {
                    config[1].data = result.data;
                    config[0].data = resultLine.data;
                    $("#agriculture").turnChart({ height: generalH, data: config });
                    if (callback) {
                        room14AjaxCount += 1;
                        callback();
                    }
                }
            });
        }

    });
}
function industryBind(city, generalH, callback) {
    var config = [
        {
            title: '工业热词',
            containerCSS: 'kbh-content nt_hotword_gy',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: []
        },
        {
            title: '工业指数',
            containerCSS: 'kbh-content nt_gy',
            contentCSS: '',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiline',
            lineColor: "#ffffff",
            columnColor: "#01a5a5",
            chartType: 1,
            data: []
        }
    ];
    var city_filed = '经济';
    var city_brand = '工业';
    window.baseTools.getHotWords({//热词
        query: {
            customer_name: city,
            field_name: city_filed,
            brand_name: city_brand,
            start_date: w_startdate,
            end_date: w_enddate,
            topn: 7
        }
    }, function (result) {
        if (result && result.success) {

            window.baseTools.getSentimentLinear({//指数
                query: {
                    customer_name: city,
                    field_name: city_filed,
                    brand_name: city_brand,
                    start_date: n_startdate,
                    end_date: n_enddate,
                    granulityMinute: n_granularity
                }
            }, function (resultLine) {
                if (resultLine && resultLine.success) {
                    config[0].data = result.data;
                    config[1].data = resultLine.data;
                    $("#industry").turnChart({ height: generalH, data: config });
                    if (callback) {
                        room14AjaxCount += 1;
                        callback();
                    }
                }
            });
        }

    });
}
function yqBind(city, yqH) {
    var timeInterval = 10 * 60 * 1000;

    var config = {
        SentimentType: "舆情综合指数",
        CityName: city,
        AttentionCount: 34,
        columnColor: "#1e5bbc",
        ChartData: []
    };
    var curDate = new Date();
    var nDate = new Date(curDate.setMonth(curDate.getMonth() - 1));
    var xAxis = +nDate;
    var chart = $("#yq").lineChart1({ height: yqH, xAxisMin: xAxis,data: config});

    //更新数据
    function GetYQData() {
        //更新时间
        UpdateTime();
        chart.showLoading('正在更新数据...');

        window.baseTools.getSentimentLinear({//指数
            query: {
                customer_name: city,
                start_date: y_startdate,
                end_date: y_enddate,
                granulityMinute: y_granularity
            }
        }, function (resultLine) {
            if (resultLine && resultLine.success) {
                chart.series[0].setData(resultLine.data);
                chart.series[1].setData(resultLine.data);
                chart.hideLoading();
                setTimeout(GetYQData, timeInterval);
            }
        }, function () {
            //请求超时后继续调用
            GetYQData();
        });
    };
    GetYQData();

}
function newsBind(city, generalH) {

    var timeInterval = 10 * 60 * 1000;
    var config = [{
        title: '新闻监听',
        containerCSS: 'top-right-news nt_news',
        titleTop: true,
        contentCSS: 'four-content',
        titleCSS: 'right-news-title',
        iconCSS: 'nt_icon ntilist',
        data: []
    }];

    function GetNewsInterval()
    {
        window.baseTools.GetNewsSentimentMonitor({
            query: {
                customer_name: city,
                // level: -1,
                topn: 10
            }
        }, function (result) {
            if (result && result.success) {
                config[0].data = result.data;
                $("#newsMonitor").turnChart({ height: generalH, data: config });
                setTimeout(GetNewsInterval, timeInterval);
            }
        }, function () {
            //请求超时
            GetNewsInterval();
        });
    }
    GetNewsInterval();

}
function weiBoBind(city, generalH) {
    var timeInterval = 10 * 60 * 1000;
    var config = [{
        title: '微博监听',
        containerCSS: 'top-right-four',
        titleTop: true,
        contentCSS: 'four-content',
        titleCSS: 'four-title',
        iconCSS: 'nt_icon ntilist',
        chartType: 5,
        liCss: 'fl-content',
        data: []
    }];

    function GetWeiboInterval() {
        window.baseTools.GetWeiBoSentimentMonitor({
            query: {
                customer_name: city,
                // level: -1,
                topn: 10
            }
        }, function (result) {
            if (result && result.success) {
                config[0].data = result.data;
                $("#weiboMonitor").turnChart({ height: generalH, data: config });
                setTimeout(GetWeiboInterval,timeInterval);
            }
        }, function () {
            //请求超时
            GetWeiboInterval();
        });
    }
    GetWeiboInterval();

}
function CallBack() {
    if (room14AjaxCount > 7) {
        TurnFun("safe");
        TurnFun("traffic");
        TurnFun("environment");
        TurnFun("cityBuild");
        TurnFun("industry");
        TurnFun("agriculture");
        TurnFun("business");
        TurnFun("travel");
        resizeChart();
    }
}
function TurnFun(id) {
    animationMgr.register(id).active(id);
}


//重置图表
function resizeChart() {
    //城市管理综合指数
    var chartCityMa = $("#cityManage .resizeChart").highcharts(),
        chartW = $("#cityManage .resizeChart").width(),
        chartH = $("#cityManage .resizeChart").height();
    //舆情综合
    var chartYq = $("#yq").highcharts(),
        chartYqW = $("#yq").width(),
        chartYqH = $("#yq").height();

    var chartSafe = $("#safe .highcharts-container").parent("div").highcharts(),//安全
        chartTraffic = $("#traffic .highcharts-container").parent("div").highcharts();//交通
    chartEnvironment = $("#environment .highcharts-container").parent("div").highcharts(),//环保
        chartCity = $("#cityBuild .highcharts-container").parent("div").highcharts(),//城建
        chartPeople = $("#people .highcharts-container").parent("div").highcharts(),//民生
        chartEconomy = $("#economy .highcharts-container").parent("div").highcharts(),//经济综合
        chartIndu = $("#industry .highcharts-container").parent("div").highcharts(),//工业
        chartArgi = $("#agriculture .highcharts-container").parent("div").highcharts(),//农业
        chartBue = $("#business .highcharts-container").parent("div").highcharts(),//商业
        chartTravel = $("#travel .highcharts-container").parent("div").highcharts();//旅游


    chartYq.setSize(chartYqW, chartYqH);
    chartCityMa.setSize(chartW, chartH);
    chartPeople.setSize(chartW, chartH);
    chartEconomy.setSize(chartW, chartH);

    if(chartSafe){
        chartSafe.setSize(chartW, chartH);
    }
    if(chartTraffic){
        chartTraffic.setSize(chartW, chartH);
    }
    if(chartEnvironment){
        chartEnvironment.setSize(chartW, chartH);
    }
    if(chartCity){
        chartCity.setSize(chartW, chartH);
    }
    if(chartIndu){
        chartIndu.setSize(chartW, chartH);
    }
    if(chartArgi){
        chartArgi.setSize(chartW, chartH);
    }
    if(chartBue){
        chartBue.setSize(chartW, chartH);
    }
    if(chartTravel){
        chartTravel.setSize(chartW, chartH);
    }

}