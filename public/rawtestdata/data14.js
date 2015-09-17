//获取综合舆情指数

function GetVal()
{
    return (Math.random() * 10 + 90);
}
function GetSentimentLinear() {
    return {
        SentimentType: "舆情综合指数",
        CityName: "洪泽",
        AttentionCount: 34,
        columnbg: "#1e5bbc",     
        ChartData: [
            [Date.UTC(2014, 08, 04, 00, 00, 00), 105],
            [Date.UTC(2014, 08, 04, 01, 00, 00), 95],
            [Date.UTC(2014, 08, 04, 02, 00, 00), 103],
            [Date.UTC(2014, 08, 04, 03, 00, 00), 101],
            [Date.UTC(2014, 08, 04, 04, 00, 00),97],
            [Date.UTC(2014, 08, 04, 05, 00, 00), 92],
            [Date.UTC(2014, 08, 04, 06, 00, 00), 105],
            [Date.UTC(2014, 08, 04, 07, 00, 00), 85],
            [Date.UTC(2014, 08, 04, 08, 00, 00), 120],
            [Date.UTC(2014, 08, 04, 09, 00, 00), 105],
            [Date.UTC(2014, 08, 04, 10, 00, 00), 85],
            [Date.UTC(2014, 08, 04, 11, 00, 00), 119],
            [Date.UTC(2014, 08, 04, 12, 00, 00), GetVal()],
            [Date.UTC(2014, 08, 04, 13, 00, 00), 95],
            [Date.UTC(2014, 08, 04, 14, 00, 00), 110],
            [Date.UTC(2014, 08, 04, 15, 00, 00), 107],
            [Date.UTC(2014, 08, 04, 16, 00, 00), 85],
            [Date.UTC(2014, 08, 04, 17, 00, 00), 100],
            [Date.UTC(2014, 08, 04, 18, 00, 00), 105],
            [Date.UTC(2014, 08, 04, 19, 00, 00), 106],
            [Date.UTC(2014, 08, 04, 20, 00, 00), 100],
            [Date.UTC(2014, 08, 04, 21, 00, 00), GetVal()],
            [Date.UTC(2014, 08, 04, 22, 00, 00), 96],
            [Date.UTC(2014, 08, 04, 23, 00, 00), 109],
            [Date.UTC(2014, 08, 05, 00, 00, 00), 105],
            [Date.UTC(2014, 08, 05, 01, 00, 00), 95],
            [Date.UTC(2014, 08, 05, 02, 00, 00), 115],
            [Date.UTC(2014, 08, 05, 03, 00, 00), 101],
            [Date.UTC(2014, 08, 05, 04, 00, 00), 85],
            [Date.UTC(2014, 08, 05, 05, 00, 00), 92],
            [Date.UTC(2014, 08, 05, 06, 00, 00), 105],
            [Date.UTC(2014, 08, 05, 07, 00, 00), 85],
            [Date.UTC(2014, 08, 05, 08, 00, 00), 120],
            [Date.UTC(2014, 08, 05, 09, 00, 00), 105],
            [Date.UTC(2014, 08, 05, 10, 00, 00), 85],
            [Date.UTC(2014, 08, 05, 11, 00, 00), 119],
            [Date.UTC(2014, 08, 05, 12, 00, 00), 105],
            [Date.UTC(2014, 08, 05, 13, 00, 00), 95],
            [Date.UTC(2014, 08, 05, 14, 00, 00), 110],
            [Date.UTC(2014, 08, 05, 15, 00, 00), 107],
            [Date.UTC(2014, 08, 05, 16, 00, 00), 85],
            [Date.UTC(2014, 08, 05, 17, 00, 00), 100],
            [Date.UTC(2014, 08, 05, 18, 00, 00), 105],
            [Date.UTC(2014, 08, 05, 19, 00, 00), 106],
            [Date.UTC(2014, 08, 05, 20, 00, 00), 100],
            [Date.UTC(2014, 08, 05, 21, 00, 00), 109],
            [Date.UTC(2014, 08, 05, 22, 00, 00), 96],
            [Date.UTC(2014, 08, 05, 23, 00, 00), 109],
            [Date.UTC(2014, 08, 06, 00, 00, 00), 105],
            [Date.UTC(2014, 08, 06, 01, 00, 00), 95],
            [Date.UTC(2014, 08, 06, 02, 00, 00), 115],
            [Date.UTC(2014, 08, 06, 03, 00, 00), 101],
            [Date.UTC(2014, 08, 06, 04, 00, 00), 85],
            [Date.UTC(2014, 08, 06, 05, 00, 00), 92],
            [Date.UTC(2014, 08, 06, 06, 00, 00), 105],
            [Date.UTC(2014, 08, 06, 07, 00, 00), 85],
            [Date.UTC(2014, 08, 06, 08, 00, 00), 120],
            [Date.UTC(2014, 08, 06, 09, 00, 00), 105],
            [Date.UTC(2014, 08, 06, 10, 00, 00), 85],
            [Date.UTC(2014, 08, 06, 11, 00, 00), 119],
            [Date.UTC(2014, 08, 06, 12, 00, 00), 105],
            [Date.UTC(2014, 08, 06, 13, 00, 00), 95],
            [Date.UTC(2014, 08, 06, 14, 00, 00), 110],
            [Date.UTC(2014, 08, 06, 15, 00, 00), 107],
            [Date.UTC(2014, 08, 06, 16, 00, 00), 85],
            [Date.UTC(2014, 08, 06, 17, 00, 00), 100],
            [Date.UTC(2014, 08, 06, 18, 00, 00), 105],
            [Date.UTC(2014, 08, 06, 19, 00, 00), 106],
            [Date.UTC(2014, 08, 06, 20, 00, 00), 100],
            [Date.UTC(2014, 08, 06, 21, 00, 00), 109],
            [Date.UTC(2014, 08, 06, 22, 00, 00), 96],
            [Date.UTC(2014, 08, 06, 23, 00, 00), 109]
        ]
    }
}
//安全指数
function GetSafeData() {
    return [{
        title: '安全指数',
        containerCSS: 'kbh-content kbh-safe',
        contentCSS: '',
        titleCSS: 'kbh-title',
        iconCSS: 'nt_icon ntiword',
        lineColor:"#ffffff",
        columnbg: "#1abebe",
        chartType: 1,
       
        data: [[Date.UTC(2014, 08, 04, 00, 00, 00), 22.2], [Date.UTC(2014, 08, 04, 00, 10, 00), 24], [Date.UTC(2014, 08, 04, 00, 20, 00), 26], [Date.UTC(2014, 08, 04, 00, 30, 00), 28], [Date.UTC(2014, 08, 04, 00, 40, 00), 30], [Date.UTC(2014, 08, 04, 00, 50, 00), 32], [Date.UTC(2014, 08, 04, 01, 00, 00), 77.8], [Date.UTC(2014, 08, 04, 01, 10, 00), 75.8], [Date.UTC(2014, 08, 04, 01, 20, 00), 73.8], [Date.UTC(2014, 08, 04, 01, 30, 00), 70.8], [Date.UTC(2014, 08, 04, 01, 40, 00), 78.8], [Date.UTC(2014, 08, 04, 01, 50, 00), 80.8], [Date.UTC(2014, 08, 04, 02, 00, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 02, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 02, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 02, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 03, 00, 00), 12.2], [Date.UTC(2014, 08, 04, 03, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 03, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 03, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 03, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 03, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 04, 00, 00), 57.8], [Date.UTC(2014, 08, 04, 04, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 04, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 04, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 04, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 04, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 05, 00, 00), 37.8]]
    },
    {
        title: '安全热词',
        containerCSS: 'kbh-content nt_hotword_safe',
        contentCSS: 'forum-hot',
        titleCSS: 'kbh-title',
        iconCSS: 'nt_icon ntiword',
        chartType: 2,
        data: ['人身安全', '财产安全', '公共安全', '交通事故', '食品安全', '网络安全', '信息安全', '抓捕归案', '打砸抢', '安全保障', '安全生产', '犯罪分子', '安全隐患']
    }];
}
//交通指数
function GetTrafficData() {
    return [
    {
        title: '交通热词',
        containerCSS: 'kbh-content nt_hotword_tra',
        contentCSS: 'forum-hot',
        titleCSS: 'kbh-title',
        iconCSS: 'nt_icon ntiword',
        chartType: 2,
        data: ['交通违章', '智慧交通', '智能化', '交通拥堵', '逃逸', '交通管制', '追尾', '完善体系', '交通建设', '交通缓解 ', '低碳交通', '互换通行', '交通规划', '运输体系']
    },{
        title: '交通指数',
        containerCSS: 'kbh-content kbh-traffic',
        contentCSS: '',
        titleCSS: 'kbh-title',
        iconCSS: 'nt_icon ntiline',
        lineColor: "#ffffff",
        columnbg: "#27a5e4",
        chartType: 1,
        data: [[Date.UTC(2014, 08, 04, 00, 00, 00), 22.2], [Date.UTC(2014, 08, 04, 00, 10, 00), 24], [Date.UTC(2014, 08, 04, 00, 20, 00), 26], [Date.UTC(2014, 08, 04, 00, 30, 00), 28], [Date.UTC(2014, 08, 04, 00, 40, 00), 30], [Date.UTC(2014, 08, 04, 00, 50, 00), 32], [Date.UTC(2014, 08, 04, 01, 00, 00), 77.8], [Date.UTC(2014, 08, 04, 01, 10, 00), 75.8], [Date.UTC(2014, 08, 04, 01, 20, 00), 73.8], [Date.UTC(2014, 08, 04, 01, 30, 00), 70.8], [Date.UTC(2014, 08, 04, 01, 40, 00), 78.8], [Date.UTC(2014, 08, 04, 01, 50, 00), 80.8], [Date.UTC(2014, 08, 04, 02, 00, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 02, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 02, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 02, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 03, 00, 00), 12.2], [Date.UTC(2014, 08, 04, 03, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 03, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 03, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 03, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 03, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 04, 00, 00), 57.8], [Date.UTC(2014, 08, 04, 04, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 04, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 04, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 04, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 04, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 05, 00, 00), 37.8]]
    }];
}
//环保指数
function GetEnvironmentData()
{
    return [{
        title: '环保指数',
        containerCSS: 'kbh-content kbh-hbzs',
        contentCSS: '',
        titleCSS: 'kbh-title',
        iconCSS: 'nt_icon ntiline',
        lineColor: "#ffffff",
        columnbg: "#38c7ff",
        chartType: 1,
        data: [[Date.UTC(2014, 08, 04, 00, 00, 00), 22.2], [Date.UTC(2014, 08, 04, 00, 10, 00), 24], [Date.UTC(2014, 08, 04, 00, 20, 00), 26], [Date.UTC(2014, 08, 04, 00, 30, 00), 28], [Date.UTC(2014, 08, 04, 00, 40, 00), 30], [Date.UTC(2014, 08, 04, 00, 50, 00), 32], [Date.UTC(2014, 08, 04, 01, 00, 00), 77.8], [Date.UTC(2014, 08, 04, 01, 10, 00), 75.8], [Date.UTC(2014, 08, 04, 01, 20, 00), 73.8], [Date.UTC(2014, 08, 04, 01, 30, 00), 70.8], [Date.UTC(2014, 08, 04, 01, 40, 00), 78.8], [Date.UTC(2014, 08, 04, 01, 50, 00), 80.8], [Date.UTC(2014, 08, 04, 02, 00, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 02, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 02, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 02, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 03, 00, 00), 12.2], [Date.UTC(2014, 08, 04, 03, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 03, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 03, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 03, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 03, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 04, 00, 00), 57.8], [Date.UTC(2014, 08, 04, 04, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 04, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 04, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 04, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 04, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 05, 00, 00), 37.8]]
    },
   {
       title: '环保热词',
       containerCSS: 'kbh-content nt_hotword_hb',
       contentCSS: 'forum-hot',
       titleCSS: 'kbh-title',
       iconCSS: 'nt_icon ntiword',
       chartType: 2,
       data: ['绿色环保', '排放达标', '空气质量', 'PM2.5', '水污染', '雾霾', '清洁能源', '节能减排', '可持续发展', '退耕还林', '天气异常', '公众环境', '环境问题']
   }];
}
//城建指数
function GetCityBuildData() {
    return [{
       title: '城建热词',
       containerCSS: 'kbh-content nt_hotword_cj',
       contentCSS: 'forum-hot',
       titleCSS: 'kbh-title',
       iconCSS: 'nt_icon ntiword',
       chartType: 2,
       data: ['智慧城市', '拆迁安置', '小产权', '暴力执法', '城镇化', '违建', '市容市貌', '配套设施', '强拆', '扩建', '城市布局', '文明城市', '私搭乱建', '脏乱差']
    }, {
        title: '城建指数',
        containerCSS: 'kbh-content nt_cj',
        contentCSS: '',
        titleCSS: 'kbh-title',
        iconCSS: 'nt_icon ntiline',
        lineColor: "#ffffff",
        columnbg: "#2cb8ff",
        chartType: 1,
        data: [[Date.UTC(2014, 08, 04, 00, 00, 00), 22.2], [Date.UTC(2014, 08, 04, 00, 10, 00), 24], [Date.UTC(2014, 08, 04, 00, 20, 00), 26], [Date.UTC(2014, 08, 04, 00, 30, 00), 28], [Date.UTC(2014, 08, 04, 00, 40, 00), 30], [Date.UTC(2014, 08, 04, 00, 50, 00), 32], [Date.UTC(2014, 08, 04, 01, 00, 00), 77.8], [Date.UTC(2014, 08, 04, 01, 10, 00), 75.8], [Date.UTC(2014, 08, 04, 01, 20, 00), 73.8], [Date.UTC(2014, 08, 04, 01, 30, 00), 70.8], [Date.UTC(2014, 08, 04, 01, 40, 00), 78.8], [Date.UTC(2014, 08, 04, 01, 50, 00), 80.8], [Date.UTC(2014, 08, 04, 02, 00, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 02, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 02, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 02, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 03, 00, 00), 12.2], [Date.UTC(2014, 08, 04, 03, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 03, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 03, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 03, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 03, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 04, 00, 00), 57.8], [Date.UTC(2014, 08, 04, 04, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 04, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 04, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 04, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 04, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 05, 00, 00), 37.8]]
    }];
}
//城管指数
function GetCityManagData() {
    return [{
        title: '城市管理综合指数图',
        containerCSS: 'kbh-content kbh-cityManage',
        contentCSS: '',
        titleCSS: 'kbh-title',
        iconCSS: 'nt_icon ntiline',
        lineColor: "#ffffff",
        chartType: "1a",
        data: [[Date.UTC(2014, 08, 04, 00, 00, 00), 22.2], [Date.UTC(2014, 08, 04, 00, 10, 00), 24], [Date.UTC(2014, 08, 04, 00, 20, 00), 26], [Date.UTC(2014, 08, 04, 00, 30, 00), 28], [Date.UTC(2014, 08, 04, 00, 40, 00), 30], [Date.UTC(2014, 08, 04, 00, 50, 00), 32], [Date.UTC(2014, 08, 04, 01, 00, 00), 77.8], [Date.UTC(2014, 08, 04, 01, 10, 00), 75.8], [Date.UTC(2014, 08, 04, 01, 20, 00), 73.8], [Date.UTC(2014, 08, 04, 01, 30, 00), 70.8], [Date.UTC(2014, 08, 04, 01, 40, 00), 78.8], [Date.UTC(2014, 08, 04, 01, 50, 00), 80.8], [Date.UTC(2014, 08, 04, 02, 00, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 02, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 02, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 02, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 03, 00, 00), 12.2], [Date.UTC(2014, 08, 04, 03, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 03, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 03, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 03, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 03, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 04, 00, 00), 57.8], [Date.UTC(2014, 08, 04, 04, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 04, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 04, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 04, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 04, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 05, 00, 00), 37.8]]
    }];
}
//新闻监听
function GetNewsData()
{
  return[  {
        title: '新闻监听(负面汇总)',
        containerCSS: 'top-right-news nt_news',
        titleTop: true,
        contentCSS: 'four-content',
        titleCSS: 'right-news-title',
        iconCSS: 'nt_icon ntilist',
        data: [
                   { "news_title": "洪泽海门市区解放路一店铺发生火灾 未造成人员伤亡", "news_url": "http://www.ntjoy.com/news/hm/2014/06/2014-06-19329999.html", "report_date": "2014-06-19" },
                   { "news_title": "洪泽江海大道黄海路口两辆运煤车追尾 一安徽司机被卡驾驶室", "news_url": "http://www.ntjoy.com/news/tckx/2014/06/2014-06-19330000.html", "report_date": "2014-06-19" },
                   { "news_title": "洪泽政府性债务用于公益项目", "news_url": "http://news.hexun.com/2014-06-19/165835685.html", "report_date": "2014-06-19" },
                   { "news_title": "洪泽食品安全追溯系统上线", "news_url": "http://news.163.com/14/0619/06/9V37KOVB00014AED.html", "report_date": "2014-06-19" },
                   { "news_title": "洪泽动迁户可跨区自选房源", "news_url": "http://www.ntjoy.com/news/hm/2014/06/2014-06-19329999.html", "report_date": "2014-06-19" },
                   { "news_title": "洪泽中考成绩25日晚公布", "news_url": "http://www.zgnt.net/content/2014-06/19/content_2318346.htm", "report_date": "2014-06-19" },
                   { "news_title": "洪泽市安监局突击检查如东化工企业安全生产情况", "news_url": "http://www.ntjoy.com/news/rd/2014/06/2014-06-19330002.html", "report_date": "2014-06-19" },
                   { "news_title": "洪泽开展安全整改专项行动 涉及20个重点行业", "news_url": "http://www.zgnt.net/content/2014-06/19/content_2318343.htm", "report_date": "2014-06-19" },
                   { "news_title": "洪泽市政府党组召开专题民主生活会 以转变作风解决问题的实际成效取信于民", "news_url": "http://www.zgnt.net/content/2014-06/19/content_2318320.htm", "report_date": "2014-06-19" },
                   { "news_title": "被害人亲属生活困难 洪泽中院发放司法救助金", "news_url": "http://www.zgnt.net/content/2014-06/19/content_2318375.htm", "report_date": "2014-06-19" }
        ]
    }]
}
//民生综合指数
function GetPeopleData() {
    return [{
        title: '民生综合指数',
        containerCSS: 'kbh-content kbh-people',
        contentCSS: '',
        titleCSS: 'kbh-title',
        iconCSS: 'nt_icon ntiline',
        lineColor: "#ffffff",
        columnbg: "#2572eb",
        chartType: 1,
        data: [[Date.UTC(2014, 08, 04, 00, 00, 00), 22.2], [Date.UTC(2014, 08, 04, 00, 10, 00), 24], [Date.UTC(2014, 08, 04, 00, 20, 00), 26], [Date.UTC(2014, 08, 04, 00, 30, 00), 28], [Date.UTC(2014, 08, 04, 00, 40, 00), 30], [Date.UTC(2014, 08, 04, 00, 50, 00), 32], [Date.UTC(2014, 08, 04, 01, 00, 00), 77.8], [Date.UTC(2014, 08, 04, 01, 10, 00), 75.8], [Date.UTC(2014, 08, 04, 01, 20, 00), 73.8], [Date.UTC(2014, 08, 04, 01, 30, 00), 70.8], [Date.UTC(2014, 08, 04, 01, 40, 00), 78.8], [Date.UTC(2014, 08, 04, 01, 50, 00), 80.8], [Date.UTC(2014, 08, 04, 02, 00, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 02, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 02, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 02, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 03, 00, 00), 12.2], [Date.UTC(2014, 08, 04, 03, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 03, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 03, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 03, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 03, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 04, 00, 00), 57.8], [Date.UTC(2014, 08, 04, 04, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 04, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 04, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 04, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 04, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 05, 00, 00), 37.8]]
    }];
}
//微博监听
function GetWeiboData()
{
  return[  {
        title: '微博监听（负面汇总）',
        containerCSS: 'top-right-four',
        titleTop: true,
        contentCSS: 'four-content',
        titleCSS: 'four-title',
        iconCSS: 'nt_icon ntilist',
        chartType: 5,
        liCss: 'fl-content',
        data: [
                   { "news_title": "1洪泽海门市区解放路一店铺发生火灾 未造成人员伤亡", "news_url": "http://www.ntjoy.com/news/hm/2014/06/2014-06-19329999.html", "report_date": "2014-06-19" },
                   { "news_title": "2洪泽江海大道黄海路口两辆运煤车追尾 一安徽司机被卡驾驶室", "news_url": "http://www.ntjoy.com/news/tckx/2014/06/2014-06-19330000.html", "report_date": "2014-06-19" },
                   { "news_title": "3洪泽政府性债务用于公益项目", "news_url": "http://news.hexun.com/2014-06-19/165835685.html", "report_date": "2014-06-19" },
                   { "news_title": "4洪泽食品安全追溯系统上线", "news_url": "http://news.163.com/14/0619/06/9V37KOVB00014AED.html", "report_date": "2014-06-19" },
                   { "news_title": "5洪泽动迁户可跨区自选房源", "news_url": "http://www.ntjoy.com/news/hm/2014/06/2014-06-19329999.html", "report_date": "2014-06-19" },
                   { "news_title": "6洪泽中考成绩25日晚公布", "news_url": "http://www.zgnt.net/content/2014-06/19/content_2318346.htm", "report_date": "2014-06-19" },
                   { "news_title": "7洪泽市安监局突击检查如东化工企业安全生产情况", "news_url": "http://www.ntjoy.com/news/rd/2014/06/2014-06-19330002.html", "report_date": "2014-06-19" },
                   { "news_title": "8洪泽开展安全整改专项行动 涉及20个重点行业", "news_url": "http://www.zgnt.net/content/2014-06/19/content_2318343.htm", "report_date": "2014-06-19" },
                   { "news_title": "9洪泽市政府党组召开专题民主生活会 以转变作风解决问题的实际成效取信于民", "news_url": "http://www.zgnt.net/content/2014-06/19/content_2318320.htm", "report_date": "2014-06-19" },
                   { "news_title": "10被害人亲属生活困难 洪泽中院发放司法救助金", "news_url": "http://www.zgnt.net/content/2014-06/19/content_2318375.htm", "report_date": "2014-06-19" }
        ]
    }]
}

