/// <reference path="base.js" />
/// <reference path="../iChart.js" />
$(function () {
    var city = window.global.UserInfo.CustomerName||'南通';//'南通'
    GetSetimentAttentionLine(city);
});
function GetSetimentAttentionLine(city)
{
    var chartHeight = $("#sentimentAttention").parent().height()-40;
    var config = {
        SentimentType: "舆情关注趋势",
        AttentionCount: 34,
        ChartData: []
            //[[Date.UTC(2014, 08, 04, 00, 00, 00), 105],
            //[Date.UTC(2014, 08, 04, 01, 00, 00), 95],
            //[Date.UTC(2014, 08, 04, 02, 00, 00), 103],
            //[Date.UTC(2014, 08, 04, 03, 00, 00), 101],
            //[Date.UTC(2014, 08, 04, 04, 00, 00), 97],
            //[Date.UTC(2014, 08, 04, 05, 00, 00), 92],
            //[Date.UTC(2014, 08, 04, 06, 00, 00), 105],
            //[Date.UTC(2014, 08, 04, 07, 00, 00), 85],
            //[Date.UTC(2014, 08, 04, 08, 00, 00), 120],
            //[Date.UTC(2014, 08, 04, 09, 00, 00), 105],
            //[Date.UTC(2014, 08, 04, 10, 00, 00), 85],
            //[Date.UTC(2014, 08, 04, 11, 00, 00), 119],
            //[Date.UTC(2014, 08, 04, 12, 00, 00), 105],
            //[Date.UTC(2014, 08, 04, 13, 00, 00), 95],
            //[Date.UTC(2014, 08, 04, 14, 00, 00), 110],
            //[Date.UTC(2014, 08, 04, 15, 00, 00), 107],
            //[Date.UTC(2014, 08, 04, 16, 00, 00), 85],
            //[Date.UTC(2014, 08, 04, 17, 00, 00), 100],
            //[Date.UTC(2014, 08, 04, 18, 00, 00), 105],
            //[Date.UTC(2014, 08, 04, 19, 00, 00), 106],
            //[Date.UTC(2014, 08, 04, 20, 00, 00), 100],
            //[Date.UTC(2014, 08, 04, 21, 00, 00), 109],
            //[Date.UTC(2014, 08, 04, 22, 00, 00), 96],
            //[Date.UTC(2014, 08, 04, 23, 00, 00), 109],
            //[Date.UTC(2014, 08, 05, 00, 00, 00), 105],
            //[Date.UTC(2014, 08, 05, 01, 00, 00), 95],
            //[Date.UTC(2014, 08, 05, 02, 00, 00), 115],
            //[Date.UTC(2014, 08, 05, 03, 00, 00), 101],
            //[Date.UTC(2014, 08, 05, 04, 00, 00), 85],
            //[Date.UTC(2014, 08, 05, 05, 00, 00), 92],
            //[Date.UTC(2014, 08, 05, 06, 00, 00), 105]]
    };

    var currentDate = new Date();
    var startDate = new Date(currentDate.setYear(currentDate.getFullYear() - 1));

    //当前日期减去365天
    window.baseTools.GetSentimentDay({
        query: {
            customer_name: city,
            start_date: formatDateType(currentDate,'day'),//'2014/01/01',
            end_date:formatDateType(new Date(),'day')//new Date()// '2014/12/31'
        }
    }, function (result) {
        if (result && result.success) {
            config.ChartData = result.data;

            var curDate = new Date();
            var nDate = new Date(curDate.setMonth(curDate.getMonth() - 1));
            var xAxis = +nDate;

            $("#sentimentAttention").reportChart({
                height: chartHeight, labelColor: "#9ea09f",
                splineColor: "#fc9d55", titleColor: "#333333",
                columnColor: "#f6e2ca", tootipYName: "关注度",
                xAxisMin:xAxis,
                data: config
            });
        }
    });

    //window.baseTools.GetSentimentAttentionLine({}, function (result) {
  //  $("#sentimentAttention").lineChart({ height: chartHeight, tootipYName: "关注度", data: ConfigInfo });
    //})
}