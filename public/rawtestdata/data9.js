//获取综合舆情指数
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
            [Date.UTC(2014, 08, 04, 12, 00, 00), 105],
            [Date.UTC(2014, 08, 04, 13, 00, 00), 95],
            [Date.UTC(2014, 08, 04, 14, 00, 00), 110],
            [Date.UTC(2014, 08, 04, 15, 00, 00), 107],
            [Date.UTC(2014, 08, 04, 16, 00, 00), 85],
            [Date.UTC(2014, 08, 04, 17, 00, 00), 100],
            [Date.UTC(2014, 08, 04, 18, 00, 00), 105],
            [Date.UTC(2014, 08, 04, 19, 00, 00), 106],
            [Date.UTC(2014, 08, 04, 20, 00, 00), 100],
            [Date.UTC(2014, 08, 04, 21, 00, 00), 109],
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

//新闻监听
function GetNewData() {
    return [
        {
            title: '新闻监听(负面汇总)',
            containerCSS: 'top-right-news nt_news',
            titleTop: false,
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
        },
        {
            title: '负面新闻按职能分布图',
            containerCSS: 'top-right-news',
            titleTop: false,
            contentCSS: 'four-content piechart',
            titleCSS: 'right-news-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 3,
            data: [['安全', 25],
                    ['交通', 25],
                    {
                        name: '环境',
                        y: 12.8,
                        sliced: true,
                        selected: true
                    },
                    ['经济', 17.2],
                    ['城建', 20],
            ]
        },
        {
            title: '负面新闻按月分布图',
            containerCSS: 'top-right-news',
            titleTop: false,
            contentCSS: 'four-content',
            titleCSS: 'right-news-title',
            iconCSS: 'nt_icon ntilist',
            columnbg: "#78ba00",
            chartType: 4,
            data: [23, 4, 6, 8, 10, 6, 29, 23, 32, 12, 11, 12]
        }
    ]
}
//综合热词
function GetwordChart() {
    return {
        title: '综合热词',
        contentCSS: 'three-content',
        titleCSS: 'three-title',
        cssData: ["zh_word1", "zh_word2", "zh_word3", "zh_word4", "zh_word5", "zh_word6", "zh_word7", "zh_word8", "zh_word9"],
        data: ['并入上海', '通货膨胀', '空气污染', '教育改革', '社会保障', '金融危机', '环境污染', '乘车安全', '阶梯水价', '孩子教育', '医疗改革', '食品安全', '非法集资', '低碳环保']
    }
}
//微博监听
function GetweiboData() {
    return [
        {
            title: '微博监听(负面汇总)',
            containerCSS: 'top-right-four',
            titleTop: false,
            contentCSS: 'four-content',
            titleCSS: 'four-title',
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
        },
        {
            title: '负面微博按职能分布图',
            containerCSS: 'top-right-four',
            titleTop: false,
            contentCSS: 'four-content piechart',
            titleCSS: 'four-title',
            iconCSS: 'nt_icon ntilist',
            chartType: 3,
            data: [['安全', 25],
                    ['交通', 25],
                    {
                        name: '环境',
                        y: 12.8,
                        sliced: true,
                        selected: true
                    },
                    ['经济', 17.2],
                    ['城建', 20],
            ]
        },
        {
            title: '负面微博按月分布图',
            containerCSS: 'top-right-four',
            titleTop: false,
            contentCSS: 'four-content',
            titleCSS: 'four-title',
            iconCSS: 'nt_icon ntilist',
            columnbg: "#a0f1fe",
            chartType: 4,
            data: [23, 4, 6, 8, 10, 6, 29, 23, 32, 12, 11, 12]
        }
    ]
}

