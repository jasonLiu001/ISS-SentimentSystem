define(function (require, exports, modules) {
    var base = require('/showroom/Componets/base');
    //var startUTCTime1 = 0;
    var tpwidth;
    var viewModel = {
        securityWord: ko.observableArray([]),
        trafficWord: ko.observableArray([]),
        envirWord: ko.observableArray([]),
        cityWord: ko.observableArray([])
    };
    function update() {
        //加上判断如果有这个元素才继续
        if ($('#ci_0').length > 0)
            getCityManDataByUrl("/showroom/api/getcitymancomprehensive.js", ci_0);
        if ($('#ci_1').length > 0)
            getCityManDataByUrl("/showroom/api/getcitymansafetyindex.js", ci_1);
        if ($('#ci_2').length > 0)
            getCityManDataByUrl("/showroom/api/getcitymantrafficindex.js", ci_2);
        if ($('#ci_3').length > 0)
            getCityManDataByUrl("/showroom/api/getcitymanenvironmentalprotectionindex.js", ci_3);
        if ($('#ci_4').length > 0)
            getCityManDataByUrl("/showroom/api/getcitymanurbanconstructionindex.js", ci_4);
        if ($('#ci_5').length > 0)
            getCityManDataByUrl("/showroom/api/getcitymanpowercindex.js", ci_5);
        if ($('#ci_6').length > 0)
            getCityManDataByUrl("/showroom/api/getcitymanwoterindex.js", ci_6);
        $.getJSON("/showroom/api/getsecurityWord.js", function (data) {
            base.setData(viewModel.securityWord, data);
        })
        $.getJSON("/showroom/api/gettrafficWord.js", function (data) {
            base.setData(viewModel.trafficWord, data);
        })
        $.getJSON("/showroom/api/getenvirWord.js", function (data) {
            base.setData(viewModel.envirWord, data);
        })
        $.getJSON("/showroom/api/getcityWord.js", function (data) {
            base.setData(viewModel.cityWord, data);
        })
        //ci_0();
        //ci_1();        
        //ci_2();
        //ci_3();
        //ci_4();
        //ci_5();
        //ci_6();

    }
    exports.load = function (id, par, callback) {
        animationMgr.moduleCount++;
        var amt = animationMgr.register("CityInformation" + animationMgr.moduleCount);
        base.applyBind(id, '/showroom/templates/CityInformation.html', viewModel, function (view) {
            tpwidth = $(view).width();
            animationMgr.moduleCount++;
            $(view).attr("id", $(view).attr("id") + animationMgr.moduleCount);
            //翻转（激活动画&移除不需要显示的页面）
            amt.active($(view).attr("id"), par);
            //然后再更新数据
            update();


            if (callback)
                callback();
            setInterval(update, base.timeout)
        });
    };

    //获取城市综合管理指数
    function getCityManDataByUrl(url, complate) {
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
    function ci_0(datas, startUTCTime1) {
        //startUTCTime1 = base.getUTCTime(20140621);
        //var jsonArr = [10, 9, 8, 6, 5, 3, 9, 10, 12, 14, 15, 13, 11, 10, 9, 8, 12, 14, 16, 19, 20, 20, 19, 17, 15, 14, 12, 10, 8, 10, 12, 10, 9, 8, 6, 5, 3];
        var jsonArr = datas[0];
        var columnArr = jsonArr.slice(0, jsonArr.length - 5);
        var dataArr = new Array(), attention = 460, companyName = "iSoftStone";
        for (var i = 0; i < jsonArr.length - 5; i++) {
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


        $('#ci_0').highcharts({
            chart: {
                type: 'line',
                zoomType: 'xy',
                width: tpwidth,
                height: base.getChartHeight(245),
                backgroundColor: '#006a23',
                marginRight: 20,
            },
            title: {
                text: '',
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
                    },

                },
                gridLineColor: '#FFFFFF',
                gridLineWidth: 1,
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
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false
                },
            },
            series: [{
                name: '指数值',
                color: '#FFFFFF',
                type: 'spline',
                data: dataArr,
                pointStart: startUTCTime1,
                pointInterval: 600 * 1000,

            }]
        });
    }
    function ci_1(datas, startUTCTime1) {
        //startUTCTime1 = base.getUTCTime(20140621);
        //var jsonArr = [10, 9, 8, 6, 5, 3, 9, 10, 12, 14, 15, 13, 11, 10, 9, 8, 12, 14, 16, 19, 20, 20, 19, 17, 15, 14, 12, 10, 8, 10, 12, 10, 9, 8, 6, 5, 3];
        //var jsonArr = data[0];
        var jsonArr = datas[0];
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


        $('#ci_1').highcharts({
            chart: {
                zoomType: 'xy',
                width: tpwidth,
                height: base.getChartHeight(245),
                backgroundColor: '#017878',
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
    function ci_2(datas, startUTCTime1) {
        //startUTCTime1 = base.getUTCTime(20140621);
        //var jsonArr = [10, 9, 8, 6, 5, 3, 9, 10, 12, 14, 15, 13, 11, 10, 9, 8, 12, 14, 16, 19, 20, 20, 19, 17, 15, 14, 12, 10, 8, 10, 12, 10, 9, 8, 6, 5, 3];
        var jsonArr = datas[0];
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


        $('#ci_2').highcharts({
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

                    borderColor: '#0e8ccb'
                }
            },
            series: [{
                name: '指数值',
                color: '#0e8ccb',
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
    function ci_3(datas, startUTCTime1) {
        //startUTCTime1 = base.getUTCTime(20140621);
        //var jsonArr = [10, 9, 8, 6, 5, 3, 9, 10, 12, 14, 15, 13, 11, 10, 9, 8, 12, 14, 16, 19, 20, 20, 19, 17, 15, 14, 12, 10, 8, 10, 12, 10, 9, 8, 6, 5, 3];
        var jsonArr = datas[0];
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


        $('#ci_3').highcharts({
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
    function ci_4(datas, startUTCTime1) {
        //startUTCTime1 = base.getUTCTime(20140621);
        //var jsonArr = [10, 9, 8, 6, 5, 3, 9, 10, 12, 14, 15, 13, 11, 10, 9, 8, 12, 14, 16, 19, 20, 20, 19, 17, 15, 14, 12, 10, 8, 10, 12, 10, 9, 8, 6, 5, 3];
        var jsonArr = datas[0];
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


        $('#ci_4').highcharts({
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
    function ci_5(datas, startUTCTime1) {
        //startUTCTime1 = base.getUTCTime(20140621);
        //var jsonArr = [10, 9, 8, 6, 5, 3, 9, 10, 12, 14, 15, 13, 11, 10, 9, 8, 12, 14, 16, 19, 20, 20, 19, 17, 15, 14, 12, 10, 8, 10, 12, 10, 9, 8, 6, 5, 3];
        var jsonArr = datas[0];
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


        $('#ci_5').highcharts({
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
    function ci_6(datas, startUTCTime1) {
        //startUTCTime1 = base.getUTCTime(20140621);
        //var jsonArr = [10, 9, 8, 6, 5, 3, 9, 10, 12, 14, 15, 13, 11, 10, 9, 8, 12, 14, 16, 19, 20, 20, 19, 17, 15, 14, 12, 10, 8, 10, 12, 10, 9, 8, 6, 5, 3];
        var jsonArr = datas[0];
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


        $('#ci_6').highcharts({
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
});