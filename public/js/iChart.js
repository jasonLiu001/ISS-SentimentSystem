/// <reference path="jquery.js" />

//全局设置
Highcharts.setOptions({
    global: {
        VMLRadialGradientURL: 'http://www.isoftstone.com'
        //useUTC:false
    },
    lang: {
        downloadJPEG: "导出JEPG图片",
        downloadPDF: "导出PDF图片",
        downloadPNG: "导出PNG图片",
        downloadSVG: "导出SVG矢量图片",
        noData: "暂无任何数据",
        rangeSelectorFrom: "",
        rangeSelectorTo: "",
        rangeSelectorZoom: "",
        shortMonths: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        //weekdays: ['1', '2', '3', '4', '5', '6', '7']
    }
});
//Chart配置
var HighChartConfig = {
    plotLines: [
         { color: 'gray', value: 120, width: 1 },
                           { color: 'gray', value: 110, width: 1 },
                           { color: 'gray', value: 100, width: 1 },
                           { color: 'gray', value: 90, width: 1 }
                            //{ color: '#46A3FF', value: 120, width: 2, dashStyle: "Dash" },
                            //{ color: '#C4E1FF', value: 110, width: 2, dashStyle: "Dash" },
                            //{ color: 'white', value: 100, width: 2, dashStyle: "Dash" },
                            //{ color: 'yellow', value: 90, width: 2, dashStyle: "Dash" }
    ],
    buttonTheme: {
        fill: 'none',
        style: {
            color: "none"
        },
        states: {
            hover: {
            },
            select: {
                fill: 'none',
                style: {
                    color: 'none'
                }
            }
        }
    },
    tooltipDefault: {
        formatter: function () {
            var s = '';
            // s += '<br/><b>' + Highcharts.dateFormat('%A %H:%M:%S', this.x) + '</b>'
            //$.each(this.points, function (i, point) {
            //    if (i == 0) {
            s += '指数值：<b>' + this.y + '</b>';
            //    }
            //});
            s += '<br/>' + Highcharts.dateFormat(' %Y年%m月%d日', this.x);
            return s;
        },
        borderWidth: 0,
        crosshairs: false
    },
    tooltipCustom: {
        formatter: function () {
            var s = '';
            // s += '<br/><b>' + Highcharts.dateFormat('%A %H:%M:%S', this.x) + '</b>'
            //$.each(this.points, function (i, point) {
            //    if (i == 0) {
            s += '指数值：<b>' + this.y + '</b>';
            //    }
            //});
            s += '<br/>' + Highcharts.dateFormat(' %Y年%m月%d日', this.x);
            return s;
        },
        backgroundColor: "#ce754b",
        style: {
            color: 'white'
        },
        crosshairs: false
    }

};