//城市管理综合指数
function GetCityInformationData() {
    return [{
        title: '城市管理综合指数图',
        containerCSS: 'kbh-content kbh-cityManage',
        contentCSS: '',
        titleCSS: 'kbh-title',
        iconCSS: 'nt_icon ntiline',
        lineColor: "#ffffff",
        chartType: "1a",
        data: [[Date.UTC(2014, 08, 04, 00, 00, 00), 22.2], [Date.UTC(2014, 08, 04, 00, 10, 00), 24], [Date.UTC(2014, 08, 04, 00, 20, 00), 26], [Date.UTC(2014, 08, 04, 00, 30, 00), 28], [Date.UTC(2014, 08, 04, 00, 40, 00), 30], [Date.UTC(2014, 08, 04, 00, 50, 00), 32], [Date.UTC(2014, 08, 04, 01, 00, 00), 77.8], [Date.UTC(2014, 08, 04, 01, 10, 00), 75.8], [Date.UTC(2014, 08, 04, 01, 20, 00), 73.8], [Date.UTC(2014, 08, 04, 01, 30, 00), 70.8], [Date.UTC(2014, 08, 04, 01, 40, 00), 78.8], [Date.UTC(2014, 08, 04, 01, 50, 00), 80.8], [Date.UTC(2014, 08, 04, 02, 00, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 02, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 02, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 02, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 03, 00, 00), 12.2], [Date.UTC(2014, 08, 04, 03, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 03, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 03, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 03, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 03, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 04, 00, 00), 57.8], [Date.UTC(2014, 08, 04, 04, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 04, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 04, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 04, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 04, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 05, 00, 00), 37.8]]
    },
    {
        title: '安全指数',
        containerCSS: 'kbh-content kbh-safe',
        contentCSS: '',
        titleCSS: 'kbh-title',
        iconCSS: 'nt_icon ntiword',
        lineColor: "#ffffff",
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
    },
    {
        title: '交通热词',
        containerCSS: 'kbh-content nt_hotword_tra',
        contentCSS: 'forum-hot',
        titleCSS: 'kbh-title',
        iconCSS: 'nt_icon ntiword',
        chartType: 2,
        data: ['交通违章', '智慧交通', '智能化', '交通拥堵', '逃逸', '交通管制', '追尾', '完善体系', '交通建设', '交通缓解 ', '低碳交通', '互换通行', '交通规划', '运输体系']
    },
    {
        title: '交通指数',
        containerCSS: 'kbh-content kbh-traffic',
        contentCSS: '',
        titleCSS: 'kbh-title',
        iconCSS: 'nt_icon ntiline',
        lineColor: "#ffffff",
        columnbg: "#27a5e4",
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
    },
    {
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
    }, {
        title: '电力指数',
        containerCSS: 'kbh-content',
        contentCSS: '',
        titleCSS: 'kbh-title',
        iconCSS: 'nt_icon ntiline',
        lineColor: "#ffffff",
        columnbg: "rgb(44,184,255)",
        chartType: 1,
        data: [[Date.UTC(2014, 08, 04, 00, 00, 00), 22.2], [Date.UTC(2014, 08, 04, 00, 10, 00), 24], [Date.UTC(2014, 08, 04, 00, 20, 00), 26], [Date.UTC(2014, 08, 04, 00, 30, 00), 28], [Date.UTC(2014, 08, 04, 00, 40, 00), 30], [Date.UTC(2014, 08, 04, 00, 50, 00), 32], [Date.UTC(2014, 08, 04, 01, 00, 00), 77.8], [Date.UTC(2014, 08, 04, 01, 10, 00), 75.8], [Date.UTC(2014, 08, 04, 01, 20, 00), 73.8], [Date.UTC(2014, 08, 04, 01, 30, 00), 70.8], [Date.UTC(2014, 08, 04, 01, 40, 00), 78.8], [Date.UTC(2014, 08, 04, 01, 50, 00), 80.8], [Date.UTC(2014, 08, 04, 02, 00, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 02, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 02, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 02, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 03, 00, 00), 12.2], [Date.UTC(2014, 08, 04, 03, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 03, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 03, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 03, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 03, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 04, 00, 00), 57.8], [Date.UTC(2014, 08, 04, 04, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 04, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 04, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 04, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 04, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 05, 00, 00), 37.8]]
    }, {
        title: '水利指数',
        containerCSS: 'kbh-content',
        contentCSS: '',
        titleCSS: 'kbh-title',
        iconCSS: 'nt_icon ntiline',
        lineColor: "#ffffff",
        columnbg: "#139fe6",
        chartType: 1,
        data: [[Date.UTC(2014, 08, 04, 00, 00, 00), 22.2], [Date.UTC(2014, 08, 04, 00, 10, 00), 24], [Date.UTC(2014, 08, 04, 00, 20, 00), 26], [Date.UTC(2014, 08, 04, 00, 30, 00), 28], [Date.UTC(2014, 08, 04, 00, 40, 00), 30], [Date.UTC(2014, 08, 04, 00, 50, 00), 32], [Date.UTC(2014, 08, 04, 01, 00, 00), 77.8], [Date.UTC(2014, 08, 04, 01, 10, 00), 75.8], [Date.UTC(2014, 08, 04, 01, 20, 00), 73.8], [Date.UTC(2014, 08, 04, 01, 30, 00), 70.8], [Date.UTC(2014, 08, 04, 01, 40, 00), 78.8], [Date.UTC(2014, 08, 04, 01, 50, 00), 80.8], [Date.UTC(2014, 08, 04, 02, 00, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 02, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 02, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 02, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 03, 00, 00), 12.2], [Date.UTC(2014, 08, 04, 03, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 03, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 03, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 03, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 03, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 04, 00, 00), 57.8], [Date.UTC(2014, 08, 04, 04, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 04, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 04, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 04, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 04, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 05, 00, 00), 37.8]]
    }]
}

