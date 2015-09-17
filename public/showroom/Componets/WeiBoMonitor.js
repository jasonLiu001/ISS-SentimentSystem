define(function (require, exports, modules) {
    var base = require('/showroom/Componets/base');
    var startUTCTime1 = 0;
    var tpwidth;
    var viewModel = {
        weibos:ko.observableArray([])
    };
    function update() {
        $.getJSON("/showroom/api/getweibomonitor.js", function (data) {
            base.setData(viewModel.weibos, data);
        });
        wm_1();
        wm_2();
    }
    exports.load = function (id, par, callback) {
        animationMgr.moduleCount++;
        var amt = animationMgr.register("WeiBoMonitor" + animationMgr.moduleCount);
        base.applyBind(id, '/showroom/templates/WeiBoMonitor.html', viewModel, function (view) {
            tpwidth = $(view).width()-10;
            animationMgr.moduleCount++;
            $(view).attr("id", $(view).attr("id") + animationMgr.moduleCount)
            
            
            update();
            //滚动
            marqueeObj.append("ulweibojt", 32, 1500);
            marqueeObj.start();
            //翻转
            amt.active($(view).attr("id"), par);
             

            if (callback)
                callback();
            setInterval(update, base.timeout)
        });
    };

    function wm_1() {
        $('#wm_1').highcharts({
            chart: {
                width: tpwidth,
                height: base.getChartHeight(122),
                backgroundColor: '#05869a',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: true,
                spacingLeft: $(window).width() < 400 ? 0 : -50,
                spacingRight: 30
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            exporting: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0,
                itemStyle: {
                    color: "#ffffff"
                },
                itemMarginBottom: 0,
                labelFormatter: function () {
                    return this.name + " : " + this.percentage + "%";
                },
                reversed:true

            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: '百分百',
                data: [
                    ['安全', 44],
                    ['交通', 20],
                    {
                        name: '环境',
                        y: 26.6,
                        sliced: true,
                        selected: true
                    },
                    ['经济', 4],
                    ['城建', 5.4],
                ]
            }]
        });
    }

    function wm_2() {
        $('#wm_2').highcharts({
            chart: {
                type: 'column',
                width: tpwidth,
                height: base.getChartHeight(100),
                backgroundColor: '#05869a',
                marginRight: 20,

            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: [
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    '10',
                    '11',
                    '12'
                ],
                labels: {
                    style: {
                        color: '#FFFFFF',
                    }

                },
                lineColor: '#FFFFFF',
                lineWidth: 1,
                gridLineWidth: 0
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                },
                labels: {
                    style: {
                        color: '#FFFFFF',
                    }

                },
                gridLineWidth: 1,
                gridLineColor: '#FFFFFF',
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.1,
                    borderWidth: 0
                }
            },
            exporting: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            series: [{
                name: 'Tokyo',
                color: "#a0f1fe",
                data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 0, 0, 0, 0, 0, 0]

            }]
        });
    }
 

});