(function ($) {//作为插件，扩展方法，以便其他页面的jq元素调用。eg:  $("#hotwords").wordChart({ height: 135, data: ConfigInfo }).removeClass("loading");
    $.fn.extend({
        //用于综合舆情图表1  [index.html#public 10%]
        lineChart1: function (options) {
            var chart;
            //未来可以添加或者设置其他参数
            var defVal = {
                height: 100,
                showRange: true,
                showRandar: false,
                tootipYName: '指数值',
                labelColor: "white",
                splineColor: "white",
                titleColor: "white",
                columnColor: "#1e5bbc",
                tootipType: 0,
                xAxisMin: null,
                data: {}
            };
            var opts = $.extend({}, defVal, options);
            $this = $(this);
            if (opts.showRandar) {
                $this.addClass("yq_showRandar");
            }
            var tootipTemp = opts.tootipType == 0 ? HighChartConfig.tooltipDefault : HighChartConfig.tooltipCustom;

            $this.highcharts({
                chart: {
                    height: opts.height,
                    backgroundColor: 'none',
                    reflow: false
                },
                title: {
                    text: opts.data.SentimentType + " — " + opts.data.CityName,
                    align: 'left',
                    x: 20,
                    y: 30,
                    style: {
                        color: opts.titleColor,
                        fontSize: '30px'
                    },
                    userHTML: true
                },
                subtitle: {
                    align: 'right',
                    y: 52,
                    style: {
                        color: opts.labelColor
                    },
                    userHTML: true
                },
                //设置滚动条    
                scrollbar: {
                    enabled: true
                },
                yAxis: {
                    title: null,
                    opposite: false,
                    lineColor: opts.labelColor,
                    labels: {
                        style: {
                            color: opts.labelColor
                        }
                    },
                    gridLineColor: '#ffffff',
                    lineWidth: 1,
                    gridLineWidth: 0,
                    plotLines: HighChartConfig.plotLines,
                    tickInterval: 10,
                    min: 80,
                    max: 120
                },
                xAxis: {
                    type: 'datetime',
                    lineColor: opts.labelColor,
                    events: {
                        setExtremes: function () {
                            // $(".highcharts-button").hide();
                            // $(".highcharts-input-group").hide();
                            //if (e.rangeSelectorButton != undefined) {

                            //    var granularity = "day"
                            //    if (e.rangeSelectorButton.type == "minute") {
                            //        console.log(123);
                            //        granularity = "min"
                            //    }
                            //    if (opts.callback) {
                            //        opts.callback(granularity);
                            //    }
                            //}
                        }
                    },
                    labels: {
                        formatter: function () {
                            return Highcharts.dateFormat('%b/%d', this.value);
                        },
                        style: {
                            color: opts.labelColor
                        }
                    },
                    tickInterval: 3 * 24 * 3600 * 1000,
                    min: opts.xAxisMin

                },
                tooltip: tootipTemp,

                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        cursor: "pointer",
                        point: {
                            events: {
                                click: function () {
                                    // $('#myModal').modal();//弹出新闻
                                    //alert("x:" + this.x + ";y:" + this.y);
                                }
                            }
                        },
                        marker: {
                            radius: 4,
                            enabled: true
                        }
                    },
                    column: {
                        borderColor: null
                    }
                },
                series: [
                        {
                            type: 'spline',
                            color: opts.splineColor,
                            width: 1,
                            index: 2,
                            tooltip: {
                                valueDecimals: 2
                            }
                        },
                        {
                            type: 'column',
                            color: opts.columnColor,
                            tooltip: {
                                valueDecimals: 2
                            }
                        }
                ]
            });
            return $this.highcharts();
        },
        //用于综合舆情图表
        lineChart: function (options) {
            //未来可以添加或者设置其他参数
            var defVal = {
                height: 100,
                showRange: true,
                showRandar: false,
                timeOut: 1000 * 60 * 60 * 24,
                tootipYName: '指数值',
                callback: null,
                data: {}
            };
            var opts = $.extend({}, defVal, options);
            return this.each(function () {
                $this = $(this);
                var initData = opts.data.ChartData;

                if (opts.showRandar) {
                    $this.addClass("left-top-yq");
                }
                $this.highcharts('StockChart', {
                    //Chart属性很多 详见：http://www.hcharts.cn/api/highstock.php#chart
                    chart: {
                        events: {
                            load: function () {
                                var ser = this.series;
                                if (opts.callback) {
                                    opts.callback(ser); setInterval(function () {
                                        opts.callback(ser)
                                    }, opts.timeOut);
                                }
                                //var series = this.series[0];
                                //var series1 = this.series[1];
                                //setInterval(function () {
                                //    var newdata = opts.data.ChartData;
                                //    series.setData(newdata);
                                //    series1.setData(newdata);

                                //}, opts.timeOut)
                            },
                            click: function (e) {
                                //这里添加点击事件

                            }
                        },
                        height: opts.height,
                        backgroundColor: 'rgba(0,0,0,0)'
                    },
                    credits: {
                        enabled: false
                    },
                    navigator: {
                        height: 15,
                        margin: 0
                    },
                    rangeSelector: {
                        buttons: [{
                            type: 'day',
                            count: 1,
                            text: '天'
                        }, {
                            type: 'week',
                            count: 1,
                            text: '周'
                        }, {
                            type: 'month',
                            count: 1,
                            text: '月'
                        }, {
                            type: 'month',
                            count: 3,
                            text: '3月'
                        }, {
                            type: 'month',
                            count: 6,
                            text: '6月'
                        }, {
                            type: 'year',
                            count: 1,
                            text: '年'
                        }, {
                            type: 'all',
                            text: '全部'
                        }],
                        selected: 6,
                        inputDateFormat: '%Y年%b%e日',
                        inputBoxBorderColor: 'transparent',
                        inputStyle: {
                            color: 'gray'
                        },
                        labelStyle: {
                            color: 'white'
                        },
                        enabled: opts.showRange
                    },
                    title: {
                        text: opts.data.SentimentType,
                        align: 'left',
                        x: 20,
                        y: 30,
                        style: {
                            color: '#ffffff',
                            fontSize: '30px'
                        },
                        userHTML: true
                    },
                    subtitle: {
                        //  text: '<b style="font-size:18px;">' + opts.data.CityName + ' </b><i style="font-size:14px;">在刚刚过去的一分钟检测到了' + opts.data.AttentionCount + '次关注度。</i>',
                        align: 'right',
                        y: 52,
                        style: {
                            color: '#FFFFFF'
                        },
                        userHTML: true
                    },
                    yAxis: {
                        opposite: false,
                        labels: {
                            style: {
                                color: '#FFFFFF'
                            }
                        },
                        gridLineColor: '#ffffff',
                        lineWidth: 1,
                        gridLineWidth: 0,
                        plotLines: [
                            { color: 'green', value: 114, width: 2, dashStyle: "Dash" },
                             { color: 'yellow', value: 104, width: 2, dashStyle: "Dash" },
                              { color: 'red', value: 94, width: 2, dashStyle: "Dash" }
                        ]

                    },
                    xAxis: {
                        type: 'datetime',
                        lineColor: 'white',
                        labels: {
                            style: {
                                color: '#FFFFFF'
                            }
                        }
                    },
                    tooltip: {
                        formatter: function () {
                            var s = '<b>' + Highcharts.dateFormat(' %Y年%m月%d日', this.x) + '</b>';
                            s += '<br/><b>' + Highcharts.dateFormat('%A %H:%M:%S', this.x) + '</b>'
                            $.each(this.points, function (i, point) {
                                if (i == 0) {
                                    s += '<br/><b>' + opts.tootipYName + '</b>： ' + point.y;
                                }
                            });
                            return s;
                        },
                        crosshairs: false
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
                    plotOptions: {
                        series: {
                            cursor: "pointer",
                            point: {
                                events: {
                                    click: function () {
                                        $('#myModal').modal();
                                        //alert("x:" + this.x + ";y:" + this.y);
                                    }
                                }
                            },
                            marker: {
                                radius: 4,
                                enabled: true
                            }
                        }
                    },
                    series: [

                        {
                            name: 'AAPL',
                            type: 'spline',
                            color: '#FFFFFF',
                            width: 1,
                            data: initData,
                            index: 2,
                            pointStart: "123123",
                            tooltip: {
                                valueDecimals: 2
                            }
                        }, {
                            name: 'AAPL',
                            type: 'column',
                            color: opts.data.columnbg,
                            data: initData,
                            tooltip: {
                                valueDecimals: 2
                            }
                        }
                    ]
                });

            });
        },
        //用于饼状图表
        pieChart: function (options) {
            //未来可以添加或者设置其他参数
            var defVal = {
                height: 100,
                title: '',
                data: []
            };
            var opts = $.extend({}, defVal, options);

            $this = $(this);

            $this.highcharts({
                chart: {
                    backgroundColor: 'rgba(0,0,0,0)',
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: true
                    //spacingLeft: $(window).width() < 400 ? 0 : -50,
                    //spacingRight: 30
                },
                credits: {
                    enabled: false
                },
                colors: ["#0dc1c8", "#9ca033","#67e6c3", "#97d31c","#ed503b","#e08417","#d7dc44","#64a326","#4388d6","#9e31dd","#db59e7","#b4445c","#fe01a8","#77057b","#1e93e4","#93c2a0","#7bc7de","#e28e67","#fd8505"],
                title: {
                    text: opts.title
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: false,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true,
                        point: {
                            events: {
                                legendItemClick: function () {
                                    return false;
                                }
                            }
                        }
                    }
                },
                legend: {
                    x: 100,
                    layout: 'vertical',
                    align: 'left',
                    verticalAlign: 'middle',
                    borderWidth: 0,
                    itemStyle: {
                        color: "#333"
                    },
                    itemMarginBottom: 0,
                    labelFormatter: function () {
                        return this.name + " : " + this.percentage.toFixed(2) + "%";
                    },
                    itemStyle: {
                        cursor: 'default'
                    }

                },
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                series: [{
                    type: 'pie',
                    name: '百分比',
                    data: opts.data || []
                }]
            });
            return $this.highcharts();
        },
        //用于饼状图表数量
        pieChartNum: function (options) {
            //未来可以添加或者设置其他参数
            var defVal = {
                height: 100,
                title: '',
                data: []
            };
            var opts = $.extend({}, defVal, options);
            return this.each(function () {
                $this = $(this);

                $this.highcharts({
                    chart: {
                        backgroundColor: 'rgba(0,0,0,0)',
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: true
                        //spacingLeft: $(window).width() < 400 ? 0 : -50,
                        //spacingRight: 30
                    },
                    credits: {
                        enabled: false
                    },
                    colors: ["#93c2a0", "#e28e67", "#7bc7de","#97d31c"],
                    title: {
                        text: opts.title
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: false,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true,
                            point: {
                                events: {
                                    legendItemClick: function () {
                                        return false;
                                    }
                                }
                            }
                        }
                    },
                    legend: {
                        x: -50,
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0,
                        itemStyle: {
                            color: "#333"
                        },
                        itemMarginBottom: 0,
                        labelFormatter: function () {
                            return this.name + " : " + this.y + " | " + this.percentage.toFixed(2) + "%";
                        },
                        itemStyle: {
                            cursor: 'default'
                        }

                    },
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                        type: 'pie',
                        name: '百分比',
                        data: opts.data || []

                    }]
                });
            });
        },
        //用于翻转图表
        turnChart: function (options) {
            //未来可以添加或者设置其他参数
            var defVal = {
                height: 200,
                data: [],
                timeOut: 2000,
                titleAlign: "top",
                labelColor: "white",
                splineColor: "white",
                titleColor: "white",
                columnColor: "#1e5bbc"
            };
            var opts = $.extend({}, defVal, options);

            return this.each(function () {//eg: index.html#public
                $this = $(this);
                //console.log(' $this :',$this );//eg:#PeopleInformation 民生综合指数的外层div以便追内容。
                $this.empty();
                //console.log('turnChart:',opts.data);
                /**opts.data
                 * [chartType: 1columnColor: "#eebba4",containerCSS: "kbh-content kbh-people",contentCSS: "",
                 * data:[[14103936000001: 107],[14104800000001: 107]],iconCSS: "nt_icon ntiline",
                 * labelColor: "#9ea09f",lineType: "line",splineColor: "#ce754b",
                 * title: "民生综合指数",titleCSS: "kbh-title",titleColor: "white"]
                 * **/
                $.each(opts.data, function (ind, o) {//每次过来只有一条数据。index.html#public。。room9.js如新闻给出多个数据源头：GetNews(callback)
                    //console.log('t3',ind,o);//0 上面的：opts.data
                    /**非hightchars不需要这些设置**/
                    o.labelColor = (o.labelColor == null ? opts.labelColor : o.labelColor);
                    o.splineColor = (o.splineColor == null ? opts.splineColor : o.splineColor);
                    o.titleColor = (o.titleColor == null ? opts.titleColor : o.titleColor);
                    o.columnColor = (o.columnColor == null ? opts.columnColor : o.columnColor);
                    /**非hightchars不需要这些设置**/

                    opts.titleAlign = o.titleAlign == null ? opts.titleAlign : o.titleAlign;
                    var tempContainer = $("<div class='" + o.containerCSS + "'></div>");
                    var title = $("<div class='" + o.titleCSS + "'><i class='" + o.iconCSS + "'></i>" + o.title + "</div>");
                    var tempContent = $("<div class='" + o.contentCSS + " resizeChart'></div>");

                    if (o.titleTop == null || o.titleTop == true) {
                        // console.log('appendNull',tempContainer);
                        tempContainer.append(title);//标题在上，内容在下
                        tempContainer.append(tempContent);
                    } else {
                        //console.log('append',tempContainer);
                        tempContainer.append(tempContent);//标题在下，内容在上 room9.js:GetNews
                        tempContainer.append(title);
                    }
                    $this.append(tempContainer);
                    //曲线图(柱加线)  //eg: 城市管理综合指数 public.js     index.html#public
                    if (o.chartType == 1) {
                        tempContent.highcharts({
                            chart: {
                                //  zoomType: 'xy',
                                backgroundColor: 'rgba(0,0,0,0)',
                                marginRight: 20,
                                height: opts.height - 30
                            },
                            credits: {
                                enabled: false
                            },
                            legend: {
                                enabled: false
                            },
                            title: {
                                text: ""
                            },
                            xAxis: {
                                type: 'datetime',
                                labels: {
                                    formatter: function () {
                                        return Highcharts.dateFormat('%b/%d', this.value);
                                    },
                                    style: {
                                        color: o.labelColor,
                                        fontSize: '12px'
                                    }
                                },
                                dateTimeLabelFormats: {
                                    hour: '%H:%M'
                                },
                                lineColor: o.labelColor,
                                tickInterval: 24 * 3600 * 1000
                            },
                            yAxis: {
                                labels: {
                                    style: {
                                        color: o.labelColor,
                                        fontSize: '12px'
                                    }
                                },
                                title: {
                                    text: '',
                                    style: {
                                        fontWeight: 'normal',
                                        color: '#FFFFFF',
                                        fontSize: '10px'

                                    }
                                },
                                lineColor: o.labelColor,
                                tickInterval: 10,
                                plotLines: HighChartConfig.plotLines,
                                min: 80,
                                max: 120
                            },
                            //tooltip: {
                            //    shared: true,   
                            //},
                            //tooltip: {
                            //    formatter: function () {
                            //        var s = '<b>' + Highcharts.dateFormat(' %Y年%m月%d日', this.x) + '</b>';
                            //       // s += '<br/><b>' + Highcharts.dateFormat('%A %H:%M:%S', this.x) + '</b>';
                            //        s += '<br/><b>指数值</b>:' + this.y;;

                            //        return s;//'<b>指数值</b>:' + this.y;
                            //    }
                            //},
                            tooltip: {
                                formatter: function () {
                                    var s = '<b>' + Highcharts.dateFormat(' %Y年%m月%d日', this.x) + '</b>';
                                    s += '<br/><b>指数值</b>:' + this.y + '</b>';
                                    return s;
                                },
                                borderWidth: 0,
                                crosshairs: false
                            },

                            plotOptions: {
                                line: {
                                    dataLabels: {
                                        color: o.labelColor,
                                        enabled: true
                                    },
                                    enableMouseTracking: true
                                },
                                spline: {
                                    dataLabels: {
                                        color: o.labelColor,
                                        enabled: true
                                    },
                                    enableMouseTracking: true
                                },
                                column: {
                                    borderColor: o.columnColor
                                }
                            },
                            series: [
                            {
                                name: '指数值',
                                type: 'column',
                                data: o.data,
                                color: o.columnColor
                            },
                            {
                                name: '指数值',
                                type: o.lineType == null ? "spline" : o.lineType,
                                data: o.data,
                                color: o.splineColor
                            }
                            ],
                            exporting: {
                                enabled: false
                            },
                            credits: {
                                enabled: false
                            },
                            legend: {
                                enabled: false
                            }

                        });
                    }
                        //曲线图(线)
                    else if (o.chartType == "1a") {
                        tempContent.highcharts({
                            chart: {
                                type: 'line',
                                // zoomType: 'xy',
                                backgroundColor: 'rgba(0,0,0,0)',
                                marginRight: 20,
                                height: opts.height - 30
                            },
                            credits: {
                                enabled: false
                            },
                            legend: {
                                enabled: false
                            },
                            title: {
                                text: ""
                            },
                            xAxis: {
                                type: 'datetime',
                                labels: {
                                    formatter: function () {
                                        return Highcharts.dateFormat('%b/%d', this.value);
                                    },
                                    style: {
                                        color: o.labelColor,
                                        fontSize: '12px'
                                    }
                                },
                                dateTimeLabelFormats: {
                                    hour: '%H:%M'
                                },

                                lineColor: o.labelColor,
                                tickInterval: 24 * 3600 * 1000
                            },
                            yAxis: {
                                allowDecimals: false,
                                labels: {
                                    style: {
                                        color: o.labelColor,
                                        fontSize: '12px'
                                    }
                                },
                                title: {
                                    text: '',
                                    style: {
                                        fontWeight: 'normal',
                                        color: o.labelColor,
                                        fontSize: '10px'
                                    }
                                },
                                gridLineColor: o.labelColor,
                                tickInterval: 10,
                                gridLineWidth: 1,
                                plotLines: HighChartConfig.plotLines,
                                min: 80,
                                max: 120
                            },
                            tooltip: {
                                shared: true,
                                formatter: function () {
                                    var s = '<b>' + Highcharts.dateFormat(' %Y年%m月%d日', this.x) + '</b>';
                                    // s += '<br/><b>' + Highcharts.dateFormat('%A %H:%M:%S', this.x) + '</b>';
                                    s += '<br/><b>指数值</b>:' + this.y;;
                                    return s;
                                }
                            },
                            plotOptions: {
                                spline: {
                                    dataLabels: {
                                        color: o.labelColor,
                                        enabled: true
                                    },
                                    enableMouseTracking: true
                                }
                            },
                            series: [
                            {
                                name: '指数值',
                                type: 'spline',
                                data: o.data,
                                color: o.splineColor
                            }
                            ],
                            exporting: {
                                enabled: false
                            },
                            credits: {
                                enabled: false
                            },
                            legend: {
                                enabled: false
                            }

                        });
                    }
                        //曲线图(面积) //eg: 经济综合指数 public.js     index.html#public
                    else if (o.chartType == "1b") {
                        tempContent.highcharts({
                            chart: {
                                // zoomType: 'xy',
                                height: opts.height - 30,
                                backgroundColor: 'rgba(0,0,0,0)',
                                marginRight: 20
                            },
                            credits: {
                                enabled: false
                            },
                            title: {
                                text: '',
                                align: 'right',
                                y: 15,
                                style: {
                                    color: '',
                                    fontSize: '12px'
                                }
                            },

                            xAxis: {
                                type: 'datetime',
                                labels: {
                                    formatter: function () {
                                        return Highcharts.dateFormat('%b/%d', this.value);
                                    },
                                    style: {
                                        color: o.labelColor,
                                        fontSize: '12px'
                                    }

                                },
                                dateTimeLabelFormats: {
                                    hour: '%H:%M'
                                },
                                lineColor: o.labelColor,
                                tickInterval: 24 * 3600 * 1000

                            },
                            yAxis: {
                                allowDecimals: false,
                                labels: {

                                    style: {
                                        color: o.labelColor,
                                        fontSize: '12px'
                                    }

                                },
                                title: {
                                    text: '',
                                    style: {
                                        fontWeight: 'normal',
                                        color: o.labelColor,
                                        fontSize: '12px'

                                    },
                                    rotation: 0,
                                    align: 'high',
                                    offset: -10,
                                    x: -9,
                                    y: -15
                                },
                                tickInterval: 10,
                                lineColor: o.labelColor,
                                lineWidth: 1,
                                gridLineWidth: 0,
                                plotLines: HighChartConfig.plotLines,
                                min: 80,
                                max: 120
                            },

                            tooltip: {
                                shared: true,
                                formatter: function () {
                                    var s = '<b>' + Highcharts.dateFormat(' %Y年%m月%d日', this.x) + '</b>';
                                    // s += '<br/><b>' + Highcharts.dateFormat('%A %H:%M:%S', this.x) + '</b>';
                                    s += '<br/><b>指数值</b>:' + this.y;;
                                    return s;
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
                            plotOptions: {
                                area: {
                                    dataLabels: {
                                        color: o.labelColor,
                                        enabled: true
                                    },
                                    enableMouseTracking: true,
                                    fillColor: {
                                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                        stops: [
                                            [0, o.bottomColor],
                                            [1, Highcharts.Color(o.bottomColor).setOpacity(0).get('rgba')]
                                        ]
                                    },
                                    lineWidth: 1,
                                    marker: {
                                        radius: 3,
                                        enabled: true
                                    },
                                    shadow: false,
                                    states: {
                                        hover: {
                                            lineWidth: 1
                                        }
                                    },
                                    threshold: null

                                }
                            },
                            series: [{
                                type: 'area',
                                name: '指数值',
                                color: o.splineColor,
                                data: o.data
                            }]

                        });
                    }
                        //热词Todo    //eg: 城管热刺 public.js    index.html#public
                    else if (o.chartType == 2) {//热词之类的，直接显示内容不要highchars相关设置。
                        tempContent.addClass(o.contentCSS);
                        tempContent.height(opts.height - 30);
                        $.each(o.data, function (i1, o1) {
                            var css = "";
                            var newo1 = o1;
                            if (o1.length > 4) {
                                css = "font-size:16px;padding-top:20px;"
                                newo1 = o1.substr(0, 4) + "<br/>" + o1.substr(3, o1.length - 4);
                            }

                            tempContent.append("<div style='" + css + "'>" + newo1 + "</div>");
                        })
                    }
                        //饼图Todo
                    else if (o.chartType == 3) {
                        tempContent.highcharts({
                            chart: {
                                width: $this.width(),// $(this).parent().width(),
                                backgroundColor: 'rgba(0,0,0,0)',
                                plotBackgroundColor: null,
                                plotBorderWidth: 0,
                                plotShadow: true,
                                spacingLeft: $(window).width() < 400 ? 0 : 0,
                                spacingRight: 30,
                                height: opts.height - 13
                            },
                            credits: {
                                enabled: false
                            },
                            title: {
                                text: ""
                            },
                            tooltip: {
                                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                            },
                            plotOptions: {//绘图区域的配置信息
                                pie: {
                                    allowPointSelect: false,
                                    cursor: 'default',
                                    dataLabels: {
                                        enabled: false,
                                        color: '#000000',
                                        connectorColor: '#000000',
                                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                                    },
                                    showInLegend: true,
                                    point: {
                                        events: {
                                            legendItemClick: function () {
                                                return false;
                                            }
                                        }
                                    }
                                }
                            },

                            //plotOptions: {
                            //    pie: {
                            //        allowPointSelect: true,
                            //        cursor: 'pointer',
                            //        dataLabels: {
                            //            enabled: false
                            //        },
                            //        showInLegend: true
                            //    }
                            //},
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
                                    return this.name + " : " + this.percentage.toFixed(2) + "%";
                                }

                            },
                            exporting: {
                                enabled: false
                            },
                            credits: {
                                enabled: false
                            },
                            series: [{
                                name: '所占比例',
                                type: 'pie',
                                color: "#78ba00",
                                data: o.data
                            }]
                        });
                    }
                        //12月柱状图Todo
                    else if (o.chartType == 4) {
                        tempContent.highcharts({
                            chart: {
                                type: 'column',
                                width: $this.width() - 20,// $(this).parent().width(),
                                backgroundColor: 'rgba(0,0,0,0)',
                                height: opts.height - 35
                            },
                            credits: {
                                enabled: false
                            },
                            title: {
                                text: ''
                            },
                            subtitle: {
                                text: ''
                            },
                            xAxis: {
                                categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                                labels: {
                                    style: {
                                        color: '#FFFFFF'
                                    }
                                },
                                lineColor: '#FFFFFF',
                                lineWidth: 1,
                                gridLineWidth: 0
                            },
                            yAxis: {
                                allowDecimals: false,
                                min: 0,
                                title: {
                                    text: ''
                                },
                                labels: {
                                    style: {
                                        color: '#FFFFFF'
                                    }

                                },
                                gridLineWidth: 1,
                                gridLineColor: '#FFFFFF'
                            },
                            tooltip: {
                                formatter: function () {
                                    var s = this.x + ':共<b>' + this.y + '</b>条';
                                    return s;
                                },
                                //headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                                //pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                //    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                                //footerFormat: '</table>',
                                shared: true
                                // useHTML: true
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
                                color: o.columnbg,
                                data: o.data
                            }]
                        });
                    }
                        //上下滚动
                    else {//eg room9.js使用。GetNews(callback)
                        tempContent.addClass(o.contentCSS);
                        //tempContent.height(opts.height-30);
                        var ulId = $this.attr("id") + "marqueesUL" + ind;
                        var ul = $("<ul id='" + ulId + "'></ul>");
                        $.each(o.data, function (i1, o1) {
                            var li = $("<li><div class='fl-content " + (o1.score == 0 ? 'nt_yellow' : (o1.score > 0 ? 'nt_green' : 'nt_red')) + "'><a href='" + o1.news_url + "' target=\"_blank\" class='white' title='" + o1.news_title.trim() + "'><span>" + o1.news_title.trim() + "</span></a></div><span class=\"data\">" + formatDate(o1.report_date).substr(5, 5) + "</span></li>");
                            ul.append(li);
                        });
                        tempContent.append(ul);
                        //滚动
                        var marqueeObja = new marqueeObj()
                        marqueeObja.append(ulId, ul.find("li").height() + 10, 1500);

                        ul.parent().hover(function () {
                            // console.log('stop');
                            marqueeObja.stop();
                        }, function () {
                            // console.log('start');
                            marqueeObja.start();
                        });
                        marqueeObja.start();
                    }

                    if (ind > 0) {
                        tempContainer.hide();
                    }

                });

                //var amt = animationMgr.register($this.attr("id"));
                //amt.active($this.attr("id"));

            });
        },

        //用于舆情指数分析
        chartWord: function (options) {
            //未来可以添加或者设置其他参数
            var defVal = {
                height: 200,
                data: [],
                titleAlign: "top"
            };
            var opts = $.extend({}, defVal, options);

            $this = $(this);

            var lineObj = opts.data[0];
            var wordObj = opts.data[1];

            var tempContainer = $("<div class='" + lineObj.containerCSS + "'></div>");
            var title = $("<div class='" + lineObj.titleCSS + "'><i class='" + lineObj.iconCSS + "'></i>" + lineObj.title + "</div>");
            var tempContent = $("<div class='" + lineObj.contentCSS + "'></div>");


            var tempWordContent = $("<div class='" + wordObj.contentCSS + "'></div>");

            tempContainer.append(title);
            tempContainer.append(tempContent);
            tempContainer.append(tempWordContent);
            $this.append(tempContainer);

            //曲线
            tempContent.highcharts({
                chart: {
                    //  zoomType: 'xy',
                    backgroundColor: 'rgba(0,0,0,0)',
                    marginRight: 20,
                    height: opts.height - 30
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                title: {
                    text: ""
                },
                xAxis: {
                    type: 'datetime',
                    labels: {
                        formatter: function () {
                            return Highcharts.dateFormat('%m/%d', this.value);
                        },
                        style: {
                            color: '#FFFFFF',
                            fontSize: '12px'
                        }
                    },
                    dateTimeLabelFormats: {
                        hour: '%H:%M'
                    },
                    tickInterval: 24 * 3600 * 1000
                },
                yAxis: {
                    allowDecimals: false,
                    labels: {
                        style: {
                            color: '#FFFFFF',
                            fontSize: '12px'
                        }
                    },
                    title: {
                        text: '',
                        style: {
                            fontWeight: 'normal',
                            color: '#FFFFFF',
                            fontSize: '10px'

                        }

                    },
                    lineColor: '#FFFFFF',
                    lineWidth: 1,
                    gridLineWidth: 0
                },
                tooltip: {
                    formatter: function () {
                        var s = '<b>' + Highcharts.dateFormat(' %Y年%m月%d日', this.x) + '</b>';
                        s += '<br/><b>' + Highcharts.dateFormat('%A %H:%M:%S', this.x) + '</b>';
                        s += '<br/><b>指数值</b>:' + this.y;

                        return s;//'<b>指数值</b>:' + this.y;
                    }
                },
                plotOptions: {
                    column: {
                        borderColor: lineObj.columnbg
                    }
                },
                series: [
                {
                    name: '指数值',
                    type: 'spline',
                    data: lineObj.data
                    //color: data.data[0].columnbg,

                }
                ],
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                legend: {

                    enabled: false
                }
            });
            //热词
            tempWordContent.addClass(wordObj.containerCSS);
            tempContent.height(opts.height - 30);
            $.each(wordObj.data, function (ind, o) {
                tempWordContent.append("<div>" + o + "</div>");
            })



        },

        //综合热词
        /* 作为插件，扩展方法，以便其他页面的jq元素调用。
           eg:public.js中：$("#hotwords").wordChart({ height: 135, data: ConfigInfo }).removeClass("loading");
        */
        wordChart: function (options) {//综合热词       [#public 右侧]public.js
            var defVal = {
                title: "默认标题",
                data: [],
                cssData: [],
                contentCSS: "",
                titleCSS: ""
            }; //未来可以添加或者设置其他参数
            var opts = $.extend({}, defVal, options);
            return this.each(function () {
                $this = $(this);
                //console.log('call:',$this);
                var tempContainer = $("<div class=" + opts.data.contentCSS + "></div>");
                var tempTitle = $("<div class=" + opts.data.titleCSS + ">" + opts.data.title + "</div>");
                var wordArray = [];
                $.each(opts.data.data, function (i, o) {
                    wordArray.push("<span class='zh_word" + (i + 1) + "'>" + o + "</span> ");
                });
                wordArray.sort(function () { return Math.random() > .5 ? -1 : 1 });

                $.each(wordArray, function (iw, io) {
                    tempContainer.append(io);
                });
                $this.empty().append(tempContainer).append(tempTitle);
            });
            function GetRandom(min, max) {//随机获取min到max之间的一个整数
                return Math.floor(min + Math.random() * (max - min));
            }
        },
        //滚动
        rollChart: function (options) {
            //未来可以添加或者设置其他参数
            var defVal = {
                speed: 60,  //滚动速度,值越大速度越慢
                rowHeight: 24, //每行的高度
                data: [],
                contentCSS: "",
                titleCSS: "",
                title: "负面新闻"
            };
            var opts = $.extend({}, defVal, options), intId = [];;
            return this.each(function (i) {
                $this = $(this);
                var tempContainer = $("<div class='" + opts.data.containerCSS + "'></div>");
                var tempUl = $("<ul id='wbfbul'></ul>")
                $.each(opts.data.data, function (j, o) {
                    var commentCount = 0;
                    var reportCount = 0;
                    if (o.comments_count != null) {
                        commentCount = o.comments_count;
                    }
                    if (o.reposts_count != null) {
                        reportCount = o.reposts_count;
                    }
                    tempUl.append("<li><div class='media list-item'><div class='pull-left'><img src='../img/kbh-laba.png'></div><div class='media-body'><a href=" + o.news_url + " target='_blank' class='whiteu' title='" + o.news_title.trim() + "'><div class='listone'>" + o.news_title.trim() + "</div></a><div class='listtwo'><div class='fleft'><span>" + o.report_date.substr(0, 10) + "</span><span>" + o.report_date.substr(11, 8) + "</span></div><div class='fright'><span>评论(" + commentCount + ")</span><span>转发(" + reportCount + ")</span></div></div></div></div></li>");
                });
                tempContainer.append(tempUl);
                $this.append(tempContainer);

                //滚动
                var marqueeObjb = new marqueeObj()
                marqueeObjb.append("wbfbul", tempUl.find("li").height() + 2, 2000);
                tempUl.parent().hover(function () {
                    marqueeObjb.stop();
                }, function () {
                    marqueeObjb.start();
                });
                marqueeObjb.start();


            });


        },
        //用于舆情关注度
        reportChart: function (options) {
            //未来可以添加或者设置其他参数
            var defVal = {
                height: 100,
                showRandar: false,
                tootipYName: '指数值',
                labelColor: "white",
                splineColor: "white",
                titleColor: "white",
                columnColor: "#1e5bbc",
                xAxisMin: null,
                data: {}
            };
            var opts = $.extend({}, defVal, options);
            return this.each(function () {
                $this = $(this);
                var initData = opts.data.ChartData;

                if (opts.showRandar) {
                    $this.addClass("left-top-yq");
                }
                var chart = $this.highcharts({
                    chart: {
                        height: opts.height,
                        backgroundColor: 'rgba(0,0,0,0)'
                    },
                    title: {
                        text: opts.data.SentimentType,
                        align: 'left',
                        x: 20,
                        y: 30,
                        style: {
                            color: opts.titleColor,
                            fontSize: '30px'
                        },
                        userHTML: true
                    },
                    //设置滚动条    
                    scrollbar: {
                        enabled: true
                    },
                    yAxis: {
                        title: null,
                        allowDecimals: false,
                        opposite: false,
                        labels: {
                            style: {
                                color: opts.labelColor
                            }
                        },
                        gridLineColor: opts.labelColor,
                        lineWidth: 1,
                        lineColor: opts.labelColor
                    },
                    xAxis: {
                        type: 'datetime',
                        lineColor: opts.labelColor,
                        labels: {
                            formatter: function () {
                                return Highcharts.dateFormat('%m/%d', this.value);
                            },
                            style: {
                                color: opts.labelColor
                            }
                        },
                        tickInterval: 24 * 3600 * 1000,
                        min: opts.xAxisMin
                    },
                    tooltip: {
                        formatter: function () {
                            var s = '';
                            s += '今日更新：<b>' + this.y + '</b>';
                            s += '<br/>' + Highcharts.dateFormat(' %Y年%m月%d日', this.x);
                            return s;
                        },
                        borderWidth: 0,
                        crosshairs: false
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
                    plotOptions: {
                        series: {
                            cursor: "pointer",
                            marker: {
                                radius: 4,
                                enabled: true
                            }
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
                    plotOptions: {
                        series: {
                            cursor: "pointer",
                            point: {
                                events: {
                                    click: function () {
                                        // $('#myModal').modal();//弹出新闻
                                        //alert("x:" + this.x + ";y:" + this.y);
                                    }
                                }
                            },
                            marker: {
                                radius: 4,
                                enabled: true
                            }
                        },
                        column: {
                            borderColor: null
                        }
                    },
                    series: [
                       {
                           type: 'spline',
                           color: opts.splineColor,
                           width: 1,
                           data: initData,
                           index: 2,
                           tooltip: {
                               valueDecimals: 2
                           }
                       }, {
                           type: 'column',
                           color: opts.columnColor,
                           data: initData,
                           tooltip: {
                               valueDecimals: 2
                           }
                       }
                    ]
                });
                return $this.highcharts();


            });
        },
        //今日、一周 负面 趋势
        indexChart: function (options) {
            var defVal = {
                height: 100,
                labelColor: "#FFFFFF",
                chartType: "line",
                subTitle: "",
                data: []
            }
            var opts = $.extend({}, defVal, options);
            var tootipStyle = {//提示层样式。
                backgroundColor: '#FFFFFF',
                borderWidth: 3,
                style: {//text的css样式
                    color: '#ff2900',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    padding: 5, lineHeight: 20
                }
            };
            var yAxisMax = 10;
            if (opts.chartType == "line") {//eg:今日负面趋势
                tootipStyle = {
                    backgroundColor: '#ff5f40',
                    borderWidth: 1,
                    style: {
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        paddingLeft: 5
                    }
                };
            }
            for (var i = 0; i < opts.data.length; i++) {
                if (opts.data[i][1] > yAxisMax) {
                    yAxisMax = opts.data[i][1];
                }
            }

            $this = $(this);
            return $this.highcharts({ //真正使用到的。
                chart: {
                    backgroundColor: null,
                    height: 180,
                    marginTop: 30
                },
                noData: {
                    style: {
                        fontWeight: 'bold',
                        fontSize: '15px',
                        color: 'gray'
                    }
                },
                title: {//主标题
                    text: '',
                    // x: -20 //center
                    margin: 0
                },
                subtitle: {//副标题样式
                    style: {
                        fontWeight: 'bold'
                    },
                    text: opts.subTitle,
                    align: 'right',//eg:#index 12小时负面趋势
                    y: 10
                },
                exporting: {//导出eg png等。。。
                    enabled: false
                },
                credits: {//网址
                    enabled: false
                },
                xAxis: {
                    // type: 'datetime',
                    labels: {
                        formatter: function () {
                            if (opts.chartType == "line") {
                                return Highcharts.dateFormat('%H', this.value);//小时分钟。。eg:#index 12小时负面趋势
                            }
                            else {
                                return Highcharts.dateFormat('%a', this.value);//%a: 简短型星期,比如‘Mon’.
                            }

                        }
                    },
                    tickInterval: opts.chartType == "line" ? 1000 * 60 * 60 : 1000 * 60 * 60 * 24   //时间跨度：1小时和1天。
                },
                yAxis: {
                    allowDecimals: false,//在坐标轴的(刻度处)是否允许小数。
                    title: {
                        text: ''
                    },
                    min: 0,
                    max: yAxisMax
                },
                plotOptions: {
                    series: {//eg:圆点的
                        color: '#fb684b',
                        lineWidth: 6,//eg:圆点之间的连接线宽度
                        marker: {//圆点的
                            fillColor: '#fb684b',
                            lineWidth: 3,
                            lineColor: '#FFFFFF',
                            states: {
                                hover: {
                                    fillColor: '#ffffff',
                                    lineColor: '#ff2900',
                                    radius: 6
                                }
                            },
                            radius: 6
                        }
                    },
                    column: {//默认效果 柱状图
                        borderWidth: 1,
                        borderColor: '#ff2900'
                    }
                },
                tooltip: {
                    backgroundColor: tootipStyle.backgroundColor,
                    style: tootipStyle.style,
                    borderWidth: tootipStyle.borderWidth,
                    formatter: function () {
                        return '<b>' + this.y + '</b>'
                    }
                },
                legend: {//插件网址
                    enabled: false
                },
                series: [{
                    type: opts.chartType,
                    data: opts.data
                }]
            });


        },
        indexPageChart: function (options) {
            var defVal = {
                height: 1000,
                labelColor: "#FFFFFF",
                chartType: "line",
                subTitle: "",
                data: []
            }
            var opts = $.extend({}, defVal, options);
            var tootipStyle = {//提示层样式。
                backgroundColor: '#FFFFFF',
                borderWidth: 3,
                style: {//text的css样式
                    color: '#ff2900',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    padding: 5, lineHeight: 20
                }
            };
            var yAxisMax = 10;
            if (opts.chartType == "line") {//eg:今日负面趋势
                tootipStyle = {
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1,
                    style: {
                        color: '#ff2900',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        paddingLeft: 5
                    }
                };
            }
            for (var i = 0; i < opts.data.length; i++) {
                if (opts.data[i][1] > yAxisMax) {
                    yAxisMax = opts.data[i][1];
                }
            }

            $this = $(this);
            return $this.highcharts({ //真正使用到的。
                chart: {
                    backgroundColor: null,
                    height:opts.height,
                    marginTop: 30
                },
                noData: {
                    style: {
                        fontWeight: 'bold',
                        fontSize: '15px',
                        color: 'gray'
                    }
                },
                title: {//主标题
                    text: '',
                    // x: -20 //center
                    margin: 0
                },
                subtitle: {//副标题样式
                    style: {
                        fontSize:'20px',
                        fontWeight: 'bold',
                        color:'#ffffff'
                    },

                    text: opts.subTitle,
                    align: 'right',//eg:#index 12小时负面趋势
                    y: 10
                },
                exporting: {//导出eg png等。。。
                    enabled: false
                },
                credits: {//网址
                    enabled: false
                },
                xAxis: {
                    // type: 'datetime',
                    labels: {
                        formatter: function () {
                            if (opts.chartType == "line") {
                                return Highcharts.dateFormat('%H', this.value);//小时分钟。。eg:#index 12小时负面趋势
                            }
                            else {
                                return Highcharts.dateFormat('%a', this.value);//%a: 简短型星期,比如‘Mon’.
                            }

                        },
                        style: {
                            color: '#ffffff',
                            fontWeight: 'bold'
                        }
                    },
                    tickInterval: opts.chartType == "line" ? 1000 * 60 * 60 : 1000 * 60 * 60 * 24   //时间跨度：1小时和1天。
                },
                yAxis: {
                    allowDecimals: false,//在坐标轴的(刻度处)是否允许小数。
                    title: {
                        text: ''
                    },
                    //tickInterval:100,
                    min: 0,
                    max: yAxisMax,
                    labels:{style: {
                        color: '#ffffff',
                        fontWeight: 'bold'
                    }}

                },
                plotOptions: {
                    series: {//eg:圆点的
                        color: '#ffffff',
                        lineWidth: 6,//eg:圆点之间的连接线宽度
                        marker: {//圆点的
                            fillColor: '#ffffff',
                            lineWidth: 3,
                            lineColor: '#ffffff',
                            states: {
                                hover: {
                                    fillColor: '#ffffff',
                                    lineColor: '#ffffff',
                                    radius: 6
                                }
                            },
                            radius: 6
                        }
                    },
                    column: {//默认效果 柱状图
                        borderWidth: 1,
                        borderColor: '#ffffff'
                    }
                },
                tooltip: {
                    backgroundColor: tootipStyle.backgroundColor,
                    style: tootipStyle.style,
                    borderWidth: tootipStyle.borderWidth,
                    formatter: function () {
                        return '<b>' + this.y + '</b>'
                    }
                },
                legend: {//插件网址
                    enabled: false
                },
                series: [{
                    type: opts.chartType,
                    data: opts.data
                }]
            });


        },

        //测试用
        testChart: function (options) {
            //未来可以添加或者设置其他参数
            var defVal = {
                height: 100,
                showRange: true,
                showRandar: false,
                timeOut: 1000 * 60 * 60 * 24
            };
            var opts = $.extend({}, defVal, options);

            $this = $(this);
            $this.highcharts({
                chart: {
                    renderTo: 'chartD',
                    type: 'line'
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: 'Fruit Consumption'
                },
                xAxis: {
                    categories: ['Apples', 'Bananas', 'Oranges']
                },
                yAxis: {
                    title: {
                        text: 'Fruit eaten'
                    }
                },
                series: [{
                    data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
                }]
            });
        }
    })
})(jQuery);