//民生综合指数
function GetPeopleInformationData() {
    return [
        {
            title: '民生综合指数',
            containerCSS: 'kbh-content kbh-people',
            contentCSS: '',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiline',
            lineColor: "#ffffff",
            columnbg: "#2572eb",
            chartType: 1,
            data: [[Date.UTC(2014, 08, 04, 00, 00, 00), 22.2], [Date.UTC(2014, 08, 04, 00, 10, 00), 24], [Date.UTC(2014, 08, 04, 00, 20, 00), 26], [Date.UTC(2014, 08, 04, 00, 30, 00), 28], [Date.UTC(2014, 08, 04, 00, 40, 00), 30], [Date.UTC(2014, 08, 04, 00, 50, 00), 32], [Date.UTC(2014, 08, 04, 01, 00, 00), 77.8], [Date.UTC(2014, 08, 04, 01, 10, 00), 75.8], [Date.UTC(2014, 08, 04, 01, 20, 00), 73.8], [Date.UTC(2014, 08, 04, 01, 30, 00), 70.8], [Date.UTC(2014, 08, 04, 01, 40, 00), 78.8], [Date.UTC(2014, 08, 04, 01, 50, 00), 80.8], [Date.UTC(2014, 08, 04, 02, 00, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 02, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 02, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 02, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 03, 00, 00), 12.2], [Date.UTC(2014, 08, 04, 03, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 03, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 03, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 03, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 03, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 04, 00, 00), 57.8], [Date.UTC(2014, 08, 04, 04, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 04, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 04, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 04, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 04, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 05, 00, 00), 37.8]]
        },
        {
            title: '教育热词',
            containerCSS: 'kbh-content nt_hotword_peo',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: ['高考改革', '就业难', '教育改革', '廉洁从教', '找工作难', '校车事故', '异地高考', '应试教育', '留学', '教育现代化', '高考志愿', '特色教育', '创业']
        },
        {
            title: '健康热词',
            containerCSS: 'kbh-content nt_hotword_peo1',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: ['医疗纠纷', '禁收红包', '医患关系', '医患矛盾', '专家号', '关爱健康', '医保补贴', '看病贵', '医闹事件', '号贩子', '长寿秘籍', '医疗改革', '医疗保险', "私自接诊"]
        },
        {
            title: '养老热词',
            containerCSS: 'kbh-content nt_hotword_peo',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: ['孤独', '以房养老', '失独家庭', '养老院', '赡养义务', '养老服务', '独居老人', '养老补助', '养老房产', '老年公寓', '养老改革', '以房养老', '孤寡', "养老金"]
        },
        {
            title: '文体热词',
            containerCSS: 'kbh-content nt_hotword_peo1',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: ['豪门中国赛', '噪音污染', '扭秧歌', '体育之乡', '晨练', '球迷', '足球赛', '电影', '拉拉队', '文艺团体', '歌唱比赛', '非物质文化', '篮球赛', "养老金"]
        }

    ]

}
//民生综合指数
function GetEconomicInformationData() {
    return [
        {
        title: '民生综合指数',
        containerCSS: 'kbh-content kbh-economic',
        contentCSS: '',
        titleCSS: 'kbh-title',
        iconCSS: 'nt_icon ntiline',
        topColor: "#2f7ed8",
        bottomColor: "#1396bf",
        chartType: "1b",
        data: [[Date.UTC(2014, 08, 04, 00, 00, 00), 22.2], [Date.UTC(2014, 08, 04, 00, 10, 00), 24], [Date.UTC(2014, 08, 04, 00, 20, 00), 26], [Date.UTC(2014, 08, 04, 00, 30, 00), 28], [Date.UTC(2014, 08, 04, 00, 40, 00), 30], [Date.UTC(2014, 08, 04, 00, 50, 00), 32], [Date.UTC(2014, 08, 04, 01, 00, 00), 77.8], [Date.UTC(2014, 08, 04, 01, 10, 00), 75.8], [Date.UTC(2014, 08, 04, 01, 20, 00), 73.8], [Date.UTC(2014, 08, 04, 01, 30, 00), 70.8], [Date.UTC(2014, 08, 04, 01, 40, 00), 78.8], [Date.UTC(2014, 08, 04, 01, 50, 00), 80.8], [Date.UTC(2014, 08, 04, 02, 00, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 02, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 02, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 02, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 03, 00, 00), 12.2], [Date.UTC(2014, 08, 04, 03, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 03, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 03, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 03, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 03, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 04, 00, 00), 57.8], [Date.UTC(2014, 08, 04, 04, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 04, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 04, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 04, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 04, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 05, 00, 00), 37.8]]
        },
        {
            title: '工业热词',
            containerCSS: 'kbh-content nt_hotword_gy',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: ['工业化 ', '旅游风情展', '交通便利', '旅游专线', '历史遗迹', '自然景观', '停车难', '人满为患', '一日游', '住宿难 ', '假导游', '门票贵', '亲子游 ', '逃票']
        }, {
            title: '工业指数',
            containerCSS: 'kbh-content nt_gy',
            contentCSS: '',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiline',
            lineColor: "#ffffff",
            columnbg: "#01a5a5",
            chartType: 1,
            data: [[Date.UTC(2014, 08, 04, 00, 00, 00), 22.2], [Date.UTC(2014, 08, 04, 00, 10, 00), 24], [Date.UTC(2014, 08, 04, 00, 20, 00), 26], [Date.UTC(2014, 08, 04, 00, 30, 00), 28], [Date.UTC(2014, 08, 04, 00, 40, 00), 30], [Date.UTC(2014, 08, 04, 00, 50, 00), 32], [Date.UTC(2014, 08, 04, 01, 00, 00), 77.8], [Date.UTC(2014, 08, 04, 01, 10, 00), 75.8], [Date.UTC(2014, 08, 04, 01, 20, 00), 73.8], [Date.UTC(2014, 08, 04, 01, 30, 00), 70.8], [Date.UTC(2014, 08, 04, 01, 40, 00), 78.8], [Date.UTC(2014, 08, 04, 01, 50, 00), 80.8], [Date.UTC(2014, 08, 04, 02, 00, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 02, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 02, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 02, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 03, 00, 00), 12.2], [Date.UTC(2014, 08, 04, 03, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 03, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 03, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 03, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 03, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 04, 00, 00), 57.8], [Date.UTC(2014, 08, 04, 04, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 04, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 04, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 04, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 04, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 05, 00, 00), 37.8]]
        }, {
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
            data: ['工业化 ', '旅游风情展', '交通便利', '旅游专线', '历史遗迹', '自然景观', '停车难', '人满为患', '一日游', '住宿难 ', '假导游', '门票贵', '亲子游 ', '逃票']
        },
        {
            title: '商业热词',
            containerCSS: 'kbh-content nt_hotword_bui',
            contentCSS: 'forum-hot',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiword',
            chartType: 2,
            data: ['核心商业', '物价上涨', '商业格局', '价格战', '商业规模', '商业地产', '炒作', '商业模式', '商业步行街', '多元化 ', '一体化', '商业中心', '商业诈骗', '崩盘']
        },
        {
            title: '商业指数',
            containerCSS: 'kbh-content kbh-business',
            contentCSS: '',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiline',
            lineColor: "#ffffff",
            columnbg: "#7301ad",
            chartType: 1,
            data: [[Date.UTC(2014, 08, 04, 00, 00, 00), 22.2], [Date.UTC(2014, 08, 04, 00, 10, 00), 24], [Date.UTC(2014, 08, 04, 00, 20, 00), 26], [Date.UTC(2014, 08, 04, 00, 30, 00), 28], [Date.UTC(2014, 08, 04, 00, 40, 00), 30], [Date.UTC(2014, 08, 04, 00, 50, 00), 32], [Date.UTC(2014, 08, 04, 01, 00, 00), 77.8], [Date.UTC(2014, 08, 04, 01, 10, 00), 75.8], [Date.UTC(2014, 08, 04, 01, 20, 00), 73.8], [Date.UTC(2014, 08, 04, 01, 30, 00), 70.8], [Date.UTC(2014, 08, 04, 01, 40, 00), 78.8], [Date.UTC(2014, 08, 04, 01, 50, 00), 80.8], [Date.UTC(2014, 08, 04, 02, 00, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 02, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 02, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 02, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 03, 00, 00), 12.2], [Date.UTC(2014, 08, 04, 03, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 03, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 03, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 03, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 03, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 04, 00, 00), 57.8], [Date.UTC(2014, 08, 04, 04, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 04, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 04, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 04, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 04, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 05, 00, 00), 37.8]]
        },
        {
            title: '金融指数',
            containerCSS: 'kbh-content',
            contentCSS: '',
            titleCSS: 'kbh-title',
            iconCSS: 'nt_icon ntiline',
            lineColor: "#ffffff",
            columnbg: "#139fe6",
            chartType: 1,
            data: [[Date.UTC(2014, 08, 04, 00, 00, 00), 22.2], [Date.UTC(2014, 08, 04, 00, 10, 00), 24], [Date.UTC(2014, 08, 04, 00, 20, 00), 26], [Date.UTC(2014, 08, 04, 00, 30, 00), 28], [Date.UTC(2014, 08, 04, 00, 40, 00), 30], [Date.UTC(2014, 08, 04, 00, 50, 00), 32], [Date.UTC(2014, 08, 04, 01, 00, 00), 77.8], [Date.UTC(2014, 08, 04, 01, 10, 00), 75.8], [Date.UTC(2014, 08, 04, 01, 20, 00), 73.8], [Date.UTC(2014, 08, 04, 01, 30, 00), 70.8], [Date.UTC(2014, 08, 04, 01, 40, 00), 78.8], [Date.UTC(2014, 08, 04, 01, 50, 00), 80.8], [Date.UTC(2014, 08, 04, 02, 00, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 02, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 02, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 02, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 02, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 03, 00, 00), 12.2], [Date.UTC(2014, 08, 04, 03, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 03, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 03, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 03, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 03, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 04, 00, 00), 57.8], [Date.UTC(2014, 08, 04, 04, 10, 00), 65.8], [Date.UTC(2014, 08, 04, 04, 20, 00), 60.8], [Date.UTC(2014, 08, 04, 04, 30, 00), 55.8], [Date.UTC(2014, 08, 04, 04, 40, 00), 67.8], [Date.UTC(2014, 08, 04, 04, 50, 00), 63.8], [Date.UTC(2014, 08, 04, 05, 00, 00), 37.8]]
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
    ]
}
//民生综合指数
function GetWeiboModelData() {
    return {
        containerCSS: 'media-body list-body',
        iconCSS: 'nt_icon ntilist',
        rowHeight:"65",
        data:[
{
    "id_pk": 1,
    "status_text": " DrMa_CrossFit微博达人：这家企业不错了，最低工资一直在飞涨，如果不合并岗位加长单岗位工作时间，光人工每年15%左右的上涨足以让企业关门大吉。大家都饿着了，这些本来该加班的员工不打点歪主意才怪//@深圳交警: #昆山中荣发生爆炸事故#【为何周末200人加班】爆炸已致65死120余伤，其官网显示有员工。 http://t.cn/RPJ768m ",
    "level": -1,
    "status_url": "http://s.weibo.com/weibo/%25E6%2598%2586%25E5%25B1%25B1%25E7%2588%2586%25E7%2582%25B8&Refer=STopic_box",
    "newsdate": "2014-08-02",
    "newsminute":"15:13:00",
    "reposts_count": 5,
    "comments_count": 7,
    "user_name": "昆山发布"
},
{
    "id_pk": 2,
    "status_text": " 平安anson微博个人认证 ：最近怎么啦，事故频发，那么多生命，祈福！现在在昆山的爱心人士可以到以下4个地点献血：①大润发爱心献血屋；②百盛广场爱心献血屋；③正阳桥采血车；④昆山市红十字会血站爱心献血屋。献血热线：0512-57575833/57385366 ",
    "level": -1,
    "status_url": "http://s.weibo.com/weibo/%25E6%2598%2586%25E5%25B1%25B1%25E7%2588%2586%25E7%2582%25B8&Refer=STopic_box",
    "newsdate": "2014-08-02",
    "newsminute": "15:13:00",
    "reposts_count": 15,
    "comments_count": 27,
    "user_name": "昆山发布"
},
{
    "id_pk": 3,
    "status_text": " 新浪江苏微博机构认证：【#昆山工厂爆炸# 事件回顾】65个鲜活的生命戛然而止，这一刻，我们与昆山在一起。加油，中国，江苏，昆山。共度难关。",
    "level": -1,
    "status_url": "http://s.weibo.com/weibo/%25E6%2598%2586%25E5%25B1%25B1%25E7%2588%2586%25E7%2582%25B8&Refer=STopic_box",
    "newsdate": "2014-08-02",
    "newsminute": "15:13:00",
    "reposts_count": 35,
    "comments_count": 27,
    "user_name": "昆山发布"
},
{
    "id_pk": 4,
    "status_text": " 山东商报微博机构认证：#昆山中荣工厂爆炸#【记者直击：昆山中医院已有4名伤员死亡[蜡烛]】记者从院方了解到，该院共接收了39名伤者，其中，4名伤者在途中已死亡。目前，已转移至他院24人，还剩11人留院治疗。据央视 ",
    "level": -1,
    "status_url": "http://s.weibo.com/weibo/%25E6%2598%2586%25E5%25B1%25B1%25E7%2588%2586%25E7%2582%25B8&Refer=STopic_box",
    "newsdate": "2014-08-02",
    "newsminute": "15:13:00",
    "reposts_count": 15,
    "comments_count": 57,
    "user_name": "昆山发布"
},
{
    "id_pk": 5,
    "status_text": " 新闻微记者微博个人认证 ：突发事件 快讯【昆山中荣金属爆炸已造成69人死亡】记者从院方了解到，该院共接收了39名伤者，其中，4名伤者在途中已死亡。目前，已转移至他院24人，还剩11人留院治疗。目前已造成69人死亡[蜡烛]中国网络资讯台昆山消息。 ",
    "level": -1,
    "status_url": "http://s.weibo.com/weibo/%25E6%2598%2586%25E5%25B1%25B1%25E7%2588%2586%25E7%2582%25B8&Refer=STopic_box",
    "newsdate": "2014-08-02",
    "newsminute": "15:13:00",
    "reposts_count": 25,
    "comments_count": 47,
    "user_name": "昆山发布"
},
{
    "id_pk": 6,
    "status_text": " 范大姐帮忙微博机构认证：#昆山中荣工厂爆炸#【65人死亡 上百人受伤】今早7时许，江苏昆山中荣金属制品有限公司发生爆炸。①当时共有200余人当班，目前死亡65人，现场死亡40多人，送医后伤重不治20多人；②昆山2家医院已收治上百名伤员；③上海瑞金医院派5名烧伤科专家赶赴现场；④该公司为美国通用汽车指定供应商。via央视新闻",
    "level": -1,
    "status_url": "http://s.weibo.com/weibo/%25E6%2598%2586%25E5%25B1%25B1%25E7%2588%2586%25E7%2582%25B8&Refer=STopic_box",
    "newsdate": "2014-08-02",
    "newsminute": "15:13:00",
    "reposts_count": 45,
    "comments_count": 27,
    "user_name": "昆山发布"
},
{
    "id_pk": 7,
    "status_text": " 无锡新周刊微博机构认证：昆山工厂爆炸事件中一批重伤员送到我市紧急救治，有意愿自愿献血的市民携带身份证到以下地点献血：①火车站南广场爱心献血屋;②崇安寺爱心献血屋;③新区新泰广场献血屋;④通扬路爱心献血屋。⑤南禅寺献血车；⑥中国银行献血车；⑦金太湖广场献血车；⑧大润发超市献血车；⑨万达广场献血车。 ",
    "level": -1,
    "status_url": "http://s.weibo.com/weibo/%25E6%2598%2586%25E5%25B1%25B1%25E7%2588%2586%25E7%2582%25B8&Refer=STopic_box",
    "newsdate": "2014-08-02",
    "newsminute": "15:13:00",
    "reposts_count": 15,
    "comments_count":37,
    "user_name": "昆山发布"
},
{
    "id_pk": 8,
    "status_text": " 读行者--刘东：【读行中国】昆山爆炸，我看到无数人在朋友圈里转发献血信息，呼吁为救护车让出生命通道，看到同事拍的排长龙的献血者。这注定是一个让我们最难忘的七夕节。让我们如此震惊悲痛，也让我们如此骄傲温暖。 ",
    "level": -1,
    "status_url": "http://s.weibo.com/weibo/%25E6%2598%2586%25E5%25B1%25B1%25E7%2588%2586%25E7%2582%25B8&Refer=STopic_box",
    "newsdate": "2014-08-02",
    "newsminute": "15:13:00",
    "reposts_count": 65,
    "comments_count": 47,
    "user_name": "昆山发布"
},
{
    "id_pk": 9,
    "status_text": " 骑猪猪_上高速微博达人：#昆山工厂爆炸#其中很多人今晚下班还相约去过七夕。可能很多人 刚刚成年 才出来打拼 可能很多人 家人还等着下班回去一起吃晚饭 今日七夕 愿逝者安息 天堂一路走好。又让我想起 后会无期 里的一句话 每一次告别,最好用力一点。多说一句,可能是最后一句。",
    "level": -1,
    "status_url": "http://s.weibo.com/weibo/%25E6%2598%2586%25E5%25B1%25B1%25E7%2588%2586%25E7%2582%25B8&Refer=STopic_box",
    "newsdate": "2014-08-02",
    "newsminute": "15:13:00",
    "reposts_count": 45,
    "comments_count": 67,
    "user_name": "昆山发布"
}]

    }

}
