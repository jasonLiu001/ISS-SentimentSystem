define(function (require, exports, modules) {
    var base = require('/showroom/Componets/base');
    // var startUTCTime1 = 0;
    var tpwidth;
    var viewModel = {
        industryWord: ko.observableArray([]),
        agriWord: ko.observableArray([]),
        commerWord: ko.observableArray([]),
        travWord: ko.observableArray([])
    };
    function update() {
        //$.getJSON("api/GetHotWordBBS", function (data) {
        //    try {
        //        viewModel.hotWordBBS(data);
        //    } catch (exception) { console.log("dataBind-error：" + exception.message) }
        //});
        if ($('#ei_0').length > 0)
            getEconmicDataByUrl("/showroom/api/geteconomicindex.js", ei_0);
        if ($('#ei_1').length > 0)
            getEconmicDataByUrl("/showroom/api/geteconomicindustryindex.js", ei_1);
        if ($('#ei_2').length > 0)
            getEconmicDataByUrl("/showroom/api/geteconomicagricultureindex.js", ei_2);
        if ($('#ei_3').length > 0)
            getEconmicDataByUrl("/showroom/api/geteconomiccommercialindex.js", ei_3);
        if ($('#ei_4').length > 0)
            getEconmicDataByUrl("/showroom/api/geteconomicfinanceindex.js", ei_4);
        if ($('#ei_5').length > 0)
            getEconmicDataByUrl("/showroom/api/geteconomictravelindex.js", ei_5);
        $.getJSON("/showroom/api/getindustryWord.js", function (data) {
            base.setData(viewModel.industryWord, data);
        })
        $.getJSON("/showroom/api/getagriWord.js", function (data) {
            base.setData(viewModel.agriWord, data);
        })
        $.getJSON("/showroom/api/getcommerWord.js", function (data) {
            base.setData(viewModel.commerWord, data);
        })
        $.getJSON("/showroom/api/gettravWord.js", function (data) {
            base.setData(viewModel.travWord, data);
        })
        //ei_0();
        //ei_1();
        //ei_2();
        //ei_3();
        //ei_4();
        //ei_5();
    }
    exports.load = function (id, par, callback) {
        animationMgr.moduleCount++;
        var amt = animationMgr.register("EconomicInformation" + animationMgr.moduleCount);
        base.applyBind(id, '/showroom/templates/EconomicInformation.html', viewModel, function (view) {
            tpwidth = $(view).width();
            animationMgr.moduleCount++;
            $(view).attr("id", $(view).attr("id") + animationMgr.moduleCount);
            //翻转
            amt.active($(view).attr("id"), par);
            update();



            if (callback)
                callback();
            setInterval(update, base.timeout)
        });
    };

    //获取经济综合指数
    function getEconmicDataByUrl(url, complate) {
        $.getJSON(url, function (data) {
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

                //datas1.push([data[i].score]);
                /*for (var j = 1; j < 10; j++) {
                    var s = data[i].score;
                    s += (Math.random()) * (s / 10);
                    s += s / 10;
                    datas1.push([parseInt(data[i].date_id + "" + j * 10),s]);
                }*/
            }
            complate([datas, datas1], startUTCTime)
        });
    }

    function ei_0(data, startUTCTime1) {
        //startUTCTime1 = base.getUTCTime(20140621);
        //var jsonArr = [10, 9, 8, 6, 5, 3, 9, 10, 12, 14, 15, 13, 11, 10, 9, 8, 12, 14, 16, 19, 20, 20, 19, 17, 15, 14, 12, 10, 8, 10, 12, 10, 9, 8, 6, 5, 3];
        var jsonArr = data[0];
        var columnArr = jsonArr.slice(0, jsonArr.length - 5);
        var dataArr = new Array(), attention = 460, companyName = "iSoftStone";
        var minValue = jsonArr[0];
        for (var i = 0; i < jsonArr.length - 5; i++) {
            if (jsonArr[i] < minValue)
                minValue = jsonArr[i];
            var data;
            if (i % 6 == 0) {
                data = {
                    dataLabels: {
                        enabled: true,
                        align: 'center',
                        style: {
                            fontWeight: 'normal',
                            color: '#FFFFFF',
                            fontSize: '9px'
                        },
                        y: -15,
                        verticalAlign: 'middle',
                        overflow: true,
                        crop: false
                    },
                    marker: {
                        enabled: true,
                        radius: 3
                    },
                    y: jsonArr[i]
                }
            }
            else {
                data = jsonArr[i];
            }
            dataArr.push(data);
        }


        $('#ei_0').highcharts({
            chart: {
                zoomType: 'xy',
                width: tpwidth,
                height: base.getChartHeight(245),
                backgroundColor: '#0871a6',
                marginRight: 20,
            },
            title: {
                text: '',
                align: 'right',
                y: 15,
                style: {
                    color: '#d7eab3',
                    fontSize: '0px'
                }
            },

            xAxis: {
                type: 'datetime',
                labels: {
                    style: {
                        color: '#FFFFFF',
                        fontSize: '12px'
                    }

                },

                dateTimeLabelFormats: {
                    hour: '%H:%M',
                },
                tickInterval: 3600 * 1000,
            },
            yAxis: {
                labels: {

                    style: {
                        color: '#FFFFFF',
                        fontSize: '12px'
                    },

                },
                title: {
                    text: '',
                    style: {
                        fontWeight: 'normal',
                        color: '#FFFFFF',
                        fontSize: '12px'

                    },
                    rotation: 0,
                    align: 'high',
                    offset: -10,
                    x: -9,
                    y: -15
                },
                lineColor: '#FFFFFF',
                lineWidth: 1,
                gridLineWidth: 0,
                min: minValue
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
                area: {
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, Highcharts.getOptions().colors[4]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[4]).setOpacity(0).get('rgba')]
                        ]
                    },
                    lineWidth: 1,
                    marker: {
                        enabled: false
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
                name: '指数',
                //color: '#FFFFFF',
                ////type: 'spline',
                data: dataArr,
                pointStart: startUTCTime1,
                pointInterval: 600 * 1000,

            }]
        });
    }

    function ei_1(data, startUTCTime1) {
        //startUTCTime1 = base.getUTCTime(20140621);
        // var jsonArr = [10, 9, 8, 6, 5, 3, 9, 10, 12, 14, 15, 13, 11, 10, 9, 8, 12, 14, 16, 19, 20, 20, 19, 17, 15, 14, 12, 10, 8, 10, 12, 10, 9, 8, 6, 5, 3];
        var jsonArr = data[0];
        var columnArr = jsonArr.slice(0, jsonArr.length - 5);
        var dataArr = new Array(), attention = 460, companyName = "iSoftStone";
        var minValue = jsonArr[0];
        for (var i = 0; i < jsonArr.length - 5; i++) {
            if (jsonArr[i] < minValue)
                minValue = jsonArr[i];
            var data;
            if (i % 6 == 0) {
                data = {
                    dataLabels: {
                        enabled: true,
                        align: 'center',
                        style: {
                            fontWeight: 'normal',
                            color: '#FFFFFF',
                            fontSize: '9px'
                        },
                        y: -15,
                        verticalAlign: 'middle',
                        overflow: true,
                        crop: false
                    },
                    marker: {
                        enabled: true,
                        radius: 3
                    },
                    y: jsonArr[i]
                }
            }
            else {
                data = jsonArr[i];
            }
            dataArr.push(data);
        }


        $('#ei_1').highcharts({
            chart: {
                zoomType: 'xy',
                width: tpwidth,
                height: base.getChartHeight(245),
                backgroundColor: '#087878',
                marginRight: 20,
            },
            title: {
                text: '',
                align: 'right',
                y: 15,
                style: {
                    color: '',
                    fontSize: '0px'
                }
            },

            xAxis: {
                type: 'datetime',
                labels: {
                    style: {
                        color: '#FFFFFF',
                        fontSize: '9px'
                    }

                },

                dateTimeLabelFormats: {
                    hour: '%H:%M',
                },
                tickInterval: 3600 * 1000,
            },
            yAxis: {
                labels: {

                    style: {
                        color: '#FFFFFF',
                        fontSize: '9px'
                    },

                },
                title: {
                    text: '',
                    style: {
                        fontWeight: 'normal',
                        color: '#FFFFFF',
                        fontSize: '10px'

                    },
                    rotation: 0,
                    align: 'high',
                    offset: -10,
                    x: -9,
                    y: -15
                },
                lineColor: '#FFFFFF',
                lineWidth: 1,
                gridLineWidth: 0,
                min: minValue
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

                    borderColor: '#01a5a5'
                }
            },
            series: [{
                name: '指数值',
                color: '#01a5a5',
                type: 'column',
                data: columnArr,
                pointStart: startUTCTime1,
                pointInterval: 600 * 1000,

            }, {
                name: '指数值',
                color: '#FFFFFF',
                type: 'spline',
                data: dataArr,
                pointStart: startUTCTime1,
                pointInterval: 600 * 1000,

            }]
        });
    }

    function ei_2(data, startUTCTime1) {
        //startUTCTime1 = base.getUTCTime(20140621);
        //var jsonArr = [10, 9, 8, 6, 5, 3, 9, 10, 12, 14, 15, 13, 11, 10, 9, 8, 12, 14, 16, 19, 20, 20, 19, 17, 15, 14, 12, 10, 8, 10, 12, 10, 9, 8, 6, 5, 3];
        var jsonArr = data[0];
        var columnArr = jsonArr.slice(0, jsonArr.length - 5);
        var dataArr = new Array(), attention = 460, companyName = "iSoftStone";
        var minValue = jsonArr[0];
        for (var i = 0; i < jsonArr.length - 5; i++) {
            if (jsonArr[i] < minValue)
                minValue = jsonArr[i];
            var data;
            if (i % 6 == 0) {
                data = {
                    dataLabels: {
                        enabled: true,
                        align: 'center',
                        style: {
                            fontWeight: 'normal',
                            color: '#FFFFFF',
                            fontSize: '9px'
                        },
                        y: -15,
                        verticalAlign: 'middle',
                        overflow: true,
                        crop: false
                    },
                    marker: {
                        enabled: true,
                        radius: 3
                    },
                    y: jsonArr[i]
                }
            }
            else {
                data = jsonArr[i];
            }
            dataArr.push(data);
        }


        $('#ei_2').highcharts({
            chart: {
                zoomType: 'xy',
                width: tpwidth,
                height: base.getChartHeight(245),
                backgroundColor: '#146da0',
                marginRight: 20,
            },
            title: {
                text: '',
                align: 'right',
                y: 15,
                style: {
                    color: '',
                    fontSize: '0px'
                }
            },

            xAxis: {
                type: 'datetime',
                labels: {
                    style: {
                        color: '#FFFFFF',
                        fontSize: '12px'
                    }

                },

                dateTimeLabelFormats: {
                    hour: '%H:%M',
                },
                tickInterval: 3600 * 1000,
            },
            yAxis: {
                labels: {

                    style: {
                        color: '#FFFFFF',
                        fontSize: '12px'
                    },

                },
                title: {
                    text: '',
                    style: {
                        fontWeight: 'normal',
                        color: '#FFFFFF',
                        fontSize: '12px'

                    },
                    rotation: 0,
                    align: 'high',
                    offset: -10,
                    x: -9,
                    y: -15
                },
                lineColor: '#FFFFFF',
                lineWidth: 1,
                gridLineWidth: 0,
                min: minValue
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

                    borderColor: '#1faeff'
                }
            },
            series: [{
                name: '指数值',
                color: '#1faeff',
                type: 'column',
                data: columnArr,
                pointStart: startUTCTime1,
                pointInterval: 600 * 1000,

            }, {
                name: '指数值',
                color: '#FFFFFF',
                type: 'spline',
                data: dataArr,
                pointStart: startUTCTime1,
                pointInterval: 600 * 1000,

            }]
        });
    }

    function ei_3(data, startUTCTime1) {
        //startUTCTime1 = base.getUTCTime(20140621);
        //var jsonArr = [10, 9, 8, 6, 5, 3, 9, 10, 12, 14, 15, 13, 11, 10, 9, 8, 12, 14, 16, 19, 20, 20, 19, 17, 15, 14, 12, 10, 8, 10, 12, 10, 9, 8, 6, 5, 3];
        var jsonArr = data[0];
        var columnArr = jsonArr.slice(0, jsonArr.length - 5);
        var dataArr = new Array(), attention = 460, companyName = "iSoftStone";
        var minValue = jsonArr[0];
        for (var i = 0; i < jsonArr.length - 5; i++) {
            if (jsonArr[i] < minValue)
                minValue = jsonArr[i];
            var data;
            if (i % 6 == 0) {
                data = {
                    dataLabels: {
                        enabled: true,
                        align: 'center',
                        style: {
                            fontWeight: 'normal',
                            color: '#FFFFFF',
                            fontSize: '9px'
                        },
                        y: -15,
                        verticalAlign: 'middle',
                        overflow: true,
                        crop: false
                    },
                    marker: {
                        enabled: true,
                        radius: 3
                    },
                    y: jsonArr[i]
                }
            }
            else {
                data = jsonArr[i];
            }
            dataArr.push(data);
        }


        $('#ei_3').highcharts({
            chart: {
                zoomType: 'xy',
                width: tpwidth,
                height: base.getChartHeight(245),
                backgroundColor: '#4c0073',
                marginRight: 20,
            },
            title: {
                text: '',
                align: 'right',
                y: 15,
                style: {
                    color: '',
                    fontSize: '0px'
                }
            },

            xAxis: {
                type: 'datetime',
                labels: {
                    style: {
                        color: '#FFFFFF',
                        fontSize: '12px'
                    }

                },

                dateTimeLabelFormats: {
                    hour: '%H:%M',
                },
                tickInterval: 3600 * 1000,
            },
            yAxis: {
                labels: {

                    style: {
                        color: '#FFFFFF',
                        fontSize: '12px'
                    },

                },
                title: {
                    text: '',
                    style: {
                        fontWeight: 'normal',
                        color: '#FFFFFF',
                        fontSize: '12px'

                    },
                    rotation: 0,
                    align: 'high',
                    offset: -10,
                    x: -9,
                    y: -15
                },
                lineColor: '#FFFFFF',
                lineWidth: 1,
                gridLineWidth: 0,
                min: minValue
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

                    borderColor: '#7301ad'
                }
            },
            series: [{
                name: '指数值',
                color: '#7301ad',
                type: 'column',
                data: columnArr,
                pointStart: startUTCTime1,
                pointInterval: 600 * 1000,

            }, {
                name: '指数值',
                color: '#FFFFFF',
                type: 'spline',
                data: dataArr,
                pointStart: startUTCTime1,
                pointInterval: 600 * 1000,

            }]
        });
    }
    function ei_4(data, startUTCTime1) {
        //startUTCTime1 = base.getUTCTime(20140621);
        //var jsonArr = [10, 9, 8, 6, 5, 3, 9, 10, 12, 14, 15, 13, 11, 10, 9, 8, 12, 14, 16, 19, 20, 20, 19, 17, 15, 14, 12, 10, 8, 10, 12, 10, 9, 8, 6, 5, 3];
        var jsonArr = data[0];
        var columnArr = jsonArr.slice(0, jsonArr.length - 5);
        var dataArr = new Array(), attention = 460, companyName = "iSoftStone";
        var minValue = jsonArr[0];
        for (var i = 0; i < jsonArr.length - 5; i++) {
            if (jsonArr[i] < minValue)
                minValue = jsonArr[i];
            var data;
            if (i % 6 == 0) {
                data = {
                    dataLabels: {
                        enabled: true,
                        align: 'center',
                        style: {
                            fontWeight: 'normal',
                            color: '#FFFFFF',
                            fontSize: '12px'
                        },
                        y: -15,
                        verticalAlign: 'middle',
                        overflow: true,
                        crop: false
                    },
                    marker: {
                        enabled: true,
                        radius: 3
                    },
                    y: jsonArr[i]
                }
            }
            else {
                data = jsonArr[i];
            }
            dataArr.push(data);
        }


        $('#ei_4').highcharts({
            chart: {
                zoomType: 'xy',
                width: tpwidth,
                height: base.getChartHeight(245),
                backgroundColor: 'rgba(0,0,0,0)',
                marginRight: 20,
            },
            title: {
                text: '',
                align: 'right',
                y: 15,
                style: {
                    color: '',
                    fontSize: '0px'
                }
            },

            xAxis: {
                type: 'datetime',
                labels: {
                    style: {
                        color: '#FFFFFF',
                        fontSize: '12px'
                    }

                },

                dateTimeLabelFormats: {
                    hour: '%H:%M',
                },
                tickInterval: 3600 * 1000,
            },
            yAxis: {
                labels: {

                    style: {
                        color: '#FFFFFF',
                        fontSize: '12px'
                    },

                },
                title: {
                    text: '',
                    style: {
                        fontWeight: 'normal',
                        color: '#FFFFFF',
                        fontSize: '12px'

                    },
                    rotation: 0,
                    align: 'high',
                    offset: -10,
                    x: -9,
                    y: -15
                },
                lineColor: '#FFFFFF',
                lineWidth: 1,
                gridLineWidth: 0,
                min: minValue
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

                    borderColor: '#139fe6'
                }
            },
            series: [{
                name: '指数值',
                color: '#139fe6',
                type: 'column',
                data: columnArr,
                pointStart: startUTCTime1,
                pointInterval: 600 * 1000,

            }, {
                name: '指数值',
                color: '#FFFFFF',
                type: 'spline',
                data: dataArr,
                pointStart: startUTCTime1,
                pointInterval: 600 * 1000,

            }]
        });
    }

    function ei_5(data, startUTCTime1) {
        //startUTCTime1 = base.getUTCTime(20140621);
        //var jsonArr = [10, 9, 8, 6, 5, 3, 9, 10, 12, 14, 15, 13, 11, 10, 9, 8, 12, 14, 16, 19, 20, 20, 19, 17, 15, 14, 12, 10, 8, 10, 12, 10, 9, 8, 6, 5, 3];
        var jsonArr = data[0];
        var columnArr = jsonArr.slice(0, jsonArr.length - 5);
        var dataArr = new Array(), attention = 460, companyName = "iSoftStone";
        var minValue = jsonArr[0];
        for (var i = 0; i < jsonArr.length - 5; i++) {
            if (jsonArr[i] < minValue)
                minValue = jsonArr[i];
            var data;
            if (i % 6 == 0) {
                data = {
                    dataLabels: {
                        enabled: true,
                        align: 'center',
                        style: {
                            fontWeight: 'normal',
                            color: '#FFFFFF',
                            fontSize: '9px'
                        },
                        y: -15,
                        verticalAlign: 'middle',
                        overflow: true,
                        crop: false
                    },
                    marker: {
                        enabled: true,
                        radius: 3
                    },
                    y: jsonArr[i]
                }
            }
            else {
                data = jsonArr[i];
            }
            dataArr.push(data);
        }


        $('#ei_5').highcharts({
            chart: {
                zoomType: 'xy',
                width: tpwidth,
                height: base.getChartHeight(245),
                backgroundColor: '#639901',
                marginRight: 20,
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
                    style: {
                        color: '#FFFFFF',
                        fontSize: '12px'
                    }

                },

                dateTimeLabelFormats: {
                    hour: '%H:%M',
                },
                tickInterval: 3600 * 1000,
            },
            yAxis: {
                labels: {

                    style: {
                        color: '#FFFFFF',
                        fontSize: '12px'
                    },

                },
                title: {
                    text: '',
                    style: {
                        fontWeight: 'normal',
                        color: '#FFFFFF',
                        fontSize: '12px'

                    },
                    rotation: 0,
                    align: 'high',
                    offset: -10,
                    x: -9,
                    y: -15
                },
                lineColor: '#FFFFFF',
                lineWidth: 1,
                gridLineWidth: 0,
                min: minValue
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
                area: {
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, Highcharts.getOptions().colors[2]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[2]).setOpacity(0).get('rgba')]
                        ]
                    },
                    lineWidth: 1,
                    marker: {
                        enabled: false
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
                name: '指数',
                color: '#518809',
                //type: 'column',
                data: dataArr,
                pointStart: startUTCTime1,
                pointInterval: 600 * 1000,

            }]
        });
    }
});