/// <reference path="../iChart.js" />
/// <reference path="base.js" />

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

//初始化函数
var currCity=window.global.UserInfo.CustomerName;
$(function () {
    UpdateTime();//更新全局时间。。
    GetSentiment();//综合舆情指数
    GetHotWords();//综合热词
    GetEconomyInfo();//经济综合指数
    var arrCol=['城市管理综合指数','民生综合指数'];
    for(var m=0;m<arrCol.length;m++){
        GetCityPeopleInfo(arrCol[m]);
    }
    var arrCol2=['经济综合热词','城市管理热词','民生综合热词'];
    for(var n=0;n<arrCol2.length;n++){
        GetCityPeopleEconomyInfo(arrCol2[n]);
    }
    //GetCityInfo();//城市管理指数
    //GetCityInfoWord();//城市管理热词
    //GetPeopleInfo();//民生指数
    //GetPeopleInfoWord();//民生热词
    //GetEconomyInfoWord();//经济热词
});
//更新全局变量
function UpdateTime() {
    //热词（一周的热词？）
    var w_curDate = new Date();
    w_startdate =formatDateType( new Date(w_curDate.setDate(w_curDate.getDate() - 6)),'day');
    w_enddate =formatDateType( new Date(),'day');

    //其他指数(一周的指数)
    var n_curDate = new Date();
    n_startdate = formatDateType(new Date(n_curDate.setDate(n_curDate.getDate() - 6)),'day');
    n_enddate = formatDateType(new Date(),'day');

    //综合指数(一年的综合指数)
    var y_curDate = new Date();
    y_startdate = formatDateType(new Date(y_curDate.setYear(y_curDate.getFullYear() - 1)),'day');
    y_enddate = formatDateType(new Date(),'day');
}
//经济指数
function GetEconomyInfo() {
    var config = [
        {
            title: '经济综合指数',
            containerCSS: 'kbh-content kbh-economic',
            contentCSS: '',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiline',
            bottomColor: "#a0de72",
            labelColor: '#9ea09f',
            splineColor: "#708d4e",
            chartType: "1b",//iChart.js中使用
            data: []
        }
    ];

    var city_filed = "经济";

    window.baseTools.getSentimentLinear({//base.js
        query: {
            customer_name: currCity,
            field_name: city_filed,
            start_date: n_startdate,
            end_date: n_enddate,
            granulityMinute: n_granularity
        }
    }, function (result1) {//城管指数
        console.log(result1.data);
        config[0].data = result1.data;

        $("#EconomicInformation").turnChart({ height: 275, data: config }).removeClass("loading");//iChart.js--turnChart
    });
}
//HotWord
function GetHotWords() {//综合热词
    var config = {
        title: '综合热词',
        contentCSS: 'three-content',
        titleCSS: 'three-title',
        cssData: ["zh_word1", "zh_word2", "zh_word3", "zh_word4", "zh_word5", "zh_word6", "zh_word7", "zh_word8", "zh_word9"],
        data: []
    };
    //var city_filed = '城市管理';
    //var city_brand = '安全';
    window.baseTools.getHotWords({//
        query: {
            customer_name: currCity,
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
}//综合热词

function GetCityPeopleInfo(keys){
    var city_filed,//名称
        domElem='';
    var config = [{
        contentCSS: '',titleCSS: 'kbh-title',iconCSS: 'nt_icon ntiline',
        labelColor: '#9ea09f',lineType:"line",chartType: 1,data: []
    }];
    switch(keys){
        case '城市管理综合指数':
            var cg=config[0]
            cg.title='城市管理综合指数';
            cg.containerCSS='kbh-content kbh-cityManage';
            cg.splineColor="#017789";
            cg.columnColor="#a4ddfe";
            city_filed = "城市管理";
            domElem= $("#CityInformation");
            break;
        case '民生综合指数':
            var cg=config[0]
            cg.title='民生综合指数';
            cg.containerCSS='kbh-content kbh-people';
            cg.splineColor="#ce754b";
            cg.columnColor="#eebba4";
            city_filed = "民生";
            domElem= $("#PeopleInformation");
            break;
    }

    window.baseTools.getSentimentLinear({
        query: {
            customer_name: currCity,
            field_name: city_filed,
            start_date: n_startdate,
            end_date: n_enddate,
            granulityMinute: n_granularity
        }
    }, function (result1) {//城市综合指数\'民生综合指数'
        console.log('config:',config)
        config[0].data = result1.data;
        domElem.turnChart({ height: 275, data: config }).removeClass("loading");
    });
}
//综合舆情指数
function GetSentiment() {
    var timeInterval = 10 * 60 * 1000;
    var config = {
        SentimentType: "舆情综合指数",
        CityName: currCity,
        AttentionCount: 34
    };
    var curDate = new Date();
    var nDate = new Date(curDate.setMonth(curDate.getMonth()-1));
    var xAxis = +nDate;

    var chart = $("#yq").lineChart1({
        height: 290, labelColor: "#9ea09f",
        splineColor: "#fc9d55",titleColor:"#333333",
        columnColor: "#f6e2ca", showRange: false, tootipType: 2,
        xAxisMin: xAxis,
        data: config
    });

    function GetYQData() {
        chart.showLoading('正在更新数据...');
        var currentDate = new Date();
        var startDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
        window.baseTools.getSentimentLinear({
            query: {
                customer_name: currCity,
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
            GetYQData();
        });
    }
    GetYQData();
}

function GetCityPeopleEconomyInfo(keys){
    var city_filed,//名称
        domElem='';
    var config = [{
        containerCSS: 'kbh-content nt_hotword_safe',contentCSS: 'forum-hot',
        titleCSS: 'kbh-title',iconCSS: 'nt_icon ntiword',chartType: 2,data: []
    }];
    switch(keys){
        case '经济综合热词':
            var cg=config[0];
            cg.title='经济综合热词';
            city_filed = "经济";
            domElem= $("#EconomicInformationWord");
            break;
        case '城市管理热词':
            var cg=config[0];
            cg.title='城市管理热词';
            city_filed = "城市管理";
            domElem= $("#CityInformationWord");
            break;
        case '民生综合热词':
            var cg=config[0];
            cg.title='民生综合热词';
            city_filed = "民生";
            domElem= $("#PeopleInformationWord");
            break;
    }

    window.baseTools.getHotWords({
        query: {
            customer_name: currCity,
            field_name: city_filed,
            start_date: w_startdate,
            end_date: w_enddate,
            topn: 10
        }
    }, function (result1) {//城市综合指数
        config[0].data = result1.data;
        domElem.turnChart({ height: 275, data: config }).removeClass("loading");
    });
}


/*//城市管理指数
 function GetCityInfo() {
 var ConfigInfo = [
 {
 title: '城市管理综合指数图',
 containerCSS: 'kbh-content kbh-cityManage',
 contentCSS: '',
 titleCSS: 'kbh-title',
 iconCSS: 'nt_icon ntiline',
 labelColor: '#9ea09f',
 splineColor: "#017789",
 columnColor: "#a4ddfe",
 lineType:"line",
 chartType: 1,
 data: []
 }];
 var city_filed = "城市管理";

 window.baseTools.getSentimentLinear({
 query: {
 customer_name: currCity,
 field_name: city_filed,
 start_date: n_startdate,
 end_date: n_enddate,
 granulityMinute: n_granularity
 }
 }, function (result1) {//城市综合指数
 ConfigInfo[0].data = result1.data;
 $("#CityInformation").turnChart({ height: 275, data: ConfigInfo }).removeClass("loading");
 });
 }*/
/*

//城市管理热词
function GetCityInfoWord() {//直接内容，不需highchars
    var ConfigInfo = [
        {
            title: '城市管理热词',
            containerCSS: 'kbh-content nt_hotword_safe',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: []
        }];
    var city_filed = "城市管理";

    window.baseTools.getHotWords({
        query: {
            customer_name: currCity,
            field_name: city_filed,
            start_date: w_startdate,
            end_date: w_enddate,
            topn: 10
        }
    }, function (result1) {//城市综合指数
        ConfigInfo[0].data = result1.data;
        $("#CityInformationWord").turnChart({ height: 275, data: ConfigInfo }).removeClass("loading");
    });
}

////民生指数
//function GetPeopleInfo() {
//    var ConfigInfo = [
//        {
//            title: '民生综合指数',
//            containerCSS: 'kbh-content kbh-people',
//            contentCSS: '',
//            titleCSS: 'kbh-title',
//            iconCSS: 'nt_icon ntiline',
//            labelColor: '#9ea09f',
//            splineColor: "#ce754b",
//            columnColor: "#eebba4",
//            lineType: "line",
//            chartType: 1,
//            data: []
//        }
//    ];
//
//    var city_filed = "民生";
//    var currentDate = new Date();
//    var startDate = new Date(currentDate.setHours(currentDate.getHours() - 5));
//
//    window.baseTools.getSentimentLinear({
//        query: {
//            customer_name: currCity,
//            field_name: city_filed,
//            start_date: n_startdate,
//            end_date: n_enddate,
//            granulityMinute: n_granularity
//        }
//    }, function (result1) {//安全指数
//        ConfigInfo[0].data = result1.data;
//        $("#PeopleInformation").turnChart({ height: 275, data: ConfigInfo }).removeClass("loading");
//    });
//
//}

//民生热词
function GetPeopleInfoWord() {//直接内容，不需highchars
    var ConfigInfo = [
        {
            title: '民生综合热词',
            containerCSS: 'kbh-content nt_hotword_safe',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: []
        }];
    var city_filed = "民生";

    window.baseTools.getHotWords({
        query: {
            customer_name: currCity,
            field_name: city_filed,
            start_date: w_startdate,
            end_date: w_enddate,
            topn: 10
        }
    }, function (result1) {//城市综合指数
        ConfigInfo[0].data = result1.data;
        $("#PeopleInformationWord").turnChart({ height: 275, data: ConfigInfo }).removeClass("loading");
    });
}
*/



//经济热词
/*
function GetEconomyInfoWord() {//直接内容，不需highchars
    var ConfigInfo = [
        {
            title: '经济综合热词',
            containerCSS: 'kbh-content nt_hotword_safe',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: []
        }];
    var city_filed = "经济";

    window.baseTools.getHotWords({
        query: {
            customer_name: currCity,
            field_name: city_filed,
            start_date: w_startdate,
            end_date: w_enddate,
            topn: 10
        }
    }, function (result1) {//城市综合指数
        ConfigInfo[0].data = result1.data;
        $("#EconomicInformationWord").turnChart({ height: 275, data: ConfigInfo }).removeClass("loading");
    });
}*/