//工业指数
function GetIndustryData() {
    return [
        {
            title: '工业热词',
            containerCSS: 'kbh-content nt_hotword_gy',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: ['工业化 ', '工业转型', '高产能', '产业升级', '低投入', '高附加值', '增长', '低污染', '集中治理', '污水处理', '新型工业', '技术落后', '查封整顿']
        },
        {
        title: '工业指数',
        containerCSS: 'kbh-content nt_gy',
        contentCSS: '',
        titleCSS: 'kbh-title',
        iconCSS: 'nt_icon ntiline',
        lineColor: "#ffffff",
        columnbg: "#01a5a5",
        chartType: 1,

        data: [[Date.UTC(2014, 08, 04, 00, 00, 00), 22.2], [Date.UTC(2014, 08, 04, 00, 10, 00), 24], [Date.UTC(2014, 08, 04, 00, 20, 00), 26], [Date.UTC(2014, 08, 04, 00, 30, 00), 28], [Date.UTC(2014, 08, 04, 00, 40, 00), 30], [Date.UTC(2014, 08, 04, 00, 50, 00), 32], [Date.UTC(2014, 08, 04, 01, 00, 00), 77.8], [Date.UTC(2014, 08, 04, 01, 10, 00), 75.8], [Date.UTC(2014, 08, 04, 01, 20, 00), 73.8], [Date.UTC(2014, 08, 04, 01, 30, 00), 70.8], [Date.UTC(2014, 08, 04, 01, 40, 00), 78.8], [Date.UTC(2014, 08, 04, 01, 50, 00), 80.8], [Date.UTC(2014, 08, 04, 02, 00, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 02, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 02, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 02, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 03, 00, 00), 12.2], [Date.UTC(2014, 08, 04, 03, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 03, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 03, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 03, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 03, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 04, 00, 00), 57.8], [Date.UTC(2014, 08, 04, 04, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 04, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 04, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 04, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 04, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 05, 00, 00), 37.8]]
    }]
    
}
//农业指数
function GetAgricultureData() {
    return [
        {
            title: '农业指数',
            containerCSS: 'kbh-content kbh-agriculture',
            contentCSS: '',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiline',
            lineColor: "#ffffff",
            columnbg: "#1faeff",
            chartType: 1,
            data: [[Date.UTC(2014, 08, 04, 00, 00, 00), 22.2], [Date.UTC(2014, 08, 04, 00, 10, 00), 24], [Date.UTC(2014, 08, 04, 00, 20, 00), 26], [Date.UTC(2014, 08, 04, 00, 30, 00), 28], [Date.UTC(2014, 08, 04, 00, 40, 00), 30], [Date.UTC(2014, 08, 04, 00, 50, 00), 32], [Date.UTC(2014, 08, 04, 01, 00, 00), 77.8], [Date.UTC(2014, 08, 04, 01, 10, 00), 75.8], [Date.UTC(2014, 08, 04, 01, 20, 00), 73.8], [Date.UTC(2014, 08, 04, 01, 30, 00), 70.8], [Date.UTC(2014, 08, 04, 01, 40, 00), 78.8], [Date.UTC(2014, 08, 04, 01, 50, 00), 80.8], [Date.UTC(2014, 08, 04, 02, 00, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 02, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 02, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 02, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 03, 00, 00), 12.2], [Date.UTC(2014, 08, 04, 03, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 03, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 03, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 03, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 03, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 04, 00, 00), 57.8], [Date.UTC(2014, 08, 04, 04, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 04, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 04, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 04, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 04, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 05, 00, 00), 37.8]]
        },
    {
        title: '农业热词',
        containerCSS: 'kbh-content nt_hotword_eco',
        contentCSS: 'forum-hot',
        titleCSS: 'kbh-title',
        iconCSS: 'nt_icon ntiword',
        chartType: 2,
        data: ['新型农业', '有机农业', '土地治理', '全托管', '环保', '无公害', '有机', '现代农业', '绿色', '沙漠化 ', '旱涝灾害', '污染', '重金属', '运输体系']
    }];
}
//商业指数
function GetBusinessData() {
    return [
    {
        title: '商业热词',
        containerCSS: 'kbh-content nt_hotword_bui',
        contentCSS: 'forum-hot',
        titleCSS: 'kbh-title',
        iconCSS: 'nt_icon ntiword',
        chartType: 2,
        data: ['核心商业', '物价上涨', '商业格局', '价格战', '商业规模', '商业地产', '炒作', '商业模式', '商业步行街', '多元化 ', '一体化', '商业中心', '商业诈骗', '崩盘']
    }, {
        title: '商业指数',
        containerCSS: 'kbh-content kbh-business',
        contentCSS: '',
        titleCSS: 'kbh-title',
        iconCSS: 'nt_icon ntiline',
        lineColor: "#ffffff",
        columnbg: "#7301ad",
        chartType: 1,
        data: [[Date.UTC(2014, 08, 04, 00, 00, 00), 22.2], [Date.UTC(2014, 08, 04, 00, 10, 00), 24], [Date.UTC(2014, 08, 04, 00, 20, 00), 26], [Date.UTC(2014, 08, 04, 00, 30, 00), 28], [Date.UTC(2014, 08, 04, 00, 40, 00), 30], [Date.UTC(2014, 08, 04, 00, 50, 00), 32], [Date.UTC(2014, 08, 04, 01, 00, 00), 77.8], [Date.UTC(2014, 08, 04, 01, 10, 00), 75.8], [Date.UTC(2014, 08, 04, 01, 20, 00), 73.8], [Date.UTC(2014, 08, 04, 01, 30, 00), 70.8], [Date.UTC(2014, 08, 04, 01, 40, 00), 78.8], [Date.UTC(2014, 08, 04, 01, 50, 00), 80.8], [Date.UTC(2014, 08, 04, 02, 00, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 02, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 02, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 02, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 03, 00, 00), 12.2], [Date.UTC(2014, 08, 04, 03, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 03, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 03, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 03, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 03, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 04, 00, 00), 57.8], [Date.UTC(2014, 08, 04, 04, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 04, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 04, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 04, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 04, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 05, 00, 00), 37.8]]
    }];
}
//旅游指数
function GetTravelData() {
    return [
     {
        title: '旅游指数',
        containerCSS: 'kbh-content nt_travel',
        contentCSS: '',
        titleCSS: 'kbh-title',
        iconCSS: 'nt_icon ntiline',
        topColor: "#518809",
        bottomColor: "#79ad13",
        chartType: "1b",
        data: [[Date.UTC(2014, 08, 04, 00, 00, 00), 22.2], [Date.UTC(2014, 08, 04, 00, 10, 00), 24], [Date.UTC(2014, 08, 04, 00, 20, 00), 26], [Date.UTC(2014, 08, 04, 00, 30, 00), 28], [Date.UTC(2014, 08, 04, 00, 40, 00), 30], [Date.UTC(2014, 08, 04, 00, 50, 00), 32], [Date.UTC(2014, 08, 04, 01, 00, 00), 77.8], [Date.UTC(2014, 08, 04, 01, 10, 00), 75.8], [Date.UTC(2014, 08, 04, 01, 20, 00), 73.8], [Date.UTC(2014, 08, 04, 01, 30, 00), 70.8], [Date.UTC(2014, 08, 04, 01, 40, 00), 78.8], [Date.UTC(2014, 08, 04, 01, 50, 00), 80.8], [Date.UTC(2014, 08, 04, 02, 00, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 02, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 02, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 02, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 03, 00, 00), 12.2], [Date.UTC(2014, 08, 04, 03, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 03, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 03, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 03, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 03, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 04, 00, 00), 57.8], [Date.UTC(2014, 08, 04, 04, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 04, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 04, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 04, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 04, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 05, 00, 00), 37.8]]
     },
     {
         title: '旅游热词',
         containerCSS: 'kbh-content nt_hotword_travel',
         contentCSS: 'forum-hot',
         titleCSS: 'kbh-title',
         iconCSS: 'nt_icon ntiword',
         chartType: 2,
         data: ['免费开放', '旅游风情展', '交通便利', '旅游专线', '历史遗迹', '自然景观', '停车难', '人满为患', '一日游', '住宿难 ', '假导游', '门票贵', '亲子游 ', '逃票']
     }
    ];
}
//经济综合指数
function GetEconomyData() {
    return [{
        title: '民生综合指数',
        containerCSS: 'kbh-content kbh-people',
        contentCSS: '',
        titleCSS: 'kbh-title',
        iconCSS: 'nt_icon ntiline',
        topColor: "#2f7ed8",
        bottomColor: "#1396bf",
        chartType: "1b",
        data: [[Date.UTC(2014, 08, 04, 00, 00, 00), 22.2], [Date.UTC(2014, 08, 04, 00, 10, 00), 24], [Date.UTC(2014, 08, 04, 00, 20, 00), 26], [Date.UTC(2014, 08, 04, 00, 30, 00), 28], [Date.UTC(2014, 08, 04, 00, 40, 00), 30], [Date.UTC(2014, 08, 04, 00, 50, 00), 32], [Date.UTC(2014, 08, 04, 01, 00, 00), 77.8], [Date.UTC(2014, 08, 04, 01, 10, 00), 75.8], [Date.UTC(2014, 08, 04, 01, 20, 00), 73.8], [Date.UTC(2014, 08, 04, 01, 30, 00), 70.8], [Date.UTC(2014, 08, 04, 01, 40, 00), 78.8], [Date.UTC(2014, 08, 04, 01, 50, 00), 80.8], [Date.UTC(2014, 08, 04, 02, 00, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 02, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 02, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 02, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 03, 00, 00), 12.2], [Date.UTC(2014, 08, 04, 03, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 03, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 03, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 03, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 03, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 04, 00, 00), 57.8], [Date.UTC(2014, 08, 04, 04, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 04, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 04, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 04, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 04, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 05, 00, 00), 37.8]]
    }];
}