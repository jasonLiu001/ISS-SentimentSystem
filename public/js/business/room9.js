/// <reference path="../iChart.js" />
/// <reference path="base.js" />
//舆情指数
var n_granularity = 1440;
var n_startdate = new Date(), n_enddate = new Date();
//热词区间
var w_startdate = new Date(),w_enddate = new Date();
//综合舆情热词
var y_granularity = 1440;
var y_startdate = new Date(),y_enddate = new Date();
var city;
var totalRoom9_news=0;
var totalRoom9_weibo=0;
/**城管\民生\经济 等虽然不翻转了，但是依然产生N个ajax后才显示。。。暂时不删除
 * **/

$(function () {
    sLogin(function(result){//模拟登录
        city= result.CustomerName;
        console.log(city);
        loadData()
    });
});
function loadData(){
    UpdateTime();//更新时间
    GetSentiment();//综合舆情指数
    GetHotWords();//HotWord

    GetNews(CallBack);//News
    GetWeibo(CallBack);//Weibo

    GetCityInfo(CallBack);//城管
    GetPeopleInfo(CallBack);//民生
    GetEconomyInfo(CallBack);//经济

    GetPublish();//发布
}
//更新全局变量
function UpdateTime() {
    //热词（前一周的热词）
    var w_curDate = new Date();
    w_startdate = formatDateType(new Date(w_curDate.setDate(w_curDate.getDate() - 6)),'day');
    w_enddate = formatDateType(new Date(),'day');

    //其他指数(前一周的指数)
    var n_curDate = new Date();
    n_startdate = formatDateType(new Date(n_curDate.setDate(n_curDate.getDate() - 6)),'day');
    n_enddate = formatDateType(new Date(),'day');

    //新闻年度统计
    var y_curDate = new Date();
    y_startdate = formatDateType(new Date(y_curDate.setYear(y_curDate.getFullYear() - 1)),'day');
    y_enddate = formatDateType(new Date(),'day');
}
var room9AjaxCount = 0;
//综合舆情指数
function GetSentiment() {
    var timeInterval = 10 * 60 * 1000;
    var config = {
        SentimentType: "舆情综合指数",
        CityName: city,
        columnColor: "#1e5bbc"
    };

    var curDate = new Date();
    var nDate = new Date(curDate.setMonth(curDate.getMonth()-1));
    var xAxis = +nDate;

    var chart = $("#yq").lineChart1({ height: 330, showRange: false,xAxisMin: xAxis,data: config });

    function GetYQData() {
        UpdateTime();
        chart.showLoading('正在更新数据...');

        window.baseTools.getSentimentLinear({
            query: {
                customer_name: city,
                start_date: y_startdate,
                end_date: y_enddate,
                granulityMinute: y_granularity
            }
        }, function (result) {
            if (result && result.success) {
                chart.series[0].setData(result.data);
                chart.series[1].setData(result.data);
                chart.hideLoading();
                setTimeout(GetYQData, timeInterval);
            }
        }, function () {
            //请求超时后继续调用
            GetYQData();
        });
    }
    GetYQData();
}
//HotWord
function GetHotWords() {
    var config = {
        title: '综合热词',
        contentCSS: 'three-content',
        titleCSS: 'three-title',
        cssData: ["zh_word1", "zh_word2", "zh_word3", "zh_word4", "zh_word5", "zh_word6", "zh_word7", "zh_word8", "zh_word9"],
        data: []
    };
    //var city_filed = '城市管理';
    //var city_brand = '安全';
    window.baseTools.getHotWords({
        query: {
            customer_name: city,
            //field_name: city_filed,
            //brand_name: city_brand,
            start_date: w_startdate,
            end_date: w_enddate,
            topn: 10
        }
    }, function (result) {
        if (result && result.success) {
            config.data = result.data;
            $("#hotwords").wordChart({ height: 135, data: config }).removeClass("loading");
        }
    })
}
//News
function GetNews(callback) {
    var config = [
        {
            title: '新闻监听',//没有chartType，为上下滚动
            containerCSS: 'top-right-news nt_news',//最外层包含内容的box
            titleTop: false,//标题在下，内容在上 iChart.js
            contentCSS: 'four-content',//存放内容的box
            titleCSS: 'right-news-title',//标题的class name
            iconCSS: 'nt_icon ntilist',//<div class="right-news-title"><i class="nt_icon ntilist"></i>新闻监听</div>
            data: []
        },
        {
            title: '新闻按职能分布图',
            containerCSS: 'top-right-news',
            titleTop: false,
            contentCSS: 'four-content piechart',
            titleCSS: 'right-news-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 3,//iChart.js使用
            data: []
        },
        {
            title: '新闻按月分布图',
            containerCSS: 'top-right-news',
            titleTop: false,
            contentCSS: 'four-content',
            titleCSS: 'right-news-title',
            iconCSS: 'nt_icon ntilist',
            columnColor: "#78ba00",
            chartType: 4,//iChart.js使用
            data: []
        }
    ];
    //ajax 请求
    window.baseTools.GetNewsSentimentMonitor({
        query: {
            customer_name: city,
            level: 1,
            topn: 10
        }

    }, function (result1) {
        window.baseTools.GetNewsSentimentPie({
            query: {
                customer_name: city,
                start_date: y_startdate,
                end_date: y_enddate
            }
        }, function (result2) {

            window.baseTools.GetNewsSentimentMonth({
                query: {
                    customer_name: city,
                    start_date: y_startdate,
                    end_date: y_enddate
                }
            }, function (result3) {

                if (result1 && result1.success && result2 && result2.success && result3 && result3.success) {
                    config[0].data = result1.data;
                    config[1].data = result2.data;
                    config[2].data = result3.data;
                    $("#news").turnChart({ height: 155, data: config });

                    if (callback) {
                        room9AjaxCount += 1;
                        callback();
                    }
                }
            });
        });

    });
}
//Weibo
function GetWeibo(callback) {
    var config = [
        {
            title: '微博监听',
            containerCSS: 'top-right-four',
            titleTop: false,
            contentCSS: 'four-content piechart',
            titleCSS: 'four-title',
            iconCSS: 'nt_icon ntilist',
            data: []
        },
        {
            title: '微博按职能分布图',
            containerCSS: 'top-right-four',
            titleTop: false,
            contentCSS: 'four-content piechart',
            titleCSS: 'four-title',
            iconCSS: 'nt_icon ntilist',
            chartType: 3,
            data: []
        },
        {
            title: '微博按月分布图',
            containerCSS: 'top-right-four',
            titleTop: false,
            contentCSS: 'four-content',
            titleCSS: 'four-title',
            iconCSS: 'nt_icon ntilist',
            columnColor: "#a0f1fe",
            chartType: 4,
            data: []
        }
    ];
    //ajax 请求
    window.baseTools.GetWeiBoSentimentMonitor({
        query: {
            customer_name: city,
            level: 1,
            topn: 10
        }

    }, function (result1) {
        window.baseTools.GetWeiBoSentimentPie({
            query: {
                customer_name: city,
                start_date: y_startdate,
                end_date: y_enddate
            }
        }, function (result2) {

            window.baseTools.GetWeiBoSentimentMonth({
                query: {
                    customer_name: city,
                    start_date: y_startdate,
                    end_date: y_enddate
                }
            }, function (result3) {

                if (result1 && result1.success && result2 && result2.success && result3 && result3.success) {
                    config[0].data = result1.data;
                    config[1].data = result2.data;
                    config[2].data = result3.data;
                    $("#weiboMonitor").turnChart({ height: 155, data: config });
                   
                    if (callback) {
                        room9AjaxCount += 1;
                        callback();
                    }
                }
            });
        });

    });
}
//城管
function GetCityInfo(callback) {
    var config = [
        {
            title: '城市管理综合指数',
            containerCSS: 'kbh-content kbh-cityManage',
            contentCSS: '',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiline',
            lineColor: "#ffffff",
            chartType: "1a",
            data: []
        },
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
            data: []
        },
        {
            title: '交通热词',
            containerCSS: 'kbh-content nt_hotword_tra',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: []
        },

        {
            title: '环保热词',
            containerCSS: 'kbh-content nt_hotword_hb',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: ['绿色环保', '排放达标', '空气质量', 'PM2.5', '水污染', '雾霾', '清洁能源', '节能减排', '可持续发展', '退耕还林', '天气异常', '公众环境', '环境问题']
        }, {
            title: '城建指数',
            containerCSS: 'kbh-content nt_cj',
            contentCSS: '',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiline',
            lineColor: "#ffffff",
            columnColor: "#2572eb",
            chartType: 1,
            data: []
        },
        {
            title: '城建热词',
            containerCSS: 'kbh-content nt_hotword_cj',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: []
        }, {
            title: '电力指数',
            containerCSS: 'kbh-content',
            contentCSS: '',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiline',
            lineColor: "#ffffff",
            columnColor: "rgb(44,184,255)",
            chartType: 1,
            data: []
        }, {
            title: '水利指数',
            containerCSS: 'kbh-content',
            contentCSS: '',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiline',
            lineColor: "#ffffff",
            columnColor: "#139fe6",
            chartType: 1,
            data: []
        }
    ];
    var city_filed = "城市管理", city_brand = "";

    window.baseTools.getSentimentLinear({
        query: {
            customer_name: city,
            field_name: city_filed,
            start_date: n_startdate,
            end_date: n_enddate,
            granulityMinute: n_granularity
        }
    }, function (result1) {//安全指数
        if (result1 && result1.success) {
            config[0].data = result1.data;
            $("#CityInformation").turnChart({ height: 290, data: config });
        }

        city_brand = "安全";
        window.baseTools.getSentimentLinear({
            query: {
                customer_name: city,
                start_date: n_startdate,
                end_date: n_enddate,
                granulityMinute: n_granularity
            }
        }, function (result2) {//安全热词
            //console.log(result2.data);
            window.baseTools.getHotWords({
                query: {
                    customer_name: city,field_name: city_filed,brand_name: city_brand,
                    start_date: w_startdate,end_date: w_enddate,
                    topn: 10
                }
            }, function (result3) {//交通指数
                city_brand = "交通";
                window.baseTools.getSentimentLinear({
                    query: {
                        customer_name: city,field_name: city_filed,brand_name: city_brand,
                        start_date: n_startdate,end_date: n_enddate,
                        granulityMinute: n_granularity
                    }
                }, function (result4) {//交通热词
                    window.baseTools.getHotWords({
                        query: {
                            customer_name: city,field_name: city_filed,brand_name: city_brand,
                            start_date: w_startdate,end_date: w_enddate,topn: 10
                        }
                    }, function (result5) {//环保热词
                        city_brand = "环保";
                        window.baseTools.getHotWords({
                            query: {
                                customer_name: city,field_name: city_filed,brand_name: city_brand,
                                start_date: w_startdate,end_date: w_enddate,topn: 10
                            }
                        }, function (result6) {//城建指数
                            city_brand = "城建";
                            window.baseTools.getSentimentLinear({
                                query: {
                                    customer_name: city,field_name: city_filed,brand_name: city_brand,
                                    start_date: n_startdate,end_date: n_enddate,granulityMinute: n_granularity
                                }
                            }, function (result7) {//城建热词
                                window.baseTools.getHotWords({
                                    query: {
                                        customer_name: city,field_name: city_filed,brand_name: city_brand,
                                        start_date: w_startdate,end_date: w_enddate,topn: 10
                                    }
                                }, function (result8) {//电力指数
                                    city_brand = "电力";
                                    window.baseTools.getSentimentLinear({
                                        query: {
                                            customer_name: city,
                                            field_name: city_filed,
                                            brand_name: city_brand,
                                            start_date: n_startdate,
                                            end_date: n_enddate,
                                            granulityMinute: n_granularity
                                        }
                                    }, function (result9) {//水利指数
                                        city_brand = "水利";
                                        window.baseTools.getSentimentLinear({
                                            query: {
                                                customer_name: city,
                                                field_name: city_filed,
                                                brand_name: city_brand,
                                                start_date: n_startdate,
                                                end_date: n_enddate,
                                                granulityMinute: n_granularity
                                            }
                                        }, function (result10) {

                                            if (result10 && result10.success) {
                                                config[0].data = result1.data;
                                                config[1].data = result2.data;
                                                config[2].data = result3.data;
                                                config[3].data = result4.data;
                                                config[4].data = result5.data;
                                                config[5].data = result6.data;
                                                config[6].data = result7.data;
                                                config[7].data = result8.data;
                                                config[8].data = result9.data;
                                                config[9].data = result10.data;
                                                $("#CityInformation").turnChart({ height: 290, data: config });
                                                if (callback) {
                                                    room9AjaxCount += 1;
                                                    callback();
                                                }
                                            }

                                        });
                                    });
                                });
                            });

                        });
                    });
                });
            });
        });
    });


}
//民生
function GetPeopleInfo(callback) {
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
        },
        {
            title: '教育热词',
            containerCSS: 'kbh-content nt_hotword_peo',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: []
        },
        {
            title: '医疗热词',
            containerCSS: 'kbh-content nt_hotword_peo1',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: []
        },
        {
            title: '养老热词',
            containerCSS: 'kbh-content nt_hotword_peo',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: []
        },
        {
            title: '文体热词',
            containerCSS: 'kbh-content nt_hotword_peo1',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: []
        }
    ];

    var city_filed = "民生", city_brand = "";

    window.baseTools.getSentimentLinear({
        query: {
            customer_name: city,
            field_name: city_filed,
            start_date: n_startdate,
            end_date: n_enddate,
            granulityMinute: n_granularity
        }
    }, function (result1) {//教育热词
        if (result1 && result1.success) {
            config[0].data = result1.data;
            $("#PeopleInformation").turnChart({ height: 290, data: config });
        }
        city_brand = "教育";
        window.baseTools.getHotWords({
            query: {
                customer_name: city,
                field_name: city_filed,
                brand_name: city_brand,
                start_date: w_startdate,
                end_date: w_enddate,
                topn: 10
            }
        }, function (result2) {//安全指数
            city_brand = "医疗";
            window.baseTools.getHotWords({
                query: {
                    customer_name: city,
                    field_name: city_filed,
                    brand_name: city_brand,
                    start_date: w_startdate,
                    end_date: w_enddate,
                    topn: 10
                }
            }, function (result3) {//养老热词
                city_brand = "养老";
                window.baseTools.getHotWords({
                    query: {
                        customer_name: city,
                        field_name: city_filed,
                        brand_name: city_brand,
                        start_date: w_startdate,
                        end_date: w_enddate,
                        topn: 10
                    }
                }, function (result4) {//文体热词
                    city_brand = "文体";
                    window.baseTools.getHotWords({
                        query: {
                            customer_name: city,
                            field_name: city_filed,
                            brand_name: city_brand,
                            start_date: w_startdate,
                            end_date: w_enddate,
                            topn: 10
                        }
                    }, function (result5) {

                        if (result5 && result5.success) {
                            config[0].data = result1.data;
                            config[1].data = result2.data;// result2.data;
                            config[2].data = result3.data;
                            config[3].data = result4.data;
                            config[4].data = result5.data;
                            $("#PeopleInformation").turnChart({ height: 290, data: config });
                            if (callback) {
                                room9AjaxCount += 1;
                                callback();
                            }
                        }

                    });
                });
            });
        });

    });


}
//经济
function GetEconomyInfo(callback) {
    var config = [
        {
            title: '经济综合指数',
            containerCSS: 'kbh-content kbh-economic',
            contentCSS: '',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiline',
            topColor: "#2f7ed8",
            bottomColor: "#1396bf",
            chartType: "1b",
            data: []
        },
        {
            title: '工业热词',
            containerCSS: 'kbh-content nt_hotword_gy',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: []
        }, {
            title: '工业指数',
            containerCSS: 'kbh-content nt_gy',
            contentCSS: '',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiline',
            lineColor: "#ffffff",
            columnColor: "#01a5a5",
            chartType: 1,
            data: []
        },
        {
            title: '农业热词',
            containerCSS: 'kbh-content nt_hotword_eco',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: []
        }, {
            title: '农业指数',
            containerCSS: 'kbh-content kbh-agriculture',
            contentCSS: '',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiline',
            lineColor: "#ffffff",
            columnColor: "#1faeff",
            chartType: 1,
            data: []
        },
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
        ,
        {
            title: '旅游热词',
            containerCSS: 'kbh-content nt_hotword_travel',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: []
        },
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
        },
        {
            title: '金融热词',
            containerCSS: 'kbh-content nt_hotword_travel',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: []
        },
        {
            title: '金融指数',
            containerCSS: 'kbh-content',
            contentCSS: '',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiline',
            lineColor: "#ffffff",
            columnColor: "#139fe6",
            chartType: 1,
            data: []
        },
    ];

    var city_filed = "经济", city_brand = "";

    window.baseTools.getSentimentLinear({
        query: {
            customer_name: city,
            field_name: city_filed,
            start_date: n_startdate,
            end_date: n_enddate,
            granulityMinute: n_granularity
        }
    }, function (result0) {//城管指数
        if (result0 && result0.success) {
            config[0].data = result0.data;
            $("#EconomicInformation").turnChart({ height: 290, data: config });
        }


        city_brand = "工业";
        window.baseTools.getHotWords({//工业热词
            query: {
                customer_name: city,
                field_name: city_filed,
                brand_name: city_brand,
                start_date: w_startdate,
                end_date: w_enddate,
                topn: 10
            }
        }, function (result1) {
            window.baseTools.getSentimentLinear({//工业曲线
                query: {
                    customer_name: city,
                    field_name: city_filed,
                    brand_name: city_brand,
                    start_date: n_startdate,
                    end_date: n_enddate,
                    granulityMinute: n_granularity
                }
            }, function (result2) {
                //农业Start
                city_brand = "农业";
                window.baseTools.getHotWords({//农业热词
                    query: {
                        customer_name: city,
                        field_name: city_filed,
                        brand_name: city_brand,
                        start_date: w_startdate,
                        end_date: w_enddate,
                        topn: 10
                    }
                }, function (result3) {
                    window.baseTools.getSentimentLinear({//农业曲线
                        query: {
                            customer_name: city,
                            field_name: city_filed,
                            brand_name: city_brand,
                            start_date: n_startdate,
                            end_date: n_enddate,
                            granulityMinute: n_granularity
                        }
                    }, function (result4) {
                        //商业Start
                        city_brand = "商业";
                        window.baseTools.getHotWords({//商业热词
                            query: {
                                customer_name: city,
                                field_name: city_filed,
                                brand_name: city_brand,
                                start_date: w_startdate,
                                end_date: w_enddate,
                                topn: 10
                            }
                        }, function (result5) {
                            window.baseTools.getSentimentLinear({//商业曲线
                                query: {
                                    customer_name: city,
                                    field_name: city_filed,
                                    brand_name: city_brand,
                                    start_date: n_startdate,
                                    end_date: n_enddate,
                                    granulityMinute: n_granularity
                                }
                            }, function (result6) {
                                //旅游Start
                                city_brand = "旅游";
                                window.baseTools.getHotWords({//旅游热词
                                    query: {
                                        customer_name: city,
                                        field_name: city_filed,
                                        brand_name: city_brand,
                                        start_date: w_startdate,
                                        end_date: w_enddate,
                                        topn: 10
                                    }
                                }, function (result7) {
                                    window.baseTools.getSentimentLinear({//旅游曲线
                                        query: {
                                            customer_name: city,
                                            field_name: city_filed,
                                            brand_name: city_brand,
                                            start_date: n_startdate,
                                            end_date: n_enddate,
                                            granulityMinute: n_granularity
                                        }
                                    }, function (result8) {
                                        //金融Start
                                        city_brand = "金融";
                                        window.baseTools.getHotWords({//金融热词
                                            query: {
                                                customer_name: city,
                                                field_name: city_filed,
                                                brand_name: city_brand,
                                                start_date: w_startdate,
                                                end_date: w_enddate,
                                                topn: 10
                                            }
                                        }, function (result9) {
                                            window.baseTools.getSentimentLinear({//金融曲线
                                                query: {
                                                    customer_name: city,
                                                    field_name: city_filed,
                                                    brand_name: city_brand,
                                                    start_date: n_startdate,
                                                    end_date: n_enddate,
                                                    granulityMinute: n_granularity
                                                }
                                            }, function (result10) {
                                                //最后
                                                if (result8 && result8.success) {
                                                    config[0].data = result0.data;
                                                    config[1].data = result1.data;
                                                    config[2].data = result2.data;
                                                    config[3].data = result3.data;
                                                    config[4].data = result4.data;
                                                    config[5].data = result5.data;
                                                    config[6].data = result6.data;
                                                    config[7].data = result7.data;
                                                    config[8].data = result8.data;
                                                    config[9].data = result9.data;
                                                    config[10].data = result10.data;
                                                    $("#EconomicInformation").turnChart({ height: 290, data: config });
                                                    if (callback) {
                                                        room9AjaxCount += 1;
                                                        callback();
                                                    }
                                                }
                                            });
                                        });
                                        //金融End
                                    });
                                });
                                //旅游End
                            });
                        });
                        //商业End
                    });
                });
                //农业End
            });
        });
    });
}
//发布
function GetPublish() {
    var config = {
        containerCSS: 'media-body list-body',
        iconCSS: 'nt_icon ntilist',
        rowHeight: "65",
        data: []
    };
    window.baseTools.GetWeiBoSentimentPublish({
        query: {
            customer_name: city,
            topn: 10
        }
    }, function (result) {
        if (result && result.success) {
            config.data = result.data;
            $("#cityPublish").html(city + "发布");
            $("#WeiboModel").rollChart({ height: 90, data: config });

        }
    })

}

function CallBack() {
    if (room9AjaxCount > 4) {
        TurnFun("news");
        TurnFun("weiboMonitor");
        TurnFun("CityInformation");
        TurnFun("PeopleInformation");
        TurnFun("EconomicInformation");
    }
}
function TurnFun(id) {
    animationMgr.register(id).active(id);
}