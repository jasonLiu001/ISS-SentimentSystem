define(function (require, exports, modules) {
    var base = require('/showroom/Componets/base');
    //var startUTCTime;
    var viewModel = {
        downNews: ko.observableArray([])
    };
    function update(chartHeight) {
        loadYqChart(chartHeight);
    }

    //加载舆情图表
   function loadYqChart(chartHeight) {
        //初始化舆情图表
        getYqData(function (datas, startUTCTime) {
            //var jsonArr = [10000, 20000, 30000, 40000, 50000, 20000, 30000, 40000, 60000, 30000, 20000, 10000, 40000, 10000, 30000, 40000, 50000, 20000, 30000, 40000, 60000, 30000, 20000, 10000, 40000, 10000, 30000, 40000, 50000, 20000, 30000, 40000, 60000, 30000, 20000, 10000, 40000, 10000];
            jsonArr = datas[0];
            var dataArr = new Array(),
                dataArr1 = new Array(),
                attention = 460,
                companyName = "iSoftStone";
            var minValue = jsonArr[0];
            for (var i = 0; i < jsonArr.length; i++) {
                if (jsonArr[i] < minValue)
                    minValue = jsonArr[i];
                var data, data1;
                if (i % 6 == 0) {
                    data1 = {
                     
                        y: jsonArr[i], dateId: datas[1][i / 6], events: {
                           
                            click: function () {
                                if (this.dateId) {
                                    $.getJSON("/showroom/api/getdownnews?p=" + this.dateId, function (data) {
                                        if (data.length > 0) {
                                            $('#myModal').modal();
                                            base.setData(viewModel.downNews, data);
                                        }
                                    })

                                }
                            }
                        }
                    };
                    data = {
                        
                        dataLabels: {
                            enabled: true,
                            align: 'left',
                            style: {
                                fontWeight: 'bold',
                                color: '#FFFFFF'
                            },
                            x: -10,
                            y: -20,
                            verticalAlign: 'middle',
                            overflow: true,
                            crop: false
                        },
                        marker: {
                         
                            enabled: true,
                            fillColor: jsonArr[i] < 100 ? "red" : "white",
                            radius: jsonArr[i] < 100 ? 8 : 4
                        },
                        events: {
                     
                            click: function () {
                                if (this.dateId) {
                                    $.getJSON("api/getdownnews?p=" + this.dateId, function (data) {
                                        if (data.length > 0) {
                                            $('#myModal').modal();
                                            base.setData(viewModel.downNews, data);
                                        }
                                    })

                                }
                            }
                        },
                        y: jsonArr[i],
                        dateId: datas[1][i / 6]
                    }
                }
                else {
                    data1 = jsonArr[i];
                    data = jsonArr[i];
                }
                dataArr.push(data);
                dataArr1.push(data1);
            }
            var cHeight = chartHeight==null?base.getChartHeight(270):chartHeight;

            yqChart = $('#container').highcharts({
                chart: {
                    zoomType: 'xy',
                    //width: 700,
                    height: cHeight,
                    backgroundColor: 'rgba(0,0,0,0)',
                    marginRight: 20
                },

                title: {
                    text: '综合舆情指数',
                    align: 'left',
                    x: 40,
                    //y: 20,
                    style: {
                        color: '#2d3a4a',
                        fontSize: '1px'
                    }
                },
                xAxis: {
                    type: 'datetime',
                    labels: {
                        style: {
                            color: '#FFFFFF'
                        }
                    },
                    dateTimeLabelFormats: {
                        hour: '%H:%M',
                    },
                    tickInterval: 3600 * 1000,
                },
                yAxis: {
                    labels: {
                        format: '{value}',
                        style: {
                            color: '#FFFFFF'
                        }
                    },
                    title: {
                        text: '',
                        style: {
                            color: '#FFFFFF'
                        },
                        rotation: 0,
                        align: 'high',
                        offset: 0,
                        x: -5,
                        y: -20
                    },
                    gridLineColor: '#FFFFFF',
                    lineWidth: 1,
                    gridLineWidth: 0,
                    min: 92,
                    plotLines: [
                        { color: 'green', value: 106, width: 2, dashStyle: "Dash" },
                         { color: 'yellow', value: 100, width: 2, dashStyle: "Dash" },
                          { color: 'red', value: 94, width: 2, dashStyle: "Dash" }
                    ]

                },
                tooltip: {
                    shared: true,
                    backgroundColor: '#eaeaea'
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
                        marker: {
                            enabled: false
                        }
                    },
                    column: {

                        borderColor: '#01adf7'
                    }
                },
                series: [
                    {
                        name: '指数值',
                        color: '#FFFFFF',
                        type: 'spline',

                        data: dataArr,
                        pointStart: startUTCTime,
                        pointInterval: 600 * 1000,
                        zIndex: 5
                    },
                        //,

                {
                    name: '指数值',
                    color: '#1e5bbc',
                    type: 'column',
                    data: dataArr1,// [5000, 15000, 25000, 35000, 45000, 15000, 25000, 35000, 55000, 25000, 15000, 5000, 35000, 5000, 25000, 35000, 45000, 15000, 25000, 35000, 55000, 25000, 15000, 5000, 35000, 5000, 25000, 35000, 45000, 15000, 25000, 35000, 55000, 25000, 15000, 5000, 35000, 5000],
                    pointStart: startUTCTime,
                    pointInterval: 600 * 1000,
                },
                ]
            });
        });

    }

    //获取舆情数据
    function getYqData(complate) {
        $.getJSON('/showroom/api/GetBrandTrendHourly.js', function (data) {
            var datas = [];
            var datas1 = [];
            startUTCTime = base.getUTCTime(data[0].date_id);
            for (var i = 0; i < data.length; i++) {
                // datas.push([data[i].date_id, data[i].score]);
                if (i < data.length - 1) {
                    var minus = (data[i + 1].score - data[i].score) / 6;
                }
                var dt = parseInt(data[i].date_id + "");
                datas.push(Math.floor(data[i].score));
                datas.push(Math.floor(data[i].score + minus));
                datas.push(Math.floor(data[i].score + minus * 2));
                datas.push(Math.floor(data[i].score + minus * 3));
                datas.push(Math.floor(data[i].score + minus * 4));
                datas.push(Math.floor(data[i].score + minus * 5));

                datas1.push(data[i].date_id);
            }
            complate([datas, datas1], startUTCTime)
        });
    }

    exports.load = function (id,par,callback,chartHeight) {
        base.applyBind(id, '/showroom/templates/yq.html', viewModel, function () {
            update(chartHeight);
            if (callback)
                callback();
            setInterval(update, base.timeout);

            //更新舆情前10秒监听数量
            var count = Math.floor(Math.random() * 50) + 2;
            $("#yqMinCount").html(count);

            setInterval(function () {
                var count = Math.floor(Math.random() * 50) + 2;
                $("#yqMinCount").html(count);
            }, 1 * 60 * 1000)
        });
    };

